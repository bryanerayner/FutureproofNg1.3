define(["require", "exports", '_module'], function (require, exports, _module) {
    var CartItemController = (function () {
        function CartItemController($window) {
            CartItemController.$window = $window;
            this.productData = this.productData || null;
            this.shoppingCartCtrl = null;
        }
        CartItemController.prototype.confirmDeletion = function () {
            return CartItemController.$window.confirm('Are you sure you want to remove ' + ((this.productData) ? this.productData.name : 'this product') + ' from your cart?');
        };
        CartItemController.prototype.deleteProductFromCart = function () {
            if (!this.shoppingCartCtrl) {
                return;
            }
            this.shoppingCartCtrl.deleteProduct(this.productData);
        };
        CartItemController.prototype.config = function (shoppingCartCtrl) {
            this.shoppingCartCtrl = shoppingCartCtrl;
        };
        CartItemController.prototype.deleteProduct = function () {
            if (this.confirmDeletion()) {
                this.deleteProductFromCart();
            }
        };
        CartItemController.prototype.incCount = function () {
            this.productData.count += 1;
        };
        CartItemController.prototype.decCount = function () {
            if (this.productData.count > 1 || this.confirmDeletion()) {
                this.productData.count -= 1;
                if (this.productData.count <= 0) {
                    this.deleteProductFromCart();
                }
            }
        };
        CartItemController.prototype.getSubTotal = function () {
            return this.productData.count * this.productData.price;
        };
        CartItemController.$inject = ['$window'];
        return CartItemController;
    })();
    exports.CartItemController = CartItemController;
    _module.ngModule.controller('CartItemController', CartItemController).directive('cartItem', function () {
        return {
            restrict: 'E',
            replace: true,
            require: ['^shoppingCart', 'cartItem'],
            templateUrl: 'cart-item-template.html',
            controller: 'CartItemController as ctrl',
            bindToController: true,
            scope: {
                productData: '='
            },
            link: function (scope, element, attrs, ctrls) {
                var shoppingCartCtrl = ctrls[0];
                var cartItemCtrl = ctrls[1];
                cartItemCtrl.config(shoppingCartCtrl);
            }
        };
    });
});
//# sourceMappingURL=cart-item.js.map