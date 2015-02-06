///<reference path="../../../typings/tsd.d.ts"/>
define(["require", "exports", '_module', 'cart-item', 'CartService', 'shopping-cart'], function (require, exports, _module, cartItem, cartService, shoppingCart) {
    exports.cart = {
        ngModule: _module.ngModule,
        CartItemController: cartItem.CartItemController,
        CartService: cartService.CartService,
        ShoppingCartController: shoppingCart.ShoppingCartController
    };
});
//# sourceMappingURL=_index.js.map