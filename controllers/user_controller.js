const User = require('../models/User');

const getAllUser = async (req, res) => {
  const name = req.query.name;
  const page = req.query.page || 0;
  const pageSize = parseInt(req.params.limit) || 8;
  const type_sort = req.query.t || 'name';
  const sort = req.query.sort || 'DESC';

  try {
    const query = User.query();
    if (name) {
      query.andWhere('name', 'ILIKE', `%${name}%`);
    }
    query.page(page, pageSize).orderBy(type_sort, sort);

    const user = await query;
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.query().findById(id);

    res.status(200).json({ user });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const update = async (req, res) => {
  const dataFeild = req.body;
  const id = req.params.id;

  try {
    const updatedUser = await User.query().patchAndFetchById(id, dataFeild);

    res.status(200).json({ user: updatedUser });
  } catch (e) {
    res.status(400).json(e);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedUser = await User.query().deleteById(id);

    res.status(200).json({
      message: 'user deleted',
      userId: deletedUser.id,
    });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

module.exports = {
  getAllUser,
  update,
  remove,
  findOne,
};
