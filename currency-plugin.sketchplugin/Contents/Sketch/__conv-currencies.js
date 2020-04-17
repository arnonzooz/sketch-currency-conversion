var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/conv-currencies.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/promise/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@skpm/promise/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* from https://github.com/taylorhakes/promise-polyfill */

function promiseFinally(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

function noop() {}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError("Promises must be constructed via new");
  if (typeof fn !== "function") throw new TypeError("not a function");
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (
      newValue &&
      (typeof newValue === "object" || typeof newValue === "function")
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === "function") {
        doResolve(then.bind(newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value, self);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) {
          Promise._multipleResolvesFn("resolve", self, value);
          return;
        }
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) {
          Promise._multipleResolvesFn("reject", self, reason);
          return;
        }
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) {
      Promise._multipleResolvesFn("reject", self, ex);
      return;
    }
    done = true;
    reject(self, ex);
  }
}

Promise.prototype["catch"] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype["finally"] = promiseFinally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.all accepts an array"));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === "object" || typeof val === "function")) {
          var then = val.then;
          if (typeof then === "function") {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === "object" && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.race accepts an array"));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn = setImmediate;

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err, promise) {
  if (
    typeof process !== "undefined" &&
    process.listenerCount &&
    (process.listenerCount("unhandledRejection") ||
      process.listenerCount("uncaughtException"))
  ) {
    process.emit("unhandledRejection", err, promise);
    process.emit("uncaughtException", err, "unhandledRejection");
  } else if (typeof console !== "undefined" && console) {
    console.warn("Possible Unhandled Promise Rejection:", err);
  }
};

Promise._multipleResolvesFn = function _multipleResolvesFn(
  type,
  promise,
  value
) {
  if (typeof process !== "undefined" && process.emit) {
    process.emit("multipleResolves", type, promise, value);
  }
};

module.exports = Promise;


/***/ }),

/***/ "./node_modules/cashify/dist/cashify.js":
/*!**********************************************!*\
  !*** ./node_modules/cashify/dist/cashify.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const convert_1 = __importDefault(__webpack_require__(/*! ./convert */ "./node_modules/cashify/dist/convert.js"));
const parser_1 = __importDefault(__webpack_require__(/*! ./utils/parser */ "./node_modules/cashify/dist/utils/parser.js"));
class Cashify {
    constructor(options) {
        this.options = options;
    }
    /**
    * @param amount Amount of money you want to convert.
    * @param options Conversion options.
    * @return Conversion result.
    */
    convert(amount, options) {
        // If provided `amount` is a string, use parsing
        if (typeof amount === 'string') {
            const data = parser_1.default(amount);
            return convert_1.default(data.amount, { ...this.options, from: data.from, to: data.to, ...options });
        }
        return convert_1.default(amount, { ...this.options, ...options });
    }
}
exports.default = Cashify;


/***/ }),

/***/ "./node_modules/cashify/dist/convert.js":
/*!**********************************************!*\
  !*** ./node_modules/cashify/dist/convert.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_rate_1 = __importDefault(__webpack_require__(/*! ./lib/get-rate */ "./node_modules/cashify/dist/lib/get-rate.js"));
const parser_1 = __importDefault(__webpack_require__(/*! ./utils/parser */ "./node_modules/cashify/dist/utils/parser.js"));
/**
* @param amount Amount of money you want to convert.
* @param options Conversion options.
* @return Conversion result.
*/
function convert(amount, { from, to, base, rates }) {
    var _a, _b;
    // If provided `amount` is a string, use parsing
    if (typeof amount === 'string') {
        const data = parser_1.default(amount);
        return (data.amount * 100) * get_rate_1.default(base, rates, (_a = data.from) !== null && _a !== void 0 ? _a : from, (_b = data.to) !== null && _b !== void 0 ? _b : to) / 100;
    }
    return (amount * 100) * get_rate_1.default(base, rates, from, to) / 100;
}
exports.default = convert;


/***/ }),

/***/ "./node_modules/cashify/dist/index.esm.js":
/*!************************************************!*\
  !*** ./node_modules/cashify/dist/index.esm.js ***!
  \************************************************/
