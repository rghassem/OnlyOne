export function makeButton(stage: PIXI.Container, width: number, height: number, buttonText: string, onClick: () => void) {
    const button = new PIXI.Graphics();
    //Border
    const borderWidth = 2;
    draw(button, width, height, borderWidth, 0x330303, 0x660303);

    const text = new PIXI.Text(buttonText);
    text.style = new PIXI.TextStyle({
        fontFamily: 'VT323',
        fontSize: 32,
        fill: '#ffffff',
        stroke: '#4a1850',
        strokeThickness: 5,
        wordWrap: true,
        wordWrapWidth: 200,
    });

    text.anchor.set(1);
    button.addChild(text);
    text.x = button.width / 2;
    text.y = button.height / 2;
    stage.addChild(button);
    button.interactive = true;
    button
        .on('pointerover', () => {
            text.style.fill = '#FF0000'
            draw(button, width, height, borderWidth, 0x330303, 0xffff00);
        })
        .on('pointerout', () => {
            text.style.fill = '#FFFFFF';
            draw(button, width, height, borderWidth, 0x330303, 0x660303);
        })
        .on('pointerdown', () => onClick());
    return button;
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