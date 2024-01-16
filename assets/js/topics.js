let categories = [];

console.log(categories)
// const category_url = `https://opentdb.com/api_category.php`;

function getCategoryData(url, categoryArray){
    fetch(url).then(response => response.json()).then(data => {
        categoryArray.push(data.trivia_categories)
        return data.trivia_categories

   })
}

getCategoryData("https://opentdb.com/api_category.php", categories)
