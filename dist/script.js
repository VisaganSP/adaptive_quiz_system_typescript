"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const categorySelect = document.getElementById("category");
    const difficultySelect = document.getElementById("difficulty");
    const quizContainer = document.getElementById("quizContainer");
    const startQuizBtn = document.getElementById("startQuiz");
    const resultContainer = document.getElementById("resultContainer");
    let currentQuestions = [];
    startQuizBtn.addEventListener("click", () => {
        const category = categorySelect.value;
        const difficulty = difficultySelect.value;
        fetchQuestions(category, difficulty);
    });
    function fetchQuestions(param1, param2, param3) {
        let url;
        if (typeof param3 === "undefined") {
            url = `https://opentdb.com/api.php?amount=5&category=${param1}&difficulty=${param2}&type=multiple`;
        }
        else {
            url = `https://opentdb.com/api.php?amount=${param1}&category=${param2}&difficulty=${param3}&type=multiple`;
        }
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
            currentQuestions = data.results;
            displayQuestions(currentQuestions);
        })
            .catch((error) => {
            console.error("Error fetching questions:", error);
        });
    }
    function displayQuestions(questions) {
        quizContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionElement = document.createElement("div");
            questionElement.classList.add("question");
            questionElement.innerHTML = `
                <p>${index + 1}. ${question.question}</p>
                <ul>${question.incorrect_answers
                .map((answer) => {
                return `<li><input type="radio" name="question${index}" value="${answer}">${answer}</li>`;
            })
                .join("")}
                    <li><input type="radio" name="question${index}" value="${question.correct_answer}">${question.correct_answer}</li>
                </ul>
            `;
            quizContainer.appendChild(questionElement);
        });
        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Answers";
        submitButton.addEventListener("click", checkAnswers);
        quizContainer.appendChild(submitButton);
    }
    function checkAnswers() {
        const userAnswers = [];
        currentQuestions.forEach((_, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            if (selectedOption) {
                const answer = selectedOption
                    .value;
                userAnswers.push(answer);
            }
            else {
                userAnswers.push(null);
            }
        });
        const score = calculateScore(userAnswers);
        displayResult(score);
    }
    function calculateScore(userAnswers) {
        let correctAnswers = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === currentQuestions[index].correct_answer) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    }
    function displayResult(score) {
        const totalQuestions = currentQuestions.length;
        const resultText = `You scored ${score} out of ${totalQuestions} questions.`;
        resultContainer.textContent = resultText;
    }
    fetch("https://opentdb.com/api_category.php")
        .then((response) => response.json())
        .then((data) => {
        data.trivia_categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id.toString();
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    })
        .catch((error) => {
        console.error("Error fetching categories:", error);
    });
});
//# sourceMappingURL=script.js.map