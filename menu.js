
var twoPlayerOption = {
    x : 25,
    y : 300,
    img : twoPlayers
};

var threePlayerOPtion = {
    x : 200,
    y : 300,
    img : threePlayers
};

var fourPlayerOption = {
    x : 375,
    y : 300,
    img : fourPlayers
};

var rejoindreOption = {
    x : 550,
    y : 300,
    img : rejoindre
};

var backOption = {
    x : 630,
    y : 450,
    w : 90,
    h : 40,
    img : backButton
};

var muteOption = {
    x : 5,
    y : 5,
    w : 40,
    h : 40,
    img : muteButton,
    mute : false
}
function showMuteButton(){
    ctx.drawImage(muteOption.img, muteOption.x, muteOption.y, muteOption.w, muteOption.h);
}
function showMenu(){
    ctx.save();
    document.getElementById("waintingPlayerDiv").style.visibility = "hidden";
    document.getElementById("listJoining").style.visibility = "hidden";
    ctx.drawImage(menuImage, 0, 0, w, h);
    ctx.drawImage(twoPlayerOption.img, twoPlayerOption.x,twoPlayerOption.y,optionWidth,optionHeight);
    ctx.drawImage(threePlayerOPtion.img, threePlayerOPtion.x,threePlayerOPtion.y,optionWidth,optionHeight);
    ctx.drawImage(fourPlayerOption.img, fourPlayerOption.x,fourPlayerOption.y,optionWidth,optionHeight);
    ctx.drawImage(rejoindreOption.img, rejoindreOption.x,rejoindreOption.y,optionWidth,optionHeight);
    ctx.restore();
}
