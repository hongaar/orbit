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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFtdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlscy9oYW10LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxBQU1HOzs7Ozs7Ozs7QUFFSCxBQUFvQjtBQUNwQixpQkFBaUIsQUFBRyxLQUFJLEFBQU07V0FBQyxBQUFHLE9BQUksT0FBTyxBQUFNLFdBQUssQUFBVyxlQUFJLEFBQUcsSUFBQyxBQUFXLGdCQUFLLEFBQU0sU0FBRyxBQUFRLFdBQUcsT0FBTyxBQUFHLEFBQUMsQUFBQyxBQUFDOztBQUU1SCxBQUNnRjs7QUFDaEYsSUFBTSxBQUFJLE9BQUcsQUFBQyxBQUFDO0FBRWYsSUFBTSxBQUFXLGNBQUcsQUFBSSxLQUFDLEFBQUcsSUFBQyxBQUFDLEdBQUUsQUFBSSxBQUFDLEFBQUM7QUFFdEMsSUFBTSxBQUFJLE9BQUcsQUFBVyxjQUFHLEFBQUMsQUFBQztBQUU3QixJQUFNLEFBQWMsaUJBQUcsQUFBVyxjQUFHLEFBQUMsQUFBQztBQUV2QyxJQUFNLEFBQWMsaUJBQUcsQUFBVyxjQUFHLEFBQUMsQUFBQztBQUV2QyxBQUNnRjs7QUFDaEYsSUFBTSxBQUFPLFVBQUcsQUFBRSxBQUFDO0FBRW5CLGtCQUFrQixBQUFDLEdBQ2pCLEFBQU07V0FBQyxZQUNMLEFBQU07ZUFBQyxBQUFDLEFBQUMsQUFDWCxBQUFDLEFBQUMsQUFDSjtBQUFDOztBQUVELEFBS0U7Ozs7OztBQUNGLGNBQWMsQUFBRyxLQUNmO1FBQU0sQUFBSSxPQUFHLE9BQU8sQUFBRyxRQUFLLEFBQVcsY0FBRyxBQUFXLGNBQUcsQUFBTyxRQUFDLEFBQUcsQUFBQyxBQUFDLEFBQ3JFLEFBQUUsQUFBQztRQUFDLEFBQUksU0FBSyxBQUFRLEFBQUMsVUFBQyxBQUFNLE9BQUMsQUFBRyxBQUFDLEFBQ2xDLEFBQUUsQUFBQztRQUFDLEFBQUksU0FBSyxBQUFRLEFBQUMsVUFBQyxBQUFHLE9BQUksQUFBRSxBQUFDLEFBRWpDO1FBQUksQUFBQyxJQUFHLEFBQUMs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QUFDLEFBQ3BCLEFBQUM7QUFFRDtzQkFBTSxTQUFOLFlBQ0UsQUFBTTtlQUFDLEFBQU0sT0FBQyxBQUFJLEFBQUMsQUFBQyxBQUN0QixBQUFDO0FBRUQ7c0JBQUksT0FBSixVQUFLLEFBQUMsR0FBRSxBQUFDLEdBQ1AsQUFBTTtlQUFDLEFBQUksS0FBQyxBQUFDLEdBQUUsQUFBQyxHQUFFLEFBQUksQUFBQyxBQUFDLEFBQzFCLEFBQUM7QUFFRDtzQkFBTyxVQUFQLFVBQVEsQUFBQyxHQUNQLEFBQU07ZUFBQyxBQUFPLFFBQUMsQUFBQyxHQUFFLEFBQUksQUFBQyxBQUFDLEFBQzFCLEFBQUM7QUFLSDtXQTNIQSxBQTJIQSxBQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIENvZGUgYmFzZWQgb246IGh0dHBzOi8vZ2l0aHViLmNvbS9tYXR0Ymllcm5lci9oYW10XHJcbiAqIEF1dGhvcjogTWF0dCBCaWVybmVyXHJcbiAqIE1JVCBsaWNlbnNlXHJcbiAqXHJcbiAqIFdoaWNoIGlzIGJhc2VkIG9uOiBodHRwczovL2dpdGh1Yi5jb20vZXhjbGlweS9wZGF0YVxyXG4gKi9cclxuXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9XHJcblxyXG4vKiBDb25maWd1cmF0aW9uXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbmNvbnN0IFNJWkUgPSA1O1xyXG5cclxuY29uc3QgQlVDS0VUX1NJWkUgPSBNYXRoLnBvdygyLCBTSVpFKTtcclxuXHJcbmNvbnN0IE1BU0sgPSBCVUNLRVRfU0laRSAtIDE7XHJcblxyXG5jb25zdCBNQVhfSU5ERVhfTk9ERSA9IEJVQ0tFVF9TSVpFIC8gMjtcclxuXHJcbmNvbnN0IE1JTl9BUlJBWV9OT0RFID0gQlVDS0VUX1NJWkUgLyA0O1xyXG5cclxuLypcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuY29uc3Qgbm90aGluZyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gY29uc3RhbnQoeCkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4geDtcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICBHZXQgMzIgYml0IGhhc2ggb2Ygc3RyaW5nLlxyXG5cclxuICBCYXNlZCBvbjpcclxuICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzc2MTY0NjEvZ2VuZXJhdGUtYS1oYXNoLWZyb20tc3RyaW5nLWluLWphdmFzY3JpcHQtanF1ZXJ5XHJcbiovXHJcbmZ1bmN0aW9uIGhhc2goc3RyKSB7XHJcbiAgY29uc3QgdHlwZSA9IHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHN0cik7XHJcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKSByZXR1cm4gc3RyO1xyXG4gIGlmICh0eXBlICE9PSAnc3RyaW5nJykgc3RyICs9ICcnO1xyXG5cclxuICBsZXQgaCA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHN0ci5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgdmFyIGMgPSBzdHIuY2hhckNvZGVBdChpKTtcclxuICAgIGggPSAoaCA8PCA1KSAtIGggKyBjIHwgMDtcclxuICB9XHJcbiAgcmV0dXJuIGg7XHJcbn1cclxuXHJcbi8qIEJpdCBPcHNcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcbiAgSGFtbWluZyB3ZWlnaHQuXHJcblxyXG4gIFRha2VuIGZyb206IGh0dHA6Ly9qc3BlcmYuY29tL2hhbW1pbmctd2VpZ2h0XHJcbiovXHJcbmZ1bmN0aW9uIHBvcGNvdW50KHgpIHtcclxuICB4IC09IHggPj4gMSAmIDB4NTU1NTU1NTU7XHJcbiAgeCA9ICh4ICYgMHgzMzMzMzMzMykgKyAoeCA+PiAyICYgMHgzMzMzMzMzMyk7XHJcbiAgeCA9IHggKyAoeCA+PiA0KSAmIDB4MGYwZjBmMGY7XHJcbiAgeCArPSB4ID4+IDg7XHJcbiAgeCArPSB4ID4+IDE2O1xyXG4gIHJldHVybiB4ICYgMHg3ZjtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzaEZyYWdtZW50KHNoaWZ0LCBoKSB7XHJcbiAgcmV0dXJuIGggPj4+IHNoaWZ0ICYgTUFTSztcclxufVxyXG5cclxuZnVuY3Rpb24gdG9CaXRtYXAoeCkge1xyXG4gIHJldHVybiAxIDw8IHg7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZyb21CaXRtYXAoYml0bWFwLCBiaXQpIHtcclxuICByZXR1cm4gcG9wY291bnQoYml0bWFwICYgYml0IC0gMSk7XHJcbn1cclxuXHJcbi8qIEFycmF5IE9wc1xyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKipcclxuICBTZXQgYSB2YWx1ZSBpbiBhbiBhcnJheS5cclxuXHJcbiAgQHBhcmFtIG11dGF0ZSBTaG91bGQgdGhlIGlucHV0IGFycmF5IGJlIG11dGF0ZWQ/XHJcbiAgQHBhcmFtIGF0IEluZGV4IHRvIGNoYW5nZS5cclxuICBAcGFyYW0gdiBOZXcgdmFsdWVcclxuICBAcGFyYW0gYXJyIEFycmF5LlxyXG4qL1xyXG5mdW5jdGlvbiBhcnJheVVwZGF0ZShtdXRhdGUsIGF0LCB2LCBhcnIpIHtcclxuICB2YXIgb3V0ID0gYXJyO1xyXG4gIGlmICghbXV0YXRlKSB7XHJcbiAgICB2YXIgbGVuID0gYXJyLmxlbmd0aDtcclxuICAgIG91dCA9IG5ldyBBcnJheShsZW4pO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICBvdXRbaV0gPSBhcnJbaV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIG91dFthdF0gPSB2O1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gIFJlbW92ZSBhIHZhbHVlIGZyb20gYW4gYXJyYXkuXHJcblxyXG4gIEBwYXJhbSBtdXRhdGUgU2hvdWxkIHRoZSBpbnB1dCBhcnJheSBiZSBtdXRhdGVkP1xyXG4gIEBwYXJhbSBhdCBJbmRleCB0byByZW1vdmUuXHJcbiAgQHBhcmFtIGFyciBBcnJheS5cclxuKi9cclxuZnVuY3Rpb24gYXJyYXlTcGxpY2VPdXQobXV0YXRlLCBhdCwgYXJyKSB7XHJcbiAgdmFyIGxlbiA9IGFyci5sZW5ndGg7XHJcbiAgdmFyIGkgPSAwLFxyXG4gICAgICBnID0gMDtcclxuICB2YXIgb3V0ID0gYXJyO1xyXG4gIGlmIChtdXRhdGUpIHtcclxuICAgIGkgPSBnID0gYXQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIG91dCA9IG5ldyBBcnJheShsZW4gLSAxKTtcclxuICAgIHdoaWxlIChpIDwgYXQpIHtcclxuICAgICAgb3V0W2crK10gPSBhcnJbaSsrXTtcclxuICAgIH0rK2k7XHJcbiAgfVxyXG4gIHdoaWxlIChpIDwgbGVuKSB7XHJcbiAgICBvdXRbZysrXSA9IGFycltpKytdO1xyXG4gIH1yZXR1cm4gb3V0O1xyXG59XHJcblxyXG4vKipcclxuICBJbnNlcnQgYSB2YWx1ZSBpbnRvIGFuIGFycmF5LlxyXG5cclxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCB0aGUgaW5wdXQgYXJyYXkgYmUgbXV0YXRlZD9cclxuICBAcGFyYW0gYXQgSW5kZXggdG8gaW5zZXJ0IGF0LlxyXG4gIEBwYXJhbSB2IFZhbHVlIHRvIGluc2VydCxcclxuICBAcGFyYW0gYXJyIEFycmF5LlxyXG4qL1xyXG5mdW5jdGlvbiBhcnJheVNwbGljZUluKG11dGF0ZSwgYXQsIHYsIGFycikge1xyXG4gIHZhciBsZW4gPSBhcnIubGVuZ3RoO1xyXG4gIGlmIChtdXRhdGUpIHtcclxuICAgIHZhciBfaSA9IGxlbjtcclxuICAgIHdoaWxlIChfaSA+PSBhdCkge1xyXG4gICAgICBhcnJbX2ktLV0gPSBhcnJbX2ldO1xyXG4gICAgfWFyclthdF0gPSB2O1xyXG4gICAgcmV0dXJuIGFycjtcclxuICB9XHJcbiAgdmFyIGkgPSAwLFxyXG4gICAgICBnID0gMDtcclxuICB2YXIgb3V0ID0gbmV3IEFycmF5KGxlbiArIDEpO1xyXG4gIHdoaWxlIChpIDwgYXQpIHtcclxuICAgIG91dFtnKytdID0gYXJyW2krK107XHJcbiAgfW91dFthdF0gPSB2O1xyXG4gIHdoaWxlIChpIDwgbGVuKSB7XHJcbiAgICBvdXRbKytnXSA9IGFycltpKytdO1xyXG4gIH1yZXR1cm4gb3V0O1xyXG59XHJcblxyXG4vKiBOb2RlIFN0cnVjdHVyZXNcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuY29uc3QgTEVBRiA9IDE7XHJcbmNvbnN0IENPTExJU0lPTiA9IDI7XHJcbmNvbnN0IElOREVYID0gMztcclxuY29uc3QgQVJSQVkgPSA0O1xyXG5cclxuLyoqXHJcbiAgRW1wdHkgbm9kZS5cclxuKi9cclxuY29uc3QgZW1wdHkgPSB7XHJcbiAgX19oYW10X2lzRW1wdHk6IHRydWUsXHJcblxyXG4gIF9tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XHJcbiAgICB2YXIgdiA9IGYoKTtcclxuICAgIGlmICh2ID09PSBub3RoaW5nKSByZXR1cm4gZW1wdHk7XHJcbiAgICArK3NpemUudmFsdWU7XHJcbiAgICByZXR1cm4gTGVhZihlZGl0LCBoLCBrLCB2KTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5Tm9kZSh4KSB7XHJcbiAgcmV0dXJuIHggPT09IGVtcHR5IHx8IHggJiYgeC5fX2hhbXRfaXNFbXB0eTtcclxufVxyXG5cclxuLyoqXHJcbiAgTGVhZiBob2xkaW5nIGEgdmFsdWUuXHJcblxyXG4gIEBtZW1iZXIgZWRpdCBFZGl0IG9mIHRoZSBub2RlLlxyXG4gIEBtZW1iZXIgaGFzaCBIYXNoIG9mIGtleS5cclxuICBAbWVtYmVyIGtleSBLZXkuXHJcbiAgQG1lbWJlciB2YWx1ZSBWYWx1ZSBzdG9yZWQuXHJcbiovXHJcbmZ1bmN0aW9uIExlYWYoZWRpdCwgaGFzaCwga2V5LCB2YWx1ZSkge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBMRUFGLFxyXG4gICAgZWRpdDogZWRpdCxcclxuICAgIGhhc2g6IGhhc2gsXHJcbiAgICBrZXk6IGtleSxcclxuICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgIF9tb2RpZnk6IExlYWZfX21vZGlmeVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gIExlYWYgaG9sZGluZyBtdWx0aXBsZSB2YWx1ZXMgd2l0aCB0aGUgc2FtZSBoYXNoIGJ1dCBkaWZmZXJlbnQga2V5cy5cclxuXHJcbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXHJcbiAgQG1lbWJlciBoYXNoIEhhc2ggb2Yga2V5LlxyXG4gIEBtZW1iZXIgY2hpbGRyZW4gQXJyYXkgb2YgY29sbGlzaW9uIGNoaWxkcmVuIG5vZGUuXHJcbiovXHJcbmZ1bmN0aW9uIENvbGxpc2lvbihlZGl0LCBoYXNoLCBjaGlsZHJlbikge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBDT0xMSVNJT04sXHJcbiAgICBlZGl0OiBlZGl0LFxyXG4gICAgaGFzaDogaGFzaCxcclxuICAgIGNoaWxkcmVuOiBjaGlsZHJlbixcclxuICAgIF9tb2RpZnk6IENvbGxpc2lvbl9fbW9kaWZ5XHJcbiAgfTtcclxufVxyXG5cclxuLyoqXHJcbiAgSW50ZXJuYWwgbm9kZSB3aXRoIGEgc3BhcnNlIHNldCBvZiBjaGlsZHJlbi5cclxuXHJcbiAgVXNlcyBhIGJpdG1hcCBhbmQgYXJyYXkgdG8gcGFjayBjaGlsZHJlbi5cclxuXHJcbiAgQG1lbWJlciBlZGl0IEVkaXQgb2YgdGhlIG5vZGUuXHJcbiAgQG1lbWJlciBtYXNrIEJpdG1hcCB0aGF0IGVuY29kZSB0aGUgcG9zaXRpb25zIG9mIGNoaWxkcmVuIGluIHRoZSBhcnJheS5cclxuICBAbWVtYmVyIGNoaWxkcmVuIEFycmF5IG9mIGNoaWxkIG5vZGVzLlxyXG4qL1xyXG5mdW5jdGlvbiBJbmRleGVkTm9kZShlZGl0LCBtYXNrLCBjaGlsZHJlbikge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBJTkRFWCxcclxuICAgIGVkaXQ6IGVkaXQsXHJcbiAgICBtYXNrOiBtYXNrLFxyXG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgX21vZGlmeTogSW5kZXhlZE5vZGVfX21vZGlmeVxyXG4gIH07XHJcbn1cclxuXHJcbi8qKlxyXG4gIEludGVybmFsIG5vZGUgd2l0aCBtYW55IGNoaWxkcmVuLlxyXG5cclxuICBAbWVtYmVyIGVkaXQgRWRpdCBvZiB0aGUgbm9kZS5cclxuICBAbWVtYmVyIHNpemUgTnVtYmVyIG9mIGNoaWxkcmVuLlxyXG4gIEBtZW1iZXIgY2hpbGRyZW4gQXJyYXkgb2YgY2hpbGQgbm9kZXMuXHJcbiovXHJcbmZ1bmN0aW9uIEFycmF5Tm9kZShlZGl0LCBzaXplLCBjaGlsZHJlbikge1xyXG4gIHJldHVybiB7XHJcbiAgICB0eXBlOiBBUlJBWSxcclxuICAgIGVkaXQ6IGVkaXQsXHJcbiAgICBzaXplOiBzaXplLFxyXG4gICAgY2hpbGRyZW46IGNoaWxkcmVuLFxyXG4gICAgX21vZGlmeTogQXJyYXlOb2RlX19tb2RpZnlcclxuICB9O1xyXG59XHJcblxyXG4vKipcclxuICAgIElzIGBub2RlYCBhIGxlYWYgbm9kZT9cclxuKi9cclxuZnVuY3Rpb24gaXNMZWFmKG5vZGUpIHtcclxuICByZXR1cm4gbm9kZSA9PT0gZW1wdHkgfHwgbm9kZS50eXBlID09PSBMRUFGIHx8IG5vZGUudHlwZSA9PT0gQ09MTElTSU9OO1xyXG59XHJcblxyXG4vKiBJbnRlcm5hbCBub2RlIG9wZXJhdGlvbnMuXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG4gIEV4cGFuZCBhbiBpbmRleGVkIG5vZGUgaW50byBhbiBhcnJheSBub2RlLlxyXG5cclxuICBAcGFyYW0gZWRpdCBDdXJyZW50IGVkaXQuXHJcbiAgQHBhcmFtIGZyYWcgSW5kZXggb2YgYWRkZWQgY2hpbGQuXHJcbiAgQHBhcmFtIGNoaWxkIEFkZGVkIGNoaWxkLlxyXG4gIEBwYXJhbSBtYXNrIEluZGV4IG5vZGUgbWFzayBiZWZvcmUgY2hpbGQgYWRkZWQuXHJcbiAgQHBhcmFtIHN1Yk5vZGVzIEluZGV4IG5vZGUgY2hpbGRyZW4gYmVmb3JlIGNoaWxkIGFkZGVkLlxyXG4qL1xyXG5mdW5jdGlvbiBleHBhbmQoZWRpdCwgZnJhZywgY2hpbGQsIGJpdG1hcCwgc3ViTm9kZXMpIHtcclxuICB2YXIgYXJyID0gW107XHJcbiAgdmFyIGJpdCA9IGJpdG1hcDtcclxuICB2YXIgY291bnQgPSAwO1xyXG4gIGZvciAodmFyIGkgPSAwOyBiaXQ7ICsraSkge1xyXG4gICAgICBpZiAoYml0ICYgMSkgYXJyW2ldID0gc3ViTm9kZXNbY291bnQrK107XHJcbiAgICAgIGJpdCA+Pj49IDE7XHJcbiAgfVxyXG4gIGFycltmcmFnXSA9IGNoaWxkO1xyXG4gIHJldHVybiBBcnJheU5vZGUoZWRpdCwgY291bnQgKyAxLCBhcnIpO1xyXG59XHJcblxyXG4vKipcclxuICBDb2xsYXBzZSBhbiBhcnJheSBub2RlIGludG8gYSBpbmRleGVkIG5vZGUuXHJcblxyXG4gIEBwYXJhbSBlZGl0IEN1cnJlbnQgZWRpdC5cclxuICBAcGFyYW0gY291bnQgTnVtYmVyIG9mIGVsZW1lbnRzIGluIG5ldyBhcnJheS5cclxuICBAcGFyYW0gcmVtb3ZlZCBJbmRleCBvZiByZW1vdmVkIGVsZW1lbnQuXHJcbiAgQHBhcmFtIGVsZW1lbnRzIEFycmF5IG5vZGUgY2hpbGRyZW4gYmVmb3JlIHJlbW92ZS5cclxuKi9cclxuZnVuY3Rpb24gcGFjayhlZGl0LCBjb3VudCwgcmVtb3ZlZCwgZWxlbWVudHMpIHtcclxuICB2YXIgY2hpbGRyZW4gPSBuZXcgQXJyYXkoY291bnQgLSAxKTtcclxuICB2YXIgZyA9IDA7XHJcbiAgdmFyIGJpdG1hcCA9IDA7XHJcbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGVsZW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICBpZiAoaSAhPT0gcmVtb3ZlZCkge1xyXG4gICAgICB2YXIgZWxlbSA9IGVsZW1lbnRzW2ldO1xyXG4gICAgICBpZiAoZWxlbSAmJiAhaXNFbXB0eU5vZGUoZWxlbSkpIHtcclxuICAgICAgICBjaGlsZHJlbltnKytdID0gZWxlbTtcclxuICAgICAgICBiaXRtYXAgfD0gMSA8PCBpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBJbmRleGVkTm9kZShlZGl0LCBiaXRtYXAsIGNoaWxkcmVuKTtcclxufVxyXG5cclxuLyoqXHJcbiAgTWVyZ2UgdHdvIGxlYWYgbm9kZXMuXHJcblxyXG4gIEBwYXJhbSBzaGlmdCBDdXJyZW50IHNoaWZ0LlxyXG4gIEBwYXJhbSBoMSBOb2RlIDEgaGFzaC5cclxuICBAcGFyYW0gbjEgTm9kZSAxLlxyXG4gIEBwYXJhbSBoMiBOb2RlIDIgaGFzaC5cclxuICBAcGFyYW0gbjIgTm9kZSAyLlxyXG4qL1xyXG5mdW5jdGlvbiBtZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCwgaDEsIG4xLCBoMiwgbjIpIHtcclxuICBpZiAoaDEgPT09IGgyKSByZXR1cm4gQ29sbGlzaW9uKGVkaXQsIGgxLCBbbjIsIG4xXSk7XHJcblxyXG4gIHZhciBzdWJIMSA9IGhhc2hGcmFnbWVudChzaGlmdCwgaDEpO1xyXG4gIHZhciBzdWJIMiA9IGhhc2hGcmFnbWVudChzaGlmdCwgaDIpO1xyXG4gIHJldHVybiBJbmRleGVkTm9kZShlZGl0LCB0b0JpdG1hcChzdWJIMSkgfCB0b0JpdG1hcChzdWJIMiksIHN1YkgxID09PSBzdWJIMiA/IFttZXJnZUxlYXZlcyhlZGl0LCBzaGlmdCArIFNJWkUsIGgxLCBuMSwgaDIsIG4yKV0gOiBzdWJIMSA8IHN1YkgyID8gW24xLCBuMl0gOiBbbjIsIG4xXSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gIFVwZGF0ZSBhbiBlbnRyeSBpbiBhIGNvbGxpc2lvbiBsaXN0LlxyXG5cclxuICBAcGFyYW0gbXV0YXRlIFNob3VsZCBtdXRhdGlvbiBiZSB1c2VkP1xyXG4gIEBwYXJhbSBlZGl0IEN1cnJlbnQgZWRpdC5cclxuICBAcGFyYW0ga2V5RXEgS2V5IGNvbXBhcmUgZnVuY3Rpb24uXHJcbiAgQHBhcmFtIGhhc2ggSGFzaCBvZiBjb2xsaXNpb24uXHJcbiAgQHBhcmFtIGxpc3QgQ29sbGlzaW9uIGxpc3QuXHJcbiAgQHBhcmFtIGYgVXBkYXRlIGZ1bmN0aW9uLlxyXG4gIEBwYXJhbSBrIEtleSB0byB1cGRhdGUuXHJcbiAgQHBhcmFtIHNpemUgU2l6ZSByZWYuXHJcbiovXHJcbmZ1bmN0aW9uIHVwZGF0ZUNvbGxpc2lvbkxpc3QobXV0YXRlLCBlZGl0LCBrZXlFcSwgaCwgbGlzdCwgZiwgaywgc2l6ZSkge1xyXG4gIHZhciBsZW4gPSBsaXN0Lmxlbmd0aDtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICB2YXIgY2hpbGQgPSBsaXN0W2ldO1xyXG4gICAgaWYgKGtleUVxKGssIGNoaWxkLmtleSkpIHtcclxuICAgICAgdmFyIHZhbHVlID0gY2hpbGQudmFsdWU7XHJcbiAgICAgIHZhciBfbmV3VmFsdWUgPSBmKHZhbHVlKTtcclxuICAgICAgaWYgKF9uZXdWYWx1ZSA9PT0gdmFsdWUpIHJldHVybiBsaXN0O1xyXG5cclxuICAgICAgaWYgKF9uZXdWYWx1ZSA9PT0gbm90aGluZykge1xyXG4gICAgICAgIC0tc2l6ZS52YWx1ZTtcclxuICAgICAgICByZXR1cm4gYXJyYXlTcGxpY2VPdXQobXV0YXRlLCBpLCBsaXN0KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gYXJyYXlVcGRhdGUobXV0YXRlLCBpLCBMZWFmKGVkaXQsIGgsIGssIF9uZXdWYWx1ZSksIGxpc3QpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIG5ld1ZhbHVlID0gZigpO1xyXG4gIGlmIChuZXdWYWx1ZSA9PT0gbm90aGluZykgcmV0dXJuIGxpc3Q7XHJcbiAgKytzaXplLnZhbHVlO1xyXG4gIHJldHVybiBhcnJheVVwZGF0ZShtdXRhdGUsIGxlbiwgTGVhZihlZGl0LCBoLCBrLCBuZXdWYWx1ZSksIGxpc3QpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjYW5FZGl0Tm9kZShlZGl0LCBub2RlKSB7XHJcbiAgcmV0dXJuIGVkaXQgPT09IG5vZGUuZWRpdDtcclxufVxyXG5cclxuLyogRWRpdGluZ1xyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5mdW5jdGlvbiBMZWFmX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XHJcbiAgaWYgKGtleUVxKGssIHRoaXMua2V5KSkge1xyXG4gICAgdmFyIF92ID0gZih0aGlzLnZhbHVlKTtcclxuICAgIGlmIChfdiA9PT0gdGhpcy52YWx1ZSkgcmV0dXJuIHRoaXM7ZWxzZSBpZiAoX3YgPT09IG5vdGhpbmcpIHtcclxuICAgICAgLS1zaXplLnZhbHVlO1xyXG4gICAgICByZXR1cm4gZW1wdHk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2FuRWRpdE5vZGUoZWRpdCwgdGhpcykpIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IF92O1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHJldHVybiBMZWFmKGVkaXQsIGgsIGssIF92KTtcclxuICB9XHJcbiAgdmFyIHYgPSBmKCk7XHJcbiAgaWYgKHYgPT09IG5vdGhpbmcpIHJldHVybiB0aGlzO1xyXG4gICsrc2l6ZS52YWx1ZTtcclxuICByZXR1cm4gbWVyZ2VMZWF2ZXMoZWRpdCwgc2hpZnQsIHRoaXMuaGFzaCwgdGhpcywgaCwgTGVhZihlZGl0LCBoLCBrLCB2KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIENvbGxpc2lvbl9fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCwgZiwgaCwgaywgc2l6ZSkge1xyXG4gIGlmIChoID09PSB0aGlzLmhhc2gpIHtcclxuICAgIHZhciBjYW5FZGl0ID0gY2FuRWRpdE5vZGUoZWRpdCwgdGhpcyk7XHJcbiAgICB2YXIgbGlzdCA9IHVwZGF0ZUNvbGxpc2lvbkxpc3QoY2FuRWRpdCwgZWRpdCwga2V5RXEsIHRoaXMuaGFzaCwgdGhpcy5jaGlsZHJlbiwgZiwgaywgc2l6ZSk7XHJcbiAgICBpZiAobGlzdCA9PT0gdGhpcy5jaGlsZHJlbikgcmV0dXJuIHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIGxpc3QubGVuZ3RoID4gMSA/IENvbGxpc2lvbihlZGl0LCB0aGlzLmhhc2gsIGxpc3QpIDogbGlzdFswXTsgLy8gY29sbGFwc2Ugc2luZ2xlIGVsZW1lbnQgY29sbGlzaW9uIGxpc3RcclxuICB9XHJcbiAgdmFyIHYgPSBmKCk7XHJcbiAgaWYgKHYgPT09IG5vdGhpbmcpIHJldHVybiB0aGlzO1xyXG4gICsrc2l6ZS52YWx1ZTtcclxuICByZXR1cm4gbWVyZ2VMZWF2ZXMoZWRpdCwgc2hpZnQsIHRoaXMuaGFzaCwgdGhpcywgaCwgTGVhZihlZGl0LCBoLCBrLCB2KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIEluZGV4ZWROb2RlX19tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0LCBmLCBoLCBrLCBzaXplKSB7XHJcbiAgdmFyIG1hc2sgPSB0aGlzLm1hc2s7XHJcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICB2YXIgZnJhZyA9IGhhc2hGcmFnbWVudChzaGlmdCwgaCk7XHJcbiAgdmFyIGJpdCA9IHRvQml0bWFwKGZyYWcpO1xyXG4gIHZhciBpbmR4ID0gZnJvbUJpdG1hcChtYXNrLCBiaXQpO1xyXG4gIHZhciBleGlzdHMgPSBtYXNrICYgYml0O1xyXG4gIHZhciBjdXJyZW50ID0gZXhpc3RzID8gY2hpbGRyZW5baW5keF0gOiBlbXB0eTtcclxuICB2YXIgY2hpbGQgPSBjdXJyZW50Ll9tb2RpZnkoZWRpdCwga2V5RXEsIHNoaWZ0ICsgU0laRSwgZiwgaCwgaywgc2l6ZSk7XHJcblxyXG4gIGlmIChjdXJyZW50ID09PSBjaGlsZCkgcmV0dXJuIHRoaXM7XHJcblxyXG4gIHZhciBjYW5FZGl0ID0gY2FuRWRpdE5vZGUoZWRpdCwgdGhpcyk7XHJcbiAgdmFyIGJpdG1hcCA9IG1hc2s7XHJcbiAgdmFyIG5ld0NoaWxkcmVuID0gdW5kZWZpbmVkO1xyXG4gIGlmIChleGlzdHMgJiYgaXNFbXB0eU5vZGUoY2hpbGQpKSB7XHJcbiAgICAvLyByZW1vdmVcclxuICAgIGJpdG1hcCAmPSB+Yml0O1xyXG4gICAgaWYgKCFiaXRtYXApIHJldHVybiBlbXB0eTtcclxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPD0gMiAmJiBpc0xlYWYoY2hpbGRyZW5baW5keCBeIDFdKSkgcmV0dXJuIGNoaWxkcmVuW2luZHggXiAxXTsgLy8gY29sbGFwc2VcclxuXHJcbiAgICBuZXdDaGlsZHJlbiA9IGFycmF5U3BsaWNlT3V0KGNhbkVkaXQsIGluZHgsIGNoaWxkcmVuKTtcclxuICB9IGVsc2UgaWYgKCFleGlzdHMgJiYgIWlzRW1wdHlOb2RlKGNoaWxkKSkge1xyXG4gICAgLy8gYWRkXHJcbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID49IE1BWF9JTkRFWF9OT0RFKSByZXR1cm4gZXhwYW5kKGVkaXQsIGZyYWcsIGNoaWxkLCBtYXNrLCBjaGlsZHJlbik7XHJcblxyXG4gICAgYml0bWFwIHw9IGJpdDtcclxuICAgIG5ld0NoaWxkcmVuID0gYXJyYXlTcGxpY2VJbihjYW5FZGl0LCBpbmR4LCBjaGlsZCwgY2hpbGRyZW4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBtb2RpZnlcclxuICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgaW5keCwgY2hpbGQsIGNoaWxkcmVuKTtcclxuICB9XHJcblxyXG4gIGlmIChjYW5FZGl0KSB7XHJcbiAgICB0aGlzLm1hc2sgPSBiaXRtYXA7XHJcbiAgICB0aGlzLmNoaWxkcmVuID0gbmV3Q2hpbGRyZW47XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbiAgcmV0dXJuIEluZGV4ZWROb2RlKGVkaXQsIGJpdG1hcCwgbmV3Q2hpbGRyZW4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBBcnJheU5vZGVfX21vZGlmeShlZGl0LCBrZXlFcSwgc2hpZnQsIGYsIGgsIGssIHNpemUpIHtcclxuICB2YXIgY291bnQgPSB0aGlzLnNpemU7XHJcbiAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbjtcclxuICB2YXIgZnJhZyA9IGhhc2hGcmFnbWVudChzaGlmdCwgaCk7XHJcbiAgdmFyIGNoaWxkID0gY2hpbGRyZW5bZnJhZ107XHJcbiAgdmFyIG5ld0NoaWxkID0gKGNoaWxkIHx8IGVtcHR5KS5fbW9kaWZ5KGVkaXQsIGtleUVxLCBzaGlmdCArIFNJWkUsIGYsIGgsIGssIHNpemUpO1xyXG5cclxuICBpZiAoY2hpbGQgPT09IG5ld0NoaWxkKSByZXR1cm4gdGhpcztcclxuXHJcbiAgdmFyIGNhbkVkaXQgPSBjYW5FZGl0Tm9kZShlZGl0LCB0aGlzKTtcclxuICB2YXIgbmV3Q2hpbGRyZW4gPSB1bmRlZmluZWQ7XHJcbiAgaWYgKGlzRW1wdHlOb2RlKGNoaWxkKSAmJiAhaXNFbXB0eU5vZGUobmV3Q2hpbGQpKSB7XHJcbiAgICAvLyBhZGRcclxuICAgICsrY291bnQ7XHJcbiAgICBuZXdDaGlsZHJlbiA9IGFycmF5VXBkYXRlKGNhbkVkaXQsIGZyYWcsIG5ld0NoaWxkLCBjaGlsZHJlbik7XHJcbiAgfSBlbHNlIGlmICghaXNFbXB0eU5vZGUoY2hpbGQpICYmIGlzRW1wdHlOb2RlKG5ld0NoaWxkKSkge1xyXG4gICAgLy8gcmVtb3ZlXHJcbiAgICAtLWNvdW50O1xyXG4gICAgaWYgKGNvdW50IDw9IE1JTl9BUlJBWV9OT0RFKSByZXR1cm4gcGFjayhlZGl0LCBjb3VudCwgZnJhZywgY2hpbGRyZW4pO1xyXG4gICAgbmV3Q2hpbGRyZW4gPSBhcnJheVVwZGF0ZShjYW5FZGl0LCBmcmFnLCBlbXB0eSwgY2hpbGRyZW4pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBtb2RpZnlcclxuICAgIG5ld0NoaWxkcmVuID0gYXJyYXlVcGRhdGUoY2FuRWRpdCwgZnJhZywgbmV3Q2hpbGQsIGNoaWxkcmVuKTtcclxuICB9XHJcblxyXG4gIGlmIChjYW5FZGl0KSB7XHJcbiAgICB0aGlzLnNpemUgPSBjb3VudDtcclxuICAgIHRoaXMuY2hpbGRyZW4gPSBuZXdDaGlsZHJlbjtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICByZXR1cm4gQXJyYXlOb2RlKGVkaXQsIGNvdW50LCBuZXdDaGlsZHJlbik7XHJcbn07XHJcblxyXG4vKiBRdWVyaWVzXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG4gICAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgYSBjdXN0b20gYGhhc2hgLlxyXG5cclxuICAgIFJldHVybnMgdGhlIHZhbHVlIG9yIGBhbHRgIGlmIG5vbmUuXHJcbiovXHJcbmZ1bmN0aW9uIHRyeUdldEhhc2goYWx0LCBoYXNoLCBrZXksIG1hcCkge1xyXG4gIHZhciBub2RlID0gbWFwLl9yb290O1xyXG4gIHZhciBzaGlmdCA9IDA7XHJcbiAgdmFyIGtleUVxID0gbWFwLl9jb25maWcua2V5RXE7XHJcbiAgd2hpbGUgKHRydWUpIHtcclxuICAgIHN3aXRjaCAobm9kZS50eXBlKSB7XHJcbiAgICAgIGNhc2UgTEVBRjpcclxuICAgICAgICB7XHJcbiAgICAgICAgICByZXR1cm4ga2V5RXEoa2V5LCBub2RlLmtleSkgPyBub2RlLnZhbHVlIDogYWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgY2FzZSBDT0xMSVNJT046XHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWYgKGhhc2ggPT09IG5vZGUuaGFzaCkge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2hpbGRyZW4ubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgICBpZiAoa2V5RXEoa2V5LCBjaGlsZC5rZXkpKSByZXR1cm4gY2hpbGQudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhbHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICBjYXNlIElOREVYOlxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhciBmcmFnID0gaGFzaEZyYWdtZW50KHNoaWZ0LCBoYXNoKTtcclxuICAgICAgICAgIHZhciBiaXQgPSB0b0JpdG1hcChmcmFnKTtcclxuICAgICAgICAgIGlmIChub2RlLm1hc2sgJiBiaXQpIHtcclxuICAgICAgICAgICAgbm9kZSA9IG5vZGUuY2hpbGRyZW5bZnJvbUJpdG1hcChub2RlLm1hc2ssIGJpdCldO1xyXG4gICAgICAgICAgICBzaGlmdCArPSBTSVpFO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhbHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICBjYXNlIEFSUkFZOlxyXG4gICAgICAgIHtcclxuICAgICAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuW2hhc2hGcmFnbWVudChzaGlmdCwgaGFzaCldO1xyXG4gICAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgICAgc2hpZnQgKz0gU0laRTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gYWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gYWx0O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cclxuXHJcbiAgQHNlZSBgdHJ5R2V0SGFzaGBcclxuKi9cclxuZnVuY3Rpb24gdHJ5R2V0KGFsdCwga2V5LCBtYXApIHtcclxuICByZXR1cm4gdHJ5R2V0SGFzaChhbHQsIG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xyXG59XHJcblxyXG4vKipcclxuICBMb29rdXAgdGhlIHZhbHVlIGZvciBga2V5YCBpbiBgbWFwYCB1c2luZyBhIGN1c3RvbSBgaGFzaGAuXHJcblxyXG4gIFJldHVybnMgdGhlIHZhbHVlIG9yIGB1bmRlZmluZWRgIGlmIG5vbmUuXHJcbiovXHJcbmZ1bmN0aW9uIGdldEhhc2goaGFzaCwga2V5LCBtYXApIHtcclxuICByZXR1cm4gdHJ5R2V0SGFzaCh1bmRlZmluZWQsIGhhc2gsIGtleSwgbWFwKTtcclxufVxyXG5cclxuLyoqXHJcbiAgTG9va3VwIHRoZSB2YWx1ZSBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cclxuXHJcbiAgQHNlZSBgZ2V0YFxyXG4qL1xyXG5mdW5jdGlvbiBnZXQoa2V5LCBtYXApIHtcclxuICByZXR1cm4gdHJ5R2V0SGFzaCh1bmRlZmluZWQsIG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xyXG59XHJcblxyXG4vKipcclxuICAgIERvZXMgYW4gZW50cnkgZXhpc3QgZm9yIGBrZXlgIGluIGBtYXBgPyBVc2VzIGN1c3RvbSBgaGFzaGAuXHJcbiovXHJcbmZ1bmN0aW9uIGhhc0hhc2goaGFzaCwga2V5LCBtYXApIHtcclxuICByZXR1cm4gdHJ5R2V0SGFzaChub3RoaW5nLCBoYXNoLCBrZXksIG1hcCkgIT09IG5vdGhpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gIERvZXMgYW4gZW50cnkgZXhpc3QgZm9yIGBrZXlgIGluIGBtYXBgPyBVc2VzIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXHJcbiovXHJcbmZ1bmN0aW9uIGhhcyhrZXksIG1hcCkge1xyXG4gIHJldHVybiBoYXNIYXNoKG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZLZXlDb21wYXJlKHgsIHkpIHtcclxuICByZXR1cm4geCA9PT0geTtcclxufVxyXG5cclxuLyoqXHJcbiAgRG9lcyBgbWFwYCBjb250YWluIGFueSBlbGVtZW50cz9cclxuKi9cclxuZnVuY3Rpb24gaXNFbXB0eShtYXApIHtcclxuICByZXR1cm4gbWFwICYmICEhaXNFbXB0eU5vZGUobWFwLl9yb290KTtcclxufVxyXG5cclxuLyogVXBkYXRlc1xyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKipcclxuICAgIEFsdGVyIHRoZSB2YWx1ZSBzdG9yZWQgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGZ1bmN0aW9uIGBmYCB1c2luZ1xyXG4gICAgY3VzdG9tIGhhc2guXHJcblxyXG4gICAgYGZgIGlzIGludm9rZWQgd2l0aCB0aGUgY3VycmVudCB2YWx1ZSBmb3IgYGtgIGlmIGl0IGV4aXN0cyxcclxuICAgIG9yIG5vIGFyZ3VtZW50cyBpZiBubyBzdWNoIHZhbHVlIGV4aXN0cy4gYG1vZGlmeWAgd2lsbCBhbHdheXMgZWl0aGVyXHJcbiAgICB1cGRhdGUgb3IgaW5zZXJ0IGEgdmFsdWUgaW50byB0aGUgbWFwLlxyXG5cclxuICAgIFJldHVybnMgYSBtYXAgd2l0aCB0aGUgbW9kaWZpZWQgdmFsdWUuIERvZXMgbm90IGFsdGVyIGBtYXBgLlxyXG4qL1xyXG5mdW5jdGlvbiBtb2RpZnlIYXNoKGYsIGhhc2gsIGtleSwgbWFwKSB7XHJcbiAgdmFyIHNpemUgPSB7IHZhbHVlOiBtYXAuX3NpemUgfTtcclxuICB2YXIgbmV3Um9vdCA9IG1hcC5fcm9vdC5fbW9kaWZ5KG1hcC5fZWRpdGFibGUgPyBtYXAuX2VkaXQgOiBOYU4sIG1hcC5fY29uZmlnLmtleUVxLCAwLCBmLCBoYXNoLCBrZXksIHNpemUpO1xyXG4gIHJldHVybiBtYXAuc2V0VHJlZShuZXdSb290LCBzaXplLnZhbHVlKTtcclxufVxyXG5cclxuLyoqXHJcbiAgQWx0ZXIgdGhlIHZhbHVlIHN0b3JlZCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgZnVuY3Rpb24gYGZgIHVzaW5nXHJcbiAgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cclxuXHJcbiAgQHNlZSBgbW9kaWZ5SGFzaGBcclxuKi9cclxuZnVuY3Rpb24gbW9kaWZ5KGYsIGtleSwgbWFwKSB7XHJcbiAgcmV0dXJuIG1vZGlmeUhhc2goZiwgbWFwLl9jb25maWcuaGFzaChrZXkpLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gIFN0b3JlIGB2YWx1ZWAgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGN1c3RvbSBgaGFzaGAuXHJcblxyXG4gIFJldHVybnMgYSBtYXAgd2l0aCB0aGUgbW9kaWZpZWQgdmFsdWUuIERvZXMgbm90IGFsdGVyIGBtYXBgLlxyXG4qL1xyXG5mdW5jdGlvbiBzZXRIYXNoKGhhc2gsIGtleSwgdmFsdWUsIG1hcCkge1xyXG4gIHJldHVybiBtb2RpZnlIYXNoKGNvbnN0YW50KHZhbHVlKSwgaGFzaCwga2V5LCBtYXApO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAgU3RvcmUgYHZhbHVlYCBmb3IgYGtleWAgaW4gYG1hcGAgdXNpbmcgaW50ZXJuYWwgaGFzaCBmdW5jdGlvbi5cclxuXHJcbiAgQHNlZSBgc2V0SGFzaGBcclxuKi9cclxuZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUsIG1hcCkge1xyXG4gIHJldHVybiBzZXRIYXNoKG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCB2YWx1ZSwgbWFwKTtcclxufVxyXG5cclxuLyoqXHJcbiAgUmVtb3ZlIHRoZSBlbnRyeSBmb3IgYGtleWAgaW4gYG1hcGAuXHJcblxyXG4gIFJldHVybnMgYSBtYXAgd2l0aCB0aGUgdmFsdWUgcmVtb3ZlZC4gRG9lcyBub3QgYWx0ZXIgYG1hcGAuXHJcbiovXHJcbmNvbnN0IGRlbCA9IGNvbnN0YW50KG5vdGhpbmcpO1xyXG5mdW5jdGlvbiByZW1vdmVIYXNoKGhhc2gsIGtleSwgbWFwKSB7XHJcbiAgcmV0dXJuIG1vZGlmeUhhc2goZGVsLCBoYXNoLCBrZXksIG1hcCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gIFJlbW92ZSB0aGUgZW50cnkgZm9yIGBrZXlgIGluIGBtYXBgIHVzaW5nIGludGVybmFsIGhhc2ggZnVuY3Rpb24uXHJcblxyXG4gIEBzZWUgYHJlbW92ZUhhc2hgXHJcbiovXHJcbmZ1bmN0aW9uIHJlbW92ZShrZXksIG1hcCkge1xyXG4gIHJldHVybiByZW1vdmVIYXNoKG1hcC5fY29uZmlnLmhhc2goa2V5KSwga2V5LCBtYXApO1xyXG59XHJcblxyXG4vKiBNdXRhdGlvblxyXG4gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4vKipcclxuICBNYXJrIGBtYXBgIGFzIG11dGFibGUuXHJcbiAqL1xyXG5mdW5jdGlvbiBiZWdpbk11dGF0aW9uKG1hcCkge1xyXG4gIHJldHVybiBuZXcgSEFNVE1hcChtYXAuX2VkaXRhYmxlICsgMSwgbWFwLl9lZGl0ICsgMSwgbWFwLl9jb25maWcsIG1hcC5fcm9vdCwgbWFwLl9zaXplKTtcclxufVxyXG5cclxuLyoqXHJcbiAgTWFyayBgbWFwYCBhcyBpbW11dGFibGUuXHJcbiAqL1xyXG5mdW5jdGlvbiBlbmRNdXRhdGlvbihtYXApIHtcclxuICBtYXAuX2VkaXRhYmxlID0gbWFwLl9lZGl0YWJsZSAmJiBtYXAuX2VkaXRhYmxlIC0gMTtcclxuICByZXR1cm4gbWFwO1xyXG59XHJcblxyXG4vKipcclxuICBNdXRhdGUgYG1hcGAgd2l0aGluIHRoZSBjb250ZXh0IG9mIGBmYC5cclxuICBAcGFyYW0gZlxyXG4gIEBwYXJhbSBtYXAgSEFNVFxyXG4qL1xyXG5mdW5jdGlvbiBtdXRhdGUoZiwgbWFwKSB7XHJcbiAgdmFyIHRyYW5zaWVudCA9IGJlZ2luTXV0YXRpb24obWFwKTtcclxuICBmKHRyYW5zaWVudCk7XHJcbiAgcmV0dXJuIGVuZE11dGF0aW9uKHRyYW5zaWVudCk7XHJcbn07XHJcblxyXG4vKiBUcmF2ZXJzYWxcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuLyoqXHJcbiAgQXBwbHkgYSBjb250aW51YXRpb24uXHJcbiovXHJcbmZ1bmN0aW9uIGFwcGsoaykge1xyXG4gIHJldHVybiBrICYmIGxhenlWaXNpdENoaWxkcmVuKGtbMF0sIGtbMV0sIGtbMl0sIGtbM10sIGtbNF0pO1xyXG59XHJcblxyXG4vKipcclxuICBSZWN1cnNpdmVseSB2aXNpdCBhbGwgdmFsdWVzIHN0b3JlZCBpbiBhbiBhcnJheSBvZiBub2RlcyBsYXppbHkuXHJcbiovXHJcbmZ1bmN0aW9uIGxhenlWaXNpdENoaWxkcmVuKGxlbiwgY2hpbGRyZW4sIGksIGYsIGspIHtcclxuICB3aGlsZSAoaSA8IGxlbikge1xyXG4gICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baSsrXTtcclxuICAgIGlmIChjaGlsZCAmJiAhaXNFbXB0eU5vZGUoY2hpbGQpKSByZXR1cm4gbGF6eVZpc2l0KGNoaWxkLCBmLCBbbGVuLCBjaGlsZHJlbiwgaSwgZiwga10pO1xyXG4gIH1cclxuICByZXR1cm4gYXBwayhrKTtcclxufVxyXG5cclxuLyoqXHJcbiAgUmVjdXJzaXZlbHkgdmlzaXQgYWxsIHZhbHVlcyBzdG9yZWQgaW4gYG5vZGVgIGxhemlseS5cclxuKi9cclxuZnVuY3Rpb24gbGF6eVZpc2l0KG5vZGUsIGYsIGs/KSB7XHJcbiAgc3dpdGNoIChub2RlLnR5cGUpIHtcclxuICAgIGNhc2UgTEVBRjpcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB2YWx1ZTogZihub2RlKSxcclxuICAgICAgICByZXN0OiBrXHJcbiAgICAgIH07XHJcblxyXG4gICAgY2FzZSBDT0xMSVNJT046XHJcbiAgICBjYXNlIEFSUkFZOlxyXG4gICAgY2FzZSBJTkRFWDpcclxuICAgICAgdmFyIGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbjtcclxuICAgICAgcmV0dXJuIGxhenlWaXNpdENoaWxkcmVuKGNoaWxkcmVuLmxlbmd0aCwgY2hpbGRyZW4sIDAsIGYsIGspO1xyXG5cclxuICAgIGRlZmF1bHQ6XHJcbiAgICAgIHJldHVybiBhcHBrKGspO1xyXG4gIH1cclxufVxyXG5cclxuY29uc3QgRE9ORSA9IHtcclxuICBkb25lOiB0cnVlXHJcbn07XHJcblxyXG4vKipcclxuICBMYXppbHkgdmlzaXQgZWFjaCB2YWx1ZSBpbiBtYXAgd2l0aCBmdW5jdGlvbiBgZmAuXHJcbiovXHJcbmZ1bmN0aW9uIHZpc2l0KG1hcCwgZikge1xyXG4gIHJldHVybiBuZXcgSEFNVE1hcEl0ZXJhdG9yKGxhenlWaXNpdChtYXAuX3Jvb3QsIGYpKTtcclxufVxyXG5cclxuLyoqXHJcbiAgR2V0IGEgSmF2YXNjc3JpcHQgaXRlcmF0b3Igb2YgYG1hcGAuXHJcblxyXG4gIEl0ZXJhdGVzIG92ZXIgYFtrZXksIHZhbHVlXWAgYXJyYXlzLlxyXG4qL1xyXG5mdW5jdGlvbiBidWlsZFBhaXJzKHgpIHtcclxuICByZXR1cm4gW3gua2V5LCB4LnZhbHVlXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZW50cmllcyhtYXApIHtcclxuICByZXR1cm4gdmlzaXQobWFwLCBidWlsZFBhaXJzKTtcclxufTtcclxuXHJcbi8qKlxyXG4gIEdldCBhcnJheSBvZiBhbGwga2V5cyBpbiBgbWFwYC5cclxuXHJcbiAgT3JkZXIgaXMgbm90IGd1YXJhbnRlZWQuXHJcbiovXHJcbmZ1bmN0aW9uIGJ1aWxkS2V5cyh4KSB7XHJcbiAgcmV0dXJuIHgua2V5O1xyXG59XHJcbmZ1bmN0aW9uIGtleXMobWFwKSB7XHJcbiAgcmV0dXJuIHZpc2l0KG1hcCwgYnVpbGRLZXlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAgR2V0IGFycmF5IG9mIGFsbCB2YWx1ZXMgaW4gYG1hcGAuXHJcblxyXG4gIE9yZGVyIGlzIG5vdCBndWFyYW50ZWVkLCBkdXBsaWNhdGVzIGFyZSBwcmVzZXJ2ZWQuXHJcbiovXHJcbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKHgpIHtcclxuICByZXR1cm4geC52YWx1ZTtcclxufVxyXG5mdW5jdGlvbiB2YWx1ZXMobWFwKSB7XHJcbiAgcmV0dXJuIHZpc2l0KG1hcCwgYnVpbGRWYWx1ZXMpO1xyXG59XHJcblxyXG4vKiBGb2xkXHJcbiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbi8qKlxyXG4gIFZpc2l0IGV2ZXJ5IGVudHJ5IGluIHRoZSBtYXAsIGFnZ3JlZ2F0aW5nIGRhdGEuXHJcblxyXG4gIE9yZGVyIG9mIG5vZGVzIGlzIG5vdCBndWFyYW50ZWVkLlxyXG5cclxuICBAcGFyYW0gZiBGdW5jdGlvbiBtYXBwaW5nIGFjY3VtdWxhdGVkIHZhbHVlLCB2YWx1ZSwgYW5kIGtleSB0byBuZXcgdmFsdWUuXHJcbiAgQHBhcmFtIHogU3RhcnRpbmcgdmFsdWUuXHJcbiAgQHBhcmFtIG0gSEFNVFxyXG4qL1xyXG5mdW5jdGlvbiBmb2xkKGYsIHosIG0pIHtcclxuICB2YXIgcm9vdCA9IG0uX3Jvb3Q7XHJcbiAgaWYgKHJvb3QudHlwZSA9PT0gTEVBRikgcmV0dXJuIGYoeiwgcm9vdC52YWx1ZSwgcm9vdC5rZXkpO1xyXG5cclxuICB2YXIgdG9WaXNpdCA9IFtyb290LmNoaWxkcmVuXTtcclxuICB2YXIgY2hpbGRyZW4gPSB1bmRlZmluZWQ7XHJcbiAgd2hpbGUgKGNoaWxkcmVuID0gdG9WaXNpdC5wb3AoKSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjspIHtcclxuICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5baSsrXTtcclxuICAgICAgaWYgKGNoaWxkICYmIGNoaWxkLnR5cGUpIHtcclxuICAgICAgICBpZiAoY2hpbGQudHlwZSA9PT0gTEVBRikgeiA9IGYoeiwgY2hpbGQudmFsdWUsIGNoaWxkLmtleSk7ZWxzZSB0b1Zpc2l0LnB1c2goY2hpbGQuY2hpbGRyZW4pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB6O1xyXG59XHJcblxyXG4vKipcclxuICBWaXNpdCBldmVyeSBlbnRyeSBpbiB0aGUgbWFwLCBhZ2dyZWdhdGluZyBkYXRhLlxyXG5cclxuICBPcmRlciBvZiBub2RlcyBpcyBub3QgZ3VhcmFudGVlZC5cclxuXHJcbiAgQHBhcmFtIGYgRnVuY3Rpb24gaW52b2tlZCB3aXRoIHZhbHVlIGFuZCBrZXlcclxuICBAcGFyYW0gbWFwIEhBTVRcclxuKi9cclxuZnVuY3Rpb24gZm9yRWFjaChmLCBtYXApIHtcclxuICByZXR1cm4gZm9sZChmdW5jdGlvbiAoXywgdmFsdWUsIGtleSkge1xyXG4gICAgcmV0dXJuIGYodmFsdWUsIGtleSwgbWFwKTtcclxuICB9LCBudWxsLCBtYXApO1xyXG59XHJcblxyXG4vKiBFeHBvcnRcclxuICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuZXhwb3J0IGNsYXNzIEhBTVRNYXBJdGVyYXRvcjxUPiBpbXBsZW1lbnRzIEl0ZXJhYmxlSXRlcmF0b3I8VD4ge1xyXG4gIHByaXZhdGUgdjtcclxuXHJcbiAgY29uc3RydWN0b3Iodikge1xyXG4gICAgdGhpcy52ID0gdjtcclxuICB9XHJcblxyXG4gIG5leHQoKSB7XHJcbiAgICBpZiAoIXRoaXMudikgcmV0dXJuIERPTkU7XHJcbiAgICB2YXIgdjAgPSB0aGlzLnY7XHJcbiAgICB0aGlzLnYgPSBhcHBrKHYwLnJlc3QpO1xyXG4gICAgcmV0dXJuIHYwO1xyXG4gIH1cclxuXHJcbiAgW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBIQU1UTWFwQ29uZmlnIHtcclxuICBrZXlFcT86IEZ1bmN0aW9uLCAvLyBUT0RPXHJcbiAgaGFzaD86IEZ1bmN0aW9uIC8vIFRPRE9cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSEFNVE1hcCB7XHJcbiAgcHJpdmF0ZSBfbWFwO1xyXG4gIHByaXZhdGUgX2VkaXRhYmxlO1xyXG4gIHByaXZhdGUgX2VkaXQ7XHJcbiAgcHJpdmF0ZSBfY29uZmlnOiBIQU1UTWFwQ29uZmlnO1xyXG4gIHByaXZhdGUgX3Jvb3Q7IC8vIFRPRE9cclxuICBwcml2YXRlIF9zaXplOiBudW1iZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVkaXRhYmxlID0gMCwgZWRpdCA9IDAsIGNvbmZpZzogSEFNVE1hcENvbmZpZyA9IHt9LCByb290ID0gZW1wdHksIHNpemU6IG51bWJlciA9IDApIHtcclxuICAgIHRoaXMuX2VkaXRhYmxlID0gZWRpdGFibGU7XHJcbiAgICB0aGlzLl9lZGl0ID0gZWRpdDtcclxuICAgIHRoaXMuX2NvbmZpZyA9IHtcclxuICAgICAga2V5RXE6IGNvbmZpZyAmJiBjb25maWcua2V5RXEgfHwgZGVmS2V5Q29tcGFyZSxcclxuICAgICAgaGFzaDogY29uZmlnICYmIGNvbmZpZy5oYXNoIHx8IGhhc2hcclxuICAgIH07XHJcbiAgICB0aGlzLl9yb290ID0gcm9vdDtcclxuICAgIHRoaXMuX3NpemUgPSBzaXplO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNpemUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2l6ZTtcclxuICB9XHJcblxyXG4gIHNldFRyZWUobmV3Um9vdCwgbmV3U2l6ZSkge1xyXG4gICAgaWYgKHRoaXMuX2VkaXRhYmxlKSB7XHJcbiAgICAgIHRoaXMuX3Jvb3QgPSBuZXdSb290O1xyXG4gICAgICB0aGlzLl9zaXplID0gbmV3U2l6ZTtcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3Um9vdCA9PT0gdGhpcy5fcm9vdCA/IHRoaXMgOiBuZXcgSEFNVE1hcCh0aGlzLl9lZGl0YWJsZSwgdGhpcy5fZWRpdCwgdGhpcy5fY29uZmlnLCBuZXdSb290LCBuZXdTaXplKTtcclxuICB9XHJcblxyXG4gIHRyeUdldEhhc2goYWx0LCBoYXNoLCBrZXkpIHtcclxuICAgIHJldHVybiB0cnlHZXRIYXNoKGFsdCwgaGFzaCwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHRyeUdldChhbHQsIGtleSkge1xyXG4gICAgcmV0dXJuIHRyeUdldChhbHQsIGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBnZXRIYXNoKGhhc2gsIGtleSkge1xyXG4gICAgcmV0dXJuIGdldEhhc2goaGFzaCwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGdldChrZXksIGFsdD8pIHtcclxuICAgIHJldHVybiB0cnlHZXQoYWx0LCBrZXksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgaGFzSGFzaChoYXNoLCBrZXkpIHtcclxuICAgIHJldHVybiBoYXNIYXNoKGhhc2gsIGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBoYXMoa2V5KSB7XHJcbiAgICByZXR1cm4gaGFzKGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBpc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGlzRW1wdHkodGhpcyk7XHJcbiAgfVxyXG5cclxuICBtb2RpZnlIYXNoKGhhc2gsIGtleSwgZikge1xyXG4gICAgcmV0dXJuIG1vZGlmeUhhc2goZiwgaGFzaCwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIG1vZGlmeShrZXksIGYpIHtcclxuICAgIHJldHVybiBtb2RpZnkoZiwga2V5LCB0aGlzKTtcclxuICB9XHJcblxyXG4gIHNldEhhc2goaGFzaCwga2V5LCB2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHNldEhhc2goaGFzaCwga2V5LCB2YWx1ZSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBzZXQoa2V5LCB2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHNldChrZXksIHZhbHVlLCB0aGlzKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZUhhc2goaGFzaCwga2V5KSB7XHJcbiAgICByZXR1cm4gcmVtb3ZlSGFzaChoYXNoLCBrZXksIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlSGFzaChoYXNoLCBrZXkpIHtcclxuICAgIHJldHVybiByZW1vdmVIYXNoKGhhc2gsIGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoa2V5KSB7XHJcbiAgICByZXR1cm4gcmVtb3ZlKGtleSwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBiZWdpbk11dGF0aW9uKCkge1xyXG4gICAgcmV0dXJuIGJlZ2luTXV0YXRpb24odGhpcyk7XHJcbiAgfVxyXG5cclxuICBlbmRNdXRhdGlvbigpIHtcclxuICAgIHJldHVybiBlbmRNdXRhdGlvbih0aGlzKTtcclxuICB9XHJcblxyXG4gIG11dGF0ZShmKSB7XHJcbiAgICByZXR1cm4gbXV0YXRlKGYsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgZW50cmllcygpIHtcclxuICAgIHJldHVybiBlbnRyaWVzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAga2V5cygpIHtcclxuICAgIHJldHVybiBrZXlzKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgdmFsdWVzKCkge1xyXG4gICAgcmV0dXJuIHZhbHVlcyh0aGlzKTtcclxuICB9XHJcblxyXG4gIGZvbGQoZiwgeikge1xyXG4gICAgcmV0dXJuIGZvbGQoZiwgeiwgdGhpcyk7XHJcbiAgfVxyXG5cclxuICBmb3JFYWNoKGYpIHtcclxuICAgIHJldHVybiBmb3JFYWNoKGYsIHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZW50cmllcyh0aGlzKTtcclxuICB9XHJcbn1cclxuIl19