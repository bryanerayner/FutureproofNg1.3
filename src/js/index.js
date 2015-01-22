/**
 * Created by bryanerayner on 15-01-06.
 */


var ShoppingCart = angular.module('futureStore', [])
    .service('OrderService', ['$q', function($q){


        this.placeOrder = function(products, creditCardData, billingAddress, shippingAddress){
            return $q(function(resolve, reject){
                resolve({
                    orderId: _.uniqueId('order'),
                    trackingNumber: _.uniqueId('shipping')
                });
            });
        };
        return this;
    }])
    .service('ShoppingCart', ['$q', '$timeout', '$document', 'OrderService', function($q, $timeout, $document, OrderService){
        var _this = this;
        var loadedCartData = false;
        var taxRate = 0.13;
        var cartContents = [];

        this.loadCartData = function(){
            var $cartContents = angular.element($document[0].querySelector("#cartContents"));
            var data = JSON.parse($cartContents.html());
            if (data && data.cartContents) {
                cartContents = data.cartContents;
                loadedCartData = true;
            }
        };

        this.getCartData = function() {
            return $q(function (resolve, reject) {
                $timeout(function () {
                    if (!loadedCartData){
                        try {
                            _this.loadCartData();
                        }catch (e){
                            return reject('Error loading shopping cart');
                        }
                    }
                    return resolve(cartContents);
                });
            });
        };

        /**
         * Set the contents of the shopping cart
         * @param cart The shopping cart to set
         */
        this.setCartContents = function(cart) {
            cartContents = cart;
        };

        /**
         * Calculate the total value of a shopping cart
         * @param cart The shopping cart to calculate the cost of.
         */
        this.getCartTotal = function(cart){
            return _.reduce(cart, function(sum, item){
                return sum + (item.price * item.count);
            }, 0);
        };

        /**
         * Determine how much tax applies to a cost
         * @param total The cost, pre-tax.
         */
        this.getTaxes = function (total) {
            return total * (taxRate);
        };

        /**
         * Get the tax rate
         */
        this.getTaxPercentage = function () {
            return taxRate;
        };


        this.loadCartData();

        return this;
    }])
    .service('PostOffice', ['$q', function(){

        /**
         * Validate an address
         * @param address The address to validate.
         */
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
    }])
    .service('BankTeller', ['$q', function($q){



        this.validateNumber = function(cardNumber){
            return $q(function(resolve, reject) {
                var ccNumber = cardNumber;
                ccNumber = ccNumber.replaceAll(/[\-\s]*/gi, '');

                if (ccNumber.length < 16) {
                    return reject('Card Number Invalid');
                }
                resolve(ccNumber);
            });
        };

        this.validateCcv = function(ccv){
            return $q(function(resolve, reject) {
                var ccv = ccv.trim();
                if (ccv.length < 3){
                    return reject('Invalid CCV');
                }
                resolve(ccv);
            });
        };

        this.validateCreditCard = function(creditCardData){

            var numberValidation = $q(function (resolve, reject) {
                var month = creditCardData.expiryMonth;
                if (month < 0 || month > 12){
                    return reject('Invalid Expiry Month');
                }

                var year = creditCardData.expiryYear;
                if (year < 2015) {
                    return reject('Card is expired');
                }


                resolve({
                    month:month,
                    year:year
                });
            });

            var nameValidation = $q(function(resolve, reject){

                var name = creditCardData.cardholderName.trim();
                if (!name.length){
                    return reject('Invalid Cardholder Name');
                }
                resolve(name);
            });


            return $q.all([
                nameValidation,
                this.validateNumber(creditCardData.number),
                this.validateCcv(creditCardData.ccv),
                numberValidation
            ]).then(function(name, number, ccv, monthAndYear) {
                return {
                number:number,
                ccv: ccv,
                month:monthAndYear.month,
                year:monthAndYear.year,
                cardholderName:name
            }});
        };

    }])
    .controller('StoreCheckoutController', ['ShoppingCart', function(ShoppingCartService){
        var _this = this;
        this.id = _.uniqueId('storeCheckout');

        this.reset = function() {
            this.shoppingCart = [];
            this.creditCard = {};
            this.billingAddress = {};
            this.shippingAddress = {};
            this.shippingIsBilling = true;
        };

        this.syncCartData = function(){
            ShoppingCartService.getCartData().then(function(cartData){
                _this.shoppingCart = cartData;
            });
        };




        this.checkout = function() {

            var successfulCheckout = function (orderConfirmation) {
                alert('Placed your order. Order Number: ' + orderConfirmation.orderId + ' Tracking Number: ' + orderConfirmation.trackingNumber);
            };

            var failedCheckout = function (failedReason) {
                alert('Unable to place your order. ' + failedReason);
            };

            var billingAddress = _this.billingAddress;
            var shippingAddress = _this.shippingIsBilling ? _this.billingAddress : _this.shippingAddress;



            ShoppingCartService.setCartContents(_this.shoppingCart);
            ShoppingCartService.checkout(_this.creditCard,
                                         billingAddress,
                                         shippingAddress)
                                .then(successfulCheckout, failedCheckout)
                                .finally(function(){
                                    _this.syncCartData();
                                });
        };

        this.reset();
        this.syncCartData();

    }])
    .directive('storeCheckout', function(){
        return {
            restrict:'E',
            replace:true,
            controller:'StoreCheckoutController as ctrl',
            templateUrl:'store-checkout-template.html'
        }
    })
    .controller('ShoppingCartController', ['ShoppingCart', function(ShoppingCartService){
        this.cartContents = this.cartContents || [];

        this.deleteProduct = function (productData) {
            _.remove(this.cartContents, {sku:productData ? productData.sku : null});
        };

        this.getCartSubTotal = function(){
            return ShoppingCartService.getCartTotal(this.cartContents);
        };

        this.getCartTaxes = function(){
            return ShoppingCartService.getTaxes(this.getCartSubTotal());
        };

        this.getTotalPrice = function(){
            return this.getCartSubTotal() + this.getCartTaxes();
        };

        this.emptyCart = function(){
            this.cartContents = [];
        };
    }])
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
    })
    .controller('CartItemController', ['$window', function($window){
        var _this = this;
        this.productData = this.productData || null;
        this.shoppingCartCtrl = null;

        var confirmDeletion = function () {
            return $window.confirm(
                'Are you sure you want to remove ' +
                ((_this.productData) ? _this.productData.name : 'this product') +
                ' from your cart?');
        };

        var deleteProductFromCart = function (){
            if (!_this.shoppingCartCtrl) {
                return;
            }
            _this.shoppingCartCtrl.deleteProduct(_this.productData);
        }

        this.config = function(shoppingCartCtrl){
            this.shoppingCartCtrl = shoppingCartCtrl;
        };

        this.deleteProduct = function () {
            if (confirmDeletion()) {
                deleteProductFromCart();
            }
        };



        this.incCount = function() {
            this.productData.count += 1;
        };

        this.decCount = function() {
            if (this.productData.count > 1 || confirmDeletion()) {
                this.productData.count -= 1;
                if (this.productData.count <= 0) {
                    deleteProductFromCart();
                }
            }
        };

        this.getSubTotal = function() {
            return this.productData.count * this.productData.price;
        };

    }])
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
    })
    .controller('CreditCardEntryController', ['$scope', 'BankTeller', function($scope, BankTeller){
        var _this = this;
        var ngModelCtrl = null;
        this.id = _.uniqueId('ccE');
        this.number = '';
        this.name = '';
        this.ccv = '';
        this.expiryMonth = null;
        this.expiryYear = null;

        // Options for the expiry month
        this.expiryMonthOptions = [
            {label:'Jan', value:1},
            {label:'Feb', value:2},
            {label:'Mar', value:3},
            {label:'Apr', value:4},
            {label:'May', value:5},
            {label:'Jun', value:6},
            {label:'Jul', value:7},
            {label:'Aug', value:8},
            {label:'Sept', value:9},
            {label:'Oct', value:10},
            {label:'Nov', value:11},
            {label:'Dec', value:12}
        ];
        // Options for the expiry year
        this.expiryYearOptions = [
            {label:'2015', value: 15},
            {label:'2016', value: 16},
            {label:'2017', value: 17},
            {label:'2018', value: 18},
            {label:'2019', value: 19},
            {label:'2020', value: 20},
            {label:'2021', value: 21},
            {label:'2022', value: 22},
            {label:'2023', value: 23}];

        this.config = function(ngModelController) {
            ngModelCtrl = ngModelController;
            ngModelCtrl.$render = function(){return _this.$render();};
            ngModelCtrl.$asyncValidators.entireCard = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                return BankTeller.validateCreditCard(value);
            };

        };

        this.pushToModel = function () {
            ngModelCtrl.$setViewValue({
                number:this.number,
                name:this.name,
                ccv:this.ccv,
                expiryMonth:this.expiryMonth,
                expiryYear:this.expiryYear
            });
        };

        $scope.$watchGroup([
            function () { return _this.number;},
            function () { return _this.name;},
            function () { return _this.ccv;},
            function () { return _this.expiryMonth;},
            function () { return _this.expiryYear;}],
            function(){
               _this.pushToModel();
            });


    }])
    .directive('creditCardEntry', function () {
        return {
            restrict:'E',
            replace:true,
            require:['creditCardEntry', 'ngModel'],
            templateUrl:'credit-card-entry-template.html',
            controller:'CreditCardEntryController as ctrl',
            scope:true,
            bindToController:true,
            link:function(scope, element, attrs, ctrls){
                var creditCardEntryCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                creditCardEntryCtrl.config(ngModelCtrl);
            }
        };
    })
    .controller('AddressEntryController', function(){
        var ngModelCtrl = null;
        this.id= _.uniqueId('addressEntry');
        this.name = '';
        this.address1 = '';
        this.address2 = '';
        this.city = '';
        this.state = '';
        this.country = '';
        this.zipPc = '';

        this.config = function(ngModelController) {
            ngModelCtrl = ngModelController;
        };


    })
    .directive('addressEntry', function () {
        return {
            restrict:'E',
            replace:true,
            require:['addressEntry', 'ngModel'],
            templateUrl:'address-entry-template.html',
            controller:'AddressEntryController as ctrl',
            scope:true,
            bindToController:true,
            link:function(scope, element, attrs, ctrls){
                var addressEntryCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                addressEntryCtrl.config(ngModelCtrl);
            }
        };
    });