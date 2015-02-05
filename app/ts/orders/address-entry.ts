///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class AddressEntryController
{

    static $inject = ['PostOffice', '$scope'];

    $scope;
    static PostOffice;

    ngModelCtrl;

    id= _.uniqueId('addressEntry');
    name = '';
    address1 = '';
    address2 = '';
    city = '';
    state = '';
    country = '';
    zipPc = '';

    constructor(PostOffice, $scope) {
        AddressEntryController.PostOffice = PostOffice;
        this.$scope = $scope;

        $scope.$watchGroup([
                ()=> this.name,
                ()=> this.address1,
                ()=> this.address2,
                ()=> this.city,
                ()=> this.state,
                ()=> this.country,
                ()=> this.zipPc
            ],
            ()=>this.pushToModel());
    }

    config(ngModelController) {
        this.ngModelCtrl = ngModelController;
        this.ngModelCtrl.$render = ()=>this.$render();
        this.ngModelCtrl.$asyncValidators.validAddress = function(address){
            return AddressEntryController.PostOffice.validateAddress(address);
        };
    }


    $render (){
        var $viewValue = this.ngModelCtrl.$viewValue;
        if ($viewValue){
            this.name = $viewValue.name;
            this.address1 = $viewValue.address1;
            this.address2 = $viewValue.address2;
            this.city = $viewValue.city;
            this.state = $viewValue.state;
            this.country = $viewValue.country;
            this.zipPc = $viewValue.zipPc;
        }
    }

    pushToModel () {
        this.ngModelCtrl.$setViewValue({
            name :this.name,
            address1 :this.address1,
            address2 :this.address2,
            city :this.city,
            state :this.state,
            country :this.country,
            zipPc :this.zipPc
        });
    }



}

_module.ngModule.controller('AddressEntryController', AddressEntryController)
    .directive('addressEntry', function () {
        return {
            restrict:'E',
            replace:true,
            require:['addressEntry', 'ngModel'],
            templateUrl:'address-entry-template.html',
            controller:'AddressEntryController as ctrl',
            scope:true,
            bindToController:true,
            link:function(scope, element, attrs, ctrls){
                var addressEntryCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                addressEntryCtrl.config(ngModelCtrl);
            }
        };
    });