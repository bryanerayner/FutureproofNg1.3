define(["require", "exports", 'checkout/_index', 'orders/_index', 'cart/_index'], function (require, exports, checkout, orders, cart) {
    exports.futureStore = {
        checkout: checkout.checkout,
        orders: orders.orders,
        cart: cart.cart
    };
});
//# sourceMappingURL=futureStore.js.map