"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@orbit/utils");
// Establish the root object, `window` (`self`) in the browser, `global`
// on the server, or `this` in some virtual machines. We use `self`
// instead of `window` for `WebWorker` support.
//
// Source: https://github.com/jashkenas/underscore/blob/master/underscore.js#L11-L17
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2017 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
var globals = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this || {};
var Orbit = {
    globals: globals,
    Promise: globals.Promise,
    uuid: utils_1.uuid
};
exports.default = Orbit;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNCQUFvQztBQUtwQyxBQUF3RTtBQUN4RSxBQUFtRTtBQUNuRSxBQUErQztBQUMvQyxBQUFFO0FBQ0YsQUFBb0Y7QUFDcEYsQUFBMEI7QUFDMUIsQUFBOEI7QUFDOUIsQUFBeUY7QUFDekYsQUFBa0U7QUFDbEUsSUFBTSxBQUFPLFVBQUcsT0FBTyxBQUFJLFFBQUksQUFBUSxZQUFJLEFBQUksS0FBQyxBQUFJLFNBQUssQUFBSSxRQUFJLEFBQUksUUFDckQsT0FBTyxBQUFNLFVBQUksQUFBUSxZQUFJLEFBQU0sT0FBQyxBQUFNLFdBQUssQUFBTSxVQUFJLEFBQU0sVUFDL0QsQUFBSSxRQUNKLEFBQUUsQUFBQztBQUVuQixJQUFNLEFBQUs7QUFDVCxBQUFPLGFBQUE7QUFDUCxBQUFPLGFBQUUsQUFBTyxRQUFDLEFBQU87QUFDeEIsQUFBSSxrQkFBQSxBQUNMLEFBQUM7QUFKaUI7QUFNbkIsa0JBQWUsQUFBSyxBQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXVpZCB9IGZyb20gJ0BvcmJpdC91dGlscyc7XHJcblxyXG5kZWNsYXJlIGNvbnN0IHNlbGY6IGFueTtcclxuZGVjbGFyZSBjb25zdCBnbG9iYWw6IGFueTtcclxuXHJcbi8vIEVzdGFibGlzaCB0aGUgcm9vdCBvYmplY3QsIGB3aW5kb3dgIChgc2VsZmApIGluIHRoZSBicm93c2VyLCBgZ2xvYmFsYFxyXG4vLyBvbiB0aGUgc2VydmVyLCBvciBgdGhpc2AgaW4gc29tZSB2aXJ0dWFsIG1hY2hpbmVzLiBXZSB1c2UgYHNlbGZgXHJcbi8vIGluc3RlYWQgb2YgYHdpbmRvd2AgZm9yIGBXZWJXb3JrZXJgIHN1cHBvcnQuXHJcbi8vXHJcbi8vIFNvdXJjZTogaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlL2Jsb2IvbWFzdGVyL3VuZGVyc2NvcmUuanMjTDExLUwxN1xyXG4vLyAgICAgVW5kZXJzY29yZS5qcyAxLjguM1xyXG4vLyAgICAgaHR0cDovL3VuZGVyc2NvcmVqcy5vcmdcclxuLy8gICAgIChjKSAyMDA5LTIwMTcgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcclxuLy8gICAgIFVuZGVyc2NvcmUgbWF5IGJlIGZyZWVseSBkaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXHJcbmNvbnN0IGdsb2JhbHMgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmLnNlbGYgPT09IHNlbGYgJiYgc2VsZiB8fFxyXG4gICAgICAgICAgICAgICAgdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwuZ2xvYmFsID09PSBnbG9iYWwgJiYgZ2xvYmFsIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzIHx8XHJcbiAgICAgICAgICAgICAgICB7fTtcclxuXHJcbmNvbnN0IE9yYml0OiBhbnkgPSB7XHJcbiAgZ2xvYmFscyxcclxuICBQcm9taXNlOiBnbG9iYWxzLlByb21pc2UsXHJcbiAgdXVpZFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgT3JiaXQ7XHJcbiJdfQ==