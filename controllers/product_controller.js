const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');
const ProductImage = require('../models/ProductImage');

const findById = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.query().findById(id);

    res.status(200).json({
      message: 'Product created',
      product,
    });
  } catch (e) {
    /* handle error */
    res.status(404).json({
      e,
    });
  }
};

const findAll = async (req, res) => {
  const page = req.query.page || 0;
  const pageSize = parseInt(req.params.limit) || 8;
  const name = req.query.name;
  const min = req.query.min;
  const max = req.query.max;
  const type_sort = req.query.t || 'title';
  const sort = req.query.sort || 'DESC';

  try {
    const query = Product.query();

    if (name) {
      query.andWhere('title', 'ILIKE', `%${name}%`);
    }
    if (min) {
      query.andWhere('price', '>', min);
    }
    if (max) {
      query.andWhere('price', '<', max);
    }

    query.page(page, pageSize).orderBy(type_sort, sort);
    const products = await query;

    res.status(200).json(products);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const create = async (req, res) => {
  const {
    title,
    price,
    discount,
    description,
    published_at,
    start_at,
    end_at,
    quantity,
    images,
  } = req.body;

  const id = uuidv4();

  try {
    const savedProduct = await Product.query().insertAndFetch({
      id,
      title,
      price,
      discount,
      description,
      published_at,
      start_at,
      end_at,
      quantity,
    });

    if (savedProduct) {
      const imageArr = await Promise.all(
        images.map(async (image) => {
          return ProductImage.query()
            .insert({
              title: image,
              product_id: id,
            })
            .returning('*');
        })
      );

      res.status(200).json({
        message: 'Saved product',
        product: savedProduct,
        images: imageArr,
      });
    }

    res.status(200).json({ message: 'Saved product', product: savedProduct });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const update = async (req, res) => {
  const {
    title,
    price,
    discount,
    description,
    published_at,
    start_at,
    end_at,
    quantity,
  } = req.body;
  const id = req.params.id;

  try {
    const savedProduct = await Product.query().patchAndFetchById(id, {
      title,
      price,
      discount,
      description,
      published_at,
      start_at,
      end_at,
      quantity,
    });

    res.status(200).json({ msessage: 'Saved product', product: savedProduct });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const addImage = async (req, res) => {
  const product_id = req.params.id;
  const images = req.body.images;

  try {
    const product = await Product.query().findById(product_id);

    if (product) {
      const imageArr = await Promise.all(
        images.map(async (image) => {
          return ProductImage.query()
            .insert({
              title: image,
              product_id: id,
            })
            .returning('*');
        })
      );

      res.status(200).json({ product, images: imageArr });
    }
  } catch (e) {
    /* handle error */
    res.status(404).json({
      e,
    });
  }
};
const deleteImage = async (req, res) => {
  const image_id = req.query.id;
  const product_id = req.params.id;

  try {
    const imageProduct = await ProductImage.query()
      .where('title', '=', image_id)
      .andWhere('product_id', '=', id);

    if (imageProduct) {
      const imgDeleted = await ProductImage.query().where(
        'title',
        '=',
        image_id
      );

      res.status(200).json({ image: imgDeleted });
    } else {
      res.status(404).json({ msg: 'ID not found or invalid' });
    }
  } catch (e) {
    /* handle error */
    res.status(404).json({
      e,
    });
  }
};

module.exports = {
  findById,
  create,
  update,
  findAll,
  addImage,
  deleteImage,
};