/*! exports provided: Cashify, convert, parse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _cashify__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cashify */ "./node_modules/cashify/dist/cashify.js");
/* harmony import */ var _cashify__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_cashify__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "Cashify", function() { return _cashify__WEBPACK_IMPORTED_MODULE_0___default.a; });
/* harmony import */ var _convert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./convert */ "./node_modules/cashify/dist/convert.js");
/* harmony import */ var _convert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_convert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "convert", function() { return _convert__WEBPACK_IMPORTED_MODULE_1___default.a; });
/* harmony import */ var _utils_parser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/parser */ "./node_modules/cashify/dist/utils/parser.js");
/* harmony import */ var _utils_parser__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_utils_parser__WEBPACK_IMPORTED_MODULE_2__);
/* harmony reexport (default from non-harmony) */ __webpack_require__.d(__webpack_exports__, "parse", function() { return _utils_parser__WEBPACK_IMPORTED_MODULE_2___default.a; });







/***/ }),

/***/ "./node_modules/cashify/dist/lib/get-rate.js":
/*!***************************************************!*\
  !*** ./node_modules/cashify/dist/lib/get-rate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const has_key_1 = __importDefault(__webpack_require__(/*! ../utils/has-key */ "./node_modules/cashify/dist/utils/has-key.js"));
/**
 * Get the conversion rate.
 * @param base Base currency.
 * @param rates Object containing currency rates (for example from an API, such as Open Exchange Rates).
 * @param from Currency from which you want to convert.
 * @param to Currency to which you want to convert.
 * @return Conversion result.
*/
function getRate(base, rates, from, to) {
    if (from && to) {
        // If `from` equals `base`, return the basic exchange rate for the `to` currency
        if (from === base && has_key_1.default(rates, to)) {
            return rates[to];
        }
        // If `to` equals `base`, return the basic inverse rate of the `from` currency
        if (to === base && has_key_1.default(rates, from)) {
            return 1 / rates[from];
        }
        // Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the relative exchange rate between the two currencies.
        if (has_key_1.default(rates, from) && has_key_1.default(rates, to)) {
            return rates[to] * (1 / rates[from]);
        }
        throw new Error('`rates` object does not contain either `from` or `to` currency!');
    }
    else {
        throw new Error('Please specify the `from` and/or `to` currency or use parsing!');
    }
}
exports.default = getRate;


/***/ }),

/***/ "./node_modules/cashify/dist/utils/has-key.js":
/*!****************************************************!*\
  !*** ./node_modules/cashify/dist/utils/has-key.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Check if an object contains a key.
 * @param obj The object to check.
 * @param key The key to check for.
*/
function hasKey(object, key) {
    return key in object;
}
exports.default = hasKey;


/***/ }),

/***/ "./node_modules/cashify/dist/utils/parser.js":
/*!***************************************************!*\
  !*** ./node_modules/cashify/dist/utils/parser.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
* Expression parser
* @param expression Expression you want to parse, ex. `10 usd to pln` or `€1.23 eur`
* @return Object with parsing results
*/
function parse(expression) {
    const amount = parseFloat(expression.replace(/[^\d-.]/g, '')) || undefined;
    let from;
    let to;
    // Search for separating keyword (case insensitive) to split the expression into 2 parts
    if (/to|in|as/i.exec(expression)) {
        const firstPart = expression.slice(0, expression.search(/to|in|as/i)).toUpperCase().trim();
        from = firstPart.replace(/[^A-Za-z]/g, '');
        to = expression.slice(expression.search(/to|in|as/i) + 2).toUpperCase().trim();
    }
    else {
        from = expression.replace(/[^A-Za-z]/g, '');
    }
    if (amount === undefined) {
        throw new Error('Could not parse the `amount` argument. Make sure it includes at least a valid amount.');
    }
    return {
        amount,
        from: from.toUpperCase() || undefined,
        to
    };
}
exports.default = parse;


/***/ }),

/***/ "./node_modules/sketch-polyfill-fetch/lib/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/sketch-polyfill-fetch/lib/index.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {/* globals NSJSONSerialization NSJSONWritingPrettyPrinted NSDictionary NSHTTPURLResponse NSString NSASCIIStringEncoding NSUTF8StringEncoding coscript NSURL NSMutableURLRequest NSMutableData NSURLConnection */
var Buffer;
try {
  Buffer = __webpack_require__(/*! buffer */ "buffer").Buffer;
} catch (err) {}

