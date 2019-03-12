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
			let errors = [];
			const { title, image, information, video, category, author } = req.body;

			const id = nanoid()

			let news = await Article.find();
			news = news.filter(n => n.title === title)

			if(news.length){
				errors.push("This title already exists!")
			}

			if(title === ''){
				errors.push("Please enter title!")
			}

			if(information === ''){
				errors.push("Please enter information!")
			}

			if(image === undefined){
				errors.push("Please upload image!")
			}

			if(category === '' || category === "Choose category"){
				errors.push("Please choose category!")
			}

			if(errors.length){
				res.status(400).json({errors})
			}

			let user = await User.find({ username: author });
			let article = await Article.create({
				title,
				image: "http://" + req.hostname + ":9999/content/images/" + id + ".jpg",
				bodyText: information,
				video,
				category,
				author: user[0]._id,
				comments: []
			})
			fs.writeFileSync(`${process.cwd()}/content/images/${id}.jpg`, image.split(';base64,').pop(), { encoding: "base64" });

			user[0].articles.push(article._id)
			await user[0].save()

			let categoryInBase = await Category.findById(category);
			categoryInBase.articles.push(article._id)
			await categoryInBase.save()

			res.status(200).json({ message: 'News sent successfully!', article })

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
			const {bodyText, author, article} = req.body

			let error = false
			if(bodyText === ''){
				error = true;
			}

			if(error){
				res.status(400).json({error: "Cannot post empty comment!"})
			}

			let comment = await Comment.create({
				bodyText,
				author,
				article,
			})

			let user = await User.findById(author)
			user.comments.push(comment._id)
			let articleModel = await Article.findById(article)
			articleModel.comments.push(comment._id)

			await user.save();
			await articleModel.save()
			res.status(200).json({message: "Comment added", comment})
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	getArticle: async (req, res, next) => {
		try {
			let article = await Article.findById(req.params.id).populate('author').populate('category').populate({
				path: 'comments',
				model: 'Comment',
				populate: {
					path: 'author',
					model: 'User'
				}
			})

			res.status(200).json({ message: 'Article fetched successfully', article })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	getArticlesByCategory: async (req, res, next) => {
		try {
			let name = req.params.name
			let category = await Category.find({ name: name }).populate('articles')
			if (category.length) {
				res.status(200).json({ message: 'Category fetched successfully', articles: category[0].articles })
			}
			else {
				res.status(404).json({ message: 'No such category', error: true })
			}

		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	categoryRename: async (req, res, next) => {
		try {
			let id = req.params.id;
			let category = await Category.findById(id);
			category.name = req.body.newName;
			await category.save()
			res.status(200).json({ message: 'Category renamed successfully!', category })

		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	deleteCategory: async (req, res, next) => {
		try {
			let id = req.params.id;

			let category = await Category.findById(id);
			category.articles.forEach(async (a) => {
				let article = await Article.findById(a);

				let author = await User.findByIdAndUpdate(article.author, { $pullAll: { articles: [article._id] } }, { safe: true, multi: true })
				article.comments.forEach(async (c) => {
					let comment = await Comment.findById(c);
					await User.findByIdAndUpdate(comment.author, {$pullAll: {comments: [c]}}, { safe: true, multi: true })
					await comment.remove();
				})

				let path = article.image.substring(21);
				await fs.unlinkSync(`./${path}`)

				await article.remove()
			});
			await category.remove()
			res.status(200).json({ message: 'Category deleted successfully!', category: "deleted" })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	approveArticle: async (req, res, next) => {
		try {
			let id = req.params.id;

			let article = await Article.findById(id);

			article.isApproved = true;
			await article.save();
			res.status(200).json({ message: "News approved!", news: article })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	deleteArticle: async (req, res, next) => {
		try {
			let id = req.params.id;

			let article = await Article.findById(id);
			
			let category = await Category.findByIdAndUpdate(article.category, { $pullAll: { articles: [article._id] } }, { safe: true, multi: true })
			let author = await User.findByIdAndUpdate(article.author, { $pullAll: { articles: [article._id] } }, { safe: true, multi: true })

			article.comments.forEach(async (c) => {
				let comment = await Comment.findById(c);
				await User.findByIdAndUpdate(comment.author, {$pullAll: {comments: [c]}}, { safe: true, multi: true })
				await comment.remove();
			})

			let path = article.image.substring(21);
			await fs.unlinkSync(`./${path}`)

			await article.remove()

			res.status(200).json({ message: 'News deleted successfully!', news: "deleted" })
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	editArticle: async (req,res,next) => {
		try {
			let id = req.params.id;
			let {title, information} = req.body

			let errors = [];

			let news = await Article.find({title: title});
			news.forEach(n => {
				if(n._id != id){
					errors.push("This title already exists!")
				}
			})

			if(title === ''){
				errors.push("Please enter title!")
			}

			if(information === ''){
				errors.push("Please enter information!")
			}

			if(errors.length){
				res.status(400).json({errors})
			}

			let article = await Article.findById(id);
			article.title = title;
			article.bodyText = information;
			await article.save();

			res.status(200).json({message: 'News edited successfully!', news: article})
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	getProfile: async (req,res,next) => {
		try {
			let username = req.params.username;

			let user = await User.find({username: username}).populate('articles').populate('comments')

			res.status(200).json({message: "User successfully fetched!", user: user[0]})
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	},
	
}