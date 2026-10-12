import type { GameType } from "./game";

export const truths: string[] = [
  "What's the most embarrassing thing you've ever done in public?",
  "Who was your first crush and what did you like about them?",
  "What's a secret you've never told anyone in this group?",
  "What's the biggest lie you've ever told?",
  "Have you ever pretended to like a gift you hated?",
  "What's the weirdest dream you've ever had?",
  "Who in this room would you trust with a big secret?",
  "What's something you're surprisingly bad at?",
  "Have you ever stalked someone on social media?",
  "What's the most childish thing you still do?",
  "What's your biggest fear that no one knows about?",
  "Have you ever cheated on a test or game?",
  "What's the most awkward date you've been on?",
  "Who do you text the most when you're bored?",
  "What's a habit of yours that annoys people?",
  "Have you ever ghosted someone? Why?",
  "What's the last thing you searched on your phone?",
  "If you could swap lives with someone here for a day, who and why?",
  "What's the most expensive thing you've broken?",
  "Have you ever had a crush on a friend's partner?",
];

export const dares: string[] = [
  "Do your best impression of someone in the room until someone guesses who.",
  "Let the group look through your last 10 photos on your phone.",
  "Speak in an accent of the group's choice for the next 3 turns.",
  "Send a funny selfie to a contact the group chooses.",
  "Dance for 30 seconds with no music.",
  "Let someone draw on your face with a pen (washable if possible).",
  "Call a friend and sing them 'Happy Birthday' even if it's not their birthday.",
  "Do 15 push-ups or sit-ups right now.",
  "Talk like a robot until your next turn.",
  "Let the group post a status on your social media (they type it).",
  "Wear your clothes inside-out for the next 10 minutes.",
  "Eat a spoonful of a condiment the group picks (mustard, ketchup, etc.).",
  "Do a dramatic reading of the last text message you sent.",
  "Balance a book on your head and walk across the room.",
  "Imitate a celebrity until someone guesses who it is.",
  "Let the person to your right style your hair however they want for 5 minutes.",
  "Speak only in questions until your next turn.",
  "Do your best catwalk across the room.",
  "Share the most recent voice note or video you have on your phone.",
  "Give a 30-second motivational speech about why pizza is the best food.",
];

/** Pick a random prompt for the given challenge type. */
export function pickPrompt(type: GameType): string {
  const list = type === "truth" ? truths : dares;
  return list[Math.floor(Math.random() * list.length)];
}
