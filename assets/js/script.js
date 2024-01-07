const rulesButton = document.getElementById('rulesBtn');
const dialog = document.getElementById('rules-dialog');
const closeDialog = document.getElementById('close-rules-dialog');


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
