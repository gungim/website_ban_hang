const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const newUser = req.body.user;
  const id = uuidv4();

  newUser.id = id;

  try {
    const savedUser = await User.transaction(async (trx) => {
      const savedUser = await User.query(trx).insertAndFetch(newUser);
      return savedUser;
    });

    res.status(200).json({ user: savedUser });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body.user;

  try {
    const user = await User.query().first().where({ username });

    if (user === null || user == undefined) {
      res.status(400).json(`Can't find user with username: ${username}`);
    } else {
      const passwordValid = await user.verifyPassword(password);

      if (passwordValid) {
        const token = jwt.sign(
          { id: user.id, username: user.username },
          process.env.JWT_SECRET,
          {
            expiresIn: '1d',
          }
        );

        res.cookie('token', token, { expiresIn: '1d' });
        delete user.password;
        res.status(200).json({
          user,
          token,
        });
      } else {
        res.status(400).json('Password is wrong');
      }
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

module.exports = { register, login };
