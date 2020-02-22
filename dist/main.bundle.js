// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let System;
let __inst;

(() => {
  const mMap = new Map();
  System = {
    register(id, deps, f) {
      mMap.set(id, {
        id,
        deps,
        f,
        exp: {}
      });
    }
  };

  const gC = (data, main) => {
    const { id } = data;
    return {
      id,
      import: async id => mMap.get(id)?.exp,
      meta: { url: id, main }
    };
  };

  const gE = data => {
    const { exp } = data;
    return (id, value) => {
      const values = typeof id === "string" ? { [id]: value } : id;
      for (const [id, value] of Object.entries(values)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true
        });
      }
    };
  };

  const iQ = [];

  const enq = ids => {
    for (const id of ids) {
      if (!iQ.includes(id)) {
        const { deps } = mMap.get(id);
        iQ.push(id);
        enq(deps);
      }
    }
  };

  const dr = async main => {
    const rQ = [];
    let id;
    while ((id = iQ.pop())) {
      const m = mMap.get(id);
      const { f } = m;
      if (!f) {
        return;
      }
      rQ.push([m.deps, f(gE(m), gC(m, id === main))]);
      m.f = undefined;
    }
    let r;
    while ((r = rQ.shift())) {
      const [deps, { execute, setters }] = r;
      for (let i = 0; i < deps.length; i++) setters[i](mMap.get(deps[i])?.exp);
      const e = execute();
      if (e) await e;
    }
  };

  __inst = async id => {
    System = undefined;
    __inst = undefined;
    enq([id]);
    await dr(id);
    return mMap.get(id)?.exp;
  };
})();

