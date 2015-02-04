///<reference path="../../../typings/tsd.d.ts"/>

import ordersModule = require('../orders/_index');
import cartModule = require('../cart/_index');

export var ngModule = angular.module('futureStore.checkout', [
        'futureStore.orders',
        'futureStore.cart']);