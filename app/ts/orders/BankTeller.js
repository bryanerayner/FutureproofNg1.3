define(["require", "exports"], function (require, exports) {
    var sixteenDigits = /^[\d]{16}$/;
    var threeDigits = /^[\d]{3}$/;
    var BankTeller = (function () {
        function BankTeller($q) {
            BankTeller.$q = $q;
        }
        /**
         * Validate the credit card number, ensuring that it is 16 digits.
         * @param cardNumber The Credit Card Number
         */
        BankTeller.prototype.validateNumber = function (cardNumber) {
            return BankTeller.$q(function (resolve, reject) {
                var ccNumber = cardNumber + '';
                ccNumber = ccNumber.replace(/[\-\s]*/gi, '');
                if (!sixteenDigits.test(ccNumber)) {
                    reject('Card Number Invalid');
                }
                resolve(ccNumber);
            });
        };
        /**
         * Validate a CCV number (the three digits on the back of a card)
         * @param ccv
         * @returns {*}
         */
        BankTeller.prototype.validateCcv = function (ccv) {
            return BankTeller.$q(function (resolve, reject) {
                var theCcv = ccv + '';
                if (!threeDigits.test(theCcv)) {
                    reject('Invalid CCV');
                }
                resolve(theCcv);
            });
        };
        /**
         * Validate a credit card object.
         * @param creditCardData
         * @returns A promise which resolves to 'true' if the card is valid.
         */
        BankTeller.prototype.validateCreditCard = function (creditCardData) {
            var $q = BankTeller.$q;
            if (!creditCardData) {
                return $q.reject('Invalid credit card data');
            }
            var numberValidation = $q(function (resolve, reject) {
                var month = creditCardData.expiryMonth;
                if (month < 0 || month > 12) {
                    reject('Invalid Expiry Month');
                }
                else {
                    var year = creditCardData.expiryYear;
                    if (year < 15) {
                        reject('Card is expired');
                    }
                    else {
                        resolve({
                            month: month,
                            year: year
                        });
                    }
                }
                reject('Invalid format');
            });
            var nameValidation = $q(function (resolve, reject) {
                if (!creditCardData.cardholderName) {
                    reject('Need Cardholder Name');
                }
                else {
                    var name = creditCardData.cardholderName.trim();
                    if (!name.length) {
                        reject('Invalid Cardholder Name');
                    }
                    else {
                        resolve(name);
                    }
                }
            });
            return $q.all([
                nameValidation,
                this.validateNumber(creditCardData.number),
                this.validateCcv(creditCardData.ccv),
                numberValidation
            ]).then(function (values) {
                var name = values[0], number = values[1], ccv = values[2], monthAndYear = values[3];
                return {
                    number: number,
                    ccv: ccv,
                    expiryMonth: monthAndYear.month,
                    expiryYear: monthAndYear.year,
                    cardholderName: name
                };
            });
        };
        BankTeller.$inject = ['$q'];
        return BankTeller;
    })();
    exports.BankTeller = BankTeller;
});
//# sourceMappingURL=BankTeller.js.map