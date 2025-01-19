import ObsidianYoutubePlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class YouTubeSettingTab extends PluginSettingTab {
  plugin: ObsidianYoutubePlugin;

  constructor(app: App, plugin: ObsidianYoutubePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'General Settings' });

    new Setting(containerEl)
      .setName('Youtube API Key')
      .setDesc('Your YouTube API Key')
      .addText(text =>
        text
          .setPlaceholder('Your API Key')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async value => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Video Notes Folder')
      .setDesc('Folder where the video notes will be created')
      .addText(text =>
        text
          .setPlaceholder('Video Notes Folder')
          .setValue(this.plugin.settings.folder)
          .onChange(async value => {
            this.plugin.settings.folder = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Template')
      .setDesc('Template for the note')
      .addText(text =>
        text
          .setPlaceholder('Template')
          .setValue(this.plugin.settings.template)
          .onChange(async value => {
            this.plugin.settings.template = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Remove Tags From Description')
      .setDesc('Remove tags from youtube video description before inserting description variable in note')    
      .addToggle(async (toggle) => {
        toggle
          .setValue(this.plugin.settings.removeTagsFromDescription === 'true')
          .onChange(async (value) => {
            this.plugin.settings.removeTagsFromDescription = String(value);
            await this.plugin.saveSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName('TubeArchivist Base URL')
      .setDesc('Base URL for your TubeArchivist instance (e.g., http://localhost:8000)')
      .addText(text =>
        text
          .setPlaceholder('TubeArchivist Base URL')
          .setValue(this.plugin.settings.tubeArchivistBaseUrl)
          .onChange(async value => {
            this.plugin.settings.tubeArchivistBaseUrl = value.replace(/\/+$/, "");
            await this.plugin.saveSettings();
          }),
      );

    containerEl.createEl('h2', { text: 'AI Settings' });

    new Setting(containerEl)
      .setName('OpenAI API Key')
      .setDesc('Your OpenAI API Key')
      .addText(text =>
        text
          .setPlaceholder('Your OpenAI API Key')
          .setValue(this.plugin.settings.openAIAPIKey)
          .onChange(async value => {
            this.plugin.settings.openAIAPIKey = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('OpenAI Base Path')
      .setDesc('OpenAI Base path')
      .addText(text =>
        text
          .setPlaceholder('Your Open-ai Base path')
          .setValue(this.plugin.settings.openaiBasePath || 'https://api.openai.com/v1')
          .onChange(async value => {
            this.plugin.settings.openaiBasePath = value.replace(/\/+$/, "");
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('OpenAI Model')
      .setDesc('Model to use for OpenAI API')
      .addText(text =>
        text
          .setPlaceholder('gpt-4o')
          .setValue(this.plugin.settings.openAIModel)
          .onChange(async value => {
            this.plugin.settings.openAIModel = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName('Get Caption Summary from OpenAI API')
      .setDesc('Add a caption summary to the video note')    
      .addToggle(async (toggle) => {
        toggle
          .setValue(this.plugin.settings.summary === 'true')
          .onChange(async (value) => {
            this.plugin.settings.summary = String(value);
            await this.plugin.saveSettings();
            this.display();
          });
      });

    new Setting(containerEl)
      .setName('Summary Prompt')
      .setDesc('Prompt used for generating the summary')
      .addTextArea(text =>
        text
          .setPlaceholder('Enter your summary prompt')
          .setValue(this.plugin.settings.summaryPrompt)
          .onChange(async value => {
            this.plugin.settings.summaryPrompt = value;
            await this.plugin.saveSettings();
          })
      );

    containerEl.createEl('h2', { text: 'yt2doc Settings' });

    new Setting(containerEl)
      .setName('Use yt2doc')
      .setDesc('Enable the use of yt2doc for caption retrieval')
      .addToggle(toggle =>
        toggle
          .setValue(this.plugin.settings.useYt2doc)
          .onChange(async (value) => {
            this.plugin.settings.useYt2doc = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('yt2doc Base URL')
      .setDesc('Base URL for the yt2doc API (e.g., http://yt2doc-api.example.com)')
      .addText(text =>
        text
          .setPlaceholder('yt2doc Base URL')
          .setValue(this.plugin.settings.yt2docBaseUrl)
          .onChange(async value => {
            this.plugin.settings.yt2docBaseUrl = value.replace(/\/+$/, "");
            await this.plugin.saveSettings();
          }),
      );
  }
}
