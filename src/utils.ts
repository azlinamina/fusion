export function cn(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(' ');
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
