var canvas, ctx, w, h, backgroundCanvas;
var gauche = false;
var droite = false;
var bas = false;
var haut = false;
var toucheEnfoncee = false;
var caisse = new Image();
caisse.src = 'http://img11.hostingpics.net/thumbs/mini_330653caseDestruTrans6.png';
var brique = new Image();
brique.src = 'http://img11.hostingpics.net/thumbs/mini_609075caseFixe3.png';


window.onload = function(){
    canvas = document.querySelector("#myCanvas");
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;

    // Definitions des écouteurs
    document.addEventListener("keydown", traiteToucheAppuyee, false);
    document.addEventListener("keyup", traiteToucheRelachee,false);

    //On anime
    requestAnimationFrame(anime);
};


function traiteToucheAppuyee(evt){
    if(evt.keyCode === 37){
        toucheEnfoncee = true;
        gauche = true;
    }else if(evt.keyCode === 39){
        toucheEnfoncee = true;
        droite = true;
    }else if(evt.keyCode === 40){
        toucheEnfoncee = true;
        bas = true;
    }else if(evt.keyCode === 38){
        toucheEnfoncee = true;
        haut = true;
    }
}

function traiteToucheRelachee(evt){
    if(evt.keyCode === 37){
        toucheEnfoncee = false;
        gauche = false;
    }else if(evt.keyCode === 39){
        toucheEnfoncee = false;
        droite = false;
    }else if(evt.keyCode === 40){
        toucheEnfoncee = false;
        bas = false;
    }else if(evt.keyCode === 38){
        toucheEnfoncee = false;
        haut = false;
    }
}

function drawCaseFixe(){
    ctx.save();
    ctx.fillStyle = 'black';
    for(var i = 50; i < w; i += 50){
        for(var j = 50; j < h ; j += 50){
            if((i % 100) !== 0 && (j % 100) !== 0){
                ctx.drawImage(brique, i, j, 50, 50);
            }
        }
    }
    ctx.restore();
}

function drawCaseBois(x, y){
    ctx.save();
    ctx.translate(x,y);
    ctx.drawImage(caisse, 0,0, 50, 50);
    ctx.restore();
}

function drawNiv1(){
    drawCaseFixe();

    for(var i = 100; i < w - 100 ; i += 50){
        drawCaseBois(i, 0);
        drawCaseBois(i, h - 50);
    }
    for(var i =50; i < w - 50; i += 50){
        if(i % 100 === 0){
            drawCaseBois(i,50);
            drawCaseBois(i, h - 100);
        }
    }
    for(var i = 0; i < w; i += 50){
        drawCaseBois(i, 100);
        drawCaseBois(i, h - 150);
    }
    for(var i = 0; i < w; i += 50){
        if(i % 200 === 0){
            drawCaseBois(i, 150);
            drawCaseBois(i, h - 200);
        }
    }
    for(var i = 0; i < w; i+=50){
        if((i < 450 || i > 550) && i !== 50 && i !== 250 && i !== 750 && i !== 950){
            drawCaseBois(i, 200);
            drawCaseBois(i, h - 250);
        }
    }
    for(var i = 100; i < w - 100; i+=50){
        if((i < 400 || i > 600) && (i % 200) !== 0 && (i % 100) === 0){
            drawCaseBois(i, 250);
        }
    }
}

function anime(time){
    // 1 On efface la zone (le canvas)
    ctx.clearRect(0, 0, 1050, 550);
    drawNiv1();
}