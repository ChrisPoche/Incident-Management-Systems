const { app, BrowserWindow, shell, webContents, ipcMain } = require('electron')
const contextMenu = require('electron-context-menu');
const path = require('path');
const fs = require('fs');


let win;

function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 740,
    // alwaysOnTop: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      spellcheck: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.webContents.on('will-navigate', handleRedirect)
  win.webContents.setWindowOpenHandler('new-window', handleRedirect)
  win.webContents.session.on('will-download', (event, item, webContents) => {
    console.log('attempting to download');
    item.setSavePath(app.getPath("desktop") + "/" + item.getFilename() + ".eml");

    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })

    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })

  win.loadFile('./src/index.html');

  win.on('closed', () => {
    win = null;
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const handleRedirect = (e, url) => {
  if (url !== e.sender.getURL()) {
    e.preventDefault();
    shell.openExternal(url);
  }
}

contextMenu({});

ipcMain.on('toMain', (event, arg) => {
  let writeStream = fs.createWriteStream('template.eml','utf8');
  writeStream.write(arg);
  let res = 'write complete';
  writeStream.on('error', (err) => {
    res = err;
  })
  event.reply('fromMain', res);
  writeStream.end();
})