///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class OrderService {

    static $inject = ['$q', 'PostOffice', 'BankTeller'];

    static $q;
    static PostOffice;
    static BankTeller;

    constructor($q, PostOffice, BankTeller) {
        OrderService.$q = $q;
        OrderService.PostOffice = PostOffice;
        OrderService.BankTeller = BankTeller;
    }


    placeOrder(products, creditCardData, billingAddress, shippingAddress) {
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
    }
}

_module.ngModule.service('OrderService', OrderService)