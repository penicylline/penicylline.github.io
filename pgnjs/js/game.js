/**
 * Created by hoaibui on 10/22/16.
 */
var Game = function() {
    this.pieces = new Array();
    this.cells = new Array();
    this.removedWhite = new Array();
    this.removedBlack = new Array();
    this.moves = new Array();
    this.states = new Array();
    this.init();
}

Game.prototype.init = function() {
    for (var i = 1; i < 9; i++) {
        for (var c = 0; c < 8; c++) {
            var index = CharHelper.chars[c] + i;
            var cell = new Position(index);
            this.cells[index] = cell;
        }
    }
};

Game.prototype.createNewGame = function () {
    this.reset();
    for (i = 0; i < 8; i++) {
        this.pieces.push(new Pawn(
            String.fromCharCode(CharHelper.aCode + i) + '2',
            Color.WHITE,
            this
        ));
        this.pieces.push(new Pawn(
            String.fromCharCode(CharHelper.aCode + i) + '7',
            Color.BLACK,
            this
        ));
    }
    this.pieces.push(new King('e8', Color.BLACK, this));
    this.pieces.push(new King('e1', Color.WHITE, this));
    this.pieces.push(new Queen('d8', Color.BLACK, this));
    this.pieces.push(new Queen('d1', Color.WHITE, this));
    this.pieces.push(new Rook('a1', Color.WHITE, this));
    this.pieces.push(new Rook('h1', Color.WHITE, this));
    this.pieces.push(new Rook('a8', Color.BLACK, this));
    this.pieces.push(new Rook('h8', Color.BLACK, this));
    this.pieces.push(new Knight('b1', Color.WHITE, this));
    this.pieces.push(new Knight('g1', Color.WHITE, this));
    this.pieces.push(new Knight('b8', Color.BLACK, this));
    this.pieces.push(new Knight('g8', Color.BLACK, this));
    this.pieces.push(new Bishop('c1', Color.WHITE, this));
    this.pieces.push(new Bishop('f1', Color.WHITE, this));
    this.pieces.push(new Bishop('c8', Color.BLACK, this));
    this.pieces.push(new Bishop('f8', Color.BLACK, this));
};

Game.prototype.reset = function() {
    if (this.viewer) {
        this.viewer.dispatchEvent(new GameEventReset());
    }
    this.pieces.length = 0;
    this.removedWhite.length = 0;
    this.removedBlack.length = 0;
    this.moves.length = 0;
    this.states.length = 0;
    for (var i in this.cells) {
        this.cells[i].piece = null;
    }
}

Game.prototype.getPosition = function(pos) {
    return this.cells[pos];
};

Game.prototype.applyMove = function(move) {
    move.log();
    if (move.type == MoveType.FINISH) {
        if (this.viewer) {
            this.viewer.dispatchEvent(new GameEventFinish(GameResult.getResult(move.notation)));
        }
        return;
    }
    if (move.type == MoveType.SHORT_CASTLING || move.type == MoveType.LONG_CASTLING) {
        var rookCol, kingDest, rookDest, rowIndex;
        var kingCol = 'e';
        if (move.color == Color.WHITE) {
            rowIndex = '1';
        } else {
            rowIndex = '8';
        }
        if (move.type == MoveType.SHORT_CASTLING) {
            rookCol = 'h';
            kingDest = 'g';
            rookDest = 'f';
        } else {
            rookCol = 'a';
            kingDest = 'c';
            rookDest = 'd';
        }
        this.applyCastling(kingCol + rowIndex, rookCol + rowIndex, kingDest +  rowIndex, rookDest + rowIndex);
        this.dumpState(move);
        return;
    }
    if (move.isCapture) {
        this.removePiece(move.to.piece);
    }
    move.piece.moveTo(move.to);
    if (move.promotion) {
        this.processPromotion(move);
    }
    //create new state here
    this.dumpState(move);
};

Game.prototype.applyCastling = function(kingCell, rookCell, kingDest, rookDest) {
    this.getPosition(kingCell).piece.moveTo(this.getPosition(kingDest));
    this.getPosition(rookCell).piece.moveTo(this.getPosition(rookDest));
}

Game.prototype.removePiece = function(piece) {
    if (this.viewer) {
        this.viewer.dispatchEvent(new GameEventPieceCaptured(piece));
    }
    if (piece.color == Color.WHITE) {
        this.removedWhite.push(piece);
    } else {
        this.removedBlack.push(piece);
    }
    piece.position.piece = null;
    piece.position = null;
    var index = this.pieces.indexOf(piece);
    this.pieces.splice(index, 1);
}

