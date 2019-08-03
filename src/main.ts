import { onLetterPressed } from "./letters";
import { initializeLetters, drawEffects, events, drawBoard } from "./render";
import { BoardEffect } from "./boardEffect";
import { updateState } from "./gameState";

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

app.ticker.add(() => {
    gameLoop();
});

//Initialize
initializeLetters(app);

let pendingEffects = new Array<BoardEffect>();
let pendingClick: { x: number, y: number } | null = null;

events.onLetterClick = (x: number, y: number) => {
    if (!pendingClick) {
        pendingClick = { x, y };
    }
}

function gameLoop() {
    if (pendingEffects.length > 0) {
        //drawEffects(app, pendingEffects);
        pendingEffects = updateState(pendingEffects);
        drawBoard();
    }
    else {
        if (pendingClick) {
            const { x, y } = pendingClick;
            pendingEffects = onLetterPressed(x, y);
            pendingClick = null;
        }
    }
    //Otherwise nothing to do
}

