export interface ObsidianYoutubePluginSettings {
  summary: string;
  folder: string;
  template: string;
  apiKey: string;
  removeTagsFromDescription: string;
  openAIAPIKey: string;
  openaiBasePath: string;
  openAIModel: string;
  summaryPrompt: string;
  tubeArchivistBaseUrl: string;
  useYt2doc: boolean;
  yt2docBaseUrl: string;
}

export const DEFAULT_SETTINGS: ObsidianYoutubePluginSettings = {
  apiKey: '',
  folder: '',
  template: '',
  removeTagsFromDescription: '',
  openAIAPIKey: '',
  summary: '',
  openaiBasePath: '',
  openAIModel: 'gpt-4o',
  summaryPrompt: "You are ChatGPT, a large language model trained by OpenAI. Follow the user's instructions carefully. Respond using markdown. Summarize the following capture from a youtube video, extractiong  ideas, strategies, and thinking from this video transcript: \n\n",
  tubeArchivistBaseUrl: '',
  useYt2doc: false,
  yt2docBaseUrl: '',
};
