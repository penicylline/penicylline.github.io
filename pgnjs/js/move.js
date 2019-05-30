/**
 * Created by hoaibui on 10/28/16.
 */

var Move = function(notation, game, color) {
    this.game = game;
    this.notation = notation;
    this.color = color;
    this.promotion = false;
    this.init(notation);
}

Move.prototype.init = function(notation) {
    if (GameResult.getResult(notation)) {
        this.type = MoveType.FINISH;
        return;
    }
    this.isCheck = false;
    this.isCapture = false;
    if (notation == MoveType.LONG_CASTLING || notation == MoveType.SHORT_CASTLING) {
        this.type = notation;
        this.checkCastling();
        return;
    }
    this.type = MoveType.NORMAL;
    var matches = notation.match(/([KQRBNP]*)([a-h1-8]*)(x?)([a-h][1-8])(=[KQRBNP])?(\W*)$/);
    if (!matches) {
        throw "Invalid move noration: [" + notation + "]";
        return;
    }
    var piece = matches[1] != '' ? matches[1] : 'P';
    var from = matches[2] != '' ? matches[2] : '';
    this.isCapture = matches[3] ? true : false;
    this.to = this.game.getPosition(matches[4]);
    if (matches[5]) {
        this.promotion = matches[5].substr(1);
    }
    if (matches[6].indexOf('#') == 0 || matches[6].indexOf('+') == 0) {
        this.isCheck = true;
    }
    this.correctCaptureStatus();
    this.correctMove(from, piece);
}

Move.prototype.checkCastling = function() {
    var kingCol = 'e';
    var rookCol = this.type == MoveType.SHORT_CASTLING ? 'h' : 'a';
    var row = this.color == Color.WHITE ? 1 : 8;
    if (!this.game.getPosition(kingCol + row).piece ||
        !this.game.getPosition(rookCol + row).piece ||
        !this.game.getPosition(kingCol + row).piece.history.length > 1 ||
        !this.game.getPosition(rookCol + row).piece.history.length > 1) {
        throw "Cannot perform castling: " + this.notation;
    }
    return true;
}

Move.prototype.correctCaptureStatus = function() {
    //correct capture status
    if (!this.to.piece) {
        this.isCapture = false;
        return;
    }
    if (this.to.piece && this.to.piece.color != this.color) {
        this.isCapture = true;
    }
    if (this.to.piece && this.to.piece.color == this.color) {
        throw "Cannot capture self piece: " + this.notation;
    }
}

Move.prototype.correctMove = function(from, piece) {
    //correct move piece
    var pieces = this.game.findPieces(from, piece, this.color);
    if (pieces.length == 0) {
        throw "No piece suit with: " + this.notation;
    }
    var suits = new Array();
    for (var i in pieces) {
        if (pieces[i].canMove(this.to.raw, this.isCapture)) {
            suits.push(pieces[i]);
        }
    }
    if (suits.length < 1) {
        throw "No piece suit with move: " + this.notation;
    }
    if (suits.length > 1) {
        throw "More than one pieces suit with move: " + this.notation;
    }
    this.piece = suits[0];
    this.from = suits[0].position;
    if (this.isCapture && this.piece.color == this.to.piece.color) {
        throw "Cannot capture piece with same color with move: " + this.notation;
    }
}
Move.prototype.dump = function() {
    if (this.type == MoveType.NORMAL) {
        return this.from.raw + ' ' + this.to.raw;
    }
    if (this.type == MoveType.LONG_CASTLING) {
        if (this.color == Color.WHITE) {
            return 'e1,a1 c1,d1';
        } else {
            return 'e8,a8 c8,d8';
        }
    }
    if (this.type == MoveType.SHORT_CASTLING) {
        if (this.color == Color.WHITE) {
            return 'e1,h1 g1,f1';
        } else {
            return 'e8,h8 g8,f8';
        }
    }
}

Move.prototype.log = function() {
    if (this.type == MoveType.FINISH) {
        console.log(this.color + ' END GAME: ' + this.notation);
        return;
    }
    if (this.type == MoveType.LONG_CASTLING) {
        console.log(this.color + ': Long Castling');
        return;
    }
    if (this.type == MoveType.SHORT_CASTLING) {
        console.log(this.color + ': Short Castling');
        return;
    }
    if (this.isCapture) {
        console.log(this.color + ': '+ this.piece.name + ' from:' + this.from.raw + ' capture:' + this.to.piece.name + ' at ' + this.to.raw)
    } else {
        console.log(this.color + ': ' + this.piece.name + ' from:' + this.from.raw + ' to:' + this.to.raw);
    }
}

var MoveNotation = function(notation) {
    var regex = /^\s*(\d+\.)\s*(\S+)\s+(\S+)\s*(.*)\s*$/;
    var matches = notation.match(regex);
    if (!matches) {
        throw 'Invalid move notation: ' + notation;
    }
    this.whiteMove = matches[2].replace(/^(\s+)/, '').replace(/(\s+)$/, '');
    this.blackMove = matches[3].replace(/^(\s+)/, '').replace(/(\s+)$/, '');
    this.comment = matches[4];
    this.index = parseInt(matches[1]);
}