import { onLetterPressed } from "./letters";
import { initializeLetters, drawEffects } from "./render";
import { BoardEffect } from "./boardEffect";

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

function getInput() {

}

//Render changes
//Also handle consequences (falling, scoring, mines going off, follow up bombs, etc)
//Also possibly recurse
function gameLoop() {
    if (pendingEffects.length > 0) {
        //falling letters and things?
    }
    else {
        //const input = getInput() as [number, number];
        // if (input) {
        //     const effects = onLetterPressed(1, 1);
        //     drawEffects(app, effects);
        // }
    }
}

