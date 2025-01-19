# Obsidian Youtube Plugin

This plugin for [Obsidian](https://obsidian.md) allows you to import YouTube video metadata into your Obsidian notes. It now also supports integration with TubeArchivist and yt2doc for caption retrieval.

## Usage

Use the command "Create new YouTube note" to open the search window, where you can enter the YouTube URL, Video ID, or TubeArchivist URL. The plugin will then create a note from the configured template and replace variables in the template with video metadata from the YouTube API, TubeArchivist, or yt2doc.

There are various settings under the plugin settings you can use to personalize your workflow, here are some important ones:

| Setting                      | Description                                                                                                                            |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| API Key                      | Your YouTube API Key. See [YouTube API documentation](https://developers.google.com/youtube/v3/getting-started) to request an API Key. |
| Video Notes Folder           | Folder where the video notes will be created                                                                                           |
| Video Note Template          | Template used for the note creation. See the [Templating](#templating) section for more details.                                       |
| Remove Tags From Description | Remove tags from youtube video description before inserting description variable in note                                               |
| TubeArchivist Base URL       | Base URL for your TubeArchivist instance (e.g., http://localhost:8000)                                                                 |
| Use yt2doc                   | Enable the use of yt2doc for caption retrieval                                                                                         |
| yt2doc Base URL              | Base URL for the yt2doc API (e.g., http://yt2doc-api.example.com)                                                                      |

## Templating

The plugin will replace the following variables in the template:
| Variable | Description |
|:----------------|:-------------------------------------------------------------------------------------------------------------------|
| `title` | Title of the video |
| `description` | Description of the video |
| `duration` | Duration of the video |
| `videoUrl` | URL to the video on YouTube |
| `tubearchivistUrl` | URL to the video on TubeArchivist (if TubeArchivist Base URL is set) |
| `videoId` | Video ID |
| `thumbnailUrl` | URL to the thumbnail image |
| `publishedAt` | Date when the video was published |
| `tags` | Tags for the video |
| `embedVideo` | Embed the video in the note |
| `channel` | Channel name for the video |
| `channelUrl` | URL to the channel |
| `channelThumbnailUrl` | URL to the channel thumbnail image |
| `caption` | Caption for the video |
| `summary` | Summary for the video |

## Installation

### Manually

-   You need Obsidian v1.0.0+ for latest version of plugin
-   Get the [Latest release of the plugin](https://github.com/jeffbeaulieu/obsidian-youtube/releases/latest)
-   Extract the files in your vault's plugins folder: `[VAULT]/.obsidian/plugins/`
-   Reload Obsidian
-   Make sure Safe Mode is off and the plugins is enabled.

## TubeArchivist Integration

This plugin now supports integration with TubeArchivist. To use this feature:

1. Set up your TubeArchivist instance and make note of its base URL.
2. In the plugin settings, enter your TubeArchivist Base URL.
3. When creating a new note, you can now use either a YouTube URL/ID or a TubeArchivist URL.
4. The `{{tubearchivistUrl}}` variable in your template will be replaced with the TubeArchivist URL for the video if available.

This integration allows you to easily link your Obsidian notes to your TubeArchivist archive, providing a seamless workflow for managing your video notes and archives.

## yt2doc Integration

This plugin now supports integration with yt2doc for caption retrieval. To use this feature:

1. Set up your yt2doc API and make note of its base URL.
2. In the plugin settings, enable the "Use yt2doc" option and enter your yt2doc Base URL.
3. When creating a new note, the plugin will use the yt2doc API to retrieve captions if the option is enabled.

This integration allows you to enhance your video notes with accurate captions retrieved directly from the yt2doc API.
