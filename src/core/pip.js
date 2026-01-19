export function setupAutoPiP(video) {
  if (!document.pictureInPictureEnabled) return;

  const observer = new IntersectionObserver(
    async ([entry]) => {
      try {
        if (!entry.isIntersecting && video.readyState >= 2) {
          if (document.pictureInPictureElement !== video) {
            await video.requestPictureInPicture();
          }
        }

        if (entry.isIntersecting && document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        }
      } catch {
        /* graceful fallback */
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(video);
}
