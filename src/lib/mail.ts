import nodemailer from "nodemailer";

/** Where game notifications are delivered. */
export const RECIPIENT_EMAIL = "sam.dv.350@gmail.com";

const MAX_NAME_LENGTH = 12;
const MAX_PLAYERS = 4;

export function sanitizeNames(input: unknown): string[] | null {
  if (!Array.isArray(input)) return null;
  const names = input
    .map((n) => (typeof n === "string" ? n.trim().slice(0, MAX_NAME_LENGTH) : ""))
    .filter(Boolean);
  if (names.length < 2 || names.length > MAX_PLAYERS) return null;
  return names;
}

/** Sends the list of players that joined a game (fire-and-forget on the client). */
export async function sendPlayersEmail(names: string[]): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const list = names.map((name, i) => `  ${i + 1}. ${name}`).join("\n");

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: RECIPIENT_EMAIL,
    subject: `🎲 Dice and Die — new game (${names.length} players)`,
    text: [
      "A new game of Dice and Die just started with the following players:",
      "",
      list,
      "",
      `Started at: ${new Date().toLocaleString()}`,
    ].join("\n"),
  });
}
