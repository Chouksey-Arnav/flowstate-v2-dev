export const QUOTES: string[] = [
  "You don't need motivation. You need discipline. Motivation is a feeling. Discipline is a decision.",
  "Stop waiting for the right time. The right time is when you decide it is.",
  "Every hour you waste is a competitor gaining ground.",
  "Your future self is watching you right now through your memories.",
  "Done is better than perfect. Shipped beats unstarted every single time.",
  "The task you're avoiding is the one you most need to do.",
  "Comfort is the enemy of progress. Progress lives on the other side of hard.",
  "You have the same 24 hours as every founder who built something real.",
  "Don't optimize. Execute. You can refine later — first you have to start.",
  "The gap between who you are and who you want to be is called action.",
  "Nobody is coming to save you. That's the best news you'll ever hear.",
  "Rejection is data. Every 'no' is one step closer to the 'yes' that matters.",
  "You're not tired. You're avoiding. There's a difference.",
  "Eat the frog first. Do the hardest task before you do anything else.",
  "If it's worth doing, it's worth doing badly at first.",
  "Clarity comes from action, not from thinking.",
  "The person who is too busy to improve is the person who stays the same.",
  "Momentum doesn't wait. Start ugly. Fix later.",
  "Small daily consistent actions compound into unbelievable results.",
  "Your goals don't care how you feel today.",
];

/** Rotates hourly: pick a quote deterministically by the current hour-of-year. */
export function getCurrentQuote(): string {
  const now = new Date();
  const hourOfYear =
    Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 36e5);
  return QUOTES[hourOfYear % QUOTES.length];
}
