import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { takeSnapshot } from '../../public/core/snapshot.js';

describe('takeSnapshot', () => {
  let video;
  let mockCanvas;
  let mockCtx;
  let originalCreateElement;

  beforeEach(() => {
    // Mock element video
    mockCtx = {
      drawImage: vi.fn(),
    };
    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn(() => 'data:image/webp;base64,AAA'),
    };

    // Zachowujemy oryginalne createElement
    originalCreateElement = document.createElement.bind(document);

    // Mock document.createElement tylko dla canvas
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas;
      return originalCreateElement(tag);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a Blob for ready video', () => {
    // Tworzymy prawdziwy element video
    video = document.createElement('video');
    Object.defineProperty(video, 'readyState', { get: () => 3 });
    Object.defineProperty(video, 'videoWidth', { get: () => 640 });
    Object.defineProperty(video, 'videoHeight', { get: () => 360 });

    const blob = takeSnapshot(video);
    expect(blob).toBeInstanceOf(Blob);
    expect(mockCtx.drawImage).toHaveBeenCalledWith(video, 0, 0, 640, 360);
  });

  it('should return null if video is not ready', () => {
    video = {
      readyState: 0,
      videoWidth: 640,
      videoHeight: 360,
    };
    Object.setPrototypeOf(video, HTMLVideoElement.prototype);

    const blob = takeSnapshot(video);
    expect(blob).toBeNull();
  });

  it('should return null and log error if something throws', () => {
    video = {
      readyState: 3,
      videoWidth: 640,
      videoHeight: 360,
    };
    Object.setPrototypeOf(video, HTMLVideoElement.prototype);

    mockCanvas.getContext = vi.fn(() => { throw new Error('fail'); });

    const blob = takeSnapshot(video);
    expect(blob).toBeNull();
  });
});
