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
const answersList = document.querySelector('#answers-list')
const answerButtonsRef = document.querySelectorAll('.answer-buttons')
const submitBtn =document.querySelector('#submit');
const nextBtn =document.querySelector('#next');
const questionsRef = document.querySelector('#question');
const answersRef = document.querySelectorAll('.answer');
const correct_answers = document.querySelector('#correct_answers');
const incorrect_answers = document.querySelector('#incorrect_answers');
const tagline = document.querySelector('.tagline');
const difficultyDropdown = document.querySelector('#difficulty');
const categoryDropdown = document.querySelector('#topic');
const numberOfQuestionsDropdown = document.querySelector('#number-of-questions');
const questionNumber = document.querySelector('#question-number')

//// 2. Variables are declared in this section

const difficultyLevels = ['easy', 'medium', 'hard'];
const numberOfQuestionOptions = ['5', '10', '15' , '20', '25']
let difficultyLevelSelected = '';
let categorySelected = '';
let numberOfQuestionsSelected = '';

let categories = [];
let questionArray = [];
let currentQuestion = 0;

const scores = {
    correct: 0,
    incorrect: 0
};

//// 3. Functions are defined in this section

async function getCategoryData(url, categoryArray){
    const response = await fetch(url);
    const data = await response.json();
    const catData = await data.trivia_categories
    categoryArray.push(catData)
    return catData
}    

const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);

const convertQuestions = (listOfQuestions) => {
    return listOfQuestions.map(q => {
        return {
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: shuffleArray([...q.incorrect_answers, q.correct_answer]),
            category: q.category,
            difficulty: q.difficulty,
        }
    })
};

const generateDiffDropdownItems = (selectRef, content) => {
    
    const firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.innerHTML = '-- Select Difficulty Level';
    selectRef.appendChild(firstOption);

    content.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.value = item;
        optionRef.innerHTML = toTitleCase(item);
        selectRef.appendChild(optionRef);
    })
};

const generateNumberofQuestionsDropdownItems = (selectRef, content) => {
    
    const firstOption = document.createElement('option');
    firstOption.value = '';
    firstOption.innerHTML = '-- Select Number of Questions';
    selectRef.appendChild(firstOption);

    content.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.value = item;
        optionRef.innerHTML = toTitleCase(item);
        selectRef.appendChild(optionRef);
    })
};

const categoryDataArray = await getCategoryData("https://opentdb.com/api_category.php", categories)

const generateCatDropdownItems = (selectRef, categoryArray) => {
       
       const firstOption = document.createElement('option');
       firstOption.value = '';
       firstOption.innerHTML = '-- Select Category';
       selectRef.appendChild(firstOption);

        categoryDataArray.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.innerHTML = item.name;
        optionRef.value = item.id;
        optionRef.id = item.id;
        selectRef.appendChild(optionRef);
    })
}; 

const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

 const generateQuestionDataUrl = (diff, numOfQuestions, cat) => {
    let API;
    API = `https://opentdb.com/api.php?amount=${numOfQuestions}&category=${cat}&difficulty=${diff}&type=multiple`;
    return API
}

const displayAnswers = (unorderedListRef, currentAnswers) => {

        unorderedListRef.innerHTML = '';
        
        currentAnswers.forEach( (item, index) => {
            const listRef = document.createElement('li');
            
            const radioRef = document.createElement('input');
            radioRef.type = 'radio';
            radioRef.name = 'answer';
            radioRef.id =  'answer' + (index + 1);
            radioRef.value = item;
            radioRef.classList.add('answer');

            const labelRef = document.createElement('label');
            labelRef.setAttribute('for', 'answer' + (index + 1));
            labelRef.innerHTML = item;

            listRef.appendChild(radioRef);
            listRef.appendChild(labelRef);
            unorderedListRef.appendChild(listRef);
        })
}

async function getQuizData(URL, arr){

    const response = await fetch(URL);
    const data = await response.json();
    const questions = convertQuestions(data.results);
    arr.push(questions)
    return questions
}


function loadQuiz(data){
    deselectCheckedAnswer();

    questionNumber.innerText = currentQuestion +1;
    
    const currentQuizData = data[currentQuestion];
    console.log(currentQuizData)
    questionsRef.innerHTML = currentQuizData.question;

    displayAnswers(answersList, currentQuizData.answers);

};

// refactor loadQuiz()

// function loadQuiz(){
//     // deselectCheckedAnswer()
//     const currentQuizData = questionArray[currentQuestion];
//     questionsRef.innerHTML = currentQuizData.question;
//     displayAnswers(answersList, currentQuizData.answers);
// }


const toggleClass = (el, className) => {
    el.classList.toggle(className);
};

