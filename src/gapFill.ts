import { MoveEffect, BoardEffectType } from "./effects/boardEffect";
import { getLetterEntity } from "./board";

export class Gap {
    constructor(
        public x: number,
        public y: number,
        public distance = 1
    ) { }
}

export function fillGaps(gaps: Array<Gap>): Array<MoveEffect> {
    let results = new Array<MoveEffect>();
    let orderedGaps = gaps.sort((g1, g2) => g1.y - g2.y);
    while (orderedGaps.length > 0) {
        //For each gap, three options
        const gap = gaps.pop()!;

        //1. Above us is the top of the level. Do nothing
        if (gap.y === 0) continue;

        //2. Above is a block. It should fall.
        const above = getLetterEntity(gap.x, gap.y - 1);
        if (above) {
            results.push({
                effect: BoardEffectType.Fall,
                x: above.x, y: above.y,
                toX: gap.x, toY: above.y + gap.distance
            });
            //..and push another gap to the list, preserving y ordering
            const insertIndex = orderedGaps.findIndex(gap => gap.y === gap.y - 1);
            orderedGaps.splice(insertIndex, 0, new Gap(gap.x, gap.y - 1, gap.distance));
            continue;
        }

        //3. Above is another (guaranteed unprocessed) gap. "Fuse" with it by increasing its distance
        const aboveGap = orderedGaps.find(other => other.x === gap.x && other.y === gap.y - 1);
        if (aboveGap) {
            aboveGap.distance += gap.distance;
        }
    }
    return results;
}