import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest, res: NextResponse) {
  const json = await req.json();
  try {
    let response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `INSTRUCTIONS:\nYou are an expert AI prompt engineer and prompt interpreter, and your job is to assess a PROMPT, and then come up with a concise FORM QUESTION whose answer would logically fit into the PROMPT's USER INPUT variable slot.\nThen generate a logical, concise EXAMPLE USER INPUT.\nPROMPT: ${json.prompt}\nFollow the INSTRUCTIONS:`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const completion1 = response.data.choices[0].message;

    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `INSTRUCTIONS:
          You are an expert at reading, synthesizing, and summarizing text. Your job is to assess a PROMPT, and then come up with a concise, catchy PICKAXE TITLE that captures the essence of what the PROMPT does as a tool.Then generate a concise, one-sentence PICKAXE DESCRIPTION of what this PROMPT tool can help you do.
          
          PROMPT: ${json.prompt}
          Follow the INSTRUCTIONS:`,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const completion2 = response.data.choices[0].message;

    const msgList1 = completion1?.content?.split("\n");
    const msgList2 = completion2?.content?.split("\n\n");

    let origin_answer = msgList1?.[1] !== "" ? msgList1?.[1] : msgList1?.[2];

    const question = msgList1?.[0].replace("FORM QUESTION: ", "");
    const answer = origin_answer?.replace("EXAMPLE USER INPUT: ", "");
    const title = msgList2?.[0].replace("PICKAXE TITLE: ", "");
    const description = msgList2?.[1].replace("PICKAXE DESCRIPTION: ", "");

    const payload = {
      newformname: title,
      newformdescription: description,
      question,
      example: answer,
      prompt: json.prompt,
    };

    const pickaxeResponse = await fetch(`${process.env.API_URL}`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const newResponse = await pickaxeResponse.json();

    return new NextResponse(
      JSON.stringify({
        link: newResponse.redirectlink,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        msg: error,
      }),
      { status: 500 }
    );
  }
}
