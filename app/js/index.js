/**
 * Created by bryanerayner on 15-01-06.
 */


var ShoppingCart = angular.module('futureStore', [
    'futureStore.cart',
    'futureStore.orders',
    'futureStore.checkout'
]);


angular.module('futureStore.orders', ['ngMessages'])
    .service('OrderService', ['$q', 'PostOffice', 'BankTeller', function($q, PostOffice, BankTeller){


        this.placeOrder = function(products, creditCardData, billingAddress, shippingAddress){
            return $q(function(resolve, reject) {
                $q.all([
                    BankTeller.validateCreditCard(creditCardData),
                    PostOffice.validateAddress(billingAddress),
                    PostOffice.validateAddress(shippingAddress)
                ]).then(function () {
                    resolve({
                        orderId: _.uniqueId('order'),
                        trackingNumber: _.uniqueId('shipping')
                    });
                }, reject);
            });
        };
        return this;
    }])
    .service('PostOffice', ['$q', function($q){

    /**
     * Validate an address
     * @param address The address to validate.
     */
    this.validateAddress = function(address){
        if (!address){
            return $q.reject('Invalid Address');
        }
        if (!address.name) {
            return $q.reject('Name cannot be blank');
        }
        if (!address.address1) {
            return $q.reject('Address 1 cannot be blank');
        }
        if (!address.city) {
            return $q.reject('City cannot be blank');
        }
        if (!address.state) {
            return $q.reject('State cannot be blank');
        }
        if (!address.country) {
            return $q.reject('Country cannot be blank');
        }
        if (!address.zipPc) {
            return $q.reject('Zip/Postal Code cannot be blank');
        }
        if (!address.address2) { // Default the second line to blank
            address.address2 = '';
        }
        return $q.when(true);
    };
}])
    .service('BankTeller', ['$q', function($q){


        var sixteenDigits = /^[\d]{16}$/;

        /**
         * Validate the credit card number, ensuring that it is 16 digits.
         * @param cardNumber The Credit Card Number
         */
        this.validateNumber = function(cardNumber){
            return $q(function(resolve, reject) {
                var ccNumber = cardNumber + '';
                ccNumber = ccNumber.replace(/[\-\s]*/gi, '');

                if (!sixteenDigits.test(ccNumber)) {
                    reject('Card Number Invalid');
                }
                resolve(ccNumber);
            });
        };

        var threeDigits = /^[\d]{3}$/;

        /**
         * Validate a CCV number (the three digits on the back of a card)
         * @param ccv
         * @returns {*}
         */
        this.validateCcv = function(ccv){
            return $q(function(resolve, reject) {
                var theCcv = ccv+'';
                if (!threeDigits.test(theCcv )){
                    reject('Invalid CCV');
                }
                resolve(theCcv );
            });
        };

        /**
         * Validate a credit card object.
         * @param creditCardData
         * @returns A promise which resolves to 'true' if the card is valid.
         */
        this.validateCreditCard = function(creditCardData){

            if (!creditCardData){
                return $q.reject('Invalid credit card data');
            }

            var numberValidation = $q(function (resolve, reject) {
                var month = creditCardData.expiryMonth;
                if (month < 0 || month > 12){
                    reject('Invalid Expiry Month');
                }else {

                    var year = creditCardData.expiryYear;
                    if (year < 15) {
                        reject('Card is expired');
                    }
                    else{
                        resolve({
                            month:month,
                            year:year
                        });
                    }
                }
                reject('Invalid format');
            });

            var nameValidation = $q(function(resolve, reject){
                if (!creditCardData.cardholderName){
                    reject('Need Cardholder Name');
                }else {
                    var name = creditCardData.cardholderName.trim();
                    if (!name.length) {
                        reject('Invalid Cardholder Name');
                    }else{
                        resolve(name);
                    }
                }

            });


            return $q.all([
                nameValidation,
                this.validateNumber(creditCardData.number),
                this.validateCcv(creditCardData.ccv),
                numberValidation
            ]).then(function(values) {
                var name=values[0], number=values[1], ccv=values[2], monthAndYear=values[3];
                return {
                    number:number,
                    ccv: ccv,
                    expiryMonth:monthAndYear.month,
                    expiryYear:monthAndYear.year,
                    cardholderName:name
                };
            });
        };

    }])
    .controller('CreditCardEntryController', ['$scope', 'BankTeller', function($scope, BankTeller){
        var _this = this;
        var ngModelCtrl = null;
        this.id = _.uniqueId('ccE');
        this.number = '';
        this.cardholderName = '';
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

        this.$render = function(){
            var $viewValue = ngModelCtrl.$viewValue;
            if ($viewValue){
                this.number= $viewValue.number;
                this.cardholderName= $viewValue.cardholderName;
                this.ccv= $viewValue.ccv;
                this.expiryMonth= $viewValue.expiryMonth;
                this.expiryYear= $viewValue.expiryYear;
            }
        };

        this.pushToModel = function () {
            ngModelCtrl.$setViewValue({
                number:this.number,
                cardholderName:this.name,
                ccv:this.ccv,
                expiryMonth:this.expiryMonth,
                expiryYear:this.expiryYear
            });
        };

        $scope.$watchGroup([
            function () { return _this.number;},
            function () { return _this.cardholderName;},
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
    .controller('AddressEntryController', ['PostOffice', '$scope', function(PostOffice, $scope){
        var ngModelCtrl = null;
        var _this = this;
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
            ngModelCtrl.$render = function(){return _this.$render();};
            ngModelCtrl.$asyncValidators.validAddress = function(address){
                return PostOffice.validateAddress(address);
            };
        };


        this.$render = function(){
            var $viewValue = ngModelCtrl.$viewValue;
            if ($viewValue){
                this.name = $viewValue.name;
                this.address1 = $viewValue.address1;
                this.address2 = $viewValue.address2;
                this.city = $viewValue.city;
                this.state = $viewValue.state;
                this.country = $viewValue.country;
                this.zipPc = $viewValue.zipPc;
            }
        };

        this.pushToModel = function () {
            ngModelCtrl.$setViewValue({
                name :this.name,
                address1 :this.address1,
                address2 :this.address2,
                city :this.city,
                state :this.state,
                country :this.country,
                zipPc :this.zipPc
            });
        };

        $scope.$watchGroup([
                function () { return _this.name;},
                function () { return _this.address1;},
                function () { return _this.address2;},
                function () { return _this.city;},
                function () { return _this.state;},
                function () { return _this.country;},
                function () { return _this.zipPc;}],
            function(){
                _this.pushToModel();
            });

    }])
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


angular.module('futureStore.cart', [])
    .service('CartService', ['$q', '$timeout', '$document', function($q, $timeout, $document){
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
                            reject('Error loading shopping cart');
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
    .controller('ShoppingCartController', ['CartService', function(CartService){
        this.cartContents = this.cartContents || [];

        this.deleteProduct = function (productData) {
            _.remove(this.cartContents, {sku:productData ? productData.sku : null});
        };

        this.getCartSubTotal = function(){
            return CartService.getCartTotal(this.cartContents);
        };

        this.getCartTaxes = function(){
            return CartService.getTaxes(this.getCartSubTotal());
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
        };

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
    });

angular.module('futureStore.checkout', ['futureStore.orders', 'futureStore.cart'])
    .controller('StoreCheckoutController', ['CartService', 'OrderService', '$window', function(CartService, OrderService, $window){
        var _this = this;
        this.id = _.uniqueId('storeCheckout');

        this.reset = function() {
            this.shoppingCart = [];
            this.creditCard = {};
            this.billingAddress = {};
            this.shippingAddress = {};
            this.shippingIsBilling = true;
        };

        this.getCart = function(){
            CartService.getCartData().then(function(cartData){
                _this.shoppingCart = cartData;
            });
        };

        this.checkout = function() {

            var successfulCheckout = function (orderConfirmation) {
                CartService.setCartContents([]);
                $window.alert(  'Placed your order. Order Number: ' + 
                                orderConfirmation.orderId + 
                                ' Tracking Number: ' + 
                                orderConfirmation.trackingNumber);
            };

            var failedCheckout = function (failedReason) {
                $window.alert('Unable to place your order. ' + failedReason);
            };

            var billingAddress = _this.billingAddress;
            var shippingAddress = _this.shippingIsBilling ? _this.billingAddress : _this.shippingAddress;

            OrderService.placeOrder(this.shoppingCart, this.creditCard, billingAddress, shippingAddress)
                        .then(successfulCheckout, failedCheckout)
                        .finally(function(){
                           _this.getCart();
                        });

        };

        this.reset();
        this.getCart();

    }])
    .directive('storeCheckout', function(){
        return {
            restrict:'E',
            replace:true,
            controller:'StoreCheckoutController as storeCheckout',
            templateUrl:'store-checkout-template.html'
        }
    })
    