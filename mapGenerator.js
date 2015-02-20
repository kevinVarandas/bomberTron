// VAR CANVAS PREMIER PLAN
var canvas, ctx, w, h;
// VAR CANVAS SECOND PLAN
var backgroundCanvas, ctxBckg, wBckg, hBckg;
// VAR TOUCHES
var gauche = false;
var droite = false;
var bas = false;
var haut = false;
var toucheEnfoncee = false;

//VAR IMAGES DE FOND + CASES
var caisse = new Image();
caisse.src = 'http://img11.hostingpics.net/thumbs/mini_330653caseDestruTrans6.png';

var backgr = new Image();
backgr.src = 'http://img11.hostingpics.net/thumbs/mini_562034fond.png';
var brique = new Image();
brique.src = 'http://img11.hostingpics.net/thumbs/mini_609075caseFixe3.png';
var tailleCaseFixe = 40;

// IMAGES DES DIFFERENTS PERSONNAGES
var sonic = new Image();
sonic.src = 'http://img11.hostingpics.net/pics/903543SonicTron1.png';

var mario = new Image();
mario.src = 'http://img11.hostingpics.net/pics/150862marioTron.png';

var pika = new Image();
pika.src = 'http://img11.hostingpics.net/pics/998998pika.png';

var link = new Image();
link.src = 'http://img11.hostingpics.net/pics/579093link1.png';

// VAR pour le niveau
var level = 1;
//VAR tableau de cases
var cases = [];

/** REFAIRE DES VARS POUR LE PB DES NIVEAUX; IL FAUT CREER TOUS LES NIVEAUX AUPARAVANT
 * ET JUSTE AFFICHER DANS LE ANIME
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

// FOnction démarrée après chargement de la page
window.onload = function(){

    canvas = document.querySelector("#myCanvas");
    backgroundCanvas = document.querySelector("#backgroundCanvas");
    ctx = canvas.getContext('2d');
    ctxBckg = backgroundCanvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    wBckg = backgroundCanvas.width;
    hBckg = backgroundCanvas.height;

    // Definitions des écouteurs
    document.addEventListener("keydown", traiteToucheAppuyee, false);
    document.addEventListener("keyup", traiteToucheRelachee,false);

    // Dessine le background
    drawBackground();

    //Les cases fixes
    addCaseFixe();

    drawLevel(level);
    //On anime
    requestAnimationFrame(anime);
};

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
    Sonic.cpt = 0;
    Mario.cpt = 0;
    Pika.cpt = 0;
    Link.cpt = 0;
}
// Fonction dessinant le background
function drawBackground(){
    ctxBckg.save();
    ctxBckg.fillStyle = 'black';
    ctxBckg.fillRect(0, 0, wBckg, hBckg);
    ctxBckg.restore();
}

// Fonction qui dessine les bords du plateau de jeu
function addCaseFixe(){
    var i,j;
    for(i = 0; i < w; i += tailleCaseFixe){
        for(j = 0; j < h ; j += tailleCaseFixe){
            if((i === 0 || j === 0 || (i+tailleCaseFixe) === w || (j+tailleCaseFixe) === h)){
                cases.push(new Case(i,j,true,tailleCaseFixe));
            }
        }
    }
}
// Objet case
/**
 *  x, y : les coordonnées
 *  type : booleen si fixe ou non
 */
function Case(x, y, type, tailleCase) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.tailleCase = tailleCase;

    this.isFixe = function(){return this.type;};
    this.getX = function(){return this.x;};
    this.getY = function(){return this.y;};
    this.getTailleCase = function(){return this.tailleCase};
}


/*****************************************/

        //A REFACTOR POUR FAIRE UNE FACTORYs
