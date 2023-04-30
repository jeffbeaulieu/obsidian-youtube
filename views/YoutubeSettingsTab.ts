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
      .setName('API Key')
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

  }
}
