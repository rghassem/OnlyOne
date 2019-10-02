import { RandomNumberGenerator } from "./randomNumberGenerator";

export interface Strategy {
    name: string,
    score: number,
    allLetter: number,
    firstLetter: number,
    secondLetter: number,
    thirdLetter: number,
    invisibles: number,
    letterCount: number,
    bombsBeneath: number
}

const generator = new RandomNumberGenerator(377827);
const rng = () => generator.get();

export const strategyList: Array<Strategy> = [
    //{ name: "Base", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    { name: "LetterOneFirst", score: 100, allLetter: 1, firstLetter: 10, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    { name: "LetterTwoFirst", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 10, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    { name: "LetterThreeFirst", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 10, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    //{ name: "RemoveI", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 10, letterCount: 1, bombsBeneath: 0 },
    //{ name: "AvoidBombs", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 10 },
    //{ name: "AvoidBombMaybe", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 1 },
    { name: "AvoidBombSerious", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 100 },

    {
        name: "Rando1", score: 100, allLetter: 0.37853223593964336, firstLetter: 0.9396476337448559,
        secondLetter: 0.8739626200274349, thirdLetter: 0.9376500342935528, invisibles: 0.2942901234567901, letterCount: 0.4037594307270233, bombsBeneath: 0.5777863511659808
    },
    {
        name: "Rando2", score: 100, allLetter: 0.20217335390946503, firstLetter: 0.6256858710562414, secondLetter: 0.715607853223594, thirdLetter: 0.07996399176954733,
        invisibles: 0.9564086076817558, letterCount: 0.767781207133059, bombsBeneath: 0.3443287037037037
    },
    {
        name: "Rando3", score: 100, allLetter: 0.8125943072702332, firstLetter: 0.15097307956104253, secondLetter: 0.4119341563786008, thirdLetter: 0.6109096364883402,
        invisibles: 0.28185013717421126, letterCount: 0.6994470164609053, bombsBeneath: 0.7680212620027435
    },
    {
        name: "Rando9", score: 100, allLetter: 0.30613854595336076, firstLetter: 0.6059370713305898, secondLetter: 0.03202160493827161, thirdLetter: 0.044268689986282576,
        invisibles: 0.9544067215363512, letterCount: 0.14823816872427983, bombsBeneath: 0.974528463648834
    },
    {
        name: "Rando10", score: 100, allLetter: 0.3005615569272977, firstLetter: 0.7343621399176955, secondLetter: 0.5135845336076817, thirdLetter: 0.06106824417009602,
        invisibles: 0.20706018518518518, letterCount: 0.07810356652949245, bombsBeneath: 0.6525934499314129
    },
    {
        name: "Rando11", score: 100, allLetter: 0.9829989711934156, firstLetter: 0.08475222908093279, secondLetter: 0.49180384087791496, thirdLetter: 0.4788451646090535,
        invisibles: 0.9501971879286694, letterCount: 0.9953660836762689, bombsBeneath: 0.11126543209876544
    },
    {
        name: "Rando12", score: 100, allLetter: 0.091105109739369, firstLetter: 0.5799468449931413, secondLetter: 0.2969264403292181, thirdLetter: 0.9241426611796982,
        invisibles: 0.6622127914951988, letterCount: 0.45249485596707817, bombsBeneath: 0.8659765089163237
    },
    {
        name: "Rando15", score: 100, allLetter: 0.790423525377229, firstLetter: 0.9405306927297667, secondLetter: 0.08729423868312758, thirdLetter: 0.13503515089163237,
        invisibles: 0.1732596021947874, letterCount: 0.6988811728395061, bombsBeneath: 0.5051097393689986
    }
];
/*
{
        name: "Rando1", score: 100, allLetter: 0.37853223593964336, firstLetter: 0.9396476337448559, secondLetter: 0.8739626200274349, thirdLetter: 0.9376500342935528,
        invisibles: 0.2942901234567901, letterCount: 0.4037594307270233
    },
    {
        name: "Rando2", score: 100, allLetter: 0.5777863511659808, firstLetter: 0.20217335390946503, secondLetter: 0.6256858710562414, thirdLetter: 0.715607853223594,
        invisibles: 0.07996399176954733, letterCount: 0.9564086076817558
    },
    {
        name: "Rando3", score: 100, allLetter: 0.767781207133059, firstLetter: 0.3443287037037037, secondLetter: 0.8125943072702332, thirdLetter: 0.15097307956104253,
        invisibles: 0.4119341563786008, letterCount: 0.6109096364883402
    },
    {
        name: "Rando4", score: 100, allLetter: 0.28185013717421126, firstLetter: 0.6994470164609053, secondLetter: 0.7680212620027435, thirdLetter: 0.5770790466392318,
        invisibles: 0.623533950617284, letterCount: 0.7005958504801097
    },

    {
        name: "Rando5", score: 100, allLetter: 0.4533264746227709, firstLetter: 0.6008616255144033, secondLetter: 0.8253000685871056, thirdLetter: 0.3272590877914952,
        invisibles: 0.048096707818930044, letterCount: 0.5588005829903978
    },
    {
        name: "Rando6", score: 100, allLetter: 0.6155435528120713, firstLetter: 0.38190586419753086, secondLetter: 0.31776406035665294, thirdLetter: 0.734846536351166,
        invisibles: 0.01895576131687243, letterCount: 0.5188571673525377
    },
    // {
    //     name: "Rando7", score: 100, allLetter: 0.10183470507544581, firstLetter: 0.3759130658436214, secondLetter: 0.5787465706447188, thirdLetter: 0.1331747256515775,
    //     invisibles: 0.8694444444444445, letterCount: 0.9140989368998629
    // },
    {
        name: "Rando8", score: 100, allLetter: 0.24553326474622772, firstLetter: 0.9162165637860082, secondLetter: 0.9415809327846365, thirdLetter: 0.855576989026063,
        invisibles: 0.9328960905349795, letterCount: 0.07785922496570645
    },
    {
        name: "Rando9", score: 100, allLetter: 0.37997256515775035, firstLetter: 0.3361496913580247, secondLetter: 0.7396004801097393, thirdLetter: 0.23538665980795612,
        invisibles: 0.5426440329218107, letterCount: 0.3434713648834019
    },
    {
        name: "Rando10", score: 100, allLetter: 0.8384859396433471, firstLetter: 0.9690457818930042, secondLetter: 0.30613854595336076, thirdLetter: 0.6059370713305898,
        invisibles: 0.03202160493827161, letterCount: 0.044268689986282576
    },
    {
        name: "Rando11", score: 100, allLetter: 0.9544067215363512, firstLetter: 0.14823816872427983, secondLetter: 0.974528463648834, thirdLetter: 0.3005615569272977,
        invisibles: 0.7343621399176955, letterCount: 0.5135845336076817
    },
    {
        name: "Rando12", score: 100, allLetter: 0.06106824417009602, firstLetter: 0.20706018518518518, secondLetter: 0.07810356652949245, thirdLetter: 0.6525934499314129,
        invisibles: 0.9829989711934156, letterCount: 0.08475222908093279
    },
    {
        name: "Rando13", score: 100, allLetter: 0.49180384087791496, firstLetter: 0.4788451646090535, secondLetter: 0.9501971879286694, thirdLetter: 0.9953660836762689,
        invisibles: 0.11126543209876544, letterCount: 0.091105109739369
    },
    {
        name: "Rando14", score: 100, allLetter: 0.5799468449931413, firstLetter: 0.2969264403292181, secondLetter: 0.9241426611796982, thirdLetter: 0.6622127914951988,
        invisibles: 0.45249485596707817, letterCount: 0.8659765089163237
    }
*/

// for (const strat of strategyList) {
//     console.log(JSON.stringify(strat));
// }

/*

*/