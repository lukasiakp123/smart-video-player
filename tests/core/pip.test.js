import { describe, it, expect, beforeAll, vi } from 'vitest';
import { setupAutoPiP } from '../../src/core/pip.js';

describe('Auto PiP', () => {
  beforeAll(() => {
    // Mock IntersectionObserver jako konstruktor
    global.IntersectionObserver = class {
      constructor(cb) {
        this.cb = cb;
      }
      observe() {
        this.cb([{ isIntersecting: false }]);
      }
      disconnect() {}
    };

    // Mock PiP properties
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      value: true,
      writable: true,
    });

    Object.defineProperty(document, 'pictureInPictureElement', {
      value: null,
      writable: true,
    });

    HTMLVideoElement.prototype.requestPictureInPicture = vi.fn();
    document.exitPictureInPicture = vi.fn();
  });

  it('should request PiP when video leaves viewport', async () => {
    const video = document.createElement('video');

    Object.defineProperty(video, 'readyState', {
      get: () => 3,
      configurable: true,
    });

    await setupAutoPiP(video);

    expect(video.requestPictureInPicture).toHaveBeenCalled();
  });
});
