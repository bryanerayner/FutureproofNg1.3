define(["require", "exports", '_module'], function (require, exports, _module) {
    var AddressEntryController = (function () {
        function AddressEntryController(PostOffice, $scope) {
            var _this = this;
            this.id = _.uniqueId('addressEntry');
            this.name = '';
            this.address1 = '';
            this.address2 = '';
            this.city = '';
            this.state = '';
            this.country = '';
            this.zipPc = '';
            AddressEntryController.PostOffice = PostOffice;
            this.$scope = $scope;
            $scope.$watchGroup([
                function () { return _this.name; },
                function () { return _this.address1; },
                function () { return _this.address2; },
                function () { return _this.city; },
                function () { return _this.state; },
                function () { return _this.country; },
                function () { return _this.zipPc; }
            ], function () { return _this.pushToModel(); });
        }
        AddressEntryController.prototype.config = function (ngModelController) {
            var _this = this;
            this.ngModelCtrl = ngModelController;
            this.ngModelCtrl.$render = function () { return _this.$render(); };
            this.ngModelCtrl.$asyncValidators.validAddress = function (address) {
                return AddressEntryController.PostOffice.validateAddress(address);
            };
        };
        AddressEntryController.prototype.$render = function () {
            var $viewValue = this.ngModelCtrl.$viewValue;
            if ($viewValue) {
                this.name = $viewValue.name;
                this.address1 = $viewValue.address1;
                this.address2 = $viewValue.address2;
                this.city = $viewValue.city;
                this.state = $viewValue.state;
                this.country = $viewValue.country;
                this.zipPc = $viewValue.zipPc;
            }
        };
        AddressEntryController.prototype.pushToModel = function () {
            this.ngModelCtrl.$setViewValue({
                name: this.name,
                address1: this.address1,
                address2: this.address2,
                city: this.city,
                state: this.state,
                country: this.country,
                zipPc: this.zipPc
            });
        };
        AddressEntryController.$inject = ['PostOffice', '$scope'];
        return AddressEntryController;
    })();
    exports.AddressEntryController = AddressEntryController;
    _module.ngModule.controller('AddressEntryController', AddressEntryController).directive('addressEntry', function () {
        return {
            restrict: 'E',
            replace: true,
            require: ['addressEntry', 'ngModel'],
            templateUrl: 'address-entry-template.html',
            controller: 'AddressEntryController as ctrl',
            scope: true,
            bindToController: true,
            link: function (scope, element, attrs, ctrls) {
                var addressEntryCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                addressEntryCtrl.config(ngModelCtrl);
            }
        };
    });
});
//# sourceMappingURL=address-entry.js.map