import { createAvatar } from "@dicebear/core";
import { initials , bottts } from "@dicebear/collection";

export default function generateMovieAvatar(title: string) {
  const avatar = createAvatar(initials, {
    seed: title, // يخلي كل فيلم له avatar فريد

    backgroundColor: ["0f172a", "1e293b", "020617","0000000"], // dark gradient vibe
    textColor: ["e5e7eb"],

    fontWeight: 700,
    radius: 20, // يخليها شبه poster rounded
    size: 512,

    // يخلي الحروف كبيرة ومركزة
    scale: 80,
  });

  return avatar.toDataUri();
}
export function generateServerAvatar(title: string) {
  const avatar = createAvatar(bottts, {
    seed: title,

    backgroundColor: ["0f172a", "1e293b", "020617","0000000"], // dark gradient vibe
    radius: 20, // يخليها شبه poster rounded
    size: 512,
    // يخلي الحروف كبيرة ومركزة
    scale: 80,
  });

  return avatar.toDataUri();
}