function drawSonic(){
    if(bas){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = 2 * Sonic.h;
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = 2 * Sonic.h;
        }
        if(collisonBas(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vy)){

        }else {
            Sonic.y += Sonic.vy;
        }
    }else if(haut){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = 0;
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = 0;
        }
        if(collisonHaut(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vy)){

        }else {
            Sonic.y -= Sonic.vy;
        }
    }else if(gauche){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = 3 * Sonic.h;
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = 3 * Sonic.h;
        }
        if(!collisonGauche(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vx)) {
            Sonic.x -= Sonic.vx;
        }
    }else if(droite){
        Sonic.cpt += 1;
        if(Sonic.cpt % 20 < 10){
            Sonic.picx = 0;
            Sonic.picy = Sonic.h;
        }else if(Sonic.cpt % 20 > 10){
            Sonic.picx = 2 * Sonic.w;
            Sonic.picy = Sonic.h;
        }
        if(!collisonDroite(Sonic.x + (Sonic.w / 2), Sonic.y + Sonic.h, Sonic.vx)) {
            Sonic.x += Sonic.vx;
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
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = 0;
        }
        if(!collisonBas(Mario.x + (Mario.w / 2), Mario.y + Mario.h - 5, Mario.vy)){
            Mario.y += Mario.vy;
        }
    }else if(haut){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = Mario.h
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = Mario.h;
        }
        if(!collisonHaut(Mario.x + (Mario.w / 2), Mario.y + Mario.h, Mario.vy)) {
            Mario.y -= Mario.vy;
        }
    }else if(gauche){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = 2 * Mario.h;
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = 2 * Mario.h;
        }
        if(!collisonGauche(Mario.x + (Mario.w / 2), Mario.y + Mario.h, Mario.vx)) {
            Mario.x -= Mario.vx;
        }
    }else if(droite){
        Mario.cpt += 1;
        if(Mario.cpt % 20 < 10){
            Mario.picx = Mario.w;
            Mario.picy = 3 * Mario.h;
        }else if(Mario.cpt % 20 > 10){
            Mario.picx = 2 * Mario.w;
            Mario.picy = 3 * Mario.h;
        }
        if(!collisonDroite(Mario.x + (Mario.w / 2), Mario.y + Mario.h, Mario.vx)) {
            Mario.x += Mario.vx;
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
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = 0;
        }
        if(!collisonBas(Pika.x + (Pika.w / 2), Pika.y + Pika.h + 5, Pika.vy)) {
            Pika.y += Pika.vy;
        }
    }else if(haut){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = Pika.h;
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = Pika.h;
        }
        if(!collisonHaut(Pika.x + (Pika.w / 2), Pika.y + Pika.h, Pika.vy)) {
            Pika.y -= Pika.vy;
        }
    }else if(gauche){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = 2 * Pika.h;
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = 2 * Pika.h;
        }
        if(!collisonGauche(Pika.x + (Pika.w / 2), Pika.y + Pika.h, Pika.vx)) {
            Pika.x -= Pika.vx;
        }
    }else if(droite){
        Pika.cpt += 1;
        if(Pika.cpt % 20 < 10){
            Pika.picx = Pika.w;
            Pika.picy = 3 * Pika.h;
        }else if(Pika.cpt % 20 > 10){
            Pika.picx = 2 * Pika.w;
            Pika.picy = 3 * Pika.h;
        }
        if(!collisonDroite(Pika.x + (Pika.w / 2) + 20, Pika.y + Pika.h, Pika.vx)) {
            Pika.x += Pika.vx;
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
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = 0;
        }
        if(!collisonBas(Link.x + (Link.w / 2) + 5, Link.y + Link.h, Link.vy)) {
            Link.y += Link.vy;
        }
    }else if(haut){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = Link.h;
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = Link.h;
        }
        if(!collisonHaut(Link.x + (Link.w / 2), Link.y + Link.h, Link.vy)) {
            Link.y -= Link.vy;
        }
    }else if(gauche){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = 3 * Link.h;
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = 3 * Link.h;
        }
        if(!collisonGauche(Link.x + (Link.w / 2), Link.y + Link.h, Link.vx)) {
            Link.x -= Link.vx;
        }
    }else if(droite){
        Link.cpt += 1;
        if(Link.cpt % 20 < 10){
            Link.picx = Link.w;
            Link.picy = 2 * Link.h;
        }else if(Link.cpt % 20 > 10){
            Link.picx = 2 * Link.w;
            Link.picy = 2 * Link.h;
        }
        if(!collisonDroite(Link.x + (Link.w / 2), Link.y + Link.h, Link.vx)) {
            Link.x += Link.vx;
        }
    }
    ctx.drawImage(link, Link.picx, Link.picy, Link.w, Link.h, Link.x, Link.y, 27, 45);
}

