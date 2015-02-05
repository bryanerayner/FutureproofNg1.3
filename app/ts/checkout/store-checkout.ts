///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class StoreCheckoutController {
    static $inject = ['CartService', 'OrderService', '$window'];

    static CartService;
    static OrderService;
    static $window;

    id = _.uniqueId('storeCheckout');

    shoppingCart = [];
    creditCard = {};
    billingAddress = {};
    shippingAddress = {};
    shippingIsBilling = true;


    constructor(CartService, OrderService, $window) {
        StoreCheckoutController.CartService = CartService;
        StoreCheckoutController.OrderService = OrderService;
        StoreCheckoutController.$window = $window;

        this.reset();
        this.getCart();
    }

    reset () {
        this.shoppingCart = [];
        this.creditCard = {};
        this.billingAddress = {};
        this.shippingAddress = {};
        this.shippingIsBilling = true;
    }

    getCart() {
        StoreCheckoutController.CartService.getCartData().then((cartData)=> {
            this.shoppingCart = cartData;
        });
    }

    checkout() {

        var successfulCheckout = function (orderConfirmation) {
            StoreCheckoutController.CartService.setCartContents([]);
            StoreCheckoutController.$window.alert('Placed your order. Order Number: ' +
            orderConfirmation.orderId +
            ' Tracking Number: ' +
            orderConfirmation.trackingNumber);
        };

        var failedCheckout = function (failedReason) {
            StoreCheckoutController.$window.alert('Unable to place your order. ' + failedReason);
        };

        var billingAddress = this.billingAddress;
        var shippingAddress = this.shippingIsBilling ? this.billingAddress : this.shippingAddress;

        StoreCheckoutController.OrderService.placeOrder(this.shoppingCart, this.creditCard, billingAddress, shippingAddress)
            .then(successfulCheckout, failedCheckout)
            .finally(()=> {
                this.getCart();
            });

    }
}
_module.ngModule.controller('StoreCheckoutController', StoreCheckoutController)
    .directive('storeCheckout', function(){
        return {
            restrict:'E',
            replace:true,
            controller:'StoreCheckoutController as storeCheckout',
            templateUrl:'store-checkout-template.html'
        }
    })
