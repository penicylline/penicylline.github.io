var Common = {
    TEST_CONFIG_KEY: 'test_config',
    TEST_STATE_KEY: 'test_state'
}

var QuestionType = {
    SUM_2: 'SUM_2',
    SUM_3: 'SUM_3',
    SUM_1: 'SUM_1',
    SUB_1: 'SUB_1',
    SUB_2: 'SUB_2'
};

var QuestionTypeListFull = [QuestionType.SUM_1, QuestionType.SUM_2, QuestionType.SUM_3, QuestionType.SUB_1, QuestionType.SUB_2];
var QuestionTypeList = [QuestionType.SUM_1, QuestionType.SUM_2];

var TestConfig = {
    max: 1000,
    min: 50,
    questionTypes: QuestionTypeListFull
}

var TestState = {
    currentQuestion: null,
    questionCount: 0,
    wrongAnswers: 0
}

var QuestionData = function(type) {
    this.type = type;
    this.data = [];
    this.correctAnswer = null;
    this.point = null;
    this.userAnswer = null;
    this.result = null;
}

// sum 1
var Sum1Question = function() {
    this.data = new QuestionData(QuestionType.SUM_1);
    this.data.data[0] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min);
    this.data.data[1] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min);
    this.data.correctAnswer = this.data.data[0] + this.data.data[1];
}

Sum1Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[0]).concat(" + ").concat(this.data.data[1]).concat(' = '));
    container2.text('');
}

// sum 2
var Sum2Question = function() {
    this.data = new QuestionData(QuestionType.SUM_2);
    this.data.data[0] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min);
    this.data.data[1] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min) + this.data.data[0];
    this.data.correctAnswer = this.data.data[1] - this.data.data[0];
}

Sum2Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[0]).concat(" + "));
    container2.text(" = ".concat(this.data.data[1]));
}
 // sum 3

var Sum3Question = function() {
    this.data = new QuestionData(QuestionType.SUM_3);
    this.data.data[0] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 3 + TestConfig.min);
    this.data.data[1] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 3 + TestConfig.min);
    this.data.data[2] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 3 + TestConfig.min);
    this.data.correctAnswer = this.data.data[0] + this.data.data[1] + this.data.data[2];
}

Sum3Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[0]).concat(" + ").concat(this.data.data[1]).concat(" + ").concat(this.data.data[2]).concat(" = "));
    container2.text('');
}

// sub 1
var Sub1Question = function() {
    this.data = new QuestionData(QuestionType.SUB_1);
    this.data.data[0] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min);
    this.data.data[1] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min) + this.data.data[0];
    this.data.correctAnswer = this.data.data[1] - this.data.data[0];
}

Sub1Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[1]).concat(' - ').concat(this.data.data[0]).concat(' = '));
    container2.text('');
}


var Sub2Question = function() {
    this.data = new QuestionData(QuestionType.SUB_2);
    this.data.data[0] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min);
    this.data.data[1] = Math.round(Math.random() * (TestConfig.max - TestConfig.min) / 2 + TestConfig.min) + this.data.data[0];
    this.data.correctAnswer = this.data.data[1] - this.data.data[0];
}

Sub2Question.prototype.render = function(container1, container2) {
    container1.text("".concat(this.data.data[1]).concat(' - '));
    container2.text(' = '.concat(this.data.data[0]));
}

function randomQuestion() {
    const typeList = TestConfig.questionTypes;
    const rand = Math.ceil(Math.random() * typeList.length);
    const qType = typeList[rand];
    switch(qType) {
        case QuestionType.SUM_1:
            return new Sum1Question();
        case QuestionType.SUM_2:
            return new Sum2Question();
        case QuestionType.SUM_3:
            return new Sum3Question();
        case QuestionType.SUB_1:
            return new Sub1Question();
        case QuestionType.SUB_2:
            return new Sub2Question();
    }
    return new Sum1Question();
}

function nextQuestion() {
    const newQuestion = randomQuestion();
    newQuestion.render($('#beforeQ'), $('#afterQ'));
    TestState.currentQuestion = newQuestion;
    TestState.questionCount++;
    saveState();
    $('#qCount').text(TestState.questionCount);
    $('#answer').val('');
    $('#answer').focus();
}

function loadConfig() {
    if (window.localStorage) {
        let config = window.localStorage.getItem(Common.TEST_CONFIG_KEY);
        if (config) {
            TestConfig = JSON.parse(config)
        }
        let state = window.localStorage.getItem(Common.TEST_STATE_KEY);
        if (state) {
            TestState = JSON.parse(state)
        }
    }
    $('#qCount').text(TestState.questionCount);
    $('#wrongCounts').text(TestState.wrongAnswers);
}

function saveState() {
    if (window.localStorage) {
        const str = JSON.stringify(TestState);
        console.log(str);
        window.localStorage.setItem(Common.TEST_STATE_KEY, str);
    }
}

function resetState() {
    TestState.wrongAnswers = 0;
    TestState.questionCount = 0;
    TestState.currentQuestion = null;
    saveState();
    $('#qCount').text(TestState.questionCount);
    $('#wrongCounts').text(TestState.wrongAnswers);
    nextQuestion();
}

$(document).ready(function (){
    loadConfig();
    if (!TestState.currentQuestion) {
        nextQuestion();
    }

    $('#btnCheck').click(function() {
        if (TestState.currentQuestion == null) {
            return;
        }
        var val = $('#answer').val();
        if (TestState.currentQuestion.data.correctAnswer == val) {
            alert('Correct!!!');
            nextQuestion();
        } else {
            TestState.wrongAnswers++;
            $('#wrongCounts').text(TestState.wrongAnswers)
            alert('Wrong!!!');
        }
    });

    $('#btnResetState').click(function() {
        resetState();
        $('#panelSettings').hide();
    });

    $('#btnOpenSettings').click(function() {
        $('#panelSettings').show();
    });
});
