import ObsidianYoutubePlugin from 'main';
import { GoogleYoutubeResponse } from 'models/GoogleYoutubeResponse';
import { Notice, TFile } from 'obsidian';
import { convertYouTubeVideoDurationToMinutes, generateYoutubeVideoIframe, removeTags, replaceIllegalFileNameCharacters } from './utils';
import { YoutubeTranscript } from '../helpers/YoutubeTranscript';
import { GoogleYoutubeApi } from 'apis/GoogleYoutubeApi';
import { Summarizer } from 'utils/Summarizer';

export class YoutubeNote {
  googleYoutubeApi: GoogleYoutubeApi;
  summarizer: Summarizer;
  plugin: ObsidianYoutubePlugin;
  content = '';
  title = '';
  filepath: string;
  videoId: string;
  caption = '';
  summary = '';

  constructor(plugin: ObsidianYoutubePlugin, videoId: string) {
    this.plugin = plugin;
    this.googleYoutubeApi = new GoogleYoutubeApi(this.plugin.settings);
    this.summarizer = new Summarizer(this.plugin.settings);
    this.videoId = videoId;
  }

  async createNote(): Promise<TFile> {
    try {
      new Notice(`Creating note for YouTube video: ${this.videoId}`);

      const [googleYoutubeResponse, transcript] = await Promise.all([
        this.googleYoutubeApi.getVideoInfos(this.videoId),
        this.getTranscript()
      ]);

      this.caption = transcript;

      if (this.plugin.settings.summary === 'true' && this.caption && this.caption.trim() !== '') {
        this.summary = await this.getSummary();
      } 

      const template = await this.getTemplate();
      this.content = await this.fill(template, googleYoutubeResponse);
      this.title = replaceIllegalFileNameCharacters(googleYoutubeResponse.title) + ' - ' + replaceIllegalFileNameCharacters(googleYoutubeResponse.channel);

      if (!this.plugin.settings.folder) {
        throw new Error('Destination folder is not defined in settings');
      }

      const folderExists = await this.plugin.app.vault.adapter.exists(this.plugin.settings.folder);
      if (!folderExists) {
        throw new Error(`Folder does not exist: ${this.plugin.settings.folder}`);
      }

      this.filepath = `${this.plugin.settings.folder}/${this.title}.md`;

      const exists = await this.plugin.app.vault.adapter.exists(this.filepath);
      if (exists) {
        throw new Error(`Note already exists in destination folder: ${this.plugin.settings.folder}`);
      }

      const newFile = await this.plugin.app.vault.create(this.filepath, this.content);
      new Notice(`Note created: ${this.title}`);

      return newFile;
    } catch (error) {
      new Notice(`Error creating note: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private async getTemplate(): Promise<string> {
    if (!this.plugin.settings.template) {
      throw new Error('Template is not defined in settings');
    }

    return await this.plugin.app.vault.adapter.read(`${this.plugin.settings.template}.md`);
  }

  private async getTranscript(): Promise<string> {
    try {
      if (!this.videoId) {
        throw new Error('Video ID is undefined or empty');
      }

      const transcript = await YoutubeTranscript.fetchTranscript(this.videoId);

      if (!transcript || transcript.length === 0) {
        throw new Error('Processed transcript is empty');
      }

      const transcriptText = transcript.map(item => item.text).join('\n');
      return transcriptText;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      new Notice('Error fetching transcript: ' + errorMessage);
      return '';
    }
  }

  private async getSummary(): Promise<string> {
    try {
      const summary = await this.summarizer.summarize(this.caption);
      return summary;
    } catch (error) {
      new Notice(`Error generating summary: ${error instanceof Error ? error.message : String(error)}`);
      return '';
    }
  }

  private async fill(template: string, googleYoutubeResponse: GoogleYoutubeResponse): Promise<string> {
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
      '{{caption}}': this.caption,
      '{{summary}}': this.summary,
    };

    return Object.entries(variables).reduce((content, [key, value]) => 
      content.replaceAll(key, value), template);
  }
}
