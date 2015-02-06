define(["require", "exports", '_module'], function (require, exports, _module) {
    var CreditCardEntryController = (function () {
        function CreditCardEntryController($scope, BankTeller) {
            var _this = this;
            this.name = '';
            this.id = _.uniqueId('ccE');
            this.number = '';
            this.cardholderName = '';
            this.ccv = '';
            this.expiryMonth = null;
            this.expiryYear = null;
            // Options for the expiry month
            this.expiryMonthOptions = [
                { label: 'Jan', value: 1 },
                { label: 'Feb', value: 2 },
                { label: 'Mar', value: 3 },
                { label: 'Apr', value: 4 },
                { label: 'May', value: 5 },
                { label: 'Jun', value: 6 },
                { label: 'Jul', value: 7 },
                { label: 'Aug', value: 8 },
                { label: 'Sept', value: 9 },
                { label: 'Oct', value: 10 },
                { label: 'Nov', value: 11 },
                { label: 'Dec', value: 12 }
            ];
            // Options for the expiry year
            this.expiryYearOptions = [
                { label: '2015', value: 15 },
                { label: '2016', value: 16 },
                { label: '2017', value: 17 },
                { label: '2018', value: 18 },
                { label: '2019', value: 19 },
                { label: '2020', value: 20 },
                { label: '2021', value: 21 },
                { label: '2022', value: 22 },
                { label: '2023', value: 23 }
            ];
            this.$scope = $scope;
            CreditCardEntryController.BankTeller = BankTeller;
            this.$scope.$watchGroup([
                function () { return _this.number; },
                function () { return _this.name; },
                function () { return _this.cardholderName; },
                function () { return _this.ccv; },
                function () { return _this.expiryMonth; },
                function () { return _this.expiryYear; }
            ], function () { return _this.pushToModel(); });
        }
        CreditCardEntryController.prototype.config = function (ngModelController) {
            var _this = this;
            this.ngModelCtrl = ngModelController;
            this.ngModelCtrl.$render = function () { return _this.$render(); };
            this.ngModelCtrl.$asyncValidators.entireCard = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                return CreditCardEntryController.BankTeller.validateCreditCard(value);
            };
        };
        CreditCardEntryController.prototype.$render = function () {
            var $viewValue = this.ngModelCtrl.$viewValue;
            if ($viewValue) {
                this.number = $viewValue.number;
                this.cardholderName = $viewValue.cardholderName;
                this.ccv = $viewValue.ccv;
                this.expiryMonth = $viewValue.expiryMonth;
                this.expiryYear = $viewValue.expiryYear;
            }
        };
        CreditCardEntryController.prototype.pushToModel = function () {
            this.ngModelCtrl.$setViewValue({
                number: this.number,
                cardholderName: this.name,
                ccv: this.ccv,
                expiryMonth: this.expiryMonth,
                expiryYear: this.expiryYear
            });
        };
        CreditCardEntryController.$inject = ['$scope', 'BankTeller'];
        return CreditCardEntryController;
    })();
    exports.CreditCardEntryController = CreditCardEntryController;
    _module.ngModule.controller('CreditCardEntryController', CreditCardEntryController).directive('creditCardEntry', function () {
        return {
            restrict: 'E',
            replace: true,
            require: ['creditCardEntry', 'ngModel'],
            templateUrl: 'credit-card-entry-template.html',
            controller: 'CreditCardEntryController as ctrl',
            scope: true,
            bindToController: true,
            link: function (scope, element, attrs, ctrls) {
                var creditCardEntryCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                creditCardEntryCtrl.config(ngModelCtrl);
            }
        };
    });
});
//# sourceMappingURL=credit-card-entry.js.map