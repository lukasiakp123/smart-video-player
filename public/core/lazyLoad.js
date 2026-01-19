export function setupLazyLoad(video, section, src) {
  if (!video || !section) {
    console.warn('setupLazyLoad: video or section element is missing');
    return;
  }

  let loaded = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !loaded) {
        video.src = src;
        video.load();
        loaded = true;
        observer.disconnect();
      }
    },
    { rootMargin: '200px' }
  );

  observer.observe(section);
}
