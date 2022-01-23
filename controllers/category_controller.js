const Category = require('../models/Category');
const { v4: uuidv4 } = require('uuid');

const findAll = async (req, res) => {
  try {
    const categories = await Category.query();

    res.status(200).json(categories);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;
  let page = req.query.page || 0;
  let pageSize = parseInt(req.query.limit) || 8;

  try {
    const products = await Category.relatedQuery('tags')
      .for(Category.query().findById(id))
      .page(page, pageSize);
    const category = await Category.query().findById(id);

    res.status(200).json({ products, category });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const create = async (req, res) => {
  const { title, description } = req.body;

  if (title.trim() === '' || title === null || title === undefined) {
    res.status(400).json({
      message: 'title is empty',
    });
  }
  try {
    const id = uuidv4();

    const savedCategory = await Category.query().insert({
      id,
      title,
      description,
    });

    res.status(200).json(savedCategory);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedCategpry = await Category.query().deleteById(id);

    res.status(200).json(deletedCategpry);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const addProductTag = async (req, res) => {
  const id = req.params.id;
  const productId = req.params.productId;

  try {
    const a = await Category.relatedQuery('tags').for(id).relate(productId);

    res.status(200).json(a);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const deleteProductTag = async (req, res) => {
  const id = req.params.id;
  const productId = req.params.productId;

  try {
    const a = await Category.relatedQuery('tags')
      .for(id)
      .unrelate()
      .where('id', productId);

    res.status(200).json(a);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

module.exports = {
  findAll,
  create,
  remove,
  findOne,
  addProductTag,
  deleteProductTag,
};
