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

// Variables

//Difficulty levels
const difficultyLevels = ['easy', 'medium', 'hard']

let diffSelected = 'easy';

// Loading quiz question section

let currentQuestion = 0;

const scores = {
    correct: 0,
    incorrect: 0
};


////topicCategories

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

const generateDiffDropdownItems = (selectRef, content) => {
    selectRef.innerHTML = ""; 
    content.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.value = item;
        optionRef.innerHTML = item.toUpperCase();
        selectRef.appendChild(optionRef);
    })
} 

generateDiffDropdownItems(difficultyRef, difficultyLevels);

const generateCatDropdownItems = (selectRef, content) => {
    selectRef.innerHTML = ""; 
    content.forEach(item => {
        const optionRef = document.createElement('option');
        optionRef.value = item['name'];
        optionRef.innerHTML = item['name'];
        selectRef.appendChild(optionRef);
    })
} 

generateCatDropdownItems(topicRef, topicCategories);

//// Get questions section

// const API_URL = `https://opentdb.com/api.php?amount=1&category=9&difficulty=medium&type=multiple`;

const generateApiUrl = (diff, cat = 11) => {
    let API;
    API = `https://opentdb.com/api.php?amount=3&category=${cat}&difficulty=${diff}&type=multiple`;
    console.log(API);
    return API
}

const API_URL = generateApiUrl(diffSelected);


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
}

let questionArray =[]

async function getQuestions(URL, arr){
   
    const response = await fetch(URL);
    const data = await response.json();
    const questions = convertQuestions(data.results);
    arr.push(questions)
    // console.log(quizQuestions);
    return questions
}

const qAndA = await getQuestions(API_URL, questionArray);
// let qAndA = await getQuestions(API_URL, questionArray);

const qAndAStatic = [...qAndA]
console.log(qAndAStatic)

function loadQuiz(){
    deselectAnswers();
    
    const currentQuizData = qAndAStatic[currentQuestion];

    questionsEl.innerText = currentQuizData.question;
    answerA.innerText = currentQuizData.answers[0];
    answerB.innerText = currentQuizData.answers[1]
    answerC.innerText = currentQuizData.answers[2];
    answerD.innerText = currentQuizData.answers[3];
}

// loadQuiz();

// Utility functions

function getSelectedAnswer (){
         let selectedAnswer;
    
         document.querySelectorAll('.answer').forEach(answerEl =>{
             if(answerEl.checked){
                 const labelText = answerEl.getAttribute('data-label');
                 selectedAnswer = labelText
             }
         })
    
         return selectedAnswer;
    }
    
console.log(getSelectedAnswer());

const addClass = (el, className) => {
    try{
        el.classList.add(className);
    } catch (error){
        console.error(`Failed to add class: ${error.message}`)
    }
}

const removeClass = (el, className) => {
    try{
        el.classList.remove(className)
    } catch (error){
        console.error(`Failed to remove class: ${error.message}`)
    }
}

const disable = (el) => {
    el.setAttribute('disabled', 'true')
}

const enable = (el) => {
    el.removeAttribute('disabled')
}


const answerCorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
    addClass(submitBtnEl, 'hide');
    removeClass(nextBtnEl, 'hide');
    removeClass(bodyEl, 'normal');
    addClass(bodyEl, 'bg-correct');
}

const answerIncorrect = (submitBtnEl, nextBtnEl, bodyEl) => {
    addClass(submitBtnEl, 'hide');
    removeClass(nextBtnEl, 'hide');
    removeClass(bodyEl,'normal');
    addClass(bodyEl,'bg-incorrect');
} 

const incrementScore = (el, scoreType) => {
    scores[scoreType] = Number(el.textContent) + 1;
    el.textContent = scores[scoreType].toString();
}

// Deselct checked answer
function deselectAnswers() {
    answersEls.forEach(answersEl =>{
        answersEl.checked = false
    })
};

//// Event Handler functions are defined in this section

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
    removeClass(body, 'bg-incorrect' );
    removeClass(body, 'bg-correct' );
    currentQuestion++;
    
    if(currentQuestion < qAndAStatic.length){
        loadQuiz()
    } else {
        quiz.innerHTML = `
        <br>
        <h2><i class="fa-solid fa-hourglass fa-5x"></i></h2>
        <br>
        <h2>Congratulations you finished the Quiz</h2>
        <br>
        <h2>You answered ${scores.correct} / ${qAndAStatic.length} questions correctly</h2>
        <br>
        <h2>Remember practice makes perfect</h2>
        <br>
        <button onclick="location.reload()">Play Again</button>
        `
          }
           addClass(nextBtn, 'hide');
           removeClass(submitBtn, 'hide');
           removeClass(body, 'hide');
        
            answersEls.forEach(answerEl => {
                enable(answerEl);
            });    
}

//// Event Listeners are called in this section

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