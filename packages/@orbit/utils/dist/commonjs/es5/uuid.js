"use strict";
/**
 * Fast UUID generator, RFC4122 version 4 compliant.
 * @author Jeff Ward (jcward.com).
 * @license MIT license
 * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
 **/

Object.defineProperty(exports, "__esModule", { value: true });
var lut = [];
for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}
/**
 * `uuid` generates a Version 4 UUID using Jeff Ward's high performance
 * generator.
 *
 * @export
 * @returns {string}
 */
function uuid() {
  var d0 = Math.random() * 0xffffffff | 0;
  var d1 = Math.random() * 0xffffffff | 0;
  var d2 = Math.random() * 0xffffffff | 0;
  var d3 = Math.random() * 0xffffffff | 0;
  return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
}
exports.uuid = uuid;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXVpZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNyYy91dWlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQUtJOzs7Ozs7OztBQUVKLElBQU0sQUFBRyxNQUFhLEFBQUUsQUFBQztBQUV6QixBQUFHLEFBQUMsS0FBQyxJQUFJLEFBQUMsSUFBRyxBQUFDLEdBQUUsQUFBQyxJQUFHLEFBQUcsS0FBRSxBQUFDLEFBQUUsS0FBRSxBQUFDLEFBQzdCLEFBQUc7TUFBQyxBQUFDLEFBQUMsS0FBRyxDQUFDLEFBQUMsSUFBRyxBQUFFLEtBQUcsQUFBRyxNQUFHLEFBQUUsQUFBQyxNQUFJLEFBQUMsQUFBQyxBQUFILEVBQUksQUFBUSxTQUFDLEFBQUUsQUFBQyxBQUFDLEFBQ2xELEFBQUM7O0FBRUQsQUFNRzs7Ozs7OztBQUNILGdCQUNFO01BQUksQUFBRSxLQUFHLEFBQUksS0FBQyxBQUFNLEFBQUUsV0FBRyxBQUFVLGFBQUcsQUFBQyxBQUFDLEFBQ3hDO01BQUksQUFBRSxLQUFHLEFBQUksS0FBQyxBQUFNLEFBQUUsV0FBRyxBQUFVLGFBQUcsQUFBQyxBQUFDLEFBQ3hDO01BQUksQUFBRSxLQUFHLEFBQUksS0FBQyxBQUFNLEFBQUUsV0FBRyxBQUFVLGFBQUcsQUFBQyxBQUFDLEFBQ3hDO01BQUksQUFBRSxLQUFHLEFBQUksS0FBQyxBQUFNLEFBQUUsV0FBRyxBQUFVLGFBQUcsQUFBQyxBQUFDLEFBRXhDLEFBQU07U0FBQyxBQUFHLElBQUMsQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBQyxJQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsTUFDN0YsQUFBRyxJQUFDLEFBQUUsS0FBRyxBQUFJLEFBQUMsUUFBRyxBQUFHLElBQUMsQUFBRSxNQUFJLEFBQUMsSUFBRyxBQUFJLEFBQUMsUUFBRyxBQUFHLE1BQUcsQUFBRyxJQUFDLEFBQUUsTUFBSSxBQUFFLEtBQUcsQUFBSSxPQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsTUFDckcsQUFBRyxJQUFDLEFBQUUsS0FBRyxBQUFJLE9BQUcsQUFBSSxBQUFDLFFBQUcsQUFBRyxJQUFDLEFBQUUsTUFBSSxBQUFDLElBQUcsQUFBSSxBQUFDLFFBQUcsQUFBRyxNQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxRQUMvRixBQUFHLElBQUMsQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBQyxJQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxRQUFHLEFBQUcsSUFBQyxBQUFFLE1BQUksQUFBRSxLQUFHLEFBQUksQUFBQyxBQUFDLEFBQ3ZGLEFBQUM7O0FBVkQsZUFVQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBGYXN0IFVVSUQgZ2VuZXJhdG9yLCBSRkM0MTIyIHZlcnNpb24gNCBjb21wbGlhbnQuXHJcbiAqIEBhdXRob3IgSmVmZiBXYXJkIChqY3dhcmQuY29tKS5cclxuICogQGxpY2Vuc2UgTUlUIGxpY2Vuc2VcclxuICogQGxpbmsgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDUwMzQvaG93LXRvLWNyZWF0ZS1hLWd1aWQtdXVpZC1pbi1qYXZhc2NyaXB0LzIxOTYzMTM2IzIxOTYzMTM2XHJcbiAqKi9cclxuXHJcbmNvbnN0IGx1dDogc3RyaW5nW10gPSBbXTtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMjU2OyBpKyspIHtcclxuICBsdXRbaV0gPSAoaSA8IDE2ID8gJzAnIDogJycpICsgKGkpLnRvU3RyaW5nKDE2KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIGB1dWlkYCBnZW5lcmF0ZXMgYSBWZXJzaW9uIDQgVVVJRCB1c2luZyBKZWZmIFdhcmQncyBoaWdoIHBlcmZvcm1hbmNlXHJcbiAqIGdlbmVyYXRvci5cclxuICpcclxuICogQGV4cG9ydFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHV1aWQoKTogc3RyaW5nIHtcclxuICBsZXQgZDAgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmZmZiB8IDA7XHJcbiAgbGV0IGQxID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmZmYgfCAwO1xyXG4gIGxldCBkMiA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZmZmIHwgMDtcclxuICBsZXQgZDMgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmZmZiB8IDA7XHJcblxyXG4gIHJldHVybiBsdXRbZDAgJiAweGZmXSArIGx1dFtkMCA+PiA4ICYgMHhmZl0gKyBsdXRbZDAgPj4gMTYgJiAweGZmXSArIGx1dFtkMCA+PiAyNCAmIDB4ZmZdICsgJy0nICtcclxuICAgIGx1dFtkMSAmIDB4ZmZdICsgbHV0W2QxID4+IDggJiAweGZmXSArICctJyArIGx1dFtkMSA+PiAxNiAmIDB4MGYgfCAweDQwXSArIGx1dFtkMSA+PiAyNCAmIDB4ZmZdICsgJy0nICtcclxuICAgIGx1dFtkMiAmIDB4M2YgfCAweDgwXSArIGx1dFtkMiA+PiA4ICYgMHhmZl0gKyAnLScgKyBsdXRbZDIgPj4gMTYgJiAweGZmXSArIGx1dFtkMiA+PiAyNCAmIDB4ZmZdICtcclxuICAgIGx1dFtkMyAmIDB4ZmZdICsgbHV0W2QzID4+IDggJiAweGZmXSArIGx1dFtkMyA+PiAxNiAmIDB4ZmZdICsgbHV0W2QzID4+IDI0ICYgMHhmZl07XHJcbn1cclxuIl19