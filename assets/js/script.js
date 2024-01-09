//// Content
// 1. DOM elements are declared in this section
// 2. Variables are declared in this section
// 3. Functions are defined in this section
// 4. Event Handler functions are defined in this section
// 5. Game Functionality is implemented in this section
// 6. Event Listeners are added in this section
////

//// 1. DOM elements are declared in this section
const body = document.getElementById('body');
const rulesButton = document.getElementById('rulesBtn');
const dialog = document.getElementById('rules-dialog');
const closeDialog = document.getElementById('close-rules-dialog');
const difficultyRef = document.querySelector('#difficulty');
const topicRef = document.querySelector('#topic');
const playBtn = document.getElementById('playBtn');
const settings = document.getElementById('settings');
const quizGameArea = document.getElementById('quiz-game-area');
const answerA = document.getElementById('answer_a');
const answerB = document.getElementById('answer_b');
const answerC = document.getElementById('answer_c');
const answerD = document.getElementById('answer_d');
const submitBtn =document.getElementById('submit');
const nextBtn =document.getElementById('next');
const questionsEl = document.getElementById('question');
const answersEls = document.querySelectorAll('.answer');
const correct_answers = document.getElementById('correct_answers');
const incorrect_answers = document.getElementById('incorrect_answers');
const tagline = document.querySelector('.tagline');
const diffDropdown = document.getElementById('difficulty');

//// 2. Variables are declared in this section

const difficultyLevels = ['easy', 'medium', 'hard']

let diffSelected = 'easy';

let questionArray = [];

let currentQuestion = 0;

const scores = {
    correct: 0,
    incorrect: 0
};

const topicCategories = [
    {"id": 11, "name": "Film"},
    {"id": 9, "name": "General Knowledge"},
    {"id": 10, "name": "Books"},
    {"id": 12, "name": "Music"},
    {"id": 13, "name": "Musicals & Theatres"},
    {"id": 14, "name": "Television"},
    {"id": 15, "name": "Video Games"},
    {"id": 16, "name": "Board Games"},
    {"id": 17, "name": "Science & Nature"},
    {"id": 18, "name": "Computers"},
    {"id": 19, "name": "Mathematics"},
    {"id": 20, "name": "Mythology"},
    {"id": 21, "name": "Sports"},
    {"id": 22, "name": "Geography"},
    {"id": 23, "name": "History"},
    {"id": 24, "name": "Politics"},
    {"id": 25, "name": "Art"},
    {"id": 26, "name": "Celebrities"},
    {"id": 27, "name": "Animals"},
    {"id": 28, "name": "Vehicles"},
    {"id": 29, "name": "Comics"},
    {"id": 30, "name": "Gadgets"},
    {"id": 31, "name": "Anime & Manga"},
    {"id": 32, "name": "Cartoon & Animations"}
];

//// 3. Functions are defined in this section

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
    selectRef.innerHTML = ""; 
    content.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.value = item;
        optionRef.innerHTML = item.toUpperCase();
        selectRef.appendChild(optionRef);
    })
};

const generateCatDropdownItems = (selectRef, content) => {
    selectRef.innerHTML = ""; 
    content.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.value = item['name'];
        optionRef.innerHTML = item['name'];
        selectRef.appendChild(optionRef);
    })
}; 

//Refactor using .then instead of async await
async function getQuestions(URL, arr){
   
    const response = await fetch(URL);
    const data = await response.json();
    const questions = convertQuestions(data.results);
    arr.push(questions)
    // console.log(quizQuestions);
    return questions
}

// const API_URL = `https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple`;

const generateApiUrl = (diff, cat = 11) => {
    let API;
    API = `https://opentdb.com/api.php?amount=3&category=${cat}&difficulty=${diff}&type=multiple`;
    console.log(API);
    return API
}

function loadQuiz(){
    deselectCheckedAnswer();
    
    const currentQuizData = qAndAStatic[currentQuestion];

    questionsEl.innerText = currentQuizData.question;
    answerA.innerText = currentQuizData.answers[0];
    answerB.innerText = currentQuizData.answers[1]
    answerC.innerText = currentQuizData.answers[2];
    answerD.innerText = currentQuizData.answers[3];
};


// comment refactor addClass and removeClass into one function toggleClass
const addClass = (el, className) => {
        el.classList.add(className);
};

const removeClass = (el, className) => {
            el.classList.remove(className)
};

const toggleClass = (el, className) => {
    el.classList.toggle(className);
};

