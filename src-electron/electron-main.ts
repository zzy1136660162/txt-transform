import { app,Menu, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url'
import {enable} from "@electron/remote/main/index.js";
import fs from 'fs'
import readline from 'readline'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform();


const currentDir = fileURLToPath(new URL('.', import.meta.url));

let mainWindow: BrowserWindow | undefined;

function registerHandlers () {
  ipcMain.handle('select-input-file', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openFile'],
      filters: [{ name: 'Text Files', extensions: ['txt'] }]
    })
    return canceled ? null : filePaths[0]
  })

  ipcMain.handle('select-output-dir', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
      properties: ['openDirectory']
    })
    return canceled ? null : filePaths[0]
  })

  ipcMain.handle('transform-file', async (_event, { inputPath, outputDir }) => {
    const outName =
      path.parse(inputPath).name + '_transform' + Date.now() + '.txt'
    const outPath = path.join(outputDir, outName)

    const original: Array<{ item83: string; item84: string }> = []
    const transformed: Array<{ item83: string; item84: string }> = []

    const rl = readline.createInterface({
      input: fs.createReadStream(inputPath),
      crlfDelay: Infinity
    })
    const outputStream = fs.createWriteStream(outPath, { encoding: 'utf8' })

    let count = 0
    rl.on('line', line => {
      if (!line.includes('|') || line.trim().length === 0) {
        outputStream.write(line + '\n')
        return
      }
      const items = line.split('|')
      if (items.length < 84) {
        outputStream.write(line + '\n')
        return
      }
      let item83 = items[82] || ''
      let item84 = items[83] || ''
      const len83 = item83.length
      const len84 = item84.length
      const orig83 = item83
      const orig84 = item84
      if (len83 < len84) {
        item83 = item83 + '#'.repeat(len84 - len83)
      } else if (len84 < len83) {
        item84 = item84 + '#'.repeat(len83 - len84)
      }
      items[82] = item83
      items[83] = item84
      if (count < 2) {
        original.push({ item83: orig83, item84: orig84 })
        transformed.push({ item83, item84 })
      }
      count += 1
      outputStream.write(items.join('|') + '\n')
    })

    return new Promise(resolve => {
      rl.on('close', () => {
        outputStream.end()
        resolve({ outPath, original, transformed })
      })
    })
  })
}

async function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(currentDir, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      sandbox: false, // <-- to be able to import @electron/remote in preload script
      contextIsolation: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(
        currentDir,
        path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
      ),
    },
  });
  enable(mainWindow.webContents) // <-- add this

  registerHandlers()

  if (process.env.DEV) {
    await mainWindow.loadURL(process.env.APP_URL);
  } else {
    await mainWindow.loadFile('index.html');
  }

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow?.webContents.closeDevTools();
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = undefined;
  });
  // =========== 只保留「设置 → 退出」=============
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: '设置',
      submenu: [
        {
          label: '退出',
          // role: 'quit' 会在不同平台自动映射到正确的快捷键
          role: 'quit'            // macOS ⌘Q / Windows & Linux Ctrl+Q
          // 如果想自己处理：
          // click: () => { app.quit(); }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);   // ← 覆盖默认菜单
  // ============================================
}

void app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === undefined) {
    void createWindow();
  }
});
