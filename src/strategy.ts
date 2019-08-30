import { RandomNumberGenerator } from "./randomNumberGenerator";

export interface Strategy {
    name: string,
    score: number,
    allLetter: number,
    firstLetter: number,
    secondLetter: number,
    thirdLetter: number
    invisibles: number
    letterCount: number
}

const generator = new RandomNumberGenerator(377827);
const rng = () => generator.get();

export const weightSets: Array<Strategy> = [
    { name: "Base", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0 },
    { name: "LetterOneFirst", score: 100, allLetter: 1, firstLetter: 10, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, },
    { name: "LetterTwoFirst", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 10, thirdLetter: 0, invisibles: 0.1, letterCount: 0, },
    { name: "LetterThreeFirst", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 10, invisibles: 0.1, letterCount: 0, },
    { name: "RemoveI", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 10, letterCount: 1, },
    { name: "RemoveAllLetters", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 10 },

    { name: "Rando1", score: 100, allLetter: rng(), firstLetter: rng(), secondLetter: rng(), thirdLetter: rng(), invisibles: rng(), letterCount: rng() },
    { name: "Rando2", score: 100, allLetter: rng(), firstLetter: rng(), secondLetter: rng(), thirdLetter: rng(), invisibles: rng(), letterCount: rng() },
    { name: "Rando3", score: 100, allLetter: rng(), firstLetter: rng(), secondLetter: rng(), thirdLetter: rng(), invisibles: rng(), letterCount: rng() },
    { name: "Rando4", score: 100, allLetter: rng(), firstLetter: rng(), secondLetter: rng(), thirdLetter: rng(), invisibles: rng(), letterCount: rng() }
];