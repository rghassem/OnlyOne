import { onLetterPressed } from "./letters";
import { drawEffects, events, resetScreen, CellHeight, CellWidth, FontFamily } from "./render";
import { updateState, checkWin, resetScore, checkLose } from "./gameState";
import { runAnimations, wait, clearAnimations } from "./animation";
import { maxY, maxX, Gameboard } from "./board";
import { makeButton } from "./button";
import { shootSound, bonusSound, bgmusic, blockSound } from "./sounds";
import { winScreen, getLevel, loseScreen } from "./levels";
import { BoardEffectType, BoardEffect } from "./boardEffect";
import { LetterEntity } from "./letterEntity";
import { solve } from "./solver";

declare var FontFaceObserver: any;

const EnableSolver = false;

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();
console.log(`window.devicePixelRatio: ${window.devicePixelRatio}`);

//Letter stage
const letterStage = new PIXI.Container();
app.stage.addChild(letterStage);


//Reset button
let button: PIXI.Graphics;
let solveButton: PIXI.Graphics;
let skipButton: PIXI.Graphics;

//Initialize renderer stuff
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
(<any>app).renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

function resize(resizeRenderer: boolean = false) {

    if (resizeRenderer) {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    const letterStageWidth = CellWidth * maxX;
    const letterStageHeight = CellHeight * maxY;
    letterStage.x = app.screen.width / 2 - letterStageWidth / 2;
    letterStage.y = app.screen.height / 2 - letterStageHeight / 2;

    if (button) {
        button.x = letterStage.x + 70;
        button.y = letterStage.y + letterStageHeight + 75;
    }

    if (skipButton) {
        skipButton.x = letterStage.x + 170;
        skipButton.y = letterStage.y + letterStageHeight + 75;
    }

    if (solveButton) {
        solveButton.x = letterStage.x + 400;
        solveButton.y = letterStage.y + 300;
    }

    const actualWidth = letterStageWidth + 0.15 * letterStageWidth;
    const scaleFactor = app.screen.width / actualWidth;
    if (scaleFactor < 1) {
        const scaleAdjustment = (1 - scaleFactor) / 2;
        app.stage.x = app.screen.width * scaleAdjustment;
        app.stage.y = app.screen.height * scaleAdjustment;
        app.stage.scale.set(scaleFactor);
    }
}

window.onresize = () => {
    resize(true);
}

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

var font = new FontFaceObserver(FontFamily);
font.load(null, 5000).then(function () {
    console.log('Font is available');
    start();
}, function () {
    console.log('Font is not available after waiting 5 seconds');
});


window.onload = () => {
    start();
}

export let currentLevel = 0;

async function start() {

    //Iniitalize letter stage
    let resolving = false;
    let specialScreen = false;

    button = makeButton(app.stage, 80, 28, "Reset", async () => {
        shootSound();
        specialScreen = false;
        const board = await reset(getLevel(currentLevel));
        gameboard = board;
        resolving = false;
    });

    skipButton = makeButton(app.stage, 80, 28, "Skip", async () => {
        specialScreen = false;
        shootSound();
        ++currentLevel;
        const board = await reset(getLevel(currentLevel));
        gameboard = board;
        resolving = false;
    });

    if (EnableSolver) {
        solveButton = makeButton(app.stage, 80, 28, "Solve", async () => {
            resolving = true;
            const result = solve(gameboard);
            while (result.solved && result.solution.moves.length > 0 && !checkWin(gameboard)) {
                const turn = result.solution.moves.shift()!;
                const move = gameboard.getLetterEntity(turn.x, turn.y)
                if (!move) {
                    throw new Error(`Invalid move from AI (${turn.x}, ${turn.y})`);
                }
                await resolveMove(move);
            }
            resolving = false;
        });
    }

    resize();

    //Run animation system
    app.ticker.add(() => {
        runAnimations(app.ticker.elapsedMS / 1000);
    });

    const queryParams = new URLSearchParams(new URL(document.URL).search);
    const paramLevel = queryParams.get("level");
    const forceLevel = paramLevel && parseInt(paramLevel) ? parseInt(paramLevel) : null;

    currentLevel = forceLevel || Number(window.localStorage.getItem('level')) || 0;

    let gameboard = getLevel(currentLevel); //TODO: Clean up
    gameboard = await reset(getLevel(currentLevel));

    events.onLetterClick = (entity: LetterEntity) => {
        if (resolving) return;
        resolving = true;
        resolveMove(entity).then(() => resolving = false);
    }

    async function resolveMove(entity: LetterEntity) {
        let effects = onLetterPressed(gameboard, entity);
        while (effects.length !== 0) {
            await drawEffects(letterStage, gameboard, effects);
            effects = updateState(gameboard, effects);
        }

        if (checkWin(gameboard)) {
            changeLevel(currentLevel + 1);
        } else if (checkLose(gameboard)) {
            playLoseScreen();
        }
    }

    async function playLoseScreen() {
        specialScreen = true;
        gameboard = await reset(loseScreen());
        blockSound();
        await wait(0.1);
        blockSound();
        await wait(0.2);
        blockSound();
        await wait(0.7);
        const destroyWinLetters = gameboard.entities
            .map(entity => {
                if (entity.letter !== undefined)
                    return { entity, effect: BoardEffectType.Destroy }
                else return null;
            })
            .filter(effect => effect !== null) as BoardEffect[];
        if (specialScreen) await drawEffects(letterStage, gameboard, destroyWinLetters);
        if (specialScreen) {
            gameboard = await reset(getLevel(currentLevel));
            specialScreen = false;
        }
    }

    async function changeLevel(level: number) {
        window.localStorage.setItem('level', '' + level);
        specialScreen = true;
        gameboard = await reset(winScreen());
        bonusSound();
        await wait(0.7);
        bonusSound();
        await wait(0.7);
        const destroyWinLetters = gameboard.entities
            .map(entity => {
                if (entity.letter !== undefined)
                    return { entity, effect: BoardEffectType.Destroy }
                else return null;
            })
            .filter(effect => effect !== null) as BoardEffect[];
        if (level === 1) bgmusic();
        if (specialScreen) {
            if (specialScreen) await drawEffects(letterStage, gameboard, destroyWinLetters);
            if (specialScreen && currentLevel !== level) { //in case skip during win anim
                currentLevel = level;
                gameboard = await reset(getLevel(level));
            }
            specialScreen = false;
        }
    }

    async function reset(newBoard: Gameboard) {
        clearAnimations();
        resetScore(gameboard);
        await resetScreen(newBoard, letterStage);
        return newBoard;
    }
}