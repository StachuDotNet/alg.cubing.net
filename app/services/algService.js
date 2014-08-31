angular.module('algxApp')
.factory('algService', function () {
    // TODO: most of alg.js can be angularized like this.

    // Temporary hack to work around highlighting bug.
    // Currently unused.
    var isNested = function (alg) {
        for (var move in alg) {
            var type = alg[move].type;
            if (type == "commutator" || type == "conjugate" || type == "group") {
                return true;
            }
        }
        return false;
    }

    return {
        isNested: isNested
    };
})