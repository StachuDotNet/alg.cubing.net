angular.module('algxApp')
.factory('colorService', function () {
    var colorMap = {
        "y": 0xffff00,
        "w": 0xffffff,
        "b": 0x0000ff,
        "g": 0x00ff00,
        "o": 0xff8800,
        "r": 0xff0000,
        "x": 0x444444
    };

    var lightColorMap = {
        "y": 0xdddd00,
        "w": 0xcccccc,
        "b": 0x000099,
        "g": 0x00bb00,
        "o": 0xbb6600,
        "r": 0xaa0000,
        "x": 0x333333
    };

    var colorList =  function (str) {
        var out = [];
        var outLight = [];
        var str2 = ("x" + str).split("");
        var reorder = [0, 6, 3, 1, 2, 4, 5];
        for (var i in str2) {
            out.push(colorMap[str2[reorder[i]]]);
            outLight.push(lightColorMap[str2[reorder[i]]]);
        }
        return out.concat(outLight);
    }

    return {
        colorList: colorList
    };
});