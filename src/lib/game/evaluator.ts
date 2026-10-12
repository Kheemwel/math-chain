import { OPERATORS } from './constants';
import type { Token } from './types';

export type EvalResult = { ok: true; value: number } | { ok: false; error: string };

const fail = (error: string): EvalResult => ({ ok: false, error });

/**
 * Evaluates [number, operator, number, ...] with normal precedence
 * (× and ÷ before + and −). Never uses eval().
 *
 * Rules: division by zero is an error, non-finite results are errors,
 * and the final result is rounded down. Negative results are returned as is
 * (the caller decides how to treat them).
 */
export function evaluate(tokens: readonly Token[]): EvalResult {
	if (tokens.length < 3 || tokens.length % 2 === 0) {
		return fail('A formula needs a number, an operator and another number.');
	}
	for (let i = 0; i < tokens.length; i++) {
		const t = tokens[i];
		const expectNumber = i % 2 === 0;
		if (expectNumber && typeof t !== 'number') return fail('Numbers and operators must alternate.');
		if (!expectNumber && (typeof t !== 'string' || !OPERATORS.includes(t))) {
			return fail('Numbers and operators must alternate.');
		}
	}

	// First pass: × and ÷ fold into the previous term. + and − are deferred.
	const terms: number[] = [tokens[0] as number];
	const addOps: ('+' | '−')[] = [];
	for (let i = 1; i < tokens.length; i += 2) {
		const op = tokens[i];
		const n = tokens[i + 1] as number;
		if (op === '×') {
			terms[terms.length - 1] *= n;
		} else if (op === '÷') {
			if (n === 0) return fail('Cannot divide by zero.');
			terms[terms.length - 1] /= n;
		} else {
			addOps.push(op as '+' | '−');
			terms.push(n);
		}
	}

	let total = terms[0];
	addOps.forEach((op, i) => {
		total = op === '+' ? total + terms[i + 1] : total - terms[i + 1];
	});

	if (!Number.isFinite(total)) return fail('Result is too large.');
	return { ok: true, value: Math.floor(total) };
}
