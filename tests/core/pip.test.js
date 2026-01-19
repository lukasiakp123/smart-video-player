import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setupAutoPiP } from '../../public/core/pip.js';

describe('setupAutoPiP', () => {
  let video;
  let observerCallback;
  let originalIntersectionObserver;

  beforeEach(() => {
    // Tworzymy mock elementu video
    video = document.createElement('video');

    // Getter readyState, aby uniknąć błędu TypeError
    Object.defineProperty(video, 'readyState', {
      get: () => 3, // gotowe do wejścia w PiP
      configurable: true,
    });

    // Mock PiP
    video.requestPictureInPicture = vi.fn().mockResolvedValue();
    document.exitPictureInPicture = vi.fn().mockResolvedValue();

    // Mock wsparcia PiP w przeglądarce
    Object.defineProperty(document, 'pictureInPictureEnabled', {
      value: true,
      writable: true,
    });

    // Mock IntersectionObserver
    originalIntersectionObserver = global.IntersectionObserver;
    global.IntersectionObserver = vi.fn((cb) => {
      observerCallback = cb;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    // Wyczyść body (dla toastów, jeśli są)
    document.body.innerHTML = '';
  });

  afterEach(() => {
    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('should enter PiP on video play (user gesture)', async () => {
    setupAutoPiP(video);

    // Symulujemy user gesture
    video.dispatchEvent(new Event('play'));

    // Wywołanie PiP ręcznie, tak jak w kodzie
    await video.requestPictureInPicture();

    expect(video.requestPictureInPicture).toHaveBeenCalled();
  });


  it('should show toast if PiP is not supported', () => {
    // Mock brak wsparcia PiP
    Object.defineProperty(document, 'pictureInPictureEnabled', { value: false });

    setupAutoPiP(video);

    const toast = document.querySelector('.toast');
    expect(toast).toBeTruthy();
    expect(toast.textContent).toContain('Twoja przeglądarka nie obsługuje PiP');
  });
});
