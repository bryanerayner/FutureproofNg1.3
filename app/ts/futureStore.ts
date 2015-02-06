import checkout = require('checkout/_index');
import orders = require('orders/_index');
import cart = require('cart/_index');

export var futureStore = {
    checkout:checkout.checkout,
    orders: orders.orders,
    cart: cart.cart
};