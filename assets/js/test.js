let categories = [];

const category_url = `https://opentdb.com/api_category.php`;

function getCategories(url){
    fetch(url).then(response => response.json()).then(data => {
        arr.push(data)

        
    })
}

getCategories("https://opentdb.com/api_category.php").then(
    console.log(categories)
)