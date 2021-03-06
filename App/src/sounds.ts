//Soundjs include. Credit: https://github.com/kittykatattack/sound.js
declare var sounds: any;
declare var soundEffect: any;
declare var makeSound: any;

let volume = 0.5;
let muted = false;

const explosion = "assets/explosion.wav";
const bounce = "assets/bounce.wav";
const block = "assets/block.wav";
const music = "assets/PerituneMaterial_Ramble_small.mp3";

sounds.load([explosion, bounce, music, block]);
const allSoundsLoaded = new Promise<void>((resolve, reject) => {
    sounds.whenLoaded = () => {
        resolve();
    }
});

export function toggleSound() {
    muted = !muted;
    for (let sound of [explosion, bounce, block, music]) {
        sounds[sound].pause();
    }
    return muted;
}

export function shootSound() {
    !muted &&
    soundEffect(
        1046.5,           //frequency
        0,                //attack
        0.3,              //decay
        "sawtooth",       //waveform
        volume,           //Volume
        -0.8,             //pan
        0,                //wait before playing
        1200,             //pitch bend amount
        false,            //reverse bend
        0,                //random pitch range
        25,               //dissonance
        [0.2, 0.2, 2000], //echo array: [delay, feedback, filter]
        undefined         //reverb array: [duration, decay, reverse?]
    );
}

export function explosionSound() {
    if (muted) return;
    sounds[explosion].volume = volume;
    sounds[explosion].play();
}

export function blockSound() {
    if (muted) return;
    sounds[block].volume = volume;
    sounds[block].play();
}

export function bounceSound(delay = 0) {
    if (muted) return;
    const sound = sounds[bounce];
    sound.volume = volume;
    sound.setEcho(0.1, 0.1, 500);
    if (delay > 0) {
        setTimeout(() => { sound.play() }, delay * 1000)
    }
    else {
        sound.play();
    }
}

export function bonusSound() {
    if (muted) return;
    //D
    soundEffect(587.33, 0, 0.2, "square", volume, 0, 0);
    //A
    soundEffect(880, 0, 0.2, "square", volume, 0, 0.1);
    //High D
    soundEffect(1174.66, 0, 0.3, "square", volume, 0, 0.2);
}

export async function bgmusic() {
    if (muted) return;
    await allSoundsLoaded;
    const song = sounds[music];
    if (!song.playing && !muted) {
        console.log("beginning song playback");
        song.volume = 0;
        song.playbackRate = 0.8;
        song.loop = true;
        song.play();
        song.fadeIn(5, 0.2);
    }
}
