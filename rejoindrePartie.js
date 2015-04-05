var socket = io.connect();


var allParty = [];


socket.on('listGame', function(tab){
    allParty = tab;
    showJoin();
});

function showJoin(){
    var i;
    $('#joinrooms').empty();
    for(i = 0; i < allParty.length; i++){
        if(allParty[i][2] < allParty[i][1]) {
            $('#joinrooms').append('<div><a href="#" onclick="switchParty(\'' + allParty[i][0] + '\')">' + allParty[i][0] + '</a></div>');
        }
    }
}


function switchParty(party){
    var i;
    for(i=0;i<allParty.length;i++){
        if(party === allParty[i][0]){
            if((allParty[i][2] + 1) !== allParty[i][1]) {
                socket.emit('switchJoin', allParty[i], false);
                $('#nbPresentPlayer').text('(' + (allParty[i][2]+1) + '/' + allParty[i][1] + ')');
                waitPlayer = true;
                document.getElementById("waintingPlayerDiv").style.visibility = "visible";
                drawWait();
            }
            else{
                socket.emit('switchJoin', allParty[i], true);
            }
        }
    }
    document.getElementById("listJoining").style.visibility = "hidden";
    boolJoin = false;
}

function drawWait(){
    $('#waitingPlayer').empty();
    $('#waitingPlayer').append('<img src="http://img11.hostingpics.net/pics/394874loading.gif" />');
}

function drawButtonJoin(){
    ctx.drawImage(backOption.img, backOption.x, backOption.y, backOption.w, backOption.h);
}



