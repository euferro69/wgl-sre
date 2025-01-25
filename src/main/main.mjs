import { app, BrowserWindow } from "electron";
import path from "path";
import serve from "electron-serve";

// Use import.meta.url to get the directory in ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setIcon("./src/app/favicon.ico");

  win.setThumbarButtons([
    {
      tooltip: 'button1',
      icon: "./src/app/favicon.ico",
      click () { console.log('button1 clicked') }
    }, {
      tooltip: 'button2',
      icon: "./src/app/favicon.ico",
      flags: ['enabled', 'dismissonclick'],
      click () { console.log('button2 clicked.') }
    }
  ])

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
    win.loadURL("http://localhost:7000");
    win.webContents.openDevTools();
    win.webContents.on("did-fail-load", (e, code, desc) => {
      win.webContents.reloadIgnoringCache();
    });
  }
};

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
