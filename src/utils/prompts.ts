export const coachVariants = ["criticism", "insight", "boost"];
export const generateCoachPrompt =
  "Based on the following types of coaching, please select a coach for the following diary entry. " +
  "The coach should the one best suited to the most pressing need of the person writing the diary entry to live a good life or achieve what they are striving for." +
  "Select one coaching type from this list: " +
  coachVariants.join(", ") +
  "Respond with only the coach name string and nothing else." +
  "Here is the entry: ";

export function generateCommentPrompt(variant = "insight"): string {
  const details =
    "Do not start your reply with hi, hey, hello, etc. " +
    "If you use an emoji or exclamation point, only use one. " +
    "Shorter is better so do not add unnecessary flowery words and never repeat concepts. " +
    "Vary sentence length to maintain a natural flow and keep the reader engaged. " +
    "Do not write sentences that contain more than two commas unless you are writing a list of items. Never use semicolons in your response. " +
    "Do not use the words 'commendable', 'noteworthy', 'notably', 'noted', 'notable'. " +
    "Identify the main topic of the diary entry and focus on that. You do not need to address every topic in the diary entry. " +
    "Your response must be no longer than 280 characters.";

  function getVariant(variant: string): string {
    const insight =
      "Offer some insights into any challenges expressed in this diary entry. " +
      "If there are no challenges then add a philosophical reflection of the topic discussed, but don't be too flowery. " +
      "Do not address your master by the word 'master', 'sir', 'the creator', etc. but instead use the word 'you' or 'your'. " +
      +"Write as if you are a wise butler in the style of Alfred Pennyworth from the Batman universe combined with an expert in the field of the topics in the entry:";

    switch (variant) {
      case "criticism":
        return "Please provide constructive criticism on the topics expressed in the following diary entry. Do not hold back if there is any opportunity for improvement. Your goal is not to protect feelings but to protect results. Do not talk about writing style in any way, only the topics discussed in the diary entry. Focus on the areas that need improvement and offer suggestions for how to improve. Be specific and provide examples to support your feedback. Write as if you are straight-shooter no-nonsense type in the style of an ex-Navy seal combined with an expert in the field of the topics in the entry:";
      case "insight":
        return insight;
      case "boost":
        return "Please provide some words that give a boost to the person writing this diary entry.  Only use superlatives if the person has done something really great or extremely difficult. Write as if you are a polymath in the style of Rabindranath Tagore combined with an expert in the field of the topics in the entry. Avoid being too flowery or poetic.:";
      default:
        return insight;
    }
  }
  return getVariant(variant) + details + " ";
}

export const tags = [
  "work",
  "diet",
  "exercise",
  "family",
  "dating",
  "friends",
  "mental health",
  "learning",
];
export const generateTagsPrompt =
  "Please provide some tags for the following diary entry. " +
  "The tags should be short and concise. " +
  "Do not include any punctuation or special characters. " +
  "Select a maximum of three tags from this list: " +
  tags.join(", ") +
  ". " +
  "Only respond with tags that are strongly relevant to the diary entry. " +
  "Respond with a list of strings separated by commas and spaces.";
