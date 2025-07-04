import { app, BrowserWindow, ipcMain, screen } from 'electron'
import path from 'path'
import url from 'url'
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { ansHandler } from './ipchandlers/ansHandler.js'
import registerShortcuts from './moveWindow.js'
import { globalShortcut } from "electron";
import setShortcut from './shortcuts.js';
import Store from 'electron-store';

// 👇 simulate __dirname in ES module
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const width = 450
const gap = 45
const store = new Store();

let mainWin;
let settingWin;
const createWindow = () => {
  mainWin = new BrowserWindow({
    width: width,
    height: 35,
    maxHeight: 35,
    transparent: true,
    frame: false,
    resizable: true,
    acceptFirstMouse: false,
    hasShadow: false,
    webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration:true,
    }
  })
  // mainWin.webContents.openDevTools();
  mainWin.loadFile(path.join(__dirname, 'mainBarUi/mainbar.html'))
  mainWin.setAlwaysOnTop(true,'screen-saver')
  mainWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  mainWin.setContentProtection(true)


  mainWin.once('ready-to-show',()=>{
    const {width, height} = screen.getPrimaryDisplay().workAreaSize
    const side = Math.floor(width/2 - 150)
    mainWin.setPosition(side,200)
  })

  const store = new Store()
  ipcMain.on('share-apikey', (event,key) => {
    store.set('gemini.key', key);
  })

  ipcMain.handle('get-api-key', ()=>{
    return store.get('gemini.key')
  })

  
  setShortcut('CommandOrControl+Enter',()=>{
    if (win && !win.isDestroyed()){
      win.destroy()
    }
  },ansWindow,()=>ansHandler(store.get('gemini.key'))) //Ask ai for question


  ipcMain.on('ans-btn',()=>{
    ()=>ansHandler(store.get('gemini.key'))
    if (win && !win.isDestroyed()){
      win.destroy()
    }
    ansWindow()
  })

  setShortcut('CommandOrControl+O',()=>{
    if (settingWin && !settingWin.isDestroyed()){
      settingWin.destroy()
    }
    else{
      createSettingWin()
    }
  })

  ipcMain.on('setting-btn',()=>{
    if (settingWin && !settingWin.isDestroyed()){
      settingWin.destroy()
    }
    else{
      createSettingWin()
    }
  })


  setShortcut('CommandOrControl+/',()=>{ //Toggle visibility
    if (mainWin.isVisible()){
      mainWin.hide()
      try{win.hide()
      }catch{}
      try{
        settingWin.hide()
      }catch{}
    }
    else{
      mainWin.show()
      try{win.show()
      }catch{}
      try{
        settingWin.show()
      }catch{}
    }
  })
  registerShortcuts(mainWin)
}
let win;
const ansWindow =async()=>{
  win = new BrowserWindow({
    width: 700,
    height: 300,
    maxHeight: 600,
    transparent: true,
    frame: false,
    resizable: true,
    acceptFirstMouse: false,
    hasShadow: false,
    webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration:true,
    }
  })

  // win.loadURL('http://localhost:5173/#/answer')
  const answerFile = path.join(__dirname, 'dist', 'index.html');
  win.loadFile(answerFile, { hash: '/answer' });
  
  const [mainX, mainY] = mainWin.getPosition();
  win.setPosition(mainX, mainY + gap)
  win.setContentProtection(true)
  win.setAlwaysOnTop(true,'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  
  mainWin.on('move', () => {
      const [mainX, mainY] = mainWin.getPosition();
      win.setPosition(mainX, mainY + gap);
  });


  win.on('ready-to-show',()=>{
    const [mainX, mainY] = mainWin.getPosition();
    win.setPosition(mainX, mainY + gap)
  })

  ipcMain.on('change-height',(event,height)=>{
    let [width] = win.getSize()
    win.setSize(width, height)
  })

  let clickable = false
  setShortcut('CommandOrControl+V',()=>{
    win.setIgnoreMouseEvents(!clickable)
    clickable = !clickable
  })

  setShortcut('CommandOrControl+Shift+I',()=>{
    win.webContents.openDevTools()
  })
}

const createSettingWin = ()=>{
  settingWin = new BrowserWindow({
    width: width,
    height: 300,
    maxHeight: 600,
    transparent: true,
    frame: false,
    resizable: true,
    acceptFirstMouse: false,
    hasShadow: false,
    webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration:true,
    }
  })
  // settingWin.loadURL('http://localhost:5173/#/settings')

  const settingFile = path.join(__dirname, 'dist', 'index.html');
  settingWin.loadFile(settingFile, { hash: '/settings' });

  
  
  const [mainX, mainY] = mainWin.getPosition();
  settingWin.setPosition(mainX, mainY + gap)
  settingWin.setContentProtection(true)
  settingWin.setAlwaysOnTop(true,'screen-saver')
  settingWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  mainWin.on('move',()=>{
    const [mainX, mainY] = mainWin.getPosition();
    settingWin.setPosition(mainX, mainY + gap)
  })

  settingWin.on('ready-to-show',()=>{
    const [mainX, mainY] = mainWin.getPosition();
    settingWin.setPosition(mainX, mainY + gap)
  })
  setShortcut('CommandOrControl+Shift+I',()=>{
    settingWin.webContents.openDevTools()
  })
}

app.whenReady().then(() => {
  createWindow();
});