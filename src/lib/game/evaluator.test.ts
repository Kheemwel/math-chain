import { describe, expect, it } from 'vitest';
import { evaluate } from './evaluator';

const value = (tokens: Parameters<typeof evaluate>[0]) => {
	const r = evaluate(tokens);
	if (!r.ok) throw new Error(r.error);
	return r.value;
};

describe('evaluate', () => {
	it('adds and subtracts left to right', () => {
		expect(value([9, '+', 3])).toBe(12);
		expect(value([9, '−', 3])).toBe(6);
		expect(value([10, '−', 3, '+', 2])).toBe(9);
	});

	it('multiplies and divides before adding', () => {
		expect(value([6, '+', 3, '×', 4])).toBe(18);
		expect(value([20, '−', 8, '÷', 2])).toBe(16);
	});

	it('applies × and ÷ left to right', () => {
		expect(value([8, '÷', 2, '×', 3])).toBe(12);
		expect(value([2, '×', 3, '×', 4, '×', 5])).toBe(120);
	});

	it('rounds the final result down', () => {
		expect(value([7, '÷', 2])).toBe(3);
		expect(value([7, '÷', 2, '×', 2])).toBe(7); // 3.5 × 2, rounded only at the end
	});

	it('returns negative results unchanged', () => {
		expect(value([3, '−', 9])).toBe(-6);
	});

	it('rejects division by zero', () => {
		expect(evaluate([5, '÷', 0])).toEqual({ ok: false, error: 'Cannot divide by zero.' });
		expect(evaluate([5, '+', 3, '÷', 0]).ok).toBe(false);
	});

	it('allows zero as a numerator and in sums', () => {
		expect(value([0, '÷', 5])).toBe(0);
		expect(value([0, '+', 0])).toBe(0);
	});

	it('rejects malformed formulas', () => {
		expect(evaluate([]).ok).toBe(false);
		expect(evaluate([5]).ok).toBe(false);
		expect(evaluate([5, '+']).ok).toBe(false);
		expect(evaluate([5, 3, '+']).ok).toBe(false);
		expect(evaluate(['+', 5, 3]).ok).toBe(false);
		expect(evaluate([5, '+', '×']).ok).toBe(false);
	});

	it('rejects unknown operators', () => {
		expect(evaluate([5, '^' as never, 2]).ok).toBe(false);
	});

	it('handles two-digit numbers', () => {
		expect(value([99, '×', 99, '×', 9, '×', 9])).toBe(793881);
	});

	it('rejects results that are not finite', () => {
		const big = Array.from({ length: 200 }, () => [99999999, '×']).flat().slice(0, -1);
		expect(evaluate(big as never).ok).toBe(false);
	});
});
