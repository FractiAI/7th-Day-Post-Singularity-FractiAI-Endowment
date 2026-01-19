import { describe, it, expect } from 'vitest';
import { FSRRetrievalEngine } from '../core/fsr-retrieval.js';
import { TransmissionGearSelector } from '../core/transmission-gears.js';

describe('FSRRetrievalEngine', () => {
    const gearSelector = new TransmissionGearSelector();
    const engine = new FSRRetrievalEngine(gearSelector);

    it('should return deterministic scores for identical queries', async () => {
        const query = { text: 'quantum hydrogen spin' };
        const content = 'This code implements a quantum hydrogen spin cloud protocol.';

        // @ts-ignore - reaching into private for testing
        const score1 = engine.calculateSimilarity(query.text, content);
        // @ts-ignore
        const score2 = engine.calculateSimilarity(query.text, content);

        expect(score1).toBe(score2);
        expect(score1).toBeGreaterThan(0.2); // Base score + similarity
    });

    it('should return higher scores for relevant content', async () => {
        const query = { text: 'quantum' };
        const relevantContent = 'Theoretical quantum physics engine.';
        const irrelevantContent = 'Banana muffins are delicious but not scientific.';

        // @ts-ignore
        const relevantScore = engine.calculateSimilarity(query.text, relevantContent);
        // @ts-ignore
        const irrelevantScore = engine.calculateSimilarity(query.text, irrelevantContent);

        expect(relevantScore).toBeGreaterThan(irrelevantScore);
    });

    it('should handle empty or short queries gracefully', async () => {
        // @ts-ignore
        const score = engine.calculateSimilarity('', 'Some content');
        expect(score).toBe(0);
    });
});
