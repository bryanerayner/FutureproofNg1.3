define(["require", "exports", '_module', 'address-entry', 'BankTeller', 'credit-card-entry', 'OrderService', 'PostOffice'], function (require, exports, _module, a, B, c, O, P) {
    exports.orders = {
        ngModule: _module.ngModule,
        AddressEntryController: a.AddressEntryController,
        BankTeller: B.BankTeller,
        CreditCardEntryController: c.CreditCardEntryController,
        OrderService: O.OrderService,
        PostOffice: P.PostOffice
    };
});
//# sourceMappingURL=_index.js.map