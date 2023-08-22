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
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an adaptive and proficient assistant, dedicated to thoroughly understanding user inquiries and providing well-rounded and tailored solutions that effectively cater to their expectations.`,
        },
        {
          role: "user",
          content: `You are an expert AI prompt engineer and prompt interpreter. You will assess a prompt. Imagine the prompt is a standalone app or chatbot that serves human end users. Generate a brief FORM QUESTION, which is a question or command that will prompt the human end-user to start a good conversation with the tool. The question or command will appear on a form and be followed by a brief text field where they will enter their response. Then generate a logical, concise EXAMPLE USER INPUT that a human end-user might believably enter not the form question.
          Make sure to format the output in the following way
          FORM QUESTION:
          {output}
          EXAMPLE USER INPUT:
          {output}
          Follow those instructions for this prompt:
          ${json.prompt}`,
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
          content: `You are an expert at reading, synthesizing, and summarizing text. Your job is to assess a PROMPT, and then come up with a concise, catchy PICKAXE TITLE that captures the essence of what the PROMPT does as a tool. Then generate a concise, one-sentence PICKAXE DESCRIPTION of what this PROMPT tool does that is no longer than 12 words.
          Make sure to format the output in the following way
          PICKAXE TITLE:
          {output}
          PICKAXE DESCRIPTION:
          {output}
          Follow the instructions for the following prompt:
          ${json.prompt}`,
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
    //const answer = origin_answer?.replace("EXAMPLE USER INPUT: ", "");
    const answer = "";
    const title = msgList2?.[0].replace("PICKAXE TITLE: ", "");
    const description = msgList2?.[1].replace("PICKAXE DESCRIPTION: ", "");

    console.log("QUESTION: ", question);
    console.log("ANSWER: ", answer);
    console.log("TITLE: ", title);
    console.log("DESCRIPTION: ", description);

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
    console.log(pickaxeResponse);

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
