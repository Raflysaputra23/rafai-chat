/* eslint-disable @typescript-eslint/no-explicit-any */
import FileUpload from "@/lib/fileupload";
import { defaultConfig, MODEL, rafai, SYSTEM_INSTRUCTION } from "@/lib/rafai";
import { Rafaiutils } from "@/lib/rafaiUtils";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const apikey = (await headers()).get("authorization")?.split(" ")[1] ?? null;

  if (!apikey) {
    return new Response(JSON.stringify({ message: "Unauthorized", status: 401, copyright: "@rafai.dev" }), { status: 401 });
  }

  const typeChat = (formData.get("typeChat") as string) ?? "chat";
  const model = (formData.get("model") as string) ?? MODEL[3];
  const files = (formData.getAll("files") as File[]) ?? null;
  const prompt = (formData.get("prompt") as string) ?? null;
  const instruksi = SYSTEM_INSTRUCTION + ", " + ((formData.get("instruksi") as string) ?? " ");
  const url = (formData.get("url") as string) ?? null;

  //   GET HISTORY PERCAKAPAN
  const history = new Rafaiutils(apikey);

  if (typeChat == "chat") {
    try {
      const chat = rafai.chats.create({
        model,
        history: history.getHistory(),
        config: {
          ...defaultConfig,
          systemInstruction: instruksi,
        },
      });

      const response = await chat.sendMessage({
        message: prompt,
      });

      if (!response.text) {
        throw new Error("Maaf terjadi kesalahan, silahkan coba lagi.");
      }

      history.addUserMessage(prompt);
      history.addModelMessage(response.text);
      console.log(history.getHistory());

      return new Response(
        JSON.stringify({
          response: response.text,
          status: 200,
          copyright: "@rafai.dev",
          typeChat,
        }),
        { status: 200 },
      );
    } catch (error) {
      console.error(error);
      return new Response(
        JSON.stringify({
          response: "RafAI sedang mengalami masalah, coba beberapa saat lagi!",
          status: 500,
        }),
        { status: 500 },
      );
    }
  } else if (typeChat == "multimodal") {
    try {
      let contents: any = "";

      if (url) {
        const response = await fetch(url);
        const imageArrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(imageArrayBuffer).toString("base64");

        contents = [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: buffer,
            },
          },
        ];
      } else {
        // convert file to buffer
        const fileBuffer = [];
        if (files != null) {
          for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            fileBuffer.push({
              mimeType: file.type,
              buffer: buffer.toString("base64"),
            });
          }
        }

        contents = fileBuffer.map((file) => ({
          inlineData: {
            mimeType: file.mimeType,
            data: file.buffer,
          },
        }));
      }

      contents.push({ text: prompt });

      const response = await rafai.models.generateContent({
        model,
        contents,
        config: {
          ...defaultConfig,
          systemInstruction: instruksi,
        },
      });

      if (!response.text) {
        throw new Error("Maaf terjadi kesalahan, silahkan coba lagi.");
      }

      history.addUserMessage(prompt);
      history.addModelMessage(response.text);

      return new Response(
        JSON.stringify({
          response: response.text,
          status: 200,
          copyright: "@rafai.dev",
          typeChat,
        }),
        { status: 200 },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          response:
            "RafAI multimodal sedang mengalami masalah, coba beberapa saat lagi!",
          status: 500,
          typeChat,
        }),
        { status: 500 },
      );
    }
  } else if (typeChat == "image") {
    try {
      return new Response(
        JSON.stringify({
          response: "Coming soon ya",
          status: 200,
          typeChat,
        }),
        { status: 200 },
      );
      const response: any = await rafai.models.generateContent({
        model,
        contents: prompt,
        config: {
          ...defaultConfig,
          systemInstruction: instruksi,
        },
      });

      if (!response.candidates) {
        throw new Error("Maaf terjadi kesalahan, silahkan coba lagi.");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log(part.text);
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          const file = await FileUpload(buffer);
          console.log("FILE: ", file);
          return new Response(
            JSON.stringify({
              response: file,
              status: 200,
              copyright: "@rafai.dev",
              typeChat,
            }),
            { status: 200 },
          );
        }
      }

      return new Response(
        JSON.stringify({
          response:
            "RafAI image sedang mengalami masalah, coba beberapa saat lagi!",
          status: 500,
          typeChat,
        }),
        { status: 500 },
      );
    } catch (error) {
      console.log(error);
      return new Response(
        JSON.stringify({
          response:
            "RafAI image sedang mengalami masalah, coba beberapa saat lagi!",
          status: 500,
          typeChat,
        }),
        { status: 500 },
      );
    }
  }
};
