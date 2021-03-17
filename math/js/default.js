var TestConfig = {
    max: 50,
    currentQuestion: null,
    questionCount: 0,
    wrongAnswers: 0
}

var QuestionType = {
    SUM_2: 'SUM_2',
    SUM_1: 'SUM_1',
    SUB_1: 'SUB_1',
    SUB_2: 'SUB_2'
};

var QuestionTypeListFull = [QuestionType.SUM_1, QuestionType.SUM_2, QuestionType.SUB_1, QuestionType.SUB_2];
var QuestionTypeList = [QuestionType.SUM_1, QuestionType.SUM_2];

var QuestionData = function(type) {
    this.type = type;
    this.data = [];
    this.correctAnswer = null;
    this.point = null;
    this.userAnswer = null;
    this.result = null;
}

var Sum1Question = function() {
    this.data = new QuestionData(QuestionType.SUM_1);
    this.data.data[0] = Math.round(Math.random() * TestConfig.max / 2);
    this.data.data[1] = Math.round(Math.random() * TestConfig.max / 2);
    this.data.correctAnswer = this.data.data[0] + this.data.data[1];
}

Sum1Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[0]).concat(" + ").concat(this.data.data[1]).concat(' = '));
    container2.text('');
}

var Sum2Question = function() {
    this.data = new QuestionData(QuestionType.SUM_2);
    this.data.data[0] = Math.round(Math.random() * TestConfig.max / 2);
    this.data.data[1] = Math.round(Math.random() * TestConfig.max / 2) + this.data.data[0];
    this.data.correctAnswer = this.data.data[1] - this.data.data[0];
}

Sum2Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[0]).concat(" + "));
    container2.text(" = ".concat(this.data.data[1]));
}

var Sub1Question = function() {
    this.data = new QuestionData(QuestionType.SUB_1);
    this.data.data[0] = Math.round(Math.random() * TestConfig.max / 2);
    this.data.data[1] = Math.round(Math.random() * TestConfig.max / 2) + this.data.data[0];
    this.data.correctAnswer = this.data.data[1] - this.data.data[0];
}

Sub1Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[1]).concat(' - ').concat(this.data.data[0]).concat(' = '));
    container2.text('');
}


var Sub2Question = function() {
    this.data = new QuestionData(QuestionType.SUB_1);
    this.data.data[0] = Math.round(Math.random() * TestConfig.max / 2);
    this.data.data[1] = Math.round(Math.random() * TestConfig.max / 2) + this.data.data[0];
    this.data.correctAnswer = this.data.data[1] - this.data.data[0];
}

Sub2Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[1]).concat(' - '));
    container2.text(' = '.concat(this.data.data[0]));
}

function randomQuestion() {
    var typeList = QuestionTypeList;
    if ($('#chkSub').is(':checked')) {
        typeList = QuestionTypeListFull;
    }
    var rand = Math.ceil(Math.random() * typeList.length);
    var qType = typeList[rand];
    switch(qType) {
        case QuestionType.SUM_1:
            return new Sum1Question();
        case QuestionType.SUM_2:
            return new Sum2Question();
        case QuestionType.SUB_1:
            return new Sub1Question();
        case QuestionType.SUB_2:
            return new Sub2Question();
    }
    return new Sum1Question();
}

function nextQuestion() {
    var sum = randomQuestion();
    sum.render($('#beforeQ'), $('#afterQ'));
    TestConfig.currentQuestion = sum;
    TestConfig.questionCount++;
    $('#qCount').text(TestConfig.questionCount);
    $('#answer').val('');
    $('#answer').focus();
}

$(document).ready(function (){
    nextQuestion();

    $('#btnCheck').click(function() {
        if (TestConfig.currentQuestion == null) {
            return;
        }
        var val = $('#answer').val();
        if (TestConfig.currentQuestion.data.correctAnswer == val) {
            alert('Correct!!!');
            nextQuestion();
        } else {
            TestConfig.wrongAnswers++;
            $('#wrongCounts').text(TestConfig.wrongAnswers)
            alert('Wrong!!!');
        }
    });
});
