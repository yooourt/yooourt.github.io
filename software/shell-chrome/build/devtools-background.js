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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/devtools-background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/devtools-background.js":
/*!************************************!*\
  !*** ./src/devtools-background.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// This is the devtools script, which is called when the user opens the
// Chrome devtool on a page. We check to see if we global hook has detected
// Vue presence on the page. If yes, create the Vue panel; otherwise poll
// for 10 seconds.

var panelLoaded = false
var panelShown = false
var pendingAction
var created = false
var checkCount = 0

chrome.devtools.network.onNavigated.addListener(createPanelIfHasVue)
var checkVueInterval = setInterval(createPanelIfHasVue, 1000)
createPanelIfHasVue()

function createPanelIfHasVue () {
  if (created || checkCount++ > 10) {
    clearInterval(checkVueInterval)
    return
  }
  panelLoaded = false
  panelShown = false
  chrome.devtools.inspectedWindow.eval(
    '!!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue)',
    function (hasVue) {
      if (!hasVue || created) {
        return
      }
      clearInterval(checkVueInterval)
      created = true
      chrome.devtools.panels.create(
        'Vue', 'icons/128.png', 'devtools.html',
        panel => {
          // panel loaded
          panel.onShown.addListener(onPanelShown)
          panel.onHidden.addListener(onPanelHidden)
        }
      )
    }
  )
}

// Runtime messages

chrome.runtime.onMessage.addListener(request => {
  if (request === 'vue-panel-load') {
    onPanelLoad()
  } else if (request.vueToast) {
    toast(request.vueToast)
  } else if (request.vueContextMenu) {
    onContextMenu(request.vueContextMenu)
  }
})

// Page context menu entry

function onContextMenu (ref) {
  var id = ref.id;

  if (id === 'vue-inspect-instance') {
    var src = `window.__VUE_DEVTOOLS_CONTEXT_MENU_HAS_TARGET__`

    chrome.devtools.inspectedWindow.eval(src, function (res, err) {
      if (err) {
        console.log(err)
      }
      if (typeof res !== 'undefined' && res) {
        panelAction(() => {
          chrome.runtime.sendMessage('vue-get-context-menu-target')
        }, 'open-devtools')
      } else {
        pendingAction = null
        toast('component-not-found')
      }
    })
  }
}

// Action that may execute immediatly
// or later when the Vue panel is ready

function panelAction (cb, message = null) {
  if (created && panelLoaded && panelShown) {
    cb()
  } else {
    pendingAction = cb
    message && toast(message)
  }
}

function executePendingAction () {
  pendingAction && pendingAction()
  pendingAction = null
}

// Execute pending action when Vue panel is ready

function onPanelLoad () {
  executePendingAction()
  panelLoaded = true
}

// Manage panel visibility

function onPanelShown () {
  chrome.runtime.sendMessage('vue-panel-shown')
  panelShown = true
  panelLoaded && executePendingAction()
}

function onPanelHidden () {
  chrome.runtime.sendMessage('vue-panel-hidden')
  panelShown = false
}

// Toasts

var toastMessages = {
  'open-devtools': { message: 'Open Vue devtools to see component details', type: 'normal' },
  'component-not-found': { message: 'No Vue component was found', type: 'warn' }
}

function toast (id) {
  if (!Object.keys(toastMessages).includes(id)) { return }

  var { message, type } = toastMessages[id]

  var src = `(function() {
    __VUE_DEVTOOLS_TOAST__(\`${message}\`, '${type}');
  })()`

  chrome.devtools.inspectedWindow.eval(src, function (res, err) {
    if (err) {
      console.log(err)
    }
  })
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RldnRvb2xzLWJhY2tncm91bmQuanMiXSwibmFtZXMiOlsibGV0IiwiY29uc3QiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7Ozs7QUFLQUEsR0FBRyxDQUFDLFdBQVcsR0FBRyxLQUFLO0FBQ3ZCQSxHQUFHLENBQUMsVUFBVSxHQUFHLEtBQUs7QUFDdEJBLEdBQUcsQ0FBQyxhQUFhO0FBQ2pCQSxHQUFHLENBQUMsT0FBTyxHQUFHLEtBQUs7QUFDbkJBLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQzs7QUFFbEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQztBQUNwRUMsR0FBSyxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQyxtQkFBbUIsRUFB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LE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDO0VBQzlDLFVBQVUsR0FBRyxLQUFLO0NBQ25COzs7O0FBSURBLEdBQUssQ0FBQyxhQUFhLEdBQUc7RUFDcEIsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLDRDQUE0QyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7RUFDMUYscUJBQXFCLEVBQUUsRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtDQUMvRTs7QUFFRCxTQUFTLEtBQUssRUFBRSxFQUFFLEVBQUU7RUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFFLFFBQU07O0VBRXBEQSxHQUFLLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsYUFBYSxDQUFDLEVBQUUsQ0FBQzs7RUFFM0NBLEdBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQzs2QkFDYyxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO01BQzdDLENBQUM7O0VBRUwsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUU7SUFDNUQsSUFBSSxHQUFHLEVBQUU7TUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztLQUNqQjtHQUNGLENBQUM7Q0FDSCIsImZpbGUiOiJkZXZ0b29scy1iYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvZGV2dG9vbHMtYmFja2dyb3VuZC5qc1wiKTtcbiIsIi8vIFRoaXMgaXMgdGhlIGRldnRvb2xzIHNjcmlwdCwgd2hpY2ggaXMgY2FsbGVkIHdoZW4gdGhlIHVzZXIgb3BlbnMgdGhlXG4vLyBDaHJvbWUgZGV2dG9vbCBvbiBhIHBhZ2UuIFdlIGNoZWNrIHRvIHNlZSBpZiB3ZSBnbG9iYWwgaG9vayBoYXMgZGV0ZWN0ZWRcbi8vIFZ1ZSBwcmVzZW5jZSBvbiB0aGUgcGFnZS4gSWYgeWVzLCBjcmVhdGUgdGhlIFZ1ZSBwYW5lbDsgb3RoZXJ3aXNlIHBvbGxcbi8vIGZvciAxMCBzZWNvbmRzLlxuXG5sZXQgcGFuZWxMb2FkZWQgPSBmYWxzZVxubGV0IHBhbmVsU2hvd24gPSBmYWxzZVxubGV0IHBlbmRpbmdBY3Rpb25cbmxldCBjcmVhdGVkID0gZmFsc2VcbmxldCBjaGVja0NvdW50ID0gMFxuXG5jaHJvbWUuZGV2dG9vbHMubmV0d29yay5vbk5hdmlnYXRlZC5hZGRMaXN0ZW5lcihjcmVhdGVQYW5lbElmSGFzVnVlKVxuY29uc3QgY2hlY2tWdWVJbnRlcnZhbCA9IHNldEludGVydmFsKGNyZWF0ZVBhbmVsSWZIYXNWdWUsIDEwMDApXG5jcmVhdGVQYW5lbElmSGFzVnVlKClcblxuZnVuY3Rpb24gY3JlYXRlUGFuZWxJZkhhc1Z1ZSAoKSB7XG4gIGlmIChjcmVhdGVkIHx8IGNoZWNrQ291bnQrKyA+IDEwKSB7XG4gICAgY2xlYXJJbnRlcnZhbChjaGVja1Z1ZUludGVydmFsKVxuICAgIHJldHVyblxuICB9XG4gIHBhbmVsTG9hZGVkID0gZmFsc2VcbiAgcGFuZWxTaG93biA9IGZhbHNlXG4gIGNocm9tZS5kZXZ0b29scy5pbnNwZWN0ZWRXaW5kb3cuZXZhbChcbiAgICAnISEod2luZG93Ll9fVlVFX0RFVlRPT0xTX0dMT0JBTF9IT09LX18uVnVlKScsXG4gICAgZnVuY3Rpb24gKGhhc1Z1ZSkge1xuICAgICAgaWYgKCFoYXNWdWUgfHwgY3JlYXRlZCkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNsZWFySW50ZXJ2YWwoY2hlY2tWdWVJbnRlcnZhbClcbiAgICAgIGNyZWF0ZWQgPSB0cnVlXG4gICAgICBjaHJvbWUuZGV2dG9vbHMucGFuZWxzLmNyZWF0ZShcbiAgICAgICAgJ1Z1ZScsICdpY29ucy8xMjgucG5nJywgJ2RldnRvb2xzLmh0bWwnLFxuICAgICAgICBwYW5lbCA9PiB7XG4gICAgICAgICAgLy8gcGFuZWwgbG9hZGVkXG4gICAgICAgICAgcGFuZWwub25TaG93bi5hZGRMaXN0ZW5lcihvblBhbmVsU2hvd24pXG4gICAgICAgICAgcGFuZWwub25IaWRkZW4uYWRkTGlzdGVuZXIob25QYW5lbEhpZGRlbilcbiAgICAgICAgfVxuICAgICAgKVxuICAgIH1cbiAgKVxufVxuXG4vLyBSdW50aW1lIG1lc3NhZ2VzXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihyZXF1ZXN0ID0+IHtcbiAgaWYgKHJlcXVlc3QgPT09ICd2dWUtcGFuZWwtbG9hZCcpIHtcbiAgICBvblBhbmVsTG9hZCgpXG4gIH0gZWxzZSBpZiAocmVxdWVzdC52dWVUb2FzdCkge1xuICAgIHRvYXN0KHJlcXVlc3QudnVlVG9hc3QpXG4gIH0gZWxzZSBpZiAocmVxdWVzdC52dWVDb250ZXh0TWVudSkge1xuICAgIG9uQ29udGV4dE1lbnUocmVxdWVzdC52dWVDb250ZXh0TWVudSlcbiAgfVxufSlcblxuLy8gUGFnZSBjb250ZXh0IG1lbnUgZW50cnlcblxuZnVuY3Rpb24gb25Db250ZXh0TWVudSAoeyBpZCB9KSB7XG4gIGlmIChpZCA9PT0gJ3Z1ZS1pbnNwZWN0LWluc3RhbmNlJykge1xuICAgIGNvbnN0IHNyYyA9IGB3aW5kb3cuX19WVUVfREVWVE9PTFNfQ09OVEVYVF9NRU5VX0hBU19UQVJHRVRfX2BcblxuICAgIGNocm9tZS5kZXZ0b29scy5pbnNwZWN0ZWRXaW5kb3cuZXZhbChzcmMsIGZ1bmN0aW9uIChyZXMsIGVycikge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHJlcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzKSB7XG4gICAgICAgIHBhbmVsQWN0aW9uKCgpID0+IHtcbiAgICAgICAgICBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSgndnVlLWdldC1jb250ZXh0LW1lbnUtdGFyZ2V0JylcbiAgICAgICAgfSwgJ29wZW4tZGV2dG9vbHMnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVuZGluZ0FjdGlvbiA9IG51bGxcbiAgICAgICAgdG9hc3QoJ2NvbXBvbmVudC1ub3QtZm91bmQnKVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuLy8gQWN0aW9uIHRoYXQgbWF5IGV4ZWN1dGUgaW1tZWRpYXRseVxuLy8gb3IgbGF0ZXIgd2hlbiB0aGUgVnVlIHBhbmVsIGlzIHJlYWR5XG5cbmZ1bmN0aW9uIHBhbmVsQWN0aW9uIChjYiwgbWVzc2FnZSA9IG51bGwpIHtcbiAgaWYgKGNyZWF0ZWQgJiYgcGFuZWxMb2FkZWQgJiYgcGFuZWxTaG93bikge1xuICAgIGNiKClcbiAgfSBlbHNlIHtcbiAgICBwZW5kaW5nQWN0aW9uID0gY2JcbiAgICBtZXNzYWdlICYmIHRvYXN0KG1lc3NhZ2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gZXhlY3V0ZVBlbmRpbmdBY3Rpb24gKCkge1xuICBwZW5kaW5nQWN0aW9uICYmIHBlbmRpbmdBY3Rpb24oKVxuICBwZW5kaW5nQWN0aW9uID0gbnVsbFxufVxuXG4vLyBFeGVjdXRlIHBlbmRpbmcgYWN0aW9uIHdoZW4gVnVlIHBhbmVsIGlzIHJlYWR5XG5cbmZ1bmN0aW9uIG9uUGFuZWxMb2FkICgpIHtcbiAgZXhlY3V0ZVBlbmRpbmdBY3Rpb24oKVxuICBwYW5lbExvYWRlZCA9IHRydWVcbn1cblxuLy8gTWFuYWdlIHBhbmVsIHZpc2liaWxpdHlcblxuZnVuY3Rpb24gb25QYW5lbFNob3duICgpIHtcbiAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UoJ3Z1ZS1wYW5lbC1zaG93bicpXG4gIHBhbmVsU2hvd24gPSB0cnVlXG4gIHBhbmVsTG9hZGVkICYmIGV4ZWN1dGVQZW5kaW5nQWN0aW9uKClcbn1cblxuZnVuY3Rpb24gb25QYW5lbEhpZGRlbiAoKSB7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKCd2dWUtcGFuZWwtaGlkZGVuJylcbiAgcGFuZWxTaG93biA9IGZhbHNlXG59XG5cbi8vIFRvYXN0c1xuXG5jb25zdCB0b2FzdE1lc3NhZ2VzID0ge1xuICAnb3Blbi1kZXZ0b29scyc6IHsgbWVzc2FnZTogJ09wZW4gVnVlIGRldnRvb2xzIHRvIHNlZSBjb21wb25lbnQgZGV0YWlscycsIHR5cGU6ICdub3JtYWwnIH0sXG4gICdjb21wb25lbnQtbm90LWZvdW5kJzogeyBtZXNzYWdlOiAnTm8gVnVlIGNvbXBvbmVudCB3YXMgZm91bmQnLCB0eXBlOiAnd2FybicgfVxufVxuXG5mdW5jdGlvbiB0b2FzdCAoaWQpIHtcbiAgaWYgKCFPYmplY3Qua2V5cyh0b2FzdE1lc3NhZ2VzKS5pbmNsdWRlcyhpZCkpIHJldHVyblxuXG4gIGNvbnN0IHsgbWVzc2FnZSwgdHlwZSB9ID0gdG9hc3RNZXNzYWdlc1tpZF1cblxuICBjb25zdCBzcmMgPSBgKGZ1bmN0aW9uKCkge1xuICAgIF9fVlVFX0RFVlRPT0xTX1RPQVNUX18oXFxgJHttZXNzYWdlfVxcYCwgJyR7dHlwZX0nKTtcbiAgfSkoKWBcblxuICBjaHJvbWUuZGV2dG9vbHMuaW5zcGVjdGVkV2luZG93LmV2YWwoc3JjLCBmdW5jdGlvbiAocmVzLCBlcnIpIHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgfVxuICB9KVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==