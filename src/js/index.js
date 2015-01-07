/**
 * Created by bryanerayner on 15-01-06.
 */


var ngModule = angular.module('futureStore', [])
    .service('FutureStoreApi', ['$q', function($q){
        this.newOrder = function(inventory, creditCardData, billingAddress, shippingAddress){
            return $q(function(resolve, reject){
                resolve({
                    orderId: _.uniqueId('order'),
                    trackingNumber: _.uniqueId('shipping')
                });
            });
        };
    }])
    .service('ShoppingCartService', ['$q', '$timeout', '$document', 'FutureStoreApi', function($q, $timeout, $document, FutureStoreApi){

        var loadedCartData = false;

        var cartContents = [];

        this.loadCartData = function(){
            var $cartContents = angular.element($document[0].querySelector("cartContents"));
            cartContents = JSON.parse($cartContents.html());
            loadedCartData = true;
        };

        this.getCartData = function() {
            return $q(function (resolve, reject) {
                $timeout(function () {
                    if (!loadedCartData){
                        this.loadCartData();
                    }
                    resolve(cartContents);
                });
            });
        };

        this.setCartContents = function(cart) {
            cartContents = cart;
        };

        this.validateCreditCard = function(creditCardData){
            var ccNumber = creditCardData.number;
            ccNumber = ccNumber.replaceAll(/[\-\s]*/gi, '');

            if (ccNumber.length < 16) {
                throw new Error('Card Number Invalid');
            }

            var ccv = creditCardData.ccv.trim();
            if (ccv.length < 3){
                throw new Error('Invalid CCV');
            }

            var month = creditCardData.expiryMonth;
            if (month < 0 || month > 12){
                throw new Error('Invalid Expiry Month');
            }

            var year = creditCardData.expiryYear;
            if (year < 2015) {
                throw new Error('Card is expired');
            }

            var name = creditCardData.cardholderName.trim();
            if (!name.length){
                throw new Error('Invalid Cardholder Name');
            }

            return {
                number:ccNumber,
                ccv: ccv,
                month:month,
                year:year,
                cardholderName:name
            };
        };

        this.validateAddress = function(address){
            if (!address.name) {
                throw new Error('Name cannot be blank');
            }
            if (!address.address1) {
                throw new Error('Address 1 cannot be blank');
            }
            if (!address.city) {
                throw new Error('City cannot be blank');
            }
            if (!address.state) {
                throw new Error('State cannot be blank');
            }
            if (!address.country) {
                throw new Error('Country cannot be blank');
            }
            if (!address.zipPc) {
                throw new Error('Zip/Postal Code cannot be blank');
            }
            if (!address.address2) { // Default the second line to blank
                address.address2 = '';
            }
            return address;
        };

        this.checkout = function (creditCardData, billingAddress, shippingAddress) {
            var _this = this;

            return $q(function(resolve, reject){
                var ccData, bAddress, sAddress;
                // Validate the credit card
                try {
                    ccData = _this.validateCreditCard(creditCardData);

                } catch (e) {
                    reject('Invalid Credit Card');
                }

                // Validate the addresses
                try {
                    bAddress = _this.validateAddress(billingAddress);
                } catch (e) {
                    reject('Invalid Billing Address');
                }

                try {
                    sAddress = _this.validateAddress(shippingAddress);
                } catch (e) {
                    reject('Invalid Shipping Address');
                }

                // Make the purchase. If it's successful, empty the shopping cart.
                FutureStoreApi.makePurchase(inventory, ccData, bAddress, sAddress).then(function (confirmation) {
                    _this.setCartContents([]);
                    resolve(confirmation);
                }, reject);
            });
        };

        this.loadCartData();
    }])
    .controller('FutureStoreCheckoutController', ['ShoppingCartService', '$scope', function(ShoppingCartService, $scope){
        var _this = this;

        this.reset = function() {
            _this.shoppingCart = [];
            _this.creditCard = {};
            _this.billingAddress = {};
            _this.shippingAddress = {};
        };

        this.syncCartData = function(){
            ShoppingCartService.getCartData().then(function(cartData){
                _this.shoppingCart = cartData;
            });
        };


        $scope.$watchCollection(function(){
            return _this.shoppingCart;
        }, function(){
            ShoppingCartService.setCartContents(_this.shoppingCart);
        });


        this.checkout = function() {

            var successfulCheckout = function (orderConfirmation) {

            };

            var failedCheckout = function (failedReason) {

            };

            ShoppingCartService.setCartContents(_this.shoppingCart);
            ShoppingCartService.checkout(_this.creditCard,
                                         _this.billingAddress,
                                         _this.shippingAddress)
                                .then(successfulCheckout, failedCheckout)
                                .finally(function(){
                                    _this.syncCartData();
                                });
        };

        this.reset();
        this.syncCartData();

    }])
    .controller('ShoppingCartController', function(){
        this.cartContents = this.cartContents || [];

        
    })
    .directive('shoppingCart', function(){
        return {
            restrict:'E',
            templateUrl:'shopping-cart-template.html',
            controller:'ShoppingCartController as ctrl',
            bindToController:true,
            scope:{
                cartContents:'='
            }
        };
    })
    .controller('CartItemController', function(){

    })
    .directive('cartItem', function(){
        return {
            restrict:'E',
            require:'^shoppingCart',
            templateUrl:'cart-item-template.html',
            controller:'CartItemController as ctrl',
            bindToController:true,
            scope:{
                productData:'='
            }
        }
    });