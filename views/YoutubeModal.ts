import ObsidianYoutubePlugin from 'main';
import { App, ButtonComponent, Modal, Notice, Setting, TextComponent } from 'obsidian';
import { YoutubeNote } from 'utils/YoutubeNote';

export class YouTubeModal extends Modal {
  plugin: ObsidianYoutubePlugin;
  private videoIdOrUrl: string;
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
        .setPlaceholder('YouTube or TubeArchivist URL, or Video ID')
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

    new Setting(contentEl).addButton(btn => {
      return (this.okBtnRef = btn
        .setButtonText('Create Note and Add')
        .setCta()
        .onClick(() => {
          this.createYouTubeNoteAndAdd();
        }));
    });
  }

  async createYouTubeNote() {
    this.videoIdOrUrl = this.query;
    if (this.videoIdOrUrl) {
      const youtubeNote = new YoutubeNote(this.plugin, this.videoIdOrUrl);
      
      const newFile = await youtubeNote.createNote().catch(error => { throw error; });
      this.close();
      // open file
      const activeLeaf = this.app.workspace.getLeaf();
      if (activeLeaf) {
        await activeLeaf.openFile(newFile, { state: { mode: 'source' } });
        activeLeaf.setEphemeralState({ rename: 'all' });
      }
      
    } else {
      throw new Error('Invalid YouTube or TubeArchivist URL, or Video ID');
    }
  }

  async createYouTubeNoteAndAdd() {
    this.videoIdOrUrl = this.query;
    if (this.videoIdOrUrl) {
      try {
        await this.createYouTubeNote();
        this.query = "";
        this.open();
      }
      catch (error) {
        new Notice(error.message);
      }
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
