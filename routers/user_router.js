const router = require('express').Router();
const {
  getAllUser,
  update,
  findOne,
  remove,
} = require('../controllers/user_controller');

router.get('/users', getAllUser);
router
  .patch('/users/:id', update)
  .get('/users/:id', findOne)
  .delete('users/:id', remove);

module.exports = router;
