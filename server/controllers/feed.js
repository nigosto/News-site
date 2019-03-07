const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Category = require('../models/Category')
const User = require('../models/User')
const fs = require('fs')
const nanoid = require('nanoid')

module.exports = {
	createCategory: async (req, res, next) => {
		const name = req.body.name;

		try {
			let category = await Category.create({
				name,
				articles: []
			})

			res.status(200).json({ message: 'Category created successfully!', category })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}

	},
	getCategories: async (req, res, next) => {
		try {
			let categories = await Category.find();

			res.status(200).json({ message: 'Categories fetched successfully!', categories })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	articleCreate: async (req, res, next) => {
		try {
			const { title, image, information, video, category, author } = req.body;

			const id = nanoid()
			

			let user = await User.find({username: author});
			//console.log(user[0])
			let article = await Article.create({
				title,
				image: "http://" + req.hostname + ":9999/content/images/" + id + ".jpg",
				bodyText: information,
				video,
				category,
				author: user[0]._id,
				comments: []
			})

			//console.log(`${process.cwd()}/content/images/${id}`)
			fs.writeFileSync(`${process.cwd()}/content/images/${id}.jpg`,image.split(';base64,').pop(),{encoding: "base64"});
			
			user[0].articles.push(article._id)
			await user[0].save()

			let categoryInBase = await Category.findById(category);
			categoryInBase.articles.push(article._id)
			await categoryInBase.save()

			res.status(200).json({ message: 'Article created successfully!', article })

		} catch (error) {
			console.log(error)
			next(error);
		}
	},
	articleGet: async (req, res, next) => {
		try {
			let articles = await Article.find()  

			res.status(200).json({ message: 'Articles fetched successfully', articles })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	addComment: async (req, res, next) => {
		try {
			//TODO
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	getArticle: async(req,res,next) => {
		try {
			let article = await Article.findById(req.params.id).populate('author')

			res.status(200).json({ message: 'Article fetched successfully', article })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	getArticlesByCategory: async(req,res,next) => {
		try {
			let name = req.params.name
			let category = await Category.find({name: name}).populate('articles')
			if(category.length){
				res.status(200).json({message: 'Category fetched successfully',articles: category[0].articles})
			}
			else {
				res.status(404).json({message: 'No such category', error: true})
			}
			
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	categoryRename: async (req,res,next) => {
		try {
			let id = req.params.id;
			let category = await Category.findById(id);
			category.name = req.body.newName;
			await category.save()
			res.status(200).json({message: 'Category renamed successfully!', category})
			
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	deleteCategory: async (req,res,next) => {
		try {
			let id = req.params.id;

			let category = await Category.findById(id);
			category.articles.forEach(async (a) => {
				let article = await Article.findById(a);

				let author = await User.findByIdAndUpdate(article.author , {$pullAll: {articles: [article._id]}}, {safe: true, multi: true})

				let path = article.image.substring(21);
				await fs.unlinkSync(`./${path}`)
				
				await article.remove()
			});
			await category.remove()
			res.status(200).json({message: 'Category deleted successfully!', category: "deleted"})
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}

}