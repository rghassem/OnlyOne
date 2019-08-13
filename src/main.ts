import { onLetterPressed } from "./letters";
import { drawEffects, events, drawBoard, resetScreen, CellHeight, CellWidth } from "./render";
import { updateState, checkWin, resetScore } from "./gameState";
import { runAnimations, wait, clearAnimations } from "./animation";
import { resetBoard, maxY, maxX, gameboard, Letter } from "./board";
import { makeButton } from "./button";
import { shootSound, bonusSound, bgmusic } from "./sounds";
import { levels, winScreen } from "./levels";
import { BoardEffectType, BoardEffect } from "./boardEffect";

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

function start() {

    //Iniitalize letter stage
    let resolving = false;;
    let resetting = Promise.resolve();

    reset(levels[currentLevel]());

    button = makeButton(app.stage, 80, 28, "Reset", () => {
        shootSound();
        reset(currentLevel < levels.length ? levels[currentLevel]() : undefined);
    });

    skipButton = makeButton(app.stage, 80, 28, "Skip", () => {
        shootSound();
        currentLevel = 300;
        reset();
    });

    resize();

    //Run animation system
    app.ticker.add(() => {
        runAnimations(app.ticker.elapsedMS / 1000);
    });

    events.onLetterClick = (x: number, y: number) => {
        if (resolving) return;
        resolving = true;
        resolveMove(x, y).then(() => resolving = false);
    }

    async function resolveMove(x: number, y: number) {
        let effects = onLetterPressed(x, y);
        while (effects.length !== 0) {
            await drawEffects(letterStage, effects);
            effects = updateState(effects);
            drawBoard(letterStage);
        }

        if (checkWin()) {
            changeLevel(++currentLevel);
        }
    }

    async function changeLevel(level: number) {
        await reset(winScreen());
        drawBoard(letterStage);
        bonusSound();
        await wait(0.7);
        bonusSound();
        await wait(0.7);
        const destroyWinLetters = gameboard
            .map(entity => {
                if (entity.letter !== Letter.Blank && entity.letter !== undefined)
                    return { x: entity.x, y: entity.y, effect: BoardEffectType.Destroy }
                else return null;
            })
            .filter(effect => effect !== null) as BoardEffect[];
        if (level === 1) bgmusic();
        await drawEffects(letterStage, destroyWinLetters);
        await reset(level < levels.length ? levels[level]() : undefined);
    }


    async function reset(preset?: string) {
        await resetting;
        clearAnimations();
        resetScore();
        resetBoard(preset);
        resetting = resetScreen(letterStage);
        await resetting;
    }
}