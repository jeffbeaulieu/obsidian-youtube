import { GoogleYoutubeApi } from 'apis/GoogleYoutubeApi';
import ObsidianYoutubePlugin from 'main';
import { GoogleYoutubeResponse } from 'models/GoogleYoutubeResponse';
import { Notice, TFile } from 'obsidian';
import { convertYouTubeVideoDurationToMinutes, generateYoutubeVideoIframe, removeTags, replaceIllegalFileNameCharacters } from './utils';

export class YoutubeNote {
  plugin: ObsidianYoutubePlugin;
  content = '';
  title = '';
  filepath: string;
  videoId: string;
  googleYoutubeApi: GoogleYoutubeApi;

  constructor(plugin: ObsidianYoutubePlugin, videoId: string) {
    this.plugin = plugin;
    this.googleYoutubeApi = new GoogleYoutubeApi(this.plugin.settings);
    this.videoId = videoId;
  }

  async createNote(): Promise<TFile> {
    const googleYoutubeResponse = await this.googleYoutubeApi.getVideoInfos(this.videoId).catch(error => {throw error;});
    this.content = await this.getTemplate().catch(error => {throw error;});   
    this.content = this.fill(googleYoutubeResponse);
    this.title = replaceIllegalFileNameCharacters(googleYoutubeResponse.title) + ' - ' + replaceIllegalFileNameCharacters(googleYoutubeResponse.channel);

    if (this.plugin.settings.folder === '') {
      throw new Error('Destination folder is not defined in settings');
    }  
    
    const folderExists = await this.plugin.app.vault.adapter.exists(this.plugin.settings.folder).catch(error => {throw error;});
    if (!folderExists) {
      throw new Error(`Folder does not exist: ${this.plugin.settings.folder}`);
    } 

    this.filepath = `${this.plugin.settings.folder}/${this.title}.md`;
        
    // Valid if note already exists
    const exists = await this.plugin.app.vault.adapter.exists(this.filepath).catch(error => {throw error;});
    if (exists) {
      throw new Error(`Note already exists in destination folder: ${this.plugin.settings.folder}`);
    }

    const newFile = this.plugin.app.vault.create(this.filepath, this.content).catch(error => {throw error;});
    new Notice(`Note created: ${this.title}`);

    return newFile;
  }

  private async getTemplate(): Promise<string> {
    if (this.plugin.settings.template === '') {
      throw new Error('Template is not defined in settings');
    }

    const template = await this.plugin.app.vault.adapter.read(`${this.plugin.settings.template}.md`);
    return template;
  }

  private fill(googleYoutubeResponse: GoogleYoutubeResponse): string {
    const variables: { [key: string]: string } = {
      '{{videoId}}': this.videoId,
      '{{title}}': googleYoutubeResponse.title,
      '{{description}}': this.plugin.settings.removeTagsFromDescription === 'true' ? removeTags(googleYoutubeResponse.description) : googleYoutubeResponse.description,
      '{{duration}}': convertYouTubeVideoDurationToMinutes(googleYoutubeResponse.duration),
      '{{videoUrl}}': `https://www.youtube.com/watch?v=${this.videoId}`,
      '{{thumbnailUrl}}': googleYoutubeResponse.thumbnailUrl,
      '{{publishedAt}}': googleYoutubeResponse.publishedAt,
      '{{embedVideo}}': generateYoutubeVideoIframe(this.videoId),
      '{{channel}}': googleYoutubeResponse.channel,
      '{{channelUrl}}': `https://www.youtube.com/channel/${googleYoutubeResponse.channelId}`,
      '{{channelThumbnailUrl}}': googleYoutubeResponse.channelThumbnailUrl,
      '{{tags}}': googleYoutubeResponse.tags,
    };
    Object.keys(variables).forEach(key => {
      this.content = this.content.replaceAll(key, variables[key]);
    });
    return this.content;
  }
}
