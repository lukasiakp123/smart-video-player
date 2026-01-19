
export function setupAutoPiP(video) {
  if (!document.pictureInPictureEnabled) return;

  const ENTER_RATIO = 0.95;
  const EXIT_RATIO  = 0.60;
  const EXIT_DEBOUNCE_MS = 200;
  const ENTER_COOLDOWN_MS = 400;

  let armed = false;
  let needGestureForEnter = true;
  let lastRatio = 1;
  let lastIntersecting = true;
  let lastEnterAt = 0;
  let exitDebounceTimer = null;

  const now = () => performance.now();
  const canEnter = () => video.readyState >= 2 && !document.pictureInPictureElement;
  const isPiPOn = () => document.pictureInPictureElement === video;

  const clearExitDebounce = () => {
    if (exitDebounceTimer) {
      clearTimeout(exitDebounceTimer);
      exitDebounceTimer = null;
    }
  };

  video.addEventListener('play', () => {
    armed = true;
  }, { once: true });

  const observer = new IntersectionObserver(([entry]) => {
    lastRatio = entry.intersectionRatio;
    lastIntersecting = entry.isIntersecting;

    if (isPiPOn() && entry.intersectionRatio > EXIT_RATIO) {
      if (now() - lastEnterAt < ENTER_COOLDOWN_MS) return;

      clearExitDebounce();
      exitDebounceTimer = setTimeout(async () => {
        if (isPiPOn() && lastRatio > EXIT_RATIO) {
          try {
            await document.exitPictureInPicture();
            needGestureForEnter = true;
          } catch (e) {
            console.error('PiP exit error:', e);
          }
        }
      }, EXIT_DEBOUNCE_MS);
    } else {
      clearExitDebounce();
    }
  }, {
    threshold: [0, 0.01, 0.1, 0.25, 0.5, 0.6, 0.95, 0.98, 1],
    rootMargin: '0px 0px -1px 0px',
  });

  observer.observe(video);

  const tryEnterOnGesture = async () => {
    if (!armed || !needGestureForEnter) return;
    if (!canEnter()) return;

    if (lastRatio < ENTER_RATIO || !lastIntersecting) {
      try {
        await video.requestPictureInPicture();
        lastEnterAt = now();
        needGestureForEnter = false;
      } catch (e) {
        console.error('PiP enter (gesture) error:', e);
      }
    }
  };

  window.addEventListener('wheel', tryEnterOnGesture, { passive: true });
  window.addEventListener('touchmove', tryEnterOnGesture, { passive: true });
  window.addEventListener('scroll', tryEnterOnGesture, { passive: true });

  video.addEventListener('leavepictureinpicture', () => {
    needGestureForEnter = true;
    clearExitDebounce();
  });
}
