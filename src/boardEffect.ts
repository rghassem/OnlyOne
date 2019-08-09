import { Letter } from "./board";

export enum BoardEffectType {
    Destroy,
    Fall,
    Move,
    Transform,
    Score,
    ScoreDestroy
}

export interface BoardEffect {
    x: number,
    y: number,
    effect: BoardEffectType;
}

export interface MoveEffect extends BoardEffect {
    toX: number,
    toY: number
}

export interface ChangeEffect extends BoardEffect {
    changeTo: Letter
}