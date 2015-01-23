describe('OrderService', function(){
    var OrderService;
    var $rootScope;

    var orderCart, orderCard, orderBilling, orderShipping;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };

    beforeEach(module('futureStore'));
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

        inject(['OrderService', '$rootScope', function(OrderSrv, rs){
            OrderService = OrderSrv;
            $rootScope = rs;
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
                resolvePromises();
                return promise;
            }
        });

        afterEach(function(){
            _.uniqueId.restore();
        });

        it('Should return a valid order confirmation for valid shipment requests', function(){
            var order = placeOrder(orderCart, orderCard, orderBilling, orderShipping);
            expect(order).to.eventually.become({
                orderId:'uid',
                trackingNumber:'uid'
            });
        });
    });


});