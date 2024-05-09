document.addEventListener("DOMContentLoaded", () => {
  const categorySelect = document.getElementById(
    "category"
  ) as HTMLSelectElement;
  const difficultySelect = document.getElementById(
    "difficulty"
  ) as HTMLSelectElement;
  const quizContainer = document.getElementById(
    "quizContainer"
  ) as HTMLDivElement;
  const startQuizBtn = document.getElementById(
    "startQuiz"
  ) as HTMLButtonElement;
  const resultContainer = document.getElementById(
    "resultContainer"
  ) as HTMLDivElement;
  let currentQuestions: any[] = []; // To store the current set of questions

  startQuizBtn.addEventListener("click", () => {
    const category = categorySelect.value;
    const difficulty = difficultySelect.value;
    fetchQuestions(category, difficulty);
  });

  function fetchQuestions(param1: string, param2: string, param3?: string) {
    let url: string;
    if (typeof param3 === "undefined") {
      url = `https://opentdb.com/api.php?amount=5&category=${param1}&difficulty=${param2}&type=multiple`;
    } else {
      url = `https://opentdb.com/api.php?amount=${param1}&category=${param2}&difficulty=${param3}&type=multiple`;
    }

    fetch(url)
      .then((response: Response) => response.json())
      .then((data: any) => {
        currentQuestions = data.results; // Store the fetched questions
        displayQuestions(currentQuestions);
      })
      .catch((error: any) => {
        console.error("Error fetching questions:", error);
      });
  }

  function displayQuestions(questions: any[]) {
    quizContainer.innerHTML = "";

    questions.forEach((question, index) => {
      const questionElement = document.createElement("div");
      questionElement.classList.add("question");
      questionElement.innerHTML = `
                <p>${index + 1}. ${question.question}</p>
                <ul>${question.incorrect_answers
                  .map((answer: string) => {
                    // Explicitly define the type of 'answer' as string
                    return `<li><input type="radio" name="question${index}" value="${answer}">${answer}</li>`;
                  })
                  .join("")}
                    <li><input type="radio" name="question${index}" value="${
        question.correct_answer
      }">${question.correct_answer}</li>
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
    const userAnswers: (string | null)[] = [];

    currentQuestions.forEach((_, index) => {
      const selectedOption = document.querySelector(
        `input[name="question${index}"]:checked`
      );

      if (selectedOption) {
        const answer: string | null = (selectedOption as HTMLInputElement)
          .value;
        userAnswers.push(answer);
      } else {
        userAnswers.push(null); // Mark unanswered questions
      }
    });

    const score = calculateScore(userAnswers);
    displayResult(score);
  }

  function calculateScore(userAnswers: (string | null)[]) {
    let correctAnswers = 0;

    userAnswers.forEach((answer, index) => {
      if (answer === currentQuestions[index].correct_answer) {
        correctAnswers++;
      }
    });

    return correctAnswers;
  }

  function displayResult(score: number) {
    const totalQuestions = currentQuestions.length;
    const resultText = `You scored ${score} out of ${totalQuestions} questions.`;
    resultContainer.textContent = resultText;
  }

  // Populate category select options
  fetch("https://opentdb.com/api_category.php")
    .then((response: Response) => response.json())
    .then((data: any) => {
      data.trivia_categories.forEach((category: any) => {
        const option = document.createElement("option");
        option.value = category.id.toString();
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    })
    .catch((error: any) => {
      console.error("Error fetching categories:", error);
    });
});
