import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupMediaSession } from '../../public/core/mediaSession.js';

describe('setupMediaSession', () => {
  let video;
  let originalMediaSession;
  let originalMediaMetadata;

  beforeEach(() => {
    video = {
      play: vi.fn(),
      pause: vi.fn(),
      currentTime: 50,
      duration: 100,
      fastSeek: vi.fn(),
    };

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    originalMediaSession = navigator.mediaSession;
    navigator.mediaSession = {
      metadata: null,
      setActionHandler: vi.fn(),
    };

    originalMediaMetadata = global.MediaMetadata;
    global.MediaMetadata = class {
      constructor(init) {
        Object.assign(this, init);
      }
    };
  });

  afterEach(() => {
    navigator.mediaSession = originalMediaSession;
    global.MediaMetadata = originalMediaMetadata;
    vi.restoreAllMocks();
  });

  it('should set mediaSession metadata and handlers', () => {
    const metadata = {
      title: 'Test Video',
      artist: 'Test Artist',
      album: 'Test Album',
      artwork: [{ src: 'cover.jpg', sizes: '640x360', type: 'image/jpeg' }]
    };

    setupMediaSession(video, metadata);

    expect(navigator.mediaSession.metadata.title).toBe('Test Video');
    expect(navigator.mediaSession.metadata.artist).toBe('Test Artist');
    expect(navigator.mediaSession.metadata.album).toBe('Test Album');
    expect(navigator.mediaSession.metadata.artwork).toEqual([{ src: 'cover.jpg', sizes: '640x360', type: 'image/jpeg' }]);

    expect(navigator.mediaSession.setActionHandler).toHaveBeenCalledTimes(6);
    expect(console.log).toHaveBeenCalledWith('✅ MediaSession handlers set up!');
  });

  it('should call video.play() on play action', () => {
    setupMediaSession(video, { title: 'a', artist: 'b' });
    const playHandler = navigator.mediaSession.setActionHandler.mock.calls.find(c => c[0] === 'play')[1];

    playHandler();
    expect(video.play).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('🎵 MediaSession action: play');
  });

  it('should call video.pause() on stop action', () => {
    setupMediaSession(video, { title: 'a', artist: 'b' });
    const stopHandler = navigator.mediaSession.setActionHandler.mock.calls.find(c => c[0] === 'stop')[1];

    stopHandler();
    expect(video.pause).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('🎵 MediaSession action: stop');
  });
});
