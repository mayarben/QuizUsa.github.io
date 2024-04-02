

    fetch('QuizQuestions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(questions => {
    console.log(questions);


    const answerButtons = document.getElementById("answer-buttons");
    const nextButton = document.getElementById("next-btn");
    const previousButton = document.getElementById("previous-btn");
    const timerElement = document.getElementById("timer");
    const questionElement = document.getElementById("question");
    const timeLeftTextElement = document.querySelector(".time_left_txt");
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let question;
    
    
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        nextButton.innerHTML = "Next";
        showQuestion();
        startTimer(15);
    }
    
    function showQuestion() {
        resetState();
        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
        questionElement.innerHTML = questionNo + ". " + currentQuestion.question;
        currentQuestion.options.forEach(option => {
            const button = document.createElement("button");
            button.innerHTML = option.text;
            button.classList.add("btn");
            answerButtons.appendChild(button);
            if (option.correct) {
                button.dataset.correct = option.correct;
            }
            button.addEventListener("click", selectAnswer);
        });
        if (currentQuestionIndex > 0) {
            previousButton.style.display = "block";
        } else {
            previousButton.style.display = "none";
        }
    }
    
    function resetState() {
        while (answerButtons.firstChild) {
            answerButtons.removeChild(answerButtons.firstChild);
        }
    }
    
    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === "true";
        const previouslySelectedBtn = answerButtons.querySelector('.selected');
        
        if (previouslySelectedBtn) {
            previouslySelectedBtn.classList.remove('selected');
        }
        
        if (isCorrect) {
            selectedBtn.classList.add("correct");
            score++;
        } else {
            selectedBtn.classList.add("incorrect");
        }
        
        selectedBtn.classList.add('selected');
        
        Array.from(answerButtons.children).forEach(button => {
            if (button.dataset.correct === "true") {
                button.classList.add("correct");
            }
            button.disabled = true;
        });
        
        nextButton.style.display = "block";
    }
    
    function showScore() {
        resetState();
        questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
        nextButton.innerHTML = "Play again";
        nextButton.style.display = "block";
        timerElement.style.display = "none";
        timeLeftTextElement.style.display = "none";
    }
    
    function handleNextButton() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            resetTimer();
            startTimer(15);
        } else {
            showScore();
        }
    }
    
    nextButton.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            startQuiz();
        }
    });
    
    function handlePreviousButton() {
        currentQuestionIndex--;
        if (currentQuestionIndex >= 0) {
            showQuestion();
        } else {
            currentQuestionIndex = 0;
        }
    }
    
    previousButton.addEventListener("click", handlePreviousButton);
    
    function startTimer(duration) {
      let timer = duration, minutes, seconds;
      timerInterval = setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);
          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;
          timerElement.textContent = minutes + ":" + seconds;
          if (--timer < 0) {
              clearInterval(timerInterval);
              handleNextButton(); 
          }
      }, 1000);
    }
    
    
    function resetTimer() {
        clearInterval(timerInterval);
        timerElement.textContent = "15";
    }
    
  
      startQuiz(); 
})
.catch(error => {
    console.error('There was a problem fetching the data:', error);
  });