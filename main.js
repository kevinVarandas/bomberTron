/**
 * Created by kevin on 22/02/2015.
 */
var menu = false;
var backgroundCanvas, ctxBckg, wBckg, hBckg;
var canvas, ctx, w, h;
// VAR pour le niveau
var level = 1;


window.onload = function(){
    document.addEventListener("keydown", traiteToucheAppuyee, false);
    document.addEventListener("keyup", traiteToucheRelachee,false);

    backgroundCanvas = document.querySelector("#backgroundCanvas");
    ctxBckg = backgroundCanvas.getContext("2d");
    wBckg = backgroundCanvas.width;
    hBckg = backgroundCanvas.height;

    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;

    if(menu){
        console.log("menu");
    }
    else{
        drawBackground();
        addCaseFixe();
        //On prepare le niveau
        generateLevel(level);

        drawGame();
        requestAnimationFrame(anime);
    }
};