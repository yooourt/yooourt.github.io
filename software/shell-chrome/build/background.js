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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

// the background script runs all the time and serves as a central message
// hub for each vue devtools (panel + proxy + backend) instance.

var ports = {}

chrome.runtime.onConnect.addListener(port => {
  var tab
  var name
  if (isNumeric(port.name)) {
    tab = port.name
    name = 'devtools'
    installProxy(+port.name)
  } else {
    tab = port.sender.tab.id
    name = 'backend'
  }

  if (!ports[tab]) {
    ports[tab] = {
      devtools: null,
      backend: null
    }
  }
  ports[tab][name] = port

  if (ports[tab].devtools && ports[tab].backend) {
    doublePipe(tab, ports[tab].devtools, ports[tab].backend)
  }
})

function isNumeric (str) {
  return +str + '' === str
}

function installProxy (tabId) {
  chrome.tabs.executeScript(tabId, {
    file: '/build/proxy.js'
  }, function (res) {
    if (!res) {
      ports[tabId].devtools.postMessage('proxy-fail')
    } else {
      console.log('injected proxy to tab ' + tabId)
    }
  })
}

function doublePipe (id, one, two) {
  one.onMessage.addListener(lOne)
  function lOne (message) {
    if (message.event === 'log') {
      return console.log('tab ' + id, message.payload)
    }
    console.log('devtools -> backend', message)
    two.postMessage(message)
  }
  two.onMessage.addListener(lTwo)
  function lTwo (message) {
    if (message.event === 'log') {
      return console.log('tab ' + id, message.payload)
    }
    console.log('backend -> devtools', message)
    one.postMessage(message)
  }
  function shutdown () {
    console.log('tab ' + id + ' disconnected.')
    one.onMessage.removeListener(lOne)
    two.onMessage.removeListener(lTwo)
    one.disconnect()
    two.disconnect()
    ports[id] = null
    updateContextMenuItem()
  }
  one.onDisconnect.addListener(shutdown)
  two.onDisconnect.addListener(shutdown)
  console.log('tab ' + id + ' connected.')
  updateContextMenuItem()
}

chrome.runtime.onMessage.addListener((req, sender) => {
  if (sender.tab && req.vueDetected) {
    var suffix = req.nuxtDetected ? '.nuxt' : ''

    chrome.browserAction.setIcon({
      tabId: sender.tab.id,
      path: {
        16: `icons/16${suffix}.png`,
        48: `icons/48${suffix}.png`,
        128: `icons/128${suffix}.png`
      }
    })
    chrome.browserAction.setPopup({
      tabId: sender.tab.id,
      popup: req.devtoolsEnabled ? `popups/enabled${suffix}.html` : `popups/disabled${suffix}.html`
    })
  }
})

// Right-click inspect context menu entry
var activeTabId
chrome.tabs.onActivated.addListener((ref) => {
  var tabId = ref.tabId;

  activeTabId = tabId
  updateContextMenuItem()
})

