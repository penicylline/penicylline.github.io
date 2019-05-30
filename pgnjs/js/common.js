/**
 * Created by hoaibui on 10/28/16.
 */
"use strict;"

var Color = {
    WHITE: 'white',
    BLACK: 'black'
}

var CharHelper = {
    chars: 'abcdefgh',
    aCode: 'a'.charCodeAt(0),
    bCode: 'b'.charCodeAt(0),
    cCode: 'c'.charCodeAt(0),
    dCode: 'd'.charCodeAt(0),
    eCode: 'e'.charCodeAt(0),
    fCode: 'f'.charCodeAt(0),
    gCode: 'g'.charCodeAt(0),
    hCode: 'h'.charCodeAt(0),
    range: function(start, end) {
        var range = new Array();
        var p1 = start.charCodeAt(0);
        var p2 = end.charCodeAt(0);
        for (var i = Math.min(p1, p2) + 1; i < Math.max(p1, p2); i++) {
            range.push(String.fromCharCode(i));
        }
        return range;
    }
};

var PieceKind = {
    KING: 'K',
    QUEEN: 'Q',
    ROOK: 'R',
    BISHOP: 'B',
    KNIGHT: 'N',
    PAWN: 'P'
};

var MoveType = {
    NORMAL: 'n',
    SHORT_CASTLING: 'O-O',
    LONG_CASTLING: 'O-O-O',
    FINISH: 'f'
}

var Position = function(position) {
    this.raw = position;
    this.colCode = position.charCodeAt(0);
    this.col = this.colCode - CharHelper.aCode + 1;
    this.row = 8 - position.charAt(1) + 1;
    this.originRow = position.charAt(1);
    this.originCol = position.charAt(0);
    this.piece = null;
    if (this.col < 1 || this.col > 8 || this.row < 1 || this.row > 8) {
        throw 'Incorrect position: ' + position + ' - col: ' + this.col + ' - row: ' + this.row;
    }
}

Position.prototype.dump = function() {
    if (this.piece) {
        return this.piece.dump();
    }
    return ' ';
}

var GameResult = {
    DRAW: 'd',
    BLACK: 'b',
    WHITE: 'w',
    getResult: function(notation) {
        switch(notation) {
            case '1/2-1/2':
                return this.DRAW;
            case '1-0':
                return this.WHITE;
            case '0-1':
                return this.BLACK;
        }
    }
}

var GameEventReset = function() {
}

var GameEventPieceInit = function(piece) {
    this.piece = piece;
}

var GameEventPieceMove = function(from, to) {
    this.from = from;
    this.to = to;
}

var GameEventPieceCaptured = function(piece) {
    this.piece = piece;
}

var GameEventFinish = function(result) {
    this.result = result;
}

var GameEventPromotion = function(piece) {
    this.piece = piece;
}

