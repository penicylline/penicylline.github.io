/**
 * Created by hoaibui on 10/28/16.
 */

var SymbolHelper = {
    white: {
        K: '♔',
        Q: '♕',
        R: '♖',
        B: '♗',
        N: '♘',
        P: '♙'
    },
    black: {
        K: '♚',
        Q: '♛',
        R: '♜',
        B: '♝',
        N: '♞',
        P: '♟'
    },
    getSymbol: function(name, color) {
        if (color == Color.BLACK) {
            return this.black[name];
        }
        return this.white[name];
    }
}

var Viewer = function(containerId) {
    this.containerId = containerId;
    this.cellPrefix = containerId + '_';
    this.cells = new Array();
    this.states = null;
    this.stateIndex = 0;
    this.init();
}

Viewer.prototype.init = function() {
    var table = document.createElement('table');
    table.cellPadding = 0;
    table.cellSpacing = 0;
    table.className = 'chess-table';
    for (var row = 0; row < 10; row++) {
        var tr = document.createElement('tr');
        table.appendChild(tr);
        for (var col = 0; col < 10; col++) {
            this.renderCell(tr, row, col);
        }
    }

    document.getElementById(this.containerId).appendChild(table);
}

Viewer.prototype.renderCell = function(tr, row, col) {
    var className = null;
    var inner = null;
    var cellIndex = null;
    if (row == 0 || row == 9) {
        if (col > 0 && col < 9) {
            inner = String.fromCharCode(CharHelper.aCode - 1 + col);
        }
    } else {
        if (col == 0 || col == 9) {
            inner = 9 - row;
        } else {
            var cellIndex = String.fromCharCode(CharHelper.aCode - 1 + col) + (9 - row);
            className = (row + col) % 2 ? 'black' : 'white';
        }
    }
    var td = document.createElement('td');
    tr.appendChild(td);
    td.className = className;
    if (inner) {
        td.innerText = inner;
    }
    if (cellIndex) {
        td.id = this.cellPrefix + cellIndex;
        this.cells[cellIndex] = td;
    }
}

Viewer.prototype.renderState = function (state) {
    var rows = state.split('|');
    if (rows.length != 9) {
        throw "Invalid state dump format: " + state;
    }
    for (var i = 1; i < 9; i++) {
        var row = rows.shift();
        for (var j = 0; j < 8; j++) {
            var cellIndex = CharHelper.chars[j] + i;
            if (this.cells[cellIndex].className.indexOf(' move-source')) {
                this.cells[cellIndex].className = this.cells[cellIndex].className.replace(' move-source', '');
            }
            if (this.cells[cellIndex].className.indexOf(' move-dest')) {
                this.cells[cellIndex].className = this.cells[cellIndex].className.replace(' move-dest', '');
            }
            if (row[j] == ' ') {
                this.cells[cellIndex].innerText = '';
            } else {
                if (row[j] < 'a') {
                    this.cells[cellIndex].innerText = SymbolHelper.getSymbol(row[j], Color.WHITE);
                } else {
                    this.cells[cellIndex].innerText = SymbolHelper.getSymbol(row[j].toUpperCase(), Color.WHITE)
                }
            }
        }
    }
    var moves = rows.shift();
    var cells = moves.split(' ');
    var sourceCells = cells[0].split(',');
    for (var i in sourceCells) {
        this.cells[sourceCells[i]].className = this.cells[sourceCells[i]].className + ' move-source';
    }
    var destCells = cells[1].split(',');
    for (var i in destCells) {
        this.cells[destCells[i]].className = this.cells[destCells[i]].className + ' move-dest';
    }
}

Viewer.prototype.setStates = function(states) {
    this.resetGame();
    this.states = states;
    this.renderCurrentState();
}

Viewer.prototype.setStateIndex = function (index) {
    this.stateIndex = index;
    this.renderCurrentState();
}

Viewer.prototype.renderCurrentState = function () {
    if (this.states) {
        this.renderState(this.states[this.stateIndex]);
    }
}

Viewer.prototype.nextState = function() {
    if (this.states && this.stateIndex < this.states.length - 1) {
        this.stateIndex++;
        this.renderCurrentState();
    }
}

Viewer.prototype.prevState = function() {
    if (this.states && this.stateIndex > 0) {
        this.stateIndex--;
        this.renderCurrentState();
    }
}



Viewer.prototype.dispatchEvent = function(event) {
    if (event instanceof GameEventReset) {
        return this.resetGame();
    }
    if (event instanceof GameEventPieceInit) {
        return this.initPiece(event.piece);
    }
    if (event instanceof GameEventFinish) {
        return this.finishGame(event.result);
    }
    if (event instanceof GameEventPieceMove) {
        return this.movePiece(event.from, event.to);
    }
    if (event instanceof GameEventPieceCaptured) {
        return this.capturePiece(event.piece);
    }
    if (event instanceof GameEventPromotion) {
        return this.promotePiece(event.piece);
    }
    throw "Unsupported game event " + event.toString();
}

Viewer.prototype.resetGame = function() {
    this.states = null;
    this.stateIndex = 0;
    for (var i in this.cells) {
        this.cells[i].innerText = null;
    }
}

Viewer.prototype.finishGame = function(result) {
    //TODO: ...
}

Viewer.prototype.movePiece = function(from, to) {
    var p = this.cells[from.raw].innerText;
    this.cells[from.raw].innerText = null;
    this.cells[to.raw].innerText = p;
}

Viewer.prototype.initPiece = function(piece) {
    this.cells[piece.position.raw].innerText = SymbolHelper.getSymbol(piece.name, piece.color);
}

Viewer.prototype.capturePiece = function(piece) {
    //TODO: ...
}

Viewer.prototype.promotePiece = function(piece) {
    //TODO: ...
}