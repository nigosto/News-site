class CategoryService {
    constructor(){
        this.allUrl = 'http://localhost:9999/feed/category/all';
    }

    async getAllCategories() {
        let categoriesRequest = await fetch(this.allUrl)
        let categoriesAsJson = await categoriesRequest.json()
        let categories = await categoriesAsJson.categories

        return categories;
    }
}

export default CategoryService