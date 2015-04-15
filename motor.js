

var socket = io.connect();
var idSelected = -1;

// VAR TOUCHES
var gauche = false;
var droite = false;
var bas = false;
var haut = false;
var espace = false;
var toucheEnfoncee = false;



//Fonction traitant les clics
function traiteClick(evt){
    var xPos, yPos;
    xPos = evt.clientX;
    yPos = evt.clientY;

    if(menu)
    {

        if(xPos > twoPlayerOption.x && xPos < (twoPlayerOption.x + optionWidth) &&
            yPos > twoPlayerOption.y && yPos < (twoPlayerOption.y + optionHeight)){
            idSelected = 2;
            socket.emit('createRoom', 2);
            menu = false;
            $('#nbPresentPlayer').text('(1/2)');
            waitPlayer = true;
            document.getElementById("waintingPlayerDiv").style.visibility = "visible";
            drawWait();
        }
        else if(xPos > threePlayerOPtion.x && xPos < (threePlayerOPtion.x + optionWidth) &&
            yPos > threePlayerOPtion.y && yPos < (threePlayerOPtion.y + optionHeight)){
            idSelected = 3;
            socket.emit('createRoom', 3);
            menu = false;
            $('#nbPresentPlayer').text('(1/3)');
            waitPlayer = true;
            document.getElementById("waintingPlayerDiv").style.visibility = "visible";
            drawWait();
        }
        else if(xPos > fourPlayerOption.x && xPos < (fourPlayerOption.x + optionWidth) &&
            yPos > fourPlayerOption.y && yPos < (fourPlayerOption.y + optionHeight)){
            idSelected = 4;
            socket.emit('createRoom', 4);
            menu = false;
            $('#nbPresentPlayer').text('(1/4)');
            waitPlayer = true;
            document.getElementById("waintingPlayerDiv").style.visibility = "visible";
            drawWait();
        }
        else if(xPos > rejoindreOption.x && xPos < (rejoindreOption.x + optionWidth) &&
            yPos > rejoindreOption.y && yPos < (rejoindreOption.y + optionHeight)){
            idSelected = 5;
            socket.emit('recupParty');
            backOption.img = backButton;
            boolJoin = true;
            document.getElementById("listJoining").style.visibility = "visible";
            menu = false;
        }
    }
    if(boolJoin){
        if(xPos > backOption.x && xPos < (backOption.x + backOption.w) && yPos > backOption.y && yPos < (backOption.y + backOption.h)){
            backOption.img = backButtonPushed;
            menu = true;
            boolJoin = false;
        }
    }
}

socket.on('changeRoom', function(room){
    socket.emit('switchRoom', room);
});