Game.prototype.processPromotion = function (move) {
    if (move.piece.name != PieceKind.PAWN) {
        throw "Only pawn can promoted, check move: " + move.notation;
    }
    var newPiece;
    var index = this.pieces.indexOf(move.piece);
    this.pieces.splice(index, 1);
    this.cells[move.to.raw].piece = null;
    switch (move.promotion) {
        case PieceKind.QUEEN:
            newPiece = new Queen(move.to.raw, move.color, this);
            break;
        case PieceKind.ROOK:
            newPiece = new Rook(move.to.raw, move.color, this);
            break;
        case PieceKind.BISHOP:
            newPiece = new Bishop(move.to.raw, move.color, this);
            break;
        case PieceKind.KNIGHT:
            newPiece = new Knight(move.to.raw, move.color, this);
            break;
        default:
            throw "Error while performing promotion of: " + move.notation;
    }
    this.cells[move.to.raw].piece = newPiece;
    if (this.viewer) {
        this.viewer.dispatchEvent(new GameEventPromotion(newPiece));
    }
};

Game.prototype.isClearRange = function(start, end) {
    var cells = this.getRange(start, end);
    for (var i in cells) {
        if (cells[i].piece) {
            return false;
        }
    }
    return true;
}

Game.prototype.getRange = function(start, end) {
    var cells = new Array();
    if (start.col == end.col) {
        for (var i = Math.min(start.originRow, end.originRow) + 1; i < Math.max(start.originRow, end.originRow); i++) {
            cells.push(this.getPosition(start.originCol + i));
        }
        return cells;
    }
    if (start.row == end.row) {
        var chars = CharHelper.range(start.originCol, end.originCol);
        for (var i in chars) {
            cells.push(this.getPosition(chars[i] + start.originRow));
        }
        return cells;
    }
    if (Math.abs(start.row - end.row) == Math.abs(start.col - end.col)) {
        var chars = CharHelper.range(start.originCol, end.originCol);
        var startCol = Math.min(start.colCode, end.colCode);
        var deltaRow = start.row - end.row == start.col - end.col ? -1 : 1;
        var startRow = deltaRow < 0 ? Math.max(start.originRow, end.originRow) : Math.min(start.originRow, end.originRow);
        for (var i = 0; i < chars.length; i++) {
            var row = startRow + (i + 1) * deltaRow;
            cells.push(this.getPosition(chars[i] + row));
        }
        return cells;
    }
    throw "Cannot list cell between " + start.raw + " and " + end.raw;
};

Game.prototype.findPieces = function(position, piece, color) {
    var pieces = new Array();
    if (position.length == 0) {
        for (var i in this.pieces) {
            if (this.pieces[i].name == piece && this.pieces[i].color == color) {
                pieces.push(this.pieces[i]);
            }
        }
    } else if (position.length == 1) {
        if (position >= '1' && position <= '8') {
            for (var i = CharHelper.aCode; i <= CharHelper.hCode; i++) {
                var index = String.fromCharCode(i) + position;
                if (this.cells[index].piece &&
                    this.cells[index].piece.name == piece &&
                    this.cells[index].piece.color == color
                ) {
                    pieces.push(this.cells[index].piece);
                }
            }
        } else if (position >= 'a' && position <= 'g') {
            for (var i = 1; i < 9; i++) {
                var index = position + i;
                if (this.cells[index].piece &&
                    this.cells[index].piece.name == piece &&
                    this.cells[index].piece.color == color
                ) {
                    pieces.push(this.cells[index].piece);
                }
            }
        }
    } else if (position.length == 2) {
        if (this.cells[position].piece &&
            this.cells[position].piece.name == piece &&
            this.cells[position ].piece.color == color
        ) {
            pieces.push(this.cells[index].piece);
        }
    }
    return pieces;
}

Game.prototype.onPieceInit = function(piece) {
    if (this.viewer) {
        this.viewer.dispatchEvent(new GameEventPieceInit(piece));
    }
}

Game.prototype.onPieceMove = function(from, to) {
    if (this.viewer) {
        this.viewer.dispatchEvent(new GameEventPieceMove(from, to));
    }
}

Game.prototype.parseDoc = function(doc) {
    this.moves.length = 0;
    var _this = this;
    var regex = /\d+\.((?!\d+\.)[\s\S])*/;
    var docLen = 0;
    do {
        docLen = doc.length;
        doc = doc.replace(regex, function(matches) {
            _this.moves.push(new MoveNotation(matches));
            return '';
        });
    } while (docLen != doc.length);
}

Game.prototype.applyNextMove = function() {
    var moveNotation = this.moves.shift();
    if (moveNotation) {
        console.log(moveNotation.index);
        this.applyMove(new Move(moveNotation.whiteMove, this, Color.WHITE));
        this.applyMove(new Move(moveNotation.blackMove, this, Color.BLACK));
        return true;
    }
    return false;
}

Game.prototype.dumpState = function(move) {
    var dump = '';
    for (var i = 1; i < 9; i++) {
        for (var j = 0; j < 8; j++) {
            dump += this.cells[CharHelper.chars[j] + i].dump();
        }
        dump += '|';
    }
    dump += move.dump();
    this.states.push(dump);
}

Game.prototype.load = function(doc) {
    if (!doc) {
        return;
    }
    var parser = new PgnParser(doc);
    this.createNewGame();
    this.parseDoc(parser.moves);
    var next;
    do {
         next = this.applyNextMove();
    } while (next);
    if (this.viewer) {
        this.viewer.setStates(this.states);
    }
}

Game.prototype.setViewer = function(viewer) {
    this.viewer = viewer;
}