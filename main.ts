import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, ObsidianYoutubePluginSettings } from 'settings/settings';
import { YouTubeModal } from 'views/YoutubeModal';
import { YouTubeSettingTab } from 'views/YoutubeSettingsTab';

export default class ObsidianYoutubePlugin extends Plugin {
  settings: ObsidianYoutubePluginSettings;

  async onload() {
    
    await this.loadSettings();

    // This adds a simple command that can be triggered anywhere
    this.addCommand({
      id: 'open-youtube-modal',
      name: 'Create new YouTube note',
      callback: () => this.createNewYouTubeNote(),
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new YouTubeSettingTab(this.app, this));
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async createNewYouTubeNote() {
    const modal = new YouTubeModal(this.app, this);
    modal.open();
  }
}
