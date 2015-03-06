// Fonction dessinant le background
function drawBackground(){
    ctxBckg.save();
    ctxBckg.fillStyle = 'black';
    ctxBckg.fillRect(0, 0, wBckg, hBckg);
    ctxBckg.restore();
}