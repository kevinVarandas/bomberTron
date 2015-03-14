

var twoPlayerOption = {
    x : 75,
    y : 300,
    img : twoPlayers
};

var threePlayerOPtion = {
    x : 225,
    y : 300,
    img : threePlayers
};

var fourPlayerOption = {
    x : 375,
    y : 300,
    img : fourPlayers
};

var rejoindreOption = {
    x : 525,
    y : 300,
    img : rejoindre
};

function showMenu(){
    ctx.save();
    ctx.drawImage(menuImage, 0, 0, w, h);
    ctx.drawImage(twoPlayerOption.img, twoPlayerOption.x,twoPlayerOption.y,optionWidth,optionHeight);
    ctx.drawImage(threePlayerOPtion.img, threePlayerOPtion.x,threePlayerOPtion.y,optionWidth,optionHeight);
    ctx.drawImage(fourPlayerOption.img, fourPlayerOption.x,fourPlayerOption.y,optionWidth,optionHeight);
    ctx.drawImage(rejoindreOption.img, rejoindreOption.x,rejoindreOption.y,optionWidth,optionHeight);
    ctx.restore();
}
