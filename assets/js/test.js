// let categories = [];

// const category_url = `https://opentdb.com/api_category.php`;

// function getCategories(url){
//     fetch(url).then(response => response.json()).then(data => {
//         arr.push(data)

        
//     })
// }

// getCategories("https://opentdb.com/api_category.php").then(
//     console.log(categories)
// )

const questionAndAnswerData = []

const API_URL = `https://opentdb.com/api.php?amount=5&category=9&difficulty=medium&type=multiple`;

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

function getQuizData(url, arr) {
   return fetch(url)
    .then(response => response.json())
    .then(data => {
        const questions = convertQuestions(data.results)
        return questions
    })      
}

