import ObsidianYoutubePlugin from 'main';
import { App, ButtonComponent, Modal, Notice, Setting, TextComponent } from 'obsidian';
import { getVideoId } from 'utils/utils';
import { YoutubeNote } from 'utils/YoutubeNote';

export class YouTubeModal extends Modal {
  plugin: ObsidianYoutubePlugin;
  private videoId: string;
  query: string;
  private okBtnRef?: ButtonComponent;

  constructor(app: App, plugin: ObsidianYoutubePlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Youtube Video' });

    contentEl.createDiv({ cls: 'youtube-plugin__search-modal--input' }, settingItem => {
      new TextComponent(settingItem)
        .setValue(this.query)
        .setPlaceholder('Video URL or ID')
        .onChange(value => (this.query = value))
        .inputEl.addEventListener('keydown', this.submitEnterCallback.bind(this));
    });

    new Setting(contentEl).addButton(btn => {
      return (this.okBtnRef = btn
        .setButtonText('Create Note')
        .setCta()
        .onClick(() => {
          this.createYouTubeNote();
        }));
    });
  }

  async createYouTubeNote() {
    this.videoId = getVideoId(this.query);
    if (this.videoId) {
      const youtubeNote = new YoutubeNote(this.plugin, this.videoId);
      
      try {
        const newFile = await youtubeNote.createNote().catch(error => { throw error; });
        this.close();
        // open file
        const activeLeaf = this.app.workspace.getLeaf();
        if (activeLeaf) {
          await activeLeaf.openFile(newFile, { state: { mode: 'source' } });
          activeLeaf.setEphemeralState({ rename: 'all' });
        }
      }
      catch (error) {
        new Notice(error.message);
      }
      
    } else {
      new Notice('Invalid YouTube URL or ID');
    }
  }

  submitEnterCallback(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.isComposing) {
      this.createYouTubeNote();
    }
  }

  onClose() {
    this.contentEl.empty();
  }
}
