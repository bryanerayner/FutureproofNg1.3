define(["require", "exports", '_module'], function (require, exports, _module) {
    var CartService = (function () {
        function CartService($q, $timeout, $document) {
            this.loadedCartData = false;
            this.taxRate = 0.13;
            this.cartContents = [];
            CartService.$q = $q;
            CartService.$timeout = $timeout;
            CartService.$document = $document;
            this.loadCartData();
        }
        CartService.prototype.loadCartData = function () {
            var $cartContents = angular.element(CartService.$document[0].querySelector("#cartContents"));
            var data = JSON.parse($cartContents.html());
            if (data && data.cartContents) {
                this.cartContents = data.cartContents;
                this.loadedCartData = true;
            }
        };
        CartService.prototype.getCartData = function () {
            return CartService.$q(function (resolve, reject) {
                var _this = this;
                CartService.$timeout(function () {
                    if (!_this.loadedCartData) {
                        try {
                            _this.loadCartData();
                        }
                        catch (e) {
                            reject('Error loading shopping cart');
                        }
                    }
                    return resolve(_this.cartContents);
                });
            });
        };
        /**
         * Set the contents of the shopping cart
         * @param cart The shopping cart to set
         */
        CartService.prototype.setCartContents = function (cart) {
            this.cartContents = cart;
        };
        /**
         * Calculate the total value of a shopping cart
         * @param cart The shopping cart to calculate the cost of.
         */
        CartService.prototype.getCartTotal = function (cart) {
            return _.reduce(cart, function (sum, item) {
                return sum + (item.price * item.count);
            }, 0);
        };
        /**
         * Determine how much tax applies to a cost
         * @param total The cost, pre-tax.
         */
        CartService.prototype.getTaxes = function (total) {
            return total * (this.taxRate);
        };
        /**
         * Get the tax rate
         */
        CartService.prototype.getTaxPercentage = function () {
            return this.taxRate;
        };
        CartService.$inject = ['$q', '$timeout', '$document'];
        return CartService;
    })();
    exports.CartService = CartService;
    _module.ngModule.service('CartService', CartService);
});
//# sourceMappingURL=CartService.js.map