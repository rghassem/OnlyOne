export enum BoardEffectType {
    Destroy
}

export interface BoardEffect {
    x: number,
    y: number,
    effect: BoardEffectType;
}

