import path from "path";
import fs from "fs";

export class Rafaiutils {
  history: { role: string; parts: [{ text: string }] }[];

  constructor(iduser: string) {
    this.history = [];
  }

  addUserMessage(text: string) {
    this.history.push({ role: "user", parts: [{ text }] });
  }

  addModelMessage(text: string) {
    this.history.push({ role: "model", parts: [{ text }] });
  }

  getHistory() {
    return this.history;
  }

  clearHistory() {
    this.history = [];
  }

  loadBase64(filePath: string) {
    const file = fs.readFileSync(path.join(process.cwd(), filePath));
    return file.toString("base64");
  }



  
}
