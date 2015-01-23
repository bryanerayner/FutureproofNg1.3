describe('PostOffice', function(){

    var PostOffice;
    var $rootScope;

    var testAddress;

    var resolvePromises = function(){
        if ($rootScope){
            $rootScope.$apply();
        }
    };

    beforeEach(module('futureStore'));
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
                    resolvePromises();
                    return promise;
                };
            });


            it('should reject blank names', function(){
                testAddress.name = '';
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should reject blank Address 1 values', function(){
                testAddress.address1 = '';
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should accept blank Address 2 values', function(){
                testAddress.address2 = '';
                var test = validateAddress();
                expect(test).to.eventually.equal(true);
            });
            it('should reject blank City values', function(){
                testAddress.city = '';
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should reject blank State values', function(){
                testAddress.state = '';
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should reject blank Country values', function(){
                testAddress.country = '';
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should reject blank Zip/Postal Code values', function(){
                testAddress.zipPc= '';
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should reject null', function(){
                testAddress = null;
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
            it('should reject undefined', function(){
                testAddress = void 0;
                var test = validateAddress();
                expect(test).to.eventually.be.rejected;
            });
        });

    });
});