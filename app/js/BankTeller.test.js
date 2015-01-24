describe('BankTeller', function(){

    var BankTeller;
    var $rootScope;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };
    beforeEach(module('futureStore.orders'));



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

            it('should return a rejected promise for invalid cards', function(done){
                BankTeller.validateNumber('').then(function() {
                    assert().fail('Should have rejected');
                    done();
                }, function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should pass any 16 digit number', function(done){
                BankTeller.validateNumber('1234567890123456').then(function(isValid){
                    expect(isValid).to.equal('1234567890123456');
                    done();
                });
                resolvePromises();
            });

            it('should reject any number lower than 16 digits long', function(done){

                BankTeller.validateNumber('123456789012345').then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
                });
            it('should reject any number longer than 16 digits long', function(done) {
                BankTeller.validateNumber('12345678901234567').then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should be tolerant of dashes and whitespace', function(done){
                BankTeller.validateNumber('1234-5678 9012 3456').then(function(isValid){
                    expect(isValid).to.equal('1234567890123456');
                    done();
                }, function(){
                    assert().fail();
                    done();
                });
                resolvePromises();
            });
        });

        describe('validateCcv', function () {


            it('should only accept three digit numbers', function(done) {
                BankTeller.validateCcv('123').then(function(isValid){
                    expect(isValid).to.equal('123');
                    done();
                },function(reason){
                    assert().fail();
                    done();
                });
                resolvePromises();
            });

            it ('should reject any alphanumeric numbers', function(done) {
                BankTeller.validateCcv('ab3').then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it ('should reject any number that\'s over 3 digits', function(done) {
                BankTeller.validateCcv('1234').then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
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

            it('should reject undefined input', function (done) {
                BankTeller.validateCreditCard().then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should reject invalid numbers', function (done) {
                card.number = '';
                BankTeller.validateCreditCard(card).then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should reject invalid names', function (done) {
                card.cardholderName = '';
                BankTeller.validateCreditCard(card).then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should reject invalid CCVs', function (done) {
                card.ccv = '';
                BankTeller.validateCreditCard(card).then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should reject invalid months', function (done) {
                card.expiryMonth = -1;
                BankTeller.validateCreditCard(card).then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should reject invalid years', function (done) {
                card.expiryYear = 14;
                BankTeller.validateCreditCard(card).then(function() {
                    assert().fail('Should have rejected');
                    done();
                },function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });

            it('should resolve to true for valid input', function(done){
              BankTeller.validateCreditCard(card).then(function(validCard){
                   expect(validCard).to.deep.equal(card);
                   done();
               }, function() {
                  assert().fail('Should have passed');
                  done();
              });
                resolvePromises();
            });
        });

    });


});