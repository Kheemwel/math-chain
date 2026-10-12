import { BOSS_EVERY } from './constants';

export interface Trait {
	name: string;
	text: string;
	/** Maps incoming damage to damage actually dealt. */
	apply: (damage: number) => number;
}

export const TRAITS: readonly Trait[] = [
	{ name: 'Plain', text: 'No special rule', apply: (d) => d },
	{
		name: 'Seven Lover',
		text: 'Takes double damage from multiples of 7',
		apply: (d) => (d > 0 && d % 7 === 0 ? d * 2 : d)
	},
	{ name: 'Armored', text: 'Ignores damage under 15', apply: (d) => (d < 15 ? 0 : d) },
	{ name: 'Even Hater', text: 'Even damage is halved', apply: (d) => (d % 2 === 0 ? d / 2 : d) }
];

export const BOSS: Trait = {
	name: 'Boss',
	text: 'All damage is halved',
	apply: (d) => Math.floor(d / 2)
};

const FACES = ['👾', '🐺', '🦂', '🐲'] as const;
const BOSS_FACE = '👹';

export const isBossRound = (round: number): boolean => round % BOSS_EVERY === 0;

export const traitForRound = (round: number): Trait =>
	isBossRound(round) ? BOSS : TRAITS[(round - 1) % TRAITS.length];

export const enemyFace = (round: number): string =>
	isBossRound(round) ? BOSS_FACE : FACES[(round - 1) % FACES.length];

export const enemyMaxHp = (round: number): number => Math.round(200 * 1.3 ** (round - 1));

export const enemyDamage = (round: number): number => 10 + 2 * round;
