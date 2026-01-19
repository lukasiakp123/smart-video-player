import { setupLazyLoad } from './core/lazyLoad.js';
import { setupAutoPiP } from './core/pip.js';
import { setupMediaSession } from './core/mediaSession.js';
import { setupSnapshot } from './snapshot.js';

const video = document.getElementById('video');
const section = document.querySelector('.video-section');

setupLazyLoad(video, section, 'video.mp4');
setupAutoPiP(video);
setupMediaSession(video);
setupSnapshot(video, document.getElementById('snapshot'));
