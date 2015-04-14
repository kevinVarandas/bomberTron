var socket = io.connect();
var winnerUsername;

socket.on('testEndGame', function(nb){
    if(nb === 1){
        socket.emit('finishGame');
    }
});

socket.on('endGame', function(){
    //console.log(id);
    /*if(player.idJoueur === id){
        socket.emit('finDePartie', player.username);
    }*/
    menu = true;
});

socket.on('afficheWinner', function(username){
    theEnd = true;
    winnerUsername = username;
});

function drawEnd(){
    $('#winnerName').text(winnerUsername + " a gagné !");
    document.getElementById("winnerDiv").style.visibility = "visible";
}

