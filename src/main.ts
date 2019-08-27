import { onLetterPressed } from "./letters";
import { drawEffects, events, resetScreen, CellHeight, CellWidth } from "./render";
import { updateState, checkWin, resetScore } from "./gameState";
import { runAnimations, wait, clearAnimations } from "./animation";
import { newBoard, maxY, maxX, Gameboard, getLetterEntity } from "./board";
import { makeButton } from "./button";
import { shootSound, bonusSound, bgmusic } from "./sounds";
import { levels, winScreen } from "./levels";
import { BoardEffectType, BoardEffect } from "./boardEffect";
import { LetterEntity, Letter } from "./letterEntity";
import { minimax } from "./solver";

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


// // Load them google fonts before starting...!
(<any>window).WebFontConfig = {
    google: {
        families: ['VT323'],
    },

    active() {
        console.log(".active");
        start();
    },
};

/* eslint-disable */
// include the web-font loader script
(function () {
    const wf = document.createElement('script');
    wf.src = `${document.location !== null && document.location.protocol === 'https:' ? 'https' : 'http'
        }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    const s = document.getElementsByTagName('script')[0];
    if (s.parentNode) {
        s.parentNode.insertBefore(wf, s);
    }
}());
/* eslint-enabled */

export let currentLevel = 0;

async function start() {

    //Iniitalize letter stage
    let resolving = false;
    let resetting = Promise.resolve();


    button = makeButton(app.stage, 80, 28, "Reset", () => {
        shootSound();
        reset(currentLevel < levels.length ? levels[currentLevel]() : undefined)
            .then(board => gameboard = board);
    });

    skipButton = makeButton(app.stage, 80, 28, "Skip", () => {
        shootSound();
        currentLevel = 300;
        reset().then(board => gameboard = board);
    });

    resize();

    //Run animation system
    app.ticker.add(() => {
        runAnimations(app.ticker.elapsedMS / 1000);
    });


    let gameboard = newBoard(levels[currentLevel]());
    gameboard = await reset(levels[currentLevel]());

    // events.onLetterClick = (entity: LetterEntity) => {
    //     if (resolving) return;
    //     resolving = true;
    //     resolveMove(entity).then(() => resolving = false);
    // }

    //Test
    events.onLetterClick = async (entity: LetterEntity) => {
        while (!checkWin(gameboard)) {
            let { moves: nextMoves, score } = minimax(gameboard, 0);
            if (nextMoves.length === 0) {
                console.log("Unsolvable");
                break;
            }
            while (nextMoves.length > 0) {
                const moveCoords = nextMoves.shift()!;
                const move = getLetterEntity(gameboard, moveCoords.x, moveCoords.y)
                if (!move) {
                    throw new Error(`Invalid move from AI (${moveCoords.x}, ${moveCoords.y})`);
                }
                console.log(JSON.stringify(move));
                await resolveMove(move);
            }

        }
    }

    async function resolveMove(entity: LetterEntity) {
        let effects = onLetterPressed(gameboard, entity);
        while (effects.length !== 0) {
            await drawEffects(letterStage, gameboard, effects);
            effects = updateState(gameboard, effects);
        }

        if (checkWin(gameboard)) {
            changeLevel(++currentLevel);
        }
    }

    async function changeLevel(level: number) {
        gameboard = await reset(winScreen());
        bonusSound();
        await wait(0.7);
        bonusSound();
        await wait(0.7);
        const destroyWinLetters = gameboard
            .map(entity => {
                if (entity.letter !== undefined)
                    return { entity, effect: BoardEffectType.Destroy }
                else return null;
            })
            .filter(effect => effect !== null) as BoardEffect[];
        if (level === 1) bgmusic();
        await drawEffects(letterStage, gameboard, destroyWinLetters);
        gameboard = await reset(level < levels.length ? levels[level]() : undefined);
    }


    async function reset(preset?: string) {
        await resetting;
        clearAnimations();
        resetScore(gameboard);
        const board = newBoard(preset);
        resetting = resetScreen(board, letterStage);
        await resetting;
        return board;
    }
}