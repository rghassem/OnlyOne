export function makeButton(stage: PIXI.Container, x: number, y: number, width: number, height: number, buttonText: string, onClick: () => void) {
    const button = new PIXI.Graphics();
    //Border
    const borderWidth = 2;
    draw(button, width, height, borderWidth, 0x330303, 0x660303);

    const text = new PIXI.Text(buttonText);
    text.anchor.set(1);
    button.addChild(text);
    text.x = button.width / 2;
    text.y = button.height / 2;
    stage.addChild(button);
    button.x = x;
    button.y = y;
    button.interactive = true;
    button
        .on('pointerover', () => {
            text.style.fill = '#FF0000'
            draw(button, width, height, borderWidth, 0x330303, 0xffff00);
        })
        .on('pointerout', () => {
            text.style.fill = '#000000';
            draw(button, width, height, borderWidth, 0x330303, 0x660303);
        })
        .on('pointerdown', () => onClick());
}

function draw(button: PIXI.Graphics, width: number, height: number, borderWidth: number, color: number, borderColor: number) {
    button.clear();

    button.beginFill(borderColor);
    button.drawRoundedRect(-borderWidth, -borderWidth, width + 2 * borderWidth, height + 2 * borderWidth, 5);
    button.endFill();
    button.moveTo(0, 0);
    //Body
    button.beginFill(color);
    button.drawRoundedRect(0, 0, width, height, 5);
    button.endFill();
}