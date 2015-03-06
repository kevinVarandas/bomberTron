/**
 * Created by kevin on 23/02/2015.
 */

// VAR TOUCHES
var gauche = false;
var droite = false;
var bas = false;
var haut = false;
var espace = false;
var toucheEnfoncee = false;

// Fonction traitant les touches pressees
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
    //Espace
    else if(evt.keyCode == 32){
        toucheEnfoncee = true;
        espace = true;
        addBomb(Link);
    }
}
// Fonction traitant les touches relachees
function traiteToucheRelachee(evt){
    if(evt.keyCode === 37){
        toucheEnfoncee = false;
        gauche = false;
        Sonic.picx = Sonic.w;
        Sonic.picy = 3 * Sonic.h;
        Pika.picx = 0;
        Pika.picy = 2 * Pika.h;
        Link.picx = 0;
        Link.picy = 3 * Link.h;
        Mario.picx = 0;
        Mario.picy = 2 * Mario.h;
    }else if(evt.keyCode === 39){
        toucheEnfoncee = false;
        droite = false;
        Sonic.picx = Sonic.w;
        Sonic.picy = Sonic.h;
        Pika.picx = 0;
        Pika.picy = 3 * Pika.h;
        Link.picx = 0;
        Link.picy = 2 * Link.h;
        Mario.picx = 0;
        Mario.picy = 3 * Mario.h;
    }else if(evt.keyCode === 40){
        toucheEnfoncee = false;
        bas = false;
        Sonic.picx = Sonic.w;
        Sonic.picy = 2 * Sonic.h;
        Pika.picx = 0;
        Pika.picy = 0;
        Link.picx = 0;
        Link.picy = 0;
        Mario.picx = 0;
        Mario.picy = 0;
    }else if(evt.keyCode === 38){
        toucheEnfoncee = false;
        haut = false;
        Sonic.picx = Sonic.w;
        Sonic.picy = 0;
        Pika.picx = 0;
        Pika.picy = Pika.h;
        Link.picx = 0;
        Link.picy = Link.h;
        Mario.picx = 0;
        Mario.picy = Mario.h;
    }
    else if(evt.keyCode == 32){
        toucheEnfoncee = false;
        espace = false;
    }

    Sonic.cpt = 0;
    Mario.cpt = 0;
    Pika.cpt = 0;
    Link.cpt = 0;
}

function anime(time){
    // 1 On efface la zone (le canvas)
    ctx.clearRect(0, 0, 1050, 550);
    drawGame();
    drawBombs();
    if(Sonic.prst){
        drawSonic();
    }else if(Mario.prst){
        drawMario();
    }else if(Pika.prst){
        drawPika();
    }else if(Link.prst){
        drawLink();
    }
    requestAnimationFrame(anime);
}