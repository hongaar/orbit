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
var globals = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    this ||
    {};
var Orbit = {
    globals: globals,
    Promise: globals.Promise,
    uuid: utils_1.uuid
};
exports.default = Orbit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQW9DO0FBS3BDLHdFQUF3RTtBQUN4RSxtRUFBbUU7QUFDbkUsK0NBQStDO0FBQy9DLEVBQUU7QUFDRixvRkFBb0Y7QUFDcEYsMEJBQTBCO0FBQzFCLDhCQUE4QjtBQUM5Qix5RkFBeUY7QUFDekYsa0VBQWtFO0FBQ2xFLElBQU0sT0FBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJO0lBQ3JELE9BQU8sTUFBTSxJQUFJLFFBQVEsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sSUFBSSxNQUFNO0lBQy9ELElBQUk7SUFDSixFQUFFLENBQUM7QUFFbkIsSUFBTSxLQUFLLEdBQVE7SUFDakIsT0FBTyxTQUFBO0lBQ1AsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO0lBQ3hCLElBQUksY0FBQTtDQUNMLENBQUM7QUFFRixrQkFBZSxLQUFLLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1dWlkIH0gZnJvbSAnQG9yYml0L3V0aWxzJztcclxuXHJcbmRlY2xhcmUgY29uc3Qgc2VsZjogYW55O1xyXG5kZWNsYXJlIGNvbnN0IGdsb2JhbDogYW55O1xyXG5cclxuLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgKGBzZWxmYCkgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXHJcbi8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcclxuLy8gaW5zdGVhZCBvZiBgd2luZG93YCBmb3IgYFdlYldvcmtlcmAgc3VwcG9ydC5cclxuLy9cclxuLy8gU291cmNlOiBodHRwczovL2dpdGh1Yi5jb20vamFzaGtlbmFzL3VuZGVyc2NvcmUvYmxvYi9tYXN0ZXIvdW5kZXJzY29yZS5qcyNMMTEtTDE3XHJcbi8vICAgICBVbmRlcnNjb3JlLmpzIDEuOC4zXHJcbi8vICAgICBodHRwOi8vdW5kZXJzY29yZWpzLm9yZ1xyXG4vLyAgICAgKGMpIDIwMDktMjAxNyBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xyXG4vLyAgICAgVW5kZXJzY29yZSBtYXkgYmUgZnJlZWx5IGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cclxuY29uc3QgZ2xvYmFscyA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYuc2VsZiA9PT0gc2VsZiAmJiBzZWxmIHx8XHJcbiAgICAgICAgICAgICAgICB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbC5nbG9iYWwgPT09IGdsb2JhbCAmJiBnbG9iYWwgfHxcclxuICAgICAgICAgICAgICAgIHRoaXMgfHxcclxuICAgICAgICAgICAgICAgIHt9O1xyXG5cclxuY29uc3QgT3JiaXQ6IGFueSA9IHtcclxuICBnbG9iYWxzLFxyXG4gIFByb21pc2U6IGdsb2JhbHMuUHJvbWlzZSxcclxuICB1dWlkXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBPcmJpdDtcclxuIl19