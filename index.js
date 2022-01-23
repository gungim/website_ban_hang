const express = require('express');
require('dotenv').config();
const cors = require('cors');

const userRouter = require('./routers/user_router');
const authRouter = require('./routers/auth_router');
const categoryRouter = require('./routers/category_router');
const productRouter = require('./routers/product_router');
const cartRouter = require('./routers/cart_router');
const orderRouter = require('./routers/order_router');
const voucherRouter = require('./routers/voucher_router');

const app = express();
app.use('/images', express.static(__dirname + '/public/images'));

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/voucher', voucherRouter);

const PORT = 3000 || process.env.PORT;

try {
  app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
  });
} catch (e) {
  throw new Error(e);
}
