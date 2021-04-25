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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/detector.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../../node_modules/@vue-devtools/app-backend/src/toast.js":
/*!***************************************************************************************************!*\
  !*** /Users/twt/Desktop/scratch/vue-devtools/node_modules/@vue-devtools/app-backend/src/toast.js ***!
  \***************************************************************************************************/
/*! exports provided: installToast */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "installToast", function() { return installToast; });
function installToast (target) {
  if (typeof document === 'undefined') return
  let toastEl = null
  let toastTimer = 0

  const colors = {
    normal: '#3BA776',
    warn: '#DB6B00',
    error: '#DB2600'
  }

  target.__VUE_DEVTOOLS_TOAST__ = (message, type) => {
    const color = colors[type] || colors.normal
    console.log(`%c vue-devtools %c ${message} %c `,
      'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      `background: ${color}; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
      'background:transparent')
    if (!toastEl) {
      toastEl = document.createElement('div')
      toastEl.addEventListener('click', removeToast)

      const vueDevtoolsToast = document.createElement('div')
      vueDevtoolsToast.id = 'vue-devtools-toast'
      vueDevtoolsToast.style.position = 'fixed'
      vueDevtoolsToast.style.bottom = '6px'
      vueDevtoolsToast.style.left = '0'
      vueDevtoolsToast.style.right = '0'
      vueDevtoolsToast.style.height = '0'
      vueDevtoolsToast.style.display = 'flex'
      vueDevtoolsToast.style.alignItems = 'flex-end'
      vueDevtoolsToast.style.justifyContent = 'center'
      vueDevtoolsToast.style.zIndex = '999999999999999999999'
      vueDevtoolsToast.style.fontFamily = 'Menlo, Consolas, monospace'
      vueDevtoolsToast.style.fontSize = '14px'

      const vueWrapper = document.createElement('div')
      vueWrapper.className = 'vue-wrapper'
      vueWrapper.style.padding = '6px 12px'
      vueWrapper.style.background = color
      vueWrapper.style.color = 'white'
      vueWrapper.style.borderRadius = '3px'
      vueWrapper.style.flex = 'auto 0 1'
      vueWrapper.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)'
      vueWrapper.style.cursor = 'pointer'

      const vueContent = document.createElement('div')
      vueContent.className = 'vue-content'

      vueWrapper.appendChild(vueContent)
      vueDevtoolsToast.appendChild(vueWrapper)
      toastEl.appendChild(vueDevtoolsToast)
      document.body.appendChild(toastEl)
    } else {
      toastEl.querySelector('.vue-wrapper').style.background = color
    }

    toastEl.querySelector('.vue-content').innerText = message

    clearTimeout(toastTimer)
    toastTimer = setTimeout(removeToast, 5000)
  }

  function removeToast () {
    clearTimeout(toastTimer)
    if (toastEl) {
      document.body.removeChild(toastEl)
      toastEl = null
    }
  }
}


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

/***/ "./src/detector.js":
/*!*************************!*\
  !*** ./src/detector.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _back_toast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @back/toast */ "../../node_modules/@vue-devtools/app-backend/src/toast.js");
/* harmony import */ var _utils_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @utils/env */ "../../node_modules/@vue-devtools/shared-utils/src/env.js");



window.addEventListener('message', e => {
  if (e.source === window && e.data.vueDetected) {
    chrome.runtime.sendMessage(e.data)
  }
})

function detect (win) {
  setTimeout(() => {
    // Method 1: Check Nuxt.js
    var nuxtDetected = Boolean(window.__NUXT__ || window.$nuxt)

    if (nuxtDetected) {
      var Vue

      if (window.$nuxt) {
        Vue = window.$nuxt.$root.constructor
      }

      win.postMessage({
        devtoolsEnabled: Vue && Vue.config.devtools,
        vueDetected: true,
        nuxtDetected: true
      }, '*')

      return
    }

    // Method 2: Scan all elements inside document
    var all = document.querySelectorAll('*')
    var el
    for (var i = 0; i < all.length; i++) {
      if (all[i].__vue__) {
        el = all[i]
        break
      }
    }
    if (el) {
      var Vue$1 = Object.getPrototypeOf(el.__vue__).constructor
      while (Vue$1.super) {
        Vue$1 = Vue$1.super
      }
      win.postMessage({
        devtoolsEnabled: Vue$1.config.devtools,
        vueDetected: true
      }, '*')
    }
  }, 100)
}

