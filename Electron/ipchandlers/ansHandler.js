
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { ipcMain } from 'electron'
// import { createWorker } from 'tesseract.js';
import { desktopCapturer } from 'electron';
import { createUserContent, GoogleGenAI, Type, createPartFromUri } from "@google/genai";
import fs from 'fs'
import js from '@eslint/js';

export function ansHandler(key){
  
  try{
      ipcMain.handle('get-answer',async (event,query)=>{
      const {screen} = require('electron')
      const {width, height} = screen.getPrimaryDisplay().size
      const sources = await desktopCapturer.getSources({ 
        types: ['screen'],
        thumbnailSize: {width, height}
      });
      const screenshot = await sources[0]
      const pngBuffer = await screenshot.thumbnail.toPNG()
      fs.writeFileSync('./screenshots/ss.png', pngBuffer)

      // const worker = await createWorker('eng')
      // const ret = await worker.recognize(pngBuffer)
      
      // await worker.terminate()
 
      // fs.writeFileSync('./assets/text.txt',ret.data.text.replace('\n',' '))
      //"${ret.data.text}"

      if (query === 'gemini'){
        try{

        const ai = new GoogleGenAI({ apiKey: key }); //''
        async function main() {
          const image = await ai.files.upload({
            file:'./screenshots/ss.png',
          });
          
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite-preview-06-17",
          
            contents:[
              createUserContent([
                `You are a Python expert.
              Given the following context:
              1. Extract the **exact technical question** asked in the text.
              2. Solve the extracted question using Python.
              3. Output only the Python code, properly formatted so that **each line of code is on a separate line**.
              4. Include only **minimal, essential comments** to explain your logic.
              Do not output anything except the extracted question and the code.`,
              createPartFromUri(image.uri, image.mimeType)
              ])
            ]
              ,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    theCode: {
                      type: Type.STRING,
                    },
                    question: {
                      type: Type.STRING,
                    },
                  },
                  propertyOrdering: ["theCode", "question"],
                },
              },
            },
          });
          return response.text

        }
        let answer = await main()
        answer = JSON.parse(answer)
        return [answer[0].theCode, answer[0].question]
      }catch (error){
        let errorMsg = 'Unknown error';
        try {
          errorMsg = JSON.parse(error.message)?.error?.message || error.message;
        } catch {
          errorMsg = error.message ;
        }
        return ['encountered an error', errorMsg];
      }
      }
    })
  }
  catch{
    return ['no code','no pointers']
  }
}
