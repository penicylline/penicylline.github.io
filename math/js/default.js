var MathConfig = {
    max: 20,
    currentQuestion: null,
    questionCount: 0,
    wrongAnswers: 0
}

var QuestionType = {
    SUM_2: 'SUM_2',
    SUB_2: 'SUB_2'
}

var QuestionData = function(type) {
    this.type = type;
    this.data = [];
    this.correctAnswer = null;
    this.point = null;
    this.userAnswer = null;
    this.result = null;
}

var Sum2Question = function() {
    this.data = new QuestionData(QuestionType.SUM_2);
    this.data.data[0] = Math.round(Math.random() * MathConfig.max);
    this.data.data[1] = Math.round(Math.random() * MathConfig.max);
    this.data.correctAnswer = this.data.data[0] + this.data.data[1];
}

Sum2Question.prototype.render = function(container) {
    var content = "".concat(this.data.data[0]).concat(" + ").concat(this.data.data[1]);
    container.text(content);
}

function nextQuestion() {
    var sum = new Sum2Question();
    sum.render($('#question'));
    MathConfig.currentQuestion = sum;
    MathConfig.questionCount++;
    $('#qCount').text(MathConfig.questionCount);
    $('#answer').val('');
}

$(document).ready(function (){
    nextQuestion();

    $('#btnCheck').click(function() {
        if (MathConfig.currentQuestion == null) {
            return;
        }
        var val = $('#answer').val();
        if (MathConfig.currentQuestion.data.correctAnswer == val) {
            alert('Correct!!!');
            nextQuestion();
        } else {
            MathConfig.wrongAnswers++;
            $('#wrongCounts').text(MathConfig.wrongAnswers)
            alert('Wrong!!!');
        }
    });
});