System.register("https://deno.land/std/fmt/colors", [], function (exports_1, context_1) {
    "use strict";
    var noColor, enabled;
    var __moduleName = context_1 && context_1.id;
    function setColorEnabled(value) {
        if (noColor) {
            return;
        }
        enabled = value;
    }
    exports_1("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
        return enabled;
    }
    exports_1("getColorEnabled", getColorEnabled);
    function code(open, close) {
        return {
            open: `\x1b[${open}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g")
        };
    }
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    function reset(str) {
        return run(str, code(0, 0));
    }
    exports_1("reset", reset);
    function bold(str) {
        return run(str, code(1, 22));
    }
    exports_1("bold", bold);
    function dim(str) {
        return run(str, code(2, 22));
    }
    exports_1("dim", dim);
    function italic(str) {
        return run(str, code(3, 23));
    }
    exports_1("italic", italic);
    function underline(str) {
        return run(str, code(4, 24));
    }
    exports_1("underline", underline);
    function inverse(str) {
        return run(str, code(7, 27));
    }
    exports_1("inverse", inverse);
    function hidden(str) {
        return run(str, code(8, 28));
    }
    exports_1("hidden", hidden);
    function strikethrough(str) {
        return run(str, code(9, 29));
    }
    exports_1("strikethrough", strikethrough);
    function black(str) {
        return run(str, code(30, 39));
    }
    exports_1("black", black);
    function red(str) {
        return run(str, code(31, 39));
    }
    exports_1("red", red);
    function green(str) {
        return run(str, code(32, 39));
    }
    exports_1("green", green);
    function yellow(str) {
        return run(str, code(33, 39));
    }
    exports_1("yellow", yellow);
    function blue(str) {
        return run(str, code(34, 39));
    }
    exports_1("blue", blue);
    function magenta(str) {
        return run(str, code(35, 39));
    }
    exports_1("magenta", magenta);
    function cyan(str) {
        return run(str, code(36, 39));
    }
    exports_1("cyan", cyan);
    function white(str) {
        return run(str, code(37, 39));
    }
    exports_1("white", white);
    function gray(str) {
        return run(str, code(90, 39));
    }
    exports_1("gray", gray);
    function bgBlack(str) {
        return run(str, code(40, 49));
    }
    exports_1("bgBlack", bgBlack);
    function bgRed(str) {
        return run(str, code(41, 49));
    }
    exports_1("bgRed", bgRed);
    function bgGreen(str) {
        return run(str, code(42, 49));
    }
    exports_1("bgGreen", bgGreen);
    function bgYellow(str) {
        return run(str, code(43, 49));
    }
    exports_1("bgYellow", bgYellow);
    function bgBlue(str) {
        return run(str, code(44, 49));
    }
    exports_1("bgBlue", bgBlue);
    function bgMagenta(str) {
        return run(str, code(45, 49));
    }
    exports_1("bgMagenta", bgMagenta);
    function bgCyan(str) {
        return run(str, code(46, 49));
    }
    exports_1("bgCyan", bgCyan);
    function bgWhite(str) {
        return run(str, code(47, 49));
    }
    exports_1("bgWhite", bgWhite);
    return {
        setters: [],
        execute: function () {
            // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
            /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
            noColor = Deno.noColor;
            enabled = !noColor;
        }
    };
});
System.register("https://deno.land/std/testing/diff", [], function (exports_2, context_2) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_2 && context_2.id;
    function createCommon(A, B, reverse) {
        const common = [];
        if (A.length === 0 || B.length === 0)
            return [];
        for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
            if (A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]) {
                common.push(A[reverse ? A.length - i - 1 : i]);
            }
            else {
                return common;
            }
        }
        return common;
    }
    function diff(A, B) {
        const prefixCommon = createCommon(A, B);
        const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
        A = suffixCommon.length
            ? A.slice(prefixCommon.length, -suffixCommon.length)
            : A.slice(prefixCommon.length);
        B = suffixCommon.length
            ? B.slice(prefixCommon.length, -suffixCommon.length)
            : B.slice(prefixCommon.length);
        const swapped = B.length > A.length;
        [A, B] = swapped ? [B, A] : [A, B];
        const M = A.length;
        const N = B.length;
        if (!M && !N && !suffixCommon.length && !prefixCommon.length)
            return [];
        if (!N) {
            return [
                ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
                ...A.map((a) => ({
                    type: swapped ? DiffType.added : DiffType.removed,
                    value: a
                })),
                ...suffixCommon.map((c) => ({ type: DiffType.common, value: c }))
            ];
        }
        const offset = N;
        const delta = M - N;
        const size = M + N + 1;
        const fp = new Array(size).fill({ y: -1 });
        /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
        const routes = new Uint32Array((M * N + size + 1) * 2);
        const diffTypesPtrOffset = routes.length / 2;
        let ptr = 0;
        let p = -1;
        function backTrace(A, B, current, swapped) {
            const M = A.length;
            const N = B.length;
            const result = [];
            let a = M - 1;
            let b = N - 1;
            let j = routes[current.id];
            let type = routes[current.id + diffTypesPtrOffset];
            while (true) {
                if (!j && !type)
                    break;
                const prev = j;
                if (type === REMOVED) {
                    result.unshift({
                        type: swapped ? DiffType.removed : DiffType.added,
                        value: B[b]
                    });
                    b -= 1;
                }
                else if (type === ADDED) {
                    result.unshift({
                        type: swapped ? DiffType.added : DiffType.removed,
                        value: A[a]
                    });
                    a -= 1;
                }
                else {
                    result.unshift({ type: DiffType.common, value: A[a] });
                    a -= 1;
                    b -= 1;
                }
                j = routes[prev];
                type = routes[prev + diffTypesPtrOffset];
            }
            return result;
        }
        function createFP(slide, down, k, M) {
            if (slide && slide.y === -1 && down && down.y === -1)
                return { y: 0, id: 0 };
            if ((down && down.y === -1) ||
                k === M ||
                (slide && slide.y) > (down && down.y) + 1) {
                const prev = slide.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = ADDED;
                return { y: slide.y, id: ptr };
            }
            else {
                const prev = down.id;
                ptr++;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = REMOVED;
                return { y: down.y + 1, id: ptr };
            }
        }
        function snake(k, slide, down, _offset, A, B) {
            const M = A.length;
            const N = B.length;
            if (k < -N || M < k)
                return { y: -1, id: -1 };
            const fp = createFP(slide, down, k, M);
            while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
                const prev = fp.id;
                ptr++;
                fp.id = ptr;
                fp.y += 1;
                routes[ptr] = prev;
                routes[ptr + diffTypesPtrOffset] = COMMON;
            }
            return fp;
        }
        while (fp[delta + offset].y < N) {
            p = p + 1;
            for (let k = -p; k < delta; ++k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            for (let k = delta + p; k > delta; --k) {
                fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
            }
            fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
        }
        return [
            ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ...backTrace(A, B, fp[delta + offset], swapped),
            ...suffixCommon.map((c) => ({ type: DiffType.common, value: c }))
        ];
    }
    exports_2("default", diff);
    return {
        setters: [],
        execute: function () {
            (function (DiffType) {
                DiffType["removed"] = "removed";
                DiffType["common"] = "common";
                DiffType["added"] = "added";
            })(DiffType || (DiffType = {}));
            exports_2("DiffType", DiffType);
            REMOVED = 1;
            COMMON = 2;
            ADDED = 3;
        }
    };
});
System.register("https://deno.land/std/testing/format", ["https://deno.land/std/testing/asserts"], function (exports_3, context_3) {
    "use strict";
    var asserts_ts_1, toString, toISOString, errorToString, regExpToString, symbolToString, DEFAULT_OPTIONS, getConstructorName, isWindow, SYMBOL_REGEXP, getKeysOfEnumerableProperties, getConfig;
    var __moduleName = context_3 && context_3.id;
    function isToStringedArrayType(toStringed) {
        return (toStringed === "[object Array]" ||
            toStringed === "[object ArrayBuffer]" ||
            toStringed === "[object DataView]" ||
            toStringed === "[object Float32Array]" ||
            toStringed === "[object Float64Array]" ||
            toStringed === "[object Int8Array]" ||
            toStringed === "[object Int16Array]" ||
            toStringed === "[object Int32Array]" ||
            toStringed === "[object Uint8Array]" ||
            toStringed === "[object Uint8ClampedArray]" ||
            toStringed === "[object Uint16Array]" ||
            toStringed === "[object Uint32Array]");
    }
    function printNumber(val) {
        return Object.is(val, -0) ? "-0" : String(val);
    }
    function printFunction(val, printFunctionName) {
        if (!printFunctionName) {
            return "[Function]";
        }
        return "[Function " + (val.name || "anonymous") + "]";
    }
    function printSymbol(val) {
        return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
    }
    function printError(val) {
        return "[" + errorToString.call(val) + "]";
    }
    /**
     * The first port of call for printing an object, handles most of the
     * data-types in JS.
     */
    function printBasicValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, { printFunctionName, escapeRegex, escapeString }) {
        if (val === true || val === false) {
            return String(val);
        }
        if (val === undefined) {
            return "undefined";
        }
        if (val === null) {
            return "null";
        }
        const typeOf = typeof val;
        if (typeOf === "number") {
            return printNumber(val);
        }
        if (typeOf === "string") {
            if (escapeString) {
                return `"${val.replace(/"|\\/g, "\\$&")}"`;
            }
            return `"${val}"`;
        }
        if (typeOf === "function") {
            return printFunction(val, printFunctionName);
        }
        if (typeOf === "symbol") {
            return printSymbol(val);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object WeakMap]") {
            return "WeakMap {}";
        }
        if (toStringed === "[object WeakSet]") {
            return "WeakSet {}";
        }
        if (toStringed === "[object Function]" ||
            toStringed === "[object GeneratorFunction]") {
            return printFunction(val, printFunctionName);
        }
        if (toStringed === "[object Symbol]") {
            return printSymbol(val);
        }
        if (toStringed === "[object Date]") {
            return isNaN(+val) ? "Date { NaN }" : toISOString.call(val);
        }
        if (toStringed === "[object Error]") {
            return printError(val);
        }
        if (toStringed === "[object RegExp]") {
            if (escapeRegex) {
                // https://github.com/benjamingr/RegExp.escape/blob/master/polyfill.js
                return regExpToString.call(val).replace(/[\\^$*+?.()|[\]{}]/g, "\\$&");
            }
            return regExpToString.call(val);
        }
        if (val instanceof Error) {
            return printError(val);
        }
        return null;
    }
    function printer(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, config, indentation, depth, refs, hasCalledToJSON) {
        const basicResult = printBasicValue(val, config);
        if (basicResult !== null) {
            return basicResult;
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return printComplexValue(val, config, indentation, depth, refs, hasCalledToJSON);
    }
    /**
     * Return items (for example, of an array)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, brackets)
     */
    function printListItems(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list, config, indentation, depth, refs, printer) {
        let result = "";
        if (list.length) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            for (let i = 0; i < list.length; i++) {
                result +=
                    indentationNext +
                        printer(list[i], config, indentationNext, depth, refs);
                if (i < list.length - 1) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return entries (for example, of a map)
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printIteratorEntries(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iterator, config, indentation, depth, refs, printer, 
    // Too bad, so sad that separator for ECMAScript Map has been ' => '
    // What a distracting diff if you change a data structure to/from
    // ECMAScript Object or Immutable.Map/OrderedMap which use the default.
    separator = ": ") {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            while (!current.done) {
                const name = printer(current.value[0], config, indentationNext, depth, refs);
                const value = printer(current.value[1], config, indentationNext, depth, refs);
                result += indentationNext + name + separator + value;
                current = iterator.next();
                if (!current.done) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return values (for example, of a set)
     * with spacing, indentation, and comma
     * without surrounding punctuation (braces or brackets)
     */
    function printIteratorValues(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iterator, config, indentation, depth, refs, printer) {
        let result = "";
        let current = iterator.next();
        if (!current.done) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            while (!current.done) {
                result +=
                    indentationNext +
                        printer(current.value, config, indentationNext, depth, refs);
                current = iterator.next();
                if (!current.done) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Return properties of an object
     * with spacing, indentation, and comma
     * without surrounding punctuation (for example, braces)
     */
    function printObjectProperties(val, config, indentation, depth, refs, printer) {
        let result = "";
        const keys = getKeysOfEnumerableProperties(val);
        if (keys.length) {
            result += config.spacingOuter;
            const indentationNext = indentation + config.indent;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const name = printer(key, config, indentationNext, depth, refs);
                const value = printer(val[key], config, indentationNext, depth, refs);
                result += indentationNext + name + ": " + value;
                if (i < keys.length - 1) {
                    result += "," + config.spacingInner;
                }
                else if (!config.min) {
                    result += ",";
                }
            }
            result += config.spacingOuter + indentation;
        }
        return result;
    }
    /**
     * Handles more complex objects ( such as objects with circular references.
     * maps and sets etc )
     */
    function printComplexValue(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    val, config, indentation, depth, refs, hasCalledToJSON) {
        if (refs.indexOf(val) !== -1) {
            return "[Circular]";
        }
        refs = refs.slice();
        refs.push(val);
        const hitMaxDepth = ++depth > config.maxDepth;
        const { min, callToJSON } = config;
        if (callToJSON &&
            !hitMaxDepth &&
            val.toJSON &&
            typeof val.toJSON === "function" &&
            !hasCalledToJSON) {
            return printer(val.toJSON(), config, indentation, depth, refs, true);
        }
        const toStringed = toString.call(val);
        if (toStringed === "[object Arguments]") {
            return hitMaxDepth
                ? "[Arguments]"
                : (min ? "" : "Arguments ") +
                    "[" +
                    printListItems(val, config, indentation, depth, refs, printer) +
                    "]";
        }
        if (isToStringedArrayType(toStringed)) {
            return hitMaxDepth
                ? `[${val.constructor.name}]`
                : (min ? "" : `${val.constructor.name} `) +
                    "[" +
                    printListItems(val, config, indentation, depth, refs, printer) +
                    "]";
        }
        if (toStringed === "[object Map]") {
            return hitMaxDepth
                ? "[Map]"
                : "Map {" +
                    printIteratorEntries(val.entries(), config, indentation, depth, refs, printer, " => ") +
                    "}";
        }
        if (toStringed === "[object Set]") {
            return hitMaxDepth
                ? "[Set]"
                : "Set {" +
                    printIteratorValues(val.values(), config, indentation, depth, refs, printer) +
                    "}";
        }
        // Avoid failure to serialize global window object in jsdom test environment.
        // For example, not even relevant if window is prop of React element.
        return hitMaxDepth || isWindow(val)
            ? "[" + getConstructorName(val) + "]"
            : (min ? "" : getConstructorName(val) + " ") +
                "{" +
                printObjectProperties(val, config, indentation, depth, refs, printer) +
                "}";
    }
    // TODO this is better done with `.padStart()`
    function createIndent(indent) {
        return new Array(indent + 1).join(" ");
    }
    /**
     * Returns a presentation string of your `val` object
     * @param val any potential JavaScript object
     * @param options Custom settings
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function format(val, options = {}) {
        const opts = {
            ...DEFAULT_OPTIONS,
            ...options
        };
        const basicResult = printBasicValue(val, opts);
        if (basicResult !== null) {
            return basicResult;
        }
        return printComplexValue(val, getConfig(opts), "", 0, []);
    }
    exports_3("format", format);
    return {
        setters: [
            function (asserts_ts_1_1) {
                asserts_ts_1 = asserts_ts_1_1;
            }
        ],
        execute: function () {
            toString = Object.prototype.toString;
            toISOString = Date.prototype.toISOString;
            errorToString = Error.prototype.toString;
            regExpToString = RegExp.prototype.toString;
            symbolToString = Symbol.prototype.toString;
            DEFAULT_OPTIONS = {
                callToJSON: true,
                escapeRegex: false,
                escapeString: true,
                indent: 2,
                maxDepth: Infinity,
                min: false,
                printFunctionName: true
            };
            /**
             * Explicitly comparing typeof constructor to function avoids undefined as name
             * when mock identity-obj-proxy returns the key as the value for any key.
             */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getConstructorName = (val) => (typeof val.constructor === "function" && val.constructor.name) || "Object";
            /* global window */
            /** Is val is equal to global window object?
             *  Works even if it does not exist :)
             * */
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            isWindow = (val) => typeof window !== "undefined" && val === window;
            SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
            getKeysOfEnumerableProperties = (object) => {
                const keys = Object.keys(object).sort();
                if (Object.getOwnPropertySymbols) {
                    Object.getOwnPropertySymbols(object).forEach((symbol) => {
                        const d = Object.getOwnPropertyDescriptor(object, symbol);
                        asserts_ts_1.assert(d != null);
                        if (d.enumerable) {
                            keys.push(symbol);
                        }
                    });
                }
                return keys;
            };
            getConfig = (options) => ({
                ...options,
                indent: options.min ? "" : createIndent(options.indent),
                spacingInner: options.min ? " " : "\n",
                spacingOuter: options.min ? "" : "\n"
            });
        }
    };
});
System.register("https://deno.land/std/testing/asserts", ["https://deno.land/std/fmt/colors", "https://deno.land/std/testing/diff", "https://deno.land/std/testing/format"], function (exports_4, context_4) {
    "use strict";
    var colors_ts_1, diff_ts_1, format_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_4 && context_4.id;
    function createStr(v) {
        try {
            return format_ts_1.format(v);
        }
        catch (e) {
            return colors_ts_1.red(CAN_NOT_DISPLAY);
        }
    }
    function createColor(diffType) {
        switch (diffType) {
            case diff_ts_1.DiffType.added:
                return (s) => colors_ts_1.green(colors_ts_1.bold(s));
            case diff_ts_1.DiffType.removed:
                return (s) => colors_ts_1.red(colors_ts_1.bold(s));
            default:
                return colors_ts_1.white;
        }
    }
    function createSign(diffType) {
        switch (diffType) {
            case diff_ts_1.DiffType.added:
                return "+   ";
            case diff_ts_1.DiffType.removed:
                return "-   ";
            default:
                return "    ";
        }
    }
    function buildMessage(diffResult) {
        const messages = [];
        messages.push("");
        messages.push("");
        messages.push(`    ${colors_ts_1.gray(colors_ts_1.bold("[Diff]"))} ${colors_ts_1.red(colors_ts_1.bold("Left"))} / ${colors_ts_1.green(colors_ts_1.bold("Right"))}`);
        messages.push("");
        messages.push("");
        diffResult.forEach((result) => {
            const c = createColor(result.type);
            messages.push(c(`${createSign(result.type)}${result.value}`));
        });
        messages.push("");
        return messages;
    }
    function isKeyedCollection(x) {
        return [Symbol.iterator, "size"].every(k => k in x);
    }
    function equal(c, d) {
        const seen = new Map();
        return (function compare(a, b) {
            // Have to render RegExp & Date for string comparison
            // unless it's mistreated as object
            if (a &&
                b &&
                ((a instanceof RegExp && b instanceof RegExp) ||
                    (a instanceof Date && b instanceof Date))) {
                return String(a) === String(b);
            }
            if (Object.is(a, b)) {
                return true;
            }
            if (a && typeof a === "object" && b && typeof b === "object") {
                if (seen.get(a) === b) {
                    return true;
                }
                if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
                    return false;
                }
                if (isKeyedCollection(a) && isKeyedCollection(b)) {
                    if (a.size !== b.size) {
                        return false;
                    }
                    let unmatchedEntries = a.size;
                    for (const [aKey, aValue] of a.entries()) {
                        for (const [bKey, bValue] of b.entries()) {
                            /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                            if ((aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                                (compare(aKey, bKey) && compare(aValue, bValue))) {
                                unmatchedEntries--;
                            }
                        }
                    }
                    return unmatchedEntries === 0;
                }
                const merged = { ...a, ...b };
                for (const key in merged) {
                    if (!compare(a && a[key], b && b[key])) {
                        return false;
                    }
                }
                seen.set(a, b);
                return true;
            }
            return false;
        })(c, d);
    }
    exports_4("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
        if (!expr) {
            throw new AssertionError(msg);
        }
    }
    exports_4("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
        if (equal(actual, expected)) {
            return;
        }
        let message = "";
        const actualString = createStr(actual);
        const expectedString = createStr(expected);
        try {
            const diffResult = diff_ts_1.default(actualString.split("\n"), expectedString.split("\n"));
            message = buildMessage(diffResult).join("\n");
        }
        catch (e) {
            message = `\n${colors_ts_1.red(CAN_NOT_DISPLAY)} + \n\n`;
        }
        if (msg) {
            message = msg;
        }
        throw new AssertionError(message);
    }
    exports_4("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
        if (!equal(actual, expected)) {
            return;
        }
        let actualString;
        let expectedString;
        try {
            actualString = String(actual);
        }
        catch (e) {
            actualString = "[Cannot display]";
        }
        try {
            expectedString = String(expected);
        }
        catch (e) {
            expectedString = "[Cannot display]";
        }
        if (!msg) {
            msg = `actual: ${actualString} expected: ${expectedString}`;
        }
        throw new AssertionError(msg);
    }
    exports_4("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
        if (actual !== expected) {
            let actualString;
            let expectedString;
            try {
                actualString = String(actual);
            }
            catch (e) {
                actualString = "[Cannot display]";
            }
            try {
                expectedString = String(expected);
            }
            catch (e) {
                expectedString = "[Cannot display]";
            }
            if (!msg) {
                msg = `actual: ${actualString} expected: ${expectedString}`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_4("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
        if (!actual.includes(expected)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to contains: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_4("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
        const missing = [];
        for (let i = 0; i < expected.length; i++) {
            let found = false;
            for (let j = 0; j < actual.length; j++) {
                if (equal(expected[i], actual[j])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                missing.push(expected[i]);
            }
        }
        if (missing.length === 0) {
            return;
        }
        if (!msg) {
            msg = `actual: "${actual}" expected to contains: "${expected}"`;
            msg += "\n";
            msg += `missing: ${missing}`;
        }
        throw new AssertionError(msg);
    }
    exports_4("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
        if (!expected.test(actual)) {
            if (!msg) {
                msg = `actual: "${actual}" expected to match: "${expected}"`;
            }
            throw new AssertionError(msg);
        }
    }
    exports_4("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_4("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            fn();
        }
        catch (e) {
            if (ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)) {
                msg = `Expected error to be instance of "${ErrorClass.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && !e.message.includes(msgIncludes)) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports_4("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
        let doesThrow = false;
        let error = null;
        try {
            await fn();
        }
        catch (e) {
            if (ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)) {
                msg = `Expected error to be instance of "${ErrorClass.name}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            if (msgIncludes && !e.message.includes(msgIncludes)) {
                msg = `Expected error message to include "${msgIncludes}", but got "${e.message}"${msg ? `: ${msg}` : "."}`;
                throw new AssertionError(msg);
            }
            doesThrow = true;
            error = e;
        }
        if (!doesThrow) {
            msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
            throw new AssertionError(msg);
        }
        return error;
    }
    exports_4("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
        throw new AssertionError(msg || "unimplemented");
    }
    exports_4("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
        throw new AssertionError("unreachable");
    }
    exports_4("unreachable", unreachable);
    return {
        setters: [
            function (colors_ts_1_1) {
                colors_ts_1 = colors_ts_1_1;
            },
            function (diff_ts_1_1) {
                diff_ts_1 = diff_ts_1_1;
            },
            function (format_ts_1_1) {
                format_ts_1 = format_ts_1_1;
            }
        ],
        execute: function () {
            CAN_NOT_DISPLAY = "[Cannot display]";
            AssertionError = class AssertionError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "AssertionError";
                }
            };
            exports_4("AssertionError", AssertionError);
        }
    };
});
System.register("https://deno.land/std/flags/mod", ["https://deno.land/std/testing/asserts"], function (exports_5, context_5) {
    "use strict";
    var asserts_ts_2, DEFAULT_OPTIONS;
    var __moduleName = context_5 && context_5.id;
    function get(obj, key) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }
    }
    function getForce(obj, key) {
        const v = get(obj, key);
        asserts_ts_2.assert(v != null);
        return v;
    }
    function isNumber(x) {
        if (typeof x === "number")
            return true;
        if (/^0x[0-9a-f]+$/i.test(String(x)))
            return true;
        return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(String(x));
    }
    function hasKey(obj, keys) {
        let o = obj;
        keys.slice(0, -1).forEach(function (key) {
            o = (get(o, key) || {});
        });
        const key = keys[keys.length - 1];
        return key in o;
    }
    function parse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args, initialOptions = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) {
        const options = {
            ...DEFAULT_OPTIONS,
            ...initialOptions
        };
        const flags = {
            bools: {},
            strings: {},
            unknownFn: options.unknown,
            allBools: false
        };
        if (options.boolean !== undefined) {
            if (typeof options.boolean === "boolean") {
                flags.allBools = !!options.boolean;
            }
            else {
                const booleanArgs = typeof options.boolean === "string"
                    ? [options.boolean]
                    : options.boolean;
                booleanArgs.filter(Boolean).forEach((key) => {
                    flags.bools[key] = true;
                });
            }
        }
        const aliases = {};
        if (options.alias !== undefined) {
            for (const key in options.alias) {
                const val = getForce(options.alias, key);
                if (typeof val === "string") {
                    aliases[key] = [val];
                }
                else {
                    aliases[key] = val;
                }
                for (const alias of getForce(aliases, key)) {
                    aliases[alias] = [key].concat(aliases[key].filter((y) => alias !== y));
                }
            }
        }
        if (options.string !== undefined) {
            const stringArgs = typeof options.string === "string" ? [options.string] : options.string;
            stringArgs.filter(Boolean).forEach(function (key) {
                flags.strings[key] = true;
                const alias = get(aliases, key);
                if (alias) {
                    alias.forEach((alias) => {
                        flags.strings[alias] = true;
                    });
                }
            });
        }
        const defaults = options.default;
        const argv = { _: [] };
        function argDefined(key, arg) {
            return ((flags.allBools && /^--[^=]+$/.test(arg)) ||
                get(flags.bools, key) ||
                !!get(flags.strings, key) ||
                !!get(aliases, key));
        }
        function setKey(obj, keys, value) {
            let o = obj;
            keys.slice(0, -1).forEach(function (key) {
                if (get(o, key) === undefined) {
                    o[key] = {};
                }
                o = get(o, key);
            });
            const key = keys[keys.length - 1];
            if (get(o, key) === undefined ||
                get(flags.bools, key) ||
                typeof get(o, key) === "boolean") {
                o[key] = value;
            }
            else if (Array.isArray(get(o, key))) {
                o[key].push(value);
            }
            else {
                o[key] = [get(o, key), value];
            }
        }
        function setArg(key, val, arg = undefined) {
            if (arg && flags.unknownFn && !argDefined(key, arg)) {
                if (flags.unknownFn(arg) === false)
                    return;
            }
            const value = !get(flags.strings, key) && isNumber(val) ? Number(val) : val;
            setKey(argv, key.split("."), value);
            (get(aliases, key) || []).forEach(function (x) {
                setKey(argv, x.split("."), value);
            });
        }
        function aliasIsBoolean(key) {
            return getForce(aliases, key).some(function (x) {
                return typeof get(flags.bools, x) === "boolean";
            });
        }
        Object.keys(flags.bools).forEach(function (key) {
            setArg(key, defaults[key] === undefined ? false : defaults[key]);
        });
        let notFlags = [];
        // all args after "--" are not parsed
        if (args.indexOf("--") !== -1) {
            notFlags = args.slice(args.indexOf("--") + 1);
            args = args.slice(0, args.indexOf("--"));
        }
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (/^--.+=/.test(arg)) {
                // Using [\s\S] instead of . because js doesn't support the
                // 'dotall' regex modifier. See:
                // http://stackoverflow.com/a/1068308/13216
                const m = arg.match(/^--([^=]+)=([\s\S]*)$/);
                asserts_ts_2.assert(m != null);
                const key = m[1];
                const value = m[2];
                if (flags.bools[key]) {
                    const booleanValue = value !== "false";
                    setArg(key, booleanValue, arg);
                }
                else {
                    setArg(key, value, arg);
                }
            }
            else if (/^--no-.+/.test(arg)) {
                const m = arg.match(/^--no-(.+)/);
                asserts_ts_2.assert(m != null);
                setArg(m[1], false, arg);
            }
            else if (/^--.+/.test(arg)) {
                const m = arg.match(/^--(.+)/);
                asserts_ts_2.assert(m != null);
                const key = m[1];
                const next = args[i + 1];
                if (next !== undefined &&
                    !/^-/.test(next) &&
                    !get(flags.bools, key) &&
                    !flags.allBools &&
                    (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                    setArg(key, next, arg);
                    i++;
                }
                else if (/^(true|false)$/.test(next)) {
                    setArg(key, next === "true", arg);
                    i++;
                }
                else {
                    setArg(key, get(flags.strings, key) ? "" : true, arg);
                }
            }
            else if (/^-[^-]+/.test(arg)) {
                const letters = arg.slice(1, -1).split("");
                let broken = false;
                for (let j = 0; j < letters.length; j++) {
                    const next = arg.slice(j + 2);
                    if (next === "-") {
                        setArg(letters[j], next, arg);
                        continue;
                    }
                    if (/[A-Za-z]/.test(letters[j]) && /=/.test(next)) {
                        setArg(letters[j], next.split("=")[1], arg);
                        broken = true;
                        break;
                    }
                    if (/[A-Za-z]/.test(letters[j]) &&
                        /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
                        setArg(letters[j], next, arg);
                        broken = true;
                        break;
                    }
                    if (letters[j + 1] && letters[j + 1].match(/\W/)) {
                        setArg(letters[j], arg.slice(j + 2), arg);
                        broken = true;
                        break;
                    }
                    else {
                        setArg(letters[j], get(flags.strings, letters[j]) ? "" : true, arg);
                    }
                }
                const key = arg.slice(-1)[0];
                if (!broken && key !== "-") {
                    if (args[i + 1] &&
                        !/^(-|--)[^-]/.test(args[i + 1]) &&
                        !get(flags.bools, key) &&
                        (get(aliases, key) ? !aliasIsBoolean(key) : true)) {
                        setArg(key, args[i + 1], arg);
                        i++;
                    }
                    else if (args[i + 1] && /^(true|false)$/.test(args[i + 1])) {
                        setArg(key, args[i + 1] === "true", arg);
                        i++;
                    }
                    else {
                        setArg(key, get(flags.strings, key) ? "" : true, arg);
                    }
                }
            }
            else {
                if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
                    argv._.push(flags.strings["_"] || !isNumber(arg) ? arg : Number(arg));
                }
                if (options.stopEarly) {
                    argv._.push(...args.slice(i + 1));
                    break;
                }
            }
        }
        Object.keys(defaults).forEach(function (key) {
            if (!hasKey(argv, key.split("."))) {
                setKey(argv, key.split("."), defaults[key]);
                (aliases[key] || []).forEach(function (x) {
                    setKey(argv, x.split("."), defaults[key]);
                });
            }
        });
        if (options["--"]) {
            argv["--"] = [];
            notFlags.forEach(function (key) {
                argv["--"].push(key);
            });
        }
        else {
            notFlags.forEach(function (key) {
                argv._.push(key);
            });
        }
        return argv;
    }
    exports_5("parse", parse);
    return {
        setters: [
            function (asserts_ts_2_1) {
                asserts_ts_2 = asserts_ts_2_1;
            }
        ],
        execute: function () {
            DEFAULT_OPTIONS = {
                unknown: (i) => i,
                boolean: false,
                alias: {},
                string: [],
                default: {},
                "--": false,
                stopEarly: false
            };
        }
    };
});
System.register("https://deno.land/std/path/interface", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/constants", [], function (exports_7, context_7) {
    "use strict";
    var build, CHAR_UPPERCASE_A, CHAR_LOWERCASE_A, CHAR_UPPERCASE_Z, CHAR_LOWERCASE_Z, CHAR_DOT, CHAR_FORWARD_SLASH, CHAR_BACKWARD_SLASH, CHAR_VERTICAL_LINE, CHAR_COLON, CHAR_QUESTION_MARK, CHAR_UNDERSCORE, CHAR_LINE_FEED, CHAR_CARRIAGE_RETURN, CHAR_TAB, CHAR_FORM_FEED, CHAR_EXCLAMATION_MARK, CHAR_HASH, CHAR_SPACE, CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_LEFT_ANGLE_BRACKET, CHAR_RIGHT_ANGLE_BRACKET, CHAR_LEFT_CURLY_BRACKET, CHAR_RIGHT_CURLY_BRACKET, CHAR_HYPHEN_MINUS, CHAR_PLUS, CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE, CHAR_PERCENT, CHAR_SEMICOLON, CHAR_CIRCUMFLEX_ACCENT, CHAR_GRAVE_ACCENT, CHAR_AT, CHAR_AMPERSAND, CHAR_EQUAL, CHAR_0, CHAR_9, isWindows, EOL, SEP, SEP_PATTERN;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            build = Deno.build;
            // Alphabet chars.
            exports_7("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
            exports_7("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
            exports_7("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
            exports_7("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
            // Non-alphabetic chars.
            exports_7("CHAR_DOT", CHAR_DOT = 46); /* . */
            exports_7("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
            exports_7("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
            exports_7("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
            exports_7("CHAR_COLON", CHAR_COLON = 58); /* : */
            exports_7("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
            exports_7("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
            exports_7("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
            exports_7("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
            exports_7("CHAR_TAB", CHAR_TAB = 9); /* \t */
            exports_7("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
            exports_7("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
            exports_7("CHAR_HASH", CHAR_HASH = 35); /* # */
            exports_7("CHAR_SPACE", CHAR_SPACE = 32); /*   */
            exports_7("CHAR_NO_BREAK_SPACE", CHAR_NO_BREAK_SPACE = 160); /* \u00A0 */
            exports_7("CHAR_ZERO_WIDTH_NOBREAK_SPACE", CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279); /* \uFEFF */
            exports_7("CHAR_LEFT_SQUARE_BRACKET", CHAR_LEFT_SQUARE_BRACKET = 91); /* [ */
            exports_7("CHAR_RIGHT_SQUARE_BRACKET", CHAR_RIGHT_SQUARE_BRACKET = 93); /* ] */
            exports_7("CHAR_LEFT_ANGLE_BRACKET", CHAR_LEFT_ANGLE_BRACKET = 60); /* < */
            exports_7("CHAR_RIGHT_ANGLE_BRACKET", CHAR_RIGHT_ANGLE_BRACKET = 62); /* > */
            exports_7("CHAR_LEFT_CURLY_BRACKET", CHAR_LEFT_CURLY_BRACKET = 123); /* { */
            exports_7("CHAR_RIGHT_CURLY_BRACKET", CHAR_RIGHT_CURLY_BRACKET = 125); /* } */
            exports_7("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
            exports_7("CHAR_PLUS", CHAR_PLUS = 43); /* + */
            exports_7("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
            exports_7("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
            exports_7("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
            exports_7("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
            exports_7("CHAR_CIRCUMFLEX_ACCENT", CHAR_CIRCUMFLEX_ACCENT = 94); /* ^ */
            exports_7("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
            exports_7("CHAR_AT", CHAR_AT = 64); /* @ */
            exports_7("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
            exports_7("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
            // Digits
            exports_7("CHAR_0", CHAR_0 = 48); /* 0 */
            exports_7("CHAR_9", CHAR_9 = 57); /* 9 */
            exports_7("isWindows", isWindows = build.os === "win");
            exports_7("EOL", EOL = isWindows ? "\r\n" : "\n");
            exports_7("SEP", SEP = isWindows ? "\\" : "/");
            exports_7("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/utils", ["https://deno.land/std/path/constants"], function (exports_8, context_8) {
    "use strict";
    var constants_ts_1;
    var __moduleName = context_8 && context_8.id;
    function assertPath(path) {
        if (typeof path !== "string") {
            throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
        }
    }
    exports_8("assertPath", assertPath);
    function isPosixPathSeparator(code) {
        return code === constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_8("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
        return isPosixPathSeparator(code) || code === constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_8("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
        return ((code >= constants_ts_1.CHAR_LOWERCASE_A && code <= constants_ts_1.CHAR_LOWERCASE_Z) ||
            (code >= constants_ts_1.CHAR_UPPERCASE_A && code <= constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_8("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
        let res = "";
        let lastSegmentLength = 0;
        let lastSlash = -1;
        let dots = 0;
        let code;
        for (let i = 0, len = path.length; i <= len; ++i) {
            if (i < len)
                code = path.charCodeAt(i);
            else if (isPathSeparator(code))
                break;
            else
                code = constants_ts_1.CHAR_FORWARD_SLASH;
            if (isPathSeparator(code)) {
                if (lastSlash === i - 1 || dots === 1) {
                    // NOOP
                }
                else if (lastSlash !== i - 1 && dots === 2) {
                    if (res.length < 2 ||
                        lastSegmentLength !== 2 ||
                        res.charCodeAt(res.length - 1) !== constants_ts_1.CHAR_DOT ||
                        res.charCodeAt(res.length - 2) !== constants_ts_1.CHAR_DOT) {
                        if (res.length > 2) {
                            const lastSlashIndex = res.lastIndexOf(separator);
                            if (lastSlashIndex === -1) {
                                res = "";
                                lastSegmentLength = 0;
                            }
                            else {
                                res = res.slice(0, lastSlashIndex);
                                lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                            }
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                        else if (res.length === 2 || res.length === 1) {
                            res = "";
                            lastSegmentLength = 0;
                            lastSlash = i;
                            dots = 0;
                            continue;
                        }
                    }
                    if (allowAboveRoot) {
                        if (res.length > 0)
                            res += `${separator}..`;
                        else
                            res = "..";
                        lastSegmentLength = 2;
                    }
                }
                else {
                    if (res.length > 0)
                        res += separator + path.slice(lastSlash + 1, i);
                    else
                        res = path.slice(lastSlash + 1, i);
                    lastSegmentLength = i - lastSlash - 1;
                }
                lastSlash = i;
                dots = 0;
            }
            else if (code === constants_ts_1.CHAR_DOT && dots !== -1) {
                ++dots;
            }
            else {
                dots = -1;
            }
        }
        return res;
    }
    exports_8("normalizeString", normalizeString);
    function _format(sep, pathObject) {
        const dir = pathObject.dir || pathObject.root;
        const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
        if (!dir)
            return base;
        if (dir === pathObject.root)
            return dir + base;
        return dir + sep + base;
    }
    exports_8("_format", _format);
    return {
        setters: [
            function (constants_ts_1_1) {
                constants_ts_1 = constants_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/win32", ["https://deno.land/std/path/constants", "https://deno.land/std/path/utils", "https://deno.land/std/testing/asserts"], function (exports_9, context_9) {
    "use strict";
    var cwd, env, constants_ts_2, utils_ts_1, asserts_ts_3, sep, delimiter;
    var __moduleName = context_9 && context_9.id;
    function resolve(...pathSegments) {
        let resolvedDevice = "";
        let resolvedTail = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1; i--) {
            let path;
            if (i >= 0) {
                path = pathSegments[i];
            }
            else if (!resolvedDevice) {
                path = cwd();
            }
            else {
                // Windows has the concept of drive-specific current working
                // directories. If we've resolved a drive letter but not yet an
                // absolute path, get cwd for that drive, or the process cwd if
                // the drive cwd is not available. We're sure the device is not
                // a UNC path at this points, because UNC paths are always absolute.
                path = env()[`=${resolvedDevice}`] || cwd();
                // Verify that a cwd was found and that it actually points
                // to our drive. If not, default to the drive's root.
                if (path === undefined ||
                    path.slice(0, 3).toLowerCase() !== `${resolvedDevice.toLowerCase()}\\`) {
                    path = `${resolvedDevice}\\`;
                }
            }
            utils_ts_1.assertPath(path);
            const len = path.length;
            // Skip empty entries
            if (len === 0)
                continue;
            let rootEnd = 0;
            let device = "";
            let isAbsolute = false;
            const code = path.charCodeAt(0);
            // Try to match a root
            if (len > 1) {
                if (utils_ts_1.isPathSeparator(code)) {
                    // Possible UNC root
                    // If we started with a separator, we know we at least have an
                    // absolute path of some kind (UNC or otherwise)
                    isAbsolute = true;
                    if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                        // Matched double path separator at beginning
                        let j = 2;
                        let last = j;
                        // Match 1 or more non-path separators
                        for (; j < len; ++j) {
                            if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            const firstPart = path.slice(last, j);
                            // Matched!
                            last = j;
                            // Match 1 or more path separators
                            for (; j < len; ++j) {
                                if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j < len && j !== last) {
                                // Matched!
                                last = j;
                                // Match 1 or more non-path separators
                                for (; j < len; ++j) {
                                    if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                        break;
                                }
                                if (j === len) {
                                    // We matched a UNC root only
                                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                                    rootEnd = j;
                                }
                                else if (j !== last) {
                                    // We matched a UNC root with leftovers
                                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                    rootEnd = j;
                                }
                            }
                        }
                    }
                    else {
                        rootEnd = 1;
                    }
                }
                else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                    // Possible device root
                    if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                        device = path.slice(0, 2);
                        rootEnd = 2;
                        if (len > 2) {
                            if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                                // Treat separator following drive name as an absolute path
                                // indicator
                                isAbsolute = true;
                                rootEnd = 3;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isPathSeparator(code)) {
                // `path` contains just a path separator
                rootEnd = 1;
                isAbsolute = true;
            }
            if (device.length > 0 &&
                resolvedDevice.length > 0 &&
                device.toLowerCase() !== resolvedDevice.toLowerCase()) {
                // This path points to another device so it is not applicable
                continue;
            }
            if (resolvedDevice.length === 0 && device.length > 0) {
                resolvedDevice = device;
            }
            if (!resolvedAbsolute) {
                resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
                resolvedAbsolute = isAbsolute;
            }
            if (resolvedAbsolute && resolvedDevice.length > 0)
                break;
        }
        // At this point the path should be resolved to a full absolute path,
        // but handle relative paths to be safe (might happen when process.cwd()
        // fails)
        // Normalize the tail path
        resolvedTail = utils_ts_1.normalizeString(resolvedTail, !resolvedAbsolute, "\\", utils_ts_1.isPathSeparator);
        return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail || ".";
    }
    exports_9("resolve", resolve);
    function normalize(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = 0;
        let device;
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                // If we started with a separator, we know we at least have an absolute
                // path of some kind (UNC or otherwise)
                isAbsolute = true;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        const firstPart = path.slice(last, j);
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                // Return the normalized version of the UNC root since there
                                // is nothing left to process
                                return `\\\\${firstPart}\\${path.slice(last)}\\`;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                                rootEnd = j;
                            }
                        }
                    }
                }
                else {
                    rootEnd = 1;
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    device = path.slice(0, 2);
                    rootEnd = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            // Treat separator following drive name as an absolute path
                            // indicator
                            isAbsolute = true;
                            rootEnd = 3;
                        }
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid unnecessary
            // work
            return "\\";
        }
        let tail;
        if (rootEnd < len) {
            tail = utils_ts_1.normalizeString(path.slice(rootEnd), !isAbsolute, "\\", utils_ts_1.isPathSeparator);
        }
        else {
            tail = "";
        }
        if (tail.length === 0 && !isAbsolute)
            tail = ".";
        if (tail.length > 0 && utils_ts_1.isPathSeparator(path.charCodeAt(len - 1)))
            tail += "\\";
        if (device === undefined) {
            if (isAbsolute) {
                if (tail.length > 0)
                    return `\\${tail}`;
                else
                    return "\\";
            }
            else if (tail.length > 0) {
                return tail;
            }
            else {
                return "";
            }
        }
        else if (isAbsolute) {
            if (tail.length > 0)
                return `${device}\\${tail}`;
            else
                return `${device}\\`;
        }
        else if (tail.length > 0) {
            return device + tail;
        }
        else {
            return device;
        }
    }
    exports_9("normalize", normalize);
    function isAbsolute(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return false;
        const code = path.charCodeAt(0);
        if (utils_ts_1.isPathSeparator(code)) {
            return true;
        }
        else if (utils_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (len > 2 && path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                if (utils_ts_1.isPathSeparator(path.charCodeAt(2)))
                    return true;
            }
        }
        return false;
    }
    exports_9("isAbsolute", isAbsolute);
    function join(...paths) {
        const pathsCount = paths.length;
        if (pathsCount === 0)
            return ".";
        let joined;
        let firstPart = null;
        for (let i = 0; i < pathsCount; ++i) {
            const path = paths[i];
            utils_ts_1.assertPath(path);
            if (path.length > 0) {
                if (joined === undefined)
                    joined = firstPart = path;
                else
                    joined += `\\${path}`;
            }
        }
        if (joined === undefined)
            return ".";
        // Make sure that the joined path doesn't start with two slashes, because
        // normalize() will mistake it for an UNC path then.
        //
        // This step is skipped when it is very clear that the user actually
        // intended to point at an UNC path. This is assumed when the first
        // non-empty string arguments starts with exactly two slashes followed by
        // at least one more non-slash character.
        //
        // Note that for normalize() to treat a path as an UNC path it needs to
        // have at least 2 components, so we don't filter for that here.
        // This means that the user can use join to construct UNC paths from
        // a server name and a share name; for example:
        //   path.join('//server', 'share') -> '\\\\server\\share\\')
        let needsReplace = true;
        let slashCount = 0;
        asserts_ts_3.assert(firstPart != null);
        if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
            ++slashCount;
            const firstLen = firstPart.length;
            if (firstLen > 1) {
                if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
                    ++slashCount;
                    if (firstLen > 2) {
                        if (utils_ts_1.isPathSeparator(firstPart.charCodeAt(2)))
                            ++slashCount;
                        else {
                            // We matched a UNC path in the first part
                            needsReplace = false;
                        }
                    }
                }
            }
        }
        if (needsReplace) {
            // Find any more consecutive slashes we need to replace
            for (; slashCount < joined.length; ++slashCount) {
                if (!utils_ts_1.isPathSeparator(joined.charCodeAt(slashCount)))
                    break;
            }
            // Replace the slashes if needed
            if (slashCount >= 2)
                joined = `\\${joined.slice(slashCount)}`;
        }
        return normalize(joined);
    }
    exports_9("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
        utils_ts_1.assertPath(from);
        utils_ts_1.assertPath(to);
        if (from === to)
            return "";
        const fromOrig = resolve(from);
        const toOrig = resolve(to);
        if (fromOrig === toOrig)
            return "";
        from = fromOrig.toLowerCase();
        to = toOrig.toLowerCase();
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 0;
        let fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; fromEnd - 1 > fromStart; --fromEnd) {
            if (from.charCodeAt(fromEnd - 1) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 0;
        let toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        // Trim trailing backslashes (applicable to UNC paths only)
        for (; toEnd - 1 > toStart; --toEnd) {
            if (to.charCodeAt(toEnd - 1) !== constants_ts_2.CHAR_BACKWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
                        return toOrig.slice(toStart + i + 1);
                    }
                    else if (i === 2) {
                        // We get here if `from` is the device root.
                        // For example: from='C:\\'; to='C:\\foo'
                        return toOrig.slice(toStart + i);
                    }
                }
                if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='C:\\foo\\bar'; to='C:\\foo'
                        lastCommonSep = i;
                    }
                    else if (i === 2) {
                        // We get here if `to` is the device root.
                        // For example: from='C:\\foo\\bar'; to='C:\\'
                        lastCommonSep = 3;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === constants_ts_2.CHAR_BACKWARD_SLASH)
                lastCommonSep = i;
        }
        // We found a mismatch before the first common path separator was seen, so
        // return the original `to`.
        if (i !== length && lastCommonSep === -1) {
            return toOrig;
        }
        let out = "";
        if (lastCommonSep === -1)
            lastCommonSep = 0;
        // Generate the relative path based on the path difference between `to` and
        // `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "\\..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + toOrig.slice(toStart + lastCommonSep, toEnd);
        else {
            toStart += lastCommonSep;
            if (toOrig.charCodeAt(toStart) === constants_ts_2.CHAR_BACKWARD_SLASH)
                ++toStart;
            return toOrig.slice(toStart, toEnd);
        }
    }
    exports_9("relative", relative);
    function toNamespacedPath(path) {
        // Note: this will *probably* throw somewhere.
        if (typeof path !== "string")
            return path;
        if (path.length === 0)
            return "";
        const resolvedPath = resolve(path);
        if (resolvedPath.length >= 3) {
            if (resolvedPath.charCodeAt(0) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                // Possible UNC root
                if (resolvedPath.charCodeAt(1) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                    const code = resolvedPath.charCodeAt(2);
                    if (code !== constants_ts_2.CHAR_QUESTION_MARK && code !== constants_ts_2.CHAR_DOT) {
                        // Matched non-long UNC root, convert the path to a long UNC path
                        return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
                // Possible device root
                if (resolvedPath.charCodeAt(1) === constants_ts_2.CHAR_COLON &&
                    resolvedPath.charCodeAt(2) === constants_ts_2.CHAR_BACKWARD_SLASH) {
                    // Matched device root, convert the path to a long UNC path
                    return `\\\\?\\${resolvedPath}`;
                }
            }
        }
        return path;
    }
    exports_9("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
        utils_ts_1.assertPath(path);
        const len = path.length;
        if (len === 0)
            return ".";
        let rootEnd = -1;
        let end = -1;
        let matchedSlash = true;
        let offset = 0;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = offset = 1;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                return path;
                            }
                            if (j !== last) {
                                // We matched a UNC root with leftovers
                                // Offset by 1 to include the separator after the UNC root to
                                // treat it as a "normal root" on top of a (UNC) root
                                rootEnd = offset = j + 1;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    rootEnd = offset = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2)))
                            rootEnd = offset = 3;
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            return path;
        }
        for (let i = len - 1; i >= offset; --i) {
            if (utils_ts_1.isPathSeparator(path.charCodeAt(i))) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1) {
            if (rootEnd === -1)
                return ".";
            else
                end = rootEnd;
        }
        return path.slice(0, end);
    }
    exports_9("dirname", dirname);
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string")
            throw new TypeError('"ext" argument must be a string');
        utils_ts_1.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2) {
            const drive = path.charCodeAt(0);
            if (utils_ts_1.isWindowsDeviceRoot(drive)) {
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON)
                    start = 2;
            }
        }
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= start; --i) {
                const code = path.charCodeAt(i);
                if (utils_ts_1.isPathSeparator(code)) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= start; --i) {
                if (utils_ts_1.isPathSeparator(path.charCodeAt(i))) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports_9("basename", basename);
    function extname(path) {
        utils_ts_1.assertPath(path);
        let start = 0;
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Check for a drive letter prefix so as not to mistake the following
        // path separator as an extra separator at the end of the path that can be
        // disregarded
        if (path.length >= 2 &&
            path.charCodeAt(1) === constants_ts_2.CHAR_COLON &&
            utils_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))) {
            start = startPart = 2;
        }
        for (let i = path.length - 1; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (utils_ts_1.isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_2.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports_9("extname", extname);
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return utils_ts_1._format("\\", pathObject);
    }
    exports_9("format", format);
    function parse(path) {
        utils_ts_1.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        const len = path.length;
        if (len === 0)
            return ret;
        let rootEnd = 0;
        let code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
            if (utils_ts_1.isPathSeparator(code)) {
                // Possible UNC root
                rootEnd = 1;
                if (utils_ts_1.isPathSeparator(path.charCodeAt(1))) {
                    // Matched double path separator at beginning
                    let j = 2;
                    let last = j;
                    // Match 1 or more non-path separators
                    for (; j < len; ++j) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                            break;
                    }
                    if (j < len && j !== last) {
                        // Matched!
                        last = j;
                        // Match 1 or more path separators
                        for (; j < len; ++j) {
                            if (!utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                break;
                        }
                        if (j < len && j !== last) {
                            // Matched!
                            last = j;
                            // Match 1 or more non-path separators
                            for (; j < len; ++j) {
                                if (utils_ts_1.isPathSeparator(path.charCodeAt(j)))
                                    break;
                            }
                            if (j === len) {
                                // We matched a UNC root only
                                rootEnd = j;
                            }
                            else if (j !== last) {
                                // We matched a UNC root with leftovers
                                rootEnd = j + 1;
                            }
                        }
                    }
                }
            }
            else if (utils_ts_1.isWindowsDeviceRoot(code)) {
                // Possible device root
                if (path.charCodeAt(1) === constants_ts_2.CHAR_COLON) {
                    rootEnd = 2;
                    if (len > 2) {
                        if (utils_ts_1.isPathSeparator(path.charCodeAt(2))) {
                            if (len === 3) {
                                // `path` contains just a drive root, exit early to avoid
                                // unnecessary work
                                ret.root = ret.dir = path;
                                return ret;
                            }
                            rootEnd = 3;
                        }
                    }
                    else {
                        // `path` contains just a drive root, exit early to avoid
                        // unnecessary work
                        ret.root = ret.dir = path;
                        return ret;
                    }
                }
            }
        }
        else if (utils_ts_1.isPathSeparator(code)) {
            // `path` contains just a path separator, exit early to avoid
            // unnecessary work
            ret.root = ret.dir = path;
            return ret;
        }
        if (rootEnd > 0)
            ret.root = path.slice(0, rootEnd);
        let startDot = -1;
        let startPart = rootEnd;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= rootEnd; --i) {
            code = path.charCodeAt(i);
            if (utils_ts_1.isPathSeparator(code)) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_2.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                ret.base = ret.name = path.slice(startPart, end);
            }
        }
        else {
            ret.name = path.slice(startPart, startDot);
            ret.base = path.slice(startPart, end);
            ret.ext = path.slice(startDot, end);
        }
        // If the directory is the root, use the entire root as the `dir` including
        // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
        // trailing slash (`C:\abc\def` -> `C:\abc`).
        if (startPart > 0 && startPart !== rootEnd) {
            ret.dir = path.slice(0, startPart - 1);
        }
        else
            ret.dir = ret.root;
        return ret;
    }
    exports_9("parse", parse);
    return {
        setters: [
            function (constants_ts_2_1) {
                constants_ts_2 = constants_ts_2_1;
            },
            function (utils_ts_1_1) {
                utils_ts_1 = utils_ts_1_1;
            },
            function (asserts_ts_3_1) {
                asserts_ts_3 = asserts_ts_3_1;
            }
        ],
        execute: function () {
            cwd = Deno.cwd, env = Deno.env;
            exports_9("sep", sep = "\\");
            exports_9("delimiter", delimiter = ";");
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/posix", ["https://deno.land/std/path/constants", "https://deno.land/std/path/utils"], function (exports_10, context_10) {
    "use strict";
    var cwd, constants_ts_3, utils_ts_2, sep, delimiter;
    var __moduleName = context_10 && context_10.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
        let resolvedPath = "";
        let resolvedAbsolute = false;
        for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            let path;
            if (i >= 0)
                path = pathSegments[i];
            else
                path = cwd();
            utils_ts_2.assertPath(path);
            // Skip empty entries
            if (path.length === 0) {
                continue;
            }
            resolvedPath = `${path}/${resolvedPath}`;
            resolvedAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        // Normalize the path
        resolvedPath = utils_ts_2.normalizeString(resolvedPath, !resolvedAbsolute, "/", utils_ts_2.isPosixPathSeparator);
        if (resolvedAbsolute) {
            if (resolvedPath.length > 0)
                return `/${resolvedPath}`;
            else
                return "/";
        }
        else if (resolvedPath.length > 0)
            return resolvedPath;
        else
            return ".";
    }
    exports_10("resolve", resolve);
    function normalize(path) {
        utils_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const isAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        const trailingSeparator = path.charCodeAt(path.length - 1) === constants_ts_3.CHAR_FORWARD_SLASH;
        // Normalize the path
        path = utils_ts_2.normalizeString(path, !isAbsolute, "/", utils_ts_2.isPosixPathSeparator);
        if (path.length === 0 && !isAbsolute)
            path = ".";
        if (path.length > 0 && trailingSeparator)
            path += "/";
        if (isAbsolute)
            return `/${path}`;
        return path;
    }
    exports_10("normalize", normalize);
    function isAbsolute(path) {
        utils_ts_2.assertPath(path);
        return path.length > 0 && path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_10("isAbsolute", isAbsolute);
    function join(...paths) {
        if (paths.length === 0)
            return ".";
        let joined;
        for (let i = 0, len = paths.length; i < len; ++i) {
            const path = paths[i];
            utils_ts_2.assertPath(path);
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `/${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalize(joined);
    }
    exports_10("join", join);
    function relative(from, to) {
        utils_ts_2.assertPath(from);
        utils_ts_2.assertPath(to);
        if (from === to)
            return "";
        from = resolve(from);
        to = resolve(to);
        if (from === to)
            return "";
        // Trim any leading backslashes
        let fromStart = 1;
        const fromEnd = from.length;
        for (; fromStart < fromEnd; ++fromStart) {
            if (from.charCodeAt(fromStart) !== constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const fromLen = fromEnd - fromStart;
        // Trim any leading backslashes
        let toStart = 1;
        const toEnd = to.length;
        for (; toStart < toEnd; ++toStart) {
            if (to.charCodeAt(toStart) !== constants_ts_3.CHAR_FORWARD_SLASH)
                break;
        }
        const toLen = toEnd - toStart;
        // Compare paths to find the longest common path from root
        const length = fromLen < toLen ? fromLen : toLen;
        let lastCommonSep = -1;
        let i = 0;
        for (; i <= length; ++i) {
            if (i === length) {
                if (toLen > length) {
                    if (to.charCodeAt(toStart + i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                        // We get here if `from` is the exact base path for `to`.
                        // For example: from='/foo/bar'; to='/foo/bar/baz'
                        return to.slice(toStart + i + 1);
                    }
                    else if (i === 0) {
                        // We get here if `from` is the root
                        // For example: from='/'; to='/foo'
                        return to.slice(toStart + i);
                    }
                }
                else if (fromLen > length) {
                    if (from.charCodeAt(fromStart + i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                        // We get here if `to` is the exact base path for `from`.
                        // For example: from='/foo/bar/baz'; to='/foo/bar'
                        lastCommonSep = i;
                    }
                    else if (i === 0) {
                        // We get here if `to` is the root.
                        // For example: from='/foo'; to='/'
                        lastCommonSep = 0;
                    }
                }
                break;
            }
            const fromCode = from.charCodeAt(fromStart + i);
            const toCode = to.charCodeAt(toStart + i);
            if (fromCode !== toCode)
                break;
            else if (fromCode === constants_ts_3.CHAR_FORWARD_SLASH)
                lastCommonSep = i;
        }
        let out = "";
        // Generate the relative path based on the path difference between `to`
        // and `from`
        for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
            if (i === fromEnd || from.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                if (out.length === 0)
                    out += "..";
                else
                    out += "/..";
            }
        }
        // Lastly, append the rest of the destination (`to`) path that comes after
        // the common path parts
        if (out.length > 0)
            return out + to.slice(toStart + lastCommonSep);
        else {
            toStart += lastCommonSep;
            if (to.charCodeAt(toStart) === constants_ts_3.CHAR_FORWARD_SLASH)
                ++toStart;
            return to.slice(toStart);
        }
    }
    exports_10("relative", relative);
    function toNamespacedPath(path) {
        // Non-op on posix systems
        return path;
    }
    exports_10("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
        utils_ts_2.assertPath(path);
        if (path.length === 0)
            return ".";
        const hasRoot = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        let end = -1;
        let matchedSlash = true;
        for (let i = path.length - 1; i >= 1; --i) {
            if (path.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                if (!matchedSlash) {
                    end = i;
                    break;
                }
            }
            else {
                // We saw the first non-path separator
                matchedSlash = false;
            }
        }
        if (end === -1)
            return hasRoot ? "/" : ".";
        if (hasRoot && end === 1)
            return "//";
        return path.slice(0, end);
    }
    exports_10("dirname", dirname);
    function basename(path, ext = "") {
        if (ext !== undefined && typeof ext !== "string")
            throw new TypeError('"ext" argument must be a string');
        utils_ts_2.assertPath(path);
        let start = 0;
        let end = -1;
        let matchedSlash = true;
        let i;
        if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
            if (ext.length === path.length && ext === path)
                return "";
            let extIdx = ext.length - 1;
            let firstNonSlashEnd = -1;
            for (i = path.length - 1; i >= 0; --i) {
                const code = path.charCodeAt(i);
                if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else {
                    if (firstNonSlashEnd === -1) {
                        // We saw the first non-path separator, remember this index in case
                        // we need it if the extension ends up not matching
                        matchedSlash = false;
                        firstNonSlashEnd = i + 1;
                    }
                    if (extIdx >= 0) {
                        // Try to match the explicit extension
                        if (code === ext.charCodeAt(extIdx)) {
                            if (--extIdx === -1) {
                                // We matched the extension, so mark this as the end of our path
                                // component
                                end = i;
                            }
                        }
                        else {
                            // Extension does not match, so our result is the entire path
                            // component
                            extIdx = -1;
                            end = firstNonSlashEnd;
                        }
                    }
                }
            }
            if (start === end)
                end = firstNonSlashEnd;
            else if (end === -1)
                end = path.length;
            return path.slice(start, end);
        }
        else {
            for (i = path.length - 1; i >= 0; --i) {
                if (path.charCodeAt(i) === constants_ts_3.CHAR_FORWARD_SLASH) {
                    // If we reached a path separator that was not part of a set of path
                    // separators at the end of the string, stop now
                    if (!matchedSlash) {
                        start = i + 1;
                        break;
                    }
                }
                else if (end === -1) {
                    // We saw the first non-path separator, mark this as the end of our
                    // path component
                    matchedSlash = false;
                    end = i + 1;
                }
            }
            if (end === -1)
                return "";
            return path.slice(start, end);
        }
    }
    exports_10("basename", basename);
    function extname(path) {
        utils_ts_2.assertPath(path);
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        for (let i = path.length - 1; i >= 0; --i) {
            const code = path.charCodeAt(i);
            if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_3.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            return "";
        }
        return path.slice(startDot, end);
    }
    exports_10("extname", extname);
    function format(pathObject) {
        /* eslint-disable max-len */
        if (pathObject === null || typeof pathObject !== "object") {
            throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`);
        }
        return utils_ts_2._format("/", pathObject);
    }
    exports_10("format", format);
    function parse(path) {
        utils_ts_2.assertPath(path);
        const ret = { root: "", dir: "", base: "", ext: "", name: "" };
        if (path.length === 0)
            return ret;
        const isAbsolute = path.charCodeAt(0) === constants_ts_3.CHAR_FORWARD_SLASH;
        let start;
        if (isAbsolute) {
            ret.root = "/";
            start = 1;
        }
        else {
            start = 0;
        }
        let startDot = -1;
        let startPart = 0;
        let end = -1;
        let matchedSlash = true;
        let i = path.length - 1;
        // Track the state of characters (if any) we see before our first dot and
        // after any path separator we find
        let preDotState = 0;
        // Get non-dir info
        for (; i >= start; --i) {
            const code = path.charCodeAt(i);
            if (code === constants_ts_3.CHAR_FORWARD_SLASH) {
                // If we reached a path separator that was not part of a set of path
                // separators at the end of the string, stop now
                if (!matchedSlash) {
                    startPart = i + 1;
                    break;
                }
                continue;
            }
            if (end === -1) {
                // We saw the first non-path separator, mark this as the end of our
                // extension
                matchedSlash = false;
                end = i + 1;
            }
            if (code === constants_ts_3.CHAR_DOT) {
                // If this is our first dot, mark it as the start of our extension
                if (startDot === -1)
                    startDot = i;
                else if (preDotState !== 1)
                    preDotState = 1;
            }
            else if (startDot !== -1) {
                // We saw a non-dot and non-path separator before our dot, so we should
                // have a good chance at having a non-empty extension
                preDotState = -1;
            }
        }
        if (startDot === -1 ||
            end === -1 ||
            // We saw a non-dot character immediately before the dot
            preDotState === 0 ||
            // The (right-most) trimmed path component is exactly '..'
            (preDotState === 1 && startDot === end - 1 && startDot === startPart + 1)) {
            if (end !== -1) {
                if (startPart === 0 && isAbsolute) {
                    ret.base = ret.name = path.slice(1, end);
                }
                else {
                    ret.base = ret.name = path.slice(startPart, end);
                }
            }
        }
        else {
            if (startPart === 0 && isAbsolute) {
                ret.name = path.slice(1, startDot);
                ret.base = path.slice(1, end);
            }
            else {
                ret.name = path.slice(startPart, startDot);
                ret.base = path.slice(startPart, end);
            }
            ret.ext = path.slice(startDot, end);
        }
        if (startPart > 0)
            ret.dir = path.slice(0, startPart - 1);
        else if (isAbsolute)
            ret.dir = "/";
        return ret;
    }
    exports_10("parse", parse);
    return {
        setters: [
            function (constants_ts_3_1) {
                constants_ts_3 = constants_ts_3_1;
            },
            function (utils_ts_2_1) {
                utils_ts_2 = utils_ts_2_1;
            }
        ],
        execute: function () {
            cwd = Deno.cwd;
            exports_10("sep", sep = "/");
            exports_10("delimiter", delimiter = ":");
        }
    };
});
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
System.register("https://deno.land/std/path/globrex", [], function (exports_11, context_11) {
    "use strict";
    var isWin, SEP, SEP_ESC, SEP_RAW, GLOBSTAR, WILDCARD, GLOBSTAR_SEGMENT, WILDCARD_SEGMENT;
    var __moduleName = context_11 && context_11.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @param [opts.extended=false] Support advanced ext globbing
     * @param [opts.globstar=false] Support globstar
     * @param [opts.strict=true] be laissez faire about mutiple slashes
     * @param [opts.filepath=""] Parse as filepath for extra path related features
     * @param [opts.flags=""] RegExp globs
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(glob, { extended = false, globstar = false, strict = false, filepath = false, flags = "" } = {}) {
        const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
        let regex = "";
        let segment = "";
        let pathRegexStr = "";
        const pathSegments = [];
        // If we are doing extended matching, this boolean is true when we are inside
        // a group (eg {*.html,*.js}), and false otherwise.
        let inGroup = false;
        let inRange = false;
        // extglob stack. Keep track of scope
        const ext = [];
        // Helper function to build string and segments
        function add(str, options = { split: false, last: false, only: "" }) {
            const { split, last, only } = options;
            if (only !== "path")
                regex += str;
            if (filepath && only !== "regex") {
                pathRegexStr += str.match(sepPattern) ? SEP : str;
                if (split) {
                    if (last)
                        segment += str;
                    if (segment !== "") {
                        // change it 'includes'
                        if (!flags.includes("g"))
                            segment = `^${segment}$`;
                        pathSegments.push(new RegExp(segment, flags));
                    }
                    segment = "";
                }
                else {
                    segment += str;
                }
            }
        }
        let c, n;
        for (let i = 0; i < glob.length; i++) {
            c = glob[i];
            n = glob[i + 1];
            if (["\\", "$", "^", ".", "="].includes(c)) {
                add(`\\${c}`);
                continue;
            }
            if (c.match(sepPattern)) {
                add(SEP, { split: true });
                if (n != null && n.match(sepPattern) && !strict)
                    regex += "?";
                continue;
            }
            if (c === "(") {
                if (ext.length) {
                    add(`${c}?:`);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === ")") {
                if (ext.length) {
                    add(c);
                    const type = ext.pop();
                    if (type === "@") {
                        add("{1}");
                    }
                    else if (type === "!") {
                        add(WILDCARD);
                    }
                    else {
                        add(type);
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "|") {
                if (ext.length) {
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "+") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "@" && extended) {
                if (n === "(") {
                    ext.push(c);
                    continue;
                }
            }
            if (c === "!") {
                if (extended) {
                    if (inRange) {
                        add("^");
                        continue;
                    }
                    if (n === "(") {
                        ext.push(c);
                        add("(?!");
                        i++;
                        continue;
                    }
                    add(`\\${c}`);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "?") {
                if (extended) {
                    if (n === "(") {
                        ext.push(c);
                    }
                    else {
                        add(".");
                    }
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "[") {
                if (inRange && n === ":") {
                    i++; // skip [
                    let value = "";
                    while (glob[++i] !== ":")
                        value += glob[i];
                    if (value === "alnum")
                        add("(?:\\w|\\d)");
                    else if (value === "space")
                        add("\\s");
                    else if (value === "digit")
                        add("\\d");
                    i++; // skip last ]
                    continue;
                }
                if (extended) {
                    inRange = true;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "]") {
                if (extended) {
                    inRange = false;
                    add(c);
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "{") {
                if (extended) {
                    inGroup = true;
                    add("(?:");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "}") {
                if (extended) {
                    inGroup = false;
                    add(")");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === ",") {
                if (inGroup) {
                    add("|");
                    continue;
                }
                add(`\\${c}`);
                continue;
            }
            if (c === "*") {
                if (n === "(" && extended) {
                    ext.push(c);
                    continue;
                }
                // Move over all consecutive "*"'s.
                // Also store the previous and next characters
                const prevChar = glob[i - 1];
                let starCount = 1;
                while (glob[i + 1] === "*") {
                    starCount++;
                    i++;
                }
                const nextChar = glob[i + 1];
                if (!globstar) {
                    // globstar is disabled, so treat any number of "*" as one
                    add(".*");
                }
                else {
                    // globstar is enabled, so determine if this is a globstar segment
                    const isGlobstar = starCount > 1 && // multiple "*"'s
                        // from the start of the segment
                        [SEP_RAW, "/", undefined].includes(prevChar) &&
                        // to the end of the segment
                        [SEP_RAW, "/", undefined].includes(nextChar);
                    if (isGlobstar) {
                        // it's a globstar, so match zero or more path segments
                        add(GLOBSTAR, { only: "regex" });
                        add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
                        i++; // move over the "/"
                    }
                    else {
                        // it's not a globstar, so only match one path segment
                        add(WILDCARD, { only: "regex" });
                        add(WILDCARD_SEGMENT, { only: "path" });
                    }
                }
                continue;
            }
            add(c);
        }
        // When regexp 'g' flag is specified don't
        // constrain the regular expression with ^ & $
        if (!flags.includes("g")) {
            regex = `^${regex}$`;
            segment = `^${segment}$`;
            if (filepath)
                pathRegexStr = `^${pathRegexStr}$`;
        }
        const result = { regex: new RegExp(regex, flags) };
        // Push the last segment
        if (filepath) {
            pathSegments.push(new RegExp(segment, flags));
            result.path = {
                regex: new RegExp(pathRegexStr, flags),
                segments: pathSegments,
                globstar: new RegExp(!flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT, flags)
            };
        }
        return result;
    }
    exports_11("globrex", globrex);
    return {
        setters: [],
        execute: function () {
            isWin = Deno.build.os === "win";
            SEP = isWin ? `(?:\\\\|\\/)` : `\\/`;
            SEP_ESC = isWin ? `\\\\` : `/`;
            SEP_RAW = isWin ? `\\` : `/`;
            GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
            WILDCARD = `(?:[^${SEP_ESC}/]*)`;
            GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
            WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
        }
    };
});
System.register("https://deno.land/std/path/glob", ["https://deno.land/std/path/constants", "https://deno.land/std/path/globrex", "https://deno.land/std/path/mod", "https://deno.land/std/testing/asserts"], function (exports_12, context_12) {
    "use strict";
    var constants_ts_4, globrex_ts_1, mod_ts_1, asserts_ts_4;
    var __moduleName = context_12 && context_12.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
        const result = globrex_ts_1.globrex(glob, {
            extended,
            globstar,
            strict: false,
            filepath: true
        });
        asserts_ts_4.assert(result.path != null);
        return result.path.regex;
    }
    exports_12("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
        const chars = { "{": "}", "(": ")", "[": "]" };
        /* eslint-disable-next-line max-len */
        const regex = /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
        if (str === "") {
            return false;
        }
        let match;
        while ((match = regex.exec(str))) {
            if (match[2])
                return true;
            let idx = match.index + match[0].length;
            // if an open bracket/brace/paren is escaped,
            // set the index to the next closing character
            const open = match[1];
            const close = open ? chars[open] : null;
            if (open && close) {
                const n = str.indexOf(close, idx);
                if (n !== -1) {
                    idx = n + 1;
                }
            }
            str = str.slice(idx);
        }
        return false;
    }
    exports_12("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
        if (!!glob.match(/\0/g)) {
            throw new Error(`Glob contains invalid characters: "${glob}"`);
        }
        if (!globstar) {
            return mod_ts_1.normalize(glob);
        }
        const s = constants_ts_4.SEP_PATTERN.source;
        const badParentPattern = new RegExp(`(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`, "g");
        return mod_ts_1.normalize(glob.replace(badParentPattern, "\0")).replace(/\0/g, "..");
    }
    exports_12("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
        if (!globstar || globs.length == 0) {
            return mod_ts_1.join(...globs);
        }
        if (globs.length === 0)
            return ".";
        let joined;
        for (const glob of globs) {
            const path = glob;
            if (path.length > 0) {
                if (!joined)
                    joined = path;
                else
                    joined += `${constants_ts_4.SEP}${path}`;
            }
        }
        if (!joined)
            return ".";
        return normalizeGlob(joined, { extended, globstar });
    }
    exports_12("joinGlobs", joinGlobs);
    return {
        setters: [
            function (constants_ts_4_1) {
                constants_ts_4 = constants_ts_4_1;
            },
            function (globrex_ts_1_1) {
                globrex_ts_1 = globrex_ts_1_1;
            },
            function (mod_ts_1_1) {
                mod_ts_1 = mod_ts_1_1;
            },
            function (asserts_ts_4_1) {
                asserts_ts_4 = asserts_ts_4_1;
            }
        ],
        execute: function () {
        }
    };
});
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register("https://deno.land/std/path/mod", ["https://deno.land/std/path/win32", "https://deno.land/std/path/posix", "https://deno.land/std/path/constants", "https://deno.land/std/path/glob", "https://deno.land/std/path/globrex"], function (exports_13, context_13) {
    "use strict";
    var _win32, _posix, constants_ts_5, path, win32, posix, resolve, normalize, isAbsolute, join, relative, toNamespacedPath, dirname, basename, extname, format, parse, sep, delimiter;
    var __moduleName = context_13 && context_13.id;
    var exportedNames_1 = {
        "win32": true,
        "posix": true,
        "resolve": true,
        "normalize": true,
        "isAbsolute": true,
        "join": true,
        "relative": true,
        "toNamespacedPath": true,
        "dirname": true,
        "basename": true,
        "extname": true,
        "format": true,
        "parse": true,
        "sep": true,
        "delimiter": true,
        "EOL": true,
        "SEP": true,
        "SEP_PATTERN": true,
        "isWindows": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_13(exports);
    }
    return {
        setters: [
            function (_win32_1) {
                _win32 = _win32_1;
            },
            function (_posix_1) {
                _posix = _posix_1;
            },
            function (constants_ts_5_1) {
                constants_ts_5 = constants_ts_5_1;
                exports_13({
                    "EOL": constants_ts_5_1["EOL"],
                    "SEP": constants_ts_5_1["SEP"],
                    "SEP_PATTERN": constants_ts_5_1["SEP_PATTERN"],
                    "isWindows": constants_ts_5_1["isWindows"]
                });
            },
            function (glob_ts_1_1) {
                exportStar_1(glob_ts_1_1);
            },
            function (globrex_ts_2_1) {
                exportStar_1(globrex_ts_2_1);
            }
        ],
        execute: function () {
            path = constants_ts_5.isWindows ? _win32 : _posix;
            exports_13("win32", win32 = _win32);
            exports_13("posix", posix = _posix);
            exports_13("resolve", resolve = path.resolve);
            exports_13("normalize", normalize = path.normalize);
            exports_13("isAbsolute", isAbsolute = path.isAbsolute);
            exports_13("join", join = path.join);
            exports_13("relative", relative = path.relative);
            exports_13("toNamespacedPath", toNamespacedPath = path.toNamespacedPath);
            exports_13("dirname", dirname = path.dirname);
            exports_13("basename", basename = path.basename);
            exports_13("extname", extname = path.extname);
            exports_13("format", format = path.format);
            exports_13("parse", parse = path.parse);
            exports_13("sep", sep = path.sep);
            exports_13("delimiter", delimiter = path.delimiter);
        }
    };
});
System.register("https://deno.land/std/strings/encode", [], function (exports_14, context_14) {
    "use strict";
    var encoder;
    var __moduleName = context_14 && context_14.id;
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
        return encoder.encode(input);
    }
    exports_14("encode", encode);
    return {
        setters: [],
        execute: function () {
            /** A default TextEncoder instance */
            exports_14("encoder", encoder = new TextEncoder());
        }
    };
});
System.register("https://deno.land/std/strings/decode", [], function (exports_15, context_15) {
    "use strict";
    var decoder;
    var __moduleName = context_15 && context_15.id;
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
        return decoder.decode(input);
    }
    exports_15("decode", decode);
    return {
        setters: [],
        execute: function () {
            /** A default TextDecoder instance */
            exports_15("decoder", decoder = new TextDecoder());
        }
    };
});
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register("https://deno.land/std/strings/pad", [], function (exports_16, context_16) {
    "use strict";
    var __moduleName = context_16 && context_16.id;
    /**
     * Pad helper for strings.
     * Input string is processed to output a string with a minimal length.
     * If the parameter `strict` is set to true, the output string length
     * is equal to the `strLen` parameter.
     * Example:
     *
     *     pad("deno", 6, { char: "*", side: "left" }) // output : "**deno"
     *     pad("deno", 6, { char: "*", side: "right"}) // output : "deno**"
     *     pad("denosorusrex", 6 {
     *       char: "*",
     *       side: "left",
     *       strict: true,
     *       strictSide: "right",
     *       strictChar: "..."
     *     }) // output : "den..."
     *
     * @param input Input string
     * @param strLen Output string lenght
     * @param opts Configuration object
     * @param [opts.char=" "] Character used to fill in
     * @param [opts.side="left"] Side to fill in
     * @param [opts.strict=false] Flag to truncate the string if length > strLen
     * @param [opts.strictChar=""] Character to add if string is truncated
     * @param [opts.strictSide="right"] Side to truncate
     */
    function pad(input, strLen, opts = {
        char: " ",
        strict: false,
        side: "left",
        strictChar: "",
        strictSide: "right"
    }) {
        let out = input;
        const outL = out.length;
        if (outL < strLen) {
            if (!opts.side || opts.side === "left") {
                out = out.padStart(strLen, opts.char);
            }
            else {
                out = out.padEnd(strLen, opts.char);
            }
        }
        else if (opts.strict && outL > strLen) {
            const addChar = opts.strictChar ? opts.strictChar : "";
            if (opts.strictSide === "left") {
                let toDrop = outL - strLen;
                if (opts.strictChar) {
                    toDrop += opts.strictChar.length;
                }
                out = `${addChar}${out.slice(toDrop, outL)}`;
            }
            else {
                out = `${out.substring(0, strLen - addChar.length)}${addChar}`;
            }
        }
        return out;
    }
    exports_16("pad", pad);
    return {
        setters: [],
        execute: function () {
        }
    };
});
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register("https://deno.land/std/strings/mod", ["https://deno.land/std/strings/encode", "https://deno.land/std/strings/decode", "https://deno.land/std/strings/pad"], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    function exportStar_2(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_17(exports);
    }
    return {
        setters: [
            function (encode_ts_1_1) {
                exportStar_2(encode_ts_1_1);
            },
            function (decode_ts_1_1) {
                exportStar_2(decode_ts_1_1);
            },
            function (pad_ts_1_1) {
                exportStar_2(pad_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std/io/util", ["https://deno.land/std/path/mod", "https://deno.land/std/strings/mod"], function (exports_18, context_18) {
    "use strict";
    var Buffer, mkdir, open, path, mod_ts_2;
    var __moduleName = context_18 && context_18.id;
    // `off` is the offset into `dst` where it will at which to begin writing values
    // from `src`.
    // Returns the number of bytes copied.
    function copyBytes(dst, src, off = 0) {
        off = Math.max(0, Math.min(off, dst.byteLength));
        const r = dst.byteLength - off;
        if (src.byteLength > r) {
            src = src.subarray(0, r);
        }
        dst.set(src, off);
        return src.byteLength;
    }
    exports_18("copyBytes", copyBytes);
    function charCode(s) {
        return s.charCodeAt(0);
    }
    exports_18("charCode", charCode);
    function stringsReader(s) {
        return new Buffer(mod_ts_2.encode(s).buffer);
    }
    exports_18("stringsReader", stringsReader);
    /** Create or open a temporal file at specified directory with prefix and
     *  postfix
     * */
    async function tempFile(dir, opts = { prefix: "", postfix: "" }) {
        const r = Math.floor(Math.random() * 1000000);
        const filepath = path.resolve(`${dir}/${opts.prefix || ""}${r}${opts.postfix || ""}`);
        await mkdir(path.dirname(filepath), { recursive: true });
        const file = await open(filepath, "a");
        return { file, filepath };
    }
    exports_18("tempFile", tempFile);
    return {
        setters: [
            function (path_1) {
                path = path_1;
            },
            function (mod_ts_2_1) {
                mod_ts_2 = mod_ts_2_1;
            }
        ],
        execute: function () {
            // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
            Buffer = Deno.Buffer, mkdir = Deno.mkdir, open = Deno.open;
        }
    };
});
// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register("https://deno.land/std/io/bufio", ["https://deno.land/std/io/util", "https://deno.land/std/testing/asserts"], function (exports_19, context_19) {
    "use strict";
    var util_ts_1, asserts_ts_5, DEFAULT_BUF_SIZE, MIN_BUF_SIZE, MAX_CONSECUTIVE_EMPTY_READS, CR, LF, BufferFullError, UnexpectedEOFError, BufReader, BufWriter;
    var __moduleName = context_19 && context_19.id;
    /** Generate longest proper prefix which is also suffix array. */
    function createLPS(pat) {
        const lps = new Uint8Array(pat.length);
        lps[0] = 0;
        let prefixEnd = 0;
        let i = 1;
        while (i < lps.length) {
            if (pat[i] == pat[prefixEnd]) {
                prefixEnd++;
                lps[i] = prefixEnd;
                i++;
            }
            else if (prefixEnd === 0) {
                lps[i] = 0;
                i++;
            }
            else {
                prefixEnd = pat[prefixEnd - 1];
            }
        }
        return lps;
    }
    /** Read delimited bytes from a Reader. */
    async function* readDelim(reader, delim) {
        // Avoid unicode problems
        const delimLen = delim.length;
        const delimLPS = createLPS(delim);
        let inputBuffer = new Deno.Buffer();
        const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
        // Modified KMP
        let inspectIndex = 0;
        let matchIndex = 0;
        while (true) {
            const result = await reader.read(inspectArr);
            if (result === Deno.EOF) {
                // Yield last chunk.
                yield inputBuffer.bytes();
                return;
            }
            if (result < 0) {
                // Discard all remaining and silently fail.
                return;
            }
            const sliceRead = inspectArr.subarray(0, result);
            await Deno.writeAll(inputBuffer, sliceRead);
            let sliceToProcess = inputBuffer.bytes();
            while (inspectIndex < sliceToProcess.length) {
                if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
                    inspectIndex++;
                    matchIndex++;
                    if (matchIndex === delimLen) {
                        // Full match
                        const matchEnd = inspectIndex - delimLen;
                        const readyBytes = sliceToProcess.subarray(0, matchEnd);
                        // Copy
                        const pendingBytes = sliceToProcess.slice(inspectIndex);
                        yield readyBytes;
                        // Reset match, different from KMP.
                        sliceToProcess = pendingBytes;
                        inspectIndex = 0;
                        matchIndex = 0;
                    }
                }
                else {
                    if (matchIndex === 0) {
                        inspectIndex++;
                    }
                    else {
                        matchIndex = delimLPS[matchIndex - 1];
                    }
                }
            }
            // Keep inspectIndex and matchIndex.
            inputBuffer = new Deno.Buffer(sliceToProcess);
        }
    }
    exports_19("readDelim", readDelim);
    /** Read delimited strings from a Reader. */
    async function* readStringDelim(reader, delim) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        for await (const chunk of readDelim(reader, encoder.encode(delim))) {
            yield decoder.decode(chunk);
        }
    }
    exports_19("readStringDelim", readStringDelim);
    /** Read strings line-by-line from a Reader. */
    async function* readLines(reader) {
        yield* readStringDelim(reader, "\n");
    }
    exports_19("readLines", readLines);
    return {
        setters: [
            function (util_ts_1_1) {
                util_ts_1 = util_ts_1_1;
            },
            function (asserts_ts_5_1) {
                asserts_ts_5 = asserts_ts_5_1;
            }
        ],
        execute: function () {
            DEFAULT_BUF_SIZE = 4096;
            MIN_BUF_SIZE = 16;
            MAX_CONSECUTIVE_EMPTY_READS = 100;
            CR = util_ts_1.charCode("\r");
            LF = util_ts_1.charCode("\n");
            BufferFullError = class BufferFullError extends Error {
                constructor(partial) {
                    super("Buffer full");
                    this.partial = partial;
                    this.name = "BufferFullError";
                }
            };
            exports_19("BufferFullError", BufferFullError);
            UnexpectedEOFError = class UnexpectedEOFError extends Error {
                constructor() {
                    super("Unexpected EOF");
                    this.name = "UnexpectedEOFError";
                }
            };
            exports_19("UnexpectedEOFError", UnexpectedEOFError);
            /** BufReader implements buffering for a Reader object. */
            BufReader = class BufReader {
                constructor(rd, size = DEFAULT_BUF_SIZE) {
                    this.r = 0; // buf read position.
                    this.w = 0; // buf write position.
                    this.eof = false;
                    if (size < MIN_BUF_SIZE) {
                        size = MIN_BUF_SIZE;
                    }
                    this._reset(new Uint8Array(size), rd);
                }
                // private lastByte: number;
                // private lastCharSize: number;
                /** return new BufReader unless r is BufReader */
                static create(r, size = DEFAULT_BUF_SIZE) {
                    return r instanceof BufReader ? r : new BufReader(r, size);
                }
                /** Returns the size of the underlying buffer in bytes. */
                size() {
                    return this.buf.byteLength;
                }
                buffered() {
                    return this.w - this.r;
                }
                // Reads a new chunk into the buffer.
                async _fill() {
                    // Slide existing data to beginning.
                    if (this.r > 0) {
                        this.buf.copyWithin(0, this.r, this.w);
                        this.w -= this.r;
                        this.r = 0;
                    }
                    if (this.w >= this.buf.byteLength) {
                        throw Error("bufio: tried to fill full buffer");
                    }
                    // Read new data: try a limited number of times.
                    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
                        const rr = await this.rd.read(this.buf.subarray(this.w));
                        if (rr === Deno.EOF) {
                            this.eof = true;
                            return;
                        }
                        asserts_ts_5.assert(rr >= 0, "negative read");
                        this.w += rr;
                        if (rr > 0) {
                            return;
                        }
                    }
                    throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
                }
                /** Discards any buffered data, resets all state, and switches
                 * the buffered reader to read from r.
                 */
                reset(r) {
                    this._reset(this.buf, r);
                }
                _reset(buf, rd) {
                    this.buf = buf;
                    this.rd = rd;
                    this.eof = false;
                    // this.lastByte = -1;
                    // this.lastCharSize = -1;
                }
                /** reads data into p.
                 * It returns the number of bytes read into p.
                 * The bytes are taken from at most one Read on the underlying Reader,
                 * hence n may be less than len(p).
                 * To read exactly len(p) bytes, use io.ReadFull(b, p).
                 */
                async read(p) {
                    let rr = p.byteLength;
                    if (p.byteLength === 0)
                        return rr;
                    if (this.r === this.w) {
                        if (p.byteLength >= this.buf.byteLength) {
                            // Large read, empty buffer.
                            // Read directly into p to avoid copy.
                            const rr = await this.rd.read(p);
                            const nread = rr === Deno.EOF ? 0 : rr;
                            asserts_ts_5.assert(nread >= 0, "negative read");
                            // if (rr.nread > 0) {
                            //   this.lastByte = p[rr.nread - 1];
                            //   this.lastCharSize = -1;
                            // }
                            return rr;
                        }
                        // One read.
                        // Do not use this.fill, which will loop.
                        this.r = 0;
                        this.w = 0;
                        rr = await this.rd.read(this.buf);
                        if (rr === 0 || rr === Deno.EOF)
                            return rr;
                        asserts_ts_5.assert(rr >= 0, "negative read");
                        this.w += rr;
                    }
                    // copy as much as we can
                    const copied = util_ts_1.copyBytes(p, this.buf.subarray(this.r, this.w), 0);
                    this.r += copied;
                    // this.lastByte = this.buf[this.r - 1];
                    // this.lastCharSize = -1;
                    return copied;
                }
                /** reads exactly `p.length` bytes into `p`.
                 *
                 * If successful, `p` is returned.
                 *
                 * If the end of the underlying stream has been reached, and there are no more
                 * bytes available in the buffer, `readFull()` returns `EOF` instead.
                 *
                 * An error is thrown if some bytes could be read, but not enough to fill `p`
                 * entirely before the underlying stream reported an error or EOF. Any error
                 * thrown will have a `partial` property that indicates the slice of the
                 * buffer that has been successfully filled with data.
                 *
                 * Ported from https://golang.org/pkg/io/#ReadFull
                 */
                async readFull(p) {
                    let bytesRead = 0;
                    while (bytesRead < p.length) {
                        try {
                            const rr = await this.read(p.subarray(bytesRead));
                            if (rr === Deno.EOF) {
                                if (bytesRead === 0) {
                                    return Deno.EOF;
                                }
                                else {
                                    throw new UnexpectedEOFError();
                                }
                            }
                            bytesRead += rr;
                        }
                        catch (err) {
                            err.partial = p.subarray(0, bytesRead);
                            throw err;
                        }
                    }
                    return p;
                }
                /** Returns the next byte [0, 255] or `EOF`. */
                async readByte() {
                    while (this.r === this.w) {
                        if (this.eof)
                            return Deno.EOF;
                        await this._fill(); // buffer is empty.
                    }
                    const c = this.buf[this.r];
                    this.r++;
                    // this.lastByte = c;
                    return c;
                }
                /** readString() reads until the first occurrence of delim in the input,
                 * returning a string containing the data up to and including the delimiter.
                 * If ReadString encounters an error before finding a delimiter,
                 * it returns the data read before the error and the error itself
                 * (often io.EOF).
                 * ReadString returns err != nil if and only if the returned data does not end
                 * in delim.
                 * For simple uses, a Scanner may be more convenient.
                 */
                async readString(delim) {
                    if (delim.length !== 1)
                        throw new Error("Delimiter should be a single character");
                    const buffer = await this.readSlice(delim.charCodeAt(0));
                    if (buffer == Deno.EOF)
                        return Deno.EOF;
                    return new TextDecoder().decode(buffer);
                }
                /** `readLine()` is a low-level line-reading primitive. Most callers should
                 * use `readString('\n')` instead or use a Scanner.
                 *
                 * `readLine()` tries to return a single line, not including the end-of-line
                 * bytes. If the line was too long for the buffer then `more` is set and the
                 * beginning of the line is returned. The rest of the line will be returned
                 * from future calls. `more` will be false when returning the last fragment
                 * of the line. The returned buffer is only valid until the next call to
                 * `readLine()`.
                 *
                 * The text returned from ReadLine does not include the line end ("\r\n" or
                 * "\n").
                 *
                 * When the end of the underlying stream is reached, the final bytes in the
                 * stream are returned. No indication or error is given if the input ends
                 * without a final line end. When there are no more trailing bytes to read,
                 * `readLine()` returns the `EOF` symbol.
                 *
                 * Calling `unreadByte()` after `readLine()` will always unread the last byte
                 * read (possibly a character belonging to the line end) even if that byte is
                 * not part of the line returned by `readLine()`.
                 */
                async readLine() {
                    let line;
                    try {
                        line = await this.readSlice(LF);
                    }
                    catch (err) {
                        let { partial } = err;
                        asserts_ts_5.assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
                        // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
                        // just return whatever is available and set the `more` flag.
                        if (!(err instanceof BufferFullError)) {
                            throw err;
                        }
                        // Handle the case where "\r\n" straddles the buffer.
                        if (!this.eof &&
                            partial.byteLength > 0 &&
                            partial[partial.byteLength - 1] === CR) {
                            // Put the '\r' back on buf and drop it from line.
                            // Let the next call to ReadLine check for "\r\n".
                            asserts_ts_5.assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                            this.r--;
                            partial = partial.subarray(0, partial.byteLength - 1);
                        }
                        return { line: partial, more: !this.eof };
                    }
                    if (line === Deno.EOF) {
                        return Deno.EOF;
                    }
                    if (line.byteLength === 0) {
                        return { line, more: false };
                    }
                    if (line[line.byteLength - 1] == LF) {
                        let drop = 1;
                        if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                            drop = 2;
                        }
                        line = line.subarray(0, line.byteLength - drop);
                    }
                    return { line, more: false };
                }
                /** `readSlice()` reads until the first occurrence of `delim` in the input,
                 * returning a slice pointing at the bytes in the buffer. The bytes stop
                 * being valid at the next read.
                 *
                 * If `readSlice()` encounters an error before finding a delimiter, or the
                 * buffer fills without finding a delimiter, it throws an error with a
                 * `partial` property that contains the entire buffer.
                 *
                 * If `readSlice()` encounters the end of the underlying stream and there are
                 * any bytes left in the buffer, the rest of the buffer is returned. In other
                 * words, EOF is always treated as a delimiter. Once the buffer is empty,
                 * it returns `EOF`.
                 *
                 * Because the data returned from `readSlice()` will be overwritten by the
                 * next I/O operation, most clients should use `readString()` instead.
                 */
                async readSlice(delim) {
                    let s = 0; // search start index
                    let slice;
                    while (true) {
                        // Search buffer.
                        let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
                        if (i >= 0) {
                            i += s;
                            slice = this.buf.subarray(this.r, this.r + i + 1);
                            this.r += i + 1;
                            break;
                        }
                        // EOF?
                        if (this.eof) {
                            if (this.r === this.w) {
                                return Deno.EOF;
                            }
                            slice = this.buf.subarray(this.r, this.w);
                            this.r = this.w;
                            break;
                        }
                        // Buffer full?
                        if (this.buffered() >= this.buf.byteLength) {
                            this.r = this.w;
                            throw new BufferFullError(this.buf);
                        }
                        s = this.w - this.r; // do not rescan area we scanned before
                        // Buffer is not full.
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = slice;
                            throw err;
                        }
                    }
                    // Handle last byte, if any.
                    // const i = slice.byteLength - 1;
                    // if (i >= 0) {
                    //   this.lastByte = slice[i];
                    //   this.lastCharSize = -1
                    // }
                    return slice;
                }
                /** `peek()` returns the next `n` bytes without advancing the reader. The
                 * bytes stop being valid at the next read call.
                 *
                 * When the end of the underlying stream is reached, but there are unread
                 * bytes left in the buffer, those bytes are returned. If there are no bytes
                 * left in the buffer, it returns `EOF`.
                 *
                 * If an error is encountered before `n` bytes are available, `peek()` throws
                 * an error with the `partial` property set to a slice of the buffer that
                 * contains the bytes that were available before the error occurred.
                 */
                async peek(n) {
                    if (n < 0) {
                        throw Error("negative count");
                    }
                    let avail = this.w - this.r;
                    while (avail < n && avail < this.buf.byteLength && !this.eof) {
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = this.buf.subarray(this.r, this.w);
                            throw err;
                        }
                        avail = this.w - this.r;
                    }
                    if (avail === 0 && this.eof) {
                        return Deno.EOF;
                    }
                    else if (avail < n && this.eof) {
                        return this.buf.subarray(this.r, this.r + avail);
                    }
                    else if (avail < n) {
                        throw new BufferFullError(this.buf.subarray(this.r, this.w));
                    }
                    return this.buf.subarray(this.r, this.r + n);
                }
            };
            exports_19("BufReader", BufReader);
            /** BufWriter implements buffering for an deno.Writer object.
             * If an error occurs writing to a Writer, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.Writer.
             */
            BufWriter = class BufWriter {
                constructor(wr, size = DEFAULT_BUF_SIZE) {
                    this.wr = wr;
                    this.n = 0;
                    this.err = null;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                /** return new BufWriter unless w is BufWriter */
                static create(w, size = DEFAULT_BUF_SIZE) {
                    return w instanceof BufWriter ? w : new BufWriter(w, size);
                }
                /** Size returns the size of the underlying buffer in bytes. */
                size() {
                    return this.buf.byteLength;
                }
                /** Discards any unflushed buffered data, clears any error, and
                 * resets b to write its output to w.
                 */
                reset(w) {
                    this.err = null;
                    this.n = 0;
                    this.wr = w;
                }
                /** Flush writes any buffered data to the underlying io.Writer. */
                async flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.n === 0)
                        return;
                    let n = 0;
                    try {
                        n = await this.wr.write(this.buf.subarray(0, this.n));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    if (n < this.n) {
                        if (n > 0) {
                            this.buf.copyWithin(0, n, this.n);
                            this.n -= n;
                        }
                        this.err = new Error("Short write");
                        throw this.err;
                    }
                    this.n = 0;
                }
                /** Returns how many bytes are unused in the buffer. */
                available() {
                    return this.buf.byteLength - this.n;
                }
                /** buffered returns the number of bytes that have been written into the
                 * current buffer.
                 */
                buffered() {
                    return this.n;
                }
                /** Writes the contents of p into the buffer.
                 * Returns the number of bytes written.
                 */
                async write(p) {
                    if (this.err !== null)
                        throw this.err;
                    if (p.length === 0)
                        return 0;
                    let nn = 0;
                    let n = 0;
                    while (p.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            // Large write, empty buffer.
                            // Write directly from p to avoid copy.
                            try {
                                n = await this.wr.write(p);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            n = util_ts_1.copyBytes(this.buf, p, this.n);
                            this.n += n;
                            await this.flush();
                        }
                        nn += n;
                        p = p.subarray(n);
                    }
                    n = util_ts_1.copyBytes(this.buf, p, this.n);
                    this.n += n;
                    nn += n;
                    return nn;
                }
            };
            exports_19("BufWriter", BufWriter);
        }
    };
});
// Based on https://github.com/golang/go/blob/891682/src/net/textproto/
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register("https://deno.land/std/textproto/mod", ["https://deno.land/std/io/bufio", "https://deno.land/std/io/util"], function (exports_20, context_20) {
    "use strict";
    var bufio_ts_1, util_ts_2, asciiDecoder, ProtocolError, TextProtoReader;
    var __moduleName = context_20 && context_20.id;
    function str(buf) {
        if (buf == null) {
            return "";
        }
        else {
            return asciiDecoder.decode(buf);
        }
    }
    function append(a, b) {
        if (a == null) {
            return b;
        }
        else {
            const output = new Uint8Array(a.length + b.length);
            output.set(a, 0);
            output.set(b, a.length);
            return output;
        }
    }
    exports_20("append", append);
    return {
        setters: [
            function (bufio_ts_1_1) {
                bufio_ts_1 = bufio_ts_1_1;
            },
            function (util_ts_2_1) {
                util_ts_2 = util_ts_2_1;
            }
        ],
        execute: function () {
            asciiDecoder = new TextDecoder();
            ProtocolError = class ProtocolError extends Error {
                constructor(msg) {
                    super(msg);
                    this.name = "ProtocolError";
                }
            };
            exports_20("ProtocolError", ProtocolError);
            TextProtoReader = class TextProtoReader {
                constructor(r) {
                    this.r = r;
                }
                /** readLine() reads a single line from the TextProtoReader,
                 * eliding the final \n or \r\n from the returned string.
                 */
                async readLine() {
                    const s = await this.readLineSlice();
                    if (s === Deno.EOF)
                        return Deno.EOF;
                    return str(s);
                }
                /** ReadMIMEHeader reads a MIME-style header from r.
                 * The header is a sequence of possibly continued Key: Value lines
                 * ending in a blank line.
                 * The returned map m maps CanonicalMIMEHeaderKey(key) to a
                 * sequence of values in the same order encountered in the input.
                 *
                 * For example, consider this input:
                 *
                 *	My-Key: Value 1
                 *	Long-Key: Even
                 *	       Longer Value
                 *	My-Key: Value 2
                 *
                 * Given that input, ReadMIMEHeader returns the map:
                 *
                 *	map[string][]string{
                 *		"My-Key": {"Value 1", "Value 2"},
                 *		"Long-Key": {"Even Longer Value"},
                 *	}
                 */
                async readMIMEHeader() {
                    const m = new Headers();
                    let line;
                    // The first line cannot start with a leading space.
                    let buf = await this.r.peek(1);
                    if (buf === Deno.EOF) {
                        return Deno.EOF;
                    }
                    else if (buf[0] == util_ts_2.charCode(" ") || buf[0] == util_ts_2.charCode("\t")) {
                        line = (await this.readLineSlice());
                    }
                    buf = await this.r.peek(1);
                    if (buf === Deno.EOF) {
                        throw new bufio_ts_1.UnexpectedEOFError();
                    }
                    else if (buf[0] == util_ts_2.charCode(" ") || buf[0] == util_ts_2.charCode("\t")) {
                        throw new ProtocolError(`malformed MIME header initial line: ${str(line)}`);
                    }
                    while (true) {
                        const kv = await this.readLineSlice(); // readContinuedLineSlice
                        if (kv === Deno.EOF)
                            throw new bufio_ts_1.UnexpectedEOFError();
                        if (kv.byteLength === 0)
                            return m;
                        // Key ends at first colon; should not have trailing spaces
                        // but they appear in the wild, violating specs, so we remove
                        // them if present.
                        let i = kv.indexOf(util_ts_2.charCode(":"));
                        if (i < 0) {
                            throw new ProtocolError(`malformed MIME header line: ${str(kv)}`);
                        }
                        let endKey = i;
                        while (endKey > 0 && kv[endKey - 1] == util_ts_2.charCode(" ")) {
                            endKey--;
                        }
                        //let key = canonicalMIMEHeaderKey(kv.subarray(0, endKey));
                        const key = str(kv.subarray(0, endKey));
                        // As per RFC 7230 field-name is a token,
                        // tokens consist of one or more chars.
                        // We could return a ProtocolError here,
                        // but better to be liberal in what we
                        // accept, so if we get an empty key, skip it.
                        if (key == "") {
                            continue;
                        }
                        // Skip initial spaces in value.
                        i++; // skip colon
                        while (i < kv.byteLength &&
                            (kv[i] == util_ts_2.charCode(" ") || kv[i] == util_ts_2.charCode("\t"))) {
                            i++;
                        }
                        const value = str(kv.subarray(i));
                        // In case of invalid header we swallow the error
                        // example: "Audio Mode" => invalid due to space in the key
                        try {
                            m.append(key, value);
                        }
                        catch { }
                    }
                }
                async readLineSlice() {
                    // this.closeDot();
                    let line;
                    while (true) {
                        const r = await this.r.readLine();
                        if (r === Deno.EOF)
                            return Deno.EOF;
                        const { line: l, more } = r;
                        // Avoid the copy if the first call produced a full line.
                        if (!line && !more) {
                            // TODO(ry):
                            // This skipSpace() is definitely misplaced, but I don't know where it
                            // comes from nor how to fix it.
                            if (this.skipSpace(l) === 0) {
                                return new Uint8Array(0);
                            }
                            return l;
                        }
                        // @ts-ignore
                        line = append(line, l);
                        if (!more) {
                            break;
                        }
                    }
                    return line;
                }
                skipSpace(l) {
                    let n = 0;
                    for (let i = 0; i < l.length; i++) {
                        if (l[i] === util_ts_2.charCode(" ") || l[i] === util_ts_2.charCode("\t")) {
                            continue;
                        }
                        n++;
                    }
                    return n;
                }
            };
            exports_20("TextProtoReader", TextProtoReader);
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/src/helpers", [], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    /**
     *
     * Simple http get fetching from given url
     *
     * @param url (String) to fetch
     * @return (Primise<T>) response that came back
     */
    function http_get(url) {
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }
    exports_21("http_get", http_get);
    /**
     *
     * Just strip off HTML tags from a given string
     *
     * @param text (String) to remove the html tags
     * @return (String) without html tags
     */
    function escape_html_tags(text) {
        return text.replace(/<\/?[^>]+(>|$)/g, "");
    }
    exports_21("escape_html_tags", escape_html_tags);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/src/config", [], function (exports_22, context_22) {
    "use strict";
    var stack_api_simple_search, stack_api_advanced_search, stack_api_question_with_all_answers, __title, __intitle, __from_date, __to_date;
    var __moduleName = context_22 && context_22.id;
    return {
        setters: [],
        execute: function () {
            exports_22("stack_api_simple_search", stack_api_simple_search = "https://api.stackexchange.com/2.2/search?site=stackoverflow");
            exports_22("stack_api_advanced_search", stack_api_advanced_search = "https://api.stackexchange.com/2.2/search/advanced?site=stackoverflow");
            exports_22("stack_api_question_with_all_answers", stack_api_question_with_all_answers = "https://api.stackexchange.com/2.2/questions/{id}/answers?site=stackoverflow&filter=!b1MMEcD.mX(B2q");
            exports_22("__title", __title = "&title=");
            exports_22("__intitle", __intitle = "&intitle=");
            exports_22("__from_date", __from_date = "&fromdate=");
            exports_22("__to_date", __to_date = "&todate=");
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/src/interfaces", [], function (exports_23, context_23) {
    "use strict";
    var __moduleName = context_23 && context_23.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/src/api", ["file:///Users/apostolos/Documents/Code/deno/stacksearch/src/helpers", "file:///Users/apostolos/Documents/Code/deno/stacksearch/src/config"], function (exports_24, context_24) {
    "use strict";
    var helpers_ts_1, Config, StackSearch;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (helpers_ts_1_1) {
                helpers_ts_1 = helpers_ts_1_1;
            },
            function (Config_1) {
                Config = Config_1;
            }
        ],
        execute: function () {
            /**
             * Using StackExchange API Version 2.2 to search through the StackOverFlow questions.
             */
            StackSearch = class StackSearch {
                /**
                 * It makes a simple search to the stackoverflow site and gets back all the results matching the search query
                 *
                 * @param title The search query
                 */
                async getQuestions(title) {
                    const data = await helpers_ts_1.http_get(Config.stack_api_simple_search + Config.__intitle + title);
                    return data;
                }
                /**
                 * It makes an advanced search to the stackoverflow site and gets back all the results matching the search query
                 *
                 * @param title The search query
                 */
                async getQuestionsAdvanced(title) {
                    const data = await helpers_ts_1.http_get(Config.stack_api_advanced_search + Config.__title + title);
                    return data;
                }
                /**
                 * Gets all the possible answers from the given question
                 *
                 * @param id Question ID (got from the results of the search api)
                 */
                async getAnswersFromQuestion(id) {
                    const data = await helpers_ts_1.http_get(Config.stack_api_question_with_all_answers.replace(/{id}/gi, id.toString()));
                    return data;
                }
            };
            exports_24("default", new StackSearch());
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/src/prints", ["https://deno.land/std/fmt/colors"], function (exports_25, context_25) {
    "use strict";
    var colors_ts_2;
    var __moduleName = context_25 && context_25.id;
    function empty_line() {
        console.log();
    }
    exports_25("empty_line", empty_line);
    function line_seperator() {
        console.log("-----------------------------------------------------");
    }
    exports_25("line_seperator", line_seperator);
    function help() {
        console.log(colors_ts_2.yellow(colors_ts_2.bold("Description:")));
        console.log("   Search Stack Overflow from your terminal. You can search Stack Overflow questions and browse through the best answers without leaving the terminal!");
        console.log(colors_ts_2.yellow(colors_ts_2.bold("Usage:")));
        console.log("   stacksearch [query]");
        console.log();
        console.log(colors_ts_2.bold(colors_ts_2.magenta("To exit the app type [exit] or [close]")));
    }
    exports_25("help", help);
    function answer(count, title, body, link, score, is_accepted) {
        console.log();
        line_seperator();
        console.log();
        console.log(colors_ts_2.green(colors_ts_2.bold(count + ". " + title)));
        console.log(colors_ts_2.blue("(" + link + ")"));
        console.log(colors_ts_2.bgYellow(colors_ts_2.black("Score: " + score)) +
            "    " +
            (is_accepted ? colors_ts_2.bgGreen(" ✔️  ") : ""));
        console.log();
        console.log(body);
        console.log();
        line_seperator();
        console.log();
    }
    exports_25("answer", answer);
    function not_a_valid_number() {
        console.log(colors_ts_2.red("Please enter a valid number"));
    }
    exports_25("not_a_valid_number", not_a_valid_number);
    function which_answer_message() {
        console.log(colors_ts_2.bold(colors_ts_2.magenta("Enter the number of question to see the answers.")));
    }
    exports_25("which_answer_message", which_answer_message);
    function not_a_number() {
        console.log(colors_ts_2.red("Please enter a number"));
    }
    exports_25("not_a_number", not_a_number);
    function question_not_answered() {
        console.log(colors_ts_2.red("This question is not answered yet!"));
    }
    exports_25("question_not_answered", question_not_answered);
    function no_questions_matching_query() {
        console.log(colors_ts_2.red("Sorry! There are no questions matching your query."));
    }
    exports_25("no_questions_matching_query", no_questions_matching_query);
    return {
        setters: [
            function (colors_ts_2_1) {
                colors_ts_2 = colors_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/src/main", ["https://deno.land/std/flags/mod", "https://deno.land/std/textproto/mod", "https://deno.land/std/strings/mod", "https://deno.land/std/io/bufio", "file:///Users/apostolos/Documents/Code/deno/stacksearch/src/api", "file:///Users/apostolos/Documents/Code/deno/stacksearch/src/prints", "file:///Users/apostolos/Documents/Code/deno/stacksearch/src/helpers"], function (exports_26, context_26) {
    "use strict";
    var mod_ts_3, mod_ts_4, mod_ts_5, bufio_ts_2, api_ts_1, print, helpers_ts_2;
    var __moduleName = context_26 && context_26.id;
    function run() {
        const args = mod_ts_3.parse(Deno.args);
        if (args.h ||
            args.help ||
            (args._.length === 0 && Object.keys(args).length < 2)) {
            print.help();
        }
        else {
            let query = Deno.args.join(" ");
            start_searching(query);
        }
    }
    exports_26("run", run);
    async function start_searching(question) {
        let response = await api_ts_1.default.getQuestionsAdvanced(question);
        let data = response
            .items;
        if (data.length < 1) {
            print.no_questions_matching_query();
            Deno.exit();
        }
        else {
            console.log();
            data.forEach((element, i) => {
                console.log(i + 1 + ". " + element.title);
            });
            console.log();
            print.which_answer_message();
            const tpr = new mod_ts_4.TextProtoReader(new bufio_ts_2.BufReader(Deno.stdin));
            while (true) {
                await Deno.stdout.write(mod_ts_5.encode("> "));
                const line = await tpr.readLine();
                if (line == "close" || line == "exit") {
                    break;
                }
                if (isNaN(Number(line))) {
                    print.not_a_number();
                }
                else {
                    if (Number(line) >= 1 && Number(line) <= data.length) {
                        const choise = Number(line);
                        const questionObject = data[choise - 1];
                        const question_id = questionObject.question_id;
                        let response = await api_ts_1.default
                            .getAnswersFromQuestion(question_id);
                        let answers = response.items;
                        if (answers.length < 1) {
                            console.log(print.question_not_answered());
                        }
                        else {
                            answers.forEach((element, i) => {
                                const title = element.title;
                                const body = helpers_ts_2.escape_html_tags(element.body);
                                const link = data[choise - 1].link;
                                const score = element.score;
                                const is_accepted = element.is_accepted;
                                print.answer(i + 1, title, body, link, score, is_accepted);
                            });
                        }
                    }
                    else {
                        print.not_a_valid_number();
                    }
                }
            }
            Deno.exit();
        }
    }
    return {
        setters: [
            function (mod_ts_3_1) {
                mod_ts_3 = mod_ts_3_1;
            },
            function (mod_ts_4_1) {
                mod_ts_4 = mod_ts_4_1;
            },
            function (mod_ts_5_1) {
                mod_ts_5 = mod_ts_5_1;
            },
            function (bufio_ts_2_1) {
                bufio_ts_2 = bufio_ts_2_1;
            },
            function (api_ts_1_1) {
                api_ts_1 = api_ts_1_1;
            },
            function (print_1) {
                print = print_1;
            },
            function (helpers_ts_2_1) {
                helpers_ts_2 = helpers_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///Users/apostolos/Documents/Code/deno/stacksearch/mod", ["file:///Users/apostolos/Documents/Code/deno/stacksearch/src/main"], function (exports_27, context_27) {
    "use strict";
    var StackSearch;
    var __moduleName = context_27 && context_27.id;
    return {
        setters: [
            function (StackSearch_1) {
                StackSearch = StackSearch_1;
            }
        ],
        execute: function () {
            StackSearch.run();
        }
    };
});

await __inst("file:///Users/apostolos/Documents/Code/deno/stacksearch/mod");
