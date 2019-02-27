const Article = require('../models/Article')
const Comment = require('../models/Comment')
const Category = require('../models/Category')
const User = require('../models/User')

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
			const { title, image, bodyText, video, category, author } = req.body;

			let article = await Article.create({
				title,
				image,
				bodyText,
				video,
				category,
				author,
				comments: []
			})

			let user = await User.findById(author);
			user.articles.push(article._id)
			await user.save()

			let categoryInBase = await Category.findById(category);
			categoryInBase.articles.push(article._id)
			await categoryInBase.save()

			res.status(200).json({ message: 'Article created successfully!', article })

		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
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
			let article = await Article.findById(req.params.id)
			
			res.status(200).json({ message: 'Article fetched successfully', article })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}

}