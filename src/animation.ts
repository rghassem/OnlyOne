interface Animation {
    object: any,
    property: string,
    startingValue: number,
    targetValue: number,
    duration: number,
    tween: Tween,
    progress: number,
    stop: boolean,
    onDone: () => void
}

type Tween = (t: number) => number;

let animations = new Array<Animation>();

export function animate(object: any, property: string, targetValue: number, duration: number, tween: Tween) {
    const startingValue = object[property] as number;
    return new Promise<void>((resolve, reject) => {
        animations.push({
            object,
            property,
            startingValue,
            targetValue,
            duration,
            tween,
            progress: 0,
            stop: false,
            onDone: () => {
                resolve();
            }
        });
    });
}

export function wait(durationSeconds: number) {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, durationSeconds * 1000);
    });
}

export function runAnimations(delta: number) {
    for (const anim of animations) {
        anim.progress += (delta / anim.duration);

        if (anim.progress > 1) {
            anim.object[anim.property] = anim.targetValue;
            anim.stop = true;
            anim.onDone();
        }
        else {
            const currentValue = anim.startingValue + ((anim.targetValue - anim.startingValue) * anim.tween(anim.progress));
            anim.object[anim.property] = currentValue;
        }
    }
    animations = animations.filter(anim => !anim.stop);
}

export function clearAnimations() {
    animations.forEach(anim => anim.onDone());
    animations = [];
}

//reference: https://gist.github.com/gre/1650294
export const TweeningFunctions = {
    // no easing, no acceleration
    linear: function (t: number) { return t },
    // accelerating from zero velocity
    easeInQuad: function (t: number) { return t * t },
    // decelerating to zero velocity
    easeOutQuad: function (t: number) { return t * (2 - t) },
    // acceleration until halfway, then deceleration
    easeInOutQuad: function (t: number) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
    // accelerating from zero velocity 
    easeInCubic: function (t: number) { return t * t * t },
    // decelerating to zero velocity 
    easeOutCubic: function (t: number) { return (--t) * t * t + 1 },
    // acceleration until halfway, then deceleration 
    easeInOutCubic: function (t: number) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
    // accelerating from zero velocity 

    //Bounce, inspired by https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
    easeOutBounce: function (progress: number) {
        if (progress < (1 / 2.75)) {
            return 7.5625 * progress * progress;
        } else if (progress < (2 / 2.75)) {
            return 7.5625 * (progress -= (1.5 / 2.75)) * progress + .75;
        } else if (progress < (2.5 / 2.75)) {
            return 7.5625 * (progress -= (2.25 / 2.75)) * progress + .9375;
        } else {
            return 7.5625 * (progress -= (2.625 / 2.75)) * progress + .984375;
        }
    }
}


