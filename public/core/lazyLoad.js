export function setupLazyLoad(video, section, src) {
  if (!video || !section || !src) {
    console.warn('setupLazyLoad: brak wymaganego elementu video, section lub src');
    return;
  }

  let loaded = false;

  const observer = new IntersectionObserver(
    ([entry], obs) => {
      if (entry.isIntersecting && !loaded) {
        try {
          video.src = src;
          video.load();
          loaded = true;
          console.log('🎬 Wideo zostało załadowane (lazy load)');
          obs.disconnect();
        } catch (err) {
          console.error('LazyLoad error:', err);
        }
      }
    },
     { rootMargin: '200px 0px 200px 0px' } 
  );

  try {
    observer.observe(section);
  } catch (err) {
    console.error('LazyLoad observe error:', err);
  }
}
