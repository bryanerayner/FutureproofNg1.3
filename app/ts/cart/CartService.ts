///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class CartService {
    static $inject = ['$q', '$timeout', '$document'];

    static $q;
    static $timeout;
    static $document;

    private loadedCartData = false;
    private taxRate = 0.13;
    private cartContents = [];

    constructor($q, $timeout, $document) {
        CartService.$q = $q;
        CartService.$timeout = $timeout;
        CartService.$document = $document;

        this.loadCartData();
    }

    loadCartData() {
        var $cartContents = angular.element(CartService.$document[0].querySelector("#cartContents"));
        var data = JSON.parse($cartContents.html());
        if (data && data.cartContents) {
            this.cartContents = data.cartContents;
            this.loadedCartData = true;
        }
    }

    getCartData() {
        return CartService.$q(function (resolve, reject) {
            CartService.$timeout(()=> {
                if (!this.loadedCartData) {
                    try {
                        this.loadCartData();
                    } catch (e) {
                        reject('Error loading shopping cart');
                    }
                }
                return resolve(this.cartContents);
            });
        });
    }

    /**
     * Set the contents of the shopping cart
     * @param cart The shopping cart to set
     */
    setCartContents(cart) {
        this.cartContents = cart;
    }

    /**
     * Calculate the total value of a shopping cart
     * @param cart The shopping cart to calculate the cost of.
     */
    getCartTotal(cart) {
        return _.reduce(cart, function (sum, item) {
            return sum + (item.price * item.count);
        }, 0);
    }

    /**
     * Determine how much tax applies to a cost
     * @param total The cost, pre-tax.
     */
    getTaxes(total) {
        return total * (this.taxRate);
    }

    /**
     * Get the tax rate
     */
    getTaxPercentage() {
        return this.taxRate;
    }

}
_module.ngModule.service('CartService', CartService);