// TODOS: 
// 1. refactor answerCorrect, answerIncorrect and handleNext code to use toggle Class instead of removeClass and addClass
// 2. test functionality works

//
//


// check to see if better to refactor enale and disable functionality into one function??
const disable = (el) => {
    el.setAttribute('disabled', 'true')
}

const enable = (el) => {
    el.removeAttribute('disabled')
}

function getSelectedAnswer (){
    let selectedAnswer;

    document.querySelectorAll('.answer').forEach(answerEl =>{
        if(answerEl.checked){
            const labelText = answerEl.getAttribute('data-label');
            selectedAnswer = labelText
        }
    })

    return selectedAnswer;
};

const answerCorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
    toggleClass(submitBtnEl, 'hide');
    toggleClass(nextBtnEl, 'hide');
    toggleClass(bodyEl, 'normal');
    toggleClass(bodyEl, 'bg-correct');
};

const answerIncorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
    toggleClass(submitBtnEl, 'hide');
    toggleClass(nextBtnEl, 'hide');
    toggleClass(bodyEl,'normal');
    toggleClass(bodyEl,'bg-incorrect');
};

const incrementScore = (el, scoreType) => {
    scores[scoreType] = Number(el.textContent) + 1;
    el.textContent = scores[scoreType].toString();
};

function deselectCheckedAnswer() {
    answersEls.forEach(answersEl =>{
        answersEl.checked = false
    })
};

// refactor handleNext so that HTML code is generated by this function instead
const displayEndOfGameMessage = (scoresObj, questionArray) => {
    let message = `
       <div id='end-of-game' class='end-of-game'>
        <p><i class="fa-solid fa-hourglass fa-5x"></i></p>
        <p>Congratulations you finished the Quiz.</p>
        <p>You answered ${scoresObj.correct} / ${questionArray.length} questions correctly.</p>
        <p>Remember practice makes perfect.</p>
        <br>
        <button onclick="location.reload()">Play Again</button>
        </div>
    `
    return message;

}
//// 4. Event Handler functions are defined in this section

const handlePlay = (event) => {
    event.preventDefault();
    // Get selected difficulty level and selected Category

    //Generate API_URL

    //Get Questions from API and return questions

    //Load Quiz Questions
    loadQuiz();

    //Toggle hide class on Settings div
    settings.classList.toggle('hide');
    
    //Toggle hide class on quizGameArea div
    quizGameArea.classList.toggle('hide');
    //Toggle hide class on tagline
    tagline.classList.toggle('hide');
}

const handleSubmit = (event) => {
    event.preventDefault();
    const answer = getSelectedAnswer(); // need to update so that ist selects the text in the input label
    
    if(answer){
        document.querySelectorAll(".answer").forEach(answerEl =>{
            disable(answerEl);
        });

        if(answer === qAndAStatic[currentQuestion].correctAnswer){
            answerCorrect(submitBtn, nextBtn, body);
            incrementScore(correct_answers, 'correct');
        } else {
            answerIncorrect(submitBtn, nextBtn, body);
            incrementScore(incorrect_answers,'incorrect');
      
    }

    }
}

const handleNext = (event) =>{
    event.preventDefault();
    toggleClass(body, 'normal' );
    currentQuestion++;
    
    if(currentQuestion < qAndAStatic.length){
        loadQuiz()
    } else {
    
        quizGameArea.innerHTML = displayEndOfGameMessage(scores, qAndAStatic)
        
        }
           toggleClass(nextBtn, 'hide');
           toggleClass(submitBtn, 'hide');
        
            answersEls.forEach(answerEl => {
                enable(answerEl);
            });    
}
//// 5. Game Functionality is implemented in this section

const API_URL = generateApiUrl(diffSelected);
generateCatDropdownItems(topicRef, topicCategories);
generateDiffDropdownItems(difficultyRef, difficultyLevels);

//// Get questions section

const qAndA = await getQuestions(API_URL, questionArray); // refactor using .then instead of await
// let qAndA = await getQuestions(API_URL, questionArray);

const qAndAStatic = [...qAndA]
console.log(qAndAStatic)

//// 6. Event Listeners are called in this section

rulesButton.addEventListener('click', () => {
    dialog.showModal()
})

closeDialog.addEventListener('click', () => {
    dialog.close();
})

diffDropdown.addEventListener('change', () =>{
    diffSelected = diffDropdown.value.toLowerCase();
})

playBtn.addEventListener('click', handlePlay)

nextBtn.addEventListener('click', handleNext);

submitBtn.addEventListener('click', handleSubmit)