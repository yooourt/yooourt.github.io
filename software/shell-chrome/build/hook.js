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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/hook.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/@vue-devtools/app-backend/src/hook.js":
/*!**************************************************************************************************!*\
  !*** /Users/twt/Desktop/scratch/vue-devtools/node_modules/@vue-devtools/app-backend/src/hook.js ***!
  \**************************************************************************************************/
/*! exports provided: installHook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "installHook", function() { return installHook; });
// this script is injected into every page.

/**
 * Install the hook on window, which is an event emitter.
 * Note because Chrome content scripts cannot directly modify the window object,
 * we are evaling this function by inserting a script tag. That's why we have
 * to inline the whole event emitter implementation here.
 *
 * @param {Window|global} target
 */

function installHook (target) {
  let listeners = {}

  if (target.hasOwnProperty('__VUE_DEVTOOLS_GLOBAL_HOOK__')) return

  const hook = {
    Vue: null,

    _buffer: [],

    _replayBuffer (event) {
      let buffer = this._buffer
      this._buffer = []

      for (let i = 0, l = buffer.length; i < l; i++) {
        let allArgs = buffer[i]
        allArgs[0] === event
          ? this.emit.apply(this, allArgs)
          : this._buffer.push(allArgs)
      }
    },

    on (event, fn) {
      const $event = '$' + event
      if (listeners[$event]) {
        listeners[$event].push(fn)
      } else {
        listeners[$event] = [fn]
        this._replayBuffer(event)
      }
    },

    once (event, fn) {
      function on () {
        this.off(event, on)
        fn.apply(this, arguments)
      }
      this.on(event, on)
    },

    off (event, fn) {
      event = '$' + event
      if (!arguments.length) {
        listeners = {}
      } else {
        const cbs = listeners[event]
        if (cbs) {
          if (!fn) {
            listeners[event] = null
          } else {
            for (let i = 0, l = cbs.length; i < l; i++) {
              const cb = cbs[i]
              if (cb === fn || cb.fn === fn) {
                cbs.splice(i, 1)
                break
              }
            }
          }
        }
      }
    },

    emit (event) {
      const $event = '$' + event
      let cbs = listeners[$event]
      if (cbs) {
        const eventArgs = [].slice.call(arguments, 1)
        cbs = cbs.slice()
        for (let i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(this, eventArgs)
        }
      } else {
        const allArgs = [].slice.call(arguments)
        this._buffer.push(allArgs)
      }
    }
  }

  hook.once('init', Vue => {
    hook.Vue = Vue

    Vue.prototype.$inspect = function () {
      const fn = target.__VUE_DEVTOOLS_INSPECT__
      fn && fn(this)
    }
  })

  hook.once('vuex:init', store => {
    hook.store = store
    hook.initialState = clone(store.state)
    const origReplaceState = store.replaceState.bind(store)
    store.replaceState = state => {
      hook.initialState = clone(state)
      origReplaceState(state)
    }
    // Dynamic modules
    let origRegister, origUnregister
    if (store.registerModule) {
      hook.storeModules = []
      origRegister = store.registerModule.bind(store)
      store.registerModule = (path, module, options) => {
        if (typeof path === 'string') path = [path]
        hook.storeModules.push({ path, module, options })
        origRegister(path, module, options)
        if (true) console.log('early register module', path, module, options)
      }
      origUnregister = store.unregisterModule.bind(store)
      store.unregisterModule = (path) => {
        if (typeof path === 'string') path = [path]
        const key = path.join('/')
        const index = hook.storeModules.findIndex(m => m.path.join('/') === key)
        if (index !== -1) hook.storeModules.splice(index, 1)
        origUnregister(path)
        if (true) console.log('early unregister module', path)
      }
    }
    hook.flushStoreModules = () => {
      store.replaceState = origReplaceState
      if (store.registerModule) {
        store.registerModule = origRegister
        store.unregisterModule = origUnregister
      }
      return hook.storeModules || []
    }
  })

  Object.defineProperty(target, '__VUE_DEVTOOLS_GLOBAL_HOOK__', {
    get () {
      return hook
    }
  })

  // Clone deep utility for cloning initial state of the store
  // Forked from https://github.com/planttheidea/fast-copy
  // Last update: 2019-10-30
  // ⚠️ Don't forget to update `./hook.js`

  // utils
  const { toString: toStringFunction } = Function.prototype
  const {
    create,
    defineProperty,
    getOwnPropertyDescriptor,
    getOwnPropertyNames,
    getOwnPropertySymbols,
    getPrototypeOf
  } = Object
  const { hasOwnProperty, propertyIsEnumerable } = Object.prototype

  /**
   * @enum
   *
   * @const {Object} SUPPORTS
   *
   * @property {boolean} SYMBOL_PROPERTIES are symbol properties supported
   * @property {boolean} WEAKSET is WeakSet supported
   */
  const SUPPORTS = {
    SYMBOL_PROPERTIES: typeof getOwnPropertySymbols === 'function',
    WEAKSET: typeof WeakSet === 'function'
  }

  /**
   * @function createCache
   *
   * @description
   * get a new cache object to prevent circular references
   *
   * @returns the new cache object
   */
  const createCache = () => {
    if (SUPPORTS.WEAKSET) {
      return new WeakSet()
    }

    const object = create({
      add: (value) => object._values.push(value),
      has: (value) => !!~object._values.indexOf(value)
    })

    object._values = []

    return object
  }

  /**
   * @function getCleanClone
   *
   * @description
   * get an empty version of the object with the same prototype it has
   *
   * @param object the object to build a clean clone from
   * @param realm the realm the object resides in
   * @returns the empty cloned object
   */
  const getCleanClone = (object, realm) => {
    if (!object.constructor) {
      return create(null)
    }

    // eslint-disable-next-line no-proto
    const prototype = object.__proto__ || getPrototypeOf(object)

    if (object.constructor === realm.Object) {
      return prototype === realm.Object.prototype ? {} : create(prototype)
    }

    if (~toStringFunction.call(object.constructor).indexOf('[native code]')) {
      try {
        return new object.constructor()
      } catch (e) {
        // Error
      }
    }

    return create(prototype)
  }

  /**
   * @function getObjectCloneLoose
   *
   * @description
   * get a copy of the object based on loose rules, meaning all enumerable keys
   * and symbols are copied, but property descriptors are not considered
   *
   * @param object the object to clone
   * @param realm the realm the object resides in
   * @param handleCopy the function that handles copying the object
   * @returns the copied object
   */
  const getObjectCloneLoose = (
    object,
    realm,
    handleCopy,
    cache
  ) => {
    const clone = getCleanClone(object, realm)

    for (const key in object) {
      if (hasOwnProperty.call(object, key)) {
        clone[key] = handleCopy(object[key], cache)
      }
    }

    if (SUPPORTS.SYMBOL_PROPERTIES) {
      const symbols = getOwnPropertySymbols(object)

      if (symbols.length) {
        for (let index = 0, symbol; index < symbols.length; index++) {
          symbol = symbols[index]

          if (propertyIsEnumerable.call(object, symbol)) {
            clone[symbol] = handleCopy(object[symbol], cache)
          }
        }
      }
    }

    return clone
  }

  /**
   * @function getObjectCloneStrict
   *
   * @description
   * get a copy of the object based on strict rules, meaning all keys and symbols
   * are copied based on the original property descriptors
   *
   * @param object the object to clone
   * @param realm the realm the object resides in
   * @param handleCopy the function that handles copying the object
   * @returns the copied object
   */
  const getObjectCloneStrict = (
    object,
    realm,
    handleCopy,
    cache
  ) => {
    const clone = getCleanClone(object, realm)

    const properties = SUPPORTS.SYMBOL_PROPERTIES
      ? [].concat(getOwnPropertyNames(object), getOwnPropertySymbols(object))
      : getOwnPropertyNames(object)

    if (properties.length) {
      for (
        let index = 0, property, descriptor;
        index < properties.length;
        index++
      ) {
        property = properties[index]

        if (property !== 'callee' && property !== 'caller') {
          descriptor = getOwnPropertyDescriptor(object, property)

          descriptor.value = handleCopy(object[property], cache)

          defineProperty(clone, property, descriptor)
        }
      }
    }

    return clone
  }

  /**
   * @function getRegExpFlags
   *
   * @description
   * get the flags to apply to the copied regexp
   *
   * @param regExp the regexp to get the flags of
   * @returns the flags for the regexp
   */
  const getRegExpFlags = (regExp) => {
    let flags = ''

    if (regExp.global) {
      flags += 'g'
    }

    if (regExp.ignoreCase) {
      flags += 'i'
    }

    if (regExp.multiline) {
      flags += 'm'
    }

    if (regExp.unicode) {
      flags += 'u'
    }

    if (regExp.sticky) {
      flags += 'y'
    }

    return flags
  }

  const { isArray } = Array

  const GLOBAL_THIS = (() => {
    if (typeof self !== 'undefined') {
      return self
    }

    if (typeof window !== 'undefined') {
      return window
    }

    if (typeof global !== 'undefined') {
      return global
    }

    if (console && console.error) {
      console.error('Unable to locate global object, returning "this".')
    }
  })()

  /**
   * @function clone
   *
   * @description
   * copy an object deeply as much as possible
   *
   * If `strict` is applied, then all properties (including non-enumerable ones)
   * are copied with their original property descriptors on both objects and arrays.
   *
   * The object is compared to the global constructors in the `realm` provided,
   * and the native constructor is always used to ensure that extensions of native
   * objects (allows in ES2015+) are maintained.
   *
   * @param object the object to copy
   * @param [options] the options for copying with
   * @param [options.isStrict] should the copy be strict
   * @param [options.realm] the realm (this) object the object is copied from
   * @returns the copied object
   */
  function clone (object, options) {
    // manually coalesced instead of default parameters for performance
    const isStrict = !!(options && options.isStrict)
    const realm = (options && options.realm) || GLOBAL_THIS

    const getObjectClone = isStrict
      ? getObjectCloneStrict
      : getObjectCloneLoose

    /**
     * @function handleCopy
     *
     * @description
     * copy the object recursively based on its type
     *
     * @param object the object to copy
     * @returns the copied object
     */
    const handleCopy = (
      object,
      cache
    ) => {
      if (!object || typeof object !== 'object' || cache.has(object)) {
        return object
      }

      // DOM objects
      if (object instanceof HTMLElement) {
        return object.cloneNode(false)
      }

      const Constructor = object.constructor

      // plain objects
      if (Constructor === realm.Object) {
        cache.add(object)

        return getObjectClone(object, realm, handleCopy, cache)
      }

      let clone

      // arrays
      if (isArray(object)) {
        cache.add(object)

        // if strict, include non-standard properties
        if (isStrict) {
          return getObjectCloneStrict(object, realm, handleCopy, cache)
        }

        clone = new Constructor()

        for (let index = 0; index < object.length; index++) {
          clone[index] = handleCopy(object[index], cache)
        }

        return clone
      }

      // dates
      if (object instanceof realm.Date) {
        return new Constructor(object.getTime())
      }

      // regexps
      if (object instanceof realm.RegExp) {
        clone = new Constructor(
          object.source,
          object.flags || getRegExpFlags(object)
        )

        clone.lastIndex = object.lastIndex

        return clone
      }

      // maps
      if (realm.Map && object instanceof realm.Map) {
        cache.add(object)

        clone = new Constructor()

        object.forEach((value, key) => {
          clone.set(key, handleCopy(value, cache))
        })

        return clone
      }

      // sets
      if (realm.Set && object instanceof realm.Set) {
        cache.add(object)

        clone = new Constructor()

        object.forEach((value) => {
          clone.add(handleCopy(value, cache))
        })

        return clone
      }

      // buffers (node-only)
      if (realm.Buffer && realm.Buffer.isBuffer(object)) {
        clone = realm.Buffer.allocUnsafe
          ? realm.Buffer.allocUnsafe(object.length)
          : new Constructor(object.length)

        object.copy(clone)

        return clone
      }

      // arraybuffers / dataviews
      if (realm.ArrayBuffer) {
        // dataviews
        if (realm.ArrayBuffer.isView(object)) {
          return new Constructor(object.buffer.slice(0))
        }

        // arraybuffers
        if (object instanceof realm.ArrayBuffer) {
          return object.slice(0)
        }
      }

      // if the object cannot / should not be cloned, don't
      if (
        // promise-like
        (hasOwnProperty.call(object, 'then') && typeof object.then === 'function') ||
        // errors
        object instanceof Error ||
        // weakmaps
        (realm.WeakMap && object instanceof realm.WeakMap) ||
        // weaksets
        (realm.WeakSet && object instanceof realm.WeakSet)
      ) {
        return object
      }

      cache.add(object)

      // assume anything left is a custom constructor
      return getObjectClone(object, realm, handleCopy, cache)
    }

    return handleCopy(object, createCache())
  }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/@vue-devtools/shared-utils/src/env.js":
/*!**************************************************************************************************!*\
  !*** /Users/twt/Desktop/scratch/vue-devtools/node_modules/@vue-devtools/shared-utils/src/env.js ***!
  \**************************************************************************************************/
/*! exports provided: isBrowser, target, isChrome, isFirefox, isWindows, isMac, isLinux, keys, initEnv */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isBrowser", function() { return isBrowser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "target", function() { return target; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isChrome", function() { return isChrome; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFirefox", function() { return isFirefox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isWindows", function() { return isWindows; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isMac", function() { return isMac; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isLinux", function() { return isLinux; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keys", function() { return keys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initEnv", function() { return initEnv; });
const isBrowser = typeof navigator !== 'undefined'
const target = isBrowser
  ? window
  : typeof global !== 'undefined'
    ? global
    : {}
const isChrome = typeof chrome !== 'undefined' && !!chrome.devtools
const isFirefox = isBrowser && navigator.userAgent.indexOf('Firefox') > -1
const isWindows = isBrowser && navigator.platform.indexOf('Win') === 0
const isMac = isBrowser && navigator.platform === 'MacIntel'
const isLinux = isBrowser && navigator.platform.indexOf('Linux') === 0
const keys = {
  ctrl: isMac ? '&#8984;' : 'Ctrl',
  shift: 'Shift',
  alt: isMac ? '&#8997;' : 'Alt',
  del: 'Del',
  enter: 'Enter',
  esc: 'Esc'
}

function initEnv (Vue) {
  if (Vue.prototype.hasOwnProperty('$isChrome')) return

  Object.defineProperties(Vue.prototype, {
    '$isChrome': { get: () => isChrome },
    '$isFirefox': { get: () => isFirefox },
    '$isWindows': { get: () => isWindows },
    '$isMac': { get: () => isMac },
    '$isLinux': { get: () => isLinux },
    '$keys': { get: () => keys }
  })

  if (isWindows) document.body.classList.add('platform-windows')
  if (isMac) document.body.classList.add('platform-mac')
  if (isLinux) document.body.classList.add('platform-linux')
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "../../node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "../../node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/hook.js":
/*!*********************!*\
  !*** ./src/hook.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _back_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @back/hook */ "../../node_modules/@vue-devtools/app-backend/src/hook.js");
/* harmony import */ var _utils_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/env */ "../../node_modules/@vue-devtools/shared-utils/src/env.js");
// This script is injected into every page.



// inject the hook
if (document instanceof HTMLDocument) {
  var source = ';(' + _back_hook__WEBPACK_IMPORTED_MODULE_0__["installHook"].toString() + ')(window)'

  if (_utils_env__WEBPACK_IMPORTED_MODULE_1__["isFirefox"]) {
    // eslint-disable-next-line no-eval
    window.eval(source) // in Firefox, this evaluates on the content window
  } else {
    var script = document.createElement('script')
    script.textContent = source
    document.documentElement.appendChild(script)
    script.parentNode.removeChild(script)
  }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy90d3QvRGVza3RvcC9zY3JhdGNoL3Z1ZS1kZXZ0b29scy9ub2RlX21vZHVsZXMvQHZ1ZS1kZXZ0b29scy9hcHAtYmFja2VuZC9zcmMvaG9vay5qcyIsIndlYnBhY2s6Ly8vL1VzZXJzL3R3dC9EZXNrdG9wL3NjcmF0Y2gvdnVlLWRldnRvb2xzL25vZGVfbW9kdWxlcy9AdnVlLWRldnRvb2xzL3NoYXJlZC11dGlscy9zcmMvZW52LmpzIiwid2VicGFjazovLy8od2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2hvb2suanMiXSwibmFtZXMiOlsiY29uc3QiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsY0FBYztBQUN6Qjs7QUFFTztBQUNQOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHdDQUF3QyxPQUFPO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCwyQ0FBMkMsT0FBTztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxPQUFPO0FBQzlDO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0Msd0JBQXdCO0FBQ3hEO0FBQ0EsWUFBWSxJQUFxQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxJQUFxQztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyw2QkFBNkI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsU0FBUyx1Q0FBdUM7O0FBRWhEO0FBQ0E7QUFDQTtBQUNBLGFBQWEsT0FBTztBQUNwQjtBQUNBLGdCQUFnQixRQUFRO0FBQ3hCLGdCQUFnQixRQUFRO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzREFBc0Q7QUFDdEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1DQUFtQyx3QkFBd0I7QUFDM0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxTQUFTLFVBQVU7O0FBRW5CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsMkJBQTJCLHVCQUF1QjtBQUNsRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDNWhCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPO0FBQ0E7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNQLHdCQUF3QjtBQUN4QjtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTs7QUFFTztBQUNQOztBQUVBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QyxtQkFBbUIsdUJBQXVCO0FBQzFDLG1CQUFtQix1QkFBdUI7QUFDMUMsZUFBZSxtQkFBbUI7QUFDbEMsaUJBQWlCLHFCQUFxQjtBQUN0QyxjQUFjO0FBQ2QsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25DQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUM7Ozs7Ozs7Ozs7Ozs7QUNuQkE7QUFBQTtBQUFBO0FBQUE7QUFDd0M7QUFDRjs7O0FBR3RDLElBQUksUUFBUSxZQUFZLFlBQVksRUFBRTtFQUNwQ0EsR0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsc0RBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxXQUFXOztFQUUxRCxJQUFJLG9EQUFTLEVBQUU7O0lBRWIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7R0FDcEIsTUFBTTtJQUNMQSxHQUFLLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBQy9DLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTTtJQUMzQixRQUFRLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7SUFDNUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDO0dBQ3RDO0NBQ0YiLCJmaWxlIjoiaG9vay5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2hvb2suanNcIik7XG4iLCIvLyB0aGlzIHNjcmlwdCBpcyBpbmplY3RlZCBpbnRvIGV2ZXJ5IHBhZ2UuXG5cbi8qKlxuICogSW5zdGFsbCB0aGUgaG9vayBvbiB3aW5kb3csIHdoaWNoIGlzIGFuIGV2ZW50IGVtaXR0ZXIuXG4gKiBOb3RlIGJlY2F1c2UgQ2hyb21lIGNvbnRlbnQgc2NyaXB0cyBjYW5ub3QgZGlyZWN0bHkgbW9kaWZ5IHRoZSB3aW5kb3cgb2JqZWN0LFxuICogd2UgYXJlIGV2YWxpbmcgdGhpcyBmdW5jdGlvbiBieSBpbnNlcnRpbmcgYSBzY3JpcHQgdGFnLiBUaGF0J3Mgd2h5IHdlIGhhdmVcbiAqIHRvIGlubGluZSB0aGUgd2hvbGUgZXZlbnQgZW1pdHRlciBpbXBsZW1lbnRhdGlvbiBoZXJlLlxuICpcbiAqIEBwYXJhbSB7V2luZG93fGdsb2JhbH0gdGFyZ2V0XG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxIb29rICh0YXJnZXQpIHtcbiAgbGV0IGxpc3RlbmVycyA9IHt9XG5cbiAgaWYgKHRhcmdldC5oYXNPd25Qcm9wZXJ0eSgnX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXycpKSByZXR1cm5cblxuICBjb25zdCBob29rID0ge1xuICAgIFZ1ZTogbnVsbCxcblxuICAgIF9idWZmZXI6IFtdLFxuXG4gICAgX3JlcGxheUJ1ZmZlciAoZXZlbnQpIHtcbiAgICAgIGxldCBidWZmZXIgPSB0aGlzLl9idWZmZXJcbiAgICAgIHRoaXMuX2J1ZmZlciA9IFtdXG5cbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gYnVmZmVyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICBsZXQgYWxsQXJncyA9IGJ1ZmZlcltpXVxuICAgICAgICBhbGxBcmdzWzBdID09PSBldmVudFxuICAgICAgICAgID8gdGhpcy5lbWl0LmFwcGx5KHRoaXMsIGFsbEFyZ3MpXG4gICAgICAgICAgOiB0aGlzLl9idWZmZXIucHVzaChhbGxBcmdzKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbiAoZXZlbnQsIGZuKSB7XG4gICAgICBjb25zdCAkZXZlbnQgPSAnJCcgKyBldmVudFxuICAgICAgaWYgKGxpc3RlbmVyc1skZXZlbnRdKSB7XG4gICAgICAgIGxpc3RlbmVyc1skZXZlbnRdLnB1c2goZm4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ZW5lcnNbJGV2ZW50XSA9IFtmbl1cbiAgICAgICAgdGhpcy5fcmVwbGF5QnVmZmVyKGV2ZW50KVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBvbmNlIChldmVudCwgZm4pIHtcbiAgICAgIGZ1bmN0aW9uIG9uICgpIHtcbiAgICAgICAgdGhpcy5vZmYoZXZlbnQsIG9uKVxuICAgICAgICBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgICB9XG4gICAgICB0aGlzLm9uKGV2ZW50LCBvbilcbiAgICB9LFxuXG4gICAgb2ZmIChldmVudCwgZm4pIHtcbiAgICAgIGV2ZW50ID0gJyQnICsgZXZlbnRcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICBsaXN0ZW5lcnMgPSB7fVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY2JzID0gbGlzdGVuZXJzW2V2ZW50XVxuICAgICAgICBpZiAoY2JzKSB7XG4gICAgICAgICAgaWYgKCFmbikge1xuICAgICAgICAgICAgbGlzdGVuZXJzW2V2ZW50XSA9IG51bGxcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjYnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGNiID0gY2JzW2ldXG4gICAgICAgICAgICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICAgICAgICAgICAgY2JzLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZW1pdCAoZXZlbnQpIHtcbiAgICAgIGNvbnN0ICRldmVudCA9ICckJyArIGV2ZW50XG4gICAgICBsZXQgY2JzID0gbGlzdGVuZXJzWyRldmVudF1cbiAgICAgIGlmIChjYnMpIHtcbiAgICAgICAgY29uc3QgZXZlbnRBcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgICAgIGNicyA9IGNicy5zbGljZSgpXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY2JzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGNic1tpXS5hcHBseSh0aGlzLCBldmVudEFyZ3MpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGFsbEFyZ3MgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgICAgICAgdGhpcy5fYnVmZmVyLnB1c2goYWxsQXJncylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBob29rLm9uY2UoJ2luaXQnLCBWdWUgPT4ge1xuICAgIGhvb2suVnVlID0gVnVlXG5cbiAgICBWdWUucHJvdG90eXBlLiRpbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgZm4gPSB0YXJnZXQuX19WVUVfREVWVE9PTFNfSU5TUEVDVF9fXG4gICAgICBmbiAmJiBmbih0aGlzKVxuICAgIH1cbiAgfSlcblxuICBob29rLm9uY2UoJ3Z1ZXg6aW5pdCcsIHN0b3JlID0+IHtcbiAgICBob29rLnN0b3JlID0gc3RvcmVcbiAgICBob29rLmluaXRpYWxTdGF0ZSA9IGNsb25lKHN0b3JlLnN0YXRlKVxuICAgIGNvbnN0IG9yaWdSZXBsYWNlU3RhdGUgPSBzdG9yZS5yZXBsYWNlU3RhdGUuYmluZChzdG9yZSlcbiAgICBzdG9yZS5yZXBsYWNlU3RhdGUgPSBzdGF0ZSA9PiB7XG4gICAgICBob29rLmluaXRpYWxTdGF0ZSA9IGNsb25lKHN0YXRlKVxuICAgICAgb3JpZ1JlcGxhY2VTdGF0ZShzdGF0ZSlcbiAgICB9XG4gICAgLy8gRHluYW1pYyBtb2R1bGVzXG4gICAgbGV0IG9yaWdSZWdpc3Rlciwgb3JpZ1VucmVnaXN0ZXJcbiAgICBpZiAoc3RvcmUucmVnaXN0ZXJNb2R1bGUpIHtcbiAgICAgIGhvb2suc3RvcmVNb2R1bGVzID0gW11cbiAgICAgIG9yaWdSZWdpc3RlciA9IHN0b3JlLnJlZ2lzdGVyTW9kdWxlLmJpbmQoc3RvcmUpXG4gICAgICBzdG9yZS5yZWdpc3Rlck1vZHVsZSA9IChwYXRoLCBtb2R1bGUsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgcGF0aCA9IFtwYXRoXVxuICAgICAgICBob29rLnN0b3JlTW9kdWxlcy5wdXNoKHsgcGF0aCwgbW9kdWxlLCBvcHRpb25zIH0pXG4gICAgICAgIG9yaWdSZWdpc3RlcihwYXRoLCBtb2R1bGUsIG9wdGlvbnMpXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBjb25zb2xlLmxvZygnZWFybHkgcmVnaXN0ZXIgbW9kdWxlJywgcGF0aCwgbW9kdWxlLCBvcHRpb25zKVxuICAgICAgfVxuICAgICAgb3JpZ1VucmVnaXN0ZXIgPSBzdG9yZS51bnJlZ2lzdGVyTW9kdWxlLmJpbmQoc3RvcmUpXG4gICAgICBzdG9yZS51bnJlZ2lzdGVyTW9kdWxlID0gKHBhdGgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBwYXRoID09PSAnc3RyaW5nJykgcGF0aCA9IFtwYXRoXVxuICAgICAgICBjb25zdCBrZXkgPSBwYXRoLmpvaW4oJy8nKVxuICAgICAgICBjb25zdCBpbmRleCA9IGhvb2suc3RvcmVNb2R1bGVzLmZpbmRJbmRleChtID0+IG0ucGF0aC5qb2luKCcvJykgPT09IGtleSlcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkgaG9vay5zdG9yZU1vZHVsZXMuc3BsaWNlKGluZGV4LCAxKVxuICAgICAgICBvcmlnVW5yZWdpc3RlcihwYXRoKVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgY29uc29sZS5sb2coJ2Vhcmx5IHVucmVnaXN0ZXIgbW9kdWxlJywgcGF0aClcbiAgICAgIH1cbiAgICB9XG4gICAgaG9vay5mbHVzaFN0b3JlTW9kdWxlcyA9ICgpID0+IHtcbiAgICAgIHN0b3JlLnJlcGxhY2VTdGF0ZSA9IG9yaWdSZXBsYWNlU3RhdGVcbiAgICAgIGlmIChzdG9yZS5yZWdpc3Rlck1vZHVsZSkge1xuICAgICAgICBzdG9yZS5yZWdpc3Rlck1vZHVsZSA9IG9yaWdSZWdpc3RlclxuICAgICAgICBzdG9yZS51bnJlZ2lzdGVyTW9kdWxlID0gb3JpZ1VucmVnaXN0ZXJcbiAgICAgIH1cbiAgICAgIHJldHVybiBob29rLnN0b3JlTW9kdWxlcyB8fCBbXVxuICAgIH1cbiAgfSlcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCAnX19WVUVfREVWVE9PTFNfR0xPQkFMX0hPT0tfXycsIHtcbiAgICBnZXQgKCkge1xuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9XG4gIH0pXG5cbiAgLy8gQ2xvbmUgZGVlcCB1dGlsaXR5IGZvciBjbG9uaW5nIGluaXRpYWwgc3RhdGUgb2YgdGhlIHN0b3JlXG4gIC8vIEZvcmtlZCBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9wbGFudHRoZWlkZWEvZmFzdC1jb3B5XG4gIC8vIExhc3QgdXBkYXRlOiAyMDE5LTEwLTMwXG4gIC8vIOKaoO+4jyBEb24ndCBmb3JnZXQgdG8gdXBkYXRlIGAuL2hvb2suanNgXG5cbiAgLy8gdXRpbHNcbiAgY29uc3QgeyB0b1N0cmluZzogdG9TdHJpbmdGdW5jdGlvbiB9ID0gRnVuY3Rpb24ucHJvdG90eXBlXG4gIGNvbnN0IHtcbiAgICBjcmVhdGUsXG4gICAgZGVmaW5lUHJvcGVydHksXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAgIGdldE93blByb3BlcnR5TmFtZXMsXG4gICAgZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxuICAgIGdldFByb3RvdHlwZU9mXG4gIH0gPSBPYmplY3RcbiAgY29uc3QgeyBoYXNPd25Qcm9wZXJ0eSwgcHJvcGVydHlJc0VudW1lcmFibGUgfSA9IE9iamVjdC5wcm90b3R5cGVcblxuICAvKipcbiAgICogQGVudW1cbiAgICpcbiAgICogQGNvbnN0IHtPYmplY3R9IFNVUFBPUlRTXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gU1lNQk9MX1BST1BFUlRJRVMgYXJlIHN5bWJvbCBwcm9wZXJ0aWVzIHN1cHBvcnRlZFxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IFdFQUtTRVQgaXMgV2Vha1NldCBzdXBwb3J0ZWRcbiAgICovXG4gIGNvbnN0IFNVUFBPUlRTID0ge1xuICAgIFNZTUJPTF9QUk9QRVJUSUVTOiB0eXBlb2YgZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSAnZnVuY3Rpb24nLFxuICAgIFdFQUtTRVQ6IHR5cGVvZiBXZWFrU2V0ID09PSAnZnVuY3Rpb24nXG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNyZWF0ZUNhY2hlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBnZXQgYSBuZXcgY2FjaGUgb2JqZWN0IHRvIHByZXZlbnQgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgbmV3IGNhY2hlIG9iamVjdFxuICAgKi9cbiAgY29uc3QgY3JlYXRlQ2FjaGUgPSAoKSA9PiB7XG4gICAgaWYgKFNVUFBPUlRTLldFQUtTRVQpIHtcbiAgICAgIHJldHVybiBuZXcgV2Vha1NldCgpXG4gICAgfVxuXG4gICAgY29uc3Qgb2JqZWN0ID0gY3JlYXRlKHtcbiAgICAgIGFkZDogKHZhbHVlKSA9PiBvYmplY3QuX3ZhbHVlcy5wdXNoKHZhbHVlKSxcbiAgICAgIGhhczogKHZhbHVlKSA9PiAhIX5vYmplY3QuX3ZhbHVlcy5pbmRleE9mKHZhbHVlKVxuICAgIH0pXG5cbiAgICBvYmplY3QuX3ZhbHVlcyA9IFtdXG5cbiAgICByZXR1cm4gb2JqZWN0XG4gIH1cblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGdldENsZWFuQ2xvbmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGdldCBhbiBlbXB0eSB2ZXJzaW9uIG9mIHRoZSBvYmplY3Qgd2l0aCB0aGUgc2FtZSBwcm90b3R5cGUgaXQgaGFzXG4gICAqXG4gICAqIEBwYXJhbSBvYmplY3QgdGhlIG9iamVjdCB0byBidWlsZCBhIGNsZWFuIGNsb25lIGZyb21cbiAgICogQHBhcmFtIHJlYWxtIHRoZSByZWFsbSB0aGUgb2JqZWN0IHJlc2lkZXMgaW5cbiAgICogQHJldHVybnMgdGhlIGVtcHR5IGNsb25lZCBvYmplY3RcbiAgICovXG4gIGNvbnN0IGdldENsZWFuQ2xvbmUgPSAob2JqZWN0LCByZWFsbSkgPT4ge1xuICAgIGlmICghb2JqZWN0LmNvbnN0cnVjdG9yKSB7XG4gICAgICByZXR1cm4gY3JlYXRlKG51bGwpXG4gICAgfVxuXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvXG4gICAgY29uc3QgcHJvdG90eXBlID0gb2JqZWN0Ll9fcHJvdG9fXyB8fCBnZXRQcm90b3R5cGVPZihvYmplY3QpXG5cbiAgICBpZiAob2JqZWN0LmNvbnN0cnVjdG9yID09PSByZWFsbS5PYmplY3QpIHtcbiAgICAgIHJldHVybiBwcm90b3R5cGUgPT09IHJlYWxtLk9iamVjdC5wcm90b3R5cGUgPyB7fSA6IGNyZWF0ZShwcm90b3R5cGUpXG4gICAgfVxuXG4gICAgaWYgKH50b1N0cmluZ0Z1bmN0aW9uLmNhbGwob2JqZWN0LmNvbnN0cnVjdG9yKS5pbmRleE9mKCdbbmF0aXZlIGNvZGVdJykpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBuZXcgb2JqZWN0LmNvbnN0cnVjdG9yKClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gRXJyb3JcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY3JlYXRlKHByb3RvdHlwZSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAZnVuY3Rpb24gZ2V0T2JqZWN0Q2xvbmVMb29zZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogZ2V0IGEgY29weSBvZiB0aGUgb2JqZWN0IGJhc2VkIG9uIGxvb3NlIHJ1bGVzLCBtZWFuaW5nIGFsbCBlbnVtZXJhYmxlIGtleXNcbiAgICogYW5kIHN5bWJvbHMgYXJlIGNvcGllZCwgYnV0IHByb3BlcnR5IGRlc2NyaXB0b3JzIGFyZSBub3QgY29uc2lkZXJlZFxuICAgKlxuICAgKiBAcGFyYW0gb2JqZWN0IHRoZSBvYmplY3QgdG8gY2xvbmVcbiAgICogQHBhcmFtIHJlYWxtIHRoZSByZWFsbSB0aGUgb2JqZWN0IHJlc2lkZXMgaW5cbiAgICogQHBhcmFtIGhhbmRsZUNvcHkgdGhlIGZ1bmN0aW9uIHRoYXQgaGFuZGxlcyBjb3B5aW5nIHRoZSBvYmplY3RcbiAgICogQHJldHVybnMgdGhlIGNvcGllZCBvYmplY3RcbiAgICovXG4gIGNvbnN0IGdldE9iamVjdENsb25lTG9vc2UgPSAoXG4gICAgb2JqZWN0LFxuICAgIHJlYWxtLFxuICAgIGhhbmRsZUNvcHksXG4gICAgY2FjaGVcbiAgKSA9PiB7XG4gICAgY29uc3QgY2xvbmUgPSBnZXRDbGVhbkNsb25lKG9iamVjdCwgcmVhbG0pXG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSkge1xuICAgICAgICBjbG9uZVtrZXldID0gaGFuZGxlQ29weShvYmplY3Rba2V5XSwgY2FjaGUpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKFNVUFBPUlRTLlNZTUJPTF9QUk9QRVJUSUVTKSB7XG4gICAgICBjb25zdCBzeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzKG9iamVjdClcblxuICAgICAgaWYgKHN5bWJvbHMubGVuZ3RoKSB7XG4gICAgICAgIGZvciAobGV0IGluZGV4ID0gMCwgc3ltYm9sOyBpbmRleCA8IHN5bWJvbHMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgc3ltYm9sID0gc3ltYm9sc1tpbmRleF1cblxuICAgICAgICAgIGlmIChwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKG9iamVjdCwgc3ltYm9sKSkge1xuICAgICAgICAgICAgY2xvbmVbc3ltYm9sXSA9IGhhbmRsZUNvcHkob2JqZWN0W3N5bWJvbF0sIGNhY2hlKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjbG9uZVxuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBnZXRPYmplY3RDbG9uZVN0cmljdFxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogZ2V0IGEgY29weSBvZiB0aGUgb2JqZWN0IGJhc2VkIG9uIHN0cmljdCBydWxlcywgbWVhbmluZyBhbGwga2V5cyBhbmQgc3ltYm9sc1xuICAgKiBhcmUgY29waWVkIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBkZXNjcmlwdG9yc1xuICAgKlxuICAgKiBAcGFyYW0gb2JqZWN0IHRoZSBvYmplY3QgdG8gY2xvbmVcbiAgICogQHBhcmFtIHJlYWxtIHRoZSByZWFsbSB0aGUgb2JqZWN0IHJlc2lkZXMgaW5cbiAgICogQHBhcmFtIGhhbmRsZUNvcHkgdGhlIGZ1bmN0aW9uIHRoYXQgaGFuZGxlcyBjb3B5aW5nIHRoZSBvYmplY3RcbiAgICogQHJldHVybnMgdGhlIGNvcGllZCBvYmplY3RcbiAgICovXG4gIGNvbnN0IGdldE9iamVjdENsb25lU3RyaWN0ID0gKFxuICAgIG9iamVjdCxcbiAgICByZWFsbSxcbiAgICBoYW5kbGVDb3B5LFxuICAgIGNhY2hlXG4gICkgPT4ge1xuICAgIGNvbnN0IGNsb25lID0gZ2V0Q2xlYW5DbG9uZShvYmplY3QsIHJlYWxtKVxuXG4gICAgY29uc3QgcHJvcGVydGllcyA9IFNVUFBPUlRTLlNZTUJPTF9QUk9QRVJUSUVTXG4gICAgICA/IFtdLmNvbmNhdChnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdCksIGdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpKVxuICAgICAgOiBnZXRPd25Qcm9wZXJ0eU5hbWVzKG9iamVjdClcblxuICAgIGlmIChwcm9wZXJ0aWVzLmxlbmd0aCkge1xuICAgICAgZm9yIChcbiAgICAgICAgbGV0IGluZGV4ID0gMCwgcHJvcGVydHksIGRlc2NyaXB0b3I7XG4gICAgICAgIGluZGV4IDwgcHJvcGVydGllcy5sZW5ndGg7XG4gICAgICAgIGluZGV4KytcbiAgICAgICkge1xuICAgICAgICBwcm9wZXJ0eSA9IHByb3BlcnRpZXNbaW5kZXhdXG5cbiAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAnY2FsbGVlJyAmJiBwcm9wZXJ0eSAhPT0gJ2NhbGxlcicpIHtcbiAgICAgICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpXG5cbiAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gaGFuZGxlQ29weShvYmplY3RbcHJvcGVydHldLCBjYWNoZSlcblxuICAgICAgICAgIGRlZmluZVByb3BlcnR5KGNsb25lLCBwcm9wZXJ0eSwgZGVzY3JpcHRvcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjbG9uZVxuICB9XG5cbiAgLyoqXG4gICAqIEBmdW5jdGlvbiBnZXRSZWdFeHBGbGFnc1xuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogZ2V0IHRoZSBmbGFncyB0byBhcHBseSB0byB0aGUgY29waWVkIHJlZ2V4cFxuICAgKlxuICAgKiBAcGFyYW0gcmVnRXhwIHRoZSByZWdleHAgdG8gZ2V0IHRoZSBmbGFncyBvZlxuICAgKiBAcmV0dXJucyB0aGUgZmxhZ3MgZm9yIHRoZSByZWdleHBcbiAgICovXG4gIGNvbnN0IGdldFJlZ0V4cEZsYWdzID0gKHJlZ0V4cCkgPT4ge1xuICAgIGxldCBmbGFncyA9ICcnXG5cbiAgICBpZiAocmVnRXhwLmdsb2JhbCkge1xuICAgICAgZmxhZ3MgKz0gJ2cnXG4gICAgfVxuXG4gICAgaWYgKHJlZ0V4cC5pZ25vcmVDYXNlKSB7XG4gICAgICBmbGFncyArPSAnaSdcbiAgICB9XG5cbiAgICBpZiAocmVnRXhwLm11bHRpbGluZSkge1xuICAgICAgZmxhZ3MgKz0gJ20nXG4gICAgfVxuXG4gICAgaWYgKHJlZ0V4cC51bmljb2RlKSB7XG4gICAgICBmbGFncyArPSAndSdcbiAgICB9XG5cbiAgICBpZiAocmVnRXhwLnN0aWNreSkge1xuICAgICAgZmxhZ3MgKz0gJ3knXG4gICAgfVxuXG4gICAgcmV0dXJuIGZsYWdzXG4gIH1cblxuICBjb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5XG5cbiAgY29uc3QgR0xPQkFMX1RISVMgPSAoKCkgPT4ge1xuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBzZWxmXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gd2luZG93XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsXG4gICAgfVxuXG4gICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignVW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0LCByZXR1cm5pbmcgXCJ0aGlzXCIuJylcbiAgICB9XG4gIH0pKClcblxuICAvKipcbiAgICogQGZ1bmN0aW9uIGNsb25lXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBjb3B5IGFuIG9iamVjdCBkZWVwbHkgYXMgbXVjaCBhcyBwb3NzaWJsZVxuICAgKlxuICAgKiBJZiBgc3RyaWN0YCBpcyBhcHBsaWVkLCB0aGVuIGFsbCBwcm9wZXJ0aWVzIChpbmNsdWRpbmcgbm9uLWVudW1lcmFibGUgb25lcylcbiAgICogYXJlIGNvcGllZCB3aXRoIHRoZWlyIG9yaWdpbmFsIHByb3BlcnR5IGRlc2NyaXB0b3JzIG9uIGJvdGggb2JqZWN0cyBhbmQgYXJyYXlzLlxuICAgKlxuICAgKiBUaGUgb2JqZWN0IGlzIGNvbXBhcmVkIHRvIHRoZSBnbG9iYWwgY29uc3RydWN0b3JzIGluIHRoZSBgcmVhbG1gIHByb3ZpZGVkLFxuICAgKiBhbmQgdGhlIG5hdGl2ZSBjb25zdHJ1Y3RvciBpcyBhbHdheXMgdXNlZCB0byBlbnN1cmUgdGhhdCBleHRlbnNpb25zIG9mIG5hdGl2ZVxuICAgKiBvYmplY3RzIChhbGxvd3MgaW4gRVMyMDE1KykgYXJlIG1haW50YWluZWQuXG4gICAqXG4gICAqIEBwYXJhbSBvYmplY3QgdGhlIG9iamVjdCB0byBjb3B5XG4gICAqIEBwYXJhbSBbb3B0aW9uc10gdGhlIG9wdGlvbnMgZm9yIGNvcHlpbmcgd2l0aFxuICAgKiBAcGFyYW0gW29wdGlvbnMuaXNTdHJpY3RdIHNob3VsZCB0aGUgY29weSBiZSBzdHJpY3RcbiAgICogQHBhcmFtIFtvcHRpb25zLnJlYWxtXSB0aGUgcmVhbG0gKHRoaXMpIG9iamVjdCB0aGUgb2JqZWN0IGlzIGNvcGllZCBmcm9tXG4gICAqIEByZXR1cm5zIHRoZSBjb3BpZWQgb2JqZWN0XG4gICAqL1xuICBmdW5jdGlvbiBjbG9uZSAob2JqZWN0LCBvcHRpb25zKSB7XG4gICAgLy8gbWFudWFsbHkgY29hbGVzY2VkIGluc3RlYWQgb2YgZGVmYXVsdCBwYXJhbWV0ZXJzIGZvciBwZXJmb3JtYW5jZVxuICAgIGNvbnN0IGlzU3RyaWN0ID0gISEob3B0aW9ucyAmJiBvcHRpb25zLmlzU3RyaWN0KVxuICAgIGNvbnN0IHJlYWxtID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5yZWFsbSkgfHwgR0xPQkFMX1RISVNcblxuICAgIGNvbnN0IGdldE9iamVjdENsb25lID0gaXNTdHJpY3RcbiAgICAgID8gZ2V0T2JqZWN0Q2xvbmVTdHJpY3RcbiAgICAgIDogZ2V0T2JqZWN0Q2xvbmVMb29zZVxuXG4gICAgLyoqXG4gICAgICogQGZ1bmN0aW9uIGhhbmRsZUNvcHlcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIGNvcHkgdGhlIG9iamVjdCByZWN1cnNpdmVseSBiYXNlZCBvbiBpdHMgdHlwZVxuICAgICAqXG4gICAgICogQHBhcmFtIG9iamVjdCB0aGUgb2JqZWN0IHRvIGNvcHlcbiAgICAgKiBAcmV0dXJucyB0aGUgY29waWVkIG9iamVjdFxuICAgICAqL1xuICAgIGNvbnN0IGhhbmRsZUNvcHkgPSAoXG4gICAgICBvYmplY3QsXG4gICAgICBjYWNoZVxuICAgICkgPT4ge1xuICAgICAgaWYgKCFvYmplY3QgfHwgdHlwZW9mIG9iamVjdCAhPT0gJ29iamVjdCcgfHwgY2FjaGUuaGFzKG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFxuICAgICAgfVxuXG4gICAgICAvLyBET00gb2JqZWN0c1xuICAgICAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuY2xvbmVOb2RlKGZhbHNlKVxuICAgICAgfVxuXG4gICAgICBjb25zdCBDb25zdHJ1Y3RvciA9IG9iamVjdC5jb25zdHJ1Y3RvclxuXG4gICAgICAvLyBwbGFpbiBvYmplY3RzXG4gICAgICBpZiAoQ29uc3RydWN0b3IgPT09IHJlYWxtLk9iamVjdCkge1xuICAgICAgICBjYWNoZS5hZGQob2JqZWN0KVxuXG4gICAgICAgIHJldHVybiBnZXRPYmplY3RDbG9uZShvYmplY3QsIHJlYWxtLCBoYW5kbGVDb3B5LCBjYWNoZSlcbiAgICAgIH1cblxuICAgICAgbGV0IGNsb25lXG5cbiAgICAgIC8vIGFycmF5c1xuICAgICAgaWYgKGlzQXJyYXkob2JqZWN0KSkge1xuICAgICAgICBjYWNoZS5hZGQob2JqZWN0KVxuXG4gICAgICAgIC8vIGlmIHN0cmljdCwgaW5jbHVkZSBub24tc3RhbmRhcmQgcHJvcGVydGllc1xuICAgICAgICBpZiAoaXNTdHJpY3QpIHtcbiAgICAgICAgICByZXR1cm4gZ2V0T2JqZWN0Q2xvbmVTdHJpY3Qob2JqZWN0LCByZWFsbSwgaGFuZGxlQ29weSwgY2FjaGUpXG4gICAgICAgIH1cblxuICAgICAgICBjbG9uZSA9IG5ldyBDb25zdHJ1Y3RvcigpXG5cbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9iamVjdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICBjbG9uZVtpbmRleF0gPSBoYW5kbGVDb3B5KG9iamVjdFtpbmRleF0sIGNhY2hlKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsb25lXG4gICAgICB9XG5cbiAgICAgIC8vIGRhdGVzXG4gICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgcmVhbG0uRGF0ZSkge1xuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKG9iamVjdC5nZXRUaW1lKCkpXG4gICAgICB9XG5cbiAgICAgIC8vIHJlZ2V4cHNcbiAgICAgIGlmIChvYmplY3QgaW5zdGFuY2VvZiByZWFsbS5SZWdFeHApIHtcbiAgICAgICAgY2xvbmUgPSBuZXcgQ29uc3RydWN0b3IoXG4gICAgICAgICAgb2JqZWN0LnNvdXJjZSxcbiAgICAgICAgICBvYmplY3QuZmxhZ3MgfHwgZ2V0UmVnRXhwRmxhZ3Mob2JqZWN0KVxuICAgICAgICApXG5cbiAgICAgICAgY2xvbmUubGFzdEluZGV4ID0gb2JqZWN0Lmxhc3RJbmRleFxuXG4gICAgICAgIHJldHVybiBjbG9uZVxuICAgICAgfVxuXG4gICAgICAvLyBtYXBzXG4gICAgICBpZiAocmVhbG0uTWFwICYmIG9iamVjdCBpbnN0YW5jZW9mIHJlYWxtLk1hcCkge1xuICAgICAgICBjYWNoZS5hZGQob2JqZWN0KVxuXG4gICAgICAgIGNsb25lID0gbmV3IENvbnN0cnVjdG9yKClcblxuICAgICAgICBvYmplY3QuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICAgIGNsb25lLnNldChrZXksIGhhbmRsZUNvcHkodmFsdWUsIGNhY2hlKSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gY2xvbmVcbiAgICAgIH1cblxuICAgICAgLy8gc2V0c1xuICAgICAgaWYgKHJlYWxtLlNldCAmJiBvYmplY3QgaW5zdGFuY2VvZiByZWFsbS5TZXQpIHtcbiAgICAgICAgY2FjaGUuYWRkKG9iamVjdClcblxuICAgICAgICBjbG9uZSA9IG5ldyBDb25zdHJ1Y3RvcigpXG5cbiAgICAgICAgb2JqZWN0LmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgICAgY2xvbmUuYWRkKGhhbmRsZUNvcHkodmFsdWUsIGNhY2hlKSlcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gY2xvbmVcbiAgICAgIH1cblxuICAgICAgLy8gYnVmZmVycyAobm9kZS1vbmx5KVxuICAgICAgaWYgKHJlYWxtLkJ1ZmZlciAmJiByZWFsbS5CdWZmZXIuaXNCdWZmZXIob2JqZWN0KSkge1xuICAgICAgICBjbG9uZSA9IHJlYWxtLkJ1ZmZlci5hbGxvY1Vuc2FmZVxuICAgICAgICAgID8gcmVhbG0uQnVmZmVyLmFsbG9jVW5zYWZlKG9iamVjdC5sZW5ndGgpXG4gICAgICAgICAgOiBuZXcgQ29uc3RydWN0b3Iob2JqZWN0Lmxlbmd0aClcblxuICAgICAgICBvYmplY3QuY29weShjbG9uZSlcblxuICAgICAgICByZXR1cm4gY2xvbmVcbiAgICAgIH1cblxuICAgICAgLy8gYXJyYXlidWZmZXJzIC8gZGF0YXZpZXdzXG4gICAgICBpZiAocmVhbG0uQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgLy8gZGF0YXZpZXdzXG4gICAgICAgIGlmIChyZWFsbS5BcnJheUJ1ZmZlci5pc1ZpZXcob2JqZWN0KSkge1xuICAgICAgICAgIHJldHVybiBuZXcgQ29uc3RydWN0b3Iob2JqZWN0LmJ1ZmZlci5zbGljZSgwKSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFycmF5YnVmZmVyc1xuICAgICAgICBpZiAob2JqZWN0IGluc3RhbmNlb2YgcmVhbG0uQXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICByZXR1cm4gb2JqZWN0LnNsaWNlKDApXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIG9iamVjdCBjYW5ub3QgLyBzaG91bGQgbm90IGJlIGNsb25lZCwgZG9uJ3RcbiAgICAgIGlmIChcbiAgICAgICAgLy8gcHJvbWlzZS1saWtlXG4gICAgICAgIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgJ3RoZW4nKSAmJiB0eXBlb2Ygb2JqZWN0LnRoZW4gPT09ICdmdW5jdGlvbicpIHx8XG4gICAgICAgIC8vIGVycm9yc1xuICAgICAgICBvYmplY3QgaW5zdGFuY2VvZiBFcnJvciB8fFxuICAgICAgICAvLyB3ZWFrbWFwc1xuICAgICAgICAocmVhbG0uV2Vha01hcCAmJiBvYmplY3QgaW5zdGFuY2VvZiByZWFsbS5XZWFrTWFwKSB8fFxuICAgICAgICAvLyB3ZWFrc2V0c1xuICAgICAgICAocmVhbG0uV2Vha1NldCAmJiBvYmplY3QgaW5zdGFuY2VvZiByZWFsbS5XZWFrU2V0KVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBvYmplY3RcbiAgICAgIH1cblxuICAgICAgY2FjaGUuYWRkKG9iamVjdClcblxuICAgICAgLy8gYXNzdW1lIGFueXRoaW5nIGxlZnQgaXMgYSBjdXN0b20gY29uc3RydWN0b3JcbiAgICAgIHJldHVybiBnZXRPYmplY3RDbG9uZShvYmplY3QsIHJlYWxtLCBoYW5kbGVDb3B5LCBjYWNoZSlcbiAgICB9XG5cbiAgICByZXR1cm4gaGFuZGxlQ29weShvYmplY3QsIGNyZWF0ZUNhY2hlKCkpXG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJ1xuZXhwb3J0IGNvbnN0IHRhcmdldCA9IGlzQnJvd3NlclxuICA/IHdpbmRvd1xuICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXG4gICAgPyBnbG9iYWxcbiAgICA6IHt9XG5leHBvcnQgY29uc3QgaXNDaHJvbWUgPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiAhIWNocm9tZS5kZXZ0b29sc1xuZXhwb3J0IGNvbnN0IGlzRmlyZWZveCA9IGlzQnJvd3NlciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSA+IC0xXG5leHBvcnQgY29uc3QgaXNXaW5kb3dzID0gaXNCcm93c2VyICYmIG5hdmlnYXRvci5wbGF0Zm9ybS5pbmRleE9mKCdXaW4nKSA9PT0gMFxuZXhwb3J0IGNvbnN0IGlzTWFjID0gaXNCcm93c2VyICYmIG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gJ01hY0ludGVsJ1xuZXhwb3J0IGNvbnN0IGlzTGludXggPSBpc0Jyb3dzZXIgJiYgbmF2aWdhdG9yLnBsYXRmb3JtLmluZGV4T2YoJ0xpbnV4JykgPT09IDBcbmV4cG9ydCBjb25zdCBrZXlzID0ge1xuICBjdHJsOiBpc01hYyA/ICcmIzg5ODQ7JyA6ICdDdHJsJyxcbiAgc2hpZnQ6ICdTaGlmdCcsXG4gIGFsdDogaXNNYWMgPyAnJiM4OTk3OycgOiAnQWx0JyxcbiAgZGVsOiAnRGVsJyxcbiAgZW50ZXI6ICdFbnRlcicsXG4gIGVzYzogJ0VzYydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRFbnYgKFZ1ZSkge1xuICBpZiAoVnVlLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnJGlzQ2hyb21lJykpIHJldHVyblxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFZ1ZS5wcm90b3R5cGUsIHtcbiAgICAnJGlzQ2hyb21lJzogeyBnZXQ6ICgpID0+IGlzQ2hyb21lIH0sXG4gICAgJyRpc0ZpcmVmb3gnOiB7IGdldDogKCkgPT4gaXNGaXJlZm94IH0sXG4gICAgJyRpc1dpbmRvd3MnOiB7IGdldDogKCkgPT4gaXNXaW5kb3dzIH0sXG4gICAgJyRpc01hYyc6IHsgZ2V0OiAoKSA9PiBpc01hYyB9LFxuICAgICckaXNMaW51eCc6IHsgZ2V0OiAoKSA9PiBpc0xpbnV4IH0sXG4gICAgJyRrZXlzJzogeyBnZXQ6ICgpID0+IGtleXMgfVxuICB9KVxuXG4gIGlmIChpc1dpbmRvd3MpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGxhdGZvcm0td2luZG93cycpXG4gIGlmIChpc01hYykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwbGF0Zm9ybS1tYWMnKVxuICBpZiAoaXNMaW51eCkgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwbGF0Zm9ybS1saW51eCcpXG59XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCIvLyBUaGlzIHNjcmlwdCBpcyBpbmplY3RlZCBpbnRvIGV2ZXJ5IHBhZ2UuXG5pbXBvcnQgeyBpbnN0YWxsSG9vayB9IGZyb20gJ0BiYWNrL2hvb2snXG5pbXBvcnQgeyBpc0ZpcmVmb3ggfSBmcm9tICdAdXRpbHMvZW52J1xuXG4vLyBpbmplY3QgdGhlIGhvb2tcbmlmIChkb2N1bWVudCBpbnN0YW5jZW9mIEhUTUxEb2N1bWVudCkge1xuICBjb25zdCBzb3VyY2UgPSAnOygnICsgaW5zdGFsbEhvb2sudG9TdHJpbmcoKSArICcpKHdpbmRvdyknXG5cbiAgaWYgKGlzRmlyZWZveCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1ldmFsXG4gICAgd2luZG93LmV2YWwoc291cmNlKSAvLyBpbiBGaXJlZm94LCB0aGlzIGV2YWx1YXRlcyBvbiB0aGUgY29udGVudCB3aW5kb3dcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgIHNjcmlwdC50ZXh0Q29udGVudCA9IHNvdXJjZVxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hcHBlbmRDaGlsZChzY3JpcHQpXG4gICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9