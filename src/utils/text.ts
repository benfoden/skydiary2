import { afinn165 } from "./afinn165";

export const formattedDate = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

export const textToCleanArray = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9á-úñäâàéèëêïîöôùüûœç\- ]+/g, "")
    .replace(/ {2,}/g, " ")
    .split(" ");
};

type WordType = Record<string, boolean>;

type MatchedType = Record<string, number>;

export function analyzeSentiment(text: string): {
  score: number;
  comparative: number;
  words: {
    positive: string[];
    negative: string[];
    neutral: string[];
    matched: MatchedType;
    unmatched: MatchedType;
  };
} {
  let score = 0;
  const positive: WordType = {};
  const negative: WordType = {};
  const neutral: WordType = {};
  const matched: MatchedType = {};
  const unmatched: MatchedType = {};

  const wordsArray = textToCleanArray(text);
  wordsArray.forEach((word) => {
    if (afinn165.hasOwnProperty(word)) {
      const wordScore = afinn165[word]!;
      matched[word] = (matched[word] ?? 0) + 1;
      score += wordScore;

      if (wordScore === 0) {
        neutral[word] = true;
      } else if (wordScore > 0) {
        positive[word] = true;
      } else {
        negative[word] = true;
      }
    } else {
      unmatched[word] = (unmatched[word] ?? 0) + 1;
    }
  });

  const matchedLength = Object.keys(matched).length;
  const comparative = matchedLength > 0 ? score / matchedLength : 0;

  return {
    score: score,
    comparative: comparative,
    words: {
      positive: Object.keys(positive),
      negative: Object.keys(negative),
      neutral: Object.keys(neutral),
      matched: matched,
      unmatched: unmatched,
    },
  };
}
