export function setupLazyLoad(video, section, src) {
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
