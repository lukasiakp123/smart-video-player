export function setupMediaSession(video, metadata) {
  if ('mediaSession' in navigator) {
    console.log('✅ setupMediaSession');
    navigator.mediaSession.metadata = new MediaMetadata(metadata);

    navigator.mediaSession.setActionHandler('play', () => video.play());
    navigator.mediaSession.setActionHandler('pause', () => video.pause());
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
      video.currentTime = Math.max(0, video.currentTime - (details.seekOffset || 10));
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
      video.currentTime = Math.min(video.duration, video.currentTime + (details.seekOffset || 10));
    });
  }
}
