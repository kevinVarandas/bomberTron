var socket = io.connect();

var tailleCaseFixe = 40;

//Tableau de bombes
var bombs = [];

//VAR tableau de cases
var cases = [];

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
//fonction qui ajoute des bombes qd on appuis sur espace
function addBomb(Player,id){
    var xBomb = (Player.x + (Player.w/2));
    var yBomb = (Player.y + Player.h);
    var subX =  (Player.x + (Player.w/2)) % tailleCaseFixe;
    var subY = (Player.y + Player.h) % tailleCaseFixe;
    Player.droppedBomb = true;
    bombs.push(new Bomb(xBomb - subX, yBomb - subY, id, 1, 150, tailleCaseFixe));
    socket.emit('updateTabBomb', bombs);
}

socket.on('updateBombsTab', function(bombes){
    //bombs = bombes;
    bombs = [];
    var i;
    for(i = 0; i < bombes.length; i++){
        bombs.push(new Bomb(bombes[i].x, bombes[i].y, bombes[i].type, bombes[i].puissance, bombes[i].duree, bombes.taille));
    }
});



// fonction qui dessine les bombes
function drawBombs(){
    var i;
    for(i = 0; i<bombs.length; i++){
        if(bombs[i].type === 1 && bombs[i].duree > 50) {
            ctx.drawImage(bombeSonic, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].type === 2 && bombs[i].duree > 50){
            ctx.drawImage(bombeMario, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].type === 4 && bombs[i].duree > 50){
            ctx.drawImage(bombePika, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].type === 3 && bombs[i].duree > 50){
            ctx.drawImage(bombeLink, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].duree > 0){
            drawExplosion(bombs[i]);
            bombs[i].duree -= 1;
        }
        else if(bombs[i].duree === 0){
            bombs.splice(i,1);
            player.nbBomb++;
            socket.emit('updateTabBomb', bombs);
        }
    }
}

