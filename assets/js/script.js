//// Content
// 1. DOM elements are declared in this section
// 2. Variables are declared in this section
// 3. Functions are defined in this section
// 4. Event Handler functions are defined in this section
// 5. Game Functionality is implemented in this section
// 6. Event Listeners are added in this section
////

//// 1. DOM elements are declared in this section
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

const checkIfSelected = () => {
  if (
    difficultyDropdown.value !== '' &&
    categoryDropdown.value !== '' &&
    numberOfQuestionsDropdown.value !== ''
  ) {
    playBtn.classList.toggle('hide');
  }
};

const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const generateQuestionDataUrl = (diff, numOfQuestions, cat) => {
  let API;
  API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${cat}&difficulty=${diff}&type=multiple`;
  return API;
};

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

async function getQuizData(URL, arr) {
  const response = await fetch(URL);
  const data = await response.json();
  const questions = convertQuestions(data.results);
  arr.push(questions);
  return questions;
}

function loadQuiz() {
  deselectCheckedAnswer();

  questionNumber.innerText = config.currentQuestion + 1;

  const currentQuizData = config.questionArray[0][config.currentQuestion];

  questionsRef.innerHTML = currentQuizData.question;

  displayAnswers(answersList, currentQuizData.answers);
}

const toggleClass = (el, className) => {
  el.classList.toggle(className);
};

const disable = (el) => {
  el.setAttribute('disabled', 'true');
};

const enable = (el) => {
  el.removeAttribute('disabled');
};

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

const answerCorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
  toggleClass(submitBtnEl, 'hide');
  toggleClass(nextBtnEl, 'hide');
  bodyEl.classList.remove('normal');
  bodyEl.classList.add('bg-correct');
};

const answerIncorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
  toggleClass(submitBtnEl, 'hide');
  toggleClass(nextBtnEl, 'hide');
  bodyEl.classList.remove('normal');
  bodyEl.classList.add('bg-incorrect');
};

const incrementScore = (el, scoreType) => {
  config.scores[scoreType] = Number(el.textContent) + 1;
  el.textContent = config.scores[scoreType].toString();
};

function deselectCheckedAnswer() {
  answersRef.forEach((answersEl) => {
    answersEl.checked = false;
  });
}

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

async function handlePlay(event) {
  event.preventDefault();
  const API = generateQuestionDataUrl(
    config.difficultyLevelSelected,
    config.numberOfQuestionsSelected,
    config.categorySelected,
  );
  const quizData = await getQuizData(API, config.questionArray);

  loadQuiz(quizData);

  settings.classList.toggle('hide');

  quizGameArea.classList.toggle('hide');

  tagline.classList.toggle('hide');
}

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

rulesButton.addEventListener('click', () => {
  dialog.showModal();
});

closeDialog.addEventListener('click', () => {
  dialog.close();
});

difficultyDropdown.addEventListener('change', () => {
  config.difficultyLevelSelected = difficultyDropdown.value.toLowerCase();
});

categoryDropdown.addEventListener('change', () => {
  config.categorySelected = categoryDropdown.value;
});

difficultyDropdown.addEventListener('change', checkIfSelected);

numberOfQuestionsDropdown.addEventListener('change', () => {
  config.numberOfQuestionsSelected = numberOfQuestionsDropdown.value;
});

difficultyDropdown.addEventListener('change', checkIfSelected);
categoryDropdown.addEventListener('change', checkIfSelected);
numberOfQuestionsDropdown.addEventListener('change', checkIfSelected);

playBtn.addEventListener('click', handlePlay);

nextBtn.addEventListener('click', handleNext);

submitBtn.addEventListener('click', handleSubmit);
