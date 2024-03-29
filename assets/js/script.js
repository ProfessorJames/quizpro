/* jshint esversion: 11*/
/**Content
 * 1. DOM elements are declared in this section
 * 2. Variables are declared in this section
 * 3. Functions are defined in this section
 * 4. Event Handler functions are defined in this section
 * 5. Game Functionality is implemented in this section
 * 6. Event Listeners are added in this section
 */

document.addEventListener("DOMContentLoaded", async () => {
// 1. DOM elements are declared in this section

const bodyRef = document.querySelector('body');
const rulesBtn = document.querySelector('#rulesBtn');
const dialogRef = document.querySelector('#rules-dialog');
const closeDialogRef = document.querySelector('#close-rules-dialog');
const difficultyRef = document.querySelector('#difficulty');
const playBtn = document.querySelector('#playBtn');
const settings = document.querySelector('#settings');
const quizGameArea = document.querySelector('#quiz-game-area');
const answersList = document.querySelector('#answers-list');
const submitBtn = document.querySelector('#submit');
const nextBtn = document.querySelector('#next');
const questionsRef = document.querySelector('#question');
const answersRef = document.querySelectorAll('.answer');
const correct_answers = document.querySelector('#correct_answers');
const incorrect_answers = document.querySelector('#incorrect_answers');
const tagline = document.querySelector('.tagline');
const difficultyDropdownRef = document.querySelector('#difficulty');
const categoryDropdownRef = document.querySelector('#topic');
const numberOfQuestionsDropdownRef = document.querySelector(
  '#number-of-questions');

const questionNumber = document.querySelector('#question-number');

// 2. Variables are declared in this section

/**
 * Configuration object that stores various settings and data for the quiz application.
 * It includes difficulty levels, number of question options, selected settings, categories, question data,
 * current question index, and player scores.
 */
const config = {
  difficultyLevels: ['easy', 'medium', 'hard'],
  numberOfQuestionOptions: ['5', '10', '15', '20', '25'],
  difficultyLevelSelected: '',
  categorySelected: '',
  numberOfQuestionsSelected: '',
  categories: [],
  questionArray: [],
  currentQuestion: 0,
  scores: {
    correct: 0,
    incorrect: 0,
  },
};

// 3. Functions are defined in this section

/**
 * Retrieves trivia category data from a specified URL and adds it to a provided array.
 * @param {string} url - The URL to fetch the category data from.
 * @param {Array} categoryArray - The array to which the category data will be added.
 * @returns {Promise<object>} - A Promise that resolves to the retrieved category data.
 */
async function getCategoryData(url, categoryArray) {
  try {
    const response = await fetch(url);
    if(!response.ok){
      throw new Error(`Error fetching data from ${url}, status: ${response.status}`);
    }
    const data = await response.json();
    const catData = await data.trivia_categories;
    categoryArray.push(catData);
    return catData;
  } catch (error) {
    alert('Something went wrong fetching the category data from the API. Please reload the page and try again. If the error persists please try again later as the API may be temporarily down. Apologies for any inconvenience.');
    console.error('An error occurred retireving the category data from the API:', error);
  }
}

/**
 * Converts a list of questions to a different format with answers shuffled randomly.
 * @param {Array} listOfQuestions - The array of questions to be converted.
 * @returns {Array} - A new array of converted questions with answers shuffled randomly.
 */
const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

/**
 * Convert a list of questions into a different format with answers randomly shuffled.
 *
 * @param {Array} listOfQuestions - An array of questions to be converted.
 * @returns {Array} - A new array of questions with shuffled answers.
 */
const convertQuestions = (listOfQuestions) => {
  return listOfQuestions.map((q) => {
    return {
      question: q.question,
      correctAnswer: q.correct_answer,
      answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
      category: q.category,
      difficulty: q.difficulty,
    };
  });
};

/**
 * Generates and populates a dropdown (select) element with difficulty level options.
 *
 * @param {HTMLElement} selectRef - The reference to the dropdown (select) element.
 * @param {Array} content - An array of difficulty level options to populate the dropdown.
 */
const generateDiffDropdownItems = (selectRef, content) => {
  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.innerHTML = '-- Select Difficulty Level';
  selectRef.appendChild(firstOption);

  content.forEach((item) => {
    const optionRef = document.createElement('option');
    optionRef.value = item;
    optionRef.innerHTML = toTitleCase(item);
    selectRef.appendChild(optionRef);
  });
};

/**
 * Generates and populates a dropdown (select) element with options for the number of questions.
 *
 * @param {HTMLElement} selectRef - The reference to the dropdown (select) element.
 * @param {Array} content - An array of options for the number of questions to populate the dropdown.
 */
const generateNumberofQuestionsDropdownItems = (selectRef, content) => {
  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.innerHTML = '-- Select Number of Questions';
  selectRef.appendChild(firstOption);

  content.forEach((item) => {
    const optionRef = document.createElement('option');
    optionRef.value = item;
    optionRef.innerHTML = toTitleCase(item);
    selectRef.appendChild(optionRef);
  });
};

/**
 * Fetches and stores category data from the Open Trivia Database API.
 *
 * @param {string} 'https://opentdb.com/api_category.php' - The URL of the API endpoint for categories.
 * @param {Array} config.categories - An array of configuration data for categories.
 * @returns {Array} - An array containing the retrieved category data.
 */
const categoryDataArray = await getCategoryData(
  'https://opentdb.com/api_category.php',
  config.categories,
);

/**
 * Generates and populates a dropdown (select) element with category options using data from categoryDataArray.
 *
 * @param {HTMLElement} selectRef - The reference to the dropdown (select) element.
 */
const generateCatDropdownItems = (selectRef) => {
  const firstOption = document.createElement('option');
  firstOption.value = '';
  firstOption.innerHTML = '-- Select Category';
  selectRef.appendChild(firstOption);

  categoryDataArray.forEach((item) => {
    const optionRef = document.createElement('option');
    optionRef.innerHTML = item.name;
    optionRef.value = item.id;
    optionRef.id = item.id;
    selectRef.appendChild(optionRef);
  });
};

/**
 * Checks if all required dropdowns have a selected value, and toggles the visibility of a play button accordingly.
 */
const checkIfSelected = () => {
  if (
    difficultyDropdownRef.value !== '' &&
    categoryDropdownRef.value !== '' &&
    numberOfQuestionsDropdownRef.value !== ''
  ) {
    playBtn.classList.remove('hide');
  } else {
    playBtn.classList.add('hide');
  }
};

/**
 * Converts a string to title case (capitalizes the first letter of each word).
 *
 * @param {string} str - The input string to be converted.
 * @returns {string} - The input string converted to title case.
 */
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Generates a URL for fetching trivia question data based on difficulty, number of questions, and category.
 *
 * @param {string} diff - The difficulty level of the questions.
 * @param {number} numOfQuestions - The number of questions to fetch.
 * @param {number} cat - The category of the questions.
 * @returns {string} - The generated URL for fetching question data.
 */
const generateQuestionDataUrl = (diff, numOfQuestions, cat) => {
  let API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${cat}&difficulty=${diff}&type=multiple`;
  return API;
};

/**
 * Displays a list of answers in an unordered list with radio buttons.
 *
 * @param {HTMLElement} unorderedListRef - The reference to the unordered list element.
 * @param {Array} currentAnswers - An array of answer choices to be displayed.
 */
const displayAnswers = (unorderedListRef, currentAnswers) => {
  unorderedListRef.innerHTML = '';

  currentAnswers.forEach((item, index) => {
    const listRef = document.createElement('li');

    const radioRef = document.createElement('input');
    radioRef.type = 'radio';
    radioRef.name = 'answer';
    radioRef.id = 'answer' + (index + 1);
    radioRef.value = item;
    radioRef.classList.add('answer');

    const labelRef = document.createElement('label');
    labelRef.setAttribute('for', 'answer' + (index + 1));
    labelRef.innerHTML = item;

    listRef.appendChild(radioRef);
    listRef.appendChild(labelRef);
    unorderedListRef.appendChild(listRef);
  });
};

/**
 * Fetches quiz data from a specified URL, converts it into desired format using the convertQuestions function, and adds it to an array.
 *
 * @param {string} URL - The URL to fetch the quiz data from.
 * @param {Array} arr - The array to which the quiz data will be added.
 * @returns {Promise<Array>} - A Promise that resolves to an array of quiz questions in the desired format.
 */
async function getQuizData(URL, arr) {
  try{
    const response = await fetch(URL);

    if(!response.ok){
      throw new Error(`Error fetching data from ${URL}, status: ${response.status}`);
    }

    const data = await response.json();
    const questions = convertQuestions(data.results);
    arr.push(questions);
    return questions;

  } catch (error) {
    alert('Something went wrong fetching the quiz data from the API. Please reload the page and try again. If the error persists please try again later as the API may be temporarily down. Apologies for any inconvenience.');
    console.error('An error occurred:', error);
  }
}

/**
 * Loads and displays a quiz question along with answer choices on the web page.
 * Updates the question number and clears any previously selected answers.
 */
function loadQuiz() {
  try {
    
    deselectCheckedAnswer();

    questionNumber.innerText = `${config.currentQuestion + 1} of ${config.numberOfQuestionsSelected}`;

    const currentQuizData = config.questionArray[0][config.currentQuestion];

    questionsRef.innerHTML = currentQuizData.question;

   displayAnswers(answersList, currentQuizData.answers);
  } catch (error) {
      alert('It seems the quiz you selected is currently unavailable. Please try again using a different combination of difficulty level, category and number of questions. If the error persists please try again later as the API may be temporarily down. Apologies for any inconvenience.');
      console.error('An error occurred retrieving the category data from the API:', error);
      window.location.reload();
  }
}

/**
 * Toggles a specified CSS class on an HTML element.
 *
 * @param {HTMLElement} el - The HTML element on which the class will be toggled.
 * @param {string} className - The name of the CSS class to toggle.
 */
const toggleClass = (el, className) => {
  el.classList.toggle(className);
};

/**
 * Disables an HTML element by setting the 'disabled' attribute to 'true'.
 *
 * @param {HTMLElement} el - The HTML element to be disabled.
 */
const disable = (el) => {
  el.setAttribute('disabled', 'true');
};

/**
 * Enables an HTML element by removing the 'disabled' attribute.
 *
 * @param {HTMLElement} el - The HTML element to be enabled.
 */
const enable = (el) => {
  el.removeAttribute('disabled');
};

/**
 * Retrieves the selected answer from a group of radio button elements.
 *
 * @returns {string|null} - The selected answer's value or null if no answer is selected.
 */
function getSubmittedAnswer() {
  let selectedAnswer;

  document.querySelectorAll('.answer').forEach((answerEl) => {
    if (answerEl.checked) {
      const inputValue = answerEl.value;
      selectedAnswer = inputValue;
    }
  });

  return selectedAnswer;
}

/**
 * Updates the UI to indicate a correct answer by toggling button visibility and modifying the background color.
 *
 * @param {HTMLElement} submitBtnEl - The submit button element.
 * @param {HTMLElement} nextBtnEl - The next button element.
 * @param {HTMLElement} bodyEl - The body element to modify background color.
 */
const answerCorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
  toggleClass(submitBtnEl, 'hide');
  toggleClass(nextBtnEl, 'hide');
  bodyEl.classList.remove('normal');
  bodyEl.classList.add('bg-correct');
};

/**
 * Updates the UI to indicate that the submitted answer is incorrect by toggling button visibility and modifying the background color.
 *
 * @param {HTMLElement} submitBtnEl - The submit button element.
 * @param {HTMLElement} nextBtnEl - The next button element.
 * @param {HTMLElement} bodyEl - The body element to modify background color.
 */
const answerIncorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
  toggleClass(submitBtnEl, 'hide');
  toggleClass(nextBtnEl, 'hide');
  bodyEl.classList.remove('normal');
  bodyEl.classList.add('bg-incorrect');
};

/**
 * Updates the UI to indicate an incorrect answer by toggling button visibility and modifying the background color.
 *
 * @param {HTMLElement} submitBtnEl - The submit button element.
 * @param {HTMLElement} nextBtnEl - The next button element.
 * @param {HTMLElement} bodyEl - The body element to modify background color.
 */

/**
 * Increments and updates a player's score of a specified type in the UI.
 *
 * @param {HTMLElement} el - The HTML element displaying the current score.
 * @param {string} scoreType - The type of score to increment ('correct' or 'incorrect').
 */
const incrementScore = (el, scoreType) => {
  config.scores[scoreType] = Number(el.textContent) + 1;
  el.textContent = config.scores[scoreType].toString();
};

/**
 * Deselects all checked answers by setting their 'checked' property to false.
 */
function deselectCheckedAnswer() {
  answersRef.forEach((answersEl) => {
    answersEl.checked = false;
  });
}

/**
 * Generates and returns an HTML message to display at the end of the game.
 *
 * @param {Object} scoresObj - An object containing the player's scores, including the number of correct answers.
 * @param {Array} questionArray - An array of quiz questions.
 * @returns {string} - An HTML message to display at the end of the game.
 */
const displayEndOfGameMessage = (scoresObj, questionArray) => {
  let totalQuestions = questionArray[0].length;
  let correctPercentage = (scoresObj.correct / totalQuestions) * 100;
  let message;

  switch (true) {
    
    case correctPercentage < 25:
      message = `
      <div id='end-of-game' class='end-of-game'>
          <h1>😞 Better Luck Next Time 😞</h1>
          <p><i class="fa-5x">🙁</i></p>
          <p>You answered ${scoresObj.correct} / ${questionArray[0].length} questions correctly.</p>
          <p>Don't give up, keep learning!</p>
          <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
      `;
      break;
              
      case correctPercentage < 50:
        message = `
        <div id='end-of-game' class='end-of-game'>
          <h1>😊 Good Effort 😊</h1>
          <p><i class="fa-5x">👍</i></p>
          <p>You answered ${scoresObj.correct} / ${totalQuestions} questions correctly.</p>
          <p>Keep making progress!</p>
          <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
      `;
      break;

      case correctPercentage < 75:
      message = `
        <div id='end-of-game' class='end-of-game'>
          <h1>👏 Well Done! 👏</h1>
          <p><i class="fa-5x">🏅</i></p>
          <p>You answered ${scoresObj.correct} / ${totalQuestions} questions correctly.</p>
          <p>Remember practice makes perfect!</p>
          <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
      `;
      break;
     
      case correctPercentage < 90:
      message = `
        <div id='end-of-game' class='end-of-game'>
          <h1>👏👏 Awesome! 👏👏</h1>
          <p><i class="fa-5x">⭐</i></p>
          <p>You answered ${scoresObj.correct} / ${totalQuestions} questions correctly.</p>
          <p> Keep trying for a perfect score!</p>
          <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
      `;
      break;

      case correctPercentage == 100:
      message = `
        <div id='end-of-game' class='end-of-game'>
          <h1>🎉 Perfect Score 🎉</h1>
          <p><i class="fa-5x">🏆</i></p>
          <p>Congratulations! You answered all questions correctly.</p>
          <p>You are a true QuizPro!</p>
          <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
      `;
      break;
              
  }

  return message;

};

// 4. Event Handler functions are defined in this section

/**
 * Handles the "Play" button click event by fetching quiz data, loading the quiz, and toggling visibility of UI elements.
 *
 * @param {Event} event - The "Play" button click event.
 * @returns {Promise<void>} - A Promise that resolves when quiz data is loaded and the UI elements are toggled.
 */
async function handlePlay(event) {
  event.preventDefault();

  // Generate the URL for fetching quiz data based on selected settings.
  const API = generateQuestionDataUrl(
    config.difficultyLevelSelected,
    config.numberOfQuestionsSelected,
    config.categorySelected,
  );

  // Fetch quiz data asynchronously and store it in the variable quizData.
  const quizData = await getQuizData(API, config.questionArray);

  // Load the quiz questions and answer options using the fetched quiz data.
  loadQuiz(quizData);

  // Toggle the visibility of settings, quizGameArea, and tagline UI elements.
  settings.classList.toggle('hide');
  quizGameArea.classList.toggle('hide');
  tagline.classList.toggle('hide');
}

/**
 * Handles the button click event, checks the submitted answer, and updates the UI accordingly.
 *
 * @param {Event} event - The button click event.
 */
const handleSubmit = (event) => {
  event.preventDefault();
  const answer = getSubmittedAnswer();
  if (answer) {
    document.querySelectorAll('.answer').forEach((answerEl) => {
      disable(answerEl);
    });

    if (
      answer === config.questionArray[0][config.currentQuestion].correctAnswer
    ) {
      answerCorrect(submitBtn, nextBtn, bodyRef);
      incrementScore(correct_answers, 'correct');
    } else {
      answerIncorrect(submitBtn, nextBtn, bodyRef);
      incrementScore(incorrect_answers, 'incorrect');
    }
  }
};

/**
 * Handles the "Next" button click event, advances to the next question or displays the end of the game message.
 *
 * @param {Event} event - The "Next" button click event.
 */
async function handleNext(event) {
  event.preventDefault();
  bodyRef.classList.add('normal');
  bodyRef.classList.remove('bg-correct');
  bodyRef.classList.remove('bg-incorrect');

  config.currentQuestion++;

  if (config.currentQuestion < config.questionArray[0].length) {
    loadQuiz();
    questionNumber.innerText = `${config.currentQuestion + 1} of ${config.numberOfQuestionsSelected}`;
  } else {
    quizGameArea.innerHTML = displayEndOfGameMessage(
      config.scores,
      config.questionArray,
    );
  }

  toggleClass(nextBtn, 'hide');
  toggleClass(submitBtn, 'hide');
  answersRef.forEach((answerEl) => {
    enable(answerEl);
  });
}

// 5. Game Functionality is implemented in this section

generateCatDropdownItems(categoryDropdownRef);

generateDiffDropdownItems(difficultyRef, config.difficultyLevels);

generateNumberofQuestionsDropdownItems(
  numberOfQuestionsDropdownRef,
  config.numberOfQuestionOptions,
);

// 6. Event Listeners are called in this section

rulesBtn.addEventListener('click', () => {
  dialogRef.showModal();
});

closeDialogRef.addEventListener('click', () => {
  dialogRef.close();
});

difficultyDropdownRef.addEventListener('change', () => {
  config.difficultyLevelSelected = difficultyDropdownRef.value.toLowerCase();
});

categoryDropdownRef.addEventListener('change', () => {
  config.categorySelected = categoryDropdownRef.value;
});

numberOfQuestionsDropdownRef.addEventListener('change', () => {
  config.numberOfQuestionsSelected = numberOfQuestionsDropdownRef.value;
});

difficultyDropdownRef.addEventListener('change', checkIfSelected);

categoryDropdownRef.addEventListener('change', checkIfSelected);

numberOfQuestionsDropdownRef.addEventListener('change', checkIfSelected);

playBtn.addEventListener('click', handlePlay);

nextBtn.addEventListener('click', handleNext);

submitBtn.addEventListener('click', handleSubmit);

});