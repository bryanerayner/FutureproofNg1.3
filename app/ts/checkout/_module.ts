///<reference path="../../../typings/tsd.d.ts"/>

import orders = require('../orders/_index');
import cart = require('../cart/_index');

export var ngModule = angular.module('futureStore.checkout', [
        'futureStore.orders',
        'futureStore.cart']);