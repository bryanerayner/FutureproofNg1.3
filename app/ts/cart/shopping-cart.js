define(["require", "exports", '_module'], function (require, exports, _module) {
    var ShoppingCartController = (function () {
        function ShoppingCartController(CartService) {
            ShoppingCartController.CartService = CartService;
            this.cartContents = this.cartContents || [];
        }
        ShoppingCartController.prototype.deleteProduct = function (productData) {
            _.remove(this.cartContents, { sku: productData ? productData.sku : null });
        };
        ShoppingCartController.prototype.getCartSubTotal = function () {
            return ShoppingCartController.CartService.getCartTotal(this.cartContents);
        };
        ShoppingCartController.prototype.getCartTaxes = function () {
            return ShoppingCartController.CartService.getTaxes(this.getCartSubTotal());
        };
        ShoppingCartController.prototype.getTotalPrice = function () {
            return this.getCartSubTotal() + this.getCartTaxes();
        };
        ShoppingCartController.prototype.emptyCart = function () {
            this.cartContents = [];
        };
        ShoppingCartController.$inject = ['CartService'];
        return ShoppingCartController;
    })();
    exports.ShoppingCartController = ShoppingCartController;
    _module.ngModule.controller('ShoppingCartController', ShoppingCartController).directive('shoppingCart', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'shopping-cart-template.html',
            controller: 'ShoppingCartController as ctrl',
            bindToController: true,
            scope: {
                cartContents: '='
            }
        };
    });
});
//# sourceMappingURL=shopping-cart.js.map