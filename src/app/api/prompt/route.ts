import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest, res: NextResponse) {
  const json = await req.json();
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: json.prompt,
      max_tokens: 2000,
      temperature: 0.6,
    });
    const completion = response.data.choices[0].text;
    return new NextResponse(
      JSON.stringify({
        msg: completion,
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
