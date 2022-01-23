const validator = require('../helpers/validate');

const registerValidate = (req, res, next) => {
  const validationRule = {
    email: 'required|email',
    username: 'required|string',
    name: 'required|string',
    phone: 'required|string',
    password: 'required|min:6|string',
  };
  validator(req.body.user, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err,
      });
    } else {
      next();
    }
  });
};

const loginValidate = (req, res, next) => {
  const validationRule = {
    username: 'required|string',
    password: 'required|string|min:6',
  };
  validator(req.body.user, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(421).send({
        success: false,
        message: 'Validation failed',
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = {
  registerValidate,
  loginValidate,
};
