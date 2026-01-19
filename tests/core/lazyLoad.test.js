import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupLazyLoad } from '../../public/core/lazyLoad.js';

describe('setupLazyLoad', () => {
  let video;
  let section;
  let observerCallback;
  let originalIntersectionObserver;

  beforeEach(() => {
    video = { load: vi.fn() };
    section = {};

    originalIntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = vi.fn((cb) => {
      observerCallback = cb;
      return { observe: vi.fn(), disconnect: vi.fn() };
    });

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
    vi.restoreAllMocks();
  });

  it('should load video when section intersects', () => {
    setupLazyLoad(video, section, 'video.mp4');

    const entry = { isIntersecting: true, target: section };
    observerCallback([entry], { disconnect: vi.fn() });

    expect(video.src).toBe('video.mp4');
    expect(video.load).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('🎬 Wideo zostało załadowane (lazy load)');
  });

  it('should not load video if already loaded', () => {
    setupLazyLoad(video, section, 'video.mp4');

    const entry = { isIntersecting: true, target: section };
    observerCallback([entry], { disconnect: vi.fn() });
    observerCallback([entry], { disconnect: vi.fn() });

    expect(video.load).toHaveBeenCalledTimes(1);
  });

  it('should warn if video, section or src is missing', () => {
    setupLazyLoad(null, section, 'video.mp4');
    setupLazyLoad(video, null, 'video.mp4');
    setupLazyLoad(video, section, null);

    expect(console.warn).toHaveBeenCalledTimes(3);
  });

  it('should catch errors during video load', () => {
    video.load = vi.fn(() => { throw new Error('fail'); });
    setupLazyLoad(video, section, 'video.mp4');

    const entry = { isIntersecting: true, target: section };
    observerCallback([entry], { disconnect: vi.fn() });

    expect(console.error).toHaveBeenCalledWith('LazyLoad error:', expect.any(Error));
  });
});
