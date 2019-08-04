import { onLetterPressed } from "./letters";
import { initializeLetters, drawEffects, events, drawBoard } from "./render";
import { updateState } from "./gameState";
import { runAnimations } from "./animation";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();
const letterStage = new PIXI.Container();
letterStage.x = 250;
letterStage.y = 10;
app.stage.addChild(letterStage);

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
    //Run animation system
    app.ticker.add(() => {
        runAnimations(app.ticker.elapsedMS / 1000);
    });
    initializeLetters(letterStage);

    let resolving = false;
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
    }
}
