/**
 * Created by kevin on 24/02/2015.
 */

var Sonic = {
    x : 40,
    y : 40,
    vx : 4,
    vy : 4,
    w : 21,
    h : 28,
    picx : 21,
    picy : 56,
    cpt : 0,
    prst : false
};

var Mario = {
    x : 40,
    y : 40,
    vx : 4,
    vy : 4,
    w : 18.5,
    h : 31.5,
    picx : 0,
    picy : 0,
    cpt : 0,
    prst : false
}

var Pika = {
    x : 40,
    y : 40,
    vx : 4,
    vy : 4,
    w : 24,
    h : 27.1,
    picx : 0,
    picy : 0,
    cpt : 0,
    prst : false
};

var Link = {
    x : 40,
    y : 40,
    vx : 4,
    vy : 4,
    w : 19,
    h : 34,
    picx : 0,
    picy : 0,
    cpt : 0,
    prst : true
};

/*****************************************/
//A REFACTOR POUR FAIRE UNE FACTORYs
socket.on('LinkUpdate',function(w, h){
    Link.picx = w;
    Link.picy = h;
});
socket.on('LinkMoveUpdate',function(m, move){
    if(m === 0){
        Link.y += move;
    }else{
        Link.x += move;
    }
});
socket.on('SonicUpdate',function(w, h){
    Sonic.picx = w;
    Sonic.picy = h;
});
socket.on('SonicMoveUpdate',function(m, move){
    if(m === 0){
        Sonic.y += move;
    }else{
        Sonic.x += move;
    }
});
socket.on('MarioUpdate',function(w, h){
    Mario.picx = w;
    Mario.picy = h;
});
socket.on('MarioMoveUpdate',function(m, move){
    if(m === 0){
        Mario.y += move;
    }else{
        Mario.x += move;
    }
});
socket.on('PikaUpdate',function(w, h){
    Pika.picx = w;
    Pika.picy = h;
});
socket.on('PikaMoveUpdate',function(m, move){
    if(m === 0){
        Pika.y += move;
    }else{
        Pika.x += move;
    }
});