function response(httpResponse, data) {
  var keys = [];
  var all = [];
  var headers = {};
  var header;

  for (var i = 0; i < httpResponse.allHeaderFields().allKeys().length; i++) {
    var key = httpResponse
      .allHeaderFields()
      .allKeys()
      [i].toLowerCase();
    var value = String(httpResponse.allHeaderFields()[key]);
    keys.push(key);
    all.push([key, value]);
    header = headers[key];
    headers[key] = header ? header + "," + value : value;
  }

  return {
    ok: ((httpResponse.statusCode() / 200) | 0) == 1, // 200-399
    status: Number(httpResponse.statusCode()),
    statusText: String(
      NSHTTPURLResponse.localizedStringForStatusCode(httpResponse.statusCode())
    ),
    useFinalURL: true,
    url: String(httpResponse.URL().absoluteString()),
    clone: response.bind(this, httpResponse, data),
    text: function() {
      return new Promise(function(resolve, reject) {
        const str = String(
          NSString.alloc().initWithData_encoding(data, NSASCIIStringEncoding)
        );
        if (str) {
          resolve(str);
        } else {
          reject(new Error("Couldn't parse body"));
        }
      });
    },
    json: function() {
      return new Promise(function(resolve, reject) {
        var str = String(
          NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding)
        );
        if (str) {
          // parse errors are turned into exceptions, which cause promise to be rejected
          var obj = JSON.parse(str);
          resolve(obj);
        } else {
          reject(
            new Error(
              "Could not parse JSON because it is not valid UTF-8 data."
            )
          );
        }
      });
    },
    blob: function() {
      return Promise.resolve(data);
    },
    arrayBuffer: function() {
      return Promise.resolve(Buffer.from(data));
    },
    headers: {
      keys: function() {
        return keys;
      },
      entries: function() {
        return all;
      },
      get: function(n) {
        return headers[n.toLowerCase()];
      },
      has: function(n) {
        return n.toLowerCase() in headers;
      }
    }
  };
}

// We create one ObjC class for ourselves here
var DelegateClass;

function fetch(urlString, options) {
  if (
    typeof urlString === "object" &&
    (!urlString.isKindOfClass || !urlString.isKindOfClass(NSString))
  ) {
    options = urlString;
    urlString = options.url;
  }
  options = options || {};
  if (!urlString) {
    return Promise.reject("Missing URL");
  }
  var fiber;
  try {
    fiber = coscript.createFiber();
  } catch (err) {
    coscript.shouldKeepAround = true;
  }
  return new Promise(function(resolve, reject) {
    var url = NSURL.alloc().initWithString(urlString);
    var request = NSMutableURLRequest.requestWithURL(url);
    request.setHTTPMethod(options.method || "GET");

    Object.keys(options.headers || {}).forEach(function(i) {
      request.setValue_forHTTPHeaderField(options.headers[i], i);
    });

    if (options.body) {
      var data;
      if (typeof options.body === "string") {
        var str = NSString.alloc().initWithString(options.body);
        data = str.dataUsingEncoding(NSUTF8StringEncoding);
      } else if (Buffer && Buffer.isBuffer(options.body)) {
        data = options.body.toNSData();
      } else if (
        options.body.isKindOfClass &&
        options.body.isKindOfClass(NSData) == 1
      ) {
        data = options.body;
      } else if (options.body._isFormData) {
        var boundary = options.body._boundary;
        data = options.body._data;
        data.appendData(
          NSString.alloc()
            .initWithString("--" + boundary + "--\r\n")
            .dataUsingEncoding(NSUTF8StringEncoding)
        );
        request.setValue_forHTTPHeaderField(
          "multipart/form-data; boundary=" + boundary,
          "Content-Type"
        );
      } else {
        var error;
        data = NSJSONSerialization.dataWithJSONObject_options_error(
          options.body,
          NSJSONWritingPrettyPrinted,
          error
        );
        if (error != null) {
          return reject(error);
        }
        request.setValue_forHTTPHeaderField(
          "" + data.length(),
          "Content-Length"
        );
      }
      request.setHTTPBody(data);
    }

    if (options.cache) {
      switch (options.cache) {
        case "reload":
        case "no-cache":
        case "no-store": {
          request.setCachePolicy(1); // NSURLRequestReloadIgnoringLocalCacheData
        }
        case "force-cache": {
          request.setCachePolicy(2); // NSURLRequestReturnCacheDataElseLoad
        }
        case "only-if-cached": {
          request.setCachePolicy(3); // NSURLRequestReturnCacheDataElseLoad
        }
      }
    }

    if (!options.credentials) {
      request.setHTTPShouldHandleCookies(false);
    }

    var finished = false;

    var connection = NSURLSession.sharedSession().dataTaskWithRequest_completionHandler(
      request,
      __mocha__.createBlock_function(
        'v32@?0@"NSData"8@"NSURLResponse"16@"NSError"24',
        function(data, res, error) {
          if (fiber) {
            fiber.cleanup();
          } else {
            coscript.shouldKeepAround = false;
          }
          if (error) {
            finished = true;
            return reject(error);
          }
          return resolve(response(res, data));
        }
      )
    );

    connection.resume();

    if (fiber) {
      fiber.onCleanup(function() {
        if (!finished) {
          connection.cancel();
        }
      });
    }
  });
}

