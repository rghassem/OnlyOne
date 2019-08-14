import { Letter, LetterEntity } from "./board";

export enum BoardEffectType {
    Destroy,
    Explode,
    Fall,
    Move,
    Transform,
    BlockDestruction,
    Score,
    ScoreDestroy
}

export interface BoardEffect {
    effect: BoardEffectType;
    entity: LetterEntity;
}

export interface MoveEffect extends BoardEffect {
    toX: number,
    toY: number
}

export interface ChangeEffect extends BoardEffect {
    changeTo: Letter
}