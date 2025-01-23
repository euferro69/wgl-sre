export function Log(
  text: string,
  color: string = "#fff",
  displayTime: number = 2.0,
  appendEndOnOverlay: boolean = false,
  showOnLogOverlay: boolean = true,
) {
  // Log elements
  const logOverlay = document.getElementById("log-overlay");
  const engineConsole = document.getElementById("engine-console");
  
  const textElem = document.createElement("div");
  textElem.style.color = color;
  textElem.innerHTML = text;
  const textElem2 = document.createElement("div");
  textElem2.style.color = color;
  textElem2.innerHTML = text;

  if (showOnLogOverlay) {
    if (appendEndOnOverlay) {
      logOverlay?.appendChild(textElem);
    } else {
      logOverlay?.prepend(textElem);
    }
  }
  // Add to console
  engineConsole?.appendChild(textElem2);
  if (engineConsole) {
    if (engineConsole.childElementCount > 300) {
      engineConsole.removeChild(engineConsole.firstChild as ChildNode)
    }
  }

  // remove from parent
  setTimeout(() => {
    logOverlay?.removeChild(textElem);
  }, displayTime * 1000);
}

export function setFps(fps: number, frameTime: number) {
  const fpsText = document.getElementById("fps-overlay");
  fpsText
    ? (fpsText.innerHTML = `${fps} fps ${(frameTime * 1000).toFixed(1)} ms`)
    : "";
}
