/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import fs from "fs";
import { createClient } from "./supabase/client";

export class Rafaiutils {
  supabase = createClient();
  history: { role: string; parts: [{ text: string }] }[];
  apikey = "";
  id = 0;

  constructor(apikey: string) {
    this.history = [];
    this.apikey = apikey;
  }

  addUserMessage(text: string) {
    this.history.push({ role: "user", parts: [{ text }] });
  }

  addModelMessage(text: string) {
    this.history.push({ role: "model", parts: [{ text }] });
  }

  size() {
    return this.history.length;
  }

  async loadHistory (idcv?: string) {
    const data = await this.loadToDatabase(idcv);
    if (data) {
      this.history = JSON.parse(data.history);
      this.id = JSON.parse(data.id);
    }
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

  async loadToDatabase(idcv?: string) {
    try {
      if(idcv) {
        const { data } = await this.supabase
          .from("chats")
          .select("*")
          .eq("apikey", this.apikey)
          .eq("idcv", idcv)
          .maybeSingle();
        if (!data) throw new Error("Data not found");
        return data;
      } else {
        const { data } = await this.supabase
          .from("chats")
          .select("*")
          .eq("apikey", this.apikey)
          .maybeSingle();
        if (data) throw new Error("Data not found");
        return data;
      }
    } catch {
      return null;
    }
  }

  async updateToDatabase(idcv?: string) {
    if(idcv) {
      const { error } = await this.supabase
        .from("chats")
        .update({ history: JSON.stringify(this.history) })
        .eq("id", this.id)
        .eq("idcv", idcv);
      if (error) throw error;
    } else {
      const { error } = await this.supabase
        .from("chats")
        .update({ history: JSON.stringify(this.history) })
        .eq("id", this.id);
      if (error) throw error;
    }
  }

  async saveToDatabase(idcv?: string) {
    if(idcv) {
      const { error } = await this.supabase
        .from("chats")
        .insert({ history: JSON.stringify(this.history), apikey: this.apikey, idcv });
      if (error) throw error;
    } else {
      const { error } = await this.supabase
        .from("chats")
        .insert({ history: JSON.stringify(this.history), apikey: this.apikey });
      if (error) throw error;
    }
  }
}
