export class RandomNumberGenerator {
    constructor(public seed: number) { }
    get = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233280;
        return rnd;
    }
}