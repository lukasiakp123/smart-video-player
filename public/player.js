import { setupAutoPiP } from './core/pip.js';
import { setupLazyLoad } from './core/lazyLoad.js';
import { setupMediaSession } from './core/mediaSession.js';
import { takeSnapshot } from './core/snapshot.js';

const video = document.getElementById('video');
const videoSection = document.getElementById('video-section');
const pipButton = document.getElementById('start-pip');
const snapshotButton = document.getElementById('snapshot');

// --- Lazy Load ---
setupLazyLoad(video, videoSection, './assets/sample-video.mp4');

// --- Media Session ---
setupMediaSession(video, {
  title: 'Sample Video',
  artist: 'Smart Player',
  artwork: [{ src: './assets/sample-video-poster.jpg', sizes: '640x360', type: 'image/jpeg' }]
});

// --- Auto PiP ---
setupAutoPiP(video, pipButton);

// --- Snapshot ---
snapshotButton.addEventListener('click', () => {
  const blob = takeSnapshot(video);
  if (blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'snapshot.webp';
    a.click();
    URL.revokeObjectURL(url);
  }
});
