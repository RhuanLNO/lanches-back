const Restaurant = require('../models/restaurant');
const Category = require('../models/category');
const RestaurantCategory = require('../models/restaurantCategory')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

exports.getRestaurants = (request, response) => {
	const categoryFilter = request.query.category;

	categoryFilter
		?
		Restaurant.findAll({
			include: [{
				model: Category,
				order: [
					[Category, 'id', 'ASC']
				],
				where: { id: categoryFilter },
				through: {
					attributes: []
				}
			}]
		})
			.then(restaurants => {
				response.status(200).json({ restaurants: restaurants });
			})
			.catch(err => console.log(err))
	:
	Restaurant.findAll({
		include: [{
			model: Category,
			order: [
				[Category, 'id', 'ASC']
			],
			through: {
				attributes: []
			}
		}]
	})
		.then(restaurants => {
			response.status(200).json({ restaurants: restaurants });
		})
		.catch(err => console.log(err));
};

exports.getRestaurant = (request, response) => {
	const restaurantId = request.params.restaurantId;

	Restaurant.findByPk(restaurantId)
		.then(restaurant => {
			if (!restaurant) {
				return response.status(404).json({ message: 'Restaurante não encontrado!' })
			}
			response.status(200).json({ restaurant: restaurant });
		})
		.catch(err => console.log(err));
};

exports.createRestaurant = async (request, response) => {
	const token = request.headers.authorization?.split(' ')[1];
	const name = request.body.name;
	const businessHours = request.body.businessHours;
	const phone = request.body.phone;
	const instagram = request.body.instagram;
	const categories = request.body.categories ?? [];

	if (!token) {
		return response.status(401).json({ message: 'Não autorizado.' });
	};

	jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
		if (err) {
			response.status(403).send('Token inválido.');
			return;
		}
	});

	const categoriesListRaw = await Category.findAll();
	const categoriesList = categoriesListRaw.map(category => category?.dataValues?.id);
	const validCategories = categories.every(values => categoriesList.includes(values));

	if (!name) {
		return response.status(400).json({
			message: 'Nome é obrigatório!',
		})
	};

	if (!Array.isArray(categories)) {
		return response.status(400).json({
			message: 'Erro de categorias: formato inválido',
		})
	};

	if (categories.length === 0) {
		return response.status(400).json({
			message: 'É necessário pelo menos uma categoria',
		})
	};

	if (categories.length > 0 && !validCategories) {
		return response.status(400).json({
			message: 'Categorias inválidas',
		})
	};

	if (categories.length > 0 && validCategories) {
		const createdRestaurant = await Restaurant.create({
			name: name,
			businessHours: businessHours,
			phone: phone,
			instagram: instagram,
		});
		await createdRestaurant.addCategory(categories);
		return response.status(201).json({
			message: 'Restaurante criado com sucesso!',
			restaurant: createdRestaurant
		})
	};
};

exports.updateRestaurant = async (request, response) => {
	const token = request.headers.authorization?.split(' ')[1];
	const restaurantId = request.params.restaurantId;
	const updatedName = request.body.name ?? null;
	const updatedBusinessHours = request.body.businessHours ?? null;
	const updatedPhone = request.body.phone ?? null;
	const updatedInstagram = request.body.instagram ?? null;
	const updatedCategories = request.body.categories ?? null;
	const updatedPhoto = request.body.photo ?? null

	if (!token) {
		return response.status(401).json({ message: 'Não autorizado.' });
	};

	jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
		if (err) {
			response.status(403).send('Token inválido.');
			return;
		}
	});

	const categoriesListRaw = await Category.findAll();
	const categoriesList = categoriesListRaw.map(category => category?.dataValues?.id);
	const validCategories = updatedCategories !== null ? updatedCategories.every(values => categoriesList.includes(values)) : false;

	const queryResult = await Restaurant.findByPk(restaurantId);

	if (!queryResult) {
		return response.status(404).json({ message: 'Restaurante não encontrado!' });
	};

	if (updatedCategories && !validCategories) {
		return response.status(400).json({
			message: 'Categorias inválidas',
		});
	};

	const objToEdit = {
		name: updatedName,
		businessHours: updatedBusinessHours,
		phone: updatedPhone,
		instagram: updatedInstagram,
		photo: updatedPhoto
	};

	Object.keys(objToEdit).forEach(key => {
		if (objToEdit[key] === null) {
			delete objToEdit[key];
		};
	});

	const updatedRestaurant = await Restaurant.update(objToEdit, {
		where: {
			id: restaurantId
		},
		returning: true,
		plain: true
	});
	if (updatedCategories) {
		await queryResult.setCategories(updatedCategories);
		const restaurantObj = updatedRestaurant[1];
		const categories = await queryResult.getCategories({ joinTableAttributes: [] });
		restaurantObj.dataValues.categories = await categories.map(category => category?.dataValues);
		return response.status(200).json({
			message: 'Restaurante atualizado com sucesso!',
			restaurant: restaurantObj
		});
	};
	const restaurantObj = updatedRestaurant[1];
	const categories = await queryResult.getCategories({ joinTableAttributes: [] });
	restaurantObj.dataValues.categories = await categories.map(category => category?.dataValues);
	return response.status(200).json({
		message: 'Restaurante atualizado com sucesso!',
		restaurant: restaurantObj
	});
};

exports.deleteRestaurant = (request, response) => {
	const restaurantId = request.params.restaurantId;
	const token = request.headers.authorization?.split(' ')[1];

	if (!token) {
		return response.status(401).json({ message: 'Não autorizado.' });
	};

	jwt.verify(token, process.env.AUTH_SECRET, (err, decoded) => {
		if (err) {
			response.status(403).send('Token inválido.');
			return;
		}
	});

	Restaurant.findByPk(restaurantId)
		.then(restaurant => {
			if (!restaurant) {
				return response.status(404).json({ message: 'Restaurante não encontrado!' });
			};
			return Restaurant.destroy({
				where: {
					id: restaurantId
				}
			});
		})
		.then(() => {
			response.status(200).json({ message: "Restaurante deletado com sucesso!" });
		})
		.catch(err => console.log(err));
}