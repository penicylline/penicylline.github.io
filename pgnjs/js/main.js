/**
 * Created by hoaibui on 10/28/16.
 */

var g = new Game();

window.onload = function() {
    var viewer = new Viewer('chess-table');
    g.setViewer(viewer);

    document.getElementById('btnPrev').addEventListener('click', function(e) {
        viewer.prevState();
    });
    document.getElementById('btnNext').addEventListener('click', function(e) {
        viewer.nextState();
    });

    document.getElementById('btnParse').addEventListener('click', function(e) {
        g.load(document.getElementById('game').innerHTML);
    });

    getGameContent('./data/pgn.dat');
};

function getGameContent(url) {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            document.getElementById('game').innerText = xmlhttp.responseText;
            window.game = xmlhttp.responseText;
            g.load(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}