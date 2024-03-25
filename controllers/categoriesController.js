const Category = require('../models/category');

exports.getCategories = (request, response) => {
	Category.findAll()
		.then(categories => {
			response.status(200).json({ categories: categories });
		})
		.catch(err => console.log(err));
};

exports.getCategory = (request, response) => {
	const categoryId = request.params.categoryId;

	Category.findByPk(categoryId)
		.then(category => {
			if (!category) {
				return response.status(404).json({ message: 'Categoria não encontrada!' })
			}
			response.status(200).json({ category: category });
		})
		.catch(err => console.log(err));
};

exports.createCategory = (request, response) => {
	const name = request.body.name;

	Category.create({
		name: name,
	})
		.then(result => {
			console.log('Categoria criada!');
			response.status(201).json({
				message: 'Categoria criada com sucesso!',
				category: result
			});
		})
		.catch(err => {
			console.log(err)
		});
};

exports.updateCategory = (request, response) => {
	const categoryId = request.params.categoryId ?? '';
	const updatedName = request.body.name ?? '';

	Category.findByPk(categoryId)
		.then(category => {
			if (!category) {
				return response.status(404).json({ message: 'Categoria não encontrada!' });
			};
			if(updatedName) category.name = updatedName;

			return category.save();
		})
		.then(result => {
			response.status(200).json({ message: "Categoria atualizada com sucesso!", category: result });
		})
		.catch(err => console.log(err));
};

exports.deleteCategory = (request, response) => {
	const categoryId = request.params.categoryId;

	Category.findByPk(categoryId)
	.then(category => {
		if (!category) {
			return response.status(404).json({ message: 'Categoria não encontrada!' });
		};
		return Category.destroy({
			where: {
				id: categoryId
			}
		});
	})
	.then(() => {
		response.status(200).json({ message: "Categoria deletada com sucesso!" });
	})
	.catch(err => console.log(err));
}