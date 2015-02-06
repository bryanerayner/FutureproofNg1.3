define(["require", "exports", '_module'], function (require, exports, _module) {
    var StoreCheckoutController = (function () {
        function StoreCheckoutController(CartService, OrderService, $window) {
            this.id = _.uniqueId('storeCheckout');
            this.shoppingCart = [];
            this.creditCard = {};
            this.billingAddress = {};
            this.shippingAddress = {};
            this.shippingIsBilling = true;
            StoreCheckoutController.CartService = CartService;
            StoreCheckoutController.OrderService = OrderService;
            StoreCheckoutController.$window = $window;
            this.reset();
            this.getCart();
        }
        StoreCheckoutController.prototype.reset = function () {
            this.shoppingCart = [];
            this.creditCard = {};
            this.billingAddress = {};
            this.shippingAddress = {};
            this.shippingIsBilling = true;
        };
        StoreCheckoutController.prototype.getCart = function () {
            var _this = this;
            StoreCheckoutController.CartService.getCartData().then(function (cartData) {
                _this.shoppingCart = cartData;
            });
        };
        StoreCheckoutController.prototype.checkout = function () {
            var _this = this;
            var successfulCheckout = function (orderConfirmation) {
                StoreCheckoutController.CartService.setCartContents([]);
                StoreCheckoutController.$window.alert('Placed your order. Order Number: ' + orderConfirmation.orderId + ' Tracking Number: ' + orderConfirmation.trackingNumber);
            };
            var failedCheckout = function (failedReason) {
                StoreCheckoutController.$window.alert('Unable to place your order. ' + failedReason);
            };
            var billingAddress = this.billingAddress;
            var shippingAddress = this.shippingIsBilling ? this.billingAddress : this.shippingAddress;
            StoreCheckoutController.OrderService.placeOrder(this.shoppingCart, this.creditCard, billingAddress, shippingAddress).then(successfulCheckout, failedCheckout).finally(function () {
                _this.getCart();
            });
        };
        StoreCheckoutController.$inject = ['CartService', 'OrderService', '$window'];
        return StoreCheckoutController;
    })();
    exports.StoreCheckoutController = StoreCheckoutController;
    _module.ngModule.controller('StoreCheckoutController', StoreCheckoutController).directive('storeCheckout', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'StoreCheckoutController as storeCheckout',
            templateUrl: 'store-checkout-template.html'
        };
    });
});
//# sourceMappingURL=store-checkout.js.map