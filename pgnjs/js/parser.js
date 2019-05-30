/**
 * Created by hoaibui on 11/4/16.
 */

var PgnParser = function(doc) {
    this.regex = /\[\s*(\S+)\s+([^\]]*)\]\s*/;
    this.tags = new Array();
    this.moves;
    this.init(doc);
}

PgnParser.prototype.init = function(doc) {
    var _this = this;
    var docLen;
    do {
        docLen = doc.length;
        doc = doc.replace(_this.regex, function(matches) {
            _this.tags.push(matches[1], matches[2]);
            return '';
        });
    } while (docLen != doc.length);
    this.moves = doc.replace(/^\s*/, '');
}