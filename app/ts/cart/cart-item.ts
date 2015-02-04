///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class CartItemController {
    static $inject = ['$window'];

    static $window;

    productData;
    shoppingCartCtrl;

    constructor($window) {
        CartItemController.$window = $window;

        this.productData = this.productData || null;
        this.shoppingCartCtrl = null;
    }


    private confirmDeletion() {
        return CartItemController.$window.confirm(
            'Are you sure you want to remove ' +
            ((this.productData) ? this.productData.name : 'this product') +
            ' from your cart?');
    }

    private deleteProductFromCart() {
        if (!this.shoppingCartCtrl) {
            return;
        }
        this.shoppingCartCtrl.deleteProduct(this.productData);
    }

    config(shoppingCartCtrl) {
        this.shoppingCartCtrl = shoppingCartCtrl;
    }

    deleteProduct() {
        if (this.confirmDeletion()) {
            this.deleteProductFromCart();
        }
    }


    incCount() {
        this.productData.count += 1;
    }

    decCount() {
        if (this.productData.count > 1 || this.confirmDeletion()) {
            this.productData.count -= 1;
            if (this.productData.count <= 0) {
                this.deleteProductFromCart();
            }
        }
    }

    getSubTotal() {
        return this.productData.count * this.productData.price;
    }
}

_module.ngModule.controller('CartItemController', CartItemController)
    .directive('cartItem', function(){
        return {
            restrict:'E',
            replace:true,
            require:['^shoppingCart', 'cartItem'],
            templateUrl:'cart-item-template.html',
            controller:'CartItemController as ctrl',
            bindToController:true,
            scope:{
                productData:'='
            },
            link:function(scope, element, attrs, ctrls){
                var shoppingCartCtrl = ctrls[0];
                var cartItemCtrl = ctrls[1];
                cartItemCtrl.config(shoppingCartCtrl);
            }
        }
    });