export function setupMediaSession(video) {
  if (!('mediaSession' in navigator)) return;

  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Smart Player',
    artist: 'Vanilla JS',
  });

  navigator.mediaSession.setActionHandler('play', () => video.play());
  navigator.mediaSession.setActionHandler('pause', () => video.pause());
  navigator.mediaSession.setActionHandler('seekforward', () => {
    video.currentTime += 10;
  });
  navigator.mediaSession.setActionHandler('seekbackward', () => {
    video.currentTime -= 10;
  });
}
