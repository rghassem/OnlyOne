import { onLetterPressed } from "./letters";
import { drawLetters } from "./render";

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
drawLetters(app);

function gameLoop() {
    //const [x, y] = getInput() as [number, number];

    const effects = onLetterPressed(1, 1);

    //Render changes
    //Also handle consequences (falling, scoring, mines going off, follow up bombs, etc)
    //Also possibly recurse
}

