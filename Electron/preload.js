// preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getAnswer: (query) => ipcRenderer.invoke('get-answer',query), //Asking gemini for answers
  changeSize: ()=> ipcRenderer.send('change-size'), //make the new window and start solving the question
  changeHeight: (height)=>ipcRenderer.send('change-height',height),
  ansBtn: ()=>ipcRenderer.send('ans-btn'),
  settingBtn: ()=>ipcRenderer.send('setting-btn'),
  shareApiKey: (key)=>ipcRenderer.send('share-apikey', key),
  getApiKey: () => ipcRenderer.invoke('get-api-key')
  
});


