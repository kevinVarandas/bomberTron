var socket = io.connect();
var winnerUsername;

socket.on('testEndGame', function(){
    socket.emit('finishGame');
});

socket.on('endGame', function(){
    if(player.alive === true){
        winnerUsername = player.username;
        //console.log(winnerUsername);
        socket.emit('finishGame', winnerUsername);
    }
});

socket.on('afficheWinner', function(username){
    theEnd = true;
    winnerUsername = username;
    //console.log(username);
    socket.emit('switchRoom', 'Acceuil');
});

function drawEnd(){
    //console.log(winnerUsername);
    $('#winnerName').text(winnerUsername + " a gagné !");
    document.getElementById("winnerDiv").style.visibility = "visible";

}

