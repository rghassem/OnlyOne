/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./libs/TypedPriorityQueue.ts":
/*!************************************!*\
  !*** ./libs/TypedPriorityQueue.ts ***!
  \************************************/
/*! exports provided: TypedPriorityQueue */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TypedPriorityQueue", function() { return TypedPriorityQueue; });

class TypedPriorityQueue {
    constructor(comparator) {
        if (!(this instanceof TypedPriorityQueue))
            return new TypedPriorityQueue(comparator);
        this.array = [];
        this.size = 0;
        this.compare = comparator || TypedPriorityQueue.defaultcomparator;
    }
    static defaultcomparator(a, b) {
        return a < b;
    }
    ;
    add(myval) {
        var i = this.size;
        this.array[this.size] = myval;
        this.size += 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            const ap = this.array[p];
            if (!this.compare(myval, ap)) {
                break;
            }
            this.array[i] = ap;
            i = p;
        }
        this.array[i] = myval;
    }
    ;
    heapify(arr) {
        this.array = arr;
        this.size = arr.length;
        var i;
        for (i = (this.size >> 1); i >= 0; i--) {
            this._percolateDown(i);
        }
    }
    ;
    _percolateUp(i) {
        var myval = this.array[i];
        while (i > 0) {
            const p = (i - 1) >> 1;
            const ap = this.array[p];
            if (!this.compare(myval, ap)) {
                break;
            }
            this.array[i] = ap;
            i = p;
        }
        this.array[i] = myval;
    }
    ;
    _percolateDown(i) {
        var size = this.size;
        var hsize = this.size >>> 1;
        var ai = this.array[i];
        while (i < hsize) {
            let l = (i << 1) + 1;
            const r = l + 1;
            let bestc = this.array[l];
            if (r < size) {
                if (this.compare(this.array[r], bestc)) {
                    l = r;
                    bestc = this.array[r];
                }
            }
            if (!this.compare(bestc, ai)) {
                break;
            }
            this.array[i] = bestc;
            i = l;
        }
        this.array[i] = ai;
    }
    ;
    peek() {
        if (this.size === 0)
            return undefined;
        return this.array[0];
    }
    ;
    poll() {
        if (this.size === 0)
            return undefined;
        var ans = this.array[0];
        if (this.size > 1) {
            this.array[0] = this.array[--this.size];
            this._percolateDown(0 | 0);
        }
        else {
            this.size -= 1;
        }
        return ans;
    }
    ;
    replaceTop(myval) {
        if (this.size == 0)
            return undefined;
        var ans = this.array[0];
        this.array[0] = myval;
        this._percolateDown(0 | 0);
        return ans;
    }
    ;
    trim() {
        this.array = this.array.slice(0, this.size);
    }
    ;
    isEmpty() {
        return this.size === 0;
    }
    ;
}


/***/ }),

/***/ "./src/animation.ts":
/*!**************************!*\
  !*** ./src/animation.ts ***!
  \**************************/
/*! exports provided: animate, wait, runAnimations, clearAnimations, TweeningFunctions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "animate", function() { return animate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "wait", function() { return wait; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "runAnimations", function() { return runAnimations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearAnimations", function() { return clearAnimations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TweeningFunctions", function() { return TweeningFunctions; });
let animations = new Array();
function animate(object, property, targetValue, duration, tween) {
    const startingValue = object[property];
    return new Promise((resolve, reject) => {
        animations.push({
            object,
            property,
            startingValue,
            targetValue,
            duration,
            tween,
            progress: 0,
            stop: false,
            onDone: () => {
                resolve();
            }
        });
    });
}
function wait(durationSeconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, durationSeconds * 1000);
    });
}
function runAnimations(delta) {
    for (const anim of animations) {
        anim.progress += (delta / anim.duration);
        if (anim.progress > 1) {
            anim.object[anim.property] = anim.targetValue;
            anim.stop = true;
            anim.onDone();
        }
        else {
            const currentValue = anim.startingValue + ((anim.targetValue - anim.startingValue) * anim.tween(anim.progress));
            anim.object[anim.property] = currentValue;
        }
    }
    animations = animations.filter(anim => !anim.stop);
}
function clearAnimations() {
    animations.forEach(anim => anim.onDone());
    animations = [];
}
const TweeningFunctions = {
    linear: function (t) { return t; },
    easeInQuad: function (t) { return t * t; },
    easeOutQuad: function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    easeInCubic: function (t) { return t * t * t; },
    easeOutCubic: function (t) { return (--t) * t * t + 1; },
    easeInOutCubic: function (t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },
    easeOutBounce: function (progress) {
        if (progress < (1 / 2.75)) {
            return 7.5625 * progress * progress;
        }
        else if (progress < (2 / 2.75)) {
            return 7.5625 * (progress -= (1.5 / 2.75)) * progress + .75;
        }
        else if (progress < (2.5 / 2.75)) {
            return 7.5625 * (progress -= (2.25 / 2.75)) * progress + .9375;
        }
        else {
            return 7.5625 * (progress -= (2.625 / 2.75)) * progress + .984375;
        }
    }
};


/***/ }),

/***/ "./src/board.ts":
/*!**********************!*\
  !*** ./src/board.ts ***!
  \**********************/
/*! exports provided: maxY, maxX, Gameboard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxY", function() { return maxY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxX", function() { return maxX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gameboard", function() { return Gameboard; });
/* harmony import */ var _letterEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./letterEntity */ "./src/letterEntity.ts");
/* harmony import */ var _randomNumberGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./randomNumberGenerator */ "./src/randomNumberGenerator.ts");


const maxY = 13;
const maxX = 8;
class Gameboard {
    constructor(entities) {
        this.firstLetterScored = false;
        this.secondLetterScored = false;
        this.thirdLetterScored = false;
        this.lost = false;
        if (entities) {
            this.entities = entities;
        }
        else {
            this.entities = new Array();
        }
    }
    static fromString(preset, levelNum, frequencies) {
        const result = new Gameboard();
        const rng = new _randomNumberGenerator__WEBPACK_IMPORTED_MODULE_1__["RandomNumberGenerator"](13);
        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                const index2d = x + (maxX * y);
                if (preset.length >= index2d && preset.charAt(index2d) !== '*') {
                    let letterStr = preset.charAt(index2d);
                    if (letterStr === ' ')
                        continue;
                    if (letterStr === '0')
                        letterStr = 'First';
                    if (letterStr === '1')
                        letterStr = 'Second';
                    if (letterStr === '2')
                        letterStr = 'Third';
                    const letter = _letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"][letterStr];
                    result.addLetter(letter, x, y);
                }
                else {
                    const randomLetter = Object(_letterEntity__WEBPACK_IMPORTED_MODULE_0__["getRandomLetter"])(rng.get(), x, y, frequencies);
                    result.addLetter(randomLetter, x, y);
                }
            }
        }
        result.level = levelNum;
        return result;
    }
    static fromSeed(seed, frequencies) {
        const result = new Gameboard();
        const rng = new _randomNumberGenerator__WEBPACK_IMPORTED_MODULE_1__["RandomNumberGenerator"](seed);
        for (let y = 0; y < maxY; ++y) {
            for (let x = 0; x < maxX; ++x) {
                const randomLetter = Object(_letterEntity__WEBPACK_IMPORTED_MODULE_0__["getRandomLetter"])(rng.get(), x, y, frequencies);
                result.addLetter(randomLetter, x, y);
            }
        }
        const topArea = 50;
        const used = [Math.floor(rng.get() * topArea)];
        for (let i = 0; i <= 3; ++i) {
            let idx = Math.floor(rng.get() * topArea);
            while (used.indexOf(idx) >= 0) {
                idx = Math.floor(rng.get() * topArea);
            }
            used.push(idx);
        }
        result.entities[used[0]].letter = _letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].First;
        result.entities[used[1]].letter = _letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].Second;
        result.entities[used[2]].letter = _letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].Third;
        result.level = seed;
        return result;
    }
    addLetter(letter, x, y) {
        this.entities.push(new _letterEntity__WEBPACK_IMPORTED_MODULE_0__["LetterEntity"](letter, x, y));
    }
    removeLetterEntity(entity) {
        const target = this.entities.indexOf(entity);
        this.entities.splice(target, 1);
    }
    getLetterEntity(x, y) {
        return this.entities.find(entity => entity.x === x && entity.y === y);
    }
    clone() {
        const entities = this.entities.map(entity => new _letterEntity__WEBPACK_IMPORTED_MODULE_0__["LetterEntity"](entity.letter, entity.x, entity.y));
        const copy = new Gameboard(entities);
        copy.firstLetterScored = this.firstLetterScored;
        copy.secondLetterScored = this.secondLetterScored;
        copy.thirdLetterScored = this.thirdLetterScored;
        return copy;
    }
}


/***/ }),

/***/ "./src/boardEffect.ts":
/*!****************************!*\
  !*** ./src/boardEffect.ts ***!
  \****************************/
