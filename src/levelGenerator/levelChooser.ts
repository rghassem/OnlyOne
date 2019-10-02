import { writeFileSync } from "fs";
import { Solution } from "../solver";
import { strategyList } from "../strategy";
import { LevelSequence } from "../levels";

type LevelAnalysisData = Array<number>;

const NumLevels = 999;
const LevelCycleLength = 10;
const MaxAllowedPath = 26;

export function chooseLevels(levels: Array<LevelAnalysisData>) {

    console.log(`Analyzing...`);
    const scores = levels.map(level => calculateScore(level));
    const [maxScore, minScore] = findMaxMin(scores);

    console.log(`Sorting levels into buckets...`);

    type Bucket = Array<{ level: number, score: number }>;

    const buckets = new Array<Bucket>();
    for (let i = 0; i < 10; ++i) {
        buckets.push([]);
    }

    for (let i = 0; i < levels.length; ++i) {
        const level = levels[i][0];
        const inputScore = scores[i];
        if (inputScore === -1) continue
        //const adjustedScore = (inputScore - minScore) / (maxScore - minScore);
        // const normalizedScore = adjustedScore === 1 ? 9.9999999 : adjustedScore * 10;
        const normalizedScore = inputScore === 1 ? 9.9999999 : inputScore * 10;
        const bucket = Math.floor(normalizedScore);
        try {
            buckets[bucket].push({ level, score: normalizedScore });
        }
        catch (e) {
            console.log(`Error at Bucket: ${bucket}, inputScore: ${inputScore}, Normal: ${normalizedScore}, max: ${maxScore}, min: ${minScore}`);
        }
    }

    printBuckets();

    const releventNumLevels = Math.min(NumLevels, levels.length - 10);
    const minBucketSize = Math.ceil(releventNumLevels / 10);

    console.log(`Equalizing buckets. Need ${minBucketSize} per bucket`);

    const firstHalfBuckets = Math.ceil(LevelCycleLength / 2) + 1;
    for (let i = 0; i < firstHalfBuckets; ++i) {
        if (buckets[i].length < minBucketSize) {
            let reach = 1;
            while (buckets[i].length < minBucketSize) {
                let diff = minBucketSize - buckets[i].length;
                const sourceBucket = buckets[i + reach];
                const maxPull = Math.min(diff, sourceBucket.length);
                console.log(`Pulling ${maxPull} from bucket ${i + reach + 1} to fill bucket ${i + 1}`);
                buckets[i].push(...sourceBucket.splice(0, maxPull));
                reach++;
            }
        }
    }
    for (let i = LevelCycleLength - 1; i >= 1; --i) {
        if (buckets[i].length < minBucketSize) {
            let reach = -1;
            while (buckets[i].length < minBucketSize) {
                let diff = minBucketSize - buckets[i].length;
                const sourceBucket = buckets[i + reach];
                const maxPull = Math.min(diff, sourceBucket.length);
                console.log(`Pulling ${maxPull} from bucket ${i + reach + 1} to fill bucket ${i + 1}`);
                buckets[i].push(...sourceBucket.splice(0, maxPull));
                reach--;
            }
        }
    }

    printBuckets();

    console.log("Choosing levels")
    const levelsOut = new Array<number>();
    while (levelsOut.length < releventNumLevels) {
        const bucketIndex = levelsOut.length % LevelCycleLength;
        const bucket = buckets[bucketIndex];
        const levelRecord = bucket.pop();
        if (!levelRecord) { throw new Error(`Ran out of levels in bucket ${bucketIndex}`) };
        levelsOut.push(levelRecord.level);
    }

    console.log('Done');
    return levelsOut;


    function printBuckets() {
        console.log("")
        for (let i = 0; i < 10; ++i) {
            console.log(`Bucket ${i + 1} has ${buckets[i].length} levels`);
        }
        console.log("")
    }
}

function findMaxMin(array: Array<number>) {
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;
    for (const num of array) {
        if (num > max) max = num;
        if (num < min) min = num;
    }
    return [max, min];
}


function calculateScore(levelData: LevelAnalysisData) {
    //const levelNum = levelData[0];
    const numberSuccessfulStrategies = levelData[1];
    const shortestPathLength = levelData[2];
    //const avgSteps = levelData[3];
    //const avgNumSolution = levelData[4];
    if (shortestPathLength > MaxAllowedPath) return -1;

    const stratScore = 1 - (numberSuccessfulStrategies / strategyList.length);
    const pathScore = shortestPathLength / MaxAllowedPath;

    //(stratScore + pathScore) / 2;
    //console.log((Math.pow(pathScore, 2) + Math.pow(stratScore, 2)) / 2)
    return (Math.pow(pathScore, 2) + Math.pow(stratScore, 2)) / 2;
}