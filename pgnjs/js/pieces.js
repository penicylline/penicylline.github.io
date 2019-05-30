/**
 * Created by hoaibui on 10/28/16.
 */
var Piece = function(position, color, game) {
    this.position = game.getPosition(position);
    if (this.position.piece) {
        throw "Already exists piece at " + position + " - " + this.position.piece.name + ":" + this.position.piece.color;
    }
    this.position.piece = this;
    this.color = color;
    this.game = game;
    this.history = new Array();
    this.history.push(position.raw);
    this.game.onPieceInit(this);
}

Piece.prototype.getPosition = function(position) {
    return this.game.getPosition(position);
}

Piece.prototype.moveTo = function(position) {
    this.game.onPieceMove(this.position, position);
    this.position.piece = null;
    this.position = position;
    position.piece = this;
    this.history.push(position.raw);
}

Piece.prototype.dump = function() {
    return this.color == Color.WHITE ? this.name : this.name.toLowerCase();
}

var King = function(position, color, game) {
    this.name = PieceKind.KING;
    Piece.call(this, position, color, game);
}
King.prototype = Object.create(Piece.prototype);

King.prototype.canMove = function(position, isCapture) {
    var dest = this.getPosition(position);
    if (Math.abs(dest.col - this.position.col) <= 1 && Math.abs(dest.row - this.position.row) <= 1) {
        return true;
    }
    return false;
}

var Queen = function(position, color, game) {
    this.name = PieceKind.QUEEN;
    Piece.call(this, position, color, game);
}
Queen.prototype = Object.create(Piece.prototype);

Queen.prototype.canMove = function(position, isCapture) {
    var dest = this.getPosition(position);
    if ((this.position.row == dest.row || this.position.col == dest.col ||
        Math.abs(this.position.row - dest.row) == Math.abs(this.position.col - dest.col)) &&
        this.game.isClearRange(this.position, dest)) {
        return true;
    }
    return false;
}

var Rook = function(position, color, game) {
    this.name = PieceKind.ROOK;
    Piece.call(this, position, color, game);
}
Rook.prototype = Object.create(Piece.prototype);

Rook.prototype.canMove = function(position, isCapture) {
    var dest = this.getPosition(position);
    if ((this.position.row == dest.row || this.position.col == dest.col) &&
        this.game.isClearRange(this.position, dest)) {
        return true;
    }
    return false;
}

var Bishop = function(position, color, game) {
    this.name = PieceKind.BISHOP;
    Piece.call(this, position, color, game);
}
Bishop.prototype = Object.create(Piece.prototype);

Bishop.prototype.canMove = function(position, isCapture) {
    var dest = this.getPosition(position);
    if (Math.abs(this.position.row - dest.row) == Math.abs(this.position.col - dest.col) &&
        this.game.isClearRange(this.position, dest)) {
        return true;
    }
    return false;
}

var Knight = function(position, color, game) {
    this.name = PieceKind.KNIGHT;
    Piece.call(this, position, color, game);
}
Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.canMove = function(position, isCapture) {
    var dest = this.getPosition(position);
    var dRow = Math.abs(dest.row - this.position.row);
    var dCol = Math.abs(dest.col - this.position.col);
    if ((dRow == 2 && dCol == 1) || (dRow == 1 && dCol == 2)) {
        return true;
    }
    return false;
}

var Pawn = function(position, color, game) {
    this.name = PieceKind.PAWN;
    Piece.call(this, position, color, game);
}
Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.canMove = function(position, isCapture) {
    var dest = this.getPosition(position);
    if ((this.color == Color.WHITE && dest.originRow <= this.position.originRow) ||
        (this.color == Color.BLACK && dest.originRow >= this.position.originRow)) {
        return false;
    }
    var dRow = Math.abs(dest.row - this.position.row);
    var dCol = Math.abs(dest.col - this.position.col);
    if (isCapture) {
        if (dCol == 1 && dRow == 1) {
            return true;
        }
    } else {
        if (dCol != 0) {
            return false;
        }
        if (dRow == 1) {
            return true;
        }
        if (((this.color == Color.WHITE && this.position.originRow == 2) ||
            (this.color == Color.BLACK && this.position.originRow == 7))) {
            if (dRow == 2 && !this.game.getPosition(this.position.originCol + (this.color == Color.WHITE ? 3 : 6)).piece) {
                return true;
            }
        }
    }
    return false;
}