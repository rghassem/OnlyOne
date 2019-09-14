const solved = require("./solver-output")
const fs = require('fs');

const NumLevels = 999;
const LevelCycleLength = 10;

const levels = solved.levels;
const scores = solved.scores;

console.log(`Analyzing...`);
const [maxScore, minScore] = findMaxMin(scores);

console.log(`Sorting levels into buckets...`);

type Bucket = Array<{ level: number, score: number }>;

const buckets = new Array<Bucket>();
for (let i = 0; i < 10; ++i) {
    buckets.push([]);
}

for (let i = 0; i < levels.length; ++i) {
    const inputScore = scores[i];
    const adjustedScore = (inputScore - minScore) / (maxScore - minScore);
    const normalizedScore = adjustedScore === 1 ? 0.9999999 : adjustedScore * 10;
    const bucket = Math.floor(normalizedScore);
    try {
        buckets[bucket].push({ level: levels[i], score: normalizedScore });
    }
    catch (e) {
        console.log(`Error at Bucket: ${bucket}, inputScore: ${inputScore}, adjusted: ${adjustedScore}, Normal: ${normalizedScore}, max: ${maxScore}, min: ${minScore}`);
    }
}

printBuckets();

console.log(`Equalizing buckets`);
const minBucketSize = Math.ceil(NumLevels / 10);
const firstHalfBuckets = Math.ceil(LevelCycleLength / 2) + 1;
for (let i = 0; i < firstHalfBuckets; ++i) {
    if (buckets[i].length < minBucketSize) {
        let diff = minBucketSize - buckets[i].length;
        let reach = 1;
        while (buckets[i].length < minBucketSize) {
            const sourceBucket = buckets[i + reach];
            console.log(`Pulling from bucket ${i + reach} to fill bucket ${i}`);
            const maxPull = Math.min(diff, sourceBucket.length);
            buckets[i].push(...sourceBucket.splice(0, maxPull));
            reach++;
        }
    }
}
for (let i = LevelCycleLength - 1; i >= firstHalfBuckets; --i) {
    if (buckets[i].length < minBucketSize) {
        let diff = minBucketSize - buckets[i].length;
        let reach = -1;
        while (buckets[i].length < minBucketSize) {
            const sourceBucket = buckets[i + reach];
            console.log(`Pulling from bucket ${i + reach} to fill bucket ${i}`);
            const maxPull = Math.min(diff, sourceBucket.length);
            buckets[i].push(...sourceBucket.splice(0, maxPull));
            reach--;
        }
    }
}

printBuckets();

console.log("Choosing levels")
const levelsOut = new Array<number>();
while (levelsOut.length < NumLevels) {
    const bucketIndex = levelsOut.length % LevelCycleLength;
    const bucket = buckets[bucketIndex];
    const levelRecord = bucket.pop();
    if (!levelRecord) { throw new Error(`Ran out of levels in bucket ${bucketIndex}`) };
    levelsOut.push(levelRecord.level);
}

console.log("Writing generatedLevels.json");
fs.writeFileSync('generatedLevels.json', JSON.stringify(levelsOut));

console.log('Done');

function findMaxMin(array: Array<number>) {
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;
    for (const num of array) {
        if (num > max) max = num;
        if (num < min) min = num;
    }
    return [max, min];
}

function printBuckets() {
    console.log("")
    for (let i = 0; i < 10; ++i) {
        console.log(`Bucket ${i + 1} has ${buckets[i].length} levels`);
    }
    console.log("")
}