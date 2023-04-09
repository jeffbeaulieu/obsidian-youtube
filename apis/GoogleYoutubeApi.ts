import { requestUrl, RequestUrlResponse } from 'obsidian';
import { GoogleYoutubeResponse } from '../models/GoogleYoutubeResponse';
import { ObsidianYoutubePluginSettings } from '../settings/settings';

export class GoogleYoutubeApi {
  
  constructor(private settings: ObsidianYoutubePluginSettings) {
    this.settings = settings;
  }

  async getVideoInfos(id: string): Promise<GoogleYoutubeResponse> {
    const response = await this.getVideoInfosFromAPI(id).catch(error => {throw error;});
    return this.mapResponseToModel(response);
  }

  private async getVideoInfosFromAPI(id: string): Promise<RequestUrlResponse> {
    if (!this.settings.apiKey) {
      throw new Error('API key is empty');
    }
    return requestUrl({
      url: `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${this.settings.apiKey}&part=snippet,contentDetails,statistics,status`,
    }).catch(async error => {
      if (error.response?.status === 400 && error.response.data?.error?.errors?.[0]?.reason === 'keyInvalid') {
        throw new Error('Invalid API key');
      } else if (error.response?.status === 400 && error.response.data?.error?.errors?.[0]?.reason === 'keyNotActivated') {
        throw new Error('YouTube service not activated for API key');
      } else if (error.response?.status === 400 && error.response.data?.error?.errors?.[0]?.reason === 'keyExpired') {
        throw new Error('Expired API key');
      } else if ( error.response?.status === 400 && error.response.data?.error?.errors?.[0]?.reason === 'keyDisabled') {
        throw new Error('Disabled API key');
      } else if (error.response?.status === 403 && error.response.data?.error?.errors?.[0]?.reason === 'dailyLimitExceeded') {
        throw new Error('Daily quota exceeded for API key');
      } else if (error.response?.status === 403 && error.response.data?.error?.errors?.[0]?.reason === 'userRateLimitExceeded') {
        throw new Error('User rate limit exceeded for API key');
      } else {
        throw new Error('Failed to get video info from YouTube API');
      }
    });
  }

  private mapResponseToModel(response: RequestUrlResponse): GoogleYoutubeResponse {
    const data = response.json;
    const video = data.items[0];

    if (!response || !video?.snippet) {
      throw new Error('Video not found');
    }

    return {
      title: video.snippet.title,
      description: video.snippet.description,
      duration: video.contentDetails.duration,
      publishedAt: video.snippet.publishedAt,
      thumbnailUrl: video.snippet.thumbnails.high.url,
      channel: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
      channelThumbnailUrl: video.snippet.thumbnails.default.url,
      tags: video.snippet.tags?.join(', '),
    };
  }
}
