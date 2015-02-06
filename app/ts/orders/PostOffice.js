define(["require", "exports", '_module'], function (require, exports, _module) {
    var PostOffice = (function () {
        function PostOffice($q) {
            PostOffice.$q = $q;
        }
        /**
         * Validate an address
         * @param address The address to validate.
         */
        PostOffice.prototype.validateAddress = function (address) {
            var $q = PostOffice.$q;
            if (!address) {
                return $q.reject('Invalid Address');
            }
            if (!address.name) {
                return $q.reject('Name cannot be blank');
            }
            if (!address.address1) {
                return $q.reject('Address 1 cannot be blank');
            }
            if (!address.city) {
                return $q.reject('City cannot be blank');
            }
            if (!address.state) {
                return $q.reject('State cannot be blank');
            }
            if (!address.country) {
                return $q.reject('Country cannot be blank');
            }
            if (!address.zipPc) {
                return $q.reject('Zip/Postal Code cannot be blank');
            }
            if (!address.address2) {
                address.address2 = '';
            }
            return $q.when(true);
        };
        PostOffice.$inject = ['$q'];
        return PostOffice;
    })();
    exports.PostOffice = PostOffice;
    _module.ngModule.service('PostOffice', PostOffice);
});
//# sourceMappingURL=PostOffice.js.map