angular.module('algxApp')
.factory('algEscapeService', function () {
    var escape_alg = function (alg) {
        if (!alg) { return alg; }
        var escaped = alg;
        escaped = escaped.replace(/_/g, "&#95;").replace(/ /g, "_");
        escaped = escaped.replace(/\+/g, "&#2b;");
        escaped = escaped.replace(/-/g, "&#45;").replace(/'/g, "-");
        return escaped;
    }

    var unescape_alg = function (alg) {
        if (!alg) { return alg; }
        var unescaped = alg;
        unescaped = unescaped.replace(/-/g, "'").replace(/&#45;/g, "-");
        unescaped = unescaped.replace(/\+/g, " ").replace(/&#2b;/g, "+"); // Recognize + as space. Many URL encodings will do this.
        unescaped = unescaped.replace(/_/g, " ").replace(/&#95;/g, "_");
        return unescaped;
    }

    return {
        escape_alg: escape_alg,
        unescape_alg: unescape_alg
    }
});