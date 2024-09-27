import { Configuration, OpenAIApi } from 'openai';
import axios, { AxiosRequestConfig } from 'axios';

export class OpenAIAPI {
  private openai: OpenAIApi;
  private temperature = 0.3;
  private max_tokens = 600;
  private top_p = 1;
  private frequency_penalty = 0;
  private presence_penalty = 1;
  private model: string;
  private base_path: string;
  
  constructor(base_path: string, apiKey: string, model: string) {
    this.base_path = base_path;
    this.model = model;
    this.openai = new OpenAIApi(new Configuration({ basePath: base_path, apiKey: apiKey }));
  }

  async createChatCompletion(prompt: string, text: string): Promise<string> {
    const response = await this.openai.createChatCompletion({
      model: this.model,
      messages: [{ "role": "system", "content": prompt }, { "role": "user", "content": text }],
      temperature: this.temperature,
      max_tokens: this.max_tokens,
      top_p: this.top_p,
      frequency_penalty: this.frequency_penalty,
      presence_penalty: this.presence_penalty,
    });

    return response?.data?.choices[0]?.message?.content?.trim() || '';
  }

  async createChatCompletionWithExtendedTimeout(prompt: string, text: string): Promise<string> {
    const url = this.base_path + '/completions';
    const data = {
      model: this.model,
      messages: [{ "role": "system", "content": prompt }, { "role": "user", "content": text }],
      temperature: this.temperature,
      max_tokens: this.max_tokens,
      top_p: this.top_p,
      frequency_penalty: this.frequency_penalty,
      presence_penalty: this.presence_penalty,
      stop: '\n',
    };
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    const options: AxiosRequestConfig = {
      timeout: 120000, // 120 secondes
    };
    
    const response = await axios.post(url, data, { headers, ...options });
    
    return response.data.choices[0].text;
    //return response?.data?.choices[0]?.message?.content?.trim() || '';
  }
}