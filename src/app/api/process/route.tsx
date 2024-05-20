import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

// Default export is a4 paper, portrait, using millimeters for units

dotenv.config(); // Load environment variables

export async function POST(req: NextRequest) {
  const { prompt: userPrompt } = await req.json();

  if (!userPrompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const model = new ChatGroq({
      apiKey: process.env.GroqInferenceProd,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", "You are a helpful assistant"],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(model);

    const response = await chain.invoke({
      input: userPrompt,
    });

    return NextResponse.json({ result: response.content });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