/*! exports provided: BoardEffectType */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoardEffectType", function() { return BoardEffectType; });
var BoardEffectType;
(function (BoardEffectType) {
    BoardEffectType[BoardEffectType["Destroy"] = 0] = "Destroy";
    BoardEffectType[BoardEffectType["Explode"] = 1] = "Explode";
    BoardEffectType[BoardEffectType["Fall"] = 2] = "Fall";
    BoardEffectType[BoardEffectType["Move"] = 3] = "Move";
    BoardEffectType[BoardEffectType["Transform"] = 4] = "Transform";
    BoardEffectType[BoardEffectType["BlockDestruction"] = 5] = "BlockDestruction";
    BoardEffectType[BoardEffectType["Score"] = 6] = "Score";
    BoardEffectType[BoardEffectType["ScoreDestroy"] = 7] = "ScoreDestroy";
})(BoardEffectType || (BoardEffectType = {}));


/***/ }),

/***/ "./src/button.ts":
/*!***********************!*\
  !*** ./src/button.ts ***!
  \***********************/
/*! exports provided: makeButton */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeButton", function() { return makeButton; });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render.ts");

function makeButton(stage, width, height, buttonText, onClick) {
    const button = new PIXI.Graphics();
    const borderWidth = 2;
    draw(button, width, height, borderWidth, 0x330303, 0x660303);
    const text = new PIXI.Text(buttonText);
    text.style = new PIXI.TextStyle({
        fontFamily: _render__WEBPACK_IMPORTED_MODULE_0__["FontFamily"],
        fontSize: 32,
        fill: '#ffffff',
        stroke: '#4a1850',
        strokeThickness: 5,
        wordWrap: true,
        wordWrapWidth: 200,
    });
    text.anchor.set(1);
    button.addChild(text);
    text.x = button.width / 2;
    text.y = button.height / 2;
    stage.addChild(button);
    button.interactive = true;
    button
        .on('pointerover', () => {
        text.style.fill = '#FF0000';
        draw(button, width, height, borderWidth, 0x330303, 0xffff00);
    })
        .on('pointerout', () => {
        text.style.fill = '#FFFFFF';
        draw(button, width, height, borderWidth, 0x330303, 0x660303);
    })
        .on('pointerdown', () => onClick());
    return button;
}
function draw(button, width, height, borderWidth, color, borderColor) {
    button.clear();
    button.beginFill(borderColor);
    button.drawRoundedRect(-borderWidth, -borderWidth, width + 2 * borderWidth, height + 2 * borderWidth, 5);
    button.endFill();
    button.moveTo(0, 0);
    button.beginFill(color);
    button.drawRoundedRect(0, 0, width, height, 5);
    button.endFill();
}


/***/ }),

/***/ "./src/gameState.ts":
/*!**************************!*\
  !*** ./src/gameState.ts ***!
  \**************************/
/*! exports provided: checkWin, checkLose, resetScore, updateState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkWin", function() { return checkWin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkLose", function() { return checkLose; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetScore", function() { return resetScore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateState", function() { return updateState; });
/* harmony import */ var _boardEffect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boardEffect */ "./src/boardEffect.ts");
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./board */ "./src/board.ts");
/* harmony import */ var _gapFill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gapFill */ "./src/gapFill.ts");
/* harmony import */ var _letterEntity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letterEntity */ "./src/letterEntity.ts");
/* harmony import */ var _letters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letters */ "./src/letters.ts");





function checkWin(gameboard) {
    return gameboard.firstLetterScored
        && gameboard.secondLetterScored
        && gameboard.thirdLetterScored;
}
function checkLose(gameboard) {
    return gameboard.lost;
}
function resetScore(gameboard) {
    gameboard.firstLetterScored = false;
    gameboard.secondLetterScored = false;
    gameboard.thirdLetterScored = false;
}
function updateState(gameboard, changes) {
    let result = new Array();
    let gaps = new Array();
    const possibleGaps = new Array();
    const queuedMoves = new Array();
    for (let i = 0; i < changes.length; ++i) {
        const effect = changes[i];
        switch (effect.effect) {
            case _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Destroy:
                const letter = effect.entity.letter;
                if (letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].First ||
                    letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Second ||
                    letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Third) {
                    gameboard.lost = true;
                }
            case _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].ScoreDestroy:
                gaps.push(new _gapFill__WEBPACK_IMPORTED_MODULE_2__["Gap"](effect.entity.x, effect.entity.y));
                destroy(effect.entity);
                break;
            case _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Fall:
                result = result.concat(fall(effect.entity, effect.toY));
                break;
            case _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Move:
                queuedMoves.push({ entity: effect.entity, x: effect.toX, y: effect.toY });
                possibleGaps.push(new _gapFill__WEBPACK_IMPORTED_MODULE_2__["Gap"](effect.entity.x, effect.entity.y));
                let y = effect.toY;
                const test = _board__WEBPACK_IMPORTED_MODULE_1__["maxY"];
                for (let i = y; i <= test; ++i) {
                    possibleGaps.push(new _gapFill__WEBPACK_IMPORTED_MODULE_2__["Gap"](effect.toX, i));
                }
                break;
            case _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Transform:
                effect.entity.letter = effect.changeTo;
                break;
            case _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Score:
                result = result.concat(score(gameboard, effect.entity));
                break;
        }
    }
    const outOfBoundsDestroys = new Array();
    queuedMoves.forEach(qm => move(qm, outOfBoundsDestroys));
    gaps = gaps.concat(possibleGaps.filter(gap => !gameboard.getLetterEntity(gap.x, gap.y)));
    const fallEffects = Object(_gapFill__WEBPACK_IMPORTED_MODULE_2__["fillGaps"])(gameboard, gaps);
    result = result.concat(fallEffects).concat(outOfBoundsDestroys);
    return result;
    function move(queuedMove, results = []) {
        const entity = queuedMove.entity;
        entity.x = queuedMove.x;
        entity.y = queuedMove.y;
        if (Object(_letters__WEBPACK_IMPORTED_MODULE_4__["isOutOfBounds"])(entity)) {
            results.push({ effect: _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Destroy, entity });
        }
        return results;
    }
    function destroy(entity) {
        gameboard.removeLetterEntity(entity);
    }
    function fall(entity, toY) {
        entity.y = toY;
        if (hasReachedBottomRow(entity)) {
            return [
                {
                    entity,
                    effect: _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Score
                }
            ];
        }
        return [];
    }
    function hasReachedBottomRow(letter) {
        return (letter.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].First || letter.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Second || letter.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Third) && letter.y === _board__WEBPACK_IMPORTED_MODULE_1__["maxY"] - 1;
    }
    function score(gameboard, entity) {
        gameboard.firstLetterScored = gameboard.firstLetterScored || entity.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].First;
        gameboard.secondLetterScored = gameboard.secondLetterScored || entity.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Second;
        gameboard.thirdLetterScored = gameboard.thirdLetterScored || entity.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Third;
        const results = [
            {
                entity,
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].ScoreDestroy
            }
        ];
        return results;
    }
}


/***/ }),

/***/ "./src/gapFill.ts":
/*!************************!*\
  !*** ./src/gapFill.ts ***!
  \************************/
/*! exports provided: Gap, fillGaps */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Gap", function() { return Gap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fillGaps", function() { return fillGaps; });
/* harmony import */ var _boardEffect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boardEffect */ "./src/boardEffect.ts");
/* harmony import */ var _letters__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./letters */ "./src/letters.ts");


class Gap {
    constructor(x, y, distance = 1) {
        this.x = x;
        this.y = y;
        this.distance = distance;
    }
}
function fillGaps(board, gaps) {
    let results = new Array();
    let orderedGaps = gaps.sort((g1, g2) => g1.y - g2.y);
    while (orderedGaps.length > 0) {
        const gap = gaps.pop();
        if (gap.y === 0)
            continue;
        if (Object(_letters__WEBPACK_IMPORTED_MODULE_1__["isOutOfBounds"])(gap))
            continue;
        const above = board.getLetterEntity(gap.x, gap.y - 1);
        if (above) {
            results.push({
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_0__["BoardEffectType"].Fall,
                entity: above,
                toX: gap.x,
                toY: above.y + gap.distance
            });
            const insertIndex = orderedGaps.findIndex(gap => gap.y === gap.y - 1);
            orderedGaps.splice(insertIndex, 0, new Gap(gap.x, gap.y - 1, gap.distance));
            continue;
        }
        const aboveGap = orderedGaps.find(other => other.x === gap.x && other.y === gap.y - 1);
        if (aboveGap) {
            aboveGap.distance += gap.distance;
        }
    }
    return results;
}


/***/ }),

/***/ "./src/letterEntity.ts":
/*!*****************************!*\
  !*** ./src/letterEntity.ts ***!
  \*****************************/
/*! exports provided: Letter, letterVisuals, getRandomLetter, LetterEntity */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Letter", function() { return Letter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "letterVisuals", function() { return letterVisuals; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getRandomLetter", function() { return getRandomLetter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LetterEntity", function() { return LetterEntity; });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.ts");