function drawSonic(){
    if(bas){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = 2 * Sonic.h;
            socket.emit('SonicSheet', 0, 2 * Sonic.h);
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = 2 * Sonic.h;
            socket.emit('SonicSheet', 2 * Sonic.w, 2 * Sonic.h);
        }
        if(collisonBas(Sonic.x + (Sonic.w / 2) + 5, Sonic.y + Sonic.h, Sonic.vy)){

        }else {
            Sonic.y += Sonic.vy;
            socket.emit('SonicMove', 0, Sonic.vy);
        }
    }else if(haut){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = 0;
            socket.emit('SonicSheet', 0, 0);
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = 0;
            socket.emit('SonicSheet', 2 * Sonic.w, 0);
        }
        if(collisonHaut(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vy)){

        }else {
            Sonic.y -= Sonic.vy;
            socket.emit('SonicMove', 0, -Sonic.vy);
        }
    }else if(gauche){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = 3 * Sonic.h;
            socket.emit('SonicSheet', 0, 3 * Sonic.h);
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = 3 * Sonic.h;
            socket.emit('SonicSheet', 2 * Sonic.w, 3 * Sonic.h);
        }
        if(!collisonGauche(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vx)) {
            Sonic.x -= Sonic.vx;
            socket.emit('SonicMove', 1, -Sonic.vx);
        }
    }else if(droite){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = Sonic.h;
            socket.emit('SonicSheet', 0, Sonic.h);
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = Sonic.h;
            socket.emit('SonicSheet', 2 * Sonic.w, Sonic.h);
        }
        if(!collisonDroite(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vx)) {
            Sonic.x += Sonic.vx;
            socket.emit('SonicMove', 1, Sonic.vx);
        }
    }
    ctx.drawImage(sonic, Sonic.picx, Sonic.picy, Sonic.w, Sonic.h, Sonic.x, Sonic.y, 30, 40);
}
function drawMario(){
    if(bas){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = 0;
            socket.emit('MarioSheet', Mario.w, 0);
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = 0;
            socket.emit('MarioSheet', 2 * ario.w, 0);
        }
        if(!collisonBas(Mario.x + (Mario.w / 2) + 5, Mario.y + Mario.h - 5, Mario.vy)){
            Mario.y += Mario.vy;
            socket.emit('MarioMove', 0, Mario.vy);
        }
    }else if(haut){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = Mario.h
            socket.emit('MarioSheet', Mario.w, Mario.h);
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = Mario.h;
            socket.emit('MarioSheet', 2 * Mario.w, Mario.h);
        }
        if(!collisonHaut(Mario.x + (Mario.w / 2), Mario.y + Mario.h, Mario.vy)) {
            Mario.y -= Mario.vy;
            socket.emit('MarioMove', 0, -Mario.vy);
        }
    }else if(gauche){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = 2 * Mario.h;
            socket.emit('MarioSheet', Mario.w, 2 * Mario.h);
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = 2 * Mario.h;
            socket.emit('MarioSheet', 2 * Mario.w, 2 * Mario.h);
        }
        if(!collisonGauche(Mario.x + (Mario.w / 2), Mario.y + Mario.h, Mario.vx)) {
            Mario.x -= Mario.vx;
            socket.emit('MarioMove', 1, Mario.vx);
        }
    }else if(droite){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = 3 * Mario.h;
            socket.emit('MarioSheet', Mario.w, 3 * Mario.h);
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = 3 * Mario.h;
            socket.emit('MarioSheet', 2 * Mario.w, 3 * Mario.h);
        }
        if(!collisonDroite(Mario.x + (Mario.w / 2), Mario.y + Mario.h, Mario.vx)) {
            Mario.x += Mario.vx;
            socket.emit('MarioMove', 1, Mario.vx);
        }
    }
    ctx.drawImage(mario, Mario.picx, Mario.picy, Mario.w, Mario.h, Mario.x, Mario.y, 30, 40);
}
function drawPika(){
    if(bas){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = 0;
            socket.emit('PikaSheet', Pika.w, 0);
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = 0;
            socket.emit('PikaSheet', 2 * Pika.w, 0);
        }
        if(!collisonBas(Pika.x + (Pika.w / 2) + 5, Pika.y + Pika.h + 5, Pika.vy)) {
            Pika.y += Pika.vy;
            socket.emit('PikaMove', 0, Pika.vy);
        }
    }else if(haut){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = Pika.h;
            socket.emit('PikaSheet', Pika.w, Pika.h);
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = Pika.h;
            socket.emit('PikaSheet', 2 * Pika.w, Pika.h);
        }
        if(!collisonHaut(Pika.x + (Pika.w / 2), Pika.y + Pika.h, Pika.vy)) {
            Pika.y -= Pika.vy;
            socket.emit('PikaMove', 0, -Pika.vy);
        }
    }else if(gauche){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = 2 * Pika.h;
            socket.emit('PikaSheet', Pika.w, 2 * Pika.h);
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = 2 * Pika.h;
            socket.emit('PikaSheet', 2 * Pika.w, 2 * Pika.h);
        }
        if(!collisonGauche(Pika.x + (Pika.w / 2), Pika.y + Pika.h, Pika.vx)) {
            Pika.x -= Pika.vx;
            socket.emit('PikaMove', 1, -Pika.vx);
        }
    }else if(droite){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = 3 * Pika.h;
            socket.emit('PikaSheet', Pika.w, 3 * Pika.h);
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = 3 * Pika.h;
            socket.emit('PikaSheet', 2 * Pika.w, 3 * Pika.h);
        }
        if(!collisonDroite(Pika.x + Pika.w , Pika.y + Pika.h + 15, Pika.vx)) {
            Pika.x += Pika.vx;
            socket.emit('PikaMove', 1, Pika.vx);
        }
    }

    ctx.drawImage(pika, Pika.picx, Pika.picy, Pika.w, Pika.h, Pika.x, Pika.y, 40, 45);
}
function drawLink(){
    if(bas){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = 0;
            socket.emit('LinkSheet', Link.w, 0);
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = 0;
            socket.emit('LinkSheet', 2 * Link.w, 0);
        }
        if(!collisonBas(Link.x + (Link.w / 2) + 5, Link.y + Link.h, Link.vy)) {
            Link.y += Link.vy;
            socket.emit('LinkMove', 0, Link.vy);
        }
    }else if(haut){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = Link.h;
            socket.emit('LinkSheet', Link.w, Link.h);
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = Link.h;
            socket.emit('LinkSheet', 2 * Link.w, Link.h);
        }
        if(!collisonHaut(Link.x + (Link.w / 2), Link.y + Link.h, Link.vy)) {
            Link.y -= Link.vy;
            socket.emit('LinkMove', 0, -Link.vy);
        }
    }else if(gauche){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = 3 * Link.h;
            socket.emit('LinkSheet', Link.w, 3 * Link.h);
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = 3 * Link.h;
            socket.emit('LinkSheet', 2 * Link.w, 3 * Link.h);
        }
        if(!collisonGauche(Link.x + (Link.w / 2), Link.y + Link.h, Link.vx)) {
            Link.x -= Link.vx;
            socket.emit('LinkMove', 1, -Link.vx);
        }
    }else if(droite){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = 2 * Link.h;
            socket.emit('LinkSheet', Link.w, 2 * Link.h);
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = 2 * Link.h;
            socket.emit('LinkSheet', 2 * Link.w, 2 * Link.h);
        }
        if(!collisonDroite(Link.x + (Link.w / 2), Link.y + Link.h, Link.vx)) {
            Link.x += Link.vx;
            socket.emit('LinkMove', 1, Link.vx);
        }
    }
    ctx.drawImage(link, Link.picx, Link.picy, Link.w, Link.h, Link.x, Link.y, 27, 45);
}


function Player(x, y, nbBomb, bom){

}
/*****************************************/