import { ObsidianYoutubePluginSettings } from 'settings/settings';
import { OpenAIAPI } from 'apis/OpenAIApi';

export class Summarizer {
  token_limit: number;
  openai_api: OpenAIAPI;
  max_tokens: number;

  constructor(private settings: ObsidianYoutubePluginSettings) {
    this.settings = settings;
    this.openai_api = new OpenAIAPI(this.settings.openaiBasePath, this.settings.openAIAPIKey, this.settings.openAIModel);
  }

  public async summarize(text: string): Promise<string> {
    const summary = await this.openai_api.createChatCompletion(this.settings.summaryPrompt, text);
    return summary;
  }
}
