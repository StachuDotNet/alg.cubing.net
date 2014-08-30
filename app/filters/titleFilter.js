angular.module('algxApp').filter('title', function () {
    return function (input, title) {
        var prefix = title ? title + " | " : "";
        if (input.length > 20) {
            return prefix + input.slice(0, 20) + (input.slice(20, 30) + " ").split(" ")[0] + "...";
        }
        return prefix + input;
    };
});