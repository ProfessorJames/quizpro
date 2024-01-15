let categories = [];

const category_url = `https://opentdb.com/api_category.php`;

function getCategories(url, categoryArray){
    return fetch(url).then(response => response.json()).then(data => {
        categoryArray.push(data.trivia_categories)
        // categoryArray.push(data)

   })
}

getCategories("https://opentdb.com/api_category.php", categories)