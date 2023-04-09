export function getVideoId(url: string): string {
  const regex = new RegExp(
    '(?:youtube(?:-nocookie)?.com/(?:[^/]+/.+/*|(?:v|e(?:mbed)?|shorts)?/|/*.*[?&]v=)|youtu.be/|^)([a-zA-Z0-9_-]{11})',
    'i',
  );
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  return '';
}

export function replaceIllegalFileNameCharacters(text: string) {
  return text.replace(/[\\,#%&{}/*<>$":@.?]/g, '').replace(/\s+/g, ' ');
}

// Function to convert duration to minutes
export function convertYouTubeVideoDurationToMinutes(duration: string): string {
  // Remove the "PT" prefix and the "S" suffix from the duration
  duration = duration.slice(2, -1);

  // Find the index of "M" in the duration to separate minutes
  const indexM = duration.indexOf("M");

  // Extract minutes and seconds from the duration
  const minutes = parseInt(duration.slice(0, indexM));
  const seconds = parseInt(duration.slice(indexM + 1));

  // Format the duration as "MM:SS"
  const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return formattedDuration;
}

// Generate iframe for YoutubeVideo in Obsidian from videoId
export function generateYoutubeVideoIframe(videoId: string): string {
  return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}