// Fonction traitant les touches pressees
function traiteToucheAppuyee(evt){
    if (evt.keyCode === 37) {
        if(!menu && !boolJoin && !waitPlayer) {
            if(player.alive){
                toucheEnfoncee = true;
                gauche = true;
            }
        }
    } else if (evt.keyCode === 39) {
        if(!menu && !boolJoin && !waitPlayer) {
            if (player.alive) {
                toucheEnfoncee = true;
                droite = true;
            }
        }
    } else if (evt.keyCode === 40) {
        if(!menu && !boolJoin && !waitPlayer) {
            if (player.alive) {
                toucheEnfoncee = true;
                bas = true;
            }
        }
    } else if (evt.keyCode === 38) {
        if(!menu && !boolJoin && !waitPlayer) {
            if (player.alive) {
                toucheEnfoncee = true;
                haut = true;
            }
        }
    }
    //Espace
    else if(evt.keyCode === 32){
        toucheEnfoncee = true;
        espace = true;
        if(!menu && !theEnd){
            if(player.nbBomb > 0 && player.alive)
            {
                addBomb(player.forme,player.idJoueur);
                player.nbBomb--;
            }
        }
        if(theEnd){
            theEnd = false;
            sound.stop();
            menu = true;
            document.getElementById("winnerDiv").style.visibility = "hidden";
        }
    }
}
// Fonction traitant les touches relachees
function traiteToucheRelachee(evt){
    toucheEnfoncee = false;

    if(evt.keyCode === 37 && !menu && !boolJoin && !waitPlayer){
        gauche = false;
        if(player.idJoueur === 1) {
            Sonic.picx = Sonic.w;
            Sonic.picy = 3 * Sonic.h;
            socket.emit('SonicSheet', Sonic.w, 3 * Sonic.h);
        }
        if(player.idJoueur === 4) {
            Pika.picx = 0;
            Pika.picy = 2 * Pika.h;
            socket.emit('PikaSheet', 0, 2 * Pika.h);
        }
        if(player.idJoueur === 3) {
            Link.picx = 0;
            Link.picy = 3 * Link.h;
            socket.emit('LinkSheet', 0, 3 * Link.h);
        }
        if(player.idJoueur === 2) {
            Mario.picx = 0;
            Mario.picy = 2 * Mario.h;
            socket.emit('MarioSheet', 0, 2 * Mario.h);
        }
    }else if(evt.keyCode === 39 && !menu && !boolJoin && !waitPlayer){
        droite = false;
        if(player.idJoueur === 1) {
            Sonic.picx = Sonic.w;
            Sonic.picy = Sonic.h;
            socket.emit('SonicSheet', Sonic.w, Sonic.h);
        }
        if(player.idJoueur === 4) {
            Pika.picx = 0;
            Pika.picy = 3 * Pika.h;
            socket.emit('PikaSheet', 0, 3 * Pika.h);
        }
        if(player.idJoueur === 3) {
            Link.picx = 0;
            Link.picy = 2 * Link.h;
            socket.emit('LinkSheet', 0, 2 * Link.h);
        }
        if(player.idJoueur === 2) {
            Mario.picx = 0;
            Mario.picy = 3 * Mario.h;
            socket.emit('MarioSheet', 0, 3 * Mario.h);
        }
    }else if(evt.keyCode === 40 && !menu && !boolJoin && !waitPlayer){
        bas = false;
        if(player.idJoueur === 1) {
            Sonic.picx = Sonic.w;
            Sonic.picy = 2 * Sonic.h;
            socket.emit('SonicSheet', Sonic.w, 2 * Sonic.h);
        }
        if(player.idJoueur === 4) {
            Pika.picx = 0;
            Pika.picy = 0;
            socket.emit('PikaSheet', 0, 0);
        }
        if(player.idJoueur === 3) {
            Link.picx = 0;
            Link.picy = 0;
            socket.emit('LinkSheet', 0, 0);
        }
        if(player.idJoueur === 2) {
            Mario.picx = 0;
            Mario.picy = 0;
            socket.emit('MarioSheet', 0, 0);
        }
    }else if(evt.keyCode === 38 && !menu && !boolJoin && !waitPlayer){
        haut = false;
        if(player.idJoueur === 1) {
            Sonic.picx = Sonic.w;
            Sonic.picy = 0;
            socket.emit('SonicSheet', Sonic.w, 0);
        }
        if(player.idJoueur === 4) {
            Pika.picx = 0;
            Pika.picy = Pika.h;
            socket.emit('PikaSheet', 0, Pika.h);
        }
        if(player.idJoueur === 3) {
            Link.picx = 0;
            Link.picy = Link.h;
            socket.emit('LinkSheet', 0, Link.h);
        }
        if(player.idJoueur === 2) {
            Mario.picx = 0;
            Mario.picy = Mario.h;
            socket.emit('MarioSheet', 0, Mario.h);
        }
    }
    else if(evt.keyCode === 32){
        espace = false;
    }
    Sonic.cpt = 0;
    Mario.cpt = 0;
    Pika.cpt = 0;
    Link.cpt = 0;
}

function anime(time){
    // 1 On efface la zone (le canvas)
    ctx.clearRect(0, 0, w, h);
    if(menu)
    {
        showMenu();
    }
    else if(boolJoin){
        drawButtonJoin();
    }
    else if(waitPlayer){
        //drawWait();
    }
    else if(theEnd){
        drawEnd();
    }
    else {
        drawBonus();
        drawGame();
        drawBombs();
        if(Sonic.prst){
            drawSonic();
        }
        if(Mario.prst){
            drawMario();
        }
        if(Pika.prst){
            drawPika();
        }
        if(Link.prst){
            drawLink();
        }
    }
    requestAnimationFrame(anime);
}