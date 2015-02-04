///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class ShoppingCartController {
    static $inject = ['CartService'];

    static CartService;

    cartContents;

    constructor(CartService) {
        ShoppingCartController.CartService = CartService;
        this.cartContents = this.cartContents || [];
    }


    deleteProduct(productData) {
        _.remove(this.cartContents, {sku: productData ? productData.sku : null});
    }

    getCartSubTotal() {
        return ShoppingCartController.CartService.getCartTotal(this.cartContents);
    }

    getCartTaxes() {
        return ShoppingCartController.CartService.getTaxes(this.getCartSubTotal());
    }

    getTotalPrice() {
        return this.getCartSubTotal() + this.getCartTaxes();
    }

    emptyCart() {
        this.cartContents = [];
    }
}

_module.ngModule.controller('ShoppingCartController', ShoppingCartController)
    .directive('shoppingCart', function(){
        return {
            restrict:'E',
            replace:true,
            templateUrl:'shopping-cart-template.html',
            controller:'ShoppingCartController as ctrl',
            bindToController:true,
            scope:{
                cartContents:'='
            }
        };
    });