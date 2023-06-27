const html = document.querySelector('html');
function updateFontSize(basicDiagonal) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const diagonal = Math.sqrt(width * width + height * height);
  const ratio = diagonal / basicDiagonal;
  html.style.setProperty('font-size', `${10 * ratio}px`);
}
export const keepHtmlFontSize = (basicWidthPx, basicHeightPx) => {
  const basicDiagonal = Math.sqrt(
    basicWidthPx * basicWidthPx + basicHeightPx * basicHeightPx
  );
  updateFontSize(basicDiagonal);
  const onResize = () => updateFontSize(basicDiagonal);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
};
