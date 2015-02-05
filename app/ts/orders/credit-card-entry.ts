///<reference path="../../../typings/tsd.d.ts"/>
///<reference path="_module.ts" />
import _module = require('_module');

export class CreditCardEntryController
{

    static $inject = ['$scope', 'BankTeller'];

    $scope;
    static BankTeller;

    ngModelCtrl;
    name = '';
    id = _.uniqueId('ccE');
    number = '';
    cardholderName = '';
    ccv = '';
    expiryMonth = null;
    expiryYear = null;

    // Options for the expiry month
    expiryMonthOptions = [
        {label:'Jan', value:1},
        {label:'Feb', value:2},
        {label:'Mar', value:3},
        {label:'Apr', value:4},
        {label:'May', value:5},
        {label:'Jun', value:6},
        {label:'Jul', value:7},
        {label:'Aug', value:8},
        {label:'Sept', value:9},
        {label:'Oct', value:10},
        {label:'Nov', value:11},
        {label:'Dec', value:12}
    ];
    // Options for the expiry year
    expiryYearOptions = [
        {label:'2015', value: 15},
        {label:'2016', value: 16},
        {label:'2017', value: 17},
        {label:'2018', value: 18},
        {label:'2019', value: 19},
        {label:'2020', value: 20},
        {label:'2021', value: 21},
        {label:'2022', value: 22},
        {label:'2023', value: 23}];


    constructor($scope, BankTeller) {
        this.$scope = $scope;
        CreditCardEntryController.BankTeller = BankTeller;

        this.$scope.$watchGroup([
                () => this.number,
                ()=>this.name,
                () => this.cardholderName,
                () => this.ccv,
                () => this.expiryMonth,
                () => this.expiryYear
            ],
            ()=>this.pushToModel());
    }


    config (ngModelController) {
        this.ngModelCtrl = ngModelController;
        this.ngModelCtrl.$render = ()=> this.$render();
        this.ngModelCtrl.$asyncValidators.entireCard = function (modelValue, viewValue) {
            var value = modelValue || viewValue;
            return CreditCardEntryController.BankTeller.validateCreditCard(value);
        };

    }

    $render (){
        var $viewValue = this.ngModelCtrl.$viewValue;
        if ($viewValue){
            this.number= $viewValue.number;
            this.cardholderName= $viewValue.cardholderName;
            this.ccv= $viewValue.ccv;
            this.expiryMonth= $viewValue.expiryMonth;
            this.expiryYear= $viewValue.expiryYear;
        }
    }

    pushToModel () {
        this.ngModelCtrl.$setViewValue({
            number:this.number,
            cardholderName:this.name,
            ccv:this.ccv,
            expiryMonth:this.expiryMonth,
            expiryYear:this.expiryYear
        });
    }




}
_module.ngModule.controller('CreditCardEntryController',CreditCardEntryController)
    .directive('creditCardEntry', function () {
        return {
            restrict:'E',
            replace:true,
            require:['creditCardEntry', 'ngModel'],
            templateUrl:'credit-card-entry-template.html',
            controller:'CreditCardEntryController as ctrl',
            scope:true,
            bindToController:true,
            link:function(scope, element, attrs, ctrls){
                var creditCardEntryCtrl = ctrls[0];
                var ngModelCtrl = ctrls[1];
                creditCardEntryCtrl.config(ngModelCtrl);
            }
        };
    })