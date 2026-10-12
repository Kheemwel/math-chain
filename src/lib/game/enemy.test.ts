import { describe, expect, it } from 'vitest';
import { BOSS, TRAITS, enemyDamage, enemyFace, enemyMaxHp, isBossRound, traitForRound } from './enemy';

describe('traits', () => {
	const [plain, sevenLover, armored, evenHater] = TRAITS;

	it('plain passes damage through', () => {
		expect(plain.apply(37)).toBe(37);
	});

	it('seven lover doubles multiples of 7 but not zero', () => {
		expect(sevenLover.apply(14)).toBe(28);
		expect(sevenLover.apply(15)).toBe(15);
		expect(sevenLover.apply(0)).toBe(0);
	});

	it('armored ignores damage under 15', () => {
		expect(armored.apply(14)).toBe(0);
		expect(armored.apply(15)).toBe(15);
	});

	it('even hater halves even damage only', () => {
		expect(evenHater.apply(10)).toBe(5);
		expect(evenHater.apply(11)).toBe(11);
	});

	it('boss halves and rounds down', () => {
		expect(BOSS.apply(11)).toBe(5);
	});
});

describe('rounds', () => {
	it('every 5th round is a boss', () => {
		expect([1, 4, 5, 6, 10].map(isBossRound)).toEqual([false, false, true, false, true]);
		expect(traitForRound(5)).toBe(BOSS);
		expect(enemyFace(5)).toBe('👹');
	});

	it('round 1 is the plain enemy', () => {
		expect(traitForRound(1)).toBe(TRAITS[0]);
	});

	it('enemy HP grows every round', () => {
		expect(enemyMaxHp(1)).toBe(200);
		for (let r = 1; r < 30; r++) expect(enemyMaxHp(r + 1)).toBeGreaterThan(enemyMaxHp(r));
	});

	it('enemy damage grows with the round', () => {
		expect(enemyDamage(1)).toBe(12);
		expect(enemyDamage(10)).toBe(30);
	});
});
