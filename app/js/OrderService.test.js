describe('OrderService', function(){
    var OrderService;
    var $rootScope;
    var $timeout;

    var orderCart, orderCard, orderBilling, orderShipping;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };

    beforeEach(module('futureStore.orders'));
    beforeEach(function(){

        orderCard = {
            expiryMonth:10,
            expiryYear:15,
            ccv:'333',
            number:'3333333333333333',
            cardholderName:'Bobby'
        };
        orderCart = [
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
        orderBilling = {
            name : 'Bobby',
            address1 : '1 Garden',
            address2 :'',
            city :'Ottawa',
            state :'ON',
            country: 'Canada',
            zipPc :'K3R5T6'
        };
        orderShipping = {
            name : 'Bobby',
            address1 : '2 Bread',
            address2 :'',
            city :'Moosejaw',
            state :'ON',
            country: 'Canada',
            zipPc :'M3Q5T6'
        };

        inject(['OrderService', '$rootScope', '$timeout', function(OrderSrv, rs, timeout){
            OrderService = OrderSrv;
            $rootScope = rs;
            $timeout = timeout;
        }]);

    });
    afterEach(function () {
        OrderService = null;
        $rootScope = null;
        orderCart = orderCard = orderBilling = orderShipping = null;
    });

    describe('placeOrder', function(){

        var placeOrder;

        beforeEach(function(){

            sinon.stub(_, 'uniqueId', function(){
                return 'uid';
            });

            placeOrder = function(cart, card, billing, shipping){
                var promise = OrderService.placeOrder(cart, card, billing, shipping);

                return promise;
            }
        });

        afterEach(function(){
            _.uniqueId.restore();
        });

        it('Should return a valid order confirmation for valid shipment requests', function(done){
            var order = placeOrder(orderCart, orderCard, orderBilling, orderShipping);
            order.then(function(value) {
                value.should.deep.equal({
                    orderId: 'uid',
                    trackingNumber: 'uid'
                });
                done();
            },function(reason){
                assert().fail();
                done();
            });
            resolvePromises();
        });

        it('Should reject orders if the credit card is invalid', function(done){
            orderCard.number = '';
            placeOrder(orderCart, orderCard, orderBilling, orderShipping).then(function(){
                assert().fail();
                done();
            }, function(rejection){
                rejection.should.be.a('string');
                done();
            });
            resolvePromises();
        });
        it('Should reject orders if the billing address is invalid', function(done){
            orderBilling.state = '';
            placeOrder(orderCart, orderCard, orderBilling, orderShipping).then(function(){
                assert().fail();
                done();
            }, function(reason){
                reason.should.be.a('string');
                done();
            });
            resolvePromises();
        });
        it('Should reject orders if the shipping address is invalid', function(done){
            orderShipping.state = '';
            placeOrder(orderCart, orderCard, orderBilling, orderShipping).then(function(){
                assert().fail();
                done();
            }, function(reason){
                reason.should.be.a('string');
                done();
            });
            resolvePromises();
        });
    });


});