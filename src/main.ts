import { onLetterPressed } from "./letters";
import { drawEffects, events, drawBoard, resetScreen, CellHeight, CellWidth } from "./render";
import { updateState, checkWinAndResetOneScore } from "./gameState";
import { runAnimations, wait } from "./animation";
import { resetBoard, maxY, maxX, gameboard, Letter } from "./board";
import { makeButton } from "./button";
import { shootSound, bonusSound, bgmusic } from "./sounds";
import { levels, winScreen } from "./levels";
import { BoardEffectType, BoardEffect } from "./boardEffect";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

//Letter stage
const letterStage = new PIXI.Container();
letterStage.y = 20;
app.stage.addChild(letterStage);



//Reset button
let button: PIXI.Graphics


function resize() {
    app.renderer.view.style.position = "absolute";
    app.renderer.view.style.display = "block";
    app.renderer.autoResize = true;

    app.renderer.resize(window.innerWidth, window.innerHeight);
    const letterStageWidth = CellWidth * maxX;
    const letterStageHeight = CellHeight * maxY;
    letterStage.x = window.innerWidth / 2 - letterStageWidth / 2;
    letterStage.y = window.innerHeight / 2 - letterStageHeight / 2;

    if (button) {
        button.x = letterStage.x + letterStageWidth + 100;
        button.y = letterStage.y + letterStageHeight - 50;
    }
}

resize();
window.onresize = resize;

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);


// // Load them google fonts before starting...!
(<any>window).WebFontConfig = {
    google: {
        families: ['VT323'],
    },

    active() {
        start();
    },
};

/* eslint-disable */
// include the web-font loader script
(function () {
    const wf = document.createElement('script');
    wf.src = `${document.location.protocol === 'https:' ? 'https' : 'http'
        }://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
    wf.type = 'text/javascript';
    wf.async = true;
    const s = document.getElementsByTagName('script')[0];
    if (s.parentNode) {
        s.parentNode.insertBefore(wf, s);
    }
}());
/* eslint-enabled */

function start() {
    let currentLevel = 0;

    //Iniitalize letter stage
    reset(levels[currentLevel]());
    button = makeButton(app.stage, 100, 50, "Reset", () => {
        shootSound();
        reset()
    });

    resize();

    //Run animation system
    app.ticker.add(() => {
        runAnimations(app.ticker.elapsedMS / 1000);
    });

    let resolving = false;
    events.onLetterClick = (x: number, y: number) => {
        bgmusic();
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

        if (checkWinAndResetOneScore()) {
            changeLevel(++currentLevel);
        }
    }

    async function changeLevel(level: number) {
        reset(winScreen());
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
        await drawEffects(letterStage, destroyWinLetters);
        reset(level < levels.length ? levels[level]() : undefined);
    }

}

function reset(preset?: string) {
    resetBoard(preset);
    resetScreen(letterStage);
}



