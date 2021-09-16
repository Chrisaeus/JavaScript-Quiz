var timeEl = document.querySelector("#timer");
var headerEl = document.querySelector(".header")
var mainEl = document.querySelector("#main");
var startBtn = document.querySelector("#startBtn");
var scoreLink = document.querySelector("#scoreLink");

var score;
var secondsLeft;
var quizDone = false;

var userScores;

var questionNum;

var quizQuestions = [ //LIST OF QUESTIONS

    {
        question: "Which of these is not a variable keyword in JavaScript?",
        answers: {
            a: "var",
            b: "void",
            c: "let",
            d: "const",
        },
        correctAnswer: "b" 
    },

    {
        question: "Which of these is not a primitive type in JavaScript?",
        answers: {
            a: "boolean",
            b: "integer",
            c: "string",
            d: "thread",
        },
        correctAnswer: "d" 
    },

    {
        question: "Which one of these methods sends a message to the developer console?",
        answers: {
            a: "console.append()",
            b: "console.send()",
            c: "console.log()",
            d: "console.cout()",
        },
        correctAnswer: "c" 
    },

    {
        question: "What kind of notation is used for an array?",
        answers: {
            a: "Curly braces {}",
            b: "Square brackets []",
            c: "Parentheses ()",
            d: "Angle brackets <>",
        },
        correctAnswer: "b" 
    },

    {
        question: "What tag links a .js file to a .html file?",
        answers: {
            a: "<script>",
            b: "<link>",
            c: "<js>",
            d: "<style>",
        },
        correctAnswer: "a" 
    }
];

function onInit() {
    if (localStorage.getItem("Saved Scores") != null) {
        userScores = JSON.parse(localStorage.getItem("Saved Scores"));
    } else {
        userScores = [];
    };
}

function setTimer() { //TIMER FUNCTIONALITY
    var timerInterval = setInterval(function() {
        secondsLeft--;
        timeEl.textContent = secondsLeft;
    
        if (secondsLeft === 0 && quizDone === false) {
          clearInterval(timerInterval);
          mainEl.innerHTML = "";
          showResults();
          timeEl.textContent = "";
        }

        if (quizDone === true) {
            clearInterval(timerInterval);
            timeEl.textContent = "";
        }
    
    }, 1000);
}

function showResults() { //RESULTS PAGE
    mainEl.innerHTML = "";
    score *= secondsLeft;

    var scoreDisplay = document.createElement("h1");
    scoreDisplay.textContent = "Your score is: " + score;
    document.body.children[1].appendChild(scoreDisplay);

    var tryAgain = document.createElement("button");
    tryAgain.textContent = "Try Again?";
    document.body.children[1].appendChild(tryAgain);
    tryAgain.addEventListener("click", startQuiz);

    var saveScoreBtn = document.createElement("button");
    saveScoreBtn.textContent = "Save My Score";
    document.body.children[1].appendChild(saveScoreBtn);
    saveScoreBtn.addEventListener("click", function() {
        saveScoreScreen();
    })

}

function saveScoreScreen() { //SCREEN WHERE YOU SAVE YOUR SCORE
    mainEl.textContent = "";

    var initialForm = document.createElement("form");

    var initialLabel = initialForm.appendChild(document.createElement("label"));
            initialLabel.setAttribute("for", "initials");
            initialLabel.innerHTML = "<h2>Enter your initials</h2>";

    var initialInput = initialForm.appendChild(document.createElement("input"));
            initialInput.setAttribute("type", "text");
            initialInput.setAttribute("name", "initials");
            initialInput.setAttribute("style", "text-transform: uppercase");
            initialInput.setAttribute("maxlength", "3");

    initialForm.appendChild(document.createElement("br"));
    initialForm.appendChild(document.createElement("br"));

    var scoreSubmit = initialForm.appendChild(document.createElement("button"));
            scoreSubmit.textContent = "Submit";

    var goBackBtn = initialForm.appendChild(document.createElement("button"));
        goBackBtn.textContent = "Go Back";
        goBackBtn.addEventListener("click", function() {
        location.reload();
    })
    
    document.body.children[1].appendChild(initialForm);

    initialForm.addEventListener("submit", function(event) {
        event.preventDefault();

        var savedScore = {
            initials: initialInput.value.toUpperCase(),
            theirScore: score
        };

        initialInput.value = "";

        userScores.push(savedScore);
        localStorage.setItem("Saved Scores", JSON.stringify(userScores));

    });

}

function showQuestions() { //MAIN QUIZ
    document.body.children[1].setAttribute("style", "display: flexbox");
    if (questionNum < quizQuestions.length) {

        var questionEl = document.createElement("h1");
        questionEl.textContent = quizQuestions[questionNum].question;
        questionEl.setAttribute("style", "position: relative");
        document.body.children[1].appendChild(questionEl);
        
        var answerLetters = Object.keys(quizQuestions[questionNum].answers);
        var answerText = Object.values(quizQuestions[questionNum].answers);

        for (var i = 0; i < answerLetters.length; i++) {

            var answerEl = document.createElement("li");
            document.body.children[1].appendChild(answerEl);
            var answerBtn = document.createElement("button");
            answerBtn.setAttribute("id", answerLetters[i]);
            answerBtn.textContent = answerLetters[i] + ". " + answerText[i];
            answerEl.appendChild(answerBtn);
            
            answerBtn.addEventListener("click", function(event) {
                if (event.currentTarget.id == quizQuestions[questionNum].correctAnswer) {
                    score++;
                } else {
                    secondsLeft -= 5;
                    timeEl.textContent = secondsLeft;
                };

                mainEl.innerHTML = "";
                questionNum++;
                showQuestions();
            });

        };
    } else {
        quizDone = true;
        showResults();
    };
}


function startQuiz() { // INITIALIZES THE QUIZ
    quizDone = false;

    score = 0;
    secondsLeft = 30;
    
    timeEl.textContent = secondsLeft;
    mainEl.innerHTML = "";

    setTimer();

    questionNum = 0;
    
    showQuestions();
    
}

function showScores() { // SAVED SCORES PAGE
    mainEl.innerHTML = "";
    headerEl.innerHTML = "";

    // CREATE A TABLE AND APPEND IT TO THE BODY!
    var scoreBoard = document.createElement("table");
        var headerRow = scoreBoard.appendChild(document.createElement("tr"));
        var initHead = headerRow.appendChild(document.createElement("th"));
                initHead.textContent = "Initials";
        var scoreHead = headerRow.appendChild(document.createElement("th"));
                scoreHead.textContent = "Score";

        for (i = 0; i < userScores.length; i++) {
            var newRow = scoreBoard.appendChild(document.createElement("tr"));
            var initCell = newRow.appendChild(document.createElement("td"));
            var scoreCell = newRow.appendChild(document.createElement("td"));

            initCell.textContent = userScores[i].initials;
            scoreCell.textContent = userScores[i].theirScore;
        }
            
    document.body.children[1].appendChild(scoreBoard);

    var goBackBtn = document.body.children[0].appendChild(document.createElement("button"));
        goBackBtn.textContent = "Go Back";
        goBackBtn.addEventListener("click", function() {
            location.reload();
        })

    
}

onInit();

startBtn.addEventListener("click", function() { //START BUTTON FUNCTIONALITY
    startQuiz();
});

scoreLink.addEventListener("click", function() { //SCORE PAGE LINK FUNCTIONALITY
    showScores();
})

