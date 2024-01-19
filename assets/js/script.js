/**Content
 * 1. DOM elements are declared in this section
 * 2. Variables are declared in this section
 * 3. Functions are defined in this section
 * 4. Event Handler functions are defined in this section
 * 5. Game Functionality is implemented in this section
 * 6. Event Listeners are added in this section
 */

//// 1. DOM elements are declared in this section

/**
 * Selects and stores references to various HTML elements using document.querySelector.
 * These elements are used throughout the application for interactions and UI updates.
 */
const body = document.querySelector('body');
const rulesButton = document.querySelector('#rulesBtn');
const dialog = document.querySelector('#rules-dialog');
const closeDialog = document.querySelector('#close-rules-dialog');
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
const difficultyDropdown = document.querySelector('#difficulty');
const categoryDropdown = document.querySelector('#topic');
const numberOfQuestionsDropdown = document.querySelector(
  '#number-of-questions',
);
const questionNumber = document.querySelector('#question-number');

//// 2. Variables are declared in this section

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

//// 3. Functions are defined in this section

/**
 * Retrieves trivia category data from a specified URL and adds it to a provided array.
 * @param {string} url - The URL to fetch the category data from.
 * @param {Array} categoryArray - The array to which the category data will be added.
 * @returns {Promise<object>} - A Promise that resolves to the retrieved category data.
 */
async function getCategoryData(url, categoryArray) {
  const response = await fetch(url);
  const data = await response.json();
  const catData = await data.trivia_categories;
  categoryArray.push(catData);
  return catData;
}

/**
 * Shuffles the elements of an array in a random order.
 * @param {Array} arr - The array to be shuffled.
 * @returns {Array} - A new array with elements shuffled randomly.
 */

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
    difficultyDropdown.value !== '' &&
    categoryDropdown.value !== '' &&
    numberOfQuestionsDropdown.value !== ''
  ) {
    playBtn.classList.toggle('hide');
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
  let API;
  API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${cat}&difficulty=${diff}&type=multiple`;
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
  const response = await fetch(URL);
  const data = await response.json();
  const questions = convertQuestions(data.results);
  arr.push(questions);
  return questions;
}

/**
 * Loads and displays a quiz question along with answer choices on the web page.
 * Updates the question number and clears any previously selected answers.
 */
function loadQuiz() {
  deselectCheckedAnswer();

  questionNumber.innerText = config.currentQuestion + 1;

  const currentQuizData = config.questionArray[0][config.currentQuestion];

  questionsRef.innerHTML = currentQuizData.question;

  displayAnswers(answersList, currentQuizData.answers);
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
  let message = `
       <div id='end-of-game' class='end-of-game'>
        <h1>🍾 Congratulations 🍾</h1>
        <p><i class="fa-5x">🏆</i></p>
        <p>You answered ${scoresObj.correct} / ${questionArray[0].length} questions correctly.</p>
        <p>Remember practice makes perfect!</p>
        <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
    `;
  return message;
};

//// 4. Event Handler functions are defined in this section

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
      answerCorrect(submitBtn, nextBtn, body);
      incrementScore(correct_answers, 'correct');
    } else {
      answerIncorrect(submitBtn, nextBtn, body);
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
  body.classList.add('normal');
  body.classList.remove('bg-correct');
  body.classList.remove('bg-incorrect');

  config.currentQuestion++;

  if (config.currentQuestion < config.questionArray[0].length) {
    loadQuiz();
    questionNumber.innerText = config.currentQuestion + 1;
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

//// 5. Game Functionality is implemented in this section

generateCatDropdownItems(categoryDropdown);

generateDiffDropdownItems(difficultyRef, config.difficultyLevels);

generateNumberofQuestionsDropdownItems(
  numberOfQuestionsDropdown,
  config.numberOfQuestionOptions,
);

//// 6. Event Listeners are called in this section

//Adds a click event listener to the "rulesButton" element to open a modal dialog when clicked.
rulesButton.addEventListener('click', () => {
  dialog.showModal();
});

//Adds a click event listener to the "closeDialog" element to close a modal dialog when clicked.
closeDialog.addEventListener('click', () => {
  dialog.close();
});

//Adds a change event listener to the "difficultyDropdown" element to update the selected difficulty level in the configuration when the dropdown selection changes.
difficultyDropdown.addEventListener('change', () => {
  config.difficultyLevelSelected = difficultyDropdown.value.toLowerCase();
});

//Adds a change event listener to the "categoryDropdown" element that updates the selected number of questions
//based on the dropdown selection.
categoryDropdown.addEventListener('change', () => {
  config.categorySelected = categoryDropdown.value;
});

//Adds a change event listener to the "difficultyDropdown" element that invokes the "checkIfSelected" function
//when the dropdown selection changes, to check if all necessary options are selected before enabling further actions.
difficultyDropdown.addEventListener('change', checkIfSelected);

//Adds a change event listener to the "numberOfQuestionsDropdown" element that updates the selected number of questions
//based on the dropdown selection.
numberOfQuestionsDropdown.addEventListener('change', () => {
  config.numberOfQuestionsSelected = numberOfQuestionsDropdown.value;
});

//Adds a change event listener to the "difficultyDropdown" element.
//When the dropdown selection changes, it invokes the "checkIfSelected" function
//to check if the selected difficulty, category, and number of questions are all chosen
//before enabling further actions in the application.
difficultyDropdown.addEventListener('change', checkIfSelected);

/**
 * Adds a change event listener to the "categoryDropdown" element.
 * When the dropdown selection changes, it invokes the "checkIfSelected" function
 * to check if the selected difficulty, category, and number of questions are all chosen
 * before enabling further actions in the application.
 */
categoryDropdown.addEventListener('change', checkIfSelected);

/**
 * Adds a change event listener to the "numberOfQuestionsDropdown" element.
 * When the dropdown selection changes, it invokes the "checkIfSelected" function
 * to check if the selected difficulty, category, and number of questions are all chosen
 * before enabling further actions in the application.
 */
numberOfQuestionsDropdown.addEventListener('change', checkIfSelected);

/**
 * Adds a click event listener to the "playBtn" element that triggers the "handlePlay" function when clicked.
 */
playBtn.addEventListener('click', handlePlay);

/**
 * Adds a click event listener to the "nextBtn" element that triggers the "handleNext" function when clicked.
 */
nextBtn.addEventListener('click', handleNext);

/**
 * Adds a click event listener to the "submitBtn" element that triggers the "handleSubmit" function when clicked.
 */
submitBtn.addEventListener('click', handleSubmit);
