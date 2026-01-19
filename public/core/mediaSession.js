export function setupMediaSession(video, metadata) {
  if (!('mediaSession' in navigator)) {
    console.warn('⚠️ Media Session API not supported in this browser');
    return;
  }

  navigator.mediaSession.metadata = new MediaMetadata({
    title: metadata.title,
    artist: metadata.artist,
    album: metadata.album || '',
    artwork: metadata.artwork || []
  });

  navigator.mediaSession.setActionHandler('play', () => {
    console.log('🎵 MediaSession action: play');
    video.play();
  });

  navigator.mediaSession.setActionHandler('pause', () => {
    console.log('🎵 MediaSession action: pause');
    video.pause();
  });

  navigator.mediaSession.setActionHandler('seekbackward', (details) => {
    const offset = details.seekOffset || 10;
    console.log(`🎵 MediaSession action: seekbackward (${offset}s)`);
    video.currentTime = Math.max(0, video.currentTime - offset);
  });

  navigator.mediaSession.setActionHandler('seekforward', (details) => {
    const offset = details.seekOffset || 10;
    console.log(`🎵 MediaSession action: seekforward (${offset}s)`);
    video.currentTime = Math.min(video.duration, video.currentTime + offset);
  });

  navigator.mediaSession.setActionHandler('seekto', (details) => {
    console.log(`🎵 MediaSession action: seekto (${details.seekTime}s, fastSeek: ${details.fastSeek})`);
    if (details.fastSeek && 'fastSeek' in video) {
      video.fastSeek(details.seekTime);
      return;
    }
    video.currentTime = details.seekTime;
  });

  navigator.mediaSession.setActionHandler('stop', () => {
    console.log('🎵 MediaSession action: stop');
    video.pause();
  });

  console.log('✅ MediaSession handlers set up!');
}