var Letter;
(function (Letter) {
    Letter[Letter["First"] = 0] = "First";
    Letter[Letter["Second"] = 1] = "Second";
    Letter[Letter["Third"] = 2] = "Third";
    Letter[Letter["O"] = 3] = "O";
    Letter[Letter["N"] = 4] = "N";
    Letter[Letter["E"] = 5] = "E";
    Letter[Letter["R"] = 6] = "R";
    Letter[Letter["L"] = 7] = "L";
    Letter[Letter["U"] = 8] = "U";
    Letter[Letter["D"] = 9] = "D";
    Letter[Letter["W"] = 10] = "W";
    Letter[Letter["I"] = 11] = "I";
    Letter[Letter["C"] = 12] = "C";
    Letter[Letter["X"] = 13] = "X";
    Letter[Letter["Y"] = 14] = "Y";
    Letter[Letter["B"] = 15] = "B";
    Letter[Letter["M"] = 16] = "M";
    Letter[Letter["Z"] = 17] = "Z";
    Letter[Letter["A"] = 18] = "A";
    Letter[Letter["K"] = 19] = "K";
    Letter[Letter["S"] = 20] = "S";
    Letter[Letter["P"] = 21] = "P";
    Letter[Letter["T"] = 22] = "T";
    Letter[Letter["G"] = 23] = "G";
    Letter[Letter["Length"] = 24] = "Length";
})(Letter || (Letter = {}));
class LetterVisual {
    constructor(char, name = '', description = "We didn't implement this one yet!", color = "#ffffff") {
        this.char = char;
        this.name = name;
        this.description = description;
        this.color = color;
    }
}
const letterVisuals = new Map();
letterVisuals.set(Letter.First, new LetterVisual('0', "Get this to the bottom!", "Get this to the bottom row!", "#FFFF00"));
letterVisuals.set(Letter.Second, new LetterVisual('1', "Get this to the bottom!", "Get this to the bottom row!", "#FFFF00"));
letterVisuals.set(Letter.Third, new LetterVisual('2', "Get this to the bottom!", "Get this to the bottom row!", "#FFFF00"));
letterVisuals.set(Letter.R, new LetterVisual('R', 'Right', 'Destroys all letters to the right. Blocked by walls.'));
letterVisuals.set(Letter.L, new LetterVisual('L', 'Left', 'Destroys all letters to the left. Blocked by walls.'));
letterVisuals.set(Letter.U, new LetterVisual('U', 'Up', 'Destroys all letters above it. Blocked by walls.'));
letterVisuals.set(Letter.D, new LetterVisual('D', 'Down', 'Destroys all letters below it. Blocked by walls.'));
letterVisuals.set(Letter.W, new LetterVisual('W', 'Wall', 'Blocks all letter destruction effects. Can be destroyed normally.', '#55B560'));
letterVisuals.set(Letter.I, new LetterVisual('I', 'Invisible', 'Can only be destroyed by letter abilities.', '#4FA4E4'));
letterVisuals.set(Letter.C, new LetterVisual('C', 'Cross', 'Destroys one block in each cardinal direction.', '#99041D'));
letterVisuals.set(Letter.X, new LetterVisual('X', 'X Bomb', 'Destroys one block at each corner.', '#99041D'));
letterVisuals.set(Letter.Y, new LetterVisual('Y', 'Yttrium Bomb', 'We kinda just liked the pattern.', '#99041D'));
letterVisuals.set(Letter.O, new LetterVisual('O', 'O'));
letterVisuals.set(Letter.N, new LetterVisual('N', 'N'));
letterVisuals.set(Letter.E, new LetterVisual('E', 'E'));
letterVisuals.set(Letter.B, new LetterVisual('B', 'B'));
letterVisuals.set(Letter.M, new LetterVisual('M', 'M'));
letterVisuals.set(Letter.Z, new LetterVisual('Z', 'Z'));
letterVisuals.set(Letter.A, new LetterVisual('A', 'A'));
letterVisuals.set(Letter.K, new LetterVisual('K', 'K'));
letterVisuals.set(Letter.S, new LetterVisual('S', 'S'));
letterVisuals.set(Letter.P, new LetterVisual('P', 'P'));
letterVisuals.set(Letter.T, new LetterVisual('T', 'Twist', "Rotate all letters clockwise", '#07a32b'));
letterVisuals.set(Letter.G, new LetterVisual('G', 'G'));
function getRandomLetter(rand01, posX, posY, frequencyMap) {
    let rand = rand01 * 100;
    let sum = 0;
    for (let key of frequencyMap.keys()) {
        sum += frequencyMap.get(key);
        if (rand <= sum && isAllowedAtPos(key)) {
            return key;
        }
    }
    return Letter.I;
    function isAllowedAtPos(letter) {
        return !(letter === Letter.T && (posX === 0 || posX === _board__WEBPACK_IMPORTED_MODULE_0__["maxX"] - 1 ||
            posY === 0 || posY === _board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 1));
    }
}
class LetterEntity {
    constructor(letter, x, y) {
        this.letter = letter;
        this.x = x;
        this.y = y;
    }
}


/***/ }),

/***/ "./src/letters.ts":
/*!************************!*\
  !*** ./src/letters.ts ***!
  \************************/
/*! exports provided: isBomb, onLetterPressed, destroyLetters, doLetterEffect, isOutOfBounds */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBomb", function() { return isBomb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onLetterPressed", function() { return onLetterPressed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "destroyLetters", function() { return destroyLetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "doLetterEffect", function() { return doLetterEffect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isOutOfBounds", function() { return isOutOfBounds; });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.ts");
/* harmony import */ var _boardEffect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boardEffect */ "./src/boardEffect.ts");
/* harmony import */ var _letterEntity__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./letterEntity */ "./src/letterEntity.ts");



var EffectOutcome;
(function (EffectOutcome) {
    EffectOutcome[EffectOutcome["Destroy"] = 0] = "Destroy";
    EffectOutcome[EffectOutcome["Prevent"] = 1] = "Prevent";
    EffectOutcome[EffectOutcome["Chain"] = 2] = "Chain";
})(EffectOutcome || (EffectOutcome = {}));
const chainingLetters = [
    _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].C,
    _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].X,
    _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].Y
];
function isBomb(letter) {
    return letter === _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].C || letter === _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].X || letter === _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].Y;
}
const processedLetters = new Set();
function onLetterPressed(gameboard, entity) {
    const effects = [];
    doLetterEffect(gameboard, entity, effects);
    processedLetters.clear();
    return effects;
}
function attemptDestroy(entity) {
    if (entity.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].W) {
        return EffectOutcome.Prevent;
    }
    else if (chainingLetters.indexOf(entity.letter) > -1) {
        return EffectOutcome.Chain;
    }
    else {
        return EffectOutcome.Destroy;
    }
}
function filterValidLetters(board, positions, prevent) {
    const letters = [];
    for (let position of positions) {
        const entity = board.getLetterEntity(position.x, position.y);
        if (entity) {
            const entityId = `${entity.x}_${entity.y}`;
            if (!processedLetters.has(entityId)) {
                processedLetters.add(entityId);
                letters.push(entity);
                if (prevent && entity.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].W) {
                    break;
                }
            }
        }
    }
    return letters;
}
function destroyLetters(board, letters, effects = []) {
    for (let letter of letters) {
        const outcome = attemptDestroy(letter);
        if (outcome === EffectOutcome.Prevent) {
            effects.push({
                entity: letter,
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].BlockDestruction,
            });
        }
        else if (outcome === EffectOutcome.Destroy) {
            effects.push({
                entity: letter,
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Destroy
            });
        }
        else if (outcome === EffectOutcome.Chain) {
            effects.push({
                entity: letter,
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Explode
            });
            doLetterEffect(board, letter, effects);
            effects.push({
                entity: letter,
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Destroy
            });
        }
    }
    return effects;
}
function doLetterEffect(board, entity, effects) {
    if (!entity)
        return;
    switch (entity.letter) {
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].L:
            return left(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].R:
            return right(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].U:
            return up(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].D:
            return down(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].I:
            return prevent(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].First:
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].Second:
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].Third:
            return [];
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].C:
            return cross(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].T:
            const rotation = rotateAround(entity);
            const changeSelf = {
                entity,
                effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Transform,
                changeTo: _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].I
            };
            effects.push(...rotation.concat(changeSelf));
            return effects;
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].Y:
            return ybomb(entity, effects);
        case _letterEntity__WEBPACK_IMPORTED_MODULE_2__["Letter"].X:
            return diagonal(entity, effects);
        default:
            return itself(entity, effects);
    }
    function itself(entity, effects) {
        effects.push({
            entity,
            effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Destroy
        });
        return effects;
    }
    function prevent(entity, effects) {
        effects.push({
            entity,
            effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].BlockDestruction
        });
        return effects;
    }
    function ybomb(entity, effects) {
        const patterns = [
            {
                x: entity.x,
                y: entity.y
            },
            {
                x: entity.x - 1,
                y: entity.y - 1
            },
            {
                x: entity.x + 1,
                y: entity.y - 1,
            },
            {
                x: entity.x,
                y: entity.y + 1
            }
        ];
        const letters = filterValidLetters(board, patterns, false);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function cross(entity, effects) {
        const cardinal = [
            {
                x: entity.x,
                y: entity.y
            },
            {
                x: entity.x,
                y: entity.y - 1
            },
            {
                x: entity.x + 1,
                y: entity.y
            },
            {
                x: entity.x,
                y: entity.y + 1
            },
            {
                x: entity.x - 1,
                y: entity.y
            }
        ];
        const letters = filterValidLetters(board, cardinal, false);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function diagonal(entity, effects) {
        const diagonal = [
            {
                x: entity.x,
                y: entity.y
            },
            {
                x: entity.x - 1,
                y: entity.y - 1
            },
            {
                x: entity.x + 1,
                y: entity.y - 1
            },
            {
                x: entity.x - 1,
                y: entity.y + 1
            },
            {
                x: entity.x + 1,
                y: entity.y + 1
            }
        ];
        const letters = filterValidLetters(board, diagonal, false);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function right(entity, effects) {
        let letterPositions = [];
        for (let i = entity.x; i < _board__WEBPACK_IMPORTED_MODULE_0__["maxX"]; ++i) {
            letterPositions.push({
                x: i,
                y: entity.y
            });
        }
        const letters = filterValidLetters(board, letterPositions, true);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function left(entity, effects) {
        let letterPositions = [];
        for (let i = entity.x; i >= 0; --i) {
            letterPositions.push({
                x: i,
                y: entity.y
            });
        }
        const letters = filterValidLetters(board, letterPositions, true);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function up(entity, effects) {
        let letterPositions = [];
        for (let i = entity.y; i >= 0; --i) {
            letterPositions.push({
                x: entity.x,
                y: i
            });
        }
        const letters = filterValidLetters(board, letterPositions, true);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function down(entity, effects) {
        let letterPositions = [];
        for (let i = entity.y; i < _board__WEBPACK_IMPORTED_MODULE_0__["maxY"]; ++i) {
            letterPositions.push({
                x: entity.x,
                y: i
            });
        }
        const letters = filterValidLetters(board, letterPositions, false);
        destroyLetters(board, letters, effects);
        return effects;
    }
    function rotateAround(entity) {
        let movements = new Array();
        let centerX = entity.x;
        let centerY = entity.y;
        for (let x = -1; x <= 1; ++x) {
            for (let y = -1; y <= 1; ++y) {
                let newX = centerX + x;
                let newY = centerY + y;
                if (x === 0 && y === 0)
                    continue;
                if (x === 0 || y === 0) {
                    if (x === 0)
                        newX -= y;
                    if (y === 0)
                        newY += x;
                }
                else {
                    if (x + y === 0)
                        newY += x;
                    else
                        newX -= y;
                }
                movements.push({ x: centerX + x, y: centerY + y, toX: newX, toY: newY });
            }
        }
        movements = movements.filter(move => !isOutOfBounds(move));
        const results = [];
        for (const move of movements) {
            const entity = board.getLetterEntity(move.x, move.y);
            if (entity) {
                results.push(makeMove(entity, move.toX, move.toY));
            }
        }
        return results;
    }
    function makeMove(entity, toX, toY) {
        return {
            entity,
            effect: _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Move,
            toX: toX,
            toY: toY
        };
    }
}
function isOutOfBounds(pos) {
    return pos.x < 0 || pos.x >= _board__WEBPACK_IMPORTED_MODULE_0__["maxX"]
        || pos.y < 0 || pos.y >= _board__WEBPACK_IMPORTED_MODULE_0__["maxY"];
}


/***/ }),

/***/ "./src/levelTypes.ts":
/*!***************************!*\
  !*** ./src/levelTypes.ts ***!
  \***************************/
/*! exports provided: LevelTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelTypes", function() { return LevelTypes; });
/* harmony import */ var _letterEntity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./letterEntity */ "./src/letterEntity.ts");

const LevelTypes = {
    'DefaultLetterFrequency': new Map([
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].L, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].R, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].U, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].D, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].W, 12],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].I, 14],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].C, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].Y, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].X, 9],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].T, 10],
    ]),
    "InvisibleHeavy": new Map([
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].L, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].R, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].U, 8],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].D, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].W, 6],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].I, 40],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].C, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].Y, 4],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].X, 4],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].T, 8],
    ]),
    "BombHeavy": new Map([
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].L, 9],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].R, 9],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].U, 4],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].D, 4],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].W, 12],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].I, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].C, 15],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].Y, 15],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].X, 15],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].T, 12],
    ]),
    "TwistHeavy": new Map([
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].L, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].R, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].U, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].D, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].W, 10],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].I, 9],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].C, 8],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].Y, 8],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].X, 5],
        [_letterEntity__WEBPACK_IMPORTED_MODULE_0__["Letter"].T, 40],
    ])
};


