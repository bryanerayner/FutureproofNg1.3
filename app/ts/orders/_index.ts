import _module = require('_module');
import a = require('address-entry');
import B = require('BankTeller');
import c = require('credit-card-entry');
import O = require('OrderService');
import P = require('PostOffice');

export var orders = {
    ngModule:_module.ngModule,
    AddressEntryController: a.AddressEntryController,
    BankTeller: B.BankTeller,
    CreditCardEntryController: c.CreditCardEntryController,
    OrderService: O.OrderService,
    PostOffice: P.PostOffice
};

