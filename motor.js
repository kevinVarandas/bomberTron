

var socket = io.connect();
var idSelected = -1;

// VAR TOUCHES
var gauche = false;
var droite = false;
var bas = false;
var haut = false;
var espace = false;
var toucheEnfoncee = false;

function deselectOther(id){
    switch (id){
        case 2:
            twoPlayerOption.img = twoPlayers;
            break;
        case 3:
            threePlayerOPtion.img = threePlayers;
            break;
        case 4:
            fourPlayerOption.img = fourPlayers;
            break;
        case 5:
            rejoindreOption.img = rejoindre;
            break;
        default :
            break;
    }
}

//Fonction traitant les clics
function traiteClick(evt){
    var xPos, yPos;
    xPos = evt.clientX;
    yPos = evt.clientY;

    if(menu)
    {

        if(xPos > twoPlayerOption.x && xPos < (twoPlayerOption.x + optionWidth) &&
                yPos > twoPlayerOption.y && yPos < (twoPlayerOption.y + optionHeight)){
            twoPlayerOption.img = twoPlayersSelect;
            deselectOther(idSelected);
            idSelected = 2;
            socket.emit('createRoom', 2);
            menu = false;
            $('#nbPresentPlayer').text('(1/2)');
            waitPlayer = true;
        }
        else if(xPos > threePlayerOPtion.x && xPos < (threePlayerOPtion.x + optionWidth) &&
            yPos > threePlayerOPtion.y && yPos < (threePlayerOPtion.y + optionHeight)){
            threePlayerOPtion.img = threePlayersSelect;
            deselectOther(idSelected);
            idSelected = 3;
            socket.emit('createRoom', 3);
            menu = false;
            $('#nbPresentPlayer').text('(1/3)');
            waitPlayer = true;
        }
        else if(xPos > fourPlayerOption.x && xPos < (fourPlayerOption.x + optionWidth) &&
            yPos > fourPlayerOption.y && yPos < (fourPlayerOption.y + optionHeight)){
            fourPlayerOption.img = fourPlayersSelect;
            deselectOther(idSelected);
            idSelected = 4;
            socket.emit('createRoom', 4);
            menu = false;
            $('#nbPresentPlayer').text('(1/4)');
            waitPlayer = true;
        }
        else if(xPos > rejoindreOption.x && xPos < (rejoindreOption.x + optionWidth) &&
            yPos > rejoindreOption.y && yPos < (rejoindreOption.y + optionHeight)){
            rejoindreOption.img = rejoindreSelect;
            deselectOther(idSelected);
            idSelected = 5;
            socket.emit('recupParty');
            boolJoin = true;
            menu = false;
        }
    }
}

socket.on('changeRoom', function(room){
    socket.emit('switchRoom', room);
});


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
    else if(evt.keyCode === 32){
        toucheEnfoncee = true;
        espace = true;
        if(menu){
            menu = false;
        }
        else {
            addBomb(player.forme,player.idJoueur);
        }
    }
}
// Fonction traitant les touches relachees
function traiteToucheRelachee(evt){
    toucheEnfoncee = false;

    if(evt.keyCode === 37){
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
    }else if(evt.keyCode === 39){
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
    }else if(evt.keyCode === 40){
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
    }else if(evt.keyCode === 38){
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
    if(!boolJoin){
        document.getElementById("listJoining").style.visibility = "hidden";
    }
    if(!waitPlayer){
        document.getElementById("waintingPlayerDiv").style.visibility = "hidden";
    }
    if(menu)
    {
        showMenu();
    }
    else if(boolJoin){
        document.getElementById("listJoining").style.visibility = "visible";
        showJoin();
    }
    else if(waitPlayer){
        document.getElementById("waintingPlayerDiv").style.visibility = "visible";
        drawWait();
    }
    else {
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