/***/ }),

/***/ "./src/levels.ts":
/*!***********************!*\
  !*** ./src/levels.ts ***!
  \***********************/
/*! exports provided: MaxLevels, LevelSequenceLength, getLevel, endScreen, winScreen, loseScreen */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaxLevels", function() { return MaxLevels; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelSequenceLength", function() { return LevelSequenceLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLevel", function() { return getLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "endScreen", function() { return endScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "winScreen", function() { return winScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loseScreen", function() { return loseScreen; });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.ts");
/* harmony import */ var _levelTypes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./levelTypes */ "./src/levelTypes.ts");


const MaxLevels = 999;
const LevelSequenceLength = 10;
const levels = new Map();
levels.set(0, levelOne());
levels.set(1, levelTwo());
levels.set(2, levelThree());
levels.set(3, levelFour());
levels.set(4, levelFive());
function getLevel(level, forceFrequencyMap) {
    if (forceFrequencyMap) {
        return _board__WEBPACK_IMPORTED_MODULE_0__["Gameboard"].fromSeed(level, forceFrequencyMap);
    }
    else if (levels.has(level)) {
        return _board__WEBPACK_IMPORTED_MODULE_0__["Gameboard"].fromString(levels.get(level), level, _levelTypes__WEBPACK_IMPORTED_MODULE_1__["LevelTypes"].DefaultLetterFrequency);
    }
    else {
        const sequenceIndex = Math.floor(level / 10);
        const levelInSequence = level - (sequenceIndex * LevelSequenceLength);
        if (sequenceIndex > levelSequences.length) {
            return endScreen();
        }
        const sequence = levelSequences[sequenceIndex];
        if (levelInSequence > sequence.levels.length) {
            return endScreen();
        }
        const seed = sequence.levels[levelInSequence];
        const frequencies = _levelTypes__WEBPACK_IMPORTED_MODULE_1__["LevelTypes"][sequence.frequencies];
        return _board__WEBPACK_IMPORTED_MODULE_0__["Gameboard"].fromSeed(seed, frequencies);
    }
}
function endScreen() {
    return _board__WEBPACK_IMPORTED_MODULE_0__["Gameboard"].fromString(' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * Math.floor(_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] / 2))
        + ' THE END' +
        ' '.repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * Math.floor(_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] / 2)), 0, _levelTypes__WEBPACK_IMPORTED_MODULE_1__["LevelTypes"].DefaultLetterFrequency);
}
function winScreen() {
    return _board__WEBPACK_IMPORTED_MODULE_0__["Gameboard"].fromString(' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * Math.floor(_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] / 2))
        + ' WINNER ' +
        ' '.repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * Math.floor(_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] / 2)), 0, _levelTypes__WEBPACK_IMPORTED_MODULE_1__["LevelTypes"].DefaultLetterFrequency);
}
function loseScreen() {
    return _board__WEBPACK_IMPORTED_MODULE_0__["Gameboard"].fromString(' '.repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * Math.floor(_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] / 2))
        + 'TRYAGAIN' +
        ' '.repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * Math.floor(_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] / 2)), 0, _levelTypes__WEBPACK_IMPORTED_MODULE_1__["LevelTypes"].DefaultLetterFrequency);
}
function levelOne() {
    return ' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 2))
        + '  012   '
        + 'IIWIIIIL';
}
function levelTwo() {
    const result = ' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 6))
        + 'MUSICIBY'
        + 'PERITUNE'
        + 'I2IIIII2'
        + 'IDIIIIID'
        + 'III01III'
        + 'RIIIIIII';
    return result;
}
function levelThree() {
    const result = ' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 6))
        + 'BY  REZA'
        + 'AND MARK'
        + '0I0IIIII'
        + 'DIW1IIIW'
        + 'IIID2III'
        + 'WIUIICIU';
    return result;
}
function levelFour() {
    const result = ' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 7))
        + 'IIIIII1I'
        + 'IIIIIII1'
        + 'IIIIIICI'
        + 'IIIIIIIY'
        + 'R0IIIRCI'
        + 'IYID2IIC'
        + 'RIUIICWW';
    return result;
}
function levelFive() {
    const result = ' '
        .repeat(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 10))
        + '**0I1I2*'
        + '1IIII0I1'
        + 'III2IICI'
        + '********'
        + '********'
        + '********'
        + '********'
        + '********'
        + '********'
        + '********';
    return result;
}


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! exports provided: currentLevel, maxLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "currentLevel", function() { return currentLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "maxLevel", function() { return maxLevel; });
/* harmony import */ var _letters__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./letters */ "./src/letters.ts");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ "./src/render.ts");
/* harmony import */ var _gameState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gameState */ "./src/gameState.ts");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./animation */ "./src/animation.ts");
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./board */ "./src/board.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./button */ "./src/button.ts");
/* harmony import */ var _sounds__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sounds */ "./src/sounds.ts");
/* harmony import */ var _levels__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./levels */ "./src/levels.ts");
/* harmony import */ var _boardEffect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./boardEffect */ "./src/boardEffect.ts");
/* harmony import */ var _solver__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./solver */ "./src/solver.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};










