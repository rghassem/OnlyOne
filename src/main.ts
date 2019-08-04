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
app.stage.addChild(letterStage);

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

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
    }
    drawBoard(letterStage);
}

