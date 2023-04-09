export interface ObsidianYoutubePluginSettings {
  folder: string;
  template: string;
  apiKey: string;
}

export const DEFAULT_SETTINGS: ObsidianYoutubePluginSettings = {
  apiKey: '',
  folder: '',
  template: '',
};
