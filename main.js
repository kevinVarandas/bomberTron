var menu = true;
var boolJoin = false;
var waitPlayer = false;
var theEnd = false;
var backgroundCanvas, ctxBckg, wBckg, hBckg;
var canvas, ctx, w, h;
// VAR pour le niveau
var level = 1;

var sound = new Howl({
    urls: ['chiptune_proj_cpp_mp3.mp3'],
    loop: true,
    volume: 0.1
});

var soundGame = new Howl({
    urls: ['soundGame.mp3'],
    loop:true,
    volume: 0.1
});

var soundExplo = new Howl({
    urls: ['charged-laser1.wav'],
    volume: 0.6
});

var soundSelection = new Howl({
    urls: ['laser-selection1.wav'],
    volume: 0.1
});


window.onload = function(){
    document.addEventListener("keydown", traiteToucheAppuyee, false);
    document.addEventListener("keyup", traiteToucheRelachee,false);
    document.addEventListener("click", traiteClick, false);

    backgroundCanvas = document.querySelector("#backgroundCanvas");
    ctxBckg = backgroundCanvas.getContext("2d");
    wBckg = backgroundCanvas.width;
    hBckg = backgroundCanvas.height;

    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
    drawBackground();

    addCaseFixe();
    sound.play();
    //On prepare le niveau
    //TODO LE METTRE DANS LE ANIME ENSUITE
    generateLevel(level);

    requestAnimationFrame(anime);
};