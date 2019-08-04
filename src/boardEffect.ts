export enum BoardEffectType {
    Destroy,
    Fall,
    Move,
    Score,
    ScoreDestroy,
    Victory,
    NextLevel
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