function drawExplosion(bombe){
    var j;
    switch(bombe.type){
        case 1:
            ctx.drawImage(centreExplosion, 0, 0, 40, 40, bombe.x, bombe.y, 40, 40);

            for(j=1;j<=bombe.puissance;j++) {
                ctx.drawImage(corpsExplosion, 0, 0, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 0, 0, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 0, 120, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
                ctx.drawImage(corpsExplosion, 0, 120, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            }
            ctx.drawImage(teteExplosion, 0, 0, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
            ctx.drawImage(teteExplosion, 0, 160, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 0, 320, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 0, 480, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
            break;
        case 2:
            ctx.drawImage(centreExplosion, 80, 0, 40, 40, bombe.x, bombe.y, 40, 40);

            for(j=1;j<=bombe.puissance;j++) {
                ctx.drawImage(corpsExplosion, 80, 0, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 80, 0, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 80, 120, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
                ctx.drawImage(corpsExplosion, 80, 120, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            }
            ctx.drawImage(teteExplosion, 80, 0, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
            ctx.drawImage(teteExplosion, 80, 160, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 80, 320, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 80, 480, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
            break;
        case 3:
            ctx.drawImage(centreExplosion, 120, 40, 40, 40, bombe.x, bombe.y, 40, 40);

            for(j=1;j<=bombe.puissance;j++) {
                ctx.drawImage(corpsExplosion, 40, 40, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 40, 40, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 40, 160, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
                ctx.drawImage(corpsExplosion, 40, 160, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            }
            ctx.drawImage(teteExplosion, 40, 80, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
            ctx.drawImage(teteExplosion, 40, 240, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 40, 400, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 40, 560, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
            break;
        case 4:
            ctx.drawImage(centreExplosion, 40, 40, 40, 40, bombe.x, bombe.y, 40, 40);

            for(j=1;j<=bombe.puissance;j++) {
                ctx.drawImage(corpsExplosion, 120, 40, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 120, 40, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
                ctx.drawImage(corpsExplosion, 120, 160, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
                ctx.drawImage(corpsExplosion, 120, 160, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            }
            ctx.drawImage(teteExplosion, 120, 80, 40, 40, bombe.x - (j*40), bombe.y, 40, 40);
            ctx.drawImage(teteExplosion, 120, 240, 40, 40, bombe.x, bombe.y - (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 120, 400, 40, 40, bombe.x, bombe.y + (j*40), 40, 40);
            ctx.drawImage(teteExplosion, 120, 560, 40, 40, bombe.x + (j*40), bombe.y, 40, 40);
            break;
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
// Objet bomberman
function Bomb(x, y, type, puissance, duree, taille){
    this.x = x;
    this.y = y;
    this.type = type;
    this.puissance = puissance;
    this.duree = duree;
    this.taille = taille;
    this.isUnlock = true;

    this.getX = function(){return this.x;};
    this.getY = function(){return this.y;};
    this.getTailleBomb = function(){return this.taille};
}
// fonction ajout d'une case cassable
function addCaseCassable(x, y){
    cases.push(new Case(x,y,false,tailleCaseFixe))
}
// fonction qui génère un niveau
function generateLevel(level) {
    switch (level){
        case 1:
            createLevel1();
            break;
        default:
            break;
    }
}
//Fonction qui dessine un niveau entier
function drawGame(){
    ctx.save();
    //dessine les cases du niveau
    var i;
    for(i = 0; i<cases.length; i++) {
        if (cases[i].isFixe()) {
            ctx.drawImage(brique, cases[i].x, cases[i].y, cases[i].tailleCase, cases[i].tailleCase);
        }
        else {
            ctx.drawImage(caisse, cases[i].x, cases[i].y, cases[i].tailleCase, cases[i].tailleCase);
        }
    }
    ctx.restore();
}
// fonction qui crée le lvl1
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
//==========================================================
//fonction de colisions
function collisonHaut(x, y, v){
    var i;
    var pos = y - v;
    for(i = 0; i < cases.length; i++) {
        if (pos > cases[i].getY() && pos < cases[i].getY() + cases[i].getTailleCase() &&
            ((x - 5 > cases[i].getX() && x - 5 < cases[i].getX() + cases[i].getTailleCase()) ||
            (x + 5 > cases[i].getX() && x + 5 < cases[i].getX() + cases[i].getTailleCase()))) {
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

function collisionBombHaut(x, y, v){
    var i;
    var pos = y - v;
    if(bombs.length !==0) {
        for(i = 0; i < bombs.length; i++){
            if (pos > bombs[i].y && pos < bombs[i].y + bombs[i].taille &&
                ((x - 5 > bombs[i].x && x - 5 < bombs[i].x + bombs[i].taille) ||
                (x + 5 > bombs[i].x && x + 5 < bombs[i].x + bombs[i].taille))&& bombs[i].isLock){
                return true;
            }
        }
        return false;
    }
}

function collisionBombGauche(x, y, v){
    var i;
    var pos = x - v - 5;
    if(bombs.length !==0) {
        for(i = 0; i < bombs.length; i++){
            if(pos > bombs[i].x && pos < bombs[i].x + bombs[i].taille &&
                ((y >= bombs[i].y && y < bombs[i].y + bombs[i].taille))){
                return true;
            }
        }
        return false;
    }
}

function collisionBombDroite(x, y, v){
    var i;
    var pos = x + v + 15;
    if(bombs.length !==0) {
        for(i = 0; i < bombs.length; i++){
            if(pos > bombs[i].x && pos < bombs[i].x + bombs[i].taille &&
                ((y >= bombs[i].y && y < bombs[i].y + bombs[i].taille))){
                return true;
            }
        }
        return false;
    }
}

function collisionBombBas(x, y, v){
    var i;
    var pos = y + v + 10;
    if(bombs.length !==0) {
        for(i = 0; i < bombs.length; i++){
            if(pos > bombs[i].getY() && pos < bombs[i].getY() + bombs[i].getTailleBomb() &&
                ((x-10 > bombs[i].getX() && x-10 < bombs[i].getX() + bombs[i].getTailleBomb()) ||
                (x+10 > bombs[i].getX() && x+10 < bombs[i].getX() + bombs[i].getTailleBomb()))){
                return true;
            }
        }
        return false;
    }
}

function isOnBomb(player){
    var i;
    var posX = player.x + (player.w / 2);
    var posY = player.y + player.h;
    if(player.droppedBomb) {
        for (i = 0; i < bombs.length; i++) {
            if( posY <= (bombs[i].y + bombs[i].taille) &&
                posY >= (bombs[i].y)
                && posX <= (bombs[i].x + bombs[i].taille)
                && posX >= bombs[i].x && bombs[i].isUnlock
            ) {

                return true;
            }
            else{
                bombs[i].isUnlock = false;
            }
        }
        player.droppedBomb = false;
    }
    return false;
}

//==========================================================