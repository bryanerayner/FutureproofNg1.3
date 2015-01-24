describe('PostOffice', function(){

    var PostOffice;
    var $rootScope;

    var testAddress;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };

    beforeEach(module('futureStore.orders'));
    beforeEach(function(){

        testAddress = {
            name:'Bobby',
            address1:'1 Garden',
            address2:'',
            city:'Pasadena',
            state:'CA',
            country:'USA',
            zipPc:'12345'
        };

        inject(['PostOffice', '$rootScope', function(PO, rs){
            PostOffice = PO;
            $rootScope = rs;
        }]);

    });
    afterEach(function () {
        testAddress = null;
        PostOffice= null;
        $rootScope = null;
    });

    describe('Validations', function(){

        describe('validateAddress', function(){

            var validateAddress;
            beforeEach(function(){
                validateAddress= function(){
                    var promise = PostOffice.validateAddress(testAddress);

                    return promise;
                };
            });
            it('validate good addresses', function(done){
               validateAddress().then(function(isValid){
                   expect(isValid).to.equal(true);
                   done();
               });
                resolvePromises();
            });
            it('should reject blank names', function(done){
                testAddress.name = '';
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should reject blank Address 1 values', function(done){
                testAddress.address1 = '';
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should accept blank Address 2 values', function(done){
                testAddress.address2 = '';
                var test = validateAddress().then(function(isValid){
                    expect(isValid).to.equal(true);
                    done();
                });
                resolvePromises();
            });
            it('should reject blank City values', function(done){
                testAddress.city = '';
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should reject blank State values', function(done){
                testAddress.state = '';
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should reject blank Country values', function(done){
                testAddress.country = '';
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should reject blank Zip/Postal Code values', function(done){
                testAddress.zipPc= '';
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should reject null', function(done){
                testAddress = null;
                var test = validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
            it('should reject undefined', function(done){
                testAddress = void 0;
                validateAddress().catch(function(reason){
                    reason.should.be.a('string');
                    done();
                });
                resolvePromises();
            });
        });

    });
});