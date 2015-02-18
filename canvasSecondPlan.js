/**
* Created by kevin on 15/02/2015.
*/
// Variables Canvas
var backgroundCanvas, ctxBckg, width, height;
// Variable pour l'image de fond
//var backgr = new Image();
//backgr.src = 'http://img11.hostingpics.net/thumbs/mini_850930Fondneon.png';

window.onload = function(){

    backgroundCanvas = document.querySelector("#backgroundCanvas");
    ctxBckg = backgroundCanvas.getContext('2d');

    width = backgroundCanvas.width;
    height = backgroundCanvas.height;

    //Dessine le background
    drawBackground();
};

function drawBackground(){
    ctxBckg.save();
    ctxBckg.fillStyle = 'black';
    ctxBckg.fillRect(0, 0, width, height);
    ctxBckg.restore();
}