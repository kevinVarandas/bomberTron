var socket = io.connect();

var tailleCaseFixe = 40;

//Tableau de bombes
var bombs = [];

//VAR tableau de cases
var cases = [];

//VAR bonus
var bonus = [];

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

function addBonus(){
    var i;
    var rand;

    for(i = 0; i < cases.length; i++){
        rand = Math.floor(Math.random() * 15);
        if(!cases[i].isFixe() && rand === 0){
            bonus.push(new Bonus(cases[i].x,cases[i].y, cases[i].tailleCase));
        }
    }
}

socket.on('getBonus',function(bon){
    var i;
    for(i = 0; i<bon.length; i++){
        bonus.push(new Bonus(bon[i].x,bon[i].y,bon[i].taille));
    }
});

//fonction qui ajoute des bombes qd on appuis sur espace
function addBomb(Player,id){
    //soundExplo.play();
    socket.emit('eventSoundExplo');
    var xBomb = (Player.x + (Player.w/2));
    var yBomb = (Player.y + Player.h);
    var subX =  (Player.x + (Player.w/2)) % tailleCaseFixe;
    var subY = (Player.y + Player.h) % tailleCaseFixe;
    Player.droppedBomb = true;
    bombs.push(new Bomb(xBomb - subX, yBomb - subY, id, 2, 120, tailleCaseFixe));
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

socket.on('updateCasesTab', function(c){
    cases = [];
    var i;
    for(i=0;i<c.length;i++){
        cases.push(new Case(c[i].x, c[i].y, c[i].type, c[i].tailleCase));
    }
});

socket.on('updatePlayersPrst', function(forme, tab){
    player.nbJoueur = tab;
   switch(forme){
       case 1:
           Sonic.prst = false;
           break;
       case 2:
           Mario.prst = false;
           break;
       case 3:
           Link.prst = false;
           break;
       case 4:
           Pika.prst = false;
           break;
   }
});

function drawBonus(){
    var i;

    for(i = 0; i < bonus.length; i++){
        ctx.drawImage(bonusUpPower,bonus[i].x,bonus[i].y,bonus[i].taille-10,bonus[i].taille-10)
    }
}

// fonction qui dessine les bombes
function drawBombs(){
    var i;

    for(i = 0; i<bombs.length; i++){
        if(bombs[i].type === 1 && bombs[i].duree > 40) {
            ctx.drawImage(bombeSonic, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].type === 2 && bombs[i].duree > 40){
            ctx.drawImage(bombeMario, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].type === 4 && bombs[i].duree > 40){
            ctx.drawImage(bombePika, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].type === 3 && bombs[i].duree > 40){
            ctx.drawImage(bombeLink, bombs[i].x, bombs[i].y, 40, 40);
            bombs[i].duree -= 1;
        }else if(bombs[i].duree > 0){
            if(bombs[i].type === player.idJoueur && bombs[i].duree === 30){
                player.nbBomb++;
            }
            drawExplosion(bombs[i], bombs[i].timeOpacity);
            bombs[i].duree -= 1;
            bombs[i].timeOpacity += 2;
        }
        else{

            bombs.splice(i,1);
            socket.emit('updateTabBomb', bombs);
        }

    }
}

function drawExplosion(bombe, opacity){
    var j;
    var tailleHaut;
    var tailleBas;
    var tailleGauche;
    var tailleDroite;
    ctx.save();
    ctx.globalAlpha=(1.0 - (0.01*opacity));
    switch(bombe.type){
        case 1:
            ctx.drawImage(centreExplosion, 0, 0, 40, 40, bombe.x, bombe.y, 40, 40);

            for(tailleHaut=1;tailleHaut<bombe.puissance;tailleHaut++) {
                if (!collisionExplosionHaut(bombe, tailleHaut)) {
                    ctx.drawImage(corpsExplosion, 0, 120, 40, 40, bombe.x, bombe.y - (tailleHaut * 40), 40, 40);
                } else {
                    break;
                }
            }
            for(tailleBas=1;tailleBas<bombe.puissance;tailleBas++){
                if(!collisionExplosionBas(bombe, tailleBas)){
                    ctx.drawImage(corpsExplosion, 0, 120, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
                }else{
                    break;
                }
            }
            for(tailleGauche=1;tailleGauche<bombe.puissance;tailleGauche++){
                if(!collisionExplosionGauche(bombe, tailleGauche)){
                    ctx.drawImage(corpsExplosion, 0, 0, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }
            for(tailleDroite=1;tailleDroite<bombe.puissance;tailleDroite++){
                if(!collisionExplosionDroite(bombe, tailleDroite)){
                    ctx.drawImage(corpsExplosion, 0, 0, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }
            if(!collisionExplosionHaut(bombe, tailleHaut) && tailleHaut>1){
                ctx.drawImage(teteExplosion, 0, 160, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
            }else if(tailleHaut>1){
                ctx.drawImage(teteExplosion, 0, 160, 40, 40, bombe.x, bombe.y - ((tailleHaut-1)*40), 40, 40);
            }
            if(!collisionExplosionBas(bombe, tailleBas) && tailleBas>1){
                ctx.drawImage(teteExplosion, 0, 320, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
            }else if(tailleBas>1){
                ctx.drawImage(teteExplosion, 0, 320, 40, 40, bombe.x, bombe.y + ((tailleBas-1)*40), 40, 40);
            }
            if(!collisionExplosionGauche(bombe, tailleGauche) && tailleGauche>1){
                ctx.drawImage(teteExplosion, 0, 0, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
            }else if(tailleGauche>1){
                ctx.drawImage(teteExplosion, 0, 0, 40, 40, bombe.x - ((tailleGauche-1)*40), bombe.y, 40, 40);
            }
            if(!collisionExplosionDroite(bombe, tailleDroite) && tailleDroite>1){
                ctx.drawImage(teteExplosion, 0, 480, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
            }else if(tailleDroite>1){
                ctx.drawImage(teteExplosion, 0, 480, 40, 40, bombe.x + ((tailleDroite-1)*40), bombe.y, 40, 40);
            }



            break;
        case 2:
            ctx.drawImage(centreExplosion, 80, 0, 40, 40, bombe.x, bombe.y, 40, 40);

            for(tailleHaut=1;tailleHaut<bombe.puissance;tailleHaut++) {
                if (!collisionExplosionHaut(bombe, tailleHaut)) {
                    ctx.drawImage(corpsExplosion, 80, 120, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
                } else {
                    break;
                }
            }
            for(tailleBas=1;tailleBas<bombe.puissance;tailleBas++){
                if(!collisionExplosionBas(bombe, tailleBas)){
                    ctx.drawImage(corpsExplosion, 80, 120, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
                }else{
                    break;
                }
            }
            for(tailleGauche=1;tailleGauche<bombe.puissance;tailleGauche++){
                if(!collisionExplosionGauche(bombe, tailleGauche)){
                    ctx.drawImage(corpsExplosion, 80, 0, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }
            for(tailleDroite=1;tailleDroite<bombe.puissance;tailleDroite++){
                if(!collisionExplosionDroite(bombe, tailleDroite)){
                    ctx.drawImage(corpsExplosion, 80, 0, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }

            if(!collisionExplosionHaut(bombe, tailleHaut) && tailleHaut>1){
                ctx.drawImage(teteExplosion, 80, 160, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
            }else if(tailleHaut>1){
                ctx.drawImage(teteExplosion, 80, 160, 40, 40, bombe.x, bombe.y - ((tailleHaut-1)*40), 40, 40);
            }
            if(!collisionExplosionBas(bombe, tailleBas) && tailleBas>1){
                ctx.drawImage(teteExplosion, 80, 320, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
            }else if(tailleBas>1){
                ctx.drawImage(teteExplosion, 80, 320, 40, 40, bombe.x, bombe.y + ((tailleBas-1)*40), 40, 40);
            }
            if(!collisionExplosionGauche(bombe, tailleGauche) && tailleGauche>1){
                ctx.drawImage(teteExplosion, 80, 0, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
            }else if(tailleGauche>1){
                ctx.drawImage(teteExplosion, 80, 0, 40, 40, bombe.x - ((tailleGauche-1)*40), bombe.y, 40, 40);
            }
            if(!collisionExplosionDroite(bombe, tailleDroite) && tailleDroite>1){
                ctx.drawImage(teteExplosion, 80, 480, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
            }else if(tailleDroite>1){
                ctx.drawImage(teteExplosion, 80, 480, 40, 40, bombe.x + ((tailleDroite-1)*40), bombe.y, 40, 40);
            }

            break;
        case 3:
            ctx.drawImage(centreExplosion, 120, 40, 40, 40, bombe.x, bombe.y, 40, 40);

            for(tailleHaut=1;tailleHaut<bombe.puissance;tailleHaut++) {
                if (!collisionExplosionHaut(bombe, tailleHaut)) {
                    ctx.drawImage(corpsExplosion, 40, 160, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
                } else {
                    break;
                }
            }
            for(tailleBas=1;tailleBas<bombe.puissance;tailleBas++){
                if(!collisionExplosionBas(bombe, tailleBas)){
                    ctx.drawImage(corpsExplosion, 40, 160, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
                }else{
                    break;
                }
            }
            for(tailleGauche=1;tailleGauche<bombe.puissance;tailleGauche++){
                if(!collisionExplosionGauche(bombe, tailleGauche)){
                    ctx.drawImage(corpsExplosion, 40, 40, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }
            for(tailleDroite=1;tailleDroite<bombe.puissance;tailleDroite++){
                if(!collisionExplosionDroite(bombe, tailleDroite)){
                    ctx.drawImage(corpsExplosion, 40, 40, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }

            if(!collisionExplosionHaut(bombe, tailleHaut) && tailleHaut>1){
                ctx.drawImage(teteExplosion, 40, 240, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
            }else if(tailleHaut>1){
                ctx.drawImage(teteExplosion, 40, 240, 40, 40, bombe.x, bombe.y - ((tailleHaut-1)*40), 40, 40);
            }
            if(!collisionExplosionBas(bombe, tailleBas) && tailleBas>1){
                ctx.drawImage(teteExplosion, 40, 400, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
            }else if(tailleBas>1){
                ctx.drawImage(teteExplosion, 40, 400, 40, 40, bombe.x, bombe.y + ((tailleBas-1)*40), 40, 40);
            }
            if(!collisionExplosionGauche(bombe, tailleGauche) && tailleGauche>1){
                ctx.drawImage(teteExplosion, 40, 80, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
            }else if(tailleGauche>1){
                ctx.drawImage(teteExplosion, 40, 80, 40, 40, bombe.x - ((tailleGauche-1)*40), bombe.y, 40, 40);
            }
            if(!collisionExplosionDroite(bombe, tailleDroite) && tailleDroite>1){
                ctx.drawImage(teteExplosion, 40, 560, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
            }else if(tailleDroite>1){
                ctx.drawImage(teteExplosion, 40, 560, 40, 40, bombe.x + ((tailleDroite-1)*40), bombe.y, 40, 40);
            }

            break;
        case 4:
            ctx.drawImage(centreExplosion, 40, 40, 40, 40, bombe.x, bombe.y, 40, 40);

            for(tailleHaut=1;tailleHaut<bombe.puissance;tailleHaut++) {
                if (!collisionExplosionHaut(bombe, tailleHaut)) {
                    ctx.drawImage(corpsExplosion, 120, 160, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
                } else {
                    break;
                }
            }
            for(tailleBas=1;tailleBas<bombe.puissance;tailleBas++){
                if(!collisionExplosionBas(bombe, tailleBas)){
                    ctx.drawImage(corpsExplosion, 120, 160, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
                }else{
                    break;
                }
            }
            for(tailleGauche=1;tailleGauche<bombe.puissance;tailleGauche++){
                if(!collisionExplosionGauche(bombe, tailleGauche)){
                    ctx.drawImage(corpsExplosion, 120, 40, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }
            for(tailleDroite=1;tailleDroite<bombe.puissance;tailleDroite++){
                if(!collisionExplosionDroite(bombe, tailleDroite)){
                    ctx.drawImage(corpsExplosion, 120, 40, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
                }else{
                    break;
                }
            }

            if(!collisionExplosionHaut(bombe, tailleHaut) && tailleHaut>1){
                ctx.drawImage(teteExplosion, 120, 240, 40, 40, bombe.x, bombe.y - (tailleHaut*40), 40, 40);
            }else if(tailleHaut>1){
                ctx.drawImage(teteExplosion, 120, 240, 40, 40, bombe.x, bombe.y - ((tailleHaut-1)*40), 40, 40);
            }
            if(!collisionExplosionBas(bombe, tailleBas) && tailleBas>1){
                ctx.drawImage(teteExplosion, 120, 400, 40, 40, bombe.x, bombe.y + (tailleBas*40), 40, 40);
            }else if(tailleBas>1){
                ctx.drawImage(teteExplosion, 120, 400, 40, 40, bombe.x, bombe.y + ((tailleBas-1)*40), 40, 40);
            }
            if(!collisionExplosionGauche(bombe, tailleGauche) && tailleGauche>1){
                ctx.drawImage(teteExplosion, 120, 80, 40, 40, bombe.x - (tailleGauche*40), bombe.y, 40, 40);
            }else if(tailleGauche>1){
                ctx.drawImage(teteExplosion, 120, 80, 40, 40, bombe.x - ((tailleGauche-1)*40), bombe.y, 40, 40);
            }
            if(!collisionExplosionDroite(bombe, tailleDroite) && tailleDroite>1){
                ctx.drawImage(teteExplosion, 120, 560, 40, 40, bombe.x + (tailleDroite*40), bombe.y, 40, 40);
            }else if(tailleDroite>1){
                ctx.drawImage(teteExplosion, 120, 560, 40, 40, bombe.x + ((tailleDroite-1)*40), bombe.y, 40, 40);
            }

            break;
    }
    ctx.restore();
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
    this.timeOpacity = 1;
    this.isUnlock = true;

    this.getX = function(){return this.x;};
    this.getY = function(){return this.y;};
    this.getTailleBomb = function(){return this.taille};
}

function Bonus(x,y,taille){
    this.x = x;
    this.y = y;
    this.taille = taille;
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

    createPerso();
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
    var pos = y - v - 10;
    if(bombs.length !==0) {
        for(i = 0; i < bombs.length; i++){
            if (pos > bombs[i].y && pos < bombs[i].y + bombs[i].taille &&
                ((x - 5 > bombs[i].x && x - 5 < bombs[i].x + bombs[i].taille) ||
                (x + 5 > bombs[i].x && x + 5 < bombs[i].x + bombs[i].taille))){
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

function collisionBombDroite(x, y, v) {
    var i;
    var pos = x + v + 15;
    if (bombs.length !== 0) {
        for (i = 0; i < bombs.length; i++) {
            if (pos > bombs[i].x && pos < bombs[i].x + bombs[i].taille &&
                ((y >= bombs[i].y && y < bombs[i].y + bombs[i].taille))) {
                if (pos > bombs[i].getY() && pos < bombs[i].getY() + bombs[i].taille &&
                    ((x - 10 > bombs[i].getX() && x - 10 < bombs[i].getX() + bombs[i].taille) ||
                    (x + 10 > bombs[i].getX() && x + 10 < bombs[i].getX() + bombs[i].taille))) {
                    return true;
                }
            }
            return false;
        }
    }
}

    function isOnBomb(forme) {
        var i;
        var posX = forme.x + (forme.w / 2);
        var posY = forme.y + forme.h;
        if (forme.droppedBomb) {
            for (i = 0; i < bombs.length; i++) {
                if (posY <= (bombs[i].y + bombs[i].taille) &&
                    posY >= (bombs[i].y)
                    && posX <= (bombs[i].x + bombs[i].taille)
                    && posX >= bombs[i].x && bombs[i].isUnlock
                    && bombs[i].type === player.idJoueur
                ) {

                    return true;
                }
                else {
                    bombs[i].isUnlock = false;
                    socket.emit('updateTabBomb', bombs);
                }
            }
            forme.droppedBomb = false;
        }
        return false;
    }

    function collisionExplosionHaut(bombe, i) {
        var yExplo = i * 40;
        var i;
        for (i = 0; i < cases.length; i++) {
            if (cases[i].isFixe()) {
                if ((bombe.y - yExplo) >= cases[i].y && (bombe.y - yExplo) < (cases[i].y + cases[i].tailleCase) &&
                    bombe.x >= cases[i].x && bombe.x < (cases[i].x + cases[i].tailleCase)) {
                    return true;
                }
            }
            else {
                if ((bombe.y - yExplo) >= cases[i].y && (bombe.y - yExplo) < (cases[i].y + cases[i].tailleCase) &&
                    bombe.x >= cases[i].x && bombe.x < (cases[i].x + cases[i].tailleCase)) {
                    var r = Math.floor(Math.random() * 15);
                    if (r === 0) {
                    }
                    cases.splice(i, 1);
                    socket.emit("updateCases", cases);
                }
            }
            if (((bombe.x) < (Sonic.x + (Sonic.w / 2)) && (bombe.x + 40) >= (Sonic.x + (Sonic.w / 2)) && (bombe.y - yExplo) <= (Sonic.y) && (bombe.y + 40) > (Sonic.y))) {
                Sonic.prst = false;
                if (player.idJoueur === 1) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 1, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x) < (Mario.x + (Mario.w / 2)) && (bombe.x + 40) >= (Mario.x + (Mario.w / 2)) && (bombe.y - yExplo) <= (Mario.y) && (bombe.y + 40) > (Mario.y))) {
                Mario.prst = false;
                if (player.idJoueur === 2) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 2, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x) < (Link.x + (Link.w / 2)) && (bombe.x + 40) >= (Link.x + (Link.w / 2)) && (bombe.y - yExplo) <= (Link.y) && (bombe.y + 40) > (Link.y))) {
                Link.prst = false;
                if (player.idJoueur === 3) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 3, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x) < (Pika.x + (Pika.w / 2)) && (bombe.x + 40) >= (Pika.x + (Pika.w / 2)) && (bombe.y - yExplo) <= (Pika.y) && (bombe.y + 40) > (Pika.y))) {
                Pika.prst = false;
                if (player.idJoueur === 4) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 4, player.nbJoueur);
                    }
                }
            }
        }
        return false;
    }

    function collisionExplosionBas(bombe, i) {
        var yExplo = i * 40;
        var i;
        for (i = 0; i < cases.length; i++) {
            if (cases[i].isFixe()) {
                if ((bombe.y + yExplo) >= cases[i].y && (bombe.y + yExplo) < (cases[i].y + cases[i].tailleCase) &&
                    bombe.x >= cases[i].x && bombe.x < (cases[i].x + cases[i].tailleCase)) {
                    return true;
                }
            }
            else {
                if ((bombe.y + yExplo) >= cases[i].y && (bombe.y + yExplo) < (cases[i].y + cases[i].tailleCase) &&
                    bombe.x >= cases[i].x && bombe.x < (cases[i].x + cases[i].tailleCase)) {
                    var r = Math.floor(Math.random() * 15);
                    if (r === 0) {
                    }
                    cases.splice(i, 1);
                    socket.emit("updateCases", cases);
                }
            }
            if (((bombe.x) < (Sonic.x + (Sonic.w / 2)) && (bombe.x + 40) >= (Sonic.x + (Sonic.w / 2)) && (bombe.y + yExplo) >= (Sonic.y) && (bombe.y) <= (Sonic.y))) {
                Sonic.prst = false;
                if (player.idJoueur === 1) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 1, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x) < (Mario.x + (Mario.w / 2)) && (bombe.x + 40) >= (Mario.x + (Mario.w / 2)) && (bombe.y + yExplo) >= (Mario.y) && (bombe.y) <= (Mario.y))) {
                Mario.prst = false;
                if (player.idJoueur === 2) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 2, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x) < (Link.x + (Link.w / 2)) && (bombe.x + 40) >= (Link.x + (Link.w / 2)) && (bombe.y + yExplo) >= (Link.y) && (bombe.y) <= (Link.y))) {
                Link.prst = false;
                if (player.idJoueur === 3) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 3, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x) < (Pika.x + (Pika.w / 2)) && (bombe.x + 40) >= (Pika.x + (Pika.w / 2)) && (bombe.y + yExplo) >= (Pika.y) && (bombe.y) <= (Pika.y))) {
                Pika.prst = false;
                if (player.idJoueur === 4) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 4, player.nbJoueur);
                    }
                }
            }
        }
        return false;
    }

    function collisionExplosionGauche(bombe, i) {
        var xExplo = i * 40;
        var i;
        for (i = 0; i < cases.length; i++) {
            if (cases[i].isFixe()) {
                if ((bombe.x - xExplo) >= cases[i].x && (bombe.x - xExplo) < (cases[i].x + cases[i].tailleCase) &&
                    bombe.y >= cases[i].y && bombe.y < (cases[i].y + cases[i].tailleCase)) {
                    return true;
                }
            }
            else {
                if ((bombe.x - xExplo) >= cases[i].x && (bombe.x - xExplo) < (cases[i].x + cases[i].tailleCase) &&
                    bombe.y >= cases[i].y && bombe.y < (cases[i].y + cases[i].tailleCase)) {
                    var r = Math.floor(Math.random() * 15);
                    if (r === 0) {
                    }
                    cases.splice(i, 1);
                    socket.emit("updateCases", cases);
                }
            }
            if (((bombe.x - xExplo) < Sonic.x && (bombe.x + 40) >= (Sonic.x) && (bombe.y) <= (Sonic.y + (Sonic.h / 2)) && (bombe.y + 40) >= (Sonic.y + (Sonic.h / 2)))) {
                Sonic.prst = false;
                if (player.idJoueur === 1) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 1, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x - xExplo) < Mario.x && (bombe.x + 40) >= (Mario.x) && (bombe.y) <= (Mario.y + (Mario.h / 2)) && (bombe.y + 40) >= (Mario.y + (Mario.h / 2)))) {
                Mario.prst = false;
                if (player.idJoueur === 2) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 2, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x - xExplo) < Link.x && (bombe.x + 40) >= (Link.x) && (bombe.y) <= (Link.y + (Link.h / 2)) && (bombe.y + 40) >= (Link.y + (Link.h / 2)))) {
                Link.prst = false;
                if (player.idJoueur === 3) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 3, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x - xExplo) < Pika.x && (bombe.x + 40) >= (Pika.x) && (bombe.y) <= (Pika.y + (Pika.h / 2)) && (bombe.y + 40) >= (Pika.y + (Pika.h / 2)))) {
                Pika.prst = false;
                if (player.idJoueur === 4) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 4, player.nbJoueur);
                    }
                }
            }
        }
        return false;
    }

    function collisionExplosionDroite(bombe, n) {
        var xExplo = n * 40;
        var i;
        for (i = 0; i < cases.length; i++) {
            if (cases[i].isFixe()) {
                if ((bombe.x + xExplo) >= cases[i].x && (bombe.x + xExplo) < (cases[i].x + cases[i].tailleCase) &&
                    bombe.y >= cases[i].y && bombe.y < (cases[i].y + cases[i].tailleCase)) {
                    return true;
                }
            }
            else {
                if ((bombe.x + xExplo) >= cases[i].x && (bombe.x + xExplo) < (cases[i].x + cases[i].tailleCase) &&
                    bombe.y >= cases[i].y && bombe.y < (cases[i].y + cases[i].tailleCase)) {
                    var r = Math.floor(Math.random() * 15);
                    if (r === 0) {
                    }
                    cases.splice(i, 1);
                    socket.emit("updateCases", cases);
                }
            }
            if (((bombe.x + xExplo + 40) > Sonic.x && (bombe.x) <= (Sonic.x) && (bombe.y) <= (Sonic.y + (Sonic.h / 2)) && (bombe.y + 40) >= (Sonic.y + (Sonic.h / 2)))) {
                Sonic.prst = false;
                if (player.idJoueur === 1) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 1, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x + xExplo + 40) > Mario.x && (bombe.x) <= (Mario.x) && (bombe.y) <= (Mario.y + (Mario.h / 2)) && (bombe.y + 40) >= (Mario.y + (Mario.h / 2)))) {
                Mario.prst = false;
                if (player.idJoueur === 2) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 2, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x + xExplo + 40) > Link.x && (bombe.x) <= (Link.x) && (bombe.y) <= (Link.y + (Link.h / 2)) && (bombe.y + 40) >= (Link.y + (Link.h / 2)))) {
                Link.prst = false;
                if (player.idJoueur === 3) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 3, player.nbJoueur);
                    }
                }
            }
            if (((bombe.x + xExplo + 40) > Pika.x && (bombe.x) <= (Pika.x) && (bombe.y) <= (Pika.y + (Pika.h / 2)) && (bombe.y + 40) >= (Pika.y + (Pika.h / 2)))) {
                Pika.prst = false;
                if (player.idJoueur === 4) {
                    if (player.alive) {
                        player.alive = false;
                        player.nbJoueur--;
                        socket.emit("updatePlayerPrst", 4, player.nbJoueur);
                    }
                }
            }
        }
        return false;
    }
//==========================================================