const EnableSolver = false;
const app = new PIXI.Application();
console.log(`window.devicePixelRatio: ${window.devicePixelRatio}`);
const letterStage = new PIXI.Container();
app.stage.addChild(letterStage);
let solveButton;
let muteTexture;
let unmuteTexture;
let resetTexture;
let leftTexture;
let rightTexture;
let muteButton;
let resetButton;
let leftButton;
let rightButton;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoDensity = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
function resize(resizeRenderer = false) {
    if (resizeRenderer) {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    }
    const letterStageWidth = _render__WEBPACK_IMPORTED_MODULE_1__["CellWidth"] * _board__WEBPACK_IMPORTED_MODULE_4__["maxX"];
    const letterStageHeight = _render__WEBPACK_IMPORTED_MODULE_1__["CellHeight"] * _board__WEBPACK_IMPORTED_MODULE_4__["maxY"];
    letterStage.x = app.screen.width / 2 - letterStageWidth / 2;
    letterStage.y = app.screen.height / 2 - letterStageHeight / 2;
    const scoreCenterLine = 608;
    const scoringAreaHeight = 200;
    if (solveButton) {
        solveButton.x = letterStage.x + 400;
        solveButton.y = letterStage.y + 300;
    }
    if (muteButton) {
        muteButton.x = letterStage.x;
        muteButton.y = letterStage.y + scoreCenterLine;
    }
    if (resetButton) {
        resetButton.x = letterStage.x + 320;
        resetButton.y = letterStage.y + scoreCenterLine;
    }
    if (leftButton) {
        leftButton.x = letterStage.x + 50;
        leftButton.y = letterStage.y + scoreCenterLine;
    }
    if (rightButton) {
        rightButton.x = letterStage.x + 260;
        rightButton.y = letterStage.y + scoreCenterLine;
    }
    const actualWidth = letterStageWidth * 1.15;
    const actualHeight = letterStageHeight + _render__WEBPACK_IMPORTED_MODULE_1__["ScoringAreaOffset"] + scoringAreaHeight;
    const scaleFactorW = app.screen.width / actualWidth;
    const scaleFactorH = app.screen.height / actualHeight;
    const scaleFactor = Math.min(scaleFactorH, scaleFactorW);
    if (scaleFactor < 1) {
        const scaleAdjustment = (1 - scaleFactor) / 2;
        app.stage.x = app.screen.width * scaleAdjustment;
        app.stage.y = app.screen.height * scaleAdjustment;
        app.stage.scale.set(scaleFactor);
    }
}
window.onresize = () => {
    resize(true);
};
document.getElementById('oo').appendChild(app.view);
var font = new FontFaceObserver(_render__WEBPACK_IMPORTED_MODULE_1__["FontFamily"]);
font.load(null, 5000).then(function () {
    console.log('Font is available');
    createButtons();
    start();
}, function () {
    console.log('Font is not available after waiting 5 seconds');
});
let currentLevel = 0;
let maxLevel = 0;
function initLevel() {
    const queryParams = new URLSearchParams(new URL(document.URL).search);
    const paramLevel = queryParams.get("level");
    const forceLevel = paramLevel && parseInt(paramLevel) ? parseInt(paramLevel) : null;
    currentLevel = forceLevel || Number(window.localStorage.getItem('level')) || 0;
    maxLevel = Number(window.localStorage.getItem('maxLevel')) || 0;
    leftButton.visible = currentLevel > 0;
    rightButton.visible = currentLevel < maxLevel;
}
function decreaseLevel() {
    currentLevel -= 1;
    window.localStorage.setItem('level', '' + currentLevel);
    leftButton.visible = currentLevel > 0;
    rightButton.visible = currentLevel < maxLevel;
}
function advanceLevel() {
    currentLevel += 1;
    window.localStorage.setItem('level', '' + currentLevel);
    leftButton.visible = currentLevel > 0;
    rightButton.visible = currentLevel < maxLevel;
    if (currentLevel > maxLevel) {
        maxLevel = currentLevel;
        window.localStorage.setItem('maxLevel', '' + maxLevel);
    }
}
function createButtons() {
    muteTexture = PIXI.Texture.from('assets/volume-mute-solid.svg');
    unmuteTexture = PIXI.Texture.from('assets/volume-up-solid.svg');
    resetTexture = PIXI.Texture.from('assets/undo-alt-solid.svg');
    rightTexture = PIXI.Texture.from('assets/caret-right-solid.svg');
    leftTexture = PIXI.Texture.from('assets/caret-left-solid.svg');
    muteButton = new PIXI.Sprite(unmuteTexture);
    resetButton = new PIXI.Sprite(resetTexture);
    rightButton = new PIXI.Sprite(rightTexture);
    leftButton = new PIXI.Sprite(leftTexture);
    app.stage.addChild(muteButton);
    app.stage.addChild(resetButton);
    app.stage.addChild(leftButton);
    app.stage.addChild(rightButton);
}
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        let resolving = false;
        let specialScreen = false;
        muteButton.interactive = true;
        muteButton.on("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            muteButton.texture = Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["toggleSound"])() ? muteTexture : unmuteTexture;
        }));
        resetButton.interactive = true;
        resetButton.on("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            specialScreen = false;
            Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["shootSound"])();
            const board = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel));
            gameboard = board;
            resolving = false;
        }));
        leftButton.interactive = true;
        leftButton.on("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            specialScreen = false;
            Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["shootSound"])();
            decreaseLevel();
            const board = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel));
            gameboard = board;
            resolving = false;
        }));
        rightButton.interactive = true;
        rightButton.on("pointerdown", () => __awaiter(this, void 0, void 0, function* () {
            specialScreen = false;
            Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["shootSound"])();
            advanceLevel();
            const board = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel));
            gameboard = board;
            resolving = false;
        }));
        if (EnableSolver) {
            solveButton = Object(_button__WEBPACK_IMPORTED_MODULE_5__["makeButton"])(app.stage, 80, 28, "Solve", () => __awaiter(this, void 0, void 0, function* () {
                resolving = true;
                const solution = yield Object(_solver__WEBPACK_IMPORTED_MODULE_9__["solve"])(gameboard);
                while (solution.solved && solution.bestPath.moves.length > 0 && !Object(_gameState__WEBPACK_IMPORTED_MODULE_2__["checkWin"])(gameboard)) {
                    const turn = solution.bestPath.moves.shift();
                    const move = gameboard.getLetterEntity(turn.x, turn.y);
                    if (!move) {
                        throw new Error(`Invalid move from AI (${turn.x}, ${turn.y})`);
                    }
                    yield resolveMove(move);
                }
                resolving = false;
            }));
        }
        resize();
        app.ticker.add(() => {
            Object(_animation__WEBPACK_IMPORTED_MODULE_3__["runAnimations"])(app.ticker.elapsedMS / 1000);
        });
        initLevel();
        let gameboard = Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel);
        gameboard = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel));
        if (currentLevel === 0) {
            Object(_render__WEBPACK_IMPORTED_MODULE_1__["tellUserWhatLetterToClick"])(gameboard, 7, 12);
        }
        _render__WEBPACK_IMPORTED_MODULE_1__["events"].onLetterClick = (entity) => {
            if (resolving)
                return;
            resolving = true;
            resolveMove(entity).then(() => resolving = false);
        };
        function resolveMove(entity) {
            return __awaiter(this, void 0, void 0, function* () {
                let effects = Object(_letters__WEBPACK_IMPORTED_MODULE_0__["onLetterPressed"])(gameboard, entity);
                while (effects.length !== 0) {
                    yield Object(_render__WEBPACK_IMPORTED_MODULE_1__["drawEffects"])(letterStage, gameboard, effects);
                    effects = Object(_gameState__WEBPACK_IMPORTED_MODULE_2__["updateState"])(gameboard, effects);
                }
                if (Object(_gameState__WEBPACK_IMPORTED_MODULE_2__["checkWin"])(gameboard)) {
                    advanceLevel();
                    changeLevel(currentLevel);
                }
                else if (Object(_gameState__WEBPACK_IMPORTED_MODULE_2__["checkLose"])(gameboard)) {
                    playLoseScreen();
                }
            });
        }
        function playLoseScreen() {
            return __awaiter(this, void 0, void 0, function* () {
                specialScreen = true;
                gameboard = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["loseScreen"])());
                Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["blockSound"])();
                yield Object(_animation__WEBPACK_IMPORTED_MODULE_3__["wait"])(0.1);
                Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["blockSound"])();
                yield Object(_animation__WEBPACK_IMPORTED_MODULE_3__["wait"])(0.2);
                Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["blockSound"])();
                yield Object(_animation__WEBPACK_IMPORTED_MODULE_3__["wait"])(0.7);
                const destroyWinLetters = gameboard.entities
                    .map(entity => {
                    if (entity.letter !== undefined)
                        return { entity, effect: _boardEffect__WEBPACK_IMPORTED_MODULE_8__["BoardEffectType"].Destroy };
                    else
                        return null;
                })
                    .filter(effect => effect !== null);
                if (specialScreen)
                    yield Object(_render__WEBPACK_IMPORTED_MODULE_1__["drawEffects"])(letterStage, gameboard, destroyWinLetters);
                if (specialScreen) {
                    gameboard = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel));
                    specialScreen = false;
                }
            });
        }
        function changeLevel(level) {
            return __awaiter(this, void 0, void 0, function* () {
                window.localStorage.setItem('currentlevel', '' + level);
                specialScreen = true;
                gameboard = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["winScreen"])());
                Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["bonusSound"])();
                yield Object(_animation__WEBPACK_IMPORTED_MODULE_3__["wait"])(0.7);
                Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["bonusSound"])();
                yield Object(_animation__WEBPACK_IMPORTED_MODULE_3__["wait"])(0.7);
                const destroyWinLetters = gameboard.entities
                    .map(entity => {
                    if (entity.letter !== undefined)
                        return { entity, effect: _boardEffect__WEBPACK_IMPORTED_MODULE_8__["BoardEffectType"].Destroy };
                    else
                        return null;
                })
                    .filter(effect => effect !== null);
                if (level === 1)
                    Object(_sounds__WEBPACK_IMPORTED_MODULE_6__["bgmusic"])();
                if (specialScreen) {
                    if (specialScreen)
                        yield Object(_render__WEBPACK_IMPORTED_MODULE_1__["drawEffects"])(letterStage, gameboard, destroyWinLetters);
                    gameboard = yield reset(Object(_levels__WEBPACK_IMPORTED_MODULE_7__["getLevel"])(currentLevel));
                    specialScreen = false;
                }
            });
        }
        function reset(newBoard) {
            return __awaiter(this, void 0, void 0, function* () {
                Object(_animation__WEBPACK_IMPORTED_MODULE_3__["clearAnimations"])();
                Object(_gameState__WEBPACK_IMPORTED_MODULE_2__["resetScore"])(gameboard);
                yield Object(_render__WEBPACK_IMPORTED_MODULE_1__["resetScreen"])(newBoard, letterStage);
                return newBoard;
            });
        }
    });
}