module.exports = fetch;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./src/api-currencies.js":
/*!*******************************!*\
  !*** ./src/api-currencies.js ***!
  \*******************************/
/*! exports provided: getCurrencies */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise, fetch) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrencies", function() { return getCurrencies; });
var Settings = __webpack_require__(/*! sketch/settings */ "sketch/settings");

var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui");

var getCurrencies = function getCurrencies(context, base) {
  return new Promise(function (resolve, reject) {
    var url = !base ? "https://api.exchangeratesapi.io/latest" : "https://api.exchangeratesapi.io/latest?base=" + base;
    fetch(url).then(function (response) {
      if (!response.ok) {
        reject(response.statusText);
      }

      response.json().then(function (data) {
        // Add EUR since it is not included as EUR is the base
        if (!base) {
          data.rates.EUR = 1;
          Settings.setSessionVariable("convRates", Object.keys(data.rates));
        } else {
          resolve(data);
        }
      });
    }).catch(function (error) {
      UI.alert("Cannot Fetch Conversion Rates", "Hey there UX Engineer! Looks like there's no network. You'll have to convert all amounts manually, sorry.");
    });
  });
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js"), __webpack_require__(/*! ./node_modules/sketch-polyfill-fetch/lib/index.js */ "./node_modules/sketch-polyfill-fetch/lib/index.js")))

/***/ }),

/***/ "./src/conv-currencies.js":
/*!********************************!*\
  !*** ./src/conv-currencies.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return convertMe; });
/* harmony import */ var _api_currencies__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api-currencies */ "./src/api-currencies.js");


var _require = __webpack_require__(/*! sketch */ "sketch"),
    Document = _require.Document,
    UI = _require.UI,
    Settings = _require.Settings;

var _require2 = __webpack_require__(/*! cashify */ "./node_modules/cashify/dist/index.esm.js"),
    convert = _require2.convert;

var document = Document.getSelectedDocument();
var selectedLayers = document.selectedLayers;
var inputCancelled = false;
var selectedCurrencies = [{
  type: "source"
}, {
  type: "target"
}];
function convertMe() {
  if (!Settings.sessionVariable("convRates")) {
    UI.alert("Could Not Fetch Currencies", "Hey there UX Engineer! Looks like I could not load the currency list. Try to disable and enable the plugin again.");
  }

  selectedCurrencies.forEach(function (currObj) {
    if (!inputCancelled) {
      UI.getInputFromUser("Select a " + currObj.type + " currency", {
        initialValue: currObj.type === "source" && Settings.sessionVariable(currObj.type + "Curr") ? Settings.sessionVariable(currObj.type + "Curr") : currObj.type === "source" ? "EUR" : currObj.type === "target" && Settings.sessionVariable(currObj.type + "Curr") ? Settings.sessionVariable(currObj.type + "Curr") : "EUR",
        type: UI.INPUT_TYPE.selection,
        possibleValues: Settings.sessionVariable("convRates").sort()
      }, function (err, value) {
        if (err) {
          // most likely the user canceled the input
          return inputCancelled = true;
        }

        Settings.setSessionVariable(currObj.type + "Curr", value);
      });
    }
  });
  Settings.setSessionVariable("rememberRates", selectedCurrencies);
  Object(_api_currencies__WEBPACK_IMPORTED_MODULE_0__["getCurrencies"])(undefined, Settings.sessionVariable('sourceCurr')).then(function (result) {
    selectedLayers.forEach(function (layer) {
      var convResult = convert(layer.text, {
        from: Settings.sessionVariable('sourceCurr'),
        to: Settings.sessionVariable('targetCurr'),
        base: result.base,
        rates: result.rates
      });
      var formattedResult = convResult.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
      layer.text = formattedResult;

      if (!hasDecimals(layer.text)) {
        layer.text = parseFloat(layer.text).toFixed(2);
      }
    });
  }).catch(function (error) {
    UI.alert("Oops, something went wrong", error);
  });

  function hasDecimals(n) {
    var numberP = n - Math.floor(n) !== 0;
    if (numberP) return true;else return false;
  }
}

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "sketch":
/*!*************************!*\
  !*** external "sketch" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch");

/***/ }),

/***/ "sketch/settings":
/*!**********************************!*\
  !*** external "sketch/settings" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/settings");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=__conv-currencies.js.map