// inject the hook
if (document instanceof HTMLDocument) {
  installScript(detect)
  installScript(_back_toast__WEBPACK_IMPORTED_MODULE_0__["installToast"])
}

function installScript (fn) {
  var source = ';(' + fn.toString() + ')(window)'

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy90d3QvRGVza3RvcC9zY3JhdGNoL3Z1ZS1kZXZ0b29scy9ub2RlX21vZHVsZXMvQHZ1ZS1kZXZ0b29scy9hcHAtYmFja2VuZC9zcmMvdG9hc3QuanMiLCJ3ZWJwYWNrOi8vLy9Vc2Vycy90d3QvRGVza3RvcC9zY3JhdGNoL3Z1ZS1kZXZ0b29scy9ub2RlX21vZHVsZXMvQHZ1ZS1kZXZ0b29scy9zaGFyZWQtdXRpbHMvc3JjL2Vudi5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9kZXRlY3Rvci5qcyJdLCJuYW1lcyI6WyJjb25zdCIsImxldCIsIlZ1ZSJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQU87QUFDUDtBQUNBO0FBQ0E7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LENBQUMsQ0FBQyxXQUFXO01BQ3ZELE9BQU9BLEtBQUcsQ0FBQyxLQUFLLEVBQUU7UUFDaEJBLEtBQUcsR0FBR0EsS0FBRyxDQUFDLEtBQUs7T0FDaEI7TUFDRCxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ2QsZUFBZSxFQUFFQSxLQUFHLENBQUMsTUFBTSxDQUFDLFFBQVE7UUFDcEMsV0FBVyxFQUFFLElBQUk7T0FDbEIsRUFBRSxHQUFHLENBQUM7S0FDUjtHQUNGLEVBQUUsR0FBRyxDQUFDO0NBQ1I7OztBQUdELElBQUksUUFBUSxZQUFZLFlBQVksRUFBRTtFQUNwQyxhQUFhLENBQUMsTUFBTSxDQUFDO0VBQ3JCLGFBQWEsQ0FBQyx3REFBWSxDQUFDO0NBQzVCOztBQUVELFNBQVMsYUFBYSxFQUFFLEVBQUUsRUFBRTtFQUMxQkYsR0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxHQUFHLFdBQVc7O0VBRWpELElBQUksb0RBQVMsRUFBRTs7SUFFYixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztHQUNwQixNQUFNO0lBQ0xBLEdBQUssQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDL0MsTUFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNO0lBQzNCLFFBQVEsQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUM1QyxNQUFNLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUM7R0FDdEM7Q0FDRiIsImZpbGUiOiJkZXRlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2RldGVjdG9yLmpzXCIpO1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGluc3RhbGxUb2FzdCAodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSByZXR1cm5cbiAgbGV0IHRvYXN0RWwgPSBudWxsXG4gIGxldCB0b2FzdFRpbWVyID0gMFxuXG4gIGNvbnN0IGNvbG9ycyA9IHtcbiAgICBub3JtYWw6ICcjM0JBNzc2JyxcbiAgICB3YXJuOiAnI0RCNkIwMCcsXG4gICAgZXJyb3I6ICcjREIyNjAwJ1xuICB9XG5cbiAgdGFyZ2V0Ll9fVlVFX0RFVlRPT0xTX1RPQVNUX18gPSAobWVzc2FnZSwgdHlwZSkgPT4ge1xuICAgIGNvbnN0IGNvbG9yID0gY29sb3JzW3R5cGVdIHx8IGNvbG9ycy5ub3JtYWxcbiAgICBjb25zb2xlLmxvZyhgJWMgdnVlLWRldnRvb2xzICVjICR7bWVzc2FnZX0gJWMgYCxcbiAgICAgICdiYWNrZ3JvdW5kOiMzNTQ5NWUgOyBwYWRkaW5nOiAxcHg7IGJvcmRlci1yYWRpdXM6IDNweCAwIDAgM3B4OyAgY29sb3I6ICNmZmYnLFxuICAgICAgYGJhY2tncm91bmQ6ICR7Y29sb3J9OyBwYWRkaW5nOiAxcHg7IGJvcmRlci1yYWRpdXM6IDAgM3B4IDNweCAwOyAgY29sb3I6ICNmZmZgLFxuICAgICAgJ2JhY2tncm91bmQ6dHJhbnNwYXJlbnQnKVxuICAgIGlmICghdG9hc3RFbCkge1xuICAgICAgdG9hc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICB0b2FzdEVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgcmVtb3ZlVG9hc3QpXG5cbiAgICAgIGNvbnN0IHZ1ZURldnRvb2xzVG9hc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgICAgdnVlRGV2dG9vbHNUb2FzdC5pZCA9ICd2dWUtZGV2dG9vbHMtdG9hc3QnXG4gICAgICB2dWVEZXZ0b29sc1RvYXN0LnN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJ1xuICAgICAgdnVlRGV2dG9vbHNUb2FzdC5zdHlsZS5ib3R0b20gPSAnNnB4J1xuICAgICAgdnVlRGV2dG9vbHNUb2FzdC5zdHlsZS5sZWZ0ID0gJzAnXG4gICAgICB2dWVEZXZ0b29sc1RvYXN0LnN0eWxlLnJpZ2h0ID0gJzAnXG4gICAgICB2dWVEZXZ0b29sc1RvYXN0LnN0eWxlLmhlaWdodCA9ICcwJ1xuICAgICAgdnVlRGV2dG9vbHNUb2FzdC5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnXG4gICAgICB2dWVEZXZ0b29sc1RvYXN0LnN0eWxlLmFsaWduSXRlbXMgPSAnZmxleC1lbmQnXG4gICAgICB2dWVEZXZ0b29sc1RvYXN0LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gJ2NlbnRlcidcbiAgICAgIHZ1ZURldnRvb2xzVG9hc3Quc3R5bGUuekluZGV4ID0gJzk5OTk5OTk5OTk5OTk5OTk5OTk5OSdcbiAgICAgIHZ1ZURldnRvb2xzVG9hc3Quc3R5bGUuZm9udEZhbWlseSA9ICdNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZSdcbiAgICAgIHZ1ZURldnRvb2xzVG9hc3Quc3R5bGUuZm9udFNpemUgPSAnMTRweCdcblxuICAgICAgY29uc3QgdnVlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gICAgICB2dWVXcmFwcGVyLmNsYXNzTmFtZSA9ICd2dWUtd3JhcHBlcidcbiAgICAgIHZ1ZVdyYXBwZXIuc3R5bGUucGFkZGluZyA9ICc2cHggMTJweCdcbiAgICAgIHZ1ZVdyYXBwZXIuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yXG4gICAgICB2dWVXcmFwcGVyLnN0eWxlLmNvbG9yID0gJ3doaXRlJ1xuICAgICAgdnVlV3JhcHBlci5zdHlsZS5ib3JkZXJSYWRpdXMgPSAnM3B4J1xuICAgICAgdnVlV3JhcHBlci5zdHlsZS5mbGV4ID0gJ2F1dG8gMCAxJ1xuICAgICAgdnVlV3JhcHBlci5zdHlsZS5ib3hTaGFkb3cgPSAnMCAzcHggMTBweCByZ2JhKDAsIDAsIDAsIDAuMiknXG4gICAgICB2dWVXcmFwcGVyLnN0eWxlLmN1cnNvciA9ICdwb2ludGVyJ1xuXG4gICAgICBjb25zdCB2dWVDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbiAgICAgIHZ1ZUNvbnRlbnQuY2xhc3NOYW1lID0gJ3Z1ZS1jb250ZW50J1xuXG4gICAgICB2dWVXcmFwcGVyLmFwcGVuZENoaWxkKHZ1ZUNvbnRlbnQpXG4gICAgICB2dWVEZXZ0b29sc1RvYXN0LmFwcGVuZENoaWxkKHZ1ZVdyYXBwZXIpXG4gICAgICB0b2FzdEVsLmFwcGVuZENoaWxkKHZ1ZURldnRvb2xzVG9hc3QpXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRvYXN0RWwpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRvYXN0RWwucXVlcnlTZWxlY3RvcignLnZ1ZS13cmFwcGVyJykuc3R5bGUuYmFja2dyb3VuZCA9IGNvbG9yXG4gICAgfVxuXG4gICAgdG9hc3RFbC5xdWVyeVNlbGVjdG9yKCcudnVlLWNvbnRlbnQnKS5pbm5lclRleHQgPSBtZXNzYWdlXG5cbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcilcbiAgICB0b2FzdFRpbWVyID0gc2V0VGltZW91dChyZW1vdmVUb2FzdCwgNTAwMClcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW92ZVRvYXN0ICgpIHtcbiAgICBjbGVhclRpbWVvdXQodG9hc3RUaW1lcilcbiAgICBpZiAodG9hc3RFbCkge1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0b2FzdEVsKVxuICAgICAgdG9hc3RFbCA9IG51bGxcbiAgICB9XG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJ1xuZXhwb3J0IGNvbnN0IHRhcmdldCA9IGlzQnJvd3NlclxuICA/IHdpbmRvd1xuICA6IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnXG4gICAgPyBnbG9iYWxcbiAgICA6IHt9XG5leHBvcnQgY29uc3QgaXNDaHJvbWUgPSB0eXBlb2YgY2hyb21lICE9PSAndW5kZWZpbmVkJyAmJiAhIWNocm9tZS5kZXZ0b29sc1xuZXhwb3J0IGNvbnN0IGlzRmlyZWZveCA9IGlzQnJvd3NlciAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoJ0ZpcmVmb3gnKSA+IC0xXG5leHBvcnQgY29uc3QgaXNXaW5kb3dzID0gaXNCcm93c2VyICYmIG5hdmlnYXRvci5wbGF0Zm9ybS5pbmRleE9mKCdXaW4nKSA9PT0gMFxuZXhwb3J0IGNvbnN0IGlzTWFjID0gaXNCcm93c2VyICYmIG5hdmlnYXRvci5wbGF0Zm9ybSA9PT0gJ01hY0ludGVsJ1xuZXhwb3J0IGNvbnN0IGlzTGludXggPSBpc0Jyb3dzZXIgJiYgbmF2aWdhdG9yLnBsYXRmb3JtLmluZGV4T2YoJ0xpbnV4JykgPT09IDBcbmV4cG9ydCBjb25zdCBrZXlzID0ge1xuICBjdHJsOiBpc01hYyA/ICcmIzg5ODQ7JyA6ICdDdHJsJyxcbiAgc2hpZnQ6ICdTaGlmdCcsXG4gIGFsdDogaXNNYWMgPyAnJiM4OTk3OycgOiAnQWx0JyxcbiAgZGVsOiAnRGVsJyxcbiAgZW50ZXI6ICdFbnRlcicsXG4gIGVzYzogJ0VzYydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRFbnYgKFZ1ZSkge1xuICBpZiAoVnVlLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnJGlzQ2hyb21lJykpIHJldHVyblxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFZ1ZS5wcm90b3R5cGUsIHtcbiAgICAnJGlzQ2hyb21lJzogeyBnZXQ6ICgpID0+IGlzQ2hyb21lIH0sXG4gICAgJyRpc0ZpcmVmb3gnOiB7IGdldDogKCkgPT4gaXNGaXJlZm94IH0sXG4gICAgJyRpc1dpbmRvd3MnOiB7IGdldDogKCkgPT4gaXNXaW5kb3dzIH0sXG4gICAgJyRpc01hYyc6IHsgZ2V0OiAoKSA9PiBpc01hYyB9LFxuICAgICckaXNMaW51eCc6IHsgZ2V0OiAoKSA9PiBpc0xpbnV4IH0sXG4gICAgJyRrZXlzJzogeyBnZXQ6ICgpID0+IGtleXMgfVxuICB9KVxuXG4gIGlmIChpc1dpbmRvd3MpIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LmFkZCgncGxhdGZvcm0td2luZG93cycpXG4gIGlmIChpc01hYykgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwbGF0Zm9ybS1tYWMnKVxuICBpZiAoaXNMaW51eCkgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdwbGF0Zm9ybS1saW51eCcpXG59XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJpbXBvcnQgeyBpbnN0YWxsVG9hc3QgfSBmcm9tICdAYmFjay90b2FzdCdcbmltcG9ydCB7IGlzRmlyZWZveCB9IGZyb20gJ0B1dGlscy9lbnYnXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZSA9PiB7XG4gIGlmIChlLnNvdXJjZSA9PT0gd2luZG93ICYmIGUuZGF0YS52dWVEZXRlY3RlZCkge1xuICAgIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKGUuZGF0YSlcbiAgfVxufSlcblxuZnVuY3Rpb24gZGV0ZWN0ICh3aW4pIHtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgLy8gTWV0aG9kIDE6IENoZWNrIE51eHQuanNcbiAgICBjb25zdCBudXh0RGV0ZWN0ZWQgPSBCb29sZWFuKHdpbmRvdy5fX05VWFRfXyB8fCB3aW5kb3cuJG51eHQpXG5cbiAgICBpZiAobnV4dERldGVjdGVkKSB7XG4gICAgICBsZXQgVnVlXG5cbiAgICAgIGlmICh3aW5kb3cuJG51eHQpIHtcbiAgICAgICAgVnVlID0gd2luZG93LiRudXh0LiRyb290LmNvbnN0cnVjdG9yXG4gICAgICB9XG5cbiAgICAgIHdpbi5wb3N0TWVzc2FnZSh7XG4gICAgICAgIGRldnRvb2xzRW5hYmxlZDogVnVlICYmIFZ1ZS5jb25maWcuZGV2dG9vbHMsXG4gICAgICAgIHZ1ZURldGVjdGVkOiB0cnVlLFxuICAgICAgICBudXh0RGV0ZWN0ZWQ6IHRydWVcbiAgICAgIH0sICcqJylcblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gTWV0aG9kIDI6IFNjYW4gYWxsIGVsZW1lbnRzIGluc2lkZSBkb2N1bWVudFxuICAgIGNvbnN0IGFsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJyonKVxuICAgIGxldCBlbFxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWxsLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWxsW2ldLl9fdnVlX18pIHtcbiAgICAgICAgZWwgPSBhbGxbaV1cbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVsKSB7XG4gICAgICBsZXQgVnVlID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGVsLl9fdnVlX18pLmNvbnN0cnVjdG9yXG4gICAgICB3aGlsZSAoVnVlLnN1cGVyKSB7XG4gICAgICAgIFZ1ZSA9IFZ1ZS5zdXBlclxuICAgICAgfVxuICAgICAgd2luLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgZGV2dG9vbHNFbmFibGVkOiBWdWUuY29uZmlnLmRldnRvb2xzLFxuICAgICAgICB2dWVEZXRlY3RlZDogdHJ1ZVxuICAgICAgfSwgJyonKVxuICAgIH1cbiAgfSwgMTAwKVxufVxuXG4vLyBpbmplY3QgdGhlIGhvb2tcbmlmIChkb2N1bWVudCBpbnN0YW5jZW9mIEhUTUxEb2N1bWVudCkge1xuICBpbnN0YWxsU2NyaXB0KGRldGVjdClcbiAgaW5zdGFsbFNjcmlwdChpbnN0YWxsVG9hc3QpXG59XG5cbmZ1bmN0aW9uIGluc3RhbGxTY3JpcHQgKGZuKSB7XG4gIGNvbnN0IHNvdXJjZSA9ICc7KCcgKyBmbi50b1N0cmluZygpICsgJykod2luZG93KSdcblxuICBpZiAoaXNGaXJlZm94KSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWV2YWxcbiAgICB3aW5kb3cuZXZhbChzb3VyY2UpIC8vIGluIEZpcmVmb3gsIHRoaXMgZXZhbHVhdGVzIG9uIHRoZSBjb250ZW50IHdpbmRvd1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpXG4gICAgc2NyaXB0LnRleHRDb250ZW50ID0gc291cmNlXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHNjcmlwdClcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpXG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=