/***/ }),

/***/ "./src/randomNumberGenerator.ts":
/*!**************************************!*\
  !*** ./src/randomNumberGenerator.ts ***!
  \**************************************/
/*! exports provided: RandomNumberGenerator */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RandomNumberGenerator", function() { return RandomNumberGenerator; });
class RandomNumberGenerator {
    constructor(seed) {
        this.seed = seed;
        this.get = function () {
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280;
            return rnd;
        };
    }
}


/***/ }),

/***/ "./src/render.ts":
/*!***********************!*\
  !*** ./src/render.ts ***!
  \***********************/
/*! exports provided: CellWidth, CellHeight, ScoringAreaOffset, events, FontFamily, resetScreen, drawEffects, tellUserWhatLetterToClick, description, tooltip */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CellWidth", function() { return CellWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CellHeight", function() { return CellHeight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ScoringAreaOffset", function() { return ScoringAreaOffset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "events", function() { return events; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontFamily", function() { return FontFamily; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetScreen", function() { return resetScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawEffects", function() { return drawEffects; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tellUserWhatLetterToClick", function() { return tellUserWhatLetterToClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "description", function() { return description; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tooltip", function() { return tooltip; });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.ts");
/* harmony import */ var _boardEffect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./boardEffect */ "./src/boardEffect.ts");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./animation */ "./src/animation.ts");
/* harmony import */ var _sounds__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sounds */ "./src/sounds.ts");
/* harmony import */ var _main__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./main */ "./src/main.ts");
/* harmony import */ var _letterEntity__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./letterEntity */ "./src/letterEntity.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






const CellWidth = 45;
const CellHeight = CellWidth;
const ScoringAreaOffset = 15;
let events = {
    onLetterClick: null
};
let pixiLetters;
const firstScoreLetter = new PIXI.Text('0');
const secondScoreLetter = new PIXI.Text('1');
const thirdScoreLetter = new PIXI.Text('2');
const FontFamily = "vt323regular";
const LetterMoveDuration = 0.4;
function resetScreen(gameboard, stage) {
    return __awaiter(this, void 0, void 0, function* () {
        if (pixiLetters) {
            for (const letter of pixiLetters.values()) {
                stage.removeChild(letter);
                letter.destroy();
            }
        }
        pixiLetters = new Map();
        const entrances = new Array();
        drawScore(stage);
        drawGameboard(gameboard, stage, entrances);
        drawDescription(stage);
        drawTooltip(stage);
        updateTooltip('');
        yield Promise.all(entrances);
    });
}
function drawGameboard(gameboard, stage, entrances) {
    for (const entity of gameboard.entities) {
        const newLetter = drawLetter(entity, stage);
        newLetter.y -= _board__WEBPACK_IMPORTED_MODULE_0__["maxY"] * CellHeight;
        const duration = 1.2 + ((entity.x / _board__WEBPACK_IMPORTED_MODULE_0__["maxX"]) * 0.2);
        entrances.push(Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(newLetter, 'y', entity.y * CellHeight, duration, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].easeOutBounce));
        pixiLetters.set(entity, newLetter);
    }
}
function drawEffects(stage, gameboard, effects) {
    return __awaiter(this, void 0, void 0, function* () {
        const promises = new Array();
        let playBounce = false;
        let pauseForEffect = false;
        for (const boardEffect of effects) {
            const letter = pixiLetters.get(boardEffect.entity);
            if (!letter)
                continue;
            switch (boardEffect.effect) {
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].ScoreDestroy:
                    updateScoredLetters(gameboard);
                    Object(_sounds__WEBPACK_IMPORTED_MODULE_3__["bonusSound"])();
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Destroy:
                    pauseForEffect = true;
                    letter.alpha = 0;
                    Object(_sounds__WEBPACK_IMPORTED_MODULE_3__["explosionSound"])();
                    yield ghettoAssExplosion(stage, boardEffect, 100);
                    stage.removeChild(letter);
                    break;
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].BlockDestruction:
                    yield pulse(letter);
                    break;
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Explode:
                    yield pulse(letter);
                    break;
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Fall:
                    playBounce = true;
                    const anim = Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(letter, 'y', boardEffect.toY * CellHeight, LetterMoveDuration, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].easeOutBounce);
                    promises.push(anim);
                    break;
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Move:
                    const moveY = Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(letter, 'y', boardEffect.toY * CellHeight, LetterMoveDuration, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].easeInCubic);
                    const moveX = Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(letter, 'x', boardEffect.toX * CellWidth, LetterMoveDuration, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].easeInCubic);
                    promises.push(moveX, moveY);
                    break;
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Transform:
                    yield pulse(letter);
                    updateStyle(letter, boardEffect.changeTo);
                    break;
                case _boardEffect__WEBPACK_IMPORTED_MODULE_1__["BoardEffectType"].Score:
                    break;
            }
        }
        if (playBounce)
            Object(_sounds__WEBPACK_IMPORTED_MODULE_3__["bounceSound"])(0.2);
        yield Promise.all(promises);
        if (pauseForEffect)
            yield Object(_animation__WEBPACK_IMPORTED_MODULE_2__["wait"])(0.4);
    });
}
function tellUserWhatLetterToClick(board, x, y) {
    return __awaiter(this, void 0, void 0, function* () {
        const letter = board.getLetterEntity(x, y);
        if (!letter)
            return;
        let target;
        target = pixiLetters.get(letter);
        while (target) {
            try {
                yield pulse(target);
            }
            catch (e) {
                console.log("First letter destroyed during pulse (this is fine)");
            }
            yield Object(_animation__WEBPACK_IMPORTED_MODULE_2__["wait"])(1);
            target = pixiLetters.get(letter);
        }
    });
}
function drawScore(stage) {
    const scoringLine = new PIXI.Graphics();
    scoringLine.lineStyle(3, 0xffff00);
    scoringLine.moveTo(-CellWidth / 2, 0);
    scoringLine.lineTo(_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * CellWidth, 0);
    scoringLine.x = 0;
    scoringLine.y = _board__WEBPACK_IMPORTED_MODULE_0__["maxY"] * CellHeight;
    stage.addChild(scoringLine);
    const scoringY = _board__WEBPACK_IMPORTED_MODULE_0__["maxY"] * CellHeight + ScoringAreaOffset;
    const level = _main__WEBPACK_IMPORTED_MODULE_4__["currentLevel"] + 1;
    const hundreds = Math.floor(level / 100) % 10;
    const tens = Math.floor(level / 10) % 10;
    const ones = level % 10;
    firstScoreLetter.text = hundreds.toString();
    secondScoreLetter.text = tens.toString();
    thirdScoreLetter.text = ones.toString();
    firstScoreLetter.x = (_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * CellWidth) / 2 - 32 - 64;
    firstScoreLetter.y = scoringY;
    secondScoreLetter.x = (_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * CellWidth) / 2 - 32;
    secondScoreLetter.y = scoringY;
    thirdScoreLetter.x = (_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * CellWidth) / 2 - 32 + 64;
    thirdScoreLetter.y = scoringY;
    firstScoreLetter.style = new PIXI.TextStyle({
        fontFamily: FontFamily,
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 440
    });
    secondScoreLetter.style = new PIXI.TextStyle({
        fontFamily: FontFamily,
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 440
    });
    thirdScoreLetter.style = new PIXI.TextStyle({
        fontFamily: FontFamily,
        fontSize: 64,
        fill: '#000000',
        stroke: '#ffffff',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 440
    });
    stage.addChild(firstScoreLetter);
    stage.addChild(secondScoreLetter);
    stage.addChild(thirdScoreLetter);
}
function updateScoredLetters(gameboard) {
    if (gameboard.firstLetterScored) {
        firstScoreLetter.style.fill = '#FFFF00';
        firstScoreLetter.style.stroke = '#4a1850';
    }
    if (gameboard.secondLetterScored) {
        secondScoreLetter.style.fill = '#FFFF00';
        secondScoreLetter.style.stroke = '#4a1850';
    }
    if (gameboard.thirdLetterScored) {
        thirdScoreLetter.style.fill = '#FFFF00';
        thirdScoreLetter.style.stroke = '#4a1850';
    }
}
const description = new PIXI.Text("* Press a letter\n* Score ONE point \n* Don't destroy ONE ");
function drawDescription(stage) {
    description.style = new PIXI.TextStyle({
        fontFamily: FontFamily,
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 200,
    });
    description.x = 400;
    description.y = 100;
    stage.addChild(description);
}
const tooltip = new PIXI.Text('');
function drawTooltip(stage) {
    tooltip.style = new PIXI.TextStyle({
        fontFamily: FontFamily,
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true,
        wordWrap: true,
        wordWrapWidth: 200,
    });
    tooltip.anchor.set(0.5, 0.5);
    tooltip.x = (_board__WEBPACK_IMPORTED_MODULE_0__["maxX"] * CellWidth) / 2;
    tooltip.y = -20;
    stage.addChild(tooltip);
}
function updateTooltip(text) {
    tooltip.text = text;
}
function drawLetter(entity, stage) {
    const gridx = entity.x * CellWidth;
    const gridy = entity.y * CellHeight;
    const text = new PIXI.Text();
    const style = new PIXI.TextStyle({
        fontFamily: FontFamily,
        fontSize: 52,
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadow: true
    });
    text.style = style;
    updateStyle(text, entity.letter);
    text.x = gridx;
    text.y = gridy;
    text.interactive = true;
    text.buttonMode = true;
    text
        .on('pointerover', () => {
        text.style.fill = '#FF0000';
    })
        .on('pointerout', () => {
        const letter = _letterEntity__WEBPACK_IMPORTED_MODULE_5__["letterVisuals"].get(entity.letter);
        if (!letter)
            return;
        text.style.fill = letter.color || "#FFFFFF";
    })
        .on('pointerdown', () => {
        events.onLetterClick && events.onLetterClick(entity);
        const letter = _letterEntity__WEBPACK_IMPORTED_MODULE_5__["letterVisuals"].get(entity.letter);
        if (!letter)
            return;
        updateTooltip(`${letter.name}`);
    });
    stage.addChild(text);
    return text;
}
function updateStyle(pixiText, letter) {
    if (pixiText.alpha === 0) {
        pixiText.alpha = 1;
    }
    const viz = _letterEntity__WEBPACK_IMPORTED_MODULE_5__["letterVisuals"].get(letter);
    if (viz) {
        pixiText.style.fill = viz.color;
        if (viz.char !== pixiText.text) {
            if (letter === _letterEntity__WEBPACK_IMPORTED_MODULE_5__["Letter"].First) {
                pixiText.text = firstScoreLetter.text;
            }
            else if (letter === _letterEntity__WEBPACK_IMPORTED_MODULE_5__["Letter"].Second) {
                pixiText.text = secondScoreLetter.text;
            }
            else if (letter === _letterEntity__WEBPACK_IMPORTED_MODULE_5__["Letter"].Third) {
                pixiText.text = thirdScoreLetter.text;
            }
            else {
                pixiText.text = viz.char;
            }
        }
    }
}
function pulse(pixiText) {
    return __awaiter(this, void 0, void 0, function* () {
        Object(_sounds__WEBPACK_IMPORTED_MODULE_3__["blockSound"])();
        pixiText.pivot.set(0.5, 0.5);
        Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(pixiText.scale, 'x', 1.4, 0.1, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].linear);
        yield Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(pixiText.scale, 'y', 1.4, 0.1, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].linear);
        Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(pixiText.scale, 'x', 1, 0.2, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].easeOutCubic);
        yield Object(_animation__WEBPACK_IMPORTED_MODULE_2__["animate"])(pixiText.scale, 'y', 1, 0.2, _animation__WEBPACK_IMPORTED_MODULE_2__["TweeningFunctions"].easeOutCubic);
        pixiText.pivot.set(0, 0);
    });
}
let cachedExplosion = null;
function ghettoAssExplosion(stage, boardEffect, durationMS) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let explosion;
            if (cachedExplosion) {
                explosion = cachedExplosion;
                cachedExplosion = null;
            }
            else {
                explosion = new PIXI.Graphics();
            }
            stage.addChild(explosion);
            explosion.x = (boardEffect.entity.x * CellWidth) + CellWidth / 4;
            explosion.y = (boardEffect.entity.y * CellHeight) + CellHeight / 4;
            const time = durationMS;
            let elapsed = 0;
            let previous;
            const startingRadius = 0.01;
            const endingRadius = 15;
            const frame = (now) => {
                let delta;
                if (previous) {
                    delta = now - previous;
                }
                else {
                    delta = 0;
                }
                previous = now;
                elapsed += delta;
                let progress = (elapsed / time);
                const radius = startingRadius + (endingRadius - startingRadius) * progress;
                explosion.clear();
                explosion.beginFill(0xE25822);
                explosion.drawCircle(0, 0, radius);
                explosion.endFill();
                if (elapsed < time) {
                    requestAnimationFrame(frame);
                }
                else {
                    stage.removeChild(explosion);
                    if (!cachedExplosion) {
                        cachedExplosion = explosion;
                    }
                    else {
                        explosion.destroy();
                    }
                    Object(_animation__WEBPACK_IMPORTED_MODULE_2__["wait"])(0.01).then(() => resolve());
                }
            };
            requestAnimationFrame(frame);
        });
    });
}


