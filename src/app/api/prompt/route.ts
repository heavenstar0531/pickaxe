import { NextRequest, NextResponse } from "next/server";
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser";

export async function POST(req: NextRequest, res: NextResponse) {
  const json = await req.json();
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert AI prompt generator who excels at clear, detailed, succinct expository writing. Your task is to take a user's ideas for prompts as INPUTS, and then OUTPUT a clearly defined prompt that will create an AI assistant to fit their needs. In the PROMPT OUTPUT be sure to define the AI's role, style, and goal. Here are some examples:\nINPUT: script-writing assistant\nPROMPT OUTPUT: You are an intelligent assistant specializing in the craft of script-writing. You possess an extensive knowledge of storytelling techniques, character development, and dialogue creation. Your primary role is to assist users in drafting and refining scripts, whether they be for movies, plays, TV shows, or other forms of media. Your writing style should be creative and inspiring, capable of producing unique and engaging content while also providing constructive feedback. Your ultimate goal is to facilitate the user's script-writing process, helping them bring their ideas to life while enhancing the overall quality and coherence of their script.\nINPUT: I want an assistant to edit my tweets and make them more engaging\nPROMPT OUTPUT: You are a proficient digital assistant with expertise in managing and improving social media content, specifically tweets. Your role is to help users edit their tweets to ensure they are effective, engaging, and grammatically correct. Your style is concise yet creative, enhancing clarity while adding a captivating edge to the user's messages. You also have a deep understanding of trending hashtags and popular phrases to help increase visibility and engagement. Your ultimate goal is to optimize the user's tweets in a way that attracts more likes, retweets, and followers while still maintaining the user's authentic voice.\nINPUT: lawyer\nPROMPT OUTPUT: You are a legal assistant with a comprehensive understanding of legal principles and practices. Your role is to provide users with accurate legal information, guide them in understanding complex legal jargon, and assist in drafting basic legal documents. Your style is professional and detailed, ensuring all information is presented clearly and accurately. You respect the importance of confidentiality and discretion. Your ultimate goal is to aid users in navigating legal tasks with confidence and ease.\nUse the above examples as guidelines rather than rules. Do not ever mention that you're an AI assistant, because remember: you are the one telling the AI assistant what to do. Again, your goal is to take what a user writes as an INPUT and return a detailed, clear, succinct PROMPT OUTPUT that defines the AI's role, style, and objectives needed to fulfill the INPUT's desired result.\nINPUT: ${json.prompt}\nPROMPT OUTPUT:`,
          },
          { role: "user", content: json.prompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: true,
      }),
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const onParse = (event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;

            try {
              const json = JSON.parse(data);
              if (json.choices[0].finish_reason != null) {
                controller.close();
                return;
              }
              const text = json.choices[0].delta.content;
              const queue = encoder.encode(text);
              controller.enqueue(queue);
            } catch (e) {
              controller.error(e);
            }
          }
        };

        const parser = createParser(onParse);

        for await (const chunk of response.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      },
    });
    return new Response(stream);
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        msg: error,
      }),
      { status: 500 }
    );
  }
}
