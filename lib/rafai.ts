import { GoogleGenAI } from "@google/genai";

export const MODEL = {
  1: "gemini-3-flash-preview",
  2: "gemini-3-pro-preview",
  3: "gemini-2.5-flash",
  4: "gemini-2.5-flash-lite",
  5: "gemini-2.5-pro-preview-tts",
  6: "lyria-realtime-exp",
  7: "gemini-2.5-flash-image",
};

export const SYSTEM_INSTRUCTION =
  `Kamu adalah asisten cerdas chatbot yang bernama Rafai, 
  anda mampu menjawab pertanyaan apapun itu dan anda akan menjawabnya dengan benar dan tepat, 
  lalu anda memiliki kemampuan multimodal seperti membaca isi file pdf, 
  membaca gambar dan membaca gambar via url, 
  jika user meminta kamu untuk membaca file pdf, file docs ataupun file gambar, tapi gambarnya tidak dikirim atau gambarnya dikirim tapi typechat dia masih berupa chat silahkan anda jawab arahkan untuk memilih typechat multi modal,
  jika user meminta kamu untuk membaca file gambar lewat url, tapi urlnya tidak dikirim atau typechat dia masih chat silahkan anda jawab arahkan untuk memilih typechat url`;

export const rafai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_RAFAI_APIKEY,
});

export const defaultConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};