/***/ }),

/***/ "./src/solver.ts":
/*!***********************!*\
  !*** ./src/solver.ts ***!
  \***********************/
/*! exports provided: printSolution, solve */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printSolution", function() { return printSolution; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "solve", function() { return solve; });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/board.ts");
/* harmony import */ var _libs_TypedPriorityQueue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs/TypedPriorityQueue */ "./libs/TypedPriorityQueue.ts");
/* harmony import */ var _strategy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./strategy */ "./src/strategy.ts");
/* harmony import */ var _letterEntity__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./letterEntity */ "./src/letterEntity.ts");
/* harmony import */ var _letters__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./letters */ "./src/letters.ts");
/* harmony import */ var _gameState__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gameState */ "./src/gameState.ts");






const StepsPerRun = 100;
function printSolution(solution) {
    if (solution.solved) {
        console.log(`
        -------- Solved --------
            Shortest Path: ${solution.shortestPathLength}
            Solved Runs: ${solution.runs.filter(run => run.numberOfSolutions > 0).map(run => run.strategy)}
        ------------------------
        `);
    }
    else {
        console.log(`
        ------- Unsolved -------`);
    }
}
function solve(board) {
    let pathQueue;
    let solved = false;
    let currentRun = 0;
    const runs = new Array();
    do {
        pathQueue = new _libs_TypedPriorityQueue__WEBPACK_IMPORTED_MODULE_1__["TypedPriorityQueue"](comparePathByScore);
        pathQueue.add({ moves: [], score: 0, state: board });
        const runWins = new Array();
        let steps = 0;
        let firstSolutionSteps = -1;
        let runSolved = false;
        while (steps < StepsPerRun && !pathQueue.isEmpty()) {
            step(pathQueue.poll(), _strategy__WEBPACK_IMPORTED_MODULE_2__["strategyList"][currentRun], runWins);
            ++steps;
            if (!runSolved && runWins.length > 0) {
                solved = true;
                runSolved = true;
                firstSolutionSteps = steps;
            }
        }
        const numberOfSolutions = runWins.length;
        let shortestPathLength;
        let bestPath;
        if (runSolved) {
            bestPath = (runWins.length === 1)
                ? runWins.pop()
                : runWins.reduce((a, b) => a.moves.length < b.moves.length ? a : b);
            shortestPathLength = bestPath.moves.length;
        }
        else {
            shortestPathLength = -1;
            bestPath = pathQueue.peek();
        }
        const bestScore = bestPath.score;
        runs.push({
            strategy: _strategy__WEBPACK_IMPORTED_MODULE_2__["strategyList"][currentRun].name,
            steps, numberOfSolutions,
            firstSolutionSteps,
            bestPath, shortestPathLength, bestScore
        });
        currentRun++;
    } while (currentRun < _strategy__WEBPACK_IMPORTED_MODULE_2__["strategyList"].length && !pathQueue.isEmpty());
    const solvedRuns = runs.filter(run => run.numberOfSolutions > 0);
    let bestRun;
    if (solvedRuns.length > 0) {
        bestRun = solvedRuns.reduce((a, b) => a.shortestPathLength < b.shortestPathLength ? a : b);
    }
    else {
        bestRun = runs.reduce((a, b) => a.bestScore > b.bestScore ? a : b);
    }
    const sucessfulStrategies = solvedRuns.map(run => run.strategy);
    return {
        level: board.level,
        solved,
        runs,
        sucessfulStrategies,
        shortestPathLength: bestRun.shortestPathLength,
        bestPath: bestRun.bestPath
    };
    function step(path, weights, wins) {
        const availableMoves = getMoves(path.state);
        if (availableMoves.length === 0) {
            return;
        }
        for (let i = 0; i < availableMoves.length; ++i) {
            let testBoard = path.state.clone();
            let testBoardMoves = getMoves(testBoard);
            const letter = testBoardMoves[i];
            testBoard = doMove(testBoard, letter);
            let score = evaluate(testBoard, path.moves.length, weights);
            if (score === -Infinity)
                continue;
            let move = { x: letter.x, y: letter.y };
            const newPath = {
                moves: path.moves.concat(move),
                score: score,
                state: testBoard
            };
            if (score == Infinity) {
                wins.push(newPath);
            }
            else {
                pathQueue.add(newPath);
            }
        }
    }
}
function getMoves(board) {
    return board.entities.filter(entity => canClick(entity.letter));
}
function doMove(board, clickedEntity) {
    let effects = Object(_letters__WEBPACK_IMPORTED_MODULE_4__["onLetterPressed"])(board, clickedEntity);
    while (effects.length !== 0) {
        effects = Object(_gameState__WEBPACK_IMPORTED_MODULE_5__["updateState"])(board, effects);
    }
    return board;
}
function evaluate(board, moveCount, weights) {
    const scored = (board.firstLetterScored ? 1 : 0) + (board.secondLetterScored ? 1 : 0) + (board.thirdLetterScored ? 1 : 0);
    if (scored === 3)
        return Infinity;
    const first = board.entities.find(state => state.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].First);
    const second = board.entities.find(state => state.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Second);
    const third = board.entities.find(state => state.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Third);
    if ((!first && !board.firstLetterScored)
        || (!second && !board.secondLetterScored)
        || (!third && !board.thirdLetterScored))
        return -Infinity;
    const firstHeight = !first ? 0 : normalizedDistanceFromTop010(first.y);
    const secondHeight = !second ? 0 : normalizedDistanceFromTop010(second.y);
    const thirdHeight = !third ? 0 : normalizedDistanceFromTop010(third.y);
    const scorers = [first, second, third].filter(letter => letter !== undefined);
    let bombsBeneathScore = 0;
    for (const scorer of scorers) {
        const beneath = board.getLetterEntity(scorer.x, scorer.y + 1);
        if (beneath && Object(_letters__WEBPACK_IMPORTED_MODULE_4__["isBomb"])(beneath.letter)) {
            ++bombsBeneathScore;
        }
    }
    bombsBeneathScore = 1 - (bombsBeneathScore / scorers.length);
    const invisibles = board.entities.filter(state => state.letter === _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].I).length;
    const invisiblesRemoved = (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] * _board__WEBPACK_IMPORTED_MODULE_0__["maxX"]) - invisibles;
    const scoreComponent = weights.score * scored;
    const heightComponent = weights.allLetter * (firstHeight + secondHeight + thirdHeight);
    const firstHeightComponent = weights.firstLetter * firstHeight;
    const secondHeightComponent = weights.secondLetter * secondHeight;
    const thirdHeightComponent = weights.thirdLetter * thirdHeight;
    const invisComponent = weights.invisibles * invisiblesRemoved;
    const letterCountComponent = weights.letterCount * board.entities.length;
    const bombsBeneathComponent = bombsBeneathScore * weights.bombsBeneath;
    const pathLengthComponent = -0.01 * moveCount;
    return heightComponent + firstHeightComponent + secondHeightComponent + thirdHeightComponent +
        scoreComponent + invisComponent + pathLengthComponent + letterCountComponent + bombsBeneathComponent;
    function normalizedDistanceFromTop010(y) {
        const bottom = (_board__WEBPACK_IMPORTED_MODULE_0__["maxY"] - 1);
        return (y / bottom) * 10;
    }
}
function canClick(letter) {
    switch (letter) {
        case _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].I:
        case _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].First:
        case _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Second:
        case _letterEntity__WEBPACK_IMPORTED_MODULE_3__["Letter"].Third:
            return false;
        default:
            return true;
    }
}
function comparePathByScore(a, b) {
    return a.score > b.score;
}


