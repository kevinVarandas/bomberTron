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
function addBomb(Player){
    var xBomb = (Player.x + (Player.w/2));
    var yBomb = (Player.y + Player.h);
    var subX =  (Player.x + (Player.w/2)) % tailleCaseFixe;
    var subY = (Player.y + Player.h) % tailleCaseFixe;

    bombs.push(new Bomb(xBomb - subX, yBomb - subY, Player, 1, 1, tailleCaseFixe));
    socket.emit('updateTabBomb', bombs);
}

socket.on('updateBombsTab', function(bombes){
    //bombs = bombes;
    window.alert(bombs.length);
    bombs = [];
    var i;
    for(i = 0; i < bombes.length; i++){
        bombs.push(bombes[i]);
    }
    window.alert(bombs.length);
});

// fonction qui dessine les bombes
function drawBombs(){
    var i;
    for(i = 0; i<bombs.length; i++){
        if(bombs[i].type == Sonic) {
            window.alert("Sonic");
            ctx.drawImage(bombeSonic, bombs[i].x, bombs[i].y, 40, 40);
        }else if(bombs[i].type == Mario){
            window.alert("Mario");
            ctx.drawImage(bombeMario, bombs[i].x, bombs[i].y, 40, 40);
        }else if(bombs[i].type == Pika){
            ctx.drawImage(bombePika, bombs[i].x, bombs[i].y, 40, 40);
        }else if(bombs[i].type == Link){
            ctx.drawImage(bombeLink, bombs[i].x, bombs[i].y, 40, 40);
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
// Objet bomberman
function Bomb(x, y, type, puissance, duree, taille){
    this.x = x;
    this.y = y;
    this.type = type;
    this.puissance = puissance;
    this.duree = duree;
    this.taille = taille;

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

//==========================================================