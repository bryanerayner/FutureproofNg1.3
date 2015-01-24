describe('StoreCheckoutController', function () {

    var testCart = [];


    var StoreCheckoutController = null;

    var $rootScope = null;

    var $window = null;

    var OrderService = null;

    var ShoppingCart = null;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };

    var $controller = null;

    // Used by tests to tell the mock OrderService whether or not the order should pass or fail.
    var orderShouldSucceed = true;

    var stubWindow = function(name){
        return sinon.stub($window, name, function () {});
    };
    var stubWindowAlert = function () {
      return stubWindow('alert');
    };

    beforeEach(module('futureStore.checkout'));

    beforeEach(function(){

        inject(['$controller', function (ctrl) {
           $controller  = ctrl;
        }]);

        testCart = [
            {
                sku: "1234",
                imgSrc: "http://placehold.it/250x150",
                name: "Awesome Pixel Art",
                price: 56.99,
                count: 2
            },
            {
                sku: "34234",
                imgSrc: "http://placekitten.com/g/250/150",
                name: "Cute Kitten Print",
                price: 21.15,
                count: 1
            }
        ];

        // Mock ShoppingCart and OrderService
        inject(['$q', function ($q) {
            ShoppingCart = {
                getCartData:function(){
                    return $q.when(testCart);
                },
                setCartContents:function(cart){
                    return null;
                }
            };
            OrderService = {
                placeOrder:function(shoppingCart, creditCard, billingAddress, shippingAddress){
                    if (orderShouldSucceed){
                        return $q.when({
                            orderId:'123',
                            trackingNumber:'456'
                        });
                    }else{
                        return $q.reject();
                    }
                }
            };
        }]);




        inject([
            '$rootScope', '$window', function(_$rootScope, _$window) {

                $window = _$window;
                $rootScope = _$rootScope;
            }
        ]);

        StoreCheckoutController = $controller('StoreCheckoutController', {
           'ShoppingCart':ShoppingCart,
            'OrderService':OrderService,
            '$window': $window
        });

    });

    afterEach(function () {
        testCart = [];
        ShoppingCart = null;
        OrderService = null;
        $window = null;
        $rootScope = null;
        orderShouldSucceed = false;
        $controller = null;
    });


    describe('Publicly Accessible Variables', function(){



        it('should expose shoppingCart as an Array', function(){
            expect(StoreCheckoutController.shoppingCart).to.be.an('Array');
        });
        it('should expose creditCard as an object', function(){
            expect(StoreCheckoutController.creditCard).to.be.an('object');
        });
        it('should expose billingAddress as an object', function(){
            expect(StoreCheckoutController.billingAddress).to.be.an('object');
        });
        it('should expose shippingAddress as an object', function(){
            expect(StoreCheckoutController.shippingAddress).to.be.an('object');
        });
        it('should expose shippingIsBilling as a boolean', function(){
            expect(StoreCheckoutController.shippingIsBilling).to.be.a('boolean');
        });
        it('should expose id as a string', function(){
            expect(StoreCheckoutController.id).to.be.a('string');
        });
    });

    describe('Services Interaction', function(){

        var alertStub;
        beforeEach(function(){
            alertStub = stubWindowAlert();
        });
        afterEach(function(){
           $window.alert.restore();
        });

        describe('ShoppingCart', function(){
            it ('should get the contents of ShoppingCart when first loading', function(){
               resolvePromises();
               StoreCheckoutController.shoppingCart.should.deep.equal(testCart);
            });
            it ('should set the contents of the ShoppingCart to an empty array after successfully ordering a product', function(){
                var setContentsSpy = sinon.spy(ShoppingCart, 'setCartContents');
                orderShouldSucceed = true;
                StoreCheckoutController.checkout();
                resolvePromises();
                setContentsSpy.should.have.been.calledWith([]);
            });
        });

        describe('OrderService', function () {

            var orderSpy, orderTestCart, orderCard, orderBillingAddress, orderShippingAddress;

            beforeEach(function(){
                orderTestCart = [];
                orderCard = {
                    number:'1234567890123456',
                    cardholderName:'Bobby',
                    month:10,
                    year:17,
                    ccv:'123'
                };
                orderBillingAddress = {
                    name : 'Bobby',
                    address1 : '1 Garden',
                    address2 :'',
                    city :'Ottawa',
                    state :'ON',
                    country: 'Canada',
                    zipPc :'K3R5T6'
                };
                orderShippingAddress = {
                    name : 'Bobby',
                    address1 : '2 Bread',
                    address2 :'',
                    city :'Moosejaw',
                    state :'ON',
                    country: 'Canada',
                    zipPc :'M3Q5T6'
                };
                orderSpy = sinon.spy(OrderService, 'placeOrder');
            });
            afterEach(function(){
                orderSpy = null;
                orderTestCart = null;
                orderCard = null;
                orderBillingAddress = null;
                orderShippingAddress = null;
            });

            var setDefaultSettings = function(){
                StoreCheckoutController.creditCard = orderCard;
                StoreCheckoutController.billingAddress = orderBillingAddress;
                StoreCheckoutController.shippingAddress = orderShippingAddress;
                StoreCheckoutController.shoppingCart = orderTestCart;
                StoreCheckoutController.shippingIsBilling = false;
            };


            it('Should place an order with the parameters which exist on the controller\'s public properties', function(){
                setDefaultSettings();
                StoreCheckoutController.checkout();
                resolvePromises();
                expect(orderSpy).to.have.been.calledWith(orderTestCart, orderCard, orderBillingAddress, orderShippingAddress);
            });

            it('Should place an order with the billing address identical to shipping, if shippingIsBilling is true', function(){
                setDefaultSettings();
                StoreCheckoutController.shippingIsBilling = true;
                StoreCheckoutController.checkout();
                resolvePromises();
                expect(orderSpy).to.have.been.calledWith(orderTestCart, orderCard, orderBillingAddress, orderBillingAddress);
            });
        })
    });


});