///<reference path="../../../typings/tsd.d.ts"/>

import _module = require('_module');
import cartItem = require('cart-item');
import cartService = require('CartService');
import shoppingCart = require('shopping-cart');

export var cart = {
    ngModule:_module.ngModule,
    CartItemController: cartItem.CartItemController,
    CartService:cartService.CartService,
    ShoppingCartController: shoppingCart.ShoppingCartController
};