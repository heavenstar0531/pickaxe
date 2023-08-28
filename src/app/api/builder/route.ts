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
          content: `INSTRUCTIONS
          You are an expert AI prompt engineer and prompt interpreter. You will assess a prompt. Imagine the prompt is a standalone app or chatbot that serves human end users. Generate a brief FORM QUESTION, which is a question or command that will prompt the human end-user to interact with the tool. The question or command will appear on a form and be followed by a brief text field where the human end-user will enter their response.
          
          OUTPUT FORMATTING
          It is required to format all outputs in the same way. Only output the FORM QUESTION content with no labels, titles, or anything else. Only the FORM QUESTION’s content.
          
          PROMPT TO GENERATE FORM QUESTION FOR:
          ${json.prompt}
          
          FINAL INSTRUCTIONS: 
          Using the prompt above, generate a concise FORM QUESTION following the rules which will instruct the human end-user to enter something. `,
        },
        {
          role: "user",
          content: json.prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const completion1 = response.data.choices[0].message;

    response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `OBJECTIVE:
          You are an expert at reading, synthesizing, and summarizing text. Your job is to assess a PROMPT, and then come up with a concise, catchy PICKAXE TITLE that captures the essence of what the PROMPT does as a tool. The title should be fun, catchy, and should be 6 words or less.
          
          OUTPUT FORMATTING
          Make sure to format the output the same way every time according to the rules. Only output the PICKAXE TITLE content. Do not add a header, or label, or anything else. Do not add quotations. Just plain text. Just the content.
          
          PROMPT TO GENERATE TITLE FOR:
          ${json.prompt}
          
          FINAL INSTRUCTION: 
          Generate a fun, concise PICKAXE TITLE for the above prompt that follows all the rules.`,
        },
        {
          role: "user",
          content: json.prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const completion2 = response.data.choices[0].message;
    const title = completion2?.content?.replace(/^"|"$/g, "");

    response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `OBJECTIVE:
          You are an expert at reading, synthesizing, and summarizing text. Your job is to assess a PROMPT, and then come up with a concise, catchy PICKAXE DESCRIPTION that describes what the PROMPT does as a tool. The description should be fun, informative, concise, and no more than 12 words.
          
          OUTPUT FORMATTING
          Make sure to format the output the same way every time according to the rules. Only output the PICKAXE DESCRIPTION content. Do not add a header, or label, or anything else. Do not add quotation marks or quotes. Just plain text. Just the content of the PICKAXE DESCRIPTION. Here are 3 examples: 
          - Craft captivating scripts with creative style and constructive feedback
          - Simplifying legal jargon, drafting documents, and boosting legal confidence
          - Get comprehensive damages estimates from rage incidents complete with dollar amounts.
          
          
          PROMPT TO GENERATE DESCRIPTION FOR:
          ${json.prompt}
          
          FINAL INSTRUCTION: 
          Generate a fun, concise PICKAXE DESCRIPTION for the above prompt that follows all the rules and describes what the prompt does.`,
        },
        {
          role: "user",
          content: json.prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });
    const completion3 = response.data.choices[0].message;

    const payload = {
      newformname: title,
      newformdescription: completion3?.content,
      question: completion1?.content,
      example: "User Input",
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
