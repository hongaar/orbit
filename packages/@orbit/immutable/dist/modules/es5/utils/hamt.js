"use strict";
/**
 * Code based on: https://github.com/mattbierner/hamt
 * Author: Matt Bierner
 * MIT license
 *
 * Which is based on: https://github.com/exclipy/pdata
 */

Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
function _typeof(obj) {
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
/* Configuration
 ******************************************************************************/
var SIZE = 5;
var BUCKET_SIZE = Math.pow(2, SIZE);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
/*
 ******************************************************************************/
var nothing = {};
function constant(x) {
    return function () {
        return x;
    };
}
/**
  Get 32 bit hash of string.

  Based on:
  http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
*/
function hash(str) {
    var type = typeof str === 'undefined' ? 'undefined' : _typeof(str);
    if (type === 'number') return str;
    if (type !== 'string') str += '';
    var h = 0;
    for (var i = 0, len = str.length; i < len; ++i) {
        var c = str.charCodeAt(i);
        h = (h << 5) - h + c | 0;
    }
    return h;
}
/* Bit Ops
 ******************************************************************************/
/**
  Hamming weight.

  Taken from: http://jsperf.com/hamming-weight
*/
function popcount(x) {
    x -= x >> 1 & 0x55555555;
    x = (x & 0x33333333) + (x >> 2 & 0x33333333);
    x = x + (x >> 4) & 0x0f0f0f0f;
    x += x >> 8;
    x += x >> 16;
    return x & 0x7f;
}
function hashFragment(shift, h) {
    return h >>> shift & MASK;
}
function toBitmap(x) {
    return 1 << x;
}
function fromBitmap(bitmap, bit) {
    return popcount(bitmap & bit - 1);
}
/* Array Ops
 ******************************************************************************/
/**
  Set a value in an array.

  @param mutate Should the input array be mutated?
  @param at Index to change.
  @param v New value
  @param arr Array.
*/
function arrayUpdate(mutate, at, v, arr) {
    var out = arr;
    if (!mutate) {
        var len = arr.length;
        out = new Array(len);
        for (var i = 0; i < len; ++i) {
            out[i] = arr[i];
        }
    }
    out[at] = v;
    return out;
}
/**
  Remove a value from an array.

  @param mutate Should the input array be mutated?
  @param at Index to remove.
  @param arr Array.
*/
function arraySpliceOut(mutate, at, arr) {
    var len = arr.length;
    var i = 0,
        g = 0;
    var out = arr;
    if (mutate) {
        i = g = at;
    } else {
        out = new Array(len - 1);
        while (i < at) {
            out[g++] = arr[i++];
        }
        ++i;
    }
    while (i < len) {
        out[g++] = arr[i++];
    }
    return out;
}
/**
  Insert a value into an array.

  @param mutate Should the input array be mutated?
  @param at Index to insert at.
  @param v Value to insert,
  @param arr Array.
*/
function arraySpliceIn(mutate, at, v, arr) {
    var len = arr.length;
    if (mutate) {
        var _i = len;
        while (_i >= at) {
            arr[_i--] = arr[_i];
        }
        arr[at] = v;
        return arr;
    }
    var i = 0,
        g = 0;
    var out = new Array(len + 1);
    while (i < at) {
        out[g++] = arr[i++];
    }
    out[at] = v;
    while (i < len) {
        out[++g] = arr[i++];
    }
    return out;
}
/* Node Structures
 ******************************************************************************/
var LEAF = 1;
var COLLISION = 2;
var INDEX = 3;
var ARRAY = 4;
/**
  Empty node.
*/
var empty = {
    __hamt_isEmpty: true,
    _modify: function (edit, keyEq, shift, f, h, k, size) {
        var v = f();
        if (v === nothing) return empty;
        ++size.value;
        return Leaf(edit, h, k, v);
    }
};
function isEmptyNode(x) {
    return x === empty || x && x.__hamt_isEmpty;
}
/**
  Leaf holding a value.

  @member edit Edit of the node.
  @member hash Hash of key.
  @member key Key.
  @member value Value stored.
*/
function Leaf(edit, hash, key, value) {
    return {
        type: LEAF,
        edit: edit,
        hash: hash,
        key: key,
        value: value,
        _modify: Leaf__modify
    };
}
/**
  Leaf holding multiple values with the same hash but different keys.

  @member edit Edit of the node.
  @member hash Hash of key.
  @member children Array of collision children node.
*/
function Collision(edit, hash, children) {
    return {
        type: COLLISION,
        edit: edit,
        hash: hash,
        children: children,
        _modify: Collision__modify
    };
}
/**
  Internal node with a sparse set of children.

  Uses a bitmap and array to pack children.

  @member edit Edit of the node.
  @member mask Bitmap that encode the positions of children in the array.
  @member children Array of child nodes.
*/
function IndexedNode(edit, mask, children) {
    return {
        type: INDEX,
        edit: edit,
        mask: mask,
        children: children,
        _modify: IndexedNode__modify
    };
}
/**
  Internal node with many children.

  @member edit Edit of the node.
  @member size Number of children.
  @member children Array of child nodes.
*/
function ArrayNode(edit, size, children) {
    return {
        type: ARRAY,
        edit: edit,
        size: size,
        children: children,
        _modify: ArrayNode__modify
    };
}
/**
    Is `node` a leaf node?
*/
function isLeaf(node) {
    return node === empty || node.type === LEAF || node.type === COLLISION;
}
/* Internal node operations.
 ******************************************************************************/
/**
  Expand an indexed node into an array node.

  @param edit Current edit.
  @param frag Index of added child.
  @param child Added child.
  @param mask Index node mask before child added.
  @param subNodes Index node children before child added.
*/
function expand(edit, frag, child, bitmap, subNodes) {
    var arr = [];
    var bit = bitmap;
    var count = 0;
    for (var i = 0; bit; ++i) {
        if (bit & 1) arr[i] = subNodes[count++];
        bit >>>= 1;
    }
    arr[frag] = child;
    return ArrayNode(edit, count + 1, arr);
}
/**
  Collapse an array node into a indexed node.

  @param edit Current edit.
  @param count Number of elements in new array.
  @param removed Index of removed element.
  @param elements Array node children before remove.
*/
function pack(edit, count, removed, elements) {
    var children = new Array(count - 1);
    var g = 0;
    var bitmap = 0;
    for (var i = 0, len = elements.length; i < len; ++i) {
        if (i !== removed) {
            var elem = elements[i];
            if (elem && !isEmptyNode(elem)) {
                children[g++] = elem;
                bitmap |= 1 << i;
            }
        }
    }
    return IndexedNode(edit, bitmap, children);
}
/**
  Merge two leaf nodes.

  @param shift Current shift.
  @param h1 Node 1 hash.
  @param n1 Node 1.
  @param h2 Node 2 hash.
  @param n2 Node 2.
*/
function mergeLeaves(edit, shift, h1, n1, h2, n2) {
    if (h1 === h2) return Collision(edit, h1, [n2, n1]);
    var subH1 = hashFragment(shift, h1);
    var subH2 = hashFragment(shift, h2);
    return IndexedNode(edit, toBitmap(subH1) | toBitmap(subH2), subH1 === subH2 ? [mergeLeaves(edit, shift + SIZE, h1, n1, h2, n2)] : subH1 < subH2 ? [n1, n2] : [n2, n1]);
}
/**
  Update an entry in a collision list.

  @param mutate Should mutation be used?
  @param edit Current edit.
  @param keyEq Key compare function.
  @param hash Hash of collision.
  @param list Collision list.
  @param f Update function.
  @param k Key to update.
  @param size Size ref.
*/
function updateCollisionList(mutate, edit, keyEq, h, list, f, k, size) {
    var len = list.length;
    for (var i = 0; i < len; ++i) {
        var child = list[i];
        if (keyEq(k, child.key)) {
            var value = child.value;
            var _newValue = f(value);
            if (_newValue === value) return list;
            if (_newValue === nothing) {
                --size.value;
                return arraySpliceOut(mutate, i, list);
            }
            return arrayUpdate(mutate, i, Leaf(edit, h, k, _newValue), list);
        }
    }
    var newValue = f();
    if (newValue === nothing) return list;
    ++size.value;
    return arrayUpdate(mutate, len, Leaf(edit, h, k, newValue), list);
}
function canEditNode(edit, node) {
    return edit === node.edit;
}
/* Editing
 ******************************************************************************/
function Leaf__modify(edit, keyEq, shift, f, h, k, size) {
    if (keyEq(k, this.key)) {
        var _v = f(this.value);
        if (_v === this.value) return this;else if (_v === nothing) {
            --size.value;
            return empty;
        }
        if (canEditNode(edit, this)) {
            this.value = _v;
            return this;
        }
        return Leaf(edit, h, k, _v);
    }
    var v = f();
    if (v === nothing) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
}
function Collision__modify(edit, keyEq, shift, f, h, k, size) {
    if (h === this.hash) {
        var canEdit = canEditNode(edit, this);
        var list = updateCollisionList(canEdit, edit, keyEq, this.hash, this.children, f, k, size);
        if (list === this.children) return this;
        return list.length > 1 ? Collision(edit, this.hash, list) : list[0]; // collapse single element collision list
    }
    var v = f();
    if (v === nothing) return this;
    ++size.value;
    return mergeLeaves(edit, shift, this.hash, this, h, Leaf(edit, h, k, v));
}
function IndexedNode__modify(edit, keyEq, shift, f, h, k, size) {
    var mask = this.mask;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var bit = toBitmap(frag);
    var indx = fromBitmap(mask, bit);
    var exists = mask & bit;
    var current = exists ? children[indx] : empty;
    var child = current._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (current === child) return this;
    var canEdit = canEditNode(edit, this);
    var bitmap = mask;
    var newChildren = undefined;
    if (exists && isEmptyNode(child)) {
        // remove
        bitmap &= ~bit;
        if (!bitmap) return empty;
        if (children.length <= 2 && isLeaf(children[indx ^ 1])) return children[indx ^ 1]; // collapse
        newChildren = arraySpliceOut(canEdit, indx, children);
    } else if (!exists && !isEmptyNode(child)) {
        // add
        if (children.length >= MAX_INDEX_NODE) return expand(edit, frag, child, mask, children);
        bitmap |= bit;
        newChildren = arraySpliceIn(canEdit, indx, child, children);
    } else {
        // modify
        newChildren = arrayUpdate(canEdit, indx, child, children);
    }
    if (canEdit) {
        this.mask = bitmap;
        this.children = newChildren;
        return this;
    }
    return IndexedNode(edit, bitmap, newChildren);
}
function ArrayNode__modify(edit, keyEq, shift, f, h, k, size) {
    var count = this.size;
    var children = this.children;
    var frag = hashFragment(shift, h);
    var child = children[frag];
    var newChild = (child || empty)._modify(edit, keyEq, shift + SIZE, f, h, k, size);
    if (child === newChild) return this;
    var canEdit = canEditNode(edit, this);
    var newChildren = undefined;
    if (isEmptyNode(child) && !isEmptyNode(newChild)) {
        // add
        ++count;
        newChildren = arrayUpdate(canEdit, frag, newChild, children);
    } else if (!isEmptyNode(child) && isEmptyNode(newChild)) {
        // remove
        --count;
        if (count <= MIN_ARRAY_NODE) return pack(edit, count, frag, children);
        newChildren = arrayUpdate(canEdit, frag, empty, children);
    } else {
        // modify
        newChildren = arrayUpdate(canEdit, frag, newChild, children);
    }
    if (canEdit) {
        this.size = count;
        this.children = newChildren;
        return this;
    }
    return ArrayNode(edit, count, newChildren);
}
;
/* Queries
 ******************************************************************************/
/**
    Lookup the value for `key` in `map` using a custom `hash`.

    Returns the value or `alt` if none.
*/
function tryGetHash(alt, hash, key, map) {
    var node = map._root;
    var shift = 0;
    var keyEq = map._config.keyEq;
    while (true) {
        switch (node.type) {
            case LEAF:
                {
                    return keyEq(key, node.key) ? node.value : alt;
                }
            case COLLISION:
                {
                    if (hash === node.hash) {
                        var children = node.children;
                        for (var i = 0, len = children.length; i < len; ++i) {
                            var child = children[i];
                            if (keyEq(key, child.key)) return child.value;
                        }
                    }
                    return alt;
                }
            case INDEX:
                {
                    var frag = hashFragment(shift, hash);
                    var bit = toBitmap(frag);
                    if (node.mask & bit) {
                        node = node.children[fromBitmap(node.mask, bit)];
                        shift += SIZE;
                        break;
                    }
                    return alt;
                }
            case ARRAY:
                {
                    node = node.children[hashFragment(shift, hash)];
                    if (node) {
                        shift += SIZE;
                        break;
                    }
                    return alt;
                }
            default:
                return alt;
        }
    }
}
/**
  Lookup the value for `key` in `map` using internal hash function.

  @see `tryGetHash`
*/
function tryGet(alt, key, map) {
    return tryGetHash(alt, map._config.hash(key), key, map);
}
/**
  Lookup the value for `key` in `map` using a custom `hash`.

  Returns the value or `undefined` if none.
*/
function getHash(hash, key, map) {
    return tryGetHash(undefined, hash, key, map);
}
/**
  Lookup the value for `key` in `map` using internal hash function.

  @see `get`
*/
function get(key, map) {
    return tryGetHash(undefined, map._config.hash(key), key, map);
}
/**
    Does an entry exist for `key` in `map`? Uses custom `hash`.
*/
function hasHash(hash, key, map) {
    return tryGetHash(nothing, hash, key, map) !== nothing;
}
/**
  Does an entry exist for `key` in `map`? Uses internal hash function.
*/
function has(key, map) {
    return hasHash(map._config.hash(key), key, map);
}
function defKeyCompare(x, y) {
    return x === y;
}
/**
  Does `map` contain any elements?
*/
function isEmpty(map) {
    return map && !!isEmptyNode(map._root);
}
/* Updates
 ******************************************************************************/
/**
    Alter the value stored for `key` in `map` using function `f` using
    custom hash.

    `f` is invoked with the current value for `k` if it exists,
    or no arguments if no such value exists. `modify` will always either
    update or insert a value into the map.

    Returns a map with the modified value. Does not alter `map`.
*/
function modifyHash(f, hash, key, map) {
    var size = { value: map._size };
    var newRoot = map._root._modify(map._editable ? map._edit : NaN, map._config.keyEq, 0, f, hash, key, size);
    return map.setTree(newRoot, size.value);
}
/**
  Alter the value stored for `key` in `map` using function `f` using
  internal hash function.

  @see `modifyHash`
*/
function modify(f, key, map) {
    return modifyHash(f, map._config.hash(key), key, map);
}
/**
  Store `value` for `key` in `map` using custom `hash`.

  Returns a map with the modified value. Does not alter `map`.
*/
function setHash(hash, key, value, map) {
    return modifyHash(constant(value), hash, key, map);
}
/**
  Store `value` for `key` in `map` using internal hash function.

  @see `setHash`
*/
function set(key, value, map) {
    return setHash(map._config.hash(key), key, value, map);
}
/**
  Remove the entry for `key` in `map`.

  Returns a map with the value removed. Does not alter `map`.
*/
var del = constant(nothing);
function removeHash(hash, key, map) {
    return modifyHash(del, hash, key, map);
}
/**
  Remove the entry for `key` in `map` using internal hash function.

  @see `removeHash`
*/
function remove(key, map) {
    return removeHash(map._config.hash(key), key, map);
}
/* Mutation
 ******************************************************************************/
/**
  Mark `map` as mutable.
 */
function beginMutation(map) {
    return new HAMTMap(map._editable + 1, map._edit + 1, map._config, map._root, map._size);
}
/**
  Mark `map` as immutable.
 */
function endMutation(map) {
    map._editable = map._editable && map._editable - 1;
    return map;
}
/**
  Mutate `map` within the context of `f`.
  @param f
  @param map HAMT
*/
function mutate(f, map) {
    var transient = beginMutation(map);
    f(transient);
    return endMutation(transient);
}
;
/* Traversal
 ******************************************************************************/
/**
  Apply a continuation.
*/
function appk(k) {
    return k && lazyVisitChildren(k[0], k[1], k[2], k[3], k[4]);
}
/**
  Recursively visit all values stored in an array of nodes lazily.
*/
function lazyVisitChildren(len, children, i, f, k) {
    while (i < len) {
        var child = children[i++];
        if (child && !isEmptyNode(child)) return lazyVisit(child, f, [len, children, i, f, k]);
    }
    return appk(k);
}
/**
  Recursively visit all values stored in `node` lazily.
*/
function lazyVisit(node, f, k) {
    switch (node.type) {
        case LEAF:
            return {
                value: f(node),
                rest: k
            };
        case COLLISION:
        case ARRAY:
        case INDEX:
            var children = node.children;
            return lazyVisitChildren(children.length, children, 0, f, k);
        default:
            return appk(k);
    }
}
var DONE = {
    done: true
};
/**
  Lazily visit each value in map with function `f`.
*/
function visit(map, f) {
    return new HAMTMapIterator(lazyVisit(map._root, f));
}
/**
  Get a Javascsript iterator of `map`.

  Iterates over `[key, value]` arrays.
*/
function buildPairs(x) {
    return [x.key, x.value];
}
function entries(map) {
    return visit(map, buildPairs);
}
;
/**
  Get array of all keys in `map`.

  Order is not guaranteed.
*/
function buildKeys(x) {
    return x.key;
}
function keys(map) {
    return visit(map, buildKeys);
}
/**
  Get array of all values in `map`.

  Order is not guaranteed, duplicates are preserved.
*/
function buildValues(x) {
    return x.value;
}
function values(map) {
    return visit(map, buildValues);
}
/* Fold
 ******************************************************************************/
/**
  Visit every entry in the map, aggregating data.

  Order of nodes is not guaranteed.

  @param f Function mapping accumulated value, value, and key to new value.
  @param z Starting value.
  @param m HAMT
*/
function fold(f, z, m) {
    var root = m._root;
    if (root.type === LEAF) return f(z, root.value, root.key);
    var toVisit = [root.children];
    var children = undefined;
    while (children = toVisit.pop()) {
        for (var i = 0, len = children.length; i < len;) {
            var child = children[i++];
            if (child && child.type) {
                if (child.type === LEAF) z = f(z, child.value, child.key);else toVisit.push(child.children);
            }
        }
    }
    return z;
}
/**
  Visit every entry in the map, aggregating data.

  Order of nodes is not guaranteed.

  @param f Function invoked with value and key
  @param map HAMT
*/
function forEach(f, map) {
    return fold(function (_, value, key) {
        return f(value, key, map);
    }, null, map);
}
/* Export
 ******************************************************************************/
var HAMTMapIterator = function () {
    function HAMTMapIterator(v) {
        this[Symbol.iterator] = function () {
            return this;
        };
        this.v = v;
    }
    HAMTMapIterator.prototype.next = function () {
        if (!this.v) return DONE;
        var v0 = this.v;
        this.v = appk(v0.rest);
        return v0;
    };
    return HAMTMapIterator;
}();
exports.HAMTMapIterator = HAMTMapIterator;
var HAMTMap = function () {
    function HAMTMap(editable, edit, config, root, size) {
        if (editable === void 0) {
            editable = 0;
        }
        if (edit === void 0) {
            edit = 0;
        }
        if (config === void 0) {
            config = {};
        }
        if (root === void 0) {
            root = empty;
        }
        if (size === void 0) {
            size = 0;
        }
        this.isEmpty = function () {
            return isEmpty(this);
        };
        this[Symbol.iterator] = function () {
            return entries(this);
        };
        this._editable = editable;
        this._edit = edit;
        this._config = {
            keyEq: config && config.keyEq || defKeyCompare,
            hash: config && config.hash || hash
        };
        this._root = root;
        this._size = size;
    }
    Object.defineProperty(HAMTMap.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    HAMTMap.prototype.setTree = function (newRoot, newSize) {
        if (this._editable) {
            this._root = newRoot;
            this._size = newSize;
            return this;
        }
        return newRoot === this._root ? this : new HAMTMap(this._editable, this._edit, this._config, newRoot, newSize);
    };
    HAMTMap.prototype.tryGetHash = function (alt, hash, key) {
        return tryGetHash(alt, hash, key, this);
    };
    HAMTMap.prototype.tryGet = function (alt, key) {
        return tryGet(alt, key, this);
    };
    HAMTMap.prototype.getHash = function (hash, key) {
        return getHash(hash, key, this);
    };
    HAMTMap.prototype.get = function (key, alt) {
        return tryGet(alt, key, this);
    };
    HAMTMap.prototype.hasHash = function (hash, key) {
        return hasHash(hash, key, this);
    };
    HAMTMap.prototype.has = function (key) {
        return has(key, this);
    };
    HAMTMap.prototype.modifyHash = function (hash, key, f) {
        return modifyHash(f, hash, key, this);
    };
    HAMTMap.prototype.modify = function (key, f) {
        return modify(f, key, this);
    };
    HAMTMap.prototype.setHash = function (hash, key, value) {
        return setHash(hash, key, value, this);
    };
    HAMTMap.prototype.set = function (key, value) {
        return set(key, value, this);
    };
    HAMTMap.prototype.deleteHash = function (hash, key) {
        return removeHash(hash, key, this);
    };
    HAMTMap.prototype.removeHash = function (hash, key) {
        return removeHash(hash, key, this);
    };
    HAMTMap.prototype.remove = function (key) {
        return remove(key, this);
    };
    HAMTMap.prototype.beginMutation = function () {
        return beginMutation(this);
    };
    HAMTMap.prototype.endMutation = function () {
        return endMutation(this);
    };
    HAMTMap.prototype.mutate = function (f) {
        return mutate(f, this);
    };
    HAMTMap.prototype.entries = function () {
        return entries(this);
    };
    HAMTMap.prototype.keys = function () {
        return keys(this);
    };
    HAMTMap.prototype.values = function () {
        return values(this);
    };
    HAMTMap.prototype.fold = function (f, z) {
        return fold(f, z, this);
    };
    HAMTMap.prototype.forEach = function (f) {
        return forEach(f, this);
    };
    return HAMTMap;
}();
exports.default = HAMTMap;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy9oYW10LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQU1HOzs7Ozs7Ozs7QUFFSCxBQUFvQjtBQUNwQixpQkFBaUIsQUFBRztBQUFJLEFBQU0sV0FBQyxBQUFHLE9BQUksT0FBTyxBQUFNLFdBQUssQUFBVyxlQUFJLEFBQUcsSUFBQyxBQUFXLGdCQUFLLEFBQU0sU0FBRyxBQUFRLFdBQUcsT0FBTyxBQUFHLEFBQUMsQUFBQztBQUFDO0FBRTVILEFBQ2dGOztBQUNoRixJQUFNLEFBQUksT0FBRyxBQUFDLEFBQUM7QUFFZixJQUFNLEFBQVcsY0FBRyxBQUFJLEtBQUMsQUFBRyxJQUFDLEFBQUMsR0FBRSxBQUFJLEFBQUMsQUFBQztBQUV0QyxJQUFNLEFBQUksT0FBRyxBQUFXLGNBQUcsQUFBQyxBQUFDO0FBRTdCLElBQU0sQUFBYyxpQkFBRyxBQUFXLGNBQUcsQUFBQyxBQUFDO0FBRXZDLElBQU0sQUFBYyxpQkFBRyxBQUFXLGNBQUcsQUFBQyxBQUFDO0FBRXZDLEFBQ2dGOztBQUNoRixJQUFNLEFBQU8sVUFBRyxBQUFFLEFBQUM7QUFFbkIsa0JBQWtCLEFBQUM7QUFDakIsQUFBTSxXQUFDO0FBQ0wsQUFBTSxlQUFDLEFBQUMsQUFBQyxBQUNYO0FBQUMsQUFBQyxBQUNKO0FBQUM7QUFFRCxBQUtFOzs7Ozs7QUFDRixjQUFjLEFBQUc7QUFDZixRQUFNLEFBQUksT0FBRyxPQUFPLEFBQUcsUUFBSyxBQUFXLGNBQUcsQUFBVyxjQUFHLEFBQU8sUUFBQyxBQUFHLEFBQUMsQUFBQztBQUNyRSxBQUFFLEFBQUMsUUFBQyxBQUFJLFNBQUssQUFBUSxBQUFDLFVBQUMsQUFBTSxPQUFDLEFBQUcsQUFBQztBQUNsQyxBQUFFLEFBQUMsUUFBQyxBQUFJLFNBQUssQUFBUSxBQUFDLFVBQUMsQUFBRyxPQUFJLEFBQUUsQUFBQztBQUVqQyxRQUFJLEFBQUMsSUFBRyxBQUFDLEFB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O0FBQ0UsQUFBTSxlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUN0QjtBQUFDO0FBRUQsc0JBQUksT0FBSixVQUFLLEFBQUMsR0FBRSxBQUFDO0FBQ1AsQUFBTSxlQUFDLEFBQUksS0FBQyxBQUFDLEdBQUUsQUFBQyxHQUFFLEFBQUksQUFBQyxBQUFDLEFBQzFCO0FBQUM7QUFFRCxzQkFBTyxVQUFQLFVBQVEsQUFBQztBQUNQLEFBQU0sZUFBQyxBQUFPLFFBQUMsQUFBQyxHQUFFLEFBQUksQUFBQyxBQUFDLEFBQzFCO0FBQUM7QUFLSCxXQUFBLEFBQUM7QUEzSEQsQUEySEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29kZSBiYXNlZCBvbjogaHR0cHM6Ly9naXRodWIuY29tL21hdHRiaWVybmVyL2hhbXRcclxuICogQXV0aG9yOiBNYXR0IEJpZXJuZXJcclxuICogTUlUIGxpY2Vuc2VcclxuICpcclxuICogV2hpY2ggaXMgYmFzZWQgb246IGh0dHBzOi8vZ2l0aHViLmNvbS9leGNsaXB5L3BkYXRhXHJcbiAqL1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUgKi9cclxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH1cclxuXHJcbi8qIENvbmZpZ3VyYXRpb25cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuY29uc3QgU0laRSA9IDU7XHJcblxyXG5jb25zdCBCVUNLRVRfU0laRSA9IE1hdGgucG93KDIsIFNJWkUpO1xyXG5cclxuY29uc3QgTUFTSyA9IEJVQ0tFVF9TSVpFIC0gMTtcclxuXHJcbmNvbnN0IE1BWF9JTkRFWF9OT0RFID0gQlVDS0VUX1NJWkUgLyAyO1xyXG5cclxuY29uc3QgTUlOX0FSUkFZX05PREUgPSBCVUNLRVRfU0laRSAvIDQ7XHJcblxyXG4vKlxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5jb25zdCBub3RoaW5nID0ge307XHJcblxyXG5mdW5jdGlvbiBjb25zdGFudCh4KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiB4O1xyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gIEdldCAzMiBiaXQgaGFzaCBvZiBzdHJpbmcuXHJcblxyXG4gIEJhc2VkIG9uOlxyXG4gIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNzYxNjQ2MS9nZW5lcmF0ZS1hLWhhc2gtZnJvbS1zdHJpbmctaW4tamF2YXNjcmlwdC1qcXVlcnlcclxuKi9cclxuZnVuY3Rpb24gaGFzaChzdHIpIHtcclxuICBjb25zdCB0eXBlID0gdHlwZW9mIHN0ciA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yoc3RyKTtcclxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHJldHVybiBzdHI7XHJcbiAgaWYgKHR5cGUgIT09ICdzdHJpbmcnKSBzdHIgKz0gJyc7XHJcblxyXG4gIGxldCBoID0gMDtcclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gc3RyLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICB2YXIgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgaCA9IChoIDw8IDUpIC0gaCArIGMgfCAwO1xyXG4gIH1cclxuICByZXR1cm4gaDtcclxufVxyXG5cclxuLyogQml0IE9wc1xyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKipcclxuICBIYW1taW5nIHdlaWdodC5cclxuXHJcbiAgVGFrZW4gZnJvbTogaHR0cDovL2pzcGVyZi5jb20vaGFtbWluZy13ZWlnaHRcclxuKi9cclxuZnVuY3Rpb24gcG9wY291bnQoeCkge1xyXG4gIHggLT0geCA+PiAxICYgMHg1NTU1NTU1NTtcclxuICB4ID0gKHggJiAweDMzMzMzMzMzKSArICh4ID4+IDIgJiAweDMzMzMzMzMzKTtcclxuICB4ID0geCArICh4ID4+IDQpICYgMHgwZjBmMGYwZjtcclxuICB4ICs9IHggPj4gODtcclxuICB4ICs9IHggPj4gMTY7XHJcbiAgcmV0dXJuIHggJiAweDdmO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYXNoRnJhZ21lbnQoc2hpZnQsIGgpIHtcclxuICByZXR1cm4gaCA+Pj4gc2hpZnQgJiBNQVNLO1xyXG59XHJcblxyXG5mdW5jdGlvbiB0b0JpdG1hcCh4KSB7XHJcbiAgcmV0dXJuIDEgPDwgeDtcclxufVxyXG5cclxuZnVuY3Rpb24gZnJvbUJpdG1hcChiaXRtYXAsIGJpdCkge1xyXG4gIHJldHVybiBwb3Bjb3VudChiaXRtYXAgJiBiaXQgLSAxKTtcclxufVxyXG5cclxuLyogQXJyYXkgT3BzXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG4gIFNldCBhIHZhbHVlIGluIGFuIGFycmF5LlxyXG5cclxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCB0aGUgaW5wdXQgYXJyYXkgYmUgbXV0YXRlZD9cclxuICBAcGFyYW0gYXQgSW5kZXggdG8gY2hhbmdlLlxyXG4gIEBwYXJhbSB2IE5ldyB2YWx1ZVxyXG4gIEBwYXJhbSBhcnIgQXJyYXkuXHJcbiovXHJcbmZ1bmN0aW9uIGFycmF5VXBkYXRlKG11dGF0ZSwgYXQsIHYsIGFycikge1xyXG4gIHZhciBvdXQgPSBhcnI7XHJcbiAgaWYgKCFtdXRhdGUpIHtcclxuICAgIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xyXG4gICAgb3V0ID0gbmV3IEFycmF5KGxlbik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgIG91dFtpXSA9IGFycltpXTtcclxuICAgIH1cclxuICB9XHJcbiAgb3V0W2F0XSA9IHY7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG5cclxuLyoqXHJcbiAgUmVtb3ZlIGEgdmFsdWUgZnJvbSBhbiBhcnJheS5cclxuXHJcbiAgQHBhcmFtIG11dGF0ZSBTaG91bGQgdGhlIGlucHV0IGFycmF5IGJlIG11dGF0ZWQ/XHJcbiAgQHBhcmFtIGF0IEluZGV4IHRvIHJlbW92ZS5cclxuICBAcGFyYW0gYXJyIEFycmF5LlxyXG4qL1xyXG5mdW5jdGlvbiBhcnJheVNwbGljZU91dChtdXRhdGUsIGF0LCBhcnIpIHtcclxuICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcclxuICB2YXIgaSA9IDAsXHJcbiAgICAgIGcgPSAwO1xyXG4gIHZhciBvdXQgPSBhcnI7XHJcbiAgaWYgKG11dGF0ZSkge1xyXG4gICAgaSA9IGcgPSBhdDtcclxuICB9IGVsc2Uge1xyXG4gICAgb3V0ID0gbmV3IEFycmF5KGxlbiAtIDEpO1xyXG4gICAgd2hpbGUgKGkgPCBhdCkge1xyXG4gICAgICBvdXRbZysrXSA9IGFycltpKytdO1xyXG4gICAgfSsraTtcclxuICB9XHJcbiAgd2hpbGUgKGkgPCBsZW4pIHtcclxuICAgIG91dFtnKytdID0gYXJyW2krK107XHJcbiAgfXJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gIEluc2VydCBhIHZhbHVlIGludG8gYW4gYXJyYXkuXHJcblxyXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIHRoZSBpbnB1dCBhcnJheSBiZSBtdXRhdGVkP1xyXG4gIEBwYXJhbSBhdCBJbmRleCB0byBpbnNlcnQgYXQuXHJcbiAgQHBhcmFtIHYgVmFsdWUgdG8gaW5zZXJ0LFxyXG4gIEBwYXJhbSBhcnIgQXJyYXkuXHJcbiovXHJcbmZ1bmN0aW9uIGFycmF5U3BsaWNlSW4obXV0YXRlLCBhdCwgdiwgYXJyKSB7XHJcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XHJcbiAgaWYgKG11dGF0ZSkge1xyXG4gICAgdmFyIF9pID0gbGVuO1xyXG4gICAgd2hpbGUgKF9pID49IGF0KSB7XHJcbiAgICAgIGFycltfaS0tXSA9IGFycltfaV07XHJcbiAgICB9YXJyW2F0XSA9IHY7XHJcbiAgICByZXR1cm4gYXJyO1xyXG4gIH1cclxuICB2YXIgaSA9IDAsXHJcbiAgICAgIGcgPSAwO1xyXG4gIHZhciBvdXQgPSBuZXcgQXJyYXkobGVuICsgMSk7XHJcbiAgd2hpbGUgKGkgPCBhdCkge1xyXG4gICAgb3V0W2crK10gPSBhcnJbaSsrXTtcclxuICB9b3V0W2F0XSA9IHY7XHJcbiAgd2hpbGUgKGkgPCBsZW4pIHtcclxuICAgIG91dFsrK2ddID0gYXJyW2krK107XHJcbiAgfXJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qIE5vZGUgU3RydWN0dXJlc1xyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5jb25zdCBMRUFGID0gMTtcclxuY29uc3QgQ09MTElTSU9OID0gMjtcclxuY29uc3QgSU5ERVggPSAzO1xyXG5jb25zdCBBUlJBWSA9IDQ7XHJcblxyXG4vKipcclxuICBFbXB0eSBub2RlLlxyXG4qL1xyXG5jb25zdCBlbXB0eSA9IHtcclxuICBfX2hhbXRfaXNFbXB0eTogdHJ1ZSxcclxuXHJcbiAgX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcclxuICAgIHZhciB2ID0gZigpO1xyXG4gICAgaWYgKHYgPT09IG5vdGhpbmcpIHJldHVybiBlbXB0eTtcclxuICAgICsrc2l6ZS52YWx1ZTtcclxuICAgIHJldHVybiBMZWFmKGVkaXQsIGgsIGssIHYpO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIGlzRW1wdHlOb2RlKHgpIHtcclxuICByZXR1cm4geCA9PT0gZW1wdHkgfHwgeCAmJiB4Ll9faGFtdF9pc0VtcHR5O1xyXG59XHJcblxyXG4vKipcclxuICBMZWFmIGhvbGRpbmcgYSB2YWx1ZS5cclxuXHJcbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXHJcbiAgQG1lbWJlciBoYXNoIEhhc2ggb2Yga2V5LlxyXG4gIEBtZW1iZXIga2V5IEtleS5cclxuICBAbWVtYmVyIHZhbHVlIFZhbHVlIHN0b3JlZC5cclxuKi9cclxuZnVuY3Rpb24gTGVhZihlZGl0LCBoYXNoLCBrZXksIHZhbHVlKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IExFQUYsXHJcbiAgICBlZGl0OiBlZGl0LFxyXG4gICAgaGFzaDogaGFzaCxcclxuICAgIGtleToga2V5LFxyXG4gICAgdmFsdWU6IHZhbHVlLFxyXG4gICAgX21vZGlmeTogTGVhZl9fbW9kaWZ5XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAgTGVhZiBob2xkaW5nIG11bHRpcGxlIHZhbHVlcyB3aXRoIHRoZSBzYW1lIGhhc2ggYnV0IGRpZmZlcmVudCBrZXlzLlxyXG5cclxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cclxuICBAbWVtYmVyIGhhc2ggSGFzaCBvZiBrZXkuXHJcbiAgQG1lbWJlciBjaGlsZHJlbiBBcnJheSBvZiBjb2xsaXNpb24gY2hpbGRyZW4gbm9kZS5cclxuKi9cclxuZnVuY3Rpb24gQ29sbGlzaW9uKGVkaXQsIGhhc2gsIGNoaWxkcmVuKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IENPTExJU0lPTixcclxuICAgIGVkaXQ6IGVkaXQsXHJcbiAgICBoYXNoOiBoYXNoLFxyXG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgX21vZGlmeTogQ29sbGlzaW9uX19tb2RpZnlcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICBJbnRlcm5hbCBub2RlIHdpdGggYSBzcGFyc2Ugc2V0IG9mIGNoaWxkcmVuLlxyXG5cclxuICBVc2VzIGEgYml0bWFwIGFuZCBhcnJheSB0byBwYWNrIGNoaWxkcmVuLlxyXG5cclxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cclxuICBAbWVtYmVyIG1hc2sgQml0bWFwIHRoYXQgZW5jb2RlIHRoZSBwb3NpdGlvbnMgb2YgY2hpbGRyZW4gaW4gdGhlIGFycmF5LlxyXG4gIEBtZW1iZXIgY2hpbGRyZW4gQXJyYXkgb2YgY2hpbGQgbm9kZXMuXHJcbiovXHJcbmZ1bmN0aW9uIEluZGV4ZWROb2RlKGVkaXQsIG1hc2ssIGNoaWxkcmVuKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IElOREVYLFxyXG4gICAgZWRpdDogZWRpdCxcclxuICAgIG1hc2s6IG1hc2ssXHJcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICBfbW9kaWZ5OiBJbmRleGVkTm9kZV9fbW9kaWZ5XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAgSW50ZXJuYWwgbm9kZSB3aXRoIG1hbnkgY2hpbGRyZW4uXHJcblxyXG4gIEBtZW1iZXIgZWRpdCBFZGl0IG9mIHRoZSBub2RlLlxyXG4gIEBtZW1iZXIgc2l6ZSBOdW1iZXIgb2YgY2hpbGRyZW4uXHJcbiAgQG1lbWJlciBjaGlsZHJlbiBBcnJheSBvZiBjaGlsZCBub2Rlcy5cclxuKi9cclxuZnVuY3Rpb24gQXJyYXlOb2RlKGVkaXQsIHNpemUsIGNoaWxkcmVuKSB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHR5cGU6IEFSUkFZLFxyXG4gICAgZWRpdDogZWRpdCxcclxuICAgIHNpemU6IHNpemUsXHJcbiAgICBjaGlsZHJlbjogY2hpbGRyZW4sXHJcbiAgICBfbW9kaWZ5OiBBcnJheU5vZGVfX21vZGlmeVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgSXMgYG5vZGVgIGEgbGVhZiBub2RlP1xyXG4qL1xyXG5mdW5jdGlvbiBpc0xlYWYobm9kZSkge1xyXG4gIHJldHVybiBub2RlID09PSBlbXB0eSB8fCBub2RlLnR5cGUgPT09IExFQUYgfHwgbm9kZS50eXBlID09PSBDT0xMSVNJT047XHJcbn1cclxuXHJcbi8qIEludGVybmFsIG5vZGUgb3BlcmF0aW9ucy5cclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcbiAgRXhwYW5kIGFuIGluZGV4ZWQgbm9kZSBpbnRvIGFuIGFycmF5IG5vZGUuXHJcblxyXG4gIEBwYXJhbSBlZGl0IEN1cnJlbnQgZWRpdC5cclxuICBAcGFyYW0gZnJhZyBJbmRleCBvZiBhZGRlZCBjaGlsZC5cclxuICBAcGFyYW0gY2hpbGQgQWRkZWQgY2hpbGQuXHJcbiAgQHBhcmFtIG1hc2sgSW5kZXggbm9kZSBtYXNrIGJlZm9yZSBjaGlsZCBhZGRlZC5cclxuICBAcGFyYW0gc3ViTm9kZXMgSW5kZXggbm9kZSBjaGlsZHJlbiBiZWZvcmUgY2hpbGQgYWRkZWQuXHJcbiovXHJcbmZ1bmN0aW9uIGV4cGFuZChlZGl0LCBmcmFnLCBjaGlsZCwgYml0bWFwLCBzdWJOb2Rlcykge1xyXG4gIHZhciBhcnIgPSBbXTtcclxuICB2YXIgYml0ID0gYml0bWFwO1xyXG4gIHZhciBjb3VudCA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGJpdDsgKytpKSB7XHJcbiAgICAgIGlmIChiaXQgJiAxKSBhcnJbaV0gPSBzdWJOb2Rlc1tjb3VudCsrXTtcclxuICAgICAgYml0ID4+Pj0gMTtcclxuICB9XHJcbiAgYXJyW2ZyYWddID0gY2hpbGQ7XHJcbiAgcmV0dXJuIEFycmF5Tm9kZShlZGl0LCBjb3VudCArIDEsIGFycik7XHJcbn1cclxuXHJcbi8qKlxyXG4gIENvbGxhcHNlIGFuIGFycmF5IG5vZGUgaW50byBhIGluZGV4ZWQgbm9kZS5cclxuXHJcbiAgQHBhcmFtIGVkaXQgQ3VycmVudCBlZGl0LlxyXG4gIEBwYXJhbSBjb3VudCBOdW1iZXIgb2YgZWxlbWVudHMgaW4gbmV3IGFycmF5LlxyXG4gIEBwYXJhbSByZW1vdmVkIEluZGV4IG9mIHJlbW92ZWQgZWxlbWVudC5cclxuICBAcGFyYW0gZWxlbWVudHMgQXJyYXkgbm9kZSBjaGlsZHJlbiBiZWZvcmUgcmVtb3ZlLlxyXG4qL1xyXG5mdW5jdGlvbiBwYWNrKGVkaXQsIGNvdW50LCByZW1vdmVkLCBlbGVtZW50cykge1xyXG4gIHZhciBjaGlsZHJlbiA9IG5ldyBBcnJheShjb3VudCAtIDEpO1xyXG4gIHZhciBnID0gMDtcclxuICB2YXIgYml0bWFwID0gMDtcclxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gZWxlbWVudHMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgIGlmIChpICE9PSByZW1vdmVkKSB7XHJcbiAgICAgIHZhciBlbGVtID0gZWxlbWVudHNbaV07XHJcbiAgICAgIGlmIChlbGVtICYmICFpc0VtcHR5Tm9kZShlbGVtKSkge1xyXG4gICAgICAgIGNoaWxkcmVuW2crK10gPSBlbGVtO1xyXG4gICAgICAgIGJpdG1hcCB8PSAxIDw8IGk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIEluZGV4ZWROb2RlKGVkaXQsIGJpdG1hcCwgY2hpbGRyZW4pO1xyXG59XHJcblxyXG4vKipcclxuICBNZXJnZSB0d28gbGVhZiBub2Rlcy5cclxuXHJcbiAgQHBhcmFtIHNoaWZ0IEN1cnJlbnQgc2hpZnQuXHJcbiAgQHBhcmFtIGgxIE5vZGUgMSBoYXNoLlxyXG4gIEBwYXJhbSBuMSBOb2RlIDEuXHJcbiAgQHBhcmFtIGgyIE5vZGUgMiBoYXNoLlxyXG4gIEBwYXJhbSBuMiBOb2RlIDIuXHJcbiovXHJcbmZ1bmN0aW9uIG1lcmdlTGVhdmVzKGVkaXQsIHNoaWZ0LCBoMSwgbjEsIGgyLCBuMikge1xyXG4gIGlmIChoMSA9PT0gaDIpIHJldHVybiBDb2xsaXNpb24oZWRpdCwgaDEsIFtuMiwgbjFdKTtcclxuXHJcbiAgdmFyIHN1YkgxID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoMSk7XHJcbiAgdmFyIHN1YkgyID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoMik7XHJcbiAgcmV0dXJuIEluZGV4ZWROb2RlKGVkaXQsIHRvQml0bWFwKHN1YkgxKSB8IHRvQml0bWFwKHN1YkgyKSwgc3ViSDEgPT09IHN1YkgyID8gW21lcmdlTGVhdmVzKGVkaXQsIHNoaWZ0ICsgU0laRSwgaDEsIG4xLCBoMiwgbjIpXSA6IHN1YkgxIDwgc3ViSDIgPyBbbjEsIG4yXSA6IFtuMiwgbjFdKTtcclxufVxyXG5cclxuLyoqXHJcbiAgVXBkYXRlIGFuIGVudHJ5IGluIGEgY29sbGlzaW9uIGxpc3QuXHJcblxyXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIG11dGF0aW9uIGJlIHVzZWQ/XHJcbiAgQHBhcmFtIGVkaXQgQ3VycmVudCBlZGl0LlxyXG4gIEBwYXJhbSBrZXlFcSBLZXkgY29tcGFyZSBmdW5jdGlvbi5cclxuICBAcGFyYW0gaGFzaCBIYXNoIG9mIGNvbGxpc2lvbi5cclxuICBAcGFyYW0gbGlzdCBDb2xsaXNpb24gbGlzdC5cclxuICBAcGFyYW0gZiBVcGRhdGUgZnVuY3Rpb24uXHJcbiAgQHBhcmFtIGsgS2V5IHRvIHVwZGF0ZS5cclxuICBAcGFyYW0gc2l6ZSBTaXplIHJlZi5cclxuKi9cclxuZnVuY3Rpb24gdXBkYXRlQ29sbGlzaW9uTGlzdChtdXRhdGUsIGVkaXQsIGtleUVxLCBoLCBsaXN0LCBmLCBrLCBzaXplKSB7XHJcbiAgdmFyIGxlbiA9IGxpc3QubGVuZ3RoO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcclxuICAgIHZhciBjaGlsZCA9IGxpc3RbaV07XHJcbiAgICBpZiAoa2V5RXEoaywgY2hpbGQua2V5KSkge1xyXG4gICAgICB2YXIgdmFsdWUgPSBjaGlsZC52YWx1ZTtcclxuICAgICAgdmFyIF9uZXdWYWx1ZSA9IGYodmFsdWUpO1xyXG4gICAgICBpZiAoX25ld1ZhbHVlID09PSB2YWx1ZSkgcmV0dXJuIGxpc3Q7XHJcblxyXG4gICAgICBpZiAoX25ld1ZhbHVlID09PSBub3RoaW5nKSB7XHJcbiAgICAgICAgLS1zaXplLnZhbHVlO1xyXG4gICAgICAgIHJldHVybiBhcnJheVNwbGljZU91dChtdXRhdGUsIGksIGxpc3QpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBhcnJheVVwZGF0ZShtdXRhdGUsIGksIExlYWYoZWRpdCwgaCwgaywgX25ld1ZhbHVlKSwgbGlzdCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgbmV3VmFsdWUgPSBmKCk7XHJcbiAgaWYgKG5ld1ZhbHVlID09PSBub3RoaW5nKSByZXR1cm4gbGlzdDtcclxuICArK3NpemUudmFsdWU7XHJcbiAgcmV0dXJuIGFycmF5VXBkYXRlKG11dGF0ZSwgbGVuLCBMZWFmKGVkaXQsIGgsIGssIG5ld1ZhbHVlKSwgbGlzdCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNhbkVkaXROb2RlKGVkaXQsIG5vZGUpIHtcclxuICByZXR1cm4gZWRpdCA9PT0gbm9kZS5lZGl0O1xyXG59XHJcblxyXG4vKiBFZGl0aW5nXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmZ1bmN0aW9uIExlYWZfX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcclxuICBpZiAoa2V5RXEoaywgdGhpcy5rZXkpKSB7XHJcbiAgICB2YXIgX3YgPSBmKHRoaXMudmFsdWUpO1xyXG4gICAgaWYgKF92ID09PSB0aGlzLnZhbHVlKSByZXR1cm4gdGhpcztlbHNlIGlmIChfdiA9PT0gbm90aGluZykge1xyXG4gICAgICAtLXNpemUudmFsdWU7XHJcbiAgICAgIHJldHVybiBlbXB0eTtcclxuICAgIH1cclxuICAgIGlmIChjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKSkge1xyXG4gICAgICB0aGlzLnZhbHVlID0gX3Y7XHJcbiAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIExlYWYoZWRpdCwgaCwgaywgX3YpO1xyXG4gIH1cclxuICB2YXIgdiA9IGYoKTtcclxuICBpZiAodiA9PT0gbm90aGluZykgcmV0dXJuIHRoaXM7XHJcbiAgKytzaXplLnZhbHVlO1xyXG4gIHJldHVybiBtZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCwgdGhpcy5oYXNoLCB0aGlzLCBoLCBMZWFmKGVkaXQsIGgsIGssIHYpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gQ29sbGlzaW9uX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XHJcbiAgaWYgKGggPT09IHRoaXMuaGFzaCkge1xyXG4gICAgdmFyIGNhbkVkaXQgPSBjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKTtcclxuICAgIHZhciBsaXN0ID0gdXBkYXRlQ29sbGlzaW9uTGlzdChjYW5FZGl0LCBlZGl0LCBrZXlFcSwgdGhpcy5oYXNoLCB0aGlzLmNoaWxkcmVuLCBmLCBrLCBzaXplKTtcclxuICAgIGlmIChsaXN0ID09PSB0aGlzLmNoaWxkcmVuKSByZXR1cm4gdGhpcztcclxuXHJcbiAgICByZXR1cm4gbGlzdC5sZW5ndGggPiAxID8gQ29sbGlzaW9uKGVkaXQsIHRoaXMuaGFzaCwgbGlzdCkgOiBsaXN0WzBdOyAvLyBjb2xsYXBzZSBzaW5nbGUgZWxlbWVudCBjb2xsaXNpb24gbGlzdFxyXG4gIH1cclxuICB2YXIgdiA9IGYoKTtcclxuICBpZiAodiA9PT0gbm90aGluZykgcmV0dXJuIHRoaXM7XHJcbiAgKytzaXplLnZhbHVlO1xyXG4gIHJldHVybiBtZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCwgdGhpcy5oYXNoLCB0aGlzLCBoLCBMZWFmKGVkaXQsIGgsIGssIHYpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gSW5kZXhlZE5vZGVfX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcclxuICB2YXIgbWFzayA9IHRoaXMubWFzaztcclxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gIHZhciBmcmFnID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoKTtcclxuICB2YXIgYml0ID0gdG9CaXRtYXAoZnJhZyk7XHJcbiAgdmFyIGluZHggPSBmcm9tQml0bWFwKG1hc2ssIGJpdCk7XHJcbiAgdmFyIGV4aXN0cyA9IG1hc2sgJiBiaXQ7XHJcbiAgdmFyIGN1cnJlbnQgPSBleGlzdHMgPyBjaGlsZHJlbltpbmR4XSA6IGVtcHR5O1xyXG4gIHZhciBjaGlsZCA9IGN1cnJlbnQuX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQgKyBTSVpFLCBmLCBoLCBrLCBzaXplKTtcclxuXHJcbiAgaWYgKGN1cnJlbnQgPT09IGNoaWxkKSByZXR1cm4gdGhpcztcclxuXHJcbiAgdmFyIGNhbkVkaXQgPSBjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKTtcclxuICB2YXIgYml0bWFwID0gbWFzaztcclxuICB2YXIgbmV3Q2hpbGRyZW4gPSB1bmRlZmluZWQ7XHJcbiAgaWYgKGV4aXN0cyAmJiBpc0VtcHR5Tm9kZShjaGlsZCkpIHtcclxuICAgIC8vIHJlbW92ZVxyXG4gICAgYml0bWFwICY9IH5iaXQ7XHJcbiAgICBpZiAoIWJpdG1hcCkgcmV0dXJuIGVtcHR5O1xyXG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA8PSAyICYmIGlzTGVhZihjaGlsZHJlbltpbmR4IF4gMV0pKSByZXR1cm4gY2hpbGRyZW5baW5keCBeIDFdOyAvLyBjb2xsYXBzZVxyXG5cclxuICAgIG5ld0NoaWxkcmVuID0gYXJyYXlTcGxpY2VPdXQoY2FuRWRpdCwgaW5keCwgY2hpbGRyZW4pO1xyXG4gIH0gZWxzZSBpZiAoIWV4aXN0cyAmJiAhaXNFbXB0eU5vZGUoY2hpbGQpKSB7XHJcbiAgICAvLyBhZGRcclxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPj0gTUFYX0lOREVYX05PREUpIHJldHVybiBleHBhbmQoZWRpdCwgZnJhZywgY2hpbGQsIG1hc2ssIGNoaWxkcmVuKTtcclxuXHJcbiAgICBiaXRtYXAgfD0gYml0O1xyXG4gICAgbmV3Q2hpbGRyZW4gPSBhcnJheVNwbGljZUluKGNhbkVkaXQsIGluZHgsIGNoaWxkLCBjaGlsZHJlbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIG1vZGlmeVxyXG4gICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBpbmR4LCBjaGlsZCwgY2hpbGRyZW4pO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhbkVkaXQpIHtcclxuICAgIHRoaXMubWFzayA9IGJpdG1hcDtcclxuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICByZXR1cm4gSW5kZXhlZE5vZGUoZWRpdCwgYml0bWFwLCBuZXdDaGlsZHJlbik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEFycmF5Tm9kZV9fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xyXG4gIHZhciBjb3VudCA9IHRoaXMuc2l6ZTtcclxuICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuO1xyXG4gIHZhciBmcmFnID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoKTtcclxuICB2YXIgY2hpbGQgPSBjaGlsZHJlbltmcmFnXTtcclxuICB2YXIgbmV3Q2hpbGQgPSAoY2hpbGQgfHwgZW1wdHkpLl9tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0ICsgU0laRSwgZiwgaCwgaywgc2l6ZSk7XHJcblxyXG4gIGlmIChjaGlsZCA9PT0gbmV3Q2hpbGQpIHJldHVybiB0aGlzO1xyXG5cclxuICB2YXIgY2FuRWRpdCA9IGNhbkVkaXROb2RlKGVkaXQsIHRoaXMpO1xyXG4gIHZhciBuZXdDaGlsZHJlbiA9IHVuZGVmaW5lZDtcclxuICBpZiAoaXNFbXB0eU5vZGUoY2hpbGQpICYmICFpc0VtcHR5Tm9kZShuZXdDaGlsZCkpIHtcclxuICAgIC8vIGFkZFxyXG4gICAgKytjb3VudDtcclxuICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgZnJhZywgbmV3Q2hpbGQsIGNoaWxkcmVuKTtcclxuICB9IGVsc2UgaWYgKCFpc0VtcHR5Tm9kZShjaGlsZCkgJiYgaXNFbXB0eU5vZGUobmV3Q2hpbGQpKSB7XHJcbiAgICAvLyByZW1vdmVcclxuICAgIC0tY291bnQ7XHJcbiAgICBpZiAoY291bnQgPD0gTUlOX0FSUkFZX05PREUpIHJldHVybiBwYWNrKGVkaXQsIGNvdW50LCBmcmFnLCBjaGlsZHJlbik7XHJcbiAgICBuZXdDaGlsZHJlbiA9IGFycmF5VXBkYXRlKGNhbkVkaXQsIGZyYWcsIGVtcHR5LCBjaGlsZHJlbik7XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIG1vZGlmeVxyXG4gICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBmcmFnLCBuZXdDaGlsZCwgY2hpbGRyZW4pO1xyXG4gIH1cclxuXHJcbiAgaWYgKGNhbkVkaXQpIHtcclxuICAgIHRoaXMuc2l6ZSA9IGNvdW50O1xyXG4gICAgdGhpcy5jaGlsZHJlbiA9IG5ld0NoaWxkcmVuO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG4gIHJldHVybiBBcnJheU5vZGUoZWRpdCwgY291bnQsIG5ld0NoaWxkcmVuKTtcclxufTtcclxuXHJcbi8qIFF1ZXJpZXNcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcbiAgICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBhIGN1c3RvbSBgaGFzaGAuXHJcblxyXG4gICAgUmV0dXJucyB0aGUgdmFsdWUgb3IgYGFsdGAgaWYgbm9uZS5cclxuKi9cclxuZnVuY3Rpb24gdHJ5R2V0SGFzaChhbHQsIGhhc2gsIGtleSwgbWFwKSB7XHJcbiAgdmFyIG5vZGUgPSBtYXAuX3Jvb3Q7XHJcbiAgdmFyIHNoaWZ0ID0gMDtcclxuICB2YXIga2V5RXEgPSBtYXAuX2NvbmZpZy5rZXlFcTtcclxuICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcclxuICAgICAgY2FzZSBMRUFGOlxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHJldHVybiBrZXlFcShrZXksIG5vZGUua2V5KSA/IG5vZGUudmFsdWUgOiBhbHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICBjYXNlIENPTExJU0lPTjpcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZiAoaGFzaCA9PT0gbm9kZS5oYXNoKSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgIGlmIChrZXlFcShrZXksIGNoaWxkLmtleSkpIHJldHVybiBjaGlsZC52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGFsdDtcclxuICAgICAgICB9XHJcbiAgICAgIGNhc2UgSU5ERVg6XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdmFyIGZyYWcgPSBoYXNoRnJhZ21lbnQoc2hpZnQsIGhhc2gpO1xyXG4gICAgICAgICAgdmFyIGJpdCA9IHRvQml0bWFwKGZyYWcpO1xyXG4gICAgICAgICAgaWYgKG5vZGUubWFzayAmIGJpdCkge1xyXG4gICAgICAgICAgICBub2RlID0gbm9kZS5jaGlsZHJlbltmcm9tQml0bWFwKG5vZGUubWFzaywgYml0KV07XHJcbiAgICAgICAgICAgIHNoaWZ0ICs9IFNJWkU7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGFsdDtcclxuICAgICAgICB9XHJcbiAgICAgIGNhc2UgQVJSQVk6XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5baGFzaEZyYWdtZW50KHNoaWZ0LCBoYXNoKV07XHJcbiAgICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgICBzaGlmdCArPSBTSVpFO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhbHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIHJldHVybiBhbHQ7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxyXG5cclxuICBAc2VlIGB0cnlHZXRIYXNoYFxyXG4qL1xyXG5mdW5jdGlvbiB0cnlHZXQoYWx0LCBrZXksIG1hcCkge1xyXG4gIHJldHVybiB0cnlHZXRIYXNoKGFsdCwgbWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gIExvb2t1cCB0aGUgdmFsdWUgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGEgY3VzdG9tIGBoYXNoYC5cclxuXHJcbiAgUmV0dXJucyB0aGUgdmFsdWUgb3IgYHVuZGVmaW5lZGAgaWYgbm9uZS5cclxuKi9cclxuZnVuY3Rpb24gZ2V0SGFzaChoYXNoLCBrZXksIG1hcCkge1xyXG4gIHJldHVybiB0cnlHZXRIYXNoKHVuZGVmaW5lZCwgaGFzaCwga2V5LCBtYXApO1xyXG59XHJcblxyXG4vKipcclxuICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxyXG5cclxuICBAc2VlIGBnZXRgXHJcbiovXHJcbmZ1bmN0aW9uIGdldChrZXksIG1hcCkge1xyXG4gIHJldHVybiB0cnlHZXRIYXNoKHVuZGVmaW5lZCwgbWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gICAgRG9lcyBhbiBlbnRyeSBleGlzdCBmb3IgYGtleWAgaW4gYG1hcGA/IFVzZXMgY3VzdG9tIGBoYXNoYC5cclxuKi9cclxuZnVuY3Rpb24gaGFzSGFzaChoYXNoLCBrZXksIG1hcCkge1xyXG4gIHJldHVybiB0cnlHZXRIYXNoKG5vdGhpbmcsIGhhc2gsIGtleSwgbWFwKSAhPT0gbm90aGluZztcclxufVxyXG5cclxuLyoqXHJcbiAgRG9lcyBhbiBlbnRyeSBleGlzdCBmb3IgYGtleWAgaW4gYG1hcGA/IFVzZXMgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cclxuKi9cclxuZnVuY3Rpb24gaGFzKGtleSwgbWFwKSB7XHJcbiAgcmV0dXJuIGhhc0hhc2gobWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZktleUNvbXBhcmUoeCwgeSkge1xyXG4gIHJldHVybiB4ID09PSB5O1xyXG59XHJcblxyXG4vKipcclxuICBEb2VzIGBtYXBgIGNvbnRhaW4gYW55IGVsZW1lbnRzP1xyXG4qL1xyXG5mdW5jdGlvbiBpc0VtcHR5KG1hcCkge1xyXG4gIHJldHVybiBtYXAgJiYgISFpc0VtcHR5Tm9kZShtYXAuX3Jvb3QpO1xyXG59XHJcblxyXG4vKiBVcGRhdGVzXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG4gICAgQWx0ZXIgdGhlIHZhbHVlIHN0b3JlZCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgZnVuY3Rpb24gYGZgIHVzaW5nXHJcbiAgICBjdXN0b20gaGFzaC5cclxuXHJcbiAgICBgZmAgaXMgaW52b2tlZCB3aXRoIHRoZSBjdXJyZW50IHZhbHVlIGZvciBga2AgaWYgaXQgZXhpc3RzLFxyXG4gICAgb3Igbm8gYXJndW1lbnRzIGlmIG5vIHN1Y2ggdmFsdWUgZXhpc3RzLiBgbW9kaWZ5YCB3aWxsIGFsd2F5cyBlaXRoZXJcclxuICAgIHVwZGF0ZSBvciBpbnNlcnQgYSB2YWx1ZSBpbnRvIHRoZSBtYXAuXHJcblxyXG4gICAgUmV0dXJucyBhIG1hcCB3aXRoIHRoZSBtb2RpZmllZCB2YWx1ZS4gRG9lcyBub3QgYWx0ZXIgYG1hcGAuXHJcbiovXHJcbmZ1bmN0aW9uIG1vZGlmeUhhc2goZiwgaGFzaCwga2V5LCBtYXApIHtcclxuICB2YXIgc2l6ZSA9IHsgdmFsdWU6IG1hcC5fc2l6ZSB9O1xyXG4gIHZhciBuZXdSb290ID0gbWFwLl9yb290Ll9tb2RpZnkobWFwLl9lZGl0YWJsZSA/IG1hcC5fZWRpdCA6IE5hTiwgbWFwLl9jb25maWcua2V5RXEsIDAsIGYsIGhhc2gsIGtleSwgc2l6ZSk7XHJcbiAgcmV0dXJuIG1hcC5zZXRUcmVlKG5ld1Jvb3QsIHNpemUudmFsdWUpO1xyXG59XHJcblxyXG4vKipcclxuICBBbHRlciB0aGUgdmFsdWUgc3RvcmVkIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBmdW5jdGlvbiBgZmAgdXNpbmdcclxuICBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxyXG5cclxuICBAc2VlIGBtb2RpZnlIYXNoYFxyXG4qL1xyXG5mdW5jdGlvbiBtb2RpZnkoZiwga2V5LCBtYXApIHtcclxuICByZXR1cm4gbW9kaWZ5SGFzaChmLCBtYXAuX2NvbmZpZy5oYXNoKGtleSksIGtleSwgbWFwKTtcclxufVxyXG5cclxuLyoqXHJcbiAgU3RvcmUgYHZhbHVlYCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgY3VzdG9tIGBoYXNoYC5cclxuXHJcbiAgUmV0dXJucyBhIG1hcCB3aXRoIHRoZSBtb2RpZmllZCB2YWx1ZS4gRG9lcyBub3QgYWx0ZXIgYG1hcGAuXHJcbiovXHJcbmZ1bmN0aW9uIHNldEhhc2goaGFzaCwga2V5LCB2YWx1ZSwgbWFwKSB7XHJcbiAgcmV0dXJuIG1vZGlmeUhhc2goY29uc3RhbnQodmFsdWUpLCBoYXNoLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICBTdG9yZSBgdmFsdWVgIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBpbnRlcm5hbCBoYXNoIGZ1bmN0aW9uLlxyXG5cclxuICBAc2VlIGBzZXRIYXNoYFxyXG4qL1xyXG5mdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSwgbWFwKSB7XHJcbiAgcmV0dXJuIHNldEhhc2gobWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIHZhbHVlLCBtYXApO1xyXG59XHJcblxyXG4vKipcclxuICBSZW1vdmUgdGhlIGVudHJ5IGZvciBga2V5YCBpbiBgbWFwYC5cclxuXHJcbiAgUmV0dXJucyBhIG1hcCB3aXRoIHRoZSB2YWx1ZSByZW1vdmVkLiBEb2VzIG5vdCBhbHRlciBgbWFwYC5cclxuKi9cclxuY29uc3QgZGVsID0gY29uc3RhbnQobm90aGluZyk7XHJcbmZ1bmN0aW9uIHJlbW92ZUhhc2goaGFzaCwga2V5LCBtYXApIHtcclxuICByZXR1cm4gbW9kaWZ5SGFzaChkZWwsIGhhc2gsIGtleSwgbWFwKTtcclxufVxyXG5cclxuLyoqXHJcbiAgUmVtb3ZlIHRoZSBlbnRyeSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cclxuXHJcbiAgQHNlZSBgcmVtb3ZlSGFzaGBcclxuKi9cclxuZnVuY3Rpb24gcmVtb3ZlKGtleSwgbWFwKSB7XHJcbiAgcmV0dXJuIHJlbW92ZUhhc2gobWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcbi8qIE11dGF0aW9uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG4gIE1hcmsgYG1hcGAgYXMgbXV0YWJsZS5cclxuICovXHJcbmZ1bmN0aW9uIGJlZ2luTXV0YXRpb24obWFwKSB7XHJcbiAgcmV0dXJuIG5ldyBIQU1UTWFwKG1hcC5fZWRpdGFibGUgKyAxLCBtYXAuX2VkaXQgKyAxLCBtYXAuX2NvbmZpZywgbWFwLl9yb290LCBtYXAuX3NpemUpO1xyXG59XHJcblxyXG4vKipcclxuICBNYXJrIGBtYXBgIGFzIGltbXV0YWJsZS5cclxuICovXHJcbmZ1bmN0aW9uIGVuZE11dGF0aW9uKG1hcCkge1xyXG4gIG1hcC5fZWRpdGFibGUgPSBtYXAuX2VkaXRhYmxlICYmIG1hcC5fZWRpdGFibGUgLSAxO1xyXG4gIHJldHVybiBtYXA7XHJcbn1cclxuXHJcbi8qKlxyXG4gIE11dGF0ZSBgbWFwYCB3aXRoaW4gdGhlIGNvbnRleHQgb2YgYGZgLlxyXG4gIEBwYXJhbSBmXHJcbiAgQHBhcmFtIG1hcCBIQU1UXHJcbiovXHJcbmZ1bmN0aW9uIG11dGF0ZShmLCBtYXApIHtcclxuICB2YXIgdHJhbnNpZW50ID0gYmVnaW5NdXRhdGlvbihtYXApO1xyXG4gIGYodHJhbnNpZW50KTtcclxuICByZXR1cm4gZW5kTXV0YXRpb24odHJhbnNpZW50KTtcclxufTtcclxuXHJcbi8qIFRyYXZlcnNhbFxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKipcclxuICBBcHBseSBhIGNvbnRpbnVhdGlvbi5cclxuKi9cclxuZnVuY3Rpb24gYXBwayhrKSB7XHJcbiAgcmV0dXJuIGsgJiYgbGF6eVZpc2l0Q2hpbGRyZW4oa1swXSwga1sxXSwga1syXSwga1szXSwga1s0XSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gIFJlY3Vyc2l2ZWx5IHZpc2l0IGFsbCB2YWx1ZXMgc3RvcmVkIGluIGFuIGFycmF5IG9mIG5vZGVzIGxhemlseS5cclxuKi9cclxuZnVuY3Rpb24gbGF6eVZpc2l0Q2hpbGRyZW4obGVuLCBjaGlsZHJlbiwgaSwgZiwgaykge1xyXG4gIHdoaWxlIChpIDwgbGVuKSB7XHJcbiAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpKytdO1xyXG4gICAgaWYgKGNoaWxkICYmICFpc0VtcHR5Tm9kZShjaGlsZCkpIHJldHVybiBsYXp5VmlzaXQoY2hpbGQsIGYsIFtsZW4sIGNoaWxkcmVuLCBpLCBmLCBrXSk7XHJcbiAgfVxyXG4gIHJldHVybiBhcHBrKGspO1xyXG59XHJcblxyXG4vKipcclxuICBSZWN1cnNpdmVseSB2aXNpdCBhbGwgdmFsdWVzIHN0b3JlZCBpbiBgbm9kZWAgbGF6aWx5LlxyXG4qL1xyXG5mdW5jdGlvbiBsYXp5VmlzaXQobm9kZSwgZiwgaz8pIHtcclxuICBzd2l0Y2ggKG5vZGUudHlwZSkge1xyXG4gICAgY2FzZSBMRUFGOlxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHZhbHVlOiBmKG5vZGUpLFxyXG4gICAgICAgIHJlc3Q6IGtcclxuICAgICAgfTtcclxuXHJcbiAgICBjYXNlIENPTExJU0lPTjpcclxuICAgIGNhc2UgQVJSQVk6XHJcbiAgICBjYXNlIElOREVYOlxyXG4gICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgICByZXR1cm4gbGF6eVZpc2l0Q2hpbGRyZW4oY2hpbGRyZW4ubGVuZ3RoLCBjaGlsZHJlbiwgMCwgZiwgayk7XHJcblxyXG4gICAgZGVmYXVsdDpcclxuICAgICAgcmV0dXJuIGFwcGsoayk7XHJcbiAgfVxyXG59XHJcblxyXG5jb25zdCBET05FID0ge1xyXG4gIGRvbmU6IHRydWVcclxufTtcclxuXHJcbi8qKlxyXG4gIExhemlseSB2aXNpdCBlYWNoIHZhbHVlIGluIG1hcCB3aXRoIGZ1bmN0aW9uIGBmYC5cclxuKi9cclxuZnVuY3Rpb24gdmlzaXQobWFwLCBmKSB7XHJcbiAgcmV0dXJuIG5ldyBIQU1UTWFwSXRlcmF0b3IobGF6eVZpc2l0KG1hcC5fcm9vdCwgZikpO1xyXG59XHJcblxyXG4vKipcclxuICBHZXQgYSBKYXZhc2NzcmlwdCBpdGVyYXRvciBvZiBgbWFwYC5cclxuXHJcbiAgSXRlcmF0ZXMgb3ZlciBgW2tleSwgdmFsdWVdYCBhcnJheXMuXHJcbiovXHJcbmZ1bmN0aW9uIGJ1aWxkUGFpcnMoeCkge1xyXG4gIHJldHVybiBbeC5rZXksIHgudmFsdWVdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBlbnRyaWVzKG1hcCkge1xyXG4gIHJldHVybiB2aXNpdChtYXAsIGJ1aWxkUGFpcnMpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAgR2V0IGFycmF5IG9mIGFsbCBrZXlzIGluIGBtYXBgLlxyXG5cclxuICBPcmRlciBpcyBub3QgZ3VhcmFudGVlZC5cclxuKi9cclxuZnVuY3Rpb24gYnVpbGRLZXlzKHgpIHtcclxuICByZXR1cm4geC5rZXk7XHJcbn1cclxuZnVuY3Rpb24ga2V5cyhtYXApIHtcclxuICByZXR1cm4gdmlzaXQobWFwLCBidWlsZEtleXMpO1xyXG59XHJcblxyXG4vKipcclxuICBHZXQgYXJyYXkgb2YgYWxsIHZhbHVlcyBpbiBgbWFwYC5cclxuXHJcbiAgT3JkZXIgaXMgbm90IGd1YXJhbnRlZWQsIGR1cGxpY2F0ZXMgYXJlIHByZXNlcnZlZC5cclxuKi9cclxuZnVuY3Rpb24gYnVpbGRWYWx1ZXMoeCkge1xyXG4gIHJldHVybiB4LnZhbHVlO1xyXG59XHJcbmZ1bmN0aW9uIHZhbHVlcyhtYXApIHtcclxuICByZXR1cm4gdmlzaXQobWFwLCBidWlsZFZhbHVlcyk7XHJcbn1cclxuXHJcbi8qIEZvbGRcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcbiAgVmlzaXQgZXZlcnkgZW50cnkgaW4gdGhlIG1hcCwgYWdncmVnYXRpbmcgZGF0YS5cclxuXHJcbiAgT3JkZXIgb2Ygbm9kZXMgaXMgbm90IGd1YXJhbnRlZWQuXHJcblxyXG4gIEBwYXJhbSBmIEZ1bmN0aW9uIG1hcHBpbmcgYWNjdW11bGF0ZWQgdmFsdWUsIHZhbHVlLCBhbmQga2V5IHRvIG5ldyB2YWx1ZS5cclxuICBAcGFyYW0geiBTdGFydGluZyB2YWx1ZS5cclxuICBAcGFyYW0gbSBIQU1UXHJcbiovXHJcbmZ1bmN0aW9uIGZvbGQoZiwgeiwgbSkge1xyXG4gIHZhciByb290ID0gbS5fcm9vdDtcclxuICBpZiAocm9vdC50eXBlID09PSBMRUFGKSByZXR1cm4gZih6LCByb290LnZhbHVlLCByb290LmtleSk7XHJcblxyXG4gIHZhciB0b1Zpc2l0ID0gW3Jvb3QuY2hpbGRyZW5dO1xyXG4gIHZhciBjaGlsZHJlbiA9IHVuZGVmaW5lZDtcclxuICB3aGlsZSAoY2hpbGRyZW4gPSB0b1Zpc2l0LnBvcCgpKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOykge1xyXG4gICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpKytdO1xyXG4gICAgICBpZiAoY2hpbGQgJiYgY2hpbGQudHlwZSkge1xyXG4gICAgICAgIGlmIChjaGlsZC50eXBlID09PSBMRUFGKSB6ID0gZih6LCBjaGlsZC52YWx1ZSwgY2hpbGQua2V5KTtlbHNlIHRvVmlzaXQucHVzaChjaGlsZC5jaGlsZHJlbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHo7XHJcbn1cclxuXHJcbi8qKlxyXG4gIFZpc2l0IGV2ZXJ5IGVudHJ5IGluIHRoZSBtYXAsIGFnZ3JlZ2F0aW5nIGRhdGEuXHJcblxyXG4gIE9yZGVyIG9mIG5vZGVzIGlzIG5vdCBndWFyYW50ZWVkLlxyXG5cclxuICBAcGFyYW0gZiBGdW5jdGlvbiBpbnZva2VkIHdpdGggdmFsdWUgYW5kIGtleVxyXG4gIEBwYXJhbSBtYXAgSEFNVFxyXG4qL1xyXG5mdW5jdGlvbiBmb3JFYWNoKGYsIG1hcCkge1xyXG4gIHJldHVybiBmb2xkKGZ1bmN0aW9uIChfLCB2YWx1ZSwga2V5KSB7XHJcbiAgICByZXR1cm4gZih2YWx1ZSwga2V5LCBtYXApO1xyXG4gIH0sIG51bGwsIG1hcCk7XHJcbn1cclxuXHJcbi8qIEV4cG9ydFxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5leHBvcnQgY2xhc3MgSEFNVE1hcEl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgSXRlcmFibGVJdGVyYXRvcjxUPiB7XHJcbiAgcHJpdmF0ZSB2O1xyXG5cclxuICBjb25zdHJ1Y3Rvcih2KSB7XHJcbiAgICB0aGlzLnYgPSB2O1xyXG4gIH1cclxuXHJcbiAgbmV4dCgpIHtcclxuICAgIGlmICghdGhpcy52KSByZXR1cm4gRE9ORTtcclxuICAgIHZhciB2MCA9IHRoaXMudjtcclxuICAgIHRoaXMudiA9IGFwcGsodjAucmVzdCk7XHJcbiAgICByZXR1cm4gdjA7XHJcbiAgfVxyXG5cclxuICBbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEhBTVRNYXBDb25maWcge1xyXG4gIGtleUVxPzogRnVuY3Rpb24sIC8vIFRPRE9cclxuICBoYXNoPzogRnVuY3Rpb24gLy8gVE9ET1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIQU1UTWFwIHtcclxuICBwcml2YXRlIF9tYXA7XHJcbiAgcHJpdmF0ZSBfZWRpdGFibGU7XHJcbiAgcHJpdmF0ZSBfZWRpdDtcclxuICBwcml2YXRlIF9jb25maWc6IEhBTVRNYXBDb25maWc7XHJcbiAgcHJpdmF0ZSBfcm9vdDsgLy8gVE9ET1xyXG4gIHByaXZhdGUgX3NpemU6IG51bWJlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoZWRpdGFibGUgPSAwLCBlZGl0ID0gMCwgY29uZmlnOiBIQU1UTWFwQ29uZmlnID0ge30sIHJvb3QgPSBlbXB0eSwgc2l6ZTogbnVtYmVyID0gMCkge1xyXG4gICAgdGhpcy5fZWRpdGFibGUgPSBlZGl0YWJsZTtcclxuICAgIHRoaXMuX2VkaXQgPSBlZGl0O1xyXG4gICAgdGhpcy5fY29uZmlnID0ge1xyXG4gICAgICBrZXlFcTogY29uZmlnICYmIGNvbmZpZy5rZXlFcSB8fCBkZWZLZXlDb21wYXJlLFxyXG4gICAgICBoYXNoOiBjb25maWcgJiYgY29uZmlnLmhhc2ggfHwgaGFzaFxyXG4gICAgfTtcclxuICAgIHRoaXMuX3Jvb3QgPSByb290O1xyXG4gICAgdGhpcy5fc2l6ZSA9IHNpemU7XHJcbiAgfVxyXG5cclxuICBnZXQgc2l6ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9zaXplO1xyXG4gIH1cclxuXHJcbiAgc2V0VHJlZShuZXdSb290LCBuZXdTaXplKSB7XHJcbiAgICBpZiAodGhpcy5fZWRpdGFibGUpIHtcclxuICAgICAgdGhpcy5fcm9vdCA9IG5ld1Jvb3Q7XHJcbiAgICAgIHRoaXMuX3NpemUgPSBuZXdTaXplO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBuZXdSb290ID09PSB0aGlzLl9yb290ID8gdGhpcyA6IG5ldyBIQU1UTWFwKHRoaXMuX2VkaXRhYmxlLCB0aGlzLl9lZGl0LCB0aGlzLl9jb25maWcsIG5ld1Jvb3QsIG5ld1NpemUpO1xyXG4gIH1cclxuXHJcbiAgdHJ5R2V0SGFzaChhbHQsIGhhc2gsIGtleSkge1xyXG4gICAgcmV0dXJuIHRyeUdldEhhc2goYWx0LCBoYXNoLCBrZXksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgdHJ5R2V0KGFsdCwga2V5KSB7XHJcbiAgICByZXR1cm4gdHJ5R2V0KGFsdCwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldEhhc2goaGFzaCwga2V5KSB7XHJcbiAgICByZXR1cm4gZ2V0SGFzaChoYXNoLCBrZXksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZ2V0KGtleSwgYWx0Pykge1xyXG4gICAgcmV0dXJuIHRyeUdldChhbHQsIGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBoYXNIYXNoKGhhc2gsIGtleSkge1xyXG4gICAgcmV0dXJuIGhhc0hhc2goaGFzaCwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGhhcyhrZXkpIHtcclxuICAgIHJldHVybiBoYXMoa2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gaXNFbXB0eSh0aGlzKTtcclxuICB9XHJcblxyXG4gIG1vZGlmeUhhc2goaGFzaCwga2V5LCBmKSB7XHJcbiAgICByZXR1cm4gbW9kaWZ5SGFzaChmLCBoYXNoLCBrZXksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgbW9kaWZ5KGtleSwgZikge1xyXG4gICAgcmV0dXJuIG1vZGlmeShmLCBrZXksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0SGFzaChoYXNoLCBrZXksIHZhbHVlKSB7XHJcbiAgICByZXR1cm4gc2V0SGFzaChoYXNoLCBrZXksIHZhbHVlLCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHNldChrZXksIHZhbHVlKSB7XHJcbiAgICByZXR1cm4gc2V0KGtleSwgdmFsdWUsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlSGFzaChoYXNoLCBrZXkpIHtcclxuICAgIHJldHVybiByZW1vdmVIYXNoKGhhc2gsIGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICByZW1vdmVIYXNoKGhhc2gsIGtleSkge1xyXG4gICAgcmV0dXJuIHJlbW92ZUhhc2goaGFzaCwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShrZXkpIHtcclxuICAgIHJldHVybiByZW1vdmUoa2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGJlZ2luTXV0YXRpb24oKSB7XHJcbiAgICByZXR1cm4gYmVnaW5NdXRhdGlvbih0aGlzKTtcclxuICB9XHJcblxyXG4gIGVuZE11dGF0aW9uKCkge1xyXG4gICAgcmV0dXJuIGVuZE11dGF0aW9uKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgbXV0YXRlKGYpIHtcclxuICAgIHJldHVybiBtdXRhdGUoZiwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBlbnRyaWVzKCkge1xyXG4gICAgcmV0dXJuIGVudHJpZXModGhpcyk7XHJcbiAgfVxyXG5cclxuICBrZXlzKCkge1xyXG4gICAgcmV0dXJuIGtleXModGhpcyk7XHJcbiAgfVxyXG5cclxuICB2YWx1ZXMoKSB7XHJcbiAgICByZXR1cm4gdmFsdWVzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZm9sZChmLCB6KSB7XHJcbiAgICByZXR1cm4gZm9sZChmLCB6LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGZvckVhY2goZikge1xyXG4gICAgcmV0dXJuIGZvckVhY2goZiwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiBlbnRyaWVzKHRoaXMpO1xyXG4gIH1cclxufVxyXG4iXX0=