function updateContextMenuItem () {
  chrome.contextMenus.removeAll(() => {
    if (ports[activeTabId]) {
      chrome.contextMenus.create({
        id: 'vue-inspect-instance',
        title: 'Inspect Vue component',
        contexts: ['all']
      })
    }
  })
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.runtime.sendMessage({
    vueContextMenu: {
      id: info.menuItemId
    }
  })
})


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2JhY2tncm91bmQuanMiXSwibmFtZXMiOlsiY29uc3QiLCJsZXQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTs7O0FBR0FBLEdBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRTs7QUFFaEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksSUFBSTtFQUMzQ0MsR0FBRyxDQUFDLEdBQUc7RUFDUEEsR0FBRyxDQUFDLElBQUk7RUFDUixJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDeEIsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJO0lBQ2YsSUFBSSxHQUFHLFVBQVU7SUFDakIsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztHQUN6QixNQUFN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QXFCLElBQUk7RUFDaEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTTtJQUNsQyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRTtNQUN0QixNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztRQUN6QixFQUFFLEVBQUUsc0JBQXNCO1FBQzFCLEtBQUssRUFBRSx1QkFBdUI7UUFDOUIsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDO09BQ2xCLENBQUM7S0FDSDtHQUNGLENBQUM7Q0FDSDs7QUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLO0VBQ3ZELE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO0lBQ3pCLGNBQWMsRUFBRTtNQUNkLEVBQUUsRUFBRSxJQUFJLENBQUMsVUFBVTtLQUNwQjtHQUNGLENBQUM7Q0FDSCxDQUFDIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9iYWNrZ3JvdW5kLmpzXCIpO1xuIiwiLy8gdGhlIGJhY2tncm91bmQgc2NyaXB0IHJ1bnMgYWxsIHRoZSB0aW1lIGFuZCBzZXJ2ZXMgYXMgYSBjZW50cmFsIG1lc3NhZ2Vcbi8vIGh1YiBmb3IgZWFjaCB2dWUgZGV2dG9vbHMgKHBhbmVsICsgcHJveHkgKyBiYWNrZW5kKSBpbnN0YW5jZS5cblxuY29uc3QgcG9ydHMgPSB7fVxuXG5jaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIocG9ydCA9PiB7XG4gIGxldCB0YWJcbiAgbGV0IG5hbWVcbiAgaWYgKGlzTnVtZXJpYyhwb3J0Lm5hbWUpKSB7XG4gICAgdGFiID0gcG9ydC5uYW1lXG4gICAgbmFtZSA9ICdkZXZ0b29scydcbiAgICBpbnN0YWxsUHJveHkoK3BvcnQubmFtZSlcbiAgfSBlbHNlIHtcbiAgICB0YWIgPSBwb3J0LnNlbmRlci50YWIuaWRcbiAgICBuYW1lID0gJ2JhY2tlbmQnXG4gIH1cblxuICBpZiAoIXBvcnRzW3RhYl0pIHtcbiAgICBwb3J0c1t0YWJdID0ge1xuICAgICAgZGV2dG9vbHM6IG51bGwsXG4gICAgICBiYWNrZW5kOiBudWxsXG4gICAgfVxuICB9XG4gIHBvcnRzW3RhYl1bbmFtZV0gPSBwb3J0XG5cbiAgaWYgKHBvcnRzW3RhYl0uZGV2dG9vbHMgJiYgcG9ydHNbdGFiXS5iYWNrZW5kKSB7XG4gICAgZG91YmxlUGlwZSh0YWIsIHBvcnRzW3RhYl0uZGV2dG9vbHMsIHBvcnRzW3RhYl0uYmFja2VuZClcbiAgfVxufSlcblxuZnVuY3Rpb24gaXNOdW1lcmljIChzdHIpIHtcbiAgcmV0dXJuICtzdHIgKyAnJyA9PT0gc3RyXG59XG5cbmZ1bmN0aW9uIGluc3RhbGxQcm94eSAodGFiSWQpIHtcbiAgY2hyb21lLnRhYnMuZXhlY3V0ZVNjcmlwdCh0YWJJZCwge1xuICAgIGZpbGU6ICcvYnVpbGQvcHJveHkuanMnXG4gIH0sIGZ1bmN0aW9uIChyZXMpIHtcbiAgICBpZiAoIXJlcykge1xuICAgICAgcG9ydHNbdGFiSWRdLmRldnRvb2xzLnBvc3RNZXNzYWdlKCdwcm94eS1mYWlsJylcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2luamVjdGVkIHByb3h5IHRvIHRhYiAnICsgdGFiSWQpXG4gICAgfVxuICB9KVxufVxuXG5mdW5jdGlvbiBkb3VibGVQaXBlIChpZCwgb25lLCB0d28pIHtcbiAgb25lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihsT25lKVxuICBmdW5jdGlvbiBsT25lIChtZXNzYWdlKSB7XG4gICAgaWYgKG1lc3NhZ2UuZXZlbnQgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4gY29uc29sZS5sb2coJ3RhYiAnICsgaWQsIG1lc3NhZ2UucGF5bG9hZClcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ2RldnRvb2xzIC0+IGJhY2tlbmQnLCBtZXNzYWdlKVxuICAgIHR3by5wb3N0TWVzc2FnZShtZXNzYWdlKVxuICB9XG4gIHR3by5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobFR3bylcbiAgZnVuY3Rpb24gbFR3byAobWVzc2FnZSkge1xuICAgIGlmIChtZXNzYWdlLmV2ZW50ID09PSAnbG9nJykge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKCd0YWIgJyArIGlkLCBtZXNzYWdlLnBheWxvYWQpXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdiYWNrZW5kIC0+IGRldnRvb2xzJywgbWVzc2FnZSlcbiAgICBvbmUucG9zdE1lc3NhZ2UobWVzc2FnZSlcbiAgfVxuICBmdW5jdGlvbiBzaHV0ZG93biAoKSB7XG4gICAgY29uc29sZS5sb2coJ3RhYiAnICsgaWQgKyAnIGRpc2Nvbm5lY3RlZC4nKVxuICAgIG9uZS5vbk1lc3NhZ2UucmVtb3ZlTGlzdGVuZXIobE9uZSlcbiAgICB0d28ub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGxUd28pXG4gICAgb25lLmRpc2Nvbm5lY3QoKVxuICAgIHR3by5kaXNjb25uZWN0KClcbiAgICBwb3J0c1tpZF0gPSBudWxsXG4gICAgdXBkYXRlQ29udGV4dE1lbnVJdGVtKClcbiAgfVxuICBvbmUub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKHNodXRkb3duKVxuICB0d28ub25EaXNjb25uZWN0LmFkZExpc3RlbmVyKHNodXRkb3duKVxuICBjb25zb2xlLmxvZygndGFiICcgKyBpZCArICcgY29ubmVjdGVkLicpXG4gIHVwZGF0ZUNvbnRleHRNZW51SXRlbSgpXG59XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigocmVxLCBzZW5kZXIpID0+IHtcbiAgaWYgKHNlbmRlci50YWIgJiYgcmVxLnZ1ZURldGVjdGVkKSB7XG4gICAgY29uc3Qgc3VmZml4ID0gcmVxLm51eHREZXRlY3RlZCA/ICcubnV4dCcgOiAnJ1xuXG4gICAgY2hyb21lLmJyb3dzZXJBY3Rpb24uc2V0SWNvbih7XG4gICAgICB0YWJJZDogc2VuZGVyLnRhYi5pZCxcbiAgICAgIHBhdGg6IHtcbiAgICAgICAgMTY6IGBpY29ucy8xNiR7c3VmZml4fS5wbmdgLFxuICAgICAgICA0ODogYGljb25zLzQ4JHtzdWZmaXh9LnBuZ2AsXG4gICAgICAgIDEyODogYGljb25zLzEyOCR7c3VmZml4fS5wbmdgXG4gICAgICB9XG4gICAgfSlcbiAgICBjaHJvbWUuYnJvd3NlckFjdGlvbi5zZXRQb3B1cCh7XG4gICAgICB0YWJJZDogc2VuZGVyLnRhYi5pZCxcbiAgICAgIHBvcHVwOiByZXEuZGV2dG9vbHNFbmFibGVkID8gYHBvcHVwcy9lbmFibGVkJHtzdWZmaXh9Lmh0bWxgIDogYHBvcHVwcy9kaXNhYmxlZCR7c3VmZml4fS5odG1sYFxuICAgIH0pXG4gIH1cbn0pXG5cbi8vIFJpZ2h0LWNsaWNrIGluc3BlY3QgY29udGV4dCBtZW51IGVudHJ5XG5sZXQgYWN0aXZlVGFiSWRcbmNocm9tZS50YWJzLm9uQWN0aXZhdGVkLmFkZExpc3RlbmVyKCh7IHRhYklkIH0pID0+IHtcbiAgYWN0aXZlVGFiSWQgPSB0YWJJZFxuICB1cGRhdGVDb250ZXh0TWVudUl0ZW0oKVxufSlcblxuZnVuY3Rpb24gdXBkYXRlQ29udGV4dE1lbnVJdGVtICgpIHtcbiAgY2hyb21lLmNvbnRleHRNZW51cy5yZW1vdmVBbGwoKCkgPT4ge1xuICAgIGlmIChwb3J0c1thY3RpdmVUYWJJZF0pIHtcbiAgICAgIGNocm9tZS5jb250ZXh0TWVudXMuY3JlYXRlKHtcbiAgICAgICAgaWQ6ICd2dWUtaW5zcGVjdC1pbnN0YW5jZScsXG4gICAgICAgIHRpdGxlOiAnSW5zcGVjdCBWdWUgY29tcG9uZW50JyxcbiAgICAgICAgY29udGV4dHM6IFsnYWxsJ11cbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG5jaHJvbWUuY29udGV4dE1lbnVzLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoaW5mbywgdGFiKSA9PiB7XG4gIGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKHtcbiAgICB2dWVDb250ZXh0TWVudToge1xuICAgICAgaWQ6IGluZm8ubWVudUl0ZW1JZFxuICAgIH1cbiAgfSlcbn0pXG4iXSwic291cmNlUm9vdCI6IiJ9