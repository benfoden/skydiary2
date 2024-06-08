import { type Persona } from "@prisma/client";

export function pathHelper(pathname: string): string {
  switch (pathname) {
    case "/":
      return "/home";
    case "/home":
      return "/topics";
    case "/today":
      return "/home";
    default:
      return pathname;
  }
}

const environmentUrl =
  process.env.NEXT_PUBLIC_BYPASS_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL;

export const baseUrl = environmentUrl
  ? `https://${environmentUrl}`
  : `http://localhost:3000`;

export const TAGS = [
  { content: "career", id: "clwg3mpgd0001vsr5m46ocag5" },
  { content: "diet", id: "clwg3mpgd0000vsr5h6j0z5e7" },
  { content: "exercise", id: "clwg3mpgd0002vsr5urz19xlm" },
  { content: "family", id: "clwg3mpgd0003vsr51azv3nkw" },
  { content: "dating", id: "clwg3mpgd0004vsr56r5doti5" },
  { content: "friends", id: "clwg3mpgd0005vsr5510t1rz9" },
  { content: "mental health", id: "clwg3mpgd0006vsr52bugzcf3" },
  { content: "learning", id: "clwg3mpgd000bvsr5l1joi4c4" },
  { content: "skills", id: "clwg3mpgd0007vsr5ofgll54l" },
  { content: "finances", id: "clwg3mpgd000cvsr5z6mprx5h" },
  { content: "hobbies", id: "clwg3mpgd0008vsr5oru3dpey" },
  { content: "travel", id: "clwg3mpgd000dvsr5robvtn9y" },
  { content: "emotions", id: "clwg3mpgd000avsr5zukohqjx" },
  { content: "goals", id: "clwg3mpgd0009vsr5at0fkh96" },
  { content: "relationships", id: "clwg3mpgd000gvsr5ek7jx2w2" },
  { content: "self-improvement", id: "clwg3mpgd000hvsr57ftkjbtj" },
  { content: "work", id: "clwg3mpgd000evsr5nzdy9ece" },
  { content: "education", id: "clwg3mpgd000fvsr5dgk1w7nh" },
  { content: "physical health", id: "clwg3mpgd000ivsr53125sjfk" },
  { content: "spirituality", id: "clwg3mpgd000jvsr5mhgknvq3" },
];

// PROMPTS

export const coachVariants = ["criticism", "insight", "boost"];
export const generateCoachPrompt =
  "Based on these three types of comments and a journal entry that will follow: " +
  coachVariants.join(", ") +
  "Please select one comment type that, if read by the writer, could help the person achieve their interests, whether plainly stated, implied, or discerned. Attempt to read between the lines and identify the main topic of the diary entry and focus on that. You do not need to address every topic in the diary entry." +
  "Respond with only the comment type as a single word text string and nothing else." +
  "If the person needs some tough love, or if they are complaining, or if they are rambling, then you could select 'criticism'." +
  "If the person is trying to get a better understanding of the topic, if they have an explicit question, or if they are trying to improve their skills, then you could select 'insight'." +
  "If the person is upset, or having a very hard day, or struggling with a problem with no immediate solution, then you could select 'boost'." +
  "Here is the journal entry text: ";

export const personaPrompt = (persona: Persona) =>
  "Based on the following persona and a journal entry that will follow these messages, write a comment: " +
  JSON.stringify(persona) +
  "Please return a comment from the point of view of this persona that, if read by the writer, could help the person achieve their interests, whether plainly stated, implied, or discerned. Attempt to read between the lines and identify the main topic of the diary entry and focus on that. You do not need to address every topic in the diary entry." +
  "Respond with only a comment as a text string and nothing else." +
  "If the person needs some tough love, or if they are complaining, or if they are rambling, then you could return a comment with some constructive criticism'." +
  "If the person is trying to get a better understanding of the topic, if they have an explicit question, or if they are trying to improve their skills, then you could respond with a comment that gives them some insight." +
  "If the person simply wants to be understood, is upset, having a hard time, feeling down, or otherwise struggling with a situation that has no immediate solution, then you could respond with a comment that gives them some encouragement and shows you care. " +
  +basicPrompt +
  "Here is the journal entry text: ";

export const basicPrompt =
  "Do not start your reply with hi, hey, hello, etc. " +
  "If you use an emoji or exclamation point, only use one. " +
  "Shorter is better so do not add unnecessary flowery words and never repeat concepts. " +
  "Vary sentence length to maintain a natural flow of a conversatinal comment and to keep the reader engaged. " +
  "Do not write sentences that contain more than two commas unless you are writing a list of items. Never use semicolons in your response. " +
  "Do not use the words 'commendable', 'noteworthy', 'notably', 'noted', 'notable'. " +
  "Do not summarize the entry in your response. This is a critical rule. Only add new commentary, advice, criticism, or insights." +
  "Identify the main topic of the diary entry and focus on that. You do not need to address every topic in the diary entry. " +
  "Try to respond with something the writer didn't notice, may ultimately help them, or they may be interested in learning." +
  "Address the writer directly, if possible. For example use 'you' or 'your' or if writing generally about people, use 'one should', 'one can...', etc. but do not say 'the writer'." +
  "Always respond in the same language as the entry. " +
  "Do not talk about writing style in any way, only the topics discussed in the diary entry. " +
  "Write your response only as long as necessary to convey the message from the coach. Do not pad your response with fluffy commentary. Shorter is always better. The length must not exceed 280 words.";

export function generateCommentPrompt(
  variant: string,
  entryText: string,
): string {
  function getVariant(variant: string): string {
    const insight =
      "Offer some insights into any challenges expressed in this diary entry. " +
      "If there are no challenges don't be too flowery. " +
      "Write as if you are a wise uncle or aunt of the writer who is also an expert in the topics in the entry:";

    switch (variant) {
      case "criticism":
        return "Please provide constructive criticism on the topics expressed in the following diary entry. Do not hold back if there is any opportunity for improvement. Your goal is not to protect feelings but to protect results. Focus on the topic areas that need improvement and offer suggestions for how to improve. Be specific and provide examples to support your feedback. Write as if you are straight-shooter no-nonsense type in the style of an ex-Navy seal combined with an expert in the field of the topics in the entry:";
      case "insight":
        return insight;
      case "boost":
        return "Please provide some words that give a boost to the person writing this diary entry.  Only use superlatives if the person has done something really great or extremely difficult. Write as if you are an expert in the field of the topics in the entry.:";
      default:
        return insight;
    }
  }
  return getVariant(variant) + basicPrompt + " " + "Entry text:" + entryText;
}

export const generateTagsPrompt =
  "Please provide some tags for the following diary entry. " +
  "The tags should be short and concise. " +
  "Do not include any punctuation or special characters. " +
  "Only respond with tags that are strongly relevant to the diary entry. " +
  "Respond only with a list of separated by commas and spaces." +
  "Return a maximum of three tags." +
  "Tag list: " +
  TAGS.map((tag) => tag.content).join(", ") +
  " " +
  "Diary entry:";

export const summarizeText = (content: string): string =>
  "Please summarize the following text, compressing the length as much as possible while maintaining the original content and meaning." +
  "Only respond with a summary of the text. " +
  "Always return a response of 80 words or less." +
  "Do not mention the author or the writer of the text. The summary should be absolutely as concise as possible." +
  "Return your response in the same language as the majority of the words in the text." +
  "If there is no text, return nothing." +
  "Text: " +
  content;
