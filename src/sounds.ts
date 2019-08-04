//Soundjs include. Credit: https://github.com/kittykatattack/sound.js
declare var sounds: any;
declare var soundEffect: any;
declare var makeSound: any;

const volume = 0.5;

const explosion = "assets/explosion.wav";
const bounce = "assets/bounce.wav";
const music = "assets/PerituneMaterial_Mealtime_Rag.mp3";

sounds.load([explosion, bounce, music]);

export function shootSound() {
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
    sounds[explosion].play();
}

export function bounceSound(delay = 0) {
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
    //D
    soundEffect(587.33, 0, 0.2, "square", volume, 0, 0);
    //A
    soundEffect(880, 0, 0.2, "square", volume, 0, 0.1);
    //High D
    soundEffect(1174.66, 0, 0.3, "square", volume, 0, 0.2);
}

export function bgmusic() {
    if (!sounds[music].playing) {
        sounds[music].volume = 0.3;
        sounds[music].play();
        sounds[music].loop = true;
    }
}