/***/ }),

/***/ "./src/sounds.ts":
/*!***********************!*\
  !*** ./src/sounds.ts ***!
  \***********************/
/*! exports provided: toggleSound, shootSound, explosionSound, blockSound, bounceSound, bonusSound, bgmusic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toggleSound", function() { return toggleSound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "shootSound", function() { return shootSound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "explosionSound", function() { return explosionSound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "blockSound", function() { return blockSound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bounceSound", function() { return bounceSound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bonusSound", function() { return bonusSound; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bgmusic", function() { return bgmusic; });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let volume = 0.5;
let muted = false;
const explosion = "assets/explosion.wav";
const bounce = "assets/bounce.wav";
const block = "assets/block.wav";
const music = "assets/PerituneMaterial_Ramble_small.mp3";
sounds.load([explosion, bounce, music, block]);
const allSoundsLoaded = new Promise((resolve, reject) => {
    sounds.whenLoaded = () => {
        resolve();
    };
});
function toggleSound() {
    muted = !muted;
    volume = muted ? 0 : 0.5;
    return muted;
}
function shootSound() {
    soundEffect(1046.5, 0, 0.3, "sawtooth", volume, -0.8, 0, 1200, false, 0, 25, [0.2, 0.2, 2000], undefined);
}
function explosionSound() {
    sounds[explosion].volume = volume;
    sounds[explosion].play();
}
function blockSound() {
    sounds[block].volume = volume;
    sounds[block].play();
}
function bounceSound(delay = 0) {
    const sound = sounds[bounce];
    sound.volume = volume;
    sound.setEcho(0.1, 0.1, 500);
    if (delay > 0) {
        setTimeout(() => { sound.play(); }, delay * 1000);
    }
    else {
        sound.play();
    }
}
function bonusSound() {
    soundEffect(587.33, 0, 0.2, "square", volume, 0, 0);
    soundEffect(880, 0, 0.2, "square", volume, 0, 0.1);
    soundEffect(1174.66, 0, 0.3, "square", volume, 0, 0.2);
}
function bgmusic() {
    return __awaiter(this, void 0, void 0, function* () {
        yield allSoundsLoaded;
        const song = sounds[music];
        if (!song.playing) {
            console.log("beginning song playback");
            song.volume = 0;
            song.playbackRate = 0.8;
            song.loop = true;
            song.play();
            song.fadeIn(5, 0.2);
        }
    });
}


/***/ }),

/***/ "./src/strategy.ts":
/*!*************************!*\
  !*** ./src/strategy.ts ***!
  \*************************/
/*! exports provided: strategyList */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "strategyList", function() { return strategyList; });
/* harmony import */ var _randomNumberGenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./randomNumberGenerator */ "./src/randomNumberGenerator.ts");

const generator = new _randomNumberGenerator__WEBPACK_IMPORTED_MODULE_0__["RandomNumberGenerator"](377827);
const rng = () => generator.get();
const strategyList = [
    { name: "LetterOneFirst", score: 100, allLetter: 1, firstLetter: 10, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    { name: "LetterTwoFirst", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 10, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    { name: "LetterThreeFirst", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 10, invisibles: 0.1, letterCount: 0, bombsBeneath: 0 },
    { name: "AvoidBombSerious", score: 100, allLetter: 1, firstLetter: 0, secondLetter: 0, thirdLetter: 0, invisibles: 0.1, letterCount: 0, bombsBeneath: 100 },
    {
        name: "Rando1", score: 100, allLetter: 0.37853223593964336, firstLetter: 0.9396476337448559,
        secondLetter: 0.8739626200274349, thirdLetter: 0.9376500342935528, invisibles: 0.2942901234567901, letterCount: 0.4037594307270233, bombsBeneath: 0.5777863511659808
    },
    {
        name: "Rando2", score: 100, allLetter: 0.20217335390946503, firstLetter: 0.6256858710562414, secondLetter: 0.715607853223594, thirdLetter: 0.07996399176954733,
        invisibles: 0.9564086076817558, letterCount: 0.767781207133059, bombsBeneath: 0.3443287037037037
    },
    {
        name: "Rando3", score: 100, allLetter: 0.8125943072702332, firstLetter: 0.15097307956104253, secondLetter: 0.4119341563786008, thirdLetter: 0.6109096364883402,
        invisibles: 0.28185013717421126, letterCount: 0.6994470164609053, bombsBeneath: 0.7680212620027435
    },
    {
        name: "Rando9", score: 100, allLetter: 0.30613854595336076, firstLetter: 0.6059370713305898, secondLetter: 0.03202160493827161, thirdLetter: 0.044268689986282576,
        invisibles: 0.9544067215363512, letterCount: 0.14823816872427983, bombsBeneath: 0.974528463648834
    },
    {
        name: "Rando10", score: 100, allLetter: 0.3005615569272977, firstLetter: 0.7343621399176955, secondLetter: 0.5135845336076817, thirdLetter: 0.06106824417009602,
        invisibles: 0.20706018518518518, letterCount: 0.07810356652949245, bombsBeneath: 0.6525934499314129
    },
    {
        name: "Rando11", score: 100, allLetter: 0.9829989711934156, firstLetter: 0.08475222908093279, secondLetter: 0.49180384087791496, thirdLetter: 0.4788451646090535,
        invisibles: 0.9501971879286694, letterCount: 0.9953660836762689, bombsBeneath: 0.11126543209876544
    },
    {
        name: "Rando12", score: 100, allLetter: 0.091105109739369, firstLetter: 0.5799468449931413, secondLetter: 0.2969264403292181, thirdLetter: 0.9241426611796982,
        invisibles: 0.6622127914951988, letterCount: 0.45249485596707817, bombsBeneath: 0.8659765089163237
    },
    {
        name: "Rando15", score: 100, allLetter: 0.790423525377229, firstLetter: 0.9405306927297667, secondLetter: 0.08729423868312758, thirdLetter: 0.13503515089163237,
        invisibles: 0.1732596021947874, letterCount: 0.6988811728395061, bombsBeneath: 0.5051097393689986
    }
];


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map