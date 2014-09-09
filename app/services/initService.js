angular.module('algxApp')
.factory('initService', function () {

    var returnMe = {};

    returnMe.puzzles = {
        param: "puzzle",
        fallback: "3x3x3",
        list: [
        { id: "2x2x2", name: "2x2x2", group: "Cube", dimension: 2 },
          { id: "3x3x3", name: "3x3x3", group: "Cube", dimension: 3 },
          { id: "4x4x4", name: "4x4x4", group: "Cube", dimension: 4 },
          { id: "5x5x5", name: "5x5x5", group: "Cube", dimension: 5 },
          { id: "6x6x6", name: "6x6x6", group: "Cube", dimension: 6 },
          { id: "7x7x7", name: "7x7x7", group: "Cube", dimension: 7 },
          { id: "8x8x8", name: "8x8x8", group: "Cube", dimension: 8 },
          { id: "9x9x9", name: "9x9x9", group: "Cube", dimension: 9 },
          { id: "17x17x17", name: "17x17x17", group: "Cube", dimension: 17 }, // Over the top!
          { id: "1x1x1", name: "1x1x1", group: "Fun", dimension: 1 },
        ]
    };

    returnMe.stages = {
        param: "stage",
        fallback: "full",
        list: [
      { "id": "full", name: "Full", group: "Stage" },
      { "id": "PLL", name: "PLL", group: "Fridrich" },
      { "id": "OLL", name: "OLL", group: "Fridrich" },
      { "id": "LL", name: "LL", group: "Fridrich" },
      { "id": "F2L", name: "F2L", group: "Fridrich" },
      { "id": "CLS", name: "CLS", group: "MGLS" },
      { "id": "ELS", name: "ELS", group: "MGLS" },
      { "id": "L6E", name: "L6E", group: "Roux" },
      { "id": "WV", name: "WV", group: "Variation" }
        ]
    };

    returnMe.types = {
        param: "type",
        fallback: "moves",
        list: [
      {
          id: "moves",
          name: "Moves",
          group: "Start from Setup",
          setup: "Setup",
          alg: "Moves",
          type: "generator",
          setup_moves: "setup moves",
          alg_moves: "moves",
          reconstruction: false
      },
      {
          id: "reconstruction",
          name: "Reconstruction",
          group: "Start from Setup",
          setup: "Scramble",
          alg: "Solve",
          type: "generator",
          setup_moves: "scramble moves",
          alg_moves: "reconstruction moves",
          reconstruction: true
      },
      {
          id: "alg",
          name: "Algorithm",
          group: "End Solved / End with Setup",
          setup: "Setup",
          alg: "Algorithm",
          type: "solve",
          setup_moves: "setup moves for end position",
          alg_moves: "algorithm moves",
          reconstruction: false
      },
      {
          id: "reconstruction-end-with-setup",
          name: "Reconstruction (no scramble)",
          group: "End Solved / End with Setup",
          setup: "Setup",
          alg: "Solve",
          type: "solve",
          setup_moves: "setup moves for end position",
          alg_moves: "reconstruction moves",
          reconstruction: true
      }
        ]
    };

    // TODO: BOY/Japanese translations.
    returnMe.colorSchemes = {
        param: "scheme",
        fallback: "boy",
        list: [
      { id: "boy", name: "BOY", type: "Color Scheme", scheme: "grobyw", display: "BOY", custom: false },
      { id: "japanese", name: "Japanese", type: "Color Scheme", scheme: "groybw", display: "Japanese", custom: false },
      { id: "custom", name: "Custom:", type: "Color Scheme", scheme: "grobyw", display: "", custom: true }
        ]
    };

    returnMe.views = {
        param: "view", fallback: "editor", list: [
          { id: "editor", next: "playback", fullscreen: false, infoPane: true, extraControls: true, highlightMoveFields: true },
          { id: "playback", next: "fullscreen", fullscreen: false, infoPane: true, extraControls: false, highlightMoveFields: false },
          { id: "fullscreen", next: "editor", fullscreen: true, infoPane: false, extraControls: false, highlightMoveFields: false }
        ]
    };

    return returnMe;
});