import dotenv from 'dotenv'
dotenv.config()

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function main() {
  const myfile = await ai.files.upload({
    file: "D:\\work\\practise\\MERN\\ChronoHire\\p.pdf",
    config: { mimeType: "application/pdf" },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "describe this pdf",
    ]),
  });
  console.log(response.text);
}

await main();




const listResponse = await ai.files.list({ config: { pageSize: 10 } });
for await (const file of listResponse) {
  console.log(file.name);
}