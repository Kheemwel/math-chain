import { Preferences } from '@capacitor/preferences';
import { isInt, parseSnapshot, type RunSnapshot } from './snapshot';

const RUN_KEY = 'math-chain:run';
const BOARD_KEY = 'math-chain:leaderboard';
export const LEADERBOARD_SIZE = 10;

export interface RunRecord {
	id: string;
	round: number;
	bestHit: number;
	bestFormula: string;
	endedAt: number;
}

async function readJson(key: string): Promise<unknown> {
	try {
		const { value } = await Preferences.get({ key });
		return value ? JSON.parse(value) : null;
	} catch {
		return null; // missing or corrupted data must never crash the app
	}
}

async function writeJson(key: string, data: unknown): Promise<void> {
	try {
		await Preferences.set({ key, value: JSON.stringify(data) });
	} catch (error) {
		console.error('Could not save', key, error);
	}
}

function parseRecord(raw: unknown): RunRecord | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const { id, round, bestHit, bestFormula, endedAt } = raw as Record<string, unknown>;
	if (typeof id !== 'string' || typeof bestFormula !== 'string') return null;
	if (!isInt(round) || round < 1 || !isInt(bestHit) || bestHit < 0 || !isInt(endedAt)) return null;
	return { id, round, bestHit, bestFormula, endedAt };
}

const byRank = (a: RunRecord, b: RunRecord) =>
	b.round - a.round || b.bestHit - a.bestHit || b.endedAt - a.endedAt;

// ----- Current run -----

export async function saveRun(snapshot: RunSnapshot): Promise<void> {
	await writeJson(RUN_KEY, snapshot);
}

export async function loadRun(): Promise<RunSnapshot | null> {
	return parseSnapshot(await readJson(RUN_KEY));
}

export async function clearRun(): Promise<void> {
	try {
		await Preferences.remove({ key: RUN_KEY });
	} catch (error) {
		console.error('Could not clear the saved run', error);
	}
}

// ----- Leaderboard -----

export async function loadLeaderboard(): Promise<RunRecord[]> {
	const raw = await readJson(BOARD_KEY);
	if (!Array.isArray(raw)) return [];
	return raw
		.flatMap((item) => {
			const record = parseRecord(item);
			return record ? [record] : [];
		})
		.sort(byRank)
		.slice(0, LEADERBOARD_SIZE);
}

export async function addRun(record: RunRecord): Promise<RunRecord[]> {
	const runs = [...(await loadLeaderboard()), record].sort(byRank).slice(0, LEADERBOARD_SIZE);
	await writeJson(BOARD_KEY, runs);
	return runs;
}
