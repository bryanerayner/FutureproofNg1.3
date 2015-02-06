define(["require", "exports", '_module'], function (require, exports, _module) {
    var OrderService = (function () {
        function OrderService($q, PostOffice, BankTeller) {
            OrderService.$q = $q;
            OrderService.PostOffice = PostOffice;
            OrderService.BankTeller = BankTeller;
        }
        OrderService.prototype.placeOrder = function (products, creditCardData, billingAddress, shippingAddress) {
            return OrderService.$q(function (resolve, reject) {
                OrderService.$q.all([
                    OrderService.BankTeller.validateCreditCard(creditCardData),
                    OrderService.PostOffice.validateAddress(billingAddress),
                    OrderService.PostOffice.validateAddress(shippingAddress)
                ]).then(function () {
                    resolve({
                        orderId: _.uniqueId('order'),
                        trackingNumber: _.uniqueId('shipping')
                    });
                }, reject);
            });
        };
        OrderService.$inject = ['$q', 'PostOffice', 'BankTeller'];
        return OrderService;
    })();
    exports.OrderService = OrderService;
    _module.ngModule.service('OrderService', OrderService);
});
//# sourceMappingURL=OrderService.js.map