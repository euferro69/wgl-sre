export function Log(
  text: string,
  color: string = "#0ff",
  displayTime: number = 2.0
) {
  const log = document.getElementById("log-list");

  const textElem = document.createElement("div");
  textElem.className = `color: ${color}; font-size: 14px;`;
  textElem.innerHTML = text;
  log?.appendChild(textElem);
  // remove from parent
  setTimeout(() => {
    log?.removeChild(textElem);
  }, displayTime * 1000);
}

export function setFps(fps: number, frameTime: number) {
  const fpsText = document.getElementById("fps-overlay");
  fpsText
    ? (fpsText.innerHTML = `${fps} fps ${(frameTime * 1000).toFixed(1)} ms`)
    : "";
}
