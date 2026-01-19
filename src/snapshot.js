export function setupSnapshot(video, button) {
  button.addEventListener('click', () => {
    if (video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'snapshot.webp';
      a.click();
    }, 'image/webp');
  });
}
