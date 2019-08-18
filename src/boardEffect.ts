import { LetterEntity, Letter } from "./letterEntity";

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

export type BoardEffect = BasicBoardEffect | MoveEffect | TransformEffect;

export type BasicBoardEffect = {
    effect: Exclude<BoardEffectType, BoardEffectType.Move | BoardEffectType.Fall | BoardEffectType.Transform>
    entity: LetterEntity;
}

export type MoveEffect = {
    effect: BoardEffectType.Move | BoardEffectType.Fall;
    entity: LetterEntity;
    toX: number,
    toY: number
}

export type TransformEffect = {
    entity: LetterEntity;
    effect: BoardEffectType.Transform;
    changeTo: Letter
}