/*****************************************/
function addCaseCassable(x, y){
    cases.push(new Case(x,y,false,tailleCaseFixe))
}

function drawLevel(level)
{
   switch (level){
       case 1:
           createLevel1();
           break;
       default:
           break;
   }
}

function drawGame(){
    ctx.save();
    //dessine les cases du niveau
    var i;
    for(i = 0; i<cases.length; i++) {
        if (cases[i].isFixe())
        {
            ctx.drawImage(brique, cases[i].x, cases[i].y, cases[i].tailleCase, cases[i].tailleCase);
        }
        else
        {
            ctx.drawImage(caisse, cases[i].x, cases[i].y, cases[i].tailleCase, cases[i].tailleCase);
        }
    }
    ctx.restore();
}
function createLevel1(){
    var i, j;
    //Ajout des cases fixes
    for(i = 0; i < w; i += tailleCaseFixe){
        for(j = 0; j < h ; j += tailleCaseFixe){
            if((i % 80) === 0 && (j % 80) === 0 && i !== 0 && (i+tailleCaseFixe)!==w && j!==0 && (j+tailleCaseFixe)!==h){
                cases.push(new Case(i,j,true,tailleCaseFixe));
            }
        }
    }

    //ajout des cases cassables
    for(i = 120; i < w - 120; i += 40){
        addCaseCassable(i, 40);
        addCaseCassable(i, h - 80);
    }

    for(i = 40; i<w-40; i+=40){
        addCaseCassable(i,120);
        addCaseCassable(i,h-160);
    }

    for(i = 40; i<w-40; i+=40){
        addCaseCassable(i,200);
        addCaseCassable(i,h-240);
    }
}

function collisonHaut(x, y, v){
    var i;
    var pos = y - v;
    for(i = 0; i < cases.length; i++){
            if(pos > cases[i].getY() && pos < cases[i].getY() + cases[i].getTailleCase() &&
                ((x-5 > cases[i].getX() && x-5 < cases[i].getX() + cases[i].getTailleCase()) ||
                (x+5 > cases[i].getX() && x+5 < cases[i].getX() + cases[i].getTailleCase()))){
                return true;
            }
    }
    return false;
}

function collisonBas(x, y, v){
    var i;
    var pos = y + v + 10;
    for(i = 0; i < cases.length; i++){
        if(pos > cases[i].getY() && pos < cases[i].getY() + cases[i].getTailleCase() &&
            ((x-10 > cases[i].getX() && x-10 < cases[i].getX() + cases[i].getTailleCase()) ||
            (x+10 > cases[i].getX() && x+10 < cases[i].getX() + cases[i].getTailleCase()))){
            return true;
        }
    }
    return false;
}

function collisonGauche(x, y, v){
    var i;
    var pos = x - v - 5;
    for(i = 0; i < cases.length; i++){
        if(pos > cases[i].getX() && pos < cases[i].getX() + cases[i].getTailleCase() &&
            ((y >= cases[i].getY() && y < cases[i].getY() + cases[i].getTailleCase()))){
            return true;
        }
    }
    return false;
}

function collisonDroite(x, y, v){
    var i;
    var pos = x + v + 15;
    for(i = 0; i < cases.length; i++){
        if(pos > cases[i].getX() && pos < cases[i].getX() + cases[i].getTailleCase() &&
            ((y >= cases[i].getY() && y < cases[i].getY() + cases[i].getTailleCase()))){
            return true;
        }
    }
    return false;
}

function anime(time){
    // 1 On efface la zone (le canvas)
    ctx.clearRect(0, 0, 1050, 550);
    drawGame();
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