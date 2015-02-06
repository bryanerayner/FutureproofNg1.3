///<reference path="../../../typings/tsd.d.ts"/>

import _module = require('_module');

import s = require('store-checkout');

export var checkout = {
    ngModule: _module.ngModule,
    StoreCheckoutController: s.StoreCheckoutController
};