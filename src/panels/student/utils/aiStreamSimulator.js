export const streamText = (fullText, onChunk, onDone, opts = {}) => {
  const { msPerWord = 40 } = opts;
  const words = String(fullText || '').split(/\s+/).filter(Boolean);
  let idx = 0;

  const timer = setInterval(() => {
    if (idx >= words.length) {
      clearInterval(timer);
      onDone?.();
      return;
    }
    const next = words.slice(0, idx + 1).join(' ');
    onChunk?.(next);
    idx += 1;
  }, msPerWord);

  return () => clearInterval(timer);
};

