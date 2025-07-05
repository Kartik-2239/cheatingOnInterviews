import { GoogleGenAI, Type } from '@google/genai';
 
const ai = new GoogleGenAI({
          apiKey: 'key'
        });

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `You are a Python expert.
Given the following context:
"leetcode two sum"

1. Extract the **exact technical question** asked in the text.
2. Solve the extracted question using Python.
3. Output only the Python code, properly formatted so that **each line of code is on a separate line**.
4. Include only **minimal, essential comments** to explain your logic.
Do not output anything except the extracted question and the generated code.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  theCode: { type: Type.STRING },
                  question: { type: Type.STRING },
                },
              },
            },
          },
        });

        // STREAM CHUNKS BACK TO RENDERER
        console.log(JSON.parse(response.text)[0].question)