const disable = (el) => {
    el.setAttribute('disabled', 'true')
}

const enable = (el) => {
    el.removeAttribute('disabled')
}

function getSubmittedAnswer (){
    let selectedAnswer;

    document.querySelectorAll('.answer').forEach(answerEl =>{
        if(answerEl.checked){
            const inputValue = answerEl.value;
            selectedAnswer = inputValue;
        }
    })

    return selectedAnswer;
};

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

// refactor answerCorrect and answerIncoorect into one function as they do similar things

const incrementScore = (el, scoreType) => {
    scores[scoreType] = Number(el.textContent) + 1;
    el.textContent = scores[scoreType].toString();
};

function deselectCheckedAnswer() {
    answersRef.forEach(answersEl =>{
        answersEl.checked = false
    })
};

const displayEndOfGameMessage = (scoresObj, questionArray) => {
    let message = `
       <div id='end-of-game' class='end-of-game'>
        <h1>🍾 Congratulations 🍾</h1>
        <p><i class="fa-5x">🏆</i></p>
        <p>You answered ${scoresObj.correct} / ${questionArray.length} questions correctly.</p>
        <p>Remember practice makes perfect!</p>
        <button class="btn playAgainBtn" onclick="location.reload()">Play Again</button>
        </div>
    `
    return message;

};

//// 4. Event Handler functions are defined in this section

async function handlePlay(event){
    event.preventDefault();  
    const API = generateQuestionDataUrl(difficultyLevelSelected, numberOfQuestionsSelected, categorySelected)
    const quizData = await getQuizData(API, questionArray)
    console.log(quizData[0].question)
    console.log(questionArray)
    
         
    // //Load first quiz question and answers
    loadQuiz(quizData);
        
        
    // //Toggle hide class on Settings div
    // settings.classList.toggle('hide');
        
    // //Toggle hide class on quizGameArea div
    // quizGameArea.classList.toggle('hide');
    // //Toggle hide class on tagline
    // tagline.classList.toggle('hide');
}
    
    

const handleSubmit = (event) => {
    event.preventDefault();
    const answer = getSubmittedAnswer();     
    if(answer){ 
        document.querySelectorAll(".answer").forEach(answerEl =>{
            disable(answerEl);
        });

        if(answer === qAndAStatic[currentQuestion].correctAnswer){
            answerCorrect(submitBtn, nextBtn, body);
            incrementScore(correct_answers, 'correct');
        } else {
            answerIncorrect(submitBtn, nextBtn, body);
            incrementScore(incorrect_answers,'incorrect')    
    }
    }
}

const handleNext = (event) =>{

    event.preventDefault();
    body.classList.add('normal');
    body.classList.remove('bg-correct');
    body.classList.remove('bg-incorrect');

    currentQuestion++;
    
    if(currentQuestion < qAndAStatic.length){
        loadQuiz()
        questionNumber.innerText = currentQuestion;  
    } else{
        quizGameArea.innerHTML = displayEndOfGameMessage(scores, qAndAStatic);
    }

    toggleClass(nextBtn, 'hide');
    toggleClass(submitBtn, 'hide');  
    answersRef.forEach(answerEl => {
        enable(answerEl);
    });    
          
};

//// 5. Game Functionality is implemented in this section
generateCatDropdownItems(categoryDropdown, categories);
generateDiffDropdownItems(difficultyRef, difficultyLevels);
generateNumberofQuestionsDropdownItems(numberOfQuestionsDropdown, numberOfQuestionOptions);

// const API_URL = generateQuestionDataUrl(difficultyLevelSelected, numberOfQuestionsSelected, categorySelected);

//// Get question and answer data section

// const qAndA = await getQuizData(API_URL, questionArray);

// const qAndAStatic = [...qAndA]
// console.log(qAndAStatic)

//// 6. Event Listeners are called in this section

rulesButton.addEventListener('click', () => {
    dialog.showModal()
})

closeDialog.addEventListener('click', () => {
    dialog.close();
})

difficultyDropdown.addEventListener('change', () => {
    difficultyLevelSelected = difficultyDropdown.value.toLowerCase();
    console.log('The difficulty level was changed to: ' + difficultyLevelSelected)
    
})

categoryDropdown.addEventListener('change', () => {
    categorySelected = categoryDropdown.value;
    console.log('The category level id was changed to: ' + categorySelected)
    
})

numberOfQuestionsDropdown.addEventListener('change', () => {
    numberOfQuestionsSelected = numberOfQuestionsDropdown.value;
    console.log('The number of questions selected was changed to: ' + numberOfQuestionsSelected)
    
})

playBtn.addEventListener('click', handlePlay)

nextBtn.addEventListener('click', handleNext);

submitBtn.addEventListener('click', handleSubmit)