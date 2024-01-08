
const rulesButton = document.getElementById('rulesBtn');
const dialog = document.getElementById('rules-dialog');
const closeDialog = document.getElementById('close-rules-dialog');
const difficultyRef = document.querySelector('#difficulty');
const topicRef = document.querySelector('#topic');
const answerA = document.getElementById('answer_a');
const answerB = document.getElementById('answer_b');
const answerC = document.getElementById('answer_c');
const answerD = document.getElementById('answer_d');
const submitBtn =document.getElementById('submit');
const nextBtn =document.getElementById('next');
const questionsEl = document.getElementById('question');
const answersEls = document.querySelectorAll('.answer');




rulesButton.addEventListener('click', () => {
    dialog.showModal()
})

closeDialog.addEventListener('click', () => {
    dialog.close();
})

////Difficulty levels
const difficultyLevels = ['easy', 'medium', 'hard']

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

const API_URL = `https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`;

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

const qAndAStatic = [...qAndA]
console.log(qAndAStatic)

// Loading quiz question section


let currentQuestion = 0;

function loadQuiz(){
    
    const currentQuizData = qAndAStatic[currentQuestion];

    questionsEl.innerText = currentQuizData.question;
    answerA.innerText = currentQuizData.answers[0];
    answerB.innerText = currentQuizData.answers[1]
    answerC.innerText = currentQuizData.answers[2];
    answerD.innerText = currentQuizData.answers[3];
}

loadQuiz();

// Utility functions

function getSelected (){
         let answer;
    
         answersEls.forEach(answerEl =>{
             if(answerEl.checked){
                 answer = answerEl.id
             }
         })
    
         return answer;
    }
    
console.log(getSelected())

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


// Submit button event handler and event listener

const handleSubmit = (event) =>{
    event.preventDefault();
    const answer = getSelected();
    
    if(answer){
        answerEls
    }
}

submitBtn.addEventListener('click', handleSubmit)

const handleNext = (event) =>{
    event.preventDefault();
    currentQuestion++;
    
    if(currentQuestion < qAndAStatic.length){
        loadQuiz()
    }
    
}

nextBtn.addEventListener('click', handleNext)






