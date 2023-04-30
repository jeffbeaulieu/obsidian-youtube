# Obsidian Youtube Plugin

This plugin for [Obsidian](https://obsidian.md) allows you to import YouTube video metadata into your Obsidian notes.

## Usage

Use the command "Create new YouTube note" to open the search window, where you can enter the YouTube URL or Video ID. Plugin will then create a note from the configured template and replace variables in template with video metadata from YouTube API.

There are various settings under the plugin settings you can use to personalize your workflow, here are some important ones:

| Setting                      | Decsription                                                                                                                            |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| API Key                      | Your YouTube API Key. See [YouTube API documentation](https://developers.google.com/youtube/v3/getting-started) to request an API Key. |
| Video Notes Folder           | Folder where the video notes will be created                                                                                           |
| Video Note Template          | Template used for the note creation. See the [Templating](#templating) section for more details.                                       |
| Remove Tags From Description | Remove tags from youtube video description before inserting description variable in note                                               |

## Templating

The plugin will replace the following variables in the template:
| Variable | Description |
|:----------------|:-------------------------------------------------------------------------------------------------------------------|
| `title` | Title of the video |
| `description` | Description of the video |
| `duration` | Duration of the video |
| `videoUrl` | URL to the video |
| `videoId` | Video ID |
| `thumbnailUrl` | URL to the thumbnail image |
| `publishedAt` | Date when the video was published |
| `tags` | Tags for the video |
| `embedVideo` | Embed the video in the note |
| `channel` | Channel name for the video |
| `channelUrl` | URL to the channel |
| `channelThumbnailUrl` | URL to the channel thumbnail image |

## Installation

### Manually

-   You need Obsidian v1.0.0+ for latest version of plugin
-   Get the [Latest release of the plugin](https://github.com/jeffbeaulieu/obsidian-youtube/releases/latest)
-   Extract the files in your vault's plugins folder: `[VAULT]/.obsidian/plugins/`
-   Reload Obsidian
-   Make sure Safe Mode is off and the plugins is enabled.
