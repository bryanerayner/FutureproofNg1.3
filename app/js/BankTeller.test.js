describe('BankTeller', function(){

    var BankTeller;
    var $rootScope;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };
    beforeEach(module('futureStore'));



    beforeEach(function(){

        inject([
            'BankTeller', '$rootScope', function(_BankTeller, _$rootScope) {
                BankTeller = _BankTeller;
                $rootScope = _$rootScope;
            }
        ]);

    });

    afterEach(function(){
        BankTeller = null;
        $rootScope = null;
    })

    describe('Validation', function(){


        describe('validateNumber', function () {

            it('should return a rejected promise for invalid cards', function(){
                var result = BankTeller.validateNumber('');
                resolvePromises();
                result.should.eventually.be.rejected;
            });

            it('should pass any 16 digit number', function(){
                var result = BankTeller.validateNumber('1234567890123456');

                resolvePromises();

                result.should.eventually.equal(true);
            });

            it('should reject any number lower than 16 digits long', function(){

                var result2 = BankTeller.validateNumber('123456789012345');

                resolvePromises();
                result2.should.eventually.be.rejected;
                });
            it('should reject any number longer than 16 digits long', function() {
                var result3 = BankTeller.validateNumber('12345678901234567');
                resolvePromises();
                result3.should.eventually.be.rejected;
            });

            it('should be tolerant of dashes and whitespace', function(){
                var result = BankTeller.validateNumber('1234-5678 9012 3456');
                resolvePromises();
                result.should.eventually.be.rejected;
            });
        });

        describe('validateCcv', function () {


            it('should only accept three digit numbers', function() {
                var result = BankTeller.validateCcv('123');


                resolvePromises();
                result.should.eventually.equal(true);
            });

            it ('should reject any alphanumeric numbers', function() {
                var result2 = BankTeller.validateCcv('ab3');

                resolvePromises();
                result2.should.eventually.be.rejected;
            });

            it ('should reject any number that\'s over 3 digits', function() {
                var result3 = BankTeller.validateCcv('1234');

                resolvePromises();
                result3.should.eventually.be.rejected;
            });
        });

        describe('validateCreditCard', function () {

            var card;
            beforeEach(function(){
                card = {
                    expiryMonth:10,
                    expiryYear:15,
                    ccv:'333',
                    number:'3333333333333333',
                    cardholderName:'Bobby'
                };
            });

            afterEach(function(){
                card = null;
            });

            it('should reject invalid numbers', function () {
                card.number = '';
                var result = BankTeller.validateCreditCard(card);
                resolvePromises();
                result.should.eventually.be.rejected;
            });

            it('should reject invalid names', function () {
                card.cardholderName = '';
                var result = BankTeller.validateCreditCard(card);
                resolvePromises();
                result.should.eventually.be.rejected;
            });

            it('should reject invalid CCVs', function () {
                card.ccv = '';
                var result = BankTeller.validateCreditCard(card);
                resolvePromises();
                result.should.eventually.be.rejected;
            });

            it('should reject invalid months', function () {
                card.month = -1;
                var result = BankTeller.validateCreditCard(card);
                resolvePromises();
                result.should.eventually.be.rejected;
            });

            it('should reject invalid years', function () {
                card.month = 2014;
                var result = BankTeller.validateCreditCard(card);
                resolvePromises();
                result.should.eventually.be.rejected;
            });

            it('should resolve to true for valid input', function(){
               var result = BankTeller.validateCreditCard(card);
                resolvePromises();
                result.should.eventually.equal(true);
            });
        });

    });


});