import type { Rng } from './types';

export const randInt = (n: number, rng: Rng): number => Math.floor(rng() * n);

/** Fisher-Yates shuffle, in place. Returns the same array. */
export function shuffle<T>(items: T[], rng: Rng): T[] {
	for (let i = items.length - 1; i > 0; i--) {
		const j = randInt(i + 1, rng);
		[items[i], items[j]] = [items[j], items[i]];
	}
	return items;
}

/** Small seeded generator (mulberry32). Useful for tests and, later, daily seeds. */
export function seededRng(seed: number): Rng {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
