import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// TODO: generate a message sequence based on the user's input and the message type selected.
// generate four messages to be sent over time.

export async function getResponse(inputText: string) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: inputText }],
    model: "gpt-4-0125-preview",
  });

  return completion.choices[0]?.message.content;
}

export async function getResponseFromArr(inputTexts: string[]) {
  const completion = await openai.chat.completions.create({
    messages: inputTexts.map((text) => ({ role: "user", content: text })),
    model: "gpt-4-0125-preview",
  });

  return completion.choices[0]?.message.content;
}
