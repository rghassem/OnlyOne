import { onLetterPressed } from "./letters";
import { initializeLetters, drawEffects, events, drawBoard } from "./render";
import { BoardEffect } from "./boardEffect";
import { updateState } from "./gameState";
import { runAnimations, animate, TweeningFunctions } from "./animation";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

//Run animation system
app.ticker.add(() => {
    runAnimations(app.ticker.elapsedMS / 1000);
});

initializeLetters(app);

let resolving = false;
events.onLetterClick = (x: number, y: number) => {
    if (resolving) return;
    resolving = true;
    resolveMove(x, y).then(() => resolving = false);
}

async function resolveMove(x: number, y: number) {
    let effects = onLetterPressed(x, y);
    while (effects.length !== 0) {
        await drawEffects(app, effects);
        effects = updateState(effects);
    }
    drawBoard(app);
}

