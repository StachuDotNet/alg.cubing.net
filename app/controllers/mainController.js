angular.module('algxApp')
    .controller('mainController',
    ["$scope", "$location", "debounce", "colorService", "formatterService", "algService", 'systemDefaults', 'initService',
    function ($scope, $location, debounce, colorService, formatterService, algService, systemDefaults, initService) {

        var fire = true;

        var search = $location.search();

        function indexBy(list, key) {
            var obj = {};
            for (var i in list) {
                obj[list[i][key]] = list[i];
            }
            return obj;
        };

        var param_defaults = [];

        $scope.clear = function () {
            $scope.alg = "";
            $scope.setup = "";
            $scope.current_move = 0;
            $scope.title = "";
        };

        $scope.reset = function () {
            for (var param in param_defaults) {
                $scope[param] = param_defaults[param];
            }
            $scope.speed = 1;
            $scope.clear();
        };

        function initParameter(a) {
            var obj = indexBy(a.list, "id");
            $scope[a.param] = obj[search[a.param]] || obj[a.fallback];
            $scope[a.param + "_map"] = obj;
            $scope[a.param + "_list"] = a.list;
            $scope[a.param + "_default"] = a.fallback;
            param_defaults[a.param] = obj[a.fallback];
        };

        initParameter(initService.puzzles);
        initParameter(initService.stages);
        initParameter(initService.types);
        initParameter(initService.colorSchemes);
        initParameter(initService.views);

        $scope.custom_scheme = "";

        $scope.speed = 1;
        $scope.current_move = "0";

        $scope.setupStatus = "valid";
        $scope.algStatus = "valid";
        $scope.hint_stickers = true;

        $scope.title_default = "";
        $scope.title = $scope.title_default;
        if ("title" in search) {
            $scope.title = search["title"];
        };

        $scope.nextView = function () {
            // TODO: Is there a better way to do view cycling?
            var idx = $scope.view_list.indexOf($scope.view);
            $scope.view = $scope.view_list[(idx + 1) % ($scope.view_list.length)];
            $scope.updateLocation();
        };

        $scope.expand = function () {
            $scope.alg = alg.cube.expand($scope.alg);
        };

        $scope.simplify = function () {
            $scope.alg = alg.cube.simplify($scope.alg);
            $scope.addHistoryCheckpoint = true;
        };

        var inverseTypeMap = {
            "moves": "alg",
            "reconstruction": "reconstruction-end-with-setup",
            "alg": "moves",
            "reconstruction-end-with-setup": "reconstruction"
        };

        $scope.invert = function () {

            // The setup stays the same. It's like magic!
            $scope.alg = alg.cube.invert($scope.alg);

            var currentPosition = twistyScene.getPosition();
            var maxPosition = twistyScene.getMaxPosition();
            $scope.current_move = maxPosition - currentPosition;

            $scope.type = $scope.type_map[inverseTypeMap[$scope.type.id]];

            $scope.addHistoryCheckpoint = true;
        }

        $scope.mirrorAcrossM = function () {
            $scope.setup = alg.cube.mirrorAcrossM($scope.setup);
            $scope.alg = alg.cube.mirrorAcrossM($scope.alg);
            $scope.addHistoryCheckpoint = true;
        }

        $scope.removeComments = function () {
            $scope.setup = alg.cube.removeComments($scope.setup);
            $scope.alg = alg.cube.removeComments($scope.alg);
            $scope.addHistoryCheckpoint = true;
        }

        $scope.mirrorAcrossS = function () {
            $scope.setup = alg.cube.mirrorAcrossS($scope.setup);
            $scope.alg = alg.cube.mirrorAcrossS($scope.alg);
            $scope.addHistoryCheckpoint = true;
        }

        $scope.image = function () {
            var canvas = document.getElementsByTagName("canvas")[0];
            var img = canvas.toDataURL("image/png");
            $("#canvasPNG").fadeTo(0, 0);
            $("#canvasPNG").html('<a href="' + img + '" target="blank"><img src="' + img + '"/></a>');
            $("#canvasPNG").fadeTo("slow", 1);
        }

        $scope.alg = formatterService.unescape_alg(search["alg"]) || systemDefaults.alg_default;
        $scope.setup = formatterService.unescape_alg(search["setup"]) || systemDefaults.setup_default;

        function setWithDefault(name, value) {
            var _default = $scope[name + "_default"];
            // console.log(name);
            // console.log(_default);
            $location.search(name, (value == _default) ? null : value);
        }

        $scope.updateLocation = function () {
            $location.replace();
            setWithDefault("alg", formatterService.escape_alg($scope.alg));
            setWithDefault("setup", formatterService.escape_alg($scope.setup));
            setWithDefault("puzzle", $scope.puzzle.id);
            setWithDefault("type", $scope.type.id);
            setWithDefault("scheme", $scope.scheme.id);
            setWithDefault("stage", $scope.stage.id);
            setWithDefault("title", $scope.title);
            setWithDefault("view", $scope.view.id);
            //TODO: Update sharing links

            // TODO: Inject playback view into parameters properly.
            // Right now it's fine because the view paramater is hidden in editor view, which is the only time you see a forum link.
            $scope.share_url = "http://alg.cubing.net" + $location.url();
            if ($location.url().indexOf("?") !== -1) {
                $scope.share_url += '&view=playback';
            }
            $scope.share_forum_short = "[URL=\"" + $scope.share_url + "\"]" + $scope.alg + "[/URL]";
            $scope.share_forum_long = formatterService.forumLinkText($scope.share_url, $scope.alg, $scope.setup);
        };


        function locationToIndex(text, line, column) {
            var lines = $scope.alg.split("\n");
            var index = 0;
            for (var i = 0; i < line - 1; i++) {
                index += lines[i].length + 1;
            }
            return index + column;
        }

        // We set this variable outside so that it will be overwritten.
        // This currently helps with performance, presumably due to garbage collection.
        var twistyScene;

        var selectionStart = document.getElementById("algorithm").selectionStart;

        $scope.twisty_init = function () {
            $("#viewer").empty();

            var webgl = (function () { try { var canvas = document.createElement('canvas'); return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')); } catch (e) { return false; } })();
            var Renderer = webgl ? THREE.WebGLRenderer : THREE.CanvasRenderer;

            twistyScene = new twisty.scene({
                "allowDragging": true,
                renderer: Renderer,
                cachedRenderer: true
            });
            $("#viewer").append($(twistyScene.getDomElement()));

            twistyScene.initializePuzzle({
                "type": "cube",
                "dimension": $scope.puzzle.dimension,
                "stage": $scope.stage.id,
                "hintStickers": $scope.hint_stickers,
                "cubies": !$scope.hollow,
                "stickerBorder": false,
                "doubleSided": !$scope.hint_stickers,
                // "borderWidth": 1,
                "colors": colorService.colorList($scope.scheme.scheme)
            });

            try {
                var algoFull = alg.cube.fromString($scope.alg);
                $scope.algStatus = "valid";
                var algoCanonical = alg.cube.toString(algoFull);
                if (algoCanonical !== $scope.alg) {
                    $scope.algStatus = "uncanonical";
                }
            } catch (e) {
                $scope.algStatus = "invalid";
            }

            try {
                var init = alg.cube.fromString($scope.setup);
                $scope.setupStatus = "valid";
                var setupCanonical = alg.cube.toString(init);
                if (setupCanonical !== $scope.setup) {
                    $scope.setupStatus = "uncanonical";
                }
            } catch (e) {
                $scope.setupStatus = "invalid";
            }

            var type = $scope.type.type;

            init = alg.cube.toMoves(init);
            var algo = alg.cube.toMoves(algoFull);

            twistyScene.setupAnimation(
              algo,
              {
                  init: init,
                  type: type
              }
            );

            var algNested = algService.isNested(algoFull);

            var previousStart = 0;
            var previousEnd = 0;
            function highlightCurrentMove(force) {
                // if (!force && (algNested || !$scope.animating)) {
                //   return;
                // }
                // TODO: Make a whole lot more efficient.
                if (Math.floor(parseFloat($scope.current_move)) > algo.length) {
                    return;
                }
                var idx = Math.ceil(parseFloat($scope.current_move)) - 1;
                if (idx == -1) {
                    idx = 0;
                }
                var current_move = algo[idx];
                if (typeof current_move === "undefined") {
                    $("#algorithm_shadow").find("#middle").hide();
                    return;
                }
                $("#algorithm_shadow").find("#middle").show();

                var newStart = locationToIndex($scope.alg, current_move.location.first_line, current_move.location.first_column);
                var newEnd = locationToIndex($scope.alg, current_move.location.last_line, current_move.location.last_column);

                if (newStart == previousStart && newEnd == previousEnd) {
                    return;
                }

                $("#algorithm_shadow").find("#start").text($scope.alg.slice(0, newStart));
                $("#algorithm_shadow").find("#middle").text($scope.alg.slice(newStart, newEnd));
                // $("#algorithm_shadow").find("#end"   ).text($scope.alg.slice(newEnd));

                previousStart = newStart;
                previousEnd = newEnd;
            }

            twistyScene.setCameraPosition(0.5, 3);

            var resizeFunction = function () {
                $("#algorithm_shadow").width($("#algorithm").width());
                twistyScene.resize();
                // Force redraw. iOS Safari until iOS 7 has a bug where vh units are not recalculated.
                // Hiding and then showing immediately was the first thing I tried that forces a recalculation.
                $("#controls").find("button").hide().show();
                // Also fixes an iOS Safari reorientation bug.
                window.scrollTo(0, 0);
            };
            var debounceResize = debounce(resizeFunction, 0);
            $(window).resize(resizeFunction);
            $scope.$watch("view", resizeFunction);

            $("#moveIndex").val(0); //TODO: Move into twisty.js

            function getCurrentMove() {
                // console.log(twistyScene.debug.getIndex());
                var idx = twistyScene.getPosition();
                var val = parseFloat($scope.current_move);
                if (idx != val && fire) {
                    $scope.$apply("current_move = " + idx);
                    // TODO: Move listener to detect index change.
                    highlightCurrentMove();
                }
            }

            function gettingCurrentMove(f) {
                return function () {
                    f();
                    getCurrentMove();
                }
            }

            // TODO: With a single twistyScene this own't be necessary
            $("#reset, #back, #play, #pause, #forward, #skip").unbind("click");
            $(document).unbind("selectionchange");

            var start = gettingCurrentMove(twistyScene.play.start);
            var reset = gettingCurrentMove(twistyScene.play.reset);

            $("#reset").click(reset);
            $("#back").click(gettingCurrentMove(twistyScene.play.back));
            $("#play").click(function () {
                if ($scope.animating) {
                    twistyScene.play.pause();
                }
                else {
                    var algEnded = (parseFloat($scope.current_move) === algo.length);
                    if (algEnded) {
                        $(document.getElementById("viewer").children[0].children[0])
                          .fadeOut(100, reset)
                          .fadeIn(400, start);
                    }
                    else {
                        start();
                    }
                }
            });
            $("#forward").click(gettingCurrentMove(twistyScene.play.forward));
            $("#skip").click(gettingCurrentMove(twistyScene.play.skip));

            $("#currentMove").attr("max", algo.length);

            function followSelection(apply, debKind) {

                selectionStart = document.getElementById("algorithm").selectionStart;
                for (var i = 0; i < algo.length; i++) {
                    var move = algo[i];
                    var loc = locationToIndex($scope.alg, move.location.first_line, move.location.first_column);
                    if (loc == selectionStart && loc !== 0) {
                        // Show the beginning of the current move if our cursor is... at the beginning.
                        // TODO: Handle moves like R1000 properly.
                        i += 0.2;
                        break;
                    }
                    if (loc >= selectionStart) {
                        break;
                    }
                }
                fire = false;
                // console.log(apply)
                // if (apply) {
                $scope.current_move = i;
                // $scope.$apply("current_move = " + i);
                // }
                twistyScene.setPosition(i);
                fire = true;
                highlightCurrentMove();
                return;
            }
            $(document).bind("selectionchange", function (event) {
                if (!$scope.algDelayed) {
                    followSelection(true);
                }
            });

            followSelection(false);

            // twistyScene.play.reset();
            twistyScene.addListener("animating", function (animating) {
                $scope.$apply("animating = " + animating);
            });
            twistyScene.addListener("position", getCurrentMove);
            $scope.$watch('current_move', function () {
                $("#currentMove").css({
                    "background": "linear-gradient(to right, \
        #cc181e 0%, \
        #cc181e " + (($scope.current_move / $("#currentMove").attr("max")) * 100) + "%, \
        #AAA " + (($scope.current_move / $("#currentMove").attr("max")) * 100) + "%, \
        #AAA 100%)"
                });
                var idx = twistyScene.getPosition();
                var val = parseFloat($scope.current_move);
                if (fire) {
                    // We need to parse the string.
                    // See https://github.com/angular/angular.js/issues/1189 and linked issue/discussion.
                    twistyScene.setPosition(val);
                }
                highlightCurrentMove();
            });
            $scope.$watch('speed', function () {
                twistyScene.setSpeed($scope.speed);
            }); // initialize the watch

            $scope.updateLocation();
        };

        [
          "setup",
          "alg",
          "puzzle",
          "stage",
          "type",
          "scheme",
          "title",
          "hint_stickers",
          "hollow"
        ].map(function (prop) {
            $scope.$watch(prop, $scope.twisty_init);
        });

        var metrics = ["obtm", "btm", "obqtm", "etm"];

        function updateMetrics() {
            var algo = alg.cube.fromString($scope.alg);
            for (var i in metrics) {
                var metric = metrics[i];
                $scope[metric] = alg.cube.countMoves(algo, {
                    metric: metric,
                    dimension: $scope.puzzle.dimension
                });
            }
        }
        $scope.$watch("alg", updateMetrics);

        $scope.setupDelayed = false;
        $scope.setupDebounce = function (event) {
            $scope.setupDelayed = (event == "delayed");
        }

        $scope.algDelayed = false;
        $scope.algDebounce = function (event) {
            $scope.algDelayed = (event == "delayed")
        }

        // TODO: Use IFs for puzzle/type
        var demos = {
            "mats-5.55": {
                puzzle: $scope.puzzle_map["3x3x3"],
                type: $scope.type_map["reconstruction"],
                title: "Mats Valk, 5.55 WR",
                setup: "D2 U' R2 U F2 D2 U' R2 U' B' L2 R' B' D2 U B2 L' D' R2",
                alg: "x y' // inspection\nF R D L F // cross\nU R U' R' d R' U R // 1st pair\ny U2' R' U' R // 2nd pair\nU L U' L' d R U' R' // 3rd pair\ny' U' R U R' U R U' R' // 4th pair (OLS)\nR2' U' R' U' R U R U R U' R U2' // PLL"
            },
            "T-Perm": {
                type: $scope.type_map["alg"],
                title: "T-Perm",
                setup: "",
                alg: "R U R' U' R' F R2 U' R' U' R U R' F'"
            },
            "Sune": {
                type: $scope.type_map["alg"],
                title: "Sune",
                setup: "",
                alg: "[R U R2, R U R']"
            },
            "notation": {
                puzzle: $scope.puzzle_map["5x5x5"],
                type: $scope.type_map["moves"],
                title: "Notation Stress Test",
                setup: "M2 U M2 U2 M2 U M2",
                alg: "R L U D B F // Single moves, variable spacing.\nB' F' D' U' L' R' // Inverses.\nR L2 R3 L2' R5 L8' R7 // Move amount\nU . U . U . U // Pauses.\nM' E2 S2 M S2 E2 // Slice turns.\nM2' U' M2' U2' M2' U' M2' // H'perm.\nx y z // Rotations.\nR2 L2 R2' L2' // Half turns.\nRw r' // Wide turns.\n4Rw x L' // Very wide turns\n2-3Lw 3-4r // Wide block turns\n[[R: U], D2] // commutator/conjugate/nesting\n([R: U'] D2)2' [R: U2] // Grouping and repetition"
            }
        }

        $scope.demo = function (name) {
            // $scope.reset();
            var demo = demos[name];
            for (i in demo) {
                $scope[i] = demo[i];
            }
        }

        // For debugging.
        ss = $scope;
        l = $location;
    }]);