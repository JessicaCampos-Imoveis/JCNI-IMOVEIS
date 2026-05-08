
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "3.10.4";globalThis.nextVersion = "15.5.16";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__fca94a62._.js
var require_root_of_the_server_fca94a62 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__fca94a62._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__fca94a62._.js", 78500, (e, t, h) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 88912, (e, t, h) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(58217));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, t2) {
        if ("then" === t2) return (t3, h3) => e2.then(t3, h3);
        let h2 = (...h3) => e2.then((e3) => (0, e3[t2])(...h3));
        return h2.then = (h3, n2) => e2.then((e3) => e3[t2]).then(h3, n2), h2;
      } });
    }]);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__cb0ed141._.js
var require_root_of_the_server_cb0ed141 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__cb0ed141._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__cb0ed141._.js", 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, o = Object.getOwnPropertyNames, a = Object.prototype.hasOwnProperty, s = {};
      function l(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function u(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function c(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = u(e2), { domain: i2, expires: o2, httponly: a2, maxage: s2, path: l2, samesite: c2, secure: h2, partitioned: f2, priority: m } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var g, y, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...o2 && { expires: new Date(o2) }, ...a2 && { httpOnly: true }, ..."string" == typeof s2 && { maxAge: Number(s2) }, path: l2, ...c2 && { sameSite: d.includes(g = (g = c2).toLowerCase()) ? g : void 0 }, ...h2 && { secure: true }, ...m && { priority: p.includes(y = (y = m).toLowerCase()) ? y : void 0 }, ...f2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      ((e2, t2) => {
        for (var r2 in t2) n(e2, r2, { get: t2[r2], enumerable: true });
      })(s, { RequestCookies: () => h, ResponseCookies: () => f, parseCookie: () => u, parseSetCookie: () => c, stringifyCookie: () => l }), t.exports = ((e2, t2, r2, s2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let l2 of o(t2)) a.call(e2, l2) || l2 === r2 || n(e2, l2, { get: () => t2[l2], enumerable: !(s2 = i(t2, l2)) || s2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), s);
      var d = ["strict", "lax", "none"], p = ["low", "medium", "high"], h = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let t2 = e2.get("cookie");
          if (t2) for (let [e3, r2] of u(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => l(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => l(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, f = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          let i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (let e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, o2, a2 = [], s2 = 0;
            function l2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, o2 = false; l2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, l2(), i3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (o2 = true, s2 = i3, a2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!o2 || s2 >= e4.length) && a2.push(e4.substring(t3, e4.length));
            }
            return a2;
          }(i2)) {
            let t3 = c(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = l(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(l).join("; ");
        }
      };
    }, 11646, (e) => {
      "use strict";
      function t(e2) {
        return Symbol.for(e2);
      }
      e.s(["DiagConsoleLogger", () => eX, "DiagLogLevel", () => r, "INVALID_SPANID", () => e_, "INVALID_SPAN_CONTEXT", () => eE, "INVALID_TRACEID", () => eS, "ProxyTracer", () => eW, "ProxyTracerProvider", () => eK, "ROOT_CONTEXT", () => l, "SamplingDecision", () => o, "SpanKind", () => a, "SpanStatusCode", () => s, "TraceFlags", () => n, "ValueType", () => i, "baggageEntryMetadataFromString", () => ey, "context", () => N, "createContextKey", () => t, "createNoopMeter", () => Z, "createTraceState", () => e0, "default", () => eV, "defaultTextMapGetter", () => ei, "defaultTextMapSetter", () => eo, "diag", () => I, "isSpanContextValid", () => eD, "isValidSpanId", () => ej, "isValidTraceId", () => eL, "metrics", () => er, "propagation", () => ew, "trace", () => ez], 11646), e.s(["default", () => eV], 47071);
      var r, n, i, o, a, s, l = new function e2(t2) {
        var r2 = this;
        r2._currentContext = t2 ? new Map(t2) : /* @__PURE__ */ new Map(), r2.getValue = function(e3) {
          return r2._currentContext.get(e3);
        }, r2.setValue = function(t3, n2) {
          var i2 = new e2(r2._currentContext);
          return i2._currentContext.set(t3, n2), i2;
        }, r2.deleteValue = function(t3) {
          var n2 = new e2(r2._currentContext);
          return n2._currentContext.delete(t3), n2;
        };
      }(), u = function(e2, t2) {
        var r2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!r2) return e2;
        var n2, i2, o2 = r2.call(e2), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = o2.next()).done; ) a2.push(n2.value);
        } catch (e3) {
          i2 = { error: e3 };
        } finally {
          try {
            n2 && !n2.done && (r2 = o2.return) && r2.call(o2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return a2;
      }, c = function(e2, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, o2 = t2.length; i2 < o2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e2.concat(n2 || Array.prototype.slice.call(t2));
      }, d = function() {
        function e2() {
        }
        return e2.prototype.active = function() {
          return l;
        }, e2.prototype.with = function(e3, t2, r2) {
          for (var n2 = [], i2 = 3; i2 < arguments.length; i2++) n2[i2 - 3] = arguments[i2];
          return t2.call.apply(t2, c([r2], u(n2), false));
        }, e2.prototype.bind = function(e3, t2) {
          return t2;
        }, e2.prototype.enable = function() {
          return this;
        }, e2.prototype.disable = function() {
          return this;
        }, e2;
      }(), p = "object" == typeof globalThis ? globalThis : "object" == typeof self ? self : e.g, h = "1.9.0", f = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/, m = function(e2) {
        var t2 = /* @__PURE__ */ new Set([e2]), r2 = /* @__PURE__ */ new Set(), n2 = e2.match(f);
        if (!n2) return function() {
          return false;
        };
        var i2 = { major: +n2[1], minor: +n2[2], patch: +n2[3], prerelease: n2[4] };
        if (null != i2.prerelease) return function(t3) {
          return t3 === e2;
        };
        function o2(e3) {
          return r2.add(e3), false;
        }
        return function(e3) {
          if (t2.has(e3)) return true;
          if (r2.has(e3)) return false;
          var n3 = e3.match(f);
          if (!n3) return o2(e3);
          var a2 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
          if (null != a2.prerelease || i2.major !== a2.major) return o2(e3);
          if (0 === i2.major) return i2.minor === a2.minor && i2.patch <= a2.patch ? (t2.add(e3), true) : o2(e3);
          return i2.minor <= a2.minor ? (t2.add(e3), true) : o2(e3);
        };
      }(h), g = Symbol.for("opentelemetry.js.api." + h.split(".")[0]);
      function y(e2, t2, r2, n2) {
        void 0 === n2 && (n2 = false);
        var i2, o2 = p[g] = null != (i2 = p[g]) ? i2 : { version: h };
        if (!n2 && o2[e2]) {
          var a2 = Error("@opentelemetry/api: Attempted duplicate registration of API: " + e2);
          return r2.error(a2.stack || a2.message), false;
        }
        if (o2.version !== h) {
          var a2 = Error("@opentelemetry/api: Registration of version v" + o2.version + " for " + e2 + " does not match previously registered API v" + h);
          return r2.error(a2.stack || a2.message), false;
        }
        return o2[e2] = t2, r2.debug("@opentelemetry/api: Registered a global for " + e2 + " v" + h + "."), true;
      }
      function b(e2) {
        var t2, r2, n2 = null == (t2 = p[g]) ? void 0 : t2.version;
        if (n2 && m(n2)) return null == (r2 = p[g]) ? void 0 : r2[e2];
      }
      function v(e2, t2) {
        t2.debug("@opentelemetry/api: Unregistering a global for " + e2 + " v" + h + ".");
        var r2 = p[g];
        r2 && delete r2[e2];
      }
      var w = function(e2, t2) {
        var r2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!r2) return e2;
        var n2, i2, o2 = r2.call(e2), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = o2.next()).done; ) a2.push(n2.value);
        } catch (e3) {
          i2 = { error: e3 };
        } finally {
          try {
            n2 && !n2.done && (r2 = o2.return) && r2.call(o2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return a2;
      }, _ = function(e2, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, o2 = t2.length; i2 < o2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e2.concat(n2 || Array.prototype.slice.call(t2));
      }, S = function() {
        function e2(e3) {
          this._namespace = e3.namespace || "DiagComponentLogger";
        }
        return e2.prototype.debug = function() {
          for (var e3 = [], t2 = 0; t2 < arguments.length; t2++) e3[t2] = arguments[t2];
          return E("debug", this._namespace, e3);
        }, e2.prototype.error = function() {
          for (var e3 = [], t2 = 0; t2 < arguments.length; t2++) e3[t2] = arguments[t2];
          return E("error", this._namespace, e3);
        }, e2.prototype.info = function() {
          for (var e3 = [], t2 = 0; t2 < arguments.length; t2++) e3[t2] = arguments[t2];
          return E("info", this._namespace, e3);
        }, e2.prototype.warn = function() {
          for (var e3 = [], t2 = 0; t2 < arguments.length; t2++) e3[t2] = arguments[t2];
          return E("warn", this._namespace, e3);
        }, e2.prototype.verbose = function() {
          for (var e3 = [], t2 = 0; t2 < arguments.length; t2++) e3[t2] = arguments[t2];
          return E("verbose", this._namespace, e3);
        }, e2;
      }();
      function E(e2, t2, r2) {
        var n2 = b("diag");
        if (n2) return r2.unshift(t2), n2[e2].apply(n2, _([], w(r2), false));
      }
      !function(e2) {
        e2[e2.NONE = 0] = "NONE", e2[e2.ERROR = 30] = "ERROR", e2[e2.WARN = 50] = "WARN", e2[e2.INFO = 60] = "INFO", e2[e2.DEBUG = 70] = "DEBUG", e2[e2.VERBOSE = 80] = "VERBOSE", e2[e2.ALL = 9999] = "ALL";
      }(r || (r = {}));
      var x = function(e2, t2) {
        var r2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!r2) return e2;
        var n2, i2, o2 = r2.call(e2), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = o2.next()).done; ) a2.push(n2.value);
        } catch (e3) {
          i2 = { error: e3 };
        } finally {
          try {
            n2 && !n2.done && (r2 = o2.return) && r2.call(o2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return a2;
      }, R = function(e2, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, o2 = t2.length; i2 < o2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e2.concat(n2 || Array.prototype.slice.call(t2));
      }, C = function() {
        function e2() {
          function e3(e4) {
            return function() {
              for (var t3 = [], r2 = 0; r2 < arguments.length; r2++) t3[r2] = arguments[r2];
              var n2 = b("diag");
              if (n2) return n2[e4].apply(n2, R([], x(t3), false));
            };
          }
          var t2 = this;
          t2.setLogger = function(e4, n2) {
            if (void 0 === n2 && (n2 = { logLevel: r.INFO }), e4 === t2) {
              var i2, o2, a2, s2 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
              return t2.error(null != (i2 = s2.stack) ? i2 : s2.message), false;
            }
            "number" == typeof n2 && (n2 = { logLevel: n2 });
            var l2 = b("diag"), u2 = function(e5, t3) {
              function n3(r2, n4) {
                var i3 = t3[r2];
                return "function" == typeof i3 && e5 >= n4 ? i3.bind(t3) : function() {
                };
              }
              return e5 < r.NONE ? e5 = r.NONE : e5 > r.ALL && (e5 = r.ALL), t3 = t3 || {}, { error: n3("error", r.ERROR), warn: n3("warn", r.WARN), info: n3("info", r.INFO), debug: n3("debug", r.DEBUG), verbose: n3("verbose", r.VERBOSE) };
            }(null != (o2 = n2.logLevel) ? o2 : r.INFO, e4);
            if (l2 && !n2.suppressOverrideMessage) {
              var c2 = null != (a2 = Error().stack) ? a2 : "<failed to generate stacktrace>";
              l2.warn("Current logger will be overwritten from " + c2), u2.warn("Current logger will overwrite one already registered from " + c2);
            }
            return y("diag", u2, t2, true);
          }, t2.disable = function() {
            v("diag", t2);
          }, t2.createComponentLogger = function(e4) {
            return new S(e4);
          }, t2.verbose = e3("verbose"), t2.debug = e3("debug"), t2.info = e3("info"), t2.warn = e3("warn"), t2.error = e3("error");
        }
        return e2.instance = function() {
          return this._instance || (this._instance = new e2()), this._instance;
        }, e2;
      }(), T = function(e2, t2) {
        var r2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!r2) return e2;
        var n2, i2, o2 = r2.call(e2), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = o2.next()).done; ) a2.push(n2.value);
        } catch (e3) {
          i2 = { error: e3 };
        } finally {
          try {
            n2 && !n2.done && (r2 = o2.return) && r2.call(o2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return a2;
      }, k = function(e2, t2, r2) {
        if (r2 || 2 == arguments.length) for (var n2, i2 = 0, o2 = t2.length; i2 < o2; i2++) !n2 && i2 in t2 || (n2 || (n2 = Array.prototype.slice.call(t2, 0, i2)), n2[i2] = t2[i2]);
        return e2.concat(n2 || Array.prototype.slice.call(t2));
      }, O = "context", P = new d(), A = function() {
        function e2() {
        }
        return e2.getInstance = function() {
          return this._instance || (this._instance = new e2()), this._instance;
        }, e2.prototype.setGlobalContextManager = function(e3) {
          return y(O, e3, C.instance());
        }, e2.prototype.active = function() {
          return this._getContextManager().active();
        }, e2.prototype.with = function(e3, t2, r2) {
          for (var n2, i2 = [], o2 = 3; o2 < arguments.length; o2++) i2[o2 - 3] = arguments[o2];
          return (n2 = this._getContextManager()).with.apply(n2, k([e3, t2, r2], T(i2), false));
        }, e2.prototype.bind = function(e3, t2) {
          return this._getContextManager().bind(e3, t2);
        }, e2.prototype._getContextManager = function() {
          return b(O) || P;
        }, e2.prototype.disable = function() {
          this._getContextManager().disable(), v(O, C.instance());
        }, e2;
      }(), N = A.getInstance(), I = C.instance(), L = /* @__PURE__ */ function() {
        var e2 = function(t2, r2) {
          return (e2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e3, t3) {
            e3.__proto__ = t3;
          } || function(e3, t3) {
            for (var r3 in t3) Object.prototype.hasOwnProperty.call(t3, r3) && (e3[r3] = t3[r3]);
          })(t2, r2);
        };
        return function(t2, r2) {
          if ("function" != typeof r2 && null !== r2) throw TypeError("Class extends value " + String(r2) + " is not a constructor or null");
          function n2() {
            this.constructor = t2;
          }
          e2(t2, r2), t2.prototype = null === r2 ? Object.create(r2) : (n2.prototype = r2.prototype, new n2());
        };
      }(), j = function() {
        function e2() {
        }
        return e2.prototype.createGauge = function(e3, t2) {
          return J;
        }, e2.prototype.createHistogram = function(e3, t2) {
          return X;
        }, e2.prototype.createCounter = function(e3, t2) {
          return V;
        }, e2.prototype.createUpDownCounter = function(e3, t2) {
          return F;
        }, e2.prototype.createObservableGauge = function(e3, t2) {
          return Q;
        }, e2.prototype.createObservableCounter = function(e3, t2) {
          return G;
        }, e2.prototype.createObservableUpDownCounter = function(e3, t2) {
          return Y;
        }, e2.prototype.addBatchObservableCallback = function(e3, t2) {
        }, e2.prototype.removeBatchObservableCallback = function(e3) {
        }, e2;
      }(), D = function() {
      }, M = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2.prototype.add = function(e3, t3) {
        }, t2;
      }(D), U = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2.prototype.add = function(e3, t3) {
        }, t2;
      }(D), H = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2.prototype.record = function(e3, t3) {
        }, t2;
      }(D), q = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2.prototype.record = function(e3, t3) {
        }, t2;
      }(D), W = function() {
        function e2() {
        }
        return e2.prototype.addCallback = function(e3) {
        }, e2.prototype.removeCallback = function(e3) {
        }, e2;
      }(), $ = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2;
      }(W), K = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2;
      }(W), B = function(e2) {
        function t2() {
          return null !== e2 && e2.apply(this, arguments) || this;
        }
        return L(t2, e2), t2;
      }(W), z = new j(), V = new M(), J = new H(), X = new q(), F = new U(), G = new $(), Q = new K(), Y = new B();
      function Z() {
        return z;
      }
      var ee = new (function() {
        function e2() {
        }
        return e2.prototype.getMeter = function(e3, t2, r2) {
          return z;
        }, e2;
      }())(), et = "metrics", er = function() {
        function e2() {
        }
        return e2.getInstance = function() {
          return this._instance || (this._instance = new e2()), this._instance;
        }, e2.prototype.setGlobalMeterProvider = function(e3) {
          return y(et, e3, C.instance());
        }, e2.prototype.getMeterProvider = function() {
          return b(et) || ee;
        }, e2.prototype.getMeter = function(e3, t2, r2) {
          return this.getMeterProvider().getMeter(e3, t2, r2);
        }, e2.prototype.disable = function() {
          v(et, C.instance());
        }, e2;
      }().getInstance(), en = function() {
        function e2() {
        }
        return e2.prototype.inject = function(e3, t2) {
        }, e2.prototype.extract = function(e3, t2) {
          return e3;
        }, e2.prototype.fields = function() {
          return [];
        }, e2;
      }(), ei = { get: function(e2, t2) {
        if (null != e2) return e2[t2];
      }, keys: function(e2) {
        return null == e2 ? [] : Object.keys(e2);
      } }, eo = { set: function(e2, t2, r2) {
        null != e2 && (e2[t2] = r2);
      } }, ea = t("OpenTelemetry Baggage Key");
      function es(e2) {
        return e2.getValue(ea) || void 0;
      }
      function el() {
        return es(A.getInstance().active());
      }
      function eu(e2, t2) {
        return e2.setValue(ea, t2);
      }
      function ec(e2) {
        return e2.deleteValue(ea);
      }
      var ed = function(e2, t2) {
        var r2 = "function" == typeof Symbol && e2[Symbol.iterator];
        if (!r2) return e2;
        var n2, i2, o2 = r2.call(e2), a2 = [];
        try {
          for (; (void 0 === t2 || t2-- > 0) && !(n2 = o2.next()).done; ) a2.push(n2.value);
        } catch (e3) {
          i2 = { error: e3 };
        } finally {
          try {
            n2 && !n2.done && (r2 = o2.return) && r2.call(o2);
          } finally {
            if (i2) throw i2.error;
          }
        }
        return a2;
      }, ep = function(e2) {
        var t2 = "function" == typeof Symbol && Symbol.iterator, r2 = t2 && e2[t2], n2 = 0;
        if (r2) return r2.call(e2);
        if (e2 && "number" == typeof e2.length) return { next: function() {
          return e2 && n2 >= e2.length && (e2 = void 0), { value: e2 && e2[n2++], done: !e2 };
        } };
        throw TypeError(t2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
      }, eh = function() {
        function e2(e3) {
          this._entries = e3 ? new Map(e3) : /* @__PURE__ */ new Map();
        }
        return e2.prototype.getEntry = function(e3) {
          var t2 = this._entries.get(e3);
          if (t2) return Object.assign({}, t2);
        }, e2.prototype.getAllEntries = function() {
          return Array.from(this._entries.entries()).map(function(e3) {
            var t2 = ed(e3, 2);
            return [t2[0], t2[1]];
          });
        }, e2.prototype.setEntry = function(t2, r2) {
          var n2 = new e2(this._entries);
          return n2._entries.set(t2, r2), n2;
        }, e2.prototype.removeEntry = function(t2) {
          var r2 = new e2(this._entries);
          return r2._entries.delete(t2), r2;
        }, e2.prototype.removeEntries = function() {
          for (var t2, r2, n2 = [], i2 = 0; i2 < arguments.length; i2++) n2[i2] = arguments[i2];
          var o2 = new e2(this._entries);
          try {
            for (var a2 = ep(n2), s2 = a2.next(); !s2.done; s2 = a2.next()) {
              var l2 = s2.value;
              o2._entries.delete(l2);
            }
          } catch (e3) {
            t2 = { error: e3 };
          } finally {
            try {
              s2 && !s2.done && (r2 = a2.return) && r2.call(a2);
            } finally {
              if (t2) throw t2.error;
            }
          }
          return o2;
        }, e2.prototype.clear = function() {
          return new e2();
        }, e2;
      }(), ef = Symbol("BaggageEntryMetadata"), em = C.instance();
      function eg(e2) {
        return void 0 === e2 && (e2 = {}), new eh(new Map(Object.entries(e2)));
      }
      function ey(e2) {
        return "string" != typeof e2 && (em.error("Cannot create baggage metadata from unknown type: " + typeof e2), e2 = ""), { __TYPE__: ef, toString: function() {
          return e2;
        } };
      }
      var eb = "propagation", ev = new en(), ew = function() {
        function e2() {
          this.createBaggage = eg, this.getBaggage = es, this.getActiveBaggage = el, this.setBaggage = eu, this.deleteBaggage = ec;
        }
        return e2.getInstance = function() {
          return this._instance || (this._instance = new e2()), this._instance;
        }, e2.prototype.setGlobalPropagator = function(e3) {
          return y(eb, e3, C.instance());
        }, e2.prototype.inject = function(e3, t2, r2) {
          return void 0 === r2 && (r2 = eo), this._getGlobalPropagator().inject(e3, t2, r2);
        }, e2.prototype.extract = function(e3, t2, r2) {
          return void 0 === r2 && (r2 = ei), this._getGlobalPropagator().extract(e3, t2, r2);
        }, e2.prototype.fields = function() {
          return this._getGlobalPropagator().fields();
        }, e2.prototype.disable = function() {
          v(eb, C.instance());
        }, e2.prototype._getGlobalPropagator = function() {
          return b(eb) || ev;
        }, e2;
      }().getInstance();
      !function(e2) {
        e2[e2.NONE = 0] = "NONE", e2[e2.SAMPLED = 1] = "SAMPLED";
      }(n || (n = {}));
      var e_ = "0000000000000000", eS = "00000000000000000000000000000000", eE = { traceId: eS, spanId: e_, traceFlags: n.NONE }, ex = function() {
        function e2(e3) {
          void 0 === e3 && (e3 = eE), this._spanContext = e3;
        }
        return e2.prototype.spanContext = function() {
          return this._spanContext;
        }, e2.prototype.setAttribute = function(e3, t2) {
          return this;
        }, e2.prototype.setAttributes = function(e3) {
          return this;
        }, e2.prototype.addEvent = function(e3, t2) {
          return this;
        }, e2.prototype.addLink = function(e3) {
          return this;
        }, e2.prototype.addLinks = function(e3) {
          return this;
        }, e2.prototype.setStatus = function(e3) {
          return this;
        }, e2.prototype.updateName = function(e3) {
          return this;
        }, e2.prototype.end = function(e3) {
        }, e2.prototype.isRecording = function() {
          return false;
        }, e2.prototype.recordException = function(e3, t2) {
        }, e2;
      }(), eR = t("OpenTelemetry Context Key SPAN");
      function eC(e2) {
        return e2.getValue(eR) || void 0;
      }
      function eT() {
        return eC(A.getInstance().active());
      }
      function ek(e2, t2) {
        return e2.setValue(eR, t2);
      }
      function eO(e2) {
        return e2.deleteValue(eR);
      }
      function eP(e2, t2) {
        return ek(e2, new ex(t2));
      }
      function eA(e2) {
        var t2;
        return null == (t2 = eC(e2)) ? void 0 : t2.spanContext();
      }
      var eN = /^([0-9a-f]{32})$/i, eI = /^[0-9a-f]{16}$/i;
      function eL(e2) {
        return eN.test(e2) && e2 !== eS;
      }
      function ej(e2) {
        return eI.test(e2) && e2 !== e_;
      }
      function eD(e2) {
        return eL(e2.traceId) && ej(e2.spanId);
      }
      function eM(e2) {
        return new ex(e2);
      }
      var eU = A.getInstance(), eH = function() {
        function e2() {
        }
        return e2.prototype.startSpan = function(e3, t2, r2) {
          if (void 0 === r2 && (r2 = eU.active()), null == t2 ? void 0 : t2.root) return new ex();
          var n2, i2 = r2 && eA(r2);
          return "object" == typeof (n2 = i2) && "string" == typeof n2.spanId && "string" == typeof n2.traceId && "number" == typeof n2.traceFlags && eD(i2) ? new ex(i2) : new ex();
        }, e2.prototype.startActiveSpan = function(e3, t2, r2, n2) {
          if (!(arguments.length < 2)) {
            2 == arguments.length ? a2 = t2 : 3 == arguments.length ? (i2 = t2, a2 = r2) : (i2 = t2, o2 = r2, a2 = n2);
            var i2, o2, a2, s2 = null != o2 ? o2 : eU.active(), l2 = this.startSpan(e3, i2, s2), u2 = ek(s2, l2);
            return eU.with(u2, a2, void 0, l2);
          }
        }, e2;
      }(), eq = new eH(), eW = function() {
        function e2(e3, t2, r2, n2) {
          this._provider = e3, this.name = t2, this.version = r2, this.options = n2;
        }
        return e2.prototype.startSpan = function(e3, t2, r2) {
          return this._getTracer().startSpan(e3, t2, r2);
        }, e2.prototype.startActiveSpan = function(e3, t2, r2, n2) {
          var i2 = this._getTracer();
          return Reflect.apply(i2.startActiveSpan, i2, arguments);
        }, e2.prototype._getTracer = function() {
          if (this._delegate) return this._delegate;
          var e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
          return e3 ? (this._delegate = e3, this._delegate) : eq;
        }, e2;
      }(), e$ = new (function() {
        function e2() {
        }
        return e2.prototype.getTracer = function(e3, t2, r2) {
          return new eH();
        }, e2;
      }())(), eK = function() {
        function e2() {
        }
        return e2.prototype.getTracer = function(e3, t2, r2) {
          var n2;
          return null != (n2 = this.getDelegateTracer(e3, t2, r2)) ? n2 : new eW(this, e3, t2, r2);
        }, e2.prototype.getDelegate = function() {
          var e3;
          return null != (e3 = this._delegate) ? e3 : e$;
        }, e2.prototype.setDelegate = function(e3) {
          this._delegate = e3;
        }, e2.prototype.getDelegateTracer = function(e3, t2, r2) {
          var n2;
          return null == (n2 = this._delegate) ? void 0 : n2.getTracer(e3, t2, r2);
        }, e2;
      }(), eB = "trace", ez = function() {
        function e2() {
          this._proxyTracerProvider = new eK(), this.wrapSpanContext = eM, this.isSpanContextValid = eD, this.deleteSpan = eO, this.getSpan = eC, this.getActiveSpan = eT, this.getSpanContext = eA, this.setSpan = ek, this.setSpanContext = eP;
        }
        return e2.getInstance = function() {
          return this._instance || (this._instance = new e2()), this._instance;
        }, e2.prototype.setGlobalTracerProvider = function(e3) {
          var t2 = y(eB, this._proxyTracerProvider, C.instance());
          return t2 && this._proxyTracerProvider.setDelegate(e3), t2;
        }, e2.prototype.getTracerProvider = function() {
          return b(eB) || this._proxyTracerProvider;
        }, e2.prototype.getTracer = function(e3, t2) {
          return this.getTracerProvider().getTracer(e3, t2);
        }, e2.prototype.disable = function() {
          v(eB, C.instance()), this._proxyTracerProvider = new eK();
        }, e2;
      }().getInstance();
      let eV = { context: N, diag: I, metrics: er, propagation: ew, trace: ez };
      e.i(47071);
      var eJ = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }], eX = function() {
        for (var e2 = 0; e2 < eJ.length; e2++) this[eJ[e2].n] = /* @__PURE__ */ function(e3) {
          return function() {
            for (var t2 = [], r2 = 0; r2 < arguments.length; r2++) t2[r2] = arguments[r2];
            if (console) {
              var n2 = console[e3];
              if ("function" != typeof n2 && (n2 = console.log), "function" == typeof n2) return n2.apply(console, t2);
            }
          };
        }(eJ[e2].c);
      };
      !function(e2) {
        e2[e2.INT = 0] = "INT", e2[e2.DOUBLE = 1] = "DOUBLE";
      }(i || (i = {})), function(e2) {
        e2[e2.NOT_RECORD = 0] = "NOT_RECORD", e2[e2.RECORD = 1] = "RECORD", e2[e2.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
      }(o || (o = {})), function(e2) {
        e2[e2.INTERNAL = 0] = "INTERNAL", e2[e2.SERVER = 1] = "SERVER", e2[e2.CLIENT = 2] = "CLIENT", e2[e2.PRODUCER = 3] = "PRODUCER", e2[e2.CONSUMER = 4] = "CONSUMER";
      }(a || (a = {})), function(e2) {
        e2[e2.UNSET = 0] = "UNSET", e2[e2.OK = 1] = "OK", e2[e2.ERROR = 2] = "ERROR";
      }(s || (s = {}));
      var eF = "[_0-9a-z-*/]", eG = RegExp("^(?:[a-z]" + eF + "{0,255}|" + ("[a-z0-9]" + eF + "{0,240}@[a-z]") + eF + "{0,13})$"), eQ = /^[ -~]{0,255}[!-~]$/, eY = /,|=/, eZ = function() {
        function e2(e3) {
          this._internalState = /* @__PURE__ */ new Map(), e3 && this._parse(e3);
        }
        return e2.prototype.set = function(e3, t2) {
          var r2 = this._clone();
          return r2._internalState.has(e3) && r2._internalState.delete(e3), r2._internalState.set(e3, t2), r2;
        }, e2.prototype.unset = function(e3) {
          var t2 = this._clone();
          return t2._internalState.delete(e3), t2;
        }, e2.prototype.get = function(e3) {
          return this._internalState.get(e3);
        }, e2.prototype.serialize = function() {
          var e3 = this;
          return this._keys().reduce(function(t2, r2) {
            return t2.push(r2 + "=" + e3.get(r2)), t2;
          }, []).join(",");
        }, e2.prototype._parse = function(e3) {
          !(e3.length > 512) && (this._internalState = e3.split(",").reverse().reduce(function(e4, t2) {
            var r2 = t2.trim(), n2 = r2.indexOf("=");
            if (-1 !== n2) {
              var i2 = r2.slice(0, n2), o2 = r2.slice(n2 + 1, t2.length);
              eG.test(i2) && eQ.test(o2) && !eY.test(o2) && e4.set(i2, o2);
            }
            return e4;
          }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
        }, e2.prototype._keys = function() {
          return Array.from(this._internalState.keys()).reverse();
        }, e2.prototype._clone = function() {
          var t2 = new e2();
          return t2._internalState = new Map(this._internalState), t2;
        }, e2;
      }();
      function e0(e2) {
        return new eZ(e2);
      }
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "undefined" != typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2 = {};
        (() => {
          e2.parse = function(e3, r3) {
            if ("string" != typeof e3) throw TypeError("argument str must be a string");
            for (var i2 = {}, o = e3.split(n), a = (r3 || {}).decode || t2, s = 0; s < o.length; s++) {
              var l = o[s], u = l.indexOf("=");
              if (!(u < 0)) {
                var c = l.substr(0, u).trim(), d = l.substr(++u, l.length).trim();
                '"' == d[0] && (d = d.slice(1, -1)), void 0 == i2[c] && (i2[c] = function(e4, t3) {
                  try {
                    return t3(e4);
                  } catch (t4) {
                    return e4;
                  }
                }(d, a));
              }
            }
            return i2;
          }, e2.serialize = function(e3, t3, n2) {
            var o = n2 || {}, a = o.encode || r2;
            if ("function" != typeof a) throw TypeError("option encode is invalid");
            if (!i.test(e3)) throw TypeError("argument name is invalid");
            var s = a(t3);
            if (s && !i.test(s)) throw TypeError("argument val is invalid");
            var l = e3 + "=" + s;
            if (null != o.maxAge) {
              var u = o.maxAge - 0;
              if (isNaN(u) || !isFinite(u)) throw TypeError("option maxAge is invalid");
              l += "; Max-Age=" + Math.floor(u);
            }
            if (o.domain) {
              if (!i.test(o.domain)) throw TypeError("option domain is invalid");
              l += "; Domain=" + o.domain;
            }
            if (o.path) {
              if (!i.test(o.path)) throw TypeError("option path is invalid");
              l += "; Path=" + o.path;
            }
            if (o.expires) {
              if ("function" != typeof o.expires.toUTCString) throw TypeError("option expires is invalid");
              l += "; Expires=" + o.expires.toUTCString();
            }
            if (o.httpOnly && (l += "; HttpOnly"), o.secure && (l += "; Secure"), o.sameSite) switch ("string" == typeof o.sameSite ? o.sameSite.toLowerCase() : o.sameSite) {
              case true:
              case "strict":
                l += "; SameSite=Strict";
                break;
              case "lax":
                l += "; SameSite=Lax";
                break;
              case "none":
                l += "; SameSite=None";
                break;
              default:
                throw TypeError("option sameSite is invalid");
            }
            return l;
          };
          var t2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
        })(), t.exports = e2;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        var e2 = { 993: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function o(e4, t3, n3, o2, a2) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var s2 = new i2(n3, o2 || e4, a2), l = r3 ? r3 + t3 : t3;
            return e4._events[l] ? e4._events[l].fn ? e4._events[l] = [e4._events[l], s2] : e4._events[l].push(s2) : (e4._events[l] = s2, e4._eventsCount++), e4;
          }
          function a(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function s() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), s.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, s.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, o2 = n3.length, a2 = Array(o2); i3 < o2; i3++) a2[i3] = n3[i3].fn;
            return a2;
          }, s.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, s.prototype.emit = function(e4, t3, n3, i3, o2, a2) {
            var s2 = r3 ? r3 + e4 : e4;
            if (!this._events[s2]) return false;
            var l, u, c = this._events[s2], d = arguments.length;
            if (c.fn) {
              switch (c.once && this.removeListener(e4, c.fn, void 0, true), d) {
                case 1:
                  return c.fn.call(c.context), true;
                case 2:
                  return c.fn.call(c.context, t3), true;
                case 3:
                  return c.fn.call(c.context, t3, n3), true;
                case 4:
                  return c.fn.call(c.context, t3, n3, i3), true;
                case 5:
                  return c.fn.call(c.context, t3, n3, i3, o2), true;
                case 6:
                  return c.fn.call(c.context, t3, n3, i3, o2, a2), true;
              }
              for (u = 1, l = Array(d - 1); u < d; u++) l[u - 1] = arguments[u];
              c.fn.apply(c.context, l);
            } else {
              var p, h = c.length;
              for (u = 0; u < h; u++) switch (c[u].once && this.removeListener(e4, c[u].fn, void 0, true), d) {
                case 1:
                  c[u].fn.call(c[u].context);
                  break;
                case 2:
                  c[u].fn.call(c[u].context, t3);
                  break;
                case 3:
                  c[u].fn.call(c[u].context, t3, n3);
                  break;
                case 4:
                  c[u].fn.call(c[u].context, t3, n3, i3);
                  break;
                default:
                  if (!l) for (p = 1, l = Array(d - 1); p < d; p++) l[p - 1] = arguments[p];
                  c[u].fn.apply(c[u].context, l);
              }
            }
            return true;
          }, s.prototype.on = function(e4, t3, r4) {
            return o(this, e4, t3, r4, false);
          }, s.prototype.once = function(e4, t3, r4) {
            return o(this, e4, t3, r4, true);
          }, s.prototype.removeListener = function(e4, t3, n3, i3) {
            var o2 = r3 ? r3 + e4 : e4;
            if (!this._events[o2]) return this;
            if (!t3) return a(this, o2), this;
            var s2 = this._events[o2];
            if (s2.fn) s2.fn !== t3 || i3 && !s2.once || n3 && s2.context !== n3 || a(this, o2);
            else {
              for (var l = 0, u = [], c = s2.length; l < c; l++) (s2[l].fn !== t3 || i3 && !s2[l].once || n3 && s2[l].context !== n3) && u.push(s2[l]);
              u.length ? this._events[o2] = 1 === u.length ? u[0] : u : a(this, o2);
            }
            return this;
          }, s.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && a(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, s.prototype.off = s.prototype.removeListener, s.prototype.addListener = s.prototype.on, s.prefixed = r3, s.EventEmitter = s, e3.exports = s;
        }, 213: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 574: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let o = i2 / 2 | 0, a = n2 + o;
              0 >= r3(e4[a], t3) ? (n2 = ++a, i2 -= o + 1) : i2 = o;
            }
            return n2;
          };
        }, 821: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(574);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 816: (e3, t2, r3) => {
          let n2 = r3(213);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let o = (e4, t3, r4) => new Promise((o2, a) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void o2(e4);
            let s = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  o2(r4());
                } catch (e5) {
                  a(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, s2 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), a(s2);
            }, t3);
            n2(e4.then(o2, a), () => {
              clearTimeout(s);
            });
          });
          e3.exports = o, e3.exports.default = o, e3.exports.TimeoutError = i2;
        } }, r2 = {};
        function n(t2) {
          var i2 = r2[t2];
          if (void 0 !== i2) return i2.exports;
          var o = r2[t2] = { exports: {} }, a = true;
          try {
            e2[t2](o, o.exports, n), a = false;
          } finally {
            a && delete r2[t2];
          }
          return o.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var i = {};
        (() => {
          Object.defineProperty(i, "__esModule", { value: true });
          let e3 = n(993), t2 = n(816), r3 = n(821), o = () => {
          }, a = new t2.TimeoutError();
          i.default = class extends e3 {
            constructor(e4) {
              var t3, n2, i2, a2;
              if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = o, this._resolveIdle = o, !("number" == typeof (e4 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: r3.default }, e4)).intervalCap && e4.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (n2 = null == (t3 = e4.intervalCap) ? void 0 : t3.toString()) ? n2 : ""}\` (${typeof e4.intervalCap})`);
              if (void 0 === e4.interval || !(Number.isFinite(e4.interval) && e4.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (a2 = null == (i2 = e4.interval) ? void 0 : i2.toString()) ? a2 : ""}\` (${typeof e4.interval})`);
              this._carryoverConcurrencyCount = e4.carryoverConcurrencyCount, this._isIntervalIgnored = e4.intervalCap === 1 / 0 || 0 === e4.interval, this._intervalCap = e4.intervalCap, this._interval = e4.interval, this._queue = new e4.queueClass(), this._queueClass = e4.queueClass, this.concurrency = e4.concurrency, this._timeout = e4.timeout, this._throwOnTimeout = true === e4.throwOnTimeout, this._isPaused = false === e4.autoStart;
            }
            get _doesIntervalAllowAnother() {
              return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
            }
            get _doesConcurrentAllowAnother() {
              return this._pendingCount < this._concurrency;
            }
            _next() {
              this._pendingCount--, this._tryToStartAnother(), this.emit("next");
            }
            _resolvePromises() {
              this._resolveEmpty(), this._resolveEmpty = o, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = o, this.emit("idle"));
            }
            _onResumeInterval() {
              this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
            }
            _isIntervalPaused() {
              let e4 = Date.now();
              if (void 0 === this._intervalId) {
                let t3 = this._intervalEnd - e4;
                if (!(t3 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                  this._onResumeInterval();
                }, t3)), true;
                this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
              }
              return false;
            }
            _tryToStartAnother() {
              if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
              if (!this._isPaused) {
                let e4 = !this._isIntervalPaused();
                if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                  let t3 = this._queue.dequeue();
                  return !!t3 && (this.emit("active"), t3(), e4 && this._initializeIntervalIfNeeded(), true);
                }
              }
              return false;
            }
            _initializeIntervalIfNeeded() {
              this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
                this._onInterval();
              }, this._interval), this._intervalEnd = Date.now() + this._interval);
            }
            _onInterval() {
              0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
            }
            _processQueue() {
              for (; this._tryToStartAnother(); ) ;
            }
            get concurrency() {
              return this._concurrency;
            }
            set concurrency(e4) {
              if (!("number" == typeof e4 && e4 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e4}\` (${typeof e4})`);
              this._concurrency = e4, this._processQueue();
            }
            async add(e4, r4 = {}) {
              return new Promise((n2, i2) => {
                let o2 = async () => {
                  this._pendingCount++, this._intervalCount++;
                  try {
                    let o3 = void 0 === this._timeout && void 0 === r4.timeout ? e4() : t2.default(Promise.resolve(e4()), void 0 === r4.timeout ? this._timeout : r4.timeout, () => {
                      (void 0 === r4.throwOnTimeout ? this._throwOnTimeout : r4.throwOnTimeout) && i2(a);
                    });
                    n2(await o3);
                  } catch (e5) {
                    i2(e5);
                  }
                  this._next();
                };
                this._queue.enqueue(o2, r4), this._tryToStartAnother(), this.emit("add");
              });
            }
            async addAll(e4, t3) {
              return Promise.all(e4.map(async (e5) => this.add(e5, t3)));
            }
            start() {
              return this._isPaused && (this._isPaused = false, this._processQueue()), this;
            }
            pause() {
              this._isPaused = true;
            }
            clear() {
              this._queue = new this._queueClass();
            }
            async onEmpty() {
              if (0 !== this._queue.size) return new Promise((e4) => {
                let t3 = this._resolveEmpty;
                this._resolveEmpty = () => {
                  t3(), e4();
                };
              });
            }
            async onIdle() {
              if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e4) => {
                let t3 = this._resolveIdle;
                this._resolveIdle = () => {
                  t3(), e4();
                };
              });
            }
            get size() {
              return this._queue.size;
            }
            sizeBy(e4) {
              return this._queue.filter(e4).length;
            }
            get pending() {
              return this._pendingCount;
            }
            get isPaused() {
              return this._isPaused;
            }
            get timeout() {
              return this._timeout;
            }
            set timeout(e4) {
              this._timeout = e4;
            }
          };
        })(), t.exports = i;
      })();
    }, 51615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(r, { getTestReqInfo: function() {
        return a;
      }, withRequest: function() {
        return o;
      } });
      let n = new (e.r(78500)).AsyncLocalStorage();
      function i(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function o(e2, t2, r2) {
        let o2 = i(e2, t2);
        return o2 ? n.run(o2, r2) : r2();
      }
      function a(e2, t2) {
        let r2 = n.getStore();
        return r2 || (e2 && t2 ? i(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(r, { handleFetch: function() {
        return s;
      }, interceptFetch: function() {
        return l;
      }, reader: function() {
        return o;
      } });
      let i = e.r(25085), o = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function a(e2, t2) {
        let { url: r2, method: i2, headers: o2, body: a2, cache: s2, credentials: l2, integrity: u, mode: c, redirect: d, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(o2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: a2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: l2, integrity: u, mode: c, redirect: d, referrer: p, referrerPolicy: h } };
      }
      async function s(e2, t2) {
        let r2 = (0, i.getTestReqInfo)(t2, o);
        if (!r2) return e2(t2);
        let { testData: s2, proxyPort: l2 } = r2, u = await a(s2, t2), c = await e2(`http://localhost:${l2}`, { method: "POST", body: JSON.stringify(u), next: { internal: true } });
        if (!c.ok) throw Object.defineProperty(Error(`Proxy request failed: ${c.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let d = await c.json(), { api: p } = d;
        switch (p) {
          case "continue":
            return e2(t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            let { status: h, headers: f, body: m } = d.response;
            return new Response(m ? n.Buffer.from(m, "base64") : null, { status: h, headers: new Headers(f) });
          default:
            return p;
        }
      }
      function l(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : s(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true }), !function(e2, t2) {
        for (var r2 in t2) Object.defineProperty(e2, r2, { enumerable: true, get: t2[r2] });
      }(r, { interceptTestApis: function() {
        return o;
      }, wrapRequestHandler: function() {
        return a;
      } });
      let n = e.r(25085), i = e.r(28325);
      function o() {
        return (0, i.interceptFetch)(e.g.fetch);
      }
      function a(e2) {
        return (t2, r2) => (0, n.withRequest)(t2, i.reader, () => e2(t2, r2));
      }
    }, 64445, (e, t, r) => {
      (() => {
        var r2 = { 226: function(t2, r3) {
          !function(n2, i2) {
            "use strict";
            var o = "function", a = "undefined", s = "object", l = "string", u = "major", c = "model", d = "name", p = "type", h = "vendor", f = "version", m = "architecture", g = "console", y = "mobile", b = "tablet", v = "smarttv", w = "wearable", _ = "embedded", S = "Amazon", E = "Apple", x = "ASUS", R = "BlackBerry", C = "Browser", T = "Chrome", k = "Firefox", O = "Google", P = "Huawei", A = "Microsoft", N = "Motorola", I = "Opera", L = "Samsung", j = "Sharp", D = "Sony", M = "Xiaomi", U = "Zebra", H = "Facebook", q = "Chromium OS", W = "Mac OS", $ = function(e2, t3) {
              var r4 = {};
              for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r4[n3] = t3[n3].concat(e2[n3]) : r4[n3] = e2[n3];
              return r4;
            }, K = function(e2) {
              for (var t3 = {}, r4 = 0; r4 < e2.length; r4++) t3[e2[r4].toUpperCase()] = e2[r4];
              return t3;
            }, B = function(e2, t3) {
              return typeof e2 === l && -1 !== z(t3).indexOf(z(e2));
            }, z = function(e2) {
              return e2.toLowerCase();
            }, V = function(e2, t3) {
              if (typeof e2 === l) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === a ? e2 : e2.substring(0, 350);
            }, J = function(e2, t3) {
              for (var r4, n3, a2, l2, u2, c2, d2 = 0; d2 < t3.length && !u2; ) {
                var p2 = t3[d2], h2 = t3[d2 + 1];
                for (r4 = n3 = 0; r4 < p2.length && !u2 && p2[r4]; ) if (u2 = p2[r4++].exec(e2)) for (a2 = 0; a2 < h2.length; a2++) c2 = u2[++n3], typeof (l2 = h2[a2]) === s && l2.length > 0 ? 2 === l2.length ? typeof l2[1] == o ? this[l2[0]] = l2[1].call(this, c2) : this[l2[0]] = l2[1] : 3 === l2.length ? typeof l2[1] !== o || l2[1].exec && l2[1].test ? this[l2[0]] = c2 ? c2.replace(l2[1], l2[2]) : void 0 : this[l2[0]] = c2 ? l2[1].call(this, c2, l2[2]) : void 0 : 4 === l2.length && (this[l2[0]] = c2 ? l2[3].call(this, c2.replace(l2[1], l2[2])) : i2) : this[l2] = c2 || i2;
                d2 += 2;
              }
            }, X = function(e2, t3) {
              for (var r4 in t3) if (typeof t3[r4] === s && t3[r4].length > 0) {
                for (var n3 = 0; n3 < t3[r4].length; n3++) if (B(t3[r4][n3], e2)) return "?" === r4 ? i2 : r4;
              } else if (B(t3[r4], e2)) return "?" === r4 ? i2 : r4;
              return e2;
            }, F = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, G = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [f, [d, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [f, [d, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [d, f], [/opios[\/ ]+([\w\.]+)/i], [f, [d, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [f, [d, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [d, f], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [f, [d, "UC" + C]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [f, [d, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [f, [d, "WeChat"]], [/konqueror\/([\w\.]+)/i], [f, [d, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [f, [d, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [f, [d, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[d, /(.+)/, "$1 Secure " + C], f], [/\bfocus\/([\w\.]+)/i], [f, [d, k + " Focus"]], [/\bopt\/([\w\.]+)/i], [f, [d, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [f, [d, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [f, [d, "Dolphin"]], [/coast\/([\w\.]+)/i], [f, [d, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [f, [d, "MIUI " + C]], [/fxios\/([-\w\.]+)/i], [f, [d, k]], [/\bqihu|(qi?ho?o?|360)browser/i], [[d, "360 " + C]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[d, /(.+)/, "$1 " + C], f], [/(comodo_dragon)\/([\w\.]+)/i], [[d, /_/g, " "], f], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [d, f], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [d], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[d, H], f], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [d, f], [/\bgsa\/([\w\.]+) .*safari\//i], [f, [d, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [f, [d, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [f, [d, T + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[d, T + " WebView"], f], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [f, [d, "Android " + C]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [d, f], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [f, [d, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [f, d], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [d, [f, X, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [d, f], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[d, "Netscape"], f], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [f, [d, k + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [d, f], [/(cobalt)\/([\w\.]+)/i], [d, [f, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[m, "amd64"]], [/(ia32(?=;))/i], [[m, z]], [/((?:i[346]|x)86)[;\)]/i], [[m, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[m, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[m, "armhf"]], [/windows (ce|mobile); ppc;/i], [[m, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[m, /ower/, "", z]], [/(sun4\w)[;\)]/i], [[m, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[m, z]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [h, L], [p, b]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [h, L], [p, y]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [h, E], [p, y]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [h, E], [p, b]], [/(macintosh);/i], [c, [h, E]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [h, j], [p, y]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [h, P], [p, b]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [h, P], [p, y]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [h, M], [p, y]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [h, M], [p, b]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [h, "OPPO"], [p, y]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [h, "Vivo"], [p, y]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [h, "Realme"], [p, y]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [h, N], [p, y]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [h, N], [p, b]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [h, "LG"], [p, b]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [h, "LG"], [p, y]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [h, "Lenovo"], [p, b]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [h, "Nokia"], [p, y]], [/(pixel c)\b/i], [c, [h, O], [p, b]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [h, O], [p, y]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [h, D], [p, y]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [h, D], [p, b]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [h, "OnePlus"], [p, y]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [h, S], [p, b]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [h, S], [p, y]], [/(playbook);[-\w\),; ]+(rim)/i], [c, h, [p, b]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [h, R], [p, y]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [h, x], [p, b]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [h, x], [p, y]], [/(nexus 9)/i], [c, [h, "HTC"], [p, b]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [h, [c, /_/g, " "], [p, y]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [h, "Acer"], [p, b]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [h, "Meizu"], [p, y]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [h, c, [p, y]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [h, c, [p, b]], [/(surface duo)/i], [c, [h, A], [p, b]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [h, "Fairphone"], [p, y]], [/(u304aa)/i], [c, [h, "AT&T"], [p, y]], [/\bsie-(\w*)/i], [c, [h, "Siemens"], [p, y]], [/\b(rct\w+) b/i], [c, [h, "RCA"], [p, b]], [/\b(venue[\d ]{2,7}) b/i], [c, [h, "Dell"], [p, b]], [/\b(q(?:mv|ta)\w+) b/i], [c, [h, "Verizon"], [p, b]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [h, "Barnes & Noble"], [p, b]], [/\b(tm\d{3}\w+) b/i], [c, [h, "NuVision"], [p, b]], [/\b(k88) b/i], [c, [h, "ZTE"], [p, b]], [/\b(nx\d{3}j) b/i], [c, [h, "ZTE"], [p, y]], [/\b(gen\d{3}) b.+49h/i], [c, [h, "Swiss"], [p, y]], [/\b(zur\d{3}) b/i], [c, [h, "Swiss"], [p, b]], [/\b((zeki)?tb.*\b) b/i], [c, [h, "Zeki"], [p, b]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[h, "Dragon Touch"], c, [p, b]], [/\b(ns-?\w{0,9}) b/i], [c, [h, "Insignia"], [p, b]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [h, "NextBook"], [p, b]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[h, "Voice"], c, [p, y]], [/\b(lvtel\-)?(v1[12]) b/i], [[h, "LvTel"], c, [p, y]], [/\b(ph-1) /i], [c, [h, "Essential"], [p, y]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [h, "Envizen"], [p, b]], [/\b(trio[-\w\. ]+) b/i], [c, [h, "MachSpeed"], [p, b]], [/\btu_(1491) b/i], [c, [h, "Rotor"], [p, b]], [/(shield[\w ]+) b/i], [c, [h, "Nvidia"], [p, b]], [/(sprint) (\w+)/i], [h, c, [p, y]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [h, A], [p, y]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [h, U], [p, b]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [h, U], [p, y]], [/smart-tv.+(samsung)/i], [h, [p, v]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [h, L], [p, v]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[h, "LG"], [p, v]], [/(apple) ?tv/i], [h, [c, E + " TV"], [p, v]], [/crkey/i], [[c, T + "cast"], [h, O], [p, v]], [/droid.+aft(\w)( bui|\))/i], [c, [h, S], [p, v]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [h, j], [p, v]], [/(bravia[\w ]+)( bui|\))/i], [c, [h, D], [p, v]], [/(mitv-\w{5}) bui/i], [c, [h, M], [p, v]], [/Hbbtv.*(technisat) (.*);/i], [h, c, [p, v]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[h, V], [c, V], [p, v]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[p, v]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [h, c, [p, g]], [/droid.+; (shield) bui/i], [c, [h, "Nvidia"], [p, g]], [/(playstation [345portablevi]+)/i], [c, [h, D], [p, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [h, A], [p, g]], [/((pebble))app/i], [h, c, [p, w]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [h, E], [p, w]], [/droid.+; (glass) \d/i], [c, [h, O], [p, w]], [/droid.+; (wt63?0{2,3})\)/i], [c, [h, U], [p, w]], [/(quest( 2| pro)?)/i], [c, [h, H], [p, w]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [h, [p, _]], [/(aeobc)\b/i], [c, [h, S], [p, _]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [p, y]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [p, b]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[p, b]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[p, y]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [h, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [f, [d, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [f, [d, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [d, f], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [f, d]], os: [[/microsoft (windows) (vista|xp)/i], [d, f], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [d, [f, X, F]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[d, "Windows"], [f, X, F]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[f, /_/g, "."], [d, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[d, W], [f, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [f, d], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [d, f], [/\(bb(10);/i], [f, [d, R]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [f, [d, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [f, [d, k + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [f, [d, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [f, [d, "watchOS"]], [/crkey\/([\d\.]+)/i], [f, [d, T + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[d, q], f], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [d, f], [/(sunos) ?([\w\.\d]*)/i], [[d, "Solaris"], f], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [d, f]] }, Q = function(e2, t3) {
              if (typeof e2 === s && (t3 = e2, e2 = i2), !(this instanceof Q)) return new Q(e2, t3).getResult();
              var r4 = typeof n2 !== a && n2.navigator ? n2.navigator : i2, g2 = e2 || (r4 && r4.userAgent ? r4.userAgent : ""), v2 = r4 && r4.userAgentData ? r4.userAgentData : i2, w2 = t3 ? $(G, t3) : G, _2 = r4 && r4.userAgent == g2;
              return this.getBrowser = function() {
                var e3, t4 = {};
                return t4[d] = i2, t4[f] = i2, J.call(t4, g2, w2.browser), t4[u] = typeof (e3 = t4[f]) === l ? e3.replace(/[^\d\.]/g, "").split(".")[0] : i2, _2 && r4 && r4.brave && typeof r4.brave.isBrave == o && (t4[d] = "Brave"), t4;
              }, this.getCPU = function() {
                var e3 = {};
                return e3[m] = i2, J.call(e3, g2, w2.cpu), e3;
              }, this.getDevice = function() {
                var e3 = {};
                return e3[h] = i2, e3[c] = i2, e3[p] = i2, J.call(e3, g2, w2.device), _2 && !e3[p] && v2 && v2.mobile && (e3[p] = y), _2 && "Macintosh" == e3[c] && r4 && typeof r4.standalone !== a && r4.maxTouchPoints && r4.maxTouchPoints > 2 && (e3[c] = "iPad", e3[p] = b), e3;
              }, this.getEngine = function() {
                var e3 = {};
                return e3[d] = i2, e3[f] = i2, J.call(e3, g2, w2.engine), e3;
              }, this.getOS = function() {
                var e3 = {};
                return e3[d] = i2, e3[f] = i2, J.call(e3, g2, w2.os), _2 && !e3[d] && v2 && "Unknown" != v2.platform && (e3[d] = v2.platform.replace(/chrome os/i, q).replace(/macos/i, W)), e3;
              }, this.getResult = function() {
                return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
              }, this.getUA = function() {
                return g2;
              }, this.setUA = function(e3) {
                return g2 = typeof e3 === l && e3.length > 350 ? V(e3, 350) : e3, this;
              }, this.setUA(g2), this;
            };
            if (Q.VERSION = "1.0.35", Q.BROWSER = K([d, f, u]), Q.CPU = K([m]), Q.DEVICE = K([c, h, p, g, y, v, b, w, _]), Q.ENGINE = Q.OS = K([d, f]), typeof r3 !== a) t2.exports && (r3 = t2.exports = Q), r3.UAParser = Q;
            else if (typeof define === o && define.amd) e.r, void 0 !== Q && e.v(Q);
            else typeof n2 !== a && (n2.UAParser = Q);
            var Y = typeof n2 !== a && (n2.jQuery || n2.Zepto);
            if (Y && !Y.ua) {
              var Z = new Q();
              Y.ua = Z.getResult(), Y.ua.get = function() {
                return Z.getUA();
              }, Y.ua.set = function(e2) {
                Z.setUA(e2);
                var t3 = Z.getResult();
                for (var r4 in t3) Y.ua[r4] = t3[r4];
              };
            }
          }(this);
        } }, n = {};
        function i(e2) {
          var t2 = n[e2];
          if (void 0 !== t2) return t2.exports;
          var o = n[e2] = { exports: {} }, a = true;
          try {
            r2[e2].call(o.exports, o, o.exports, i), a = false;
          } finally {
            a && delete n[e2];
          }
          return o.exports;
        }
        i.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = i(226);
      })();
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var o = Array.isArray;
      function a() {
      }
      var s = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), p = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), m = Symbol.for("react.lazy"), g = Symbol.iterator, y = Object.prototype.hasOwnProperty, b = Object.assign;
      function v(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: s, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function w(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === s;
      }
      var _ = /\/+/g;
      function S(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function E(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], u2 = 0;
        return !function e3(t3, r3, n3, u3, c2) {
          var d2, p2, h2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var y2 = false;
          if (null === t3) y2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              y2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case s:
                case l:
                  y2 = true;
                  break;
                case m:
                  return e3((y2 = t3._init)(t3._payload), r3, n3, u3, c2);
              }
          }
          if (y2) return c2 = c2(t3), y2 = "" === u3 ? "." + S(t3, 0) : u3, o(c2) ? (n3 = "", null != y2 && (n3 = y2.replace(_, "$&/") + "/"), e3(c2, r3, n3, "", function(e4) {
            return e4;
          })) : null != c2 && (w(c2) && (d2 = c2, p2 = n3 + (null == c2.key || t3 && t3.key === c2.key ? "" : ("" + c2.key).replace(_, "$&/") + "/") + y2, c2 = v(d2.type, p2, d2.props)), r3.push(c2)), 1;
          y2 = 0;
          var b2 = "" === u3 ? "." : u3 + ":";
          if (o(t3)) for (var E2 = 0; E2 < t3.length; E2++) f2 = b2 + S(u3 = t3[E2], E2), y2 += e3(u3, r3, n3, f2, c2);
          else if ("function" == typeof (E2 = null === (h2 = t3) || "object" != typeof h2 ? null : "function" == typeof (h2 = g && h2[g] || h2["@@iterator"]) ? h2 : null)) for (t3 = E2.call(t3), E2 = 0; !(u3 = t3.next()).done; ) f2 = b2 + S(u3 = u3.value, E2++), y2 += e3(u3, r3, n3, f2, c2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(a, a) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, u3, c2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return y2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, u2++);
        }), n2;
      }
      function x(e2) {
        if (-1 === e2._status) {
          var t2 = e2._result;
          (t2 = t2()).then(function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = t3);
          }, function(t3) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = t3);
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function R() {
        return /* @__PURE__ */ new WeakMap();
      }
      function C() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Children = { map: E, forEach: function(e2, t2, r2) {
        E(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return E(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return E(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!w(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = u, r.Profiler = d, r.StrictMode = c, r.Suspense = h, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(R);
          void 0 === (t2 = r2.get(e2)) && (t2 = C(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var o2 = arguments[r2];
            if ("function" == typeof o2 || "object" == typeof o2 && null !== o2) {
              var a2 = t2.o;
              null === a2 && (t2.o = a2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = a2.get(o2)) && (t2 = C(), a2.set(o2, t2));
            } else null === (a2 = t2.p) && (t2.p = a2 = /* @__PURE__ */ new Map()), void 0 === (t2 = a2.get(o2)) && (t2 = C(), a2.set(o2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var s2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = s2;
          } catch (e3) {
            throw (s2 = t2).s = 2, s2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = b({}, e2.props), o2 = e2.key;
        if (null != t2) for (a2 in void 0 !== t2.key && (o2 = "" + t2.key), t2) y.call(t2, a2) && "key" !== a2 && "__self" !== a2 && "__source" !== a2 && ("ref" !== a2 || void 0 !== t2.ref) && (n2[a2] = t2[a2]);
        var a2 = arguments.length - 2;
        if (1 === a2) n2.children = r2;
        else if (1 < a2) {
          for (var s2 = Array(a2), l2 = 0; l2 < a2; l2++) s2[l2] = arguments[l2 + 2];
          n2.children = s2;
        }
        return v(e2.type, o2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, o2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (o2 = "" + t2.key), t2) y.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var a2 = arguments.length - 2;
        if (1 === a2) i2.children = r2;
        else if (1 < a2) {
          for (var s2 = Array(a2), l2 = 0; l2 < a2; l2++) s2[l2] = arguments[l2 + 2];
          i2.children = s2;
        }
        if (e2 && e2.defaultProps) for (n2 in a2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = a2[n2]);
        return v(e2, o2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: p, render: e2 };
      }, r.isValidElement = w, r.lazy = function(e2) {
        return { $$typeof: m, _payload: { _status: -1, _result: e2 }, _init: x };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.2.0-canary-0bdb9206-20250818";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 58217, (e) => {
      "use strict";
      let t, r;
      async function n() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.s(["default", () => t4], 58217);
      let i = null;
      async function o() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        i || (i = n());
        let e10 = await i;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function a(...e10) {
        let t3 = await n();
        try {
          var r2;
          await (null == t3 || null == (r2 = t3.onRequestError) ? void 0 : r2.call(t3, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let s = null;
      function l() {
        return s || (s = o()), s;
      }
      function u(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t3 = new Proxy(function() {
          }, { get(t5, r2) {
            if ("then" === r2) return {};
            throw Object.defineProperty(Error(u(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(u(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r2, n2, i2) {
            if ("function" == typeof i2[0]) return i2[0](t3);
            throw Object.defineProperty(Error(u(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t3 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      l();
      class c extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
        }
      }
      class d extends Error {
        constructor() {
          super(`The request.page has been deprecated in favour of \`URLPattern\`.
  Read more: https://nextjs.org/docs/messages/middleware-request-page
  `);
        }
      }
      class p extends Error {
        constructor() {
          super(`The request.ua has been removed in favour of \`userAgent\` function.
  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent
  `);
        }
      }
      let h = "_N_T_", f = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function m(e10) {
        var t3, r2, n2, i2, o2, a2 = [], s2 = 0;
        function l2() {
          for (; s2 < e10.length && /\s/.test(e10.charAt(s2)); ) s2 += 1;
          return s2 < e10.length;
        }
        for (; s2 < e10.length; ) {
          for (t3 = s2, o2 = false; l2(); ) if ("," === (r2 = e10.charAt(s2))) {
            for (n2 = s2, s2 += 1, l2(), i2 = s2; s2 < e10.length && "=" !== (r2 = e10.charAt(s2)) && ";" !== r2 && "," !== r2; ) s2 += 1;
            s2 < e10.length && "=" === e10.charAt(s2) ? (o2 = true, s2 = i2, a2.push(e10.substring(t3, n2)), t3 = s2) : s2 = n2 + 1;
          } else s2 += 1;
          (!o2 || s2 >= e10.length) && a2.push(e10.substring(t3, e10.length));
        }
        return a2;
      }
      function g(e10) {
        let t3 = {}, r2 = [];
        if (e10) for (let [n2, i2] of e10.entries()) "set-cookie" === n2.toLowerCase() ? (r2.push(...m(i2)), t3[n2] = 1 === r2.length ? r2[0] : r2) : t3[n2] = i2;
        return t3;
      }
      function y(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t3) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t3 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...f, GROUP: { builtinReact: [f.reactServerComponents, f.actionBrowser], serverOnly: [f.reactServerComponents, f.actionBrowser, f.instrument, f.middleware], neutralTarget: [f.apiNode, f.apiEdge], clientOnly: [f.serverSideRendering, f.appPagesBrowser], bundled: [f.reactServerComponents, f.actionBrowser, f.serverSideRendering, f.appPagesBrowser, f.shared, f.instrument, f.middleware], appPages: [f.reactServerComponents, f.serverSideRendering, f.appPagesBrowser, f.actionBrowser] } });
      let b = Symbol("response"), v = Symbol("passThrough"), w = Symbol("waitUntil");
      class _ {
        constructor(e10, t3) {
          this[v] = false, this[w] = t3 ? { kind: "external", function: t3 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[b] || (this[b] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[v] = true;
        }
        waitUntil(e10) {
          if ("external" === this[w].kind) return (0, this[w].function)(e10);
          this[w].promises.push(e10);
        }
      }
      class S extends _ {
        constructor(e10) {
          var t3;
          super(e10.request, null == (t3 = e10.context) ? void 0 : t3.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function E(e10) {
        return e10.replace(/\/$/, "") || "/";
      }
      function x(e10) {
        let t3 = e10.indexOf("#"), r2 = e10.indexOf("?"), n2 = r2 > -1 && (t3 < 0 || r2 < t3);
        return n2 || t3 > -1 ? { pathname: e10.substring(0, n2 ? r2 : t3), query: n2 ? e10.substring(r2, t3 > -1 ? t3 : void 0) : "", hash: t3 > -1 ? e10.slice(t3) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function R(e10, t3) {
        if (!e10.startsWith("/") || !t3) return e10;
        let { pathname: r2, query: n2, hash: i2 } = x(e10);
        return "" + t3 + r2 + n2 + i2;
      }
      function C(e10, t3) {
        if (!e10.startsWith("/") || !t3) return e10;
        let { pathname: r2, query: n2, hash: i2 } = x(e10);
        return "" + r2 + t3 + n2 + i2;
      }
      function T(e10, t3) {
        if ("string" != typeof e10) return false;
        let { pathname: r2 } = x(e10);
        return r2 === t3 || r2.startsWith(t3 + "/");
      }
      let k = /* @__PURE__ */ new WeakMap();
      function O(e10, t3) {
        let r2;
        if (!t3) return { pathname: e10 };
        let n2 = k.get(t3);
        n2 || (n2 = t3.map((e11) => e11.toLowerCase()), k.set(t3, n2));
        let i2 = e10.split("/", 2);
        if (!i2[1]) return { pathname: e10 };
        let o2 = i2[1].toLowerCase(), a2 = n2.indexOf(o2);
        return a2 < 0 ? { pathname: e10 } : (r2 = t3[a2], { pathname: e10 = e10.slice(r2.length + 1) || "/", detectedLocale: r2 });
      }
      let P = /(?!^https?:\/\/)(127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)/;
      function A(e10, t3) {
        return new URL(String(e10).replace(P, "localhost"), t3 && String(t3).replace(P, "localhost"));
      }
      let N = Symbol("NextURLInternal");
      class I {
        constructor(e10, t3, r2) {
          let n2, i2;
          "object" == typeof t3 && "pathname" in t3 || "string" == typeof t3 ? (n2 = t3, i2 = r2 || {}) : i2 = r2 || t3 || {}, this[N] = { url: A(e10, n2 ?? i2.base), options: i2, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t3, r2, n2, i2;
          let o2 = function(e11, t5) {
            var r3, n3;
            let { basePath: i3, i18n: o3, trailingSlash: a3 } = null != (r3 = t5.nextConfig) ? r3 : {}, s3 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : a3 };
            i3 && T(s3.pathname, i3) && (s3.pathname = function(e12, t6) {
              if (!T(e12, t6)) return e12;
              let r4 = e12.slice(t6.length);
              return r4.startsWith("/") ? r4 : "/" + r4;
            }(s3.pathname, i3), s3.basePath = i3);
            let l2 = s3.pathname;
            if (s3.pathname.startsWith("/_next/data/") && s3.pathname.endsWith(".json")) {
              let e12 = s3.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              s3.buildId = e12[0], l2 = "index" !== e12[1] ? "/" + e12.slice(1).join("/") : "/", true === t5.parseData && (s3.pathname = l2);
            }
            if (o3) {
              let e12 = t5.i18nProvider ? t5.i18nProvider.analyze(s3.pathname) : O(s3.pathname, o3.locales);
              s3.locale = e12.detectedLocale, s3.pathname = null != (n3 = e12.pathname) ? n3 : s3.pathname, !e12.detectedLocale && s3.buildId && (e12 = t5.i18nProvider ? t5.i18nProvider.analyze(l2) : O(l2, o3.locales)).detectedLocale && (s3.locale = e12.detectedLocale);
            }
            return s3;
          }(this[N].url.pathname, { nextConfig: this[N].options.nextConfig, parseData: true, i18nProvider: this[N].options.i18nProvider }), a2 = function(e11, t5) {
            let r3;
            if ((null == t5 ? void 0 : t5.host) && !Array.isArray(t5.host)) r3 = t5.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r3 = e11.hostname;
            }
            return r3.toLowerCase();
          }(this[N].url, this[N].options.headers);
          this[N].domainLocale = this[N].options.i18nProvider ? this[N].options.i18nProvider.detectDomainLocale(a2) : function(e11, t5, r3) {
            if (e11) for (let o3 of (r3 && (r3 = r3.toLowerCase()), e11)) {
              var n3, i3;
              if (t5 === (null == (n3 = o3.domain) ? void 0 : n3.split(":", 1)[0].toLowerCase()) || r3 === o3.defaultLocale.toLowerCase() || (null == (i3 = o3.locales) ? void 0 : i3.some((e12) => e12.toLowerCase() === r3))) return o3;
            }
          }(null == (t3 = this[N].options.nextConfig) || null == (e10 = t3.i18n) ? void 0 : e10.domains, a2);
          let s2 = (null == (r2 = this[N].domainLocale) ? void 0 : r2.defaultLocale) || (null == (i2 = this[N].options.nextConfig) || null == (n2 = i2.i18n) ? void 0 : n2.defaultLocale);
          this[N].url.pathname = o2.pathname, this[N].defaultLocale = s2, this[N].basePath = o2.basePath ?? "", this[N].buildId = o2.buildId, this[N].locale = o2.locale ?? s2, this[N].trailingSlash = o2.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t3;
          return t3 = function(e11, t5, r2, n2) {
            if (!t5 || t5 === r2) return e11;
            let i2 = e11.toLowerCase();
            return !n2 && (T(i2, "/api") || T(i2, "/" + t5.toLowerCase())) ? e11 : R(e11, "/" + t5);
          }((e10 = { basePath: this[N].basePath, buildId: this[N].buildId, defaultLocale: this[N].options.forceLocale ? void 0 : this[N].defaultLocale, locale: this[N].locale, pathname: this[N].url.pathname, trailingSlash: this[N].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t3 = E(t3)), e10.buildId && (t3 = C(R(t3, "/_next/data/" + e10.buildId), "/" === e10.pathname ? "index.json" : ".json")), t3 = R(t3, e10.basePath), !e10.buildId && e10.trailingSlash ? t3.endsWith("/") ? t3 : C(t3, "/") : E(t3);
        }
        formatSearch() {
          return this[N].url.search;
        }
        get buildId() {
          return this[N].buildId;
        }
        set buildId(e10) {
          this[N].buildId = e10;
        }
        get locale() {
          return this[N].locale ?? "";
        }
        set locale(e10) {
          var t3, r2;
          if (!this[N].locale || !(null == (r2 = this[N].options.nextConfig) || null == (t3 = r2.i18n) ? void 0 : t3.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[N].locale = e10;
        }
        get defaultLocale() {
          return this[N].defaultLocale;
        }
        get domainLocale() {
          return this[N].domainLocale;
        }
        get searchParams() {
          return this[N].url.searchParams;
        }
        get host() {
          return this[N].url.host;
        }
        set host(e10) {
          this[N].url.host = e10;
        }
        get hostname() {
          return this[N].url.hostname;
        }
        set hostname(e10) {
          this[N].url.hostname = e10;
        }
        get port() {
          return this[N].url.port;
        }
        set port(e10) {
          this[N].url.port = e10;
        }
        get protocol() {
          return this[N].url.protocol;
        }
        set protocol(e10) {
          this[N].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t3 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t3}${this.hash}`;
        }
        set href(e10) {
          this[N].url = A(e10), this.analyze();
        }
        get origin() {
          return this[N].url.origin;
        }
        get pathname() {
          return this[N].url.pathname;
        }
        set pathname(e10) {
          this[N].url.pathname = e10;
        }
        get hash() {
          return this[N].url.hash;
        }
        set hash(e10) {
          this[N].url.hash = e10;
        }
        get search() {
          return this[N].url.search;
        }
        set search(e10) {
          this[N].url.search = e10;
        }
        get password() {
          return this[N].url.password;
        }
        set password(e10) {
          this[N].url.password = e10;
        }
        get username() {
          return this[N].url.username;
        }
        set username(e10) {
          this[N].url.username = e10;
        }
        get basePath() {
          return this[N].basePath;
        }
        set basePath(e10) {
          this[N].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new I(String(this), this[N].options);
        }
      }
      var L, j = e.i(28042);
      let D = Symbol("internal request");
      class M extends Request {
        constructor(e10, t3 = {}) {
          let r2 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          y(r2), e10 instanceof Request ? super(e10, t3) : super(r2, t3);
          let n2 = new I(r2, { headers: g(this.headers), nextConfig: t3.nextConfig });
          this[D] = { cookies: new j.RequestCookies(this.headers), nextUrl: n2, url: n2.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[D].cookies;
        }
        get nextUrl() {
          return this[D].nextUrl;
        }
        get page() {
          throw new d();
        }
        get ua() {
          throw new p();
        }
        get url() {
          return this[D].url;
        }
      }
      class U {
        static get(e10, t3, r2) {
          let n2 = Reflect.get(e10, t3, r2);
          return "function" == typeof n2 ? n2.bind(e10) : n2;
        }
        static set(e10, t3, r2, n2) {
          return Reflect.set(e10, t3, r2, n2);
        }
        static has(e10, t3) {
          return Reflect.has(e10, t3);
        }
        static deleteProperty(e10, t3) {
          return Reflect.deleteProperty(e10, t3);
        }
      }
      let H = Symbol("internal response"), q = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function W(e10, t3) {
        var r2;
        if (null == e10 || null == (r2 = e10.request) ? void 0 : r2.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r3 = [];
          for (let [n2, i2] of e10.request.headers) t3.set("x-middleware-request-" + n2, i2), r3.push(n2);
          t3.set("x-middleware-override-headers", r3.join(","));
        }
      }
      class $ extends Response {
        constructor(e10, t3 = {}) {
          super(e10, t3);
          let r2 = this.headers, n2 = new Proxy(new j.ResponseCookies(r2), { get(e11, n3, i2) {
            switch (n3) {
              case "delete":
              case "set":
                return (...i3) => {
                  let o2 = Reflect.apply(e11[n3], e11, i3), a2 = new Headers(r2);
                  return o2 instanceof j.ResponseCookies && r2.set("x-middleware-set-cookie", o2.getAll().map((e12) => (0, j.stringifyCookie)(e12)).join(",")), W(t3, a2), o2;
                };
              default:
                return U.get(e11, n3, i2);
            }
          } });
          this[H] = { cookies: n2, url: t3.url ? new I(t3.url, { headers: g(r2), nextConfig: t3.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[H].cookies;
        }
        static json(e10, t3) {
          let r2 = Response.json(e10, t3);
          return new $(r2.body, r2);
        }
        static redirect(e10, t3) {
          let r2 = "number" == typeof t3 ? t3 : (null == t3 ? void 0 : t3.status) ?? 307;
          if (!q.has(r2)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n2 = "object" == typeof t3 ? t3 : {}, i2 = new Headers(null == n2 ? void 0 : n2.headers);
          return i2.set("Location", y(e10)), new $(null, { ...n2, headers: i2, status: r2 });
        }
        static rewrite(e10, t3) {
          let r2 = new Headers(null == t3 ? void 0 : t3.headers);
          return r2.set("x-middleware-rewrite", y(e10)), W(t3, r2), new $(null, { ...t3, headers: r2 });
        }
        static next(e10) {
          let t3 = new Headers(null == e10 ? void 0 : e10.headers);
          return t3.set("x-middleware-next", "1"), W(e10, t3), new $(null, { ...e10, headers: t3 });
        }
      }
      function K(e10, t3) {
        let r2 = "string" == typeof t3 ? new URL(t3) : t3, n2 = new URL(e10, t3), i2 = n2.origin === r2.origin;
        return { url: i2 ? n2.toString().slice(r2.origin.length) : n2.toString(), isRelative: i2 };
      }
      let B = "next-router-prefetch", z = ["rsc", "next-router-state-tree", B, "next-hmr-refresh", "next-router-segment-prefetch"], V = "_rsc";
      class J extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers");
        }
        static callable() {
          throw new J();
        }
      }
      class X extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t3, r2, n2) {
            if ("symbol" == typeof r2) return U.get(t3, r2, n2);
            let i2 = r2.toLowerCase(), o2 = Object.keys(e10).find((e11) => e11.toLowerCase() === i2);
            if (void 0 !== o2) return U.get(t3, o2, n2);
          }, set(t3, r2, n2, i2) {
            if ("symbol" == typeof r2) return U.set(t3, r2, n2, i2);
            let o2 = r2.toLowerCase(), a2 = Object.keys(e10).find((e11) => e11.toLowerCase() === o2);
            return U.set(t3, a2 ?? r2, n2, i2);
          }, has(t3, r2) {
            if ("symbol" == typeof r2) return U.has(t3, r2);
            let n2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 !== i2 && U.has(t3, i2);
          }, deleteProperty(t3, r2) {
            if ("symbol" == typeof r2) return U.deleteProperty(t3, r2);
            let n2 = r2.toLowerCase(), i2 = Object.keys(e10).find((e11) => e11.toLowerCase() === n2);
            return void 0 === i2 || U.deleteProperty(t3, i2);
          } });
        }
        static seal(e10) {
          return new Proxy(e10, { get(e11, t3, r2) {
            switch (t3) {
              case "append":
              case "delete":
              case "set":
                return J.callable;
              default:
                return U.get(e11, t3, r2);
            }
          } });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new X(e10);
        }
        append(e10, t3) {
          let r2 = this.headers[e10];
          "string" == typeof r2 ? this.headers[e10] = [r2, t3] : Array.isArray(r2) ? r2.push(t3) : this.headers[e10] = t3;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t3 = this.headers[e10];
          return void 0 !== t3 ? this.merge(t3) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t3) {
          this.headers[e10] = t3;
        }
        forEach(e10, t3) {
          for (let [r2, n2] of this.entries()) e10.call(t3, n2, r2, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t3 = e10.toLowerCase(), r2 = this.get(t3);
            yield [t3, r2];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t3 = e10.toLowerCase();
            yield t3;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t3 = this.get(e10);
            yield t3;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let F = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class G {
        disable() {
          throw F;
        }
        getStore() {
        }
        run() {
          throw F;
        }
        exit() {
          throw F;
        }
        enterWith() {
          throw F;
        }
        static bind(e10) {
          return e10;
        }
      }
      let Q = "undefined" != typeof globalThis && globalThis.AsyncLocalStorage;
      function Y() {
        return Q ? new Q() : new G();
      }
      let Z = Y();
      class ee extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options");
        }
        static callable() {
          throw new ee();
        }
      }
      class et {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t3, r2) {
            switch (t3) {
              case "clear":
              case "delete":
              case "set":
                return ee.callable;
              default:
                return U.get(e11, t3, r2);
            }
          } });
        }
      }
      let er = Symbol.for("next.mutated.cookies");
      class en {
        static wrap(e10, t3) {
          let r2 = new j.ResponseCookies(new Headers());
          for (let t5 of e10.getAll()) r2.set(t5);
          let n2 = [], i2 = /* @__PURE__ */ new Set(), o2 = () => {
            let e11 = Z.getStore();
            if (e11 && (e11.pathWasRevalidated = true), n2 = r2.getAll().filter((e12) => i2.has(e12.name)), t3) {
              let e12 = [];
              for (let t5 of n2) {
                let r3 = new j.ResponseCookies(new Headers());
                r3.set(t5), e12.push(r3.toString());
              }
              t3(e12);
            }
          }, a2 = new Proxy(r2, { get(e11, t5, r3) {
            switch (t5) {
              case er:
                return n2;
              case "delete":
                return function(...t6) {
                  i2.add("string" == typeof t6[0] ? t6[0] : t6[0].name);
                  try {
                    return e11.delete(...t6), a2;
                  } finally {
                    o2();
                  }
                };
              case "set":
                return function(...t6) {
                  i2.add("string" == typeof t6[0] ? t6[0] : t6[0].name);
                  try {
                    return e11.set(...t6), a2;
                  } finally {
                    o2();
                  }
                };
              default:
                return U.get(e11, t5, r3);
            }
          } });
          return a2;
        }
      }
      function ei(e10, t3) {
        if ("action" !== e10.phase) throw new ee();
      }
      var eo = function(e10) {
        return e10.handleRequest = "BaseServer.handleRequest", e10.run = "BaseServer.run", e10.pipe = "BaseServer.pipe", e10.getStaticHTML = "BaseServer.getStaticHTML", e10.render = "BaseServer.render", e10.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", e10.renderToResponse = "BaseServer.renderToResponse", e10.renderToHTML = "BaseServer.renderToHTML", e10.renderError = "BaseServer.renderError", e10.renderErrorToResponse = "BaseServer.renderErrorToResponse", e10.renderErrorToHTML = "BaseServer.renderErrorToHTML", e10.render404 = "BaseServer.render404", e10;
      }(eo || {}), ea = function(e10) {
        return e10.loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", e10.loadComponents = "LoadComponents.loadComponents", e10;
      }(ea || {}), es = function(e10) {
        return e10.getRequestHandler = "NextServer.getRequestHandler", e10.getServer = "NextServer.getServer", e10.getServerRequestHandler = "NextServer.getServerRequestHandler", e10.createServer = "createServer.createServer", e10;
      }(es || {}), el = function(e10) {
        return e10.compression = "NextNodeServer.compression", e10.getBuildId = "NextNodeServer.getBuildId", e10.createComponentTree = "NextNodeServer.createComponentTree", e10.clientComponentLoading = "NextNodeServer.clientComponentLoading", e10.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", e10.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", e10.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", e10.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", e10.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", e10.sendRenderResult = "NextNodeServer.sendRenderResult", e10.proxyRequest = "NextNodeServer.proxyRequest", e10.runApi = "NextNodeServer.runApi", e10.render = "NextNodeServer.render", e10.renderHTML = "NextNodeServer.renderHTML", e10.imageOptimizer = "NextNodeServer.imageOptimizer", e10.getPagePath = "NextNodeServer.getPagePath", e10.getRoutesManifest = "NextNodeServer.getRoutesManifest", e10.findPageComponents = "NextNodeServer.findPageComponents", e10.getFontManifest = "NextNodeServer.getFontManifest", e10.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", e10.getRequestHandler = "NextNodeServer.getRequestHandler", e10.renderToHTML = "NextNodeServer.renderToHTML", e10.renderError = "NextNodeServer.renderError", e10.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", e10.render404 = "NextNodeServer.render404", e10.startResponse = "NextNodeServer.startResponse", e10.route = "route", e10.onProxyReq = "onProxyReq", e10.apiResolver = "apiResolver", e10.internalFetch = "internalFetch", e10;
      }(el || {}), eu = function(e10) {
        return e10.startServer = "startServer.startServer", e10;
      }(eu || {}), ec = function(e10) {
        return e10.getServerSideProps = "Render.getServerSideProps", e10.getStaticProps = "Render.getStaticProps", e10.renderToString = "Render.renderToString", e10.renderDocument = "Render.renderDocument", e10.createBodyResult = "Render.createBodyResult", e10;
      }(ec || {}), ed = function(e10) {
        return e10.renderToString = "AppRender.renderToString", e10.renderToReadableStream = "AppRender.renderToReadableStream", e10.getBodyResult = "AppRender.getBodyResult", e10.fetch = "AppRender.fetch", e10;
      }(ed || {}), ep = function(e10) {
        return e10.executeRoute = "Router.executeRoute", e10;
      }(ep || {}), eh = function(e10) {
        return e10.runHandler = "Node.runHandler", e10;
      }(eh || {}), ef = function(e10) {
        return e10.runHandler = "AppRouteRouteHandlers.runHandler", e10;
      }(ef || {}), em = function(e10) {
        return e10.generateMetadata = "ResolveMetadata.generateMetadata", e10.generateViewport = "ResolveMetadata.generateViewport", e10;
      }(em || {}), eg = function(e10) {
        return e10.execute = "Middleware.execute", e10;
      }(eg || {});
      let ey = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eb = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function ev(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let ew = process.env.NEXT_OTEL_PERFORMANCE_PREFIX, { context: e_, propagation: eS, trace: eE, SpanStatusCode: ex, SpanKind: eR, ROOT_CONTEXT: eC } = t = e.r(11646);
      class eT extends Error {
        constructor(e10, t3) {
          super(), this.bubble = e10, this.result = t3;
        }
      }
      let ek = (e10, t3) => {
        (function(e11) {
          return "object" == typeof e11 && null !== e11 && e11 instanceof eT;
        })(t3) && t3.bubble ? e10.setAttribute("next.bubble", true) : (t3 && (e10.recordException(t3), e10.setAttribute("error.type", t3.name)), e10.setStatus({ code: ex.ERROR, message: null == t3 ? void 0 : t3.message })), e10.end();
      }, eO = /* @__PURE__ */ new Map(), eP = t.createContextKey("next.rootSpanId"), eA = 0, eN = { set(e10, t3, r2) {
        e10.push({ key: t3, value: r2 });
      } };
      class eI {
        getTracerInstance() {
          return eE.getTracer("next.js", "0.0.1");
        }
        getContext() {
          return e_;
        }
        getTracePropagationData() {
          let e10 = e_.active(), t3 = [];
          return eS.inject(e10, t3, eN), t3;
        }
        getActiveScopeSpan() {
          return eE.getSpan(null == e_ ? void 0 : e_.active());
        }
        withPropagatedContext(e10, t3, r2) {
          let n2 = e_.active();
          if (eE.getSpanContext(n2)) return t3();
          let i2 = eS.extract(n2, e10, r2);
          return e_.with(i2, t3);
        }
        trace(...e10) {
          var t3;
          let [r2, n2, i2] = e10, { fn: o2, options: a2 } = "function" == typeof n2 ? { fn: n2, options: {} } : { fn: i2, options: { ...n2 } }, s2 = a2.spanName ?? r2;
          if (!ey.has(r2) && "1" !== process.env.NEXT_OTEL_VERBOSE || a2.hideSpan) return o2();
          let l2 = this.getSpanContext((null == a2 ? void 0 : a2.parentSpan) ?? this.getActiveScopeSpan()), u2 = false;
          l2 ? (null == (t3 = eE.getSpanContext(l2)) ? void 0 : t3.isRemote) && (u2 = true) : (l2 = (null == e_ ? void 0 : e_.active()) ?? eC, u2 = true);
          let c2 = eA++;
          return a2.attributes = { "next.span_name": s2, "next.span_type": r2, ...a2.attributes }, e_.with(l2.setValue(eP, c2), () => this.getTracerInstance().startActiveSpan(s2, a2, (e11) => {
            let t5;
            ew && r2 && eb.has(r2) && (t5 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n3 = false, i3 = () => {
              !n3 && (n3 = true, eO.delete(c2), t5 && performance.measure(`${ew}:next-${(r2.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: t5, end: performance.now() }));
            };
            if (u2 && eO.set(c2, new Map(Object.entries(a2.attributes ?? {}))), o2.length > 1) try {
              return o2(e11, (t6) => ek(e11, t6));
            } catch (t6) {
              throw ek(e11, t6), t6;
            } finally {
              i3();
            }
            try {
              let t6 = o2(e11);
              if (ev(t6)) return t6.then((t7) => (e11.end(), t7)).catch((t7) => {
                throw ek(e11, t7), t7;
              }).finally(i3);
              return e11.end(), i3(), t6;
            } catch (t6) {
              throw ek(e11, t6), i3(), t6;
            }
          }));
        }
        wrap(...e10) {
          let t3 = this, [r2, n2, i2] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return ey.has(r2) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n2;
            "function" == typeof e11 && "function" == typeof i2 && (e11 = e11.apply(this, arguments));
            let o2 = arguments.length - 1, a2 = arguments[o2];
            if ("function" != typeof a2) return t3.trace(r2, e11, () => i2.apply(this, arguments));
            {
              let n3 = t3.getContext().bind(e_.active(), a2);
              return t3.trace(r2, e11, (e12, t5) => (arguments[o2] = function(e13) {
                return null == t5 || t5(e13), n3.apply(this, arguments);
              }, i2.apply(this, arguments)));
            }
          } : i2;
        }
        startSpan(...e10) {
          let [t3, r2] = e10, n2 = this.getSpanContext((null == r2 ? void 0 : r2.parentSpan) ?? this.getActiveScopeSpan());
          return this.getTracerInstance().startSpan(t3, r2, n2);
        }
        getSpanContext(e10) {
          return e10 ? eE.setSpan(e_.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = e_.active().getValue(eP);
          return eO.get(e10);
        }
        setRootSpanAttribute(e10, t3) {
          let r2 = e_.active().getValue(eP), n2 = eO.get(r2);
          n2 && n2.set(e10, t3);
        }
      }
      let eL = (() => {
        let e10 = new eI();
        return () => e10;
      })(), ej = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(ej);
      class eD {
        constructor(e10, t3, r2, n2) {
          var i2;
          let o2 = e10 && function(e11, t5) {
            let r3 = X.from(e11.headers);
            return { isOnDemandRevalidate: r3.get("x-prerender-revalidate") === t5.previewModeId, revalidateOnlyGenerated: r3.has("x-prerender-revalidate-if-generated") };
          }(t3, e10).isOnDemandRevalidate, a2 = null == (i2 = r2.get(ej)) ? void 0 : i2.value;
          this._isEnabled = !!(!o2 && a2 && e10 && a2 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n2;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: ej, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: ej, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      function eM(e10, t3) {
        if ("x-middleware-set-cookie" in e10.headers && "string" == typeof e10.headers["x-middleware-set-cookie"]) {
          let r2 = e10.headers["x-middleware-set-cookie"], n2 = new Headers();
          for (let e11 of m(r2)) n2.append("set-cookie", e11);
          for (let e11 of new j.ResponseCookies(n2).getAll()) t3.set(e11);
        }
      }
      let eU = Y();
      class eH extends Error {
        constructor(e10, t3) {
          super("Invariant: " + (e10.endsWith(".") ? e10 : e10 + ".") + " This is a bug in Next.js.", t3), this.name = "InvariantError";
        }
      }
      var eq = e.i(99734);
      e.i(51615);
      class eW {
        constructor(e10, t3, r2) {
          this.prev = null, this.next = null, this.key = e10, this.data = t3, this.size = r2;
        }
      }
      class e$ {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class eK {
        constructor(e10, t3, r2) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t3, this.onEvict = r2, this.head = new e$(), this.tail = new e$(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t3) {
          let r2 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t3)) ?? 1;
          if (r2 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r2}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E789", enumerable: false, configurable: true });
          if (r2 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n2 = this.cache.get(e10);
          if (n2) n2.data = t3, this.totalSize = this.totalSize - n2.size + r2, n2.size = r2, this.moveToHead(n2);
          else {
            let n3 = new eW(e10, t3, r2);
            this.cache.set(e10, n3), this.addToHead(n3), this.totalSize += r2;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size, null == this.onEvict || this.onEvict.call(this, e11.key, e11.data);
          }
          return true;
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t3 = this.cache.get(e10);
          if (t3) return this.moveToHead(t3), t3.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t3 = e10;
            yield [t3.key, t3.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t3 = this.cache.get(e10);
          t3 && (this.removeNode(t3), this.cache.delete(e10), this.totalSize -= t3.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      new eK(52428800, (e10) => e10.size), process.env.NEXT_PRIVATE_DEBUG_CACHE && console.debug.bind(console, "DefaultCacheHandler:"), process.env.NEXT_PRIVATE_DEBUG_CACHE && ((e10, ...t3) => {
        console.log(`use-cache: ${e10}`, ...t3);
      }), Symbol.for("@next/cache-handlers");
      let eB = Symbol.for("@next/cache-handlers-map"), ez = Symbol.for("@next/cache-handlers-set"), eV = globalThis;
      function eJ() {
        if (eV[eB]) return eV[eB].entries();
      }
      async function eX(e10, t3) {
        if (!e10) return t3();
        let r2 = eF(e10);
        try {
          return await t3();
        } finally {
          let t5 = function(e11, t6) {
            let r3 = new Set(e11.pendingRevalidatedTags), n2 = new Set(e11.pendingRevalidateWrites);
            return { pendingRevalidatedTags: t6.pendingRevalidatedTags.filter((e12) => !r3.has(e12)), pendingRevalidates: Object.fromEntries(Object.entries(t6.pendingRevalidates).filter(([t7]) => !(t7 in e11.pendingRevalidates))), pendingRevalidateWrites: t6.pendingRevalidateWrites.filter((e12) => !n2.has(e12)) };
          }(r2, eF(e10));
          await eQ(e10, t5);
        }
      }
      function eF(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function eG(e10, t3) {
        if (0 === e10.length) return;
        let r2 = [];
        t3 && r2.push(t3.revalidateTag(e10));
        let n2 = function() {
          if (eV[ez]) return eV[ez].values();
        }();
        if (n2) for (let t5 of n2) r2.push(t5.expireTags(...e10));
        await Promise.all(r2);
      }
      async function eQ(e10, t3) {
        let r2 = (null == t3 ? void 0 : t3.pendingRevalidatedTags) ?? e10.pendingRevalidatedTags ?? [], n2 = (null == t3 ? void 0 : t3.pendingRevalidates) ?? e10.pendingRevalidates ?? {}, i2 = (null == t3 ? void 0 : t3.pendingRevalidateWrites) ?? e10.pendingRevalidateWrites ?? [];
        return Promise.all([eG(r2, e10.incrementalCache), ...Object.values(n2), ...i2]);
      }
      let eY = Y();
      class eZ {
        constructor({ waitUntil: e10, onClose: t3, onTaskError: r2 }) {
          this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t3, this.onTaskError = r2, this.callbackQueue = new eq.default(), this.callbackQueue.pause();
        }
        after(e10) {
          if (ev(e10)) this.waitUntil || e0(), this.waitUntil(e10.catch((e11) => this.reportTaskError("promise", e11)));
          else if ("function" == typeof e10) this.addCallback(e10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addCallback(e10) {
          var t3;
          this.waitUntil || e0();
          let r2 = eU.getStore();
          r2 && this.workUnitStores.add(r2);
          let n2 = eY.getStore(), i2 = n2 ? n2.rootTaskSpawnPhase : null == r2 ? void 0 : r2.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let o2 = (t3 = async () => {
            try {
              await eY.run({ rootTaskSpawnPhase: i2 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, Q ? Q.bind(t3) : G.bind(t3));
          this.callbackQueue.add(o2);
        }
        async runCallbacksOnClose() {
          return await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          for (let e11 of this.workUnitStores) e11.phase = "after";
          let e10 = Z.getStore();
          if (!e10) throw Object.defineProperty(new eH("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return eX(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t3) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t3), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t3);
          } catch (e11) {
            console.error(Object.defineProperty(new eH("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function e0() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function e1(e10) {
        let t3, r2 = { then: (n2, i2) => (t3 || (t3 = e10()), t3.then((e11) => {
          r2.value = e11;
        }).catch(() => {
        }), t3.then(n2, i2)) };
        return r2;
      }
      class e2 {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function e4() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let e3 = Symbol.for("@next/request-context");
      async function e5(e10, t3, r2) {
        let n2 = [], i2 = r2 && r2.size > 0;
        for (let t5 of ((e11) => {
          let t6 = ["/layout"];
          if (e11.startsWith("/")) {
            let r3 = e11.split("/");
            for (let e12 = 1; e12 < r3.length + 1; e12++) {
              let n3 = r3.slice(0, e12).join("/");
              n3 && (n3.endsWith("/page") || n3.endsWith("/route") || (n3 = `${n3}${!n3.endsWith("/") ? "/" : ""}layout`), t6.push(n3));
            }
          }
          return t6;
        })(e10)) t5 = `${h}${t5}`, n2.push(t5);
        if (t3.pathname && !i2) {
          let e11 = `${h}${t3.pathname}`;
          n2.push(e11);
        }
        return { tags: n2, expirationsByCacheKind: function(e11) {
          let t5 = /* @__PURE__ */ new Map(), r3 = eJ();
          if (r3) for (let [n3, i3] of r3) "getExpiration" in i3 && t5.set(n3, e1(async () => i3.getExpiration(...e11)));
          return t5;
        }(n2) };
      }
      class e6 extends M {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new c({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let e8 = { keys: (e10) => Array.from(e10.keys()), get: (e10, t3) => e10.get(t3) ?? void 0 }, e9 = (e10, t3) => eL().withPropagatedContext(e10.headers, t3, e8), e7 = false;
      async function te(t3) {
        var r2;
        let n2, i2;
        if (!e7 && (e7 = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
          let { interceptTestApis: t5, wrapRequestHandler: r3 } = e.r(94165);
          t5(), e9 = r3(e9);
        }
        await l();
        let o2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t3.request.url = t3.request.url.replace(/\.rsc($|\?)/, "$1");
        let a2 = t3.bypassNextUrl ? new URL(t3.request.url) : new I(t3.request.url, { headers: t3.request.headers, nextConfig: t3.request.nextConfig });
        for (let e10 of [...a2.searchParams.keys()]) {
          let t5 = a2.searchParams.getAll(e10), r3 = function(e11) {
            for (let t6 of ["nxtP", "nxtI"]) if (e11 !== t6 && e11.startsWith(t6)) return e11.substring(t6.length);
            return null;
          }(e10);
          if (r3) {
            for (let e11 of (a2.searchParams.delete(r3), t5)) a2.searchParams.append(r3, e11);
            a2.searchParams.delete(e10);
          }
        }
        let s2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in a2 && (s2 = a2.buildId || "", a2.buildId = "");
        let u2 = function(e10) {
          let t5 = new Headers();
          for (let [r3, n3] of Object.entries(e10)) for (let e11 of Array.isArray(n3) ? n3 : [n3]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t5.append(r3, e11));
          return t5;
        }(t3.request.headers), c2 = u2.has("x-nextjs-data"), d2 = "1" === u2.get("rsc");
        c2 && "/index" === a2.pathname && (a2.pathname = "/");
        let p2 = /* @__PURE__ */ new Map();
        if (!o2) for (let e10 of z) {
          let t5 = u2.get(e10);
          null !== t5 && (p2.set(e10, t5), u2.delete(e10));
        }
        let h2 = a2.searchParams.get(V), f2 = new e6({ page: t3.page, input: function(e10) {
          let t5 = "string" == typeof e10, r3 = t5 ? new URL(e10) : e10;
          return r3.searchParams.delete(V), t5 ? r3.toString() : r3;
        }(a2).toString(), init: { body: t3.request.body, headers: u2, method: t3.request.method, nextConfig: t3.request.nextConfig, signal: t3.request.signal } });
        c2 && Object.defineProperty(f2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t3.IncrementalCache && (globalThis.__incrementalCache = new t3.IncrementalCache({ CurCacheHandler: t3.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t3.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: e4() }) }));
        let m2 = t3.request.waitUntil ?? (null == (r2 = function() {
          let e10 = globalThis[e3];
          return null == e10 ? void 0 : e10.get();
        }()) ? void 0 : r2.waitUntil), g2 = new S({ request: f2, page: t3.page, context: m2 ? { waitUntil: m2 } : void 0 });
        if ((n2 = await e9(f2, () => {
          if ("/middleware" === t3.page || "/src/middleware" === t3.page) {
            let e10 = g2.waitUntil.bind(g2), r3 = new e2();
            return eL().trace(eg.execute, { spanName: `middleware ${f2.method} ${f2.nextUrl.pathname}`, attributes: { "http.target": f2.nextUrl.pathname, "http.method": f2.method } }, async () => {
              try {
                var n3, o3, a3, l2, u3, c3;
                let d3 = e4(), p3 = await e5("/", f2.nextUrl, null), h3 = (u3 = f2.nextUrl, c3 = (e11) => {
                  i2 = e11;
                }, function(e11, t5, r4, n4, i3, o4, a4, s3, l3, u4, c4, d4) {
                  function p4(e12) {
                    r4 && r4.setHeader("Set-Cookie", e12);
                  }
                  let h4 = {};
                  return { type: "request", phase: e11, implicitTags: o4, url: { pathname: n4.pathname, search: n4.search ?? "" }, rootParams: i3, get headers() {
                    return h4.headers || (h4.headers = function(e12) {
                      let t6 = X.from(e12);
                      for (let e13 of z) t6.delete(e13);
                      return X.seal(t6);
                    }(t5.headers)), h4.headers;
                  }, get cookies() {
                    if (!h4.cookies) {
                      let e12 = new j.RequestCookies(X.from(t5.headers));
                      eM(t5, e12), h4.cookies = et.seal(e12);
                    }
                    return h4.cookies;
                  }, set cookies(value) {
                    h4.cookies = value;
                  }, get mutableCookies() {
                    if (!h4.mutableCookies) {
                      let e12 = function(e13, t6) {
                        let r5 = new j.RequestCookies(X.from(e13));
                        return en.wrap(r5, t6);
                      }(t5.headers, a4 || (r4 ? p4 : void 0));
                      eM(t5, e12), h4.mutableCookies = e12;
                    }
                    return h4.mutableCookies;
                  }, get userspaceMutableCookies() {
                    return h4.userspaceMutableCookies || (h4.userspaceMutableCookies = function(e12) {
                      let t6 = new Proxy(e12.mutableCookies, { get(r5, n5, i4) {
                        switch (n5) {
                          case "delete":
                            return function(...n6) {
                              return ei(e12, "cookies().delete"), r5.delete(...n6), t6;
                            };
                          case "set":
                            return function(...n6) {
                              return ei(e12, "cookies().set"), r5.set(...n6), t6;
                            };
                          default:
                            return U.get(r5, n5, i4);
                        }
                      } });
                      return t6;
                    }(this)), h4.userspaceMutableCookies;
                  }, get draftMode() {
                    return h4.draftMode || (h4.draftMode = new eD(l3, t5, this.cookies, this.mutableCookies)), h4.draftMode;
                  }, renderResumeDataCache: s3 ?? null, isHmrRefresh: u4, serverComponentsHmrCache: c4 || globalThis.__serverComponentsHmrCache, devFallbackParams: null };
                }("action", f2, void 0, u3, {}, p3, c3, void 0, d3, false, void 0, null)), m3 = function({ page: e11, renderOpts: t5, isPrefetchRequest: r4, buildId: n4, previouslyRevalidatedTags: i3 }) {
                  var o4;
                  let a4 = !t5.shouldWaitOnAllReady && !t5.supportsDynamicResponse && !t5.isDraftMode && !t5.isPossibleServerAction, s3 = t5.dev ?? false, l3 = s3 || a4 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), u4 = { isStaticGeneration: a4, page: e11, route: (o4 = e11.split("/").reduce((e12, t6, r5, n5) => t6 ? "(" === t6[0] && t6.endsWith(")") || "@" === t6[0] || ("page" === t6 || "route" === t6) && r5 === n5.length - 1 ? e12 : e12 + "/" + t6 : e12, "")).startsWith("/") ? o4 : "/" + o4, incrementalCache: t5.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t5.cacheLifeProfiles, isRevalidate: t5.isRevalidate, isBuildTimePrerendering: t5.nextExport, hasReadableErrorStacks: t5.hasReadableErrorStacks, fetchCache: t5.fetchCache, isOnDemandRevalidate: t5.isOnDemandRevalidate, isDraftMode: t5.isDraftMode, isPrefetchRequest: r4, buildId: n4, reactLoadableManifest: (null == t5 ? void 0 : t5.reactLoadableManifest) || {}, assetPrefix: (null == t5 ? void 0 : t5.assetPrefix) || "", afterContext: function(e12) {
                    let { waitUntil: t6, onClose: r5, onAfterTaskError: n5 } = e12;
                    return new eZ({ waitUntil: t6, onClose: r5, onTaskError: n5 });
                  }(t5), cacheComponentsEnabled: t5.experimental.cacheComponents, dev: s3, previouslyRevalidatedTags: i3, refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t6 = eJ();
                    if (t6) for (let [r5, n5] of t6) "refreshTags" in n5 && e12.set(r5, e1(async () => n5.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: Q ? Q.snapshot() : function(e12, ...t6) {
                    return e12(...t6);
                  }, shouldTrackFetchMetrics: l3 };
                  return t5.store = u4, u4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: null == (o3 = t3.request.nextConfig) || null == (n3 = o3.experimental) ? void 0 : n3.cacheLife, experimental: { isRoutePPREnabled: false, cacheComponents: false, authInterrupts: !!(null == (l2 = t3.request.nextConfig) || null == (a3 = l2.experimental) ? void 0 : a3.authInterrupts) }, supportsDynamicResponse: true, waitUntil: e10, onClose: r3.onClose.bind(r3), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === f2.headers.get(B), buildId: s2 ?? "", previouslyRevalidatedTags: [] });
                return await Z.run(m3, () => eU.run(h3, t3.handler, f2, g2));
              } finally {
                setTimeout(() => {
                  r3.dispatchClose();
                }, 0);
              }
            });
          }
          return t3.handler(f2, g2);
        })) && !(n2 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        n2 && i2 && n2.headers.set("set-cookie", i2);
        let y2 = null == n2 ? void 0 : n2.headers.get("x-middleware-rewrite");
        if (n2 && y2 && (d2 || !o2)) {
          let e10 = new I(y2, { forceLocale: true, headers: t3.request.headers, nextConfig: t3.request.nextConfig });
          o2 || e10.host !== f2.nextUrl.host || (e10.buildId = s2 || e10.buildId, n2.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r3, isRelative: i3 } = K(e10.toString(), a2.toString());
          !o2 && c2 && n2.headers.set("x-nextjs-rewrite", r3), d2 && i3 && (a2.pathname !== e10.pathname && n2.headers.set("x-nextjs-rewritten-path", e10.pathname), a2.search !== e10.search && n2.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (n2 && y2 && d2 && h2) {
          let e10 = new URL(y2);
          e10.searchParams.has(V) || (e10.searchParams.set(V, h2), n2.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let b2 = null == n2 ? void 0 : n2.headers.get("Location");
        if (n2 && b2 && !o2) {
          let e10 = new I(b2, { forceLocale: false, headers: t3.request.headers, nextConfig: t3.request.nextConfig });
          n2 = new Response(n2.body, n2), e10.host === a2.host && (e10.buildId = s2 || e10.buildId, n2.headers.set("Location", e10.toString())), c2 && (n2.headers.delete("Location"), n2.headers.set("x-nextjs-redirect", K(e10.toString(), a2.toString()).url));
        }
        let v2 = n2 || $.next(), _2 = v2.headers.get("x-middleware-override-headers"), E2 = [];
        if (_2) {
          for (let [e10, t5] of p2) v2.headers.set(`x-middleware-request-${e10}`, t5), E2.push(e10);
          E2.length > 0 && v2.headers.set("x-middleware-override-headers", _2 + "," + E2.join(","));
        }
        return { response: v2, waitUntil: ("internal" === g2[w].kind ? Promise.all(g2[w].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: f2.fetchMetrics };
      }
      e.s(["config", () => tQ, "middleware", () => tY], 96592), e.s([], 85835), e.i(64445), "undefined" == typeof URLPattern || URLPattern;
      var tt = e.i(40049);
      if (/* @__PURE__ */ new WeakMap(), tt.default.unstable_postpone, false === function(e10) {
        return e10.includes("needs to bail out of prerendering at this point because it used") && e10.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error");
      }("Route %%% needs to bail out of prerendering at this point because it used ^^^. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error")) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp(`\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)`), RegExp(`\\n\\s+at __next_metadata_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_viewport_boundary__[\\n\\s]`), RegExp(`\\n\\s+at __next_outlet_boundary__[\\n\\s]`), Y();
      let { env: tr, stdout: tn } = (null == (L = globalThis) ? void 0 : L.process) ?? {}, ti = tr && !tr.NO_COLOR && (tr.FORCE_COLOR || (null == tn ? void 0 : tn.isTTY) && !tr.CI && "dumb" !== tr.TERM), to = (e10, t3, r2, n2) => {
        let i2 = e10.substring(0, n2) + r2, o2 = e10.substring(n2 + t3.length), a2 = o2.indexOf(t3);
        return ~a2 ? i2 + to(o2, t3, r2, a2) : i2 + o2;
      }, ta = (e10, t3, r2 = e10) => ti ? (n2) => {
        let i2 = "" + n2, o2 = i2.indexOf(t3, e10.length);
        return ~o2 ? e10 + to(i2, t3, r2, o2) + t3 : e10 + i2 + t3;
      } : String, ts = ta("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      ta("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), ta("\x1B[3m", "\x1B[23m"), ta("\x1B[4m", "\x1B[24m"), ta("\x1B[7m", "\x1B[27m"), ta("\x1B[8m", "\x1B[28m"), ta("\x1B[9m", "\x1B[29m"), ta("\x1B[30m", "\x1B[39m");
      let tl = ta("\x1B[31m", "\x1B[39m"), tu = ta("\x1B[32m", "\x1B[39m"), tc = ta("\x1B[33m", "\x1B[39m");
      ta("\x1B[34m", "\x1B[39m");
      let td = ta("\x1B[35m", "\x1B[39m");
      ta("\x1B[38;2;173;127;168m", "\x1B[39m"), ta("\x1B[36m", "\x1B[39m");
      let tp = ta("\x1B[37m", "\x1B[39m");
      ta("\x1B[90m", "\x1B[39m"), ta("\x1B[40m", "\x1B[49m"), ta("\x1B[41m", "\x1B[49m"), ta("\x1B[42m", "\x1B[49m"), ta("\x1B[43m", "\x1B[49m"), ta("\x1B[44m", "\x1B[49m"), ta("\x1B[45m", "\x1B[49m"), ta("\x1B[46m", "\x1B[49m"), ta("\x1B[47m", "\x1B[49m"), tp(ts("\u25CB")), tl(ts("\u2A2F")), tc(ts("\u26A0")), tp(ts(" ")), tu(ts("\u2713")), td(ts("\xBB")), new eK(1e4, (e10) => e10.length), /* @__PURE__ */ new WeakMap(), e.i(85835);
      let th = new TextEncoder(), tf = new TextDecoder();
      function tm(e10) {
        let t3 = new Uint8Array(e10.length);
        for (let r2 = 0; r2 < e10.length; r2++) {
          let n2 = e10.charCodeAt(r2);
          if (n2 > 127) throw TypeError("non-ASCII string encountered in encode()");
          t3[r2] = n2;
        }
        return t3;
      }
      function tg(e10) {
        if (Uint8Array.fromBase64) return Uint8Array.fromBase64("string" == typeof e10 ? e10 : tf.decode(e10), { alphabet: "base64url" });
        let t3 = e10;
        t3 instanceof Uint8Array && (t3 = tf.decode(t3)), t3 = t3.replace(/-/g, "+").replace(/_/g, "/");
        try {
          var r2 = t3;
          if (Uint8Array.fromBase64) return Uint8Array.fromBase64(r2);
          let e11 = atob(r2), n2 = new Uint8Array(e11.length);
          for (let t5 = 0; t5 < e11.length; t5++) n2[t5] = e11.charCodeAt(t5);
          return n2;
        } catch {
          throw TypeError("The input to be decoded is not correctly encoded.");
        }
      }
      class ty extends Error {
        static code = "ERR_JOSE_GENERIC";
        code = "ERR_JOSE_GENERIC";
        constructor(e10, t3) {
          super(e10, t3), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class tb extends ty {
        static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        claim;
        reason;
        payload;
        constructor(e10, t3, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t3 } }), this.claim = r2, this.reason = n2, this.payload = t3;
        }
      }
      class tv extends ty {
        static code = "ERR_JWT_EXPIRED";
        code = "ERR_JWT_EXPIRED";
        claim;
        reason;
        payload;
        constructor(e10, t3, r2 = "unspecified", n2 = "unspecified") {
          super(e10, { cause: { claim: r2, reason: n2, payload: t3 } }), this.claim = r2, this.reason = n2, this.payload = t3;
        }
      }
      class tw extends ty {
        static code = "ERR_JOSE_ALG_NOT_ALLOWED";
        code = "ERR_JOSE_ALG_NOT_ALLOWED";
      }
      class t_ extends ty {
        static code = "ERR_JOSE_NOT_SUPPORTED";
        code = "ERR_JOSE_NOT_SUPPORTED";
      }
      class tS extends ty {
        static code = "ERR_JWS_INVALID";
        code = "ERR_JWS_INVALID";
      }
      class tE extends ty {
        static code = "ERR_JWT_INVALID";
        code = "ERR_JWT_INVALID";
      }
      class tx extends ty {
        [Symbol.asyncIterator];
        static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        constructor(e10 = "multiple matching keys found in the JSON Web Key Set", t3) {
          super(e10, t3);
        }
      }
      class tR extends ty {
        static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        constructor(e10 = "signature verification failed", t3) {
          super(e10, t3);
        }
      }
      let tC = (e10, t3 = "algorithm.name") => TypeError(`CryptoKey does not support this operation, its ${t3} must be ${e10}`);
      function tT(e10, t3) {
        if (parseInt(e10.hash.name.slice(4), 10) !== t3) throw tC(`SHA-${t3}`, "algorithm.hash");
      }
      function tk(e10, t3, ...r2) {
        if ((r2 = r2.filter(Boolean)).length > 2) {
          let t5 = r2.pop();
          e10 += `one of type ${r2.join(", ")}, or ${t5}.`;
        } else 2 === r2.length ? e10 += `one of type ${r2[0]} or ${r2[1]}.` : e10 += `of type ${r2[0]}.`;
        return null == t3 ? e10 += ` Received ${t3}` : "function" == typeof t3 && t3.name ? e10 += ` Received function ${t3.name}` : "object" == typeof t3 && null != t3 && t3.constructor?.name && (e10 += ` Received an instance of ${t3.constructor.name}`), e10;
      }
      let tO = (e10, t3, ...r2) => tk(`Key for the ${e10} algorithm must be `, t3, ...r2);
      async function tP(e10, t3, r2) {
        if (t3 instanceof Uint8Array) {
          if (!e10.startsWith("HS")) throw TypeError(((e11, ...t5) => tk("Key must be ", e11, ...t5))(t3, "CryptoKey", "KeyObject", "JSON Web Key"));
          return crypto.subtle.importKey("raw", t3, { hash: `SHA-${e10.slice(-3)}`, name: "HMAC" }, false, [r2]);
        }
        return !function(e11, t5, r3) {
          switch (t5) {
            case "HS256":
            case "HS384":
            case "HS512":
              if ("HMAC" !== e11.algorithm.name) throw tC("HMAC");
              tT(e11.algorithm, parseInt(t5.slice(2), 10));
              break;
            case "RS256":
            case "RS384":
            case "RS512":
              if ("RSASSA-PKCS1-v1_5" !== e11.algorithm.name) throw tC("RSASSA-PKCS1-v1_5");
              tT(e11.algorithm, parseInt(t5.slice(2), 10));
              break;
            case "PS256":
            case "PS384":
            case "PS512":
              if ("RSA-PSS" !== e11.algorithm.name) throw tC("RSA-PSS");
              tT(e11.algorithm, parseInt(t5.slice(2), 10));
              break;
            case "Ed25519":
            case "EdDSA":
              if ("Ed25519" !== e11.algorithm.name) throw tC("Ed25519");
              break;
            case "ML-DSA-44":
            case "ML-DSA-65":
            case "ML-DSA-87":
              let n2;
              if (n2 = e11.algorithm, n2.name !== t5) throw tC(t5);
              break;
            case "ES256":
            case "ES384":
            case "ES512": {
              if ("ECDSA" !== e11.algorithm.name) throw tC("ECDSA");
              let r4 = function(e12) {
                switch (e12) {
                  case "ES256":
                    return "P-256";
                  case "ES384":
                    return "P-384";
                  case "ES512":
                    return "P-521";
                  default:
                    throw Error("unreachable");
                }
              }(t5);
              if (e11.algorithm.namedCurve !== r4) throw tC(r4, "algorithm.namedCurve");
              break;
            }
            default:
              throw TypeError("CryptoKey does not support this operation");
          }
          if (r3 && !e11.usages.includes(r3)) throw TypeError(`CryptoKey does not support this operation, its usages must include ${r3}.`);
        }(t3, e10, r2), t3;
      }
      async function tA(e10, t3, r2, n2) {
        let i2 = await tP(e10, t3, "verify");
        if (e10.startsWith("RS") || e10.startsWith("PS")) {
          let { modulusLength: t5 } = i2.algorithm;
          if ("number" != typeof t5 || t5 < 2048) throw TypeError(`${e10} requires key modulusLength to be 2048 bits or larger`);
        }
        let o2 = function(e11, t5) {
          let r3 = `SHA-${e11.slice(-3)}`;
          switch (e11) {
            case "HS256":
            case "HS384":
            case "HS512":
              return { hash: r3, name: "HMAC" };
            case "PS256":
            case "PS384":
            case "PS512":
              return { hash: r3, name: "RSA-PSS", saltLength: parseInt(e11.slice(-3), 10) >> 3 };
            case "RS256":
            case "RS384":
            case "RS512":
              return { hash: r3, name: "RSASSA-PKCS1-v1_5" };
            case "ES256":
            case "ES384":
            case "ES512":
              return { hash: r3, name: "ECDSA", namedCurve: t5.namedCurve };
            case "Ed25519":
            case "EdDSA":
              return { name: "Ed25519" };
            case "ML-DSA-44":
            case "ML-DSA-65":
            case "ML-DSA-87":
              return { name: e11 };
            default:
              throw new t_(`alg ${e11} is not supported either by JOSE or your javascript runtime`);
          }
        }(e10, i2.algorithm);
        try {
          return await crypto.subtle.verify(o2, i2, r2, n2);
        } catch {
          return false;
        }
      }
      function tN(e10, t3, r2) {
        try {
          return tg(e10);
        } catch {
          throw new r2(`Failed to base64url decode the ${t3}`);
        }
      }
      function tI(e10) {
        if ("object" != typeof e10 || null === e10 || "[object Object]" !== Object.prototype.toString.call(e10)) return false;
        if (null === Object.getPrototypeOf(e10)) return true;
        let t3 = e10;
        for (; null !== Object.getPrototypeOf(t3); ) t3 = Object.getPrototypeOf(t3);
        return Object.getPrototypeOf(e10) === t3;
      }
      Symbol();
      let tL = (e10) => tI(e10) && "string" == typeof e10.kty, tj = (e10) => {
        if (e10?.[Symbol.toStringTag] === "CryptoKey") return true;
        try {
          return e10 instanceof CryptoKey;
        } catch {
          return false;
        }
      }, tD = (e10) => e10?.[Symbol.toStringTag] === "KeyObject", tM = (e10) => tj(e10) || tD(e10), tU = (e10) => e10?.[Symbol.toStringTag], tH = (e10, t3, r2) => {
        if (void 0 !== t3.use) {
          let e11;
          switch (r2) {
            case "sign":
            case "verify":
              e11 = "sig";
              break;
            case "encrypt":
            case "decrypt":
              e11 = "enc";
          }
          if (t3.use !== e11) throw TypeError(`Invalid key for this operation, its "use" must be "${e11}" when present`);
        }
        if (void 0 !== t3.alg && t3.alg !== e10) throw TypeError(`Invalid key for this operation, its "alg" must be "${e10}" when present`);
        if (Array.isArray(t3.key_ops)) {
          let n2;
          switch (true) {
            case ("sign" === r2 || "verify" === r2):
            case "dir" === e10:
            case e10.includes("CBC-HS"):
              n2 = r2;
              break;
            case e10.startsWith("PBES2"):
              n2 = "deriveBits";
              break;
            case /^A\d{3}(?:GCM)?(?:KW)?$/.test(e10):
              n2 = !e10.includes("GCM") && e10.endsWith("KW") ? "encrypt" === r2 ? "wrapKey" : "unwrapKey" : r2;
              break;
            case ("encrypt" === r2 && e10.startsWith("RSA")):
              n2 = "wrapKey";
              break;
            case "decrypt" === r2:
              n2 = e10.startsWith("RSA") ? "unwrapKey" : "deriveBits";
          }
          if (n2 && t3.key_ops?.includes?.(n2) === false) throw TypeError(`Invalid key for this operation, its "key_ops" must include "${n2}" when present`);
        }
        return true;
      }, tq = 'Invalid or unsupported JWK "alg" (Algorithm) Parameter value';
      async function tW(e10) {
        if (!e10.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
        let { algorithm: t3, keyUsages: r2 } = function(e11) {
          let t5, r3;
          switch (e11.kty) {
            case "AKP":
              switch (e11.alg) {
                case "ML-DSA-44":
                case "ML-DSA-65":
                case "ML-DSA-87":
                  t5 = { name: e11.alg }, r3 = e11.priv ? ["sign"] : ["verify"];
                  break;
                default:
                  throw new t_(tq);
              }
              break;
            case "RSA":
              switch (e11.alg) {
                case "PS256":
                case "PS384":
                case "PS512":
                  t5 = { name: "RSA-PSS", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RS256":
                case "RS384":
                case "RS512":
                  t5 = { name: "RSASSA-PKCS1-v1_5", hash: `SHA-${e11.alg.slice(-3)}` }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "RSA-OAEP":
                case "RSA-OAEP-256":
                case "RSA-OAEP-384":
                case "RSA-OAEP-512":
                  t5 = { name: "RSA-OAEP", hash: `SHA-${parseInt(e11.alg.slice(-3), 10) || 1}` }, r3 = e11.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
                  break;
                default:
                  throw new t_(tq);
              }
              break;
            case "EC":
              switch (e11.alg) {
                case "ES256":
                case "ES384":
                case "ES512":
                  t5 = { name: "ECDSA", namedCurve: { ES256: "P-256", ES384: "P-384", ES512: "P-521" }[e11.alg] }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t5 = { name: "ECDH", namedCurve: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new t_(tq);
              }
              break;
            case "OKP":
              switch (e11.alg) {
                case "Ed25519":
                case "EdDSA":
                  t5 = { name: "Ed25519" }, r3 = e11.d ? ["sign"] : ["verify"];
                  break;
                case "ECDH-ES":
                case "ECDH-ES+A128KW":
                case "ECDH-ES+A192KW":
                case "ECDH-ES+A256KW":
                  t5 = { name: e11.crv }, r3 = e11.d ? ["deriveBits"] : [];
                  break;
                default:
                  throw new t_(tq);
              }
              break;
            default:
              throw new t_('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
          }
          return { algorithm: t5, keyUsages: r3 };
        }(e10), n2 = { ...e10 };
        return "AKP" !== n2.kty && delete n2.alg, delete n2.use, crypto.subtle.importKey("jwk", n2, t3, e10.ext ?? (!e10.d && !e10.priv), e10.key_ops ?? r2);
      }
      let t$ = "given KeyObject instance cannot be used for this algorithm", tK = async (e10, t3, n2, i2 = false) => {
        let o2 = (r ||= /* @__PURE__ */ new WeakMap()).get(e10);
        if (o2?.[n2]) return o2[n2];
        let a2 = await tW({ ...t3, alg: n2 });
        return i2 && Object.freeze(e10), o2 ? o2[n2] = a2 : r.set(e10, { [n2]: a2 }), a2;
      };
      async function tB(e10, t3) {
        if (e10 instanceof Uint8Array || tj(e10)) return e10;
        if (tD(e10)) {
          if ("secret" === e10.type) return e10.export();
          if ("toCryptoKey" in e10 && "function" == typeof e10.toCryptoKey) try {
            return ((e11, t5) => {
              let n3, i2 = (r ||= /* @__PURE__ */ new WeakMap()).get(e11);
              if (i2?.[t5]) return i2[t5];
              let o2 = "public" === e11.type, a2 = !!o2;
              if ("x25519" === e11.asymmetricKeyType) {
                switch (t5) {
                  case "ECDH-ES":
                  case "ECDH-ES+A128KW":
                  case "ECDH-ES+A192KW":
                  case "ECDH-ES+A256KW":
                    break;
                  default:
                    throw TypeError(t$);
                }
                n3 = e11.toCryptoKey(e11.asymmetricKeyType, a2, o2 ? [] : ["deriveBits"]);
              }
              if ("ed25519" === e11.asymmetricKeyType) {
                if ("EdDSA" !== t5 && "Ed25519" !== t5) throw TypeError(t$);
                n3 = e11.toCryptoKey(e11.asymmetricKeyType, a2, [o2 ? "verify" : "sign"]);
              }
              switch (e11.asymmetricKeyType) {
                case "ml-dsa-44":
                case "ml-dsa-65":
                case "ml-dsa-87":
                  if (t5 !== e11.asymmetricKeyType.toUpperCase()) throw TypeError(t$);
                  n3 = e11.toCryptoKey(e11.asymmetricKeyType, a2, [o2 ? "verify" : "sign"]);
              }
              if ("rsa" === e11.asymmetricKeyType) {
                let r2;
                switch (t5) {
                  case "RSA-OAEP":
                    r2 = "SHA-1";
                    break;
                  case "RS256":
                  case "PS256":
                  case "RSA-OAEP-256":
                    r2 = "SHA-256";
                    break;
                  case "RS384":
                  case "PS384":
                  case "RSA-OAEP-384":
                    r2 = "SHA-384";
                    break;
                  case "RS512":
                  case "PS512":
                  case "RSA-OAEP-512":
                    r2 = "SHA-512";
                    break;
                  default:
                    throw TypeError(t$);
                }
                if (t5.startsWith("RSA-OAEP")) return e11.toCryptoKey({ name: "RSA-OAEP", hash: r2 }, a2, o2 ? ["encrypt"] : ["decrypt"]);
                n3 = e11.toCryptoKey({ name: t5.startsWith("PS") ? "RSA-PSS" : "RSASSA-PKCS1-v1_5", hash: r2 }, a2, [o2 ? "verify" : "sign"]);
              }
              if ("ec" === e11.asymmetricKeyType) {
                let r2 = (/* @__PURE__ */ new Map([["prime256v1", "P-256"], ["secp384r1", "P-384"], ["secp521r1", "P-521"]])).get(e11.asymmetricKeyDetails?.namedCurve);
                if (!r2) throw TypeError(t$);
                let i3 = { ES256: "P-256", ES384: "P-384", ES512: "P-521" };
                i3[t5] && r2 === i3[t5] && (n3 = e11.toCryptoKey({ name: "ECDSA", namedCurve: r2 }, a2, [o2 ? "verify" : "sign"])), t5.startsWith("ECDH-ES") && (n3 = e11.toCryptoKey({ name: "ECDH", namedCurve: r2 }, a2, o2 ? [] : ["deriveBits"]));
              }
              if (!n3) throw TypeError(t$);
              return i2 ? i2[t5] = n3 : r.set(e11, { [t5]: n3 }), n3;
            })(e10, t3);
          } catch (e11) {
            if (e11 instanceof TypeError) throw e11;
          }
          let n2 = e10.export({ format: "jwk" });
          return tK(e10, n2, t3);
        }
        if (tL(e10)) return e10.k ? tg(e10.k) : tK(e10, e10, t3, true);
        throw Error("unreachable");
      }
      async function tz(e10, t3, r2) {
        if (!tI(e10)) throw new tS("Flattened JWS must be an object");
        if (void 0 === e10.protected && void 0 === e10.header) throw new tS('Flattened JWS must have either of the "protected" or "header" members');
        if (void 0 !== e10.protected && "string" != typeof e10.protected) throw new tS("JWS Protected Header incorrect type");
        if (void 0 === e10.payload) throw new tS("JWS Payload missing");
        if ("string" != typeof e10.signature) throw new tS("JWS Signature missing or incorrect type");
        if (void 0 !== e10.header && !tI(e10.header)) throw new tS("JWS Unprotected Header incorrect type");
        let n2 = {};
        if (e10.protected) try {
          let t5 = tg(e10.protected);
          n2 = JSON.parse(tf.decode(t5));
        } catch {
          throw new tS("JWS Protected Header is invalid");
        }
        if (!function(...e11) {
          let t5, r3 = e11.filter(Boolean);
          if (0 === r3.length || 1 === r3.length) return true;
          for (let e12 of r3) {
            let r4 = Object.keys(e12);
            if (!t5 || 0 === t5.size) {
              t5 = new Set(r4);
              continue;
            }
            for (let e13 of r4) {
              if (t5.has(e13)) return false;
              t5.add(e13);
            }
          }
          return true;
        }(n2, e10.header)) throw new tS("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        let i2 = { ...n2, ...e10.header }, o2 = function(e11, t5, r3, n3, i3) {
          let o3;
          if (void 0 !== i3.crit && n3?.crit === void 0) throw new e11('"crit" (Critical) Header Parameter MUST be integrity protected');
          if (!n3 || void 0 === n3.crit) return /* @__PURE__ */ new Set();
          if (!Array.isArray(n3.crit) || 0 === n3.crit.length || n3.crit.some((e12) => "string" != typeof e12 || 0 === e12.length)) throw new e11('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
          for (let a3 of (o3 = void 0 !== r3 ? new Map([...Object.entries(r3), ...t5.entries()]) : t5, n3.crit)) {
            if (!o3.has(a3)) throw new t_(`Extension Header Parameter "${a3}" is not recognized`);
            if (void 0 === i3[a3]) throw new e11(`Extension Header Parameter "${a3}" is missing`);
            if (o3.get(a3) && void 0 === n3[a3]) throw new e11(`Extension Header Parameter "${a3}" MUST be integrity protected`);
          }
          return new Set(n3.crit);
        }(tS, /* @__PURE__ */ new Map([["b64", true]]), r2?.crit, n2, i2), a2 = true;
        if (o2.has("b64") && "boolean" != typeof (a2 = n2.b64)) throw new tS('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        let { alg: s2 } = i2;
        if ("string" != typeof s2 || !s2) throw new tS('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        let l2 = r2 && function(e11, t5) {
          if (void 0 !== t5 && (!Array.isArray(t5) || t5.some((e12) => "string" != typeof e12))) throw TypeError(`"${e11}" option must be an array of strings`);
          if (t5) return new Set(t5);
        }("algorithms", r2.algorithms);
        if (l2 && !l2.has(s2)) throw new tw('"alg" (Algorithm) Header Parameter value not allowed');
        if (a2) {
          if ("string" != typeof e10.payload) throw new tS("JWS Payload must be a string");
        } else if ("string" != typeof e10.payload && !(e10.payload instanceof Uint8Array)) throw new tS("JWS Payload must be a string or an Uint8Array instance");
        let u2 = false;
        "function" == typeof t3 && (t3 = await t3(n2, e10), u2 = true);
        var c2 = t3, d2 = "verify";
        switch (s2.substring(0, 2)) {
          case "A1":
          case "A2":
          case "di":
          case "HS":
          case "PB":
            ((e11, t5, r3) => {
              if (!(t5 instanceof Uint8Array)) {
                if (tL(t5)) {
                  let n3;
                  if ("oct" === (n3 = t5).kty && "string" == typeof n3.k && tH(e11, t5, r3)) return;
                  throw TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present');
                }
                if (!tM(t5)) throw TypeError(tO(e11, t5, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array"));
                if ("secret" !== t5.type) throw TypeError(`${tU(t5)} instances for symmetric algorithms must be of type "secret"`);
              }
            })(s2, c2, d2);
            break;
          default:
            ((e11, t5, r3) => {
              if (tL(t5)) switch (r3) {
                case "decrypt":
                case "sign":
                  let n3;
                  if ("oct" !== (n3 = t5).kty && ("AKP" === n3.kty && "string" == typeof n3.priv || "string" == typeof n3.d) && tH(e11, t5, r3)) return;
                  throw TypeError("JSON Web Key for this operation must be a private JWK");
                case "encrypt":
                case "verify":
                  let i3;
                  if ("oct" !== (i3 = t5).kty && void 0 === i3.d && void 0 === i3.priv && tH(e11, t5, r3)) return;
                  throw TypeError("JSON Web Key for this operation must be a public JWK");
              }
              if (!tM(t5)) throw TypeError(tO(e11, t5, "CryptoKey", "KeyObject", "JSON Web Key"));
              if ("secret" === t5.type) throw TypeError(`${tU(t5)} instances for asymmetric algorithms must not be of type "secret"`);
              if ("public" === t5.type) switch (r3) {
                case "sign":
                  throw TypeError(`${tU(t5)} instances for asymmetric algorithm signing must be of type "private"`);
                case "decrypt":
                  throw TypeError(`${tU(t5)} instances for asymmetric algorithm decryption must be of type "private"`);
              }
              if ("private" === t5.type) switch (r3) {
                case "verify":
                  throw TypeError(`${tU(t5)} instances for asymmetric algorithm verifying must be of type "public"`);
                case "encrypt":
                  throw TypeError(`${tU(t5)} instances for asymmetric algorithm encryption must be of type "public"`);
              }
            })(s2, c2, d2);
        }
        let p2 = function(...e11) {
          let t5 = new Uint8Array(e11.reduce((e12, { length: t6 }) => e12 + t6, 0)), r3 = 0;
          for (let n3 of e11) t5.set(n3, r3), r3 += n3.length;
          return t5;
        }(void 0 !== e10.protected ? tm(e10.protected) : new Uint8Array(), tm("."), "string" == typeof e10.payload ? a2 ? tm(e10.payload) : th.encode(e10.payload) : e10.payload), h2 = tN(e10.signature, "signature", tS), f2 = await tB(t3, s2);
        if (!await tA(s2, f2, h2, p2)) throw new tR();
        let m2 = { payload: a2 ? tN(e10.payload, "payload", tS) : "string" == typeof e10.payload ? th.encode(e10.payload) : e10.payload };
        return (void 0 !== e10.protected && (m2.protectedHeader = n2), void 0 !== e10.header && (m2.unprotectedHeader = e10.header), u2) ? { ...m2, key: f2 } : m2;
      }
      async function tV(e10, t3, r2) {
        if (e10 instanceof Uint8Array && (e10 = tf.decode(e10)), "string" != typeof e10) throw new tS("Compact JWS must be a string or Uint8Array");
        let { 0: n2, 1: i2, 2: o2, length: a2 } = e10.split(".");
        if (3 !== a2) throw new tS("Invalid Compact JWS");
        let s2 = await tz({ payload: i2, protected: n2, signature: o2 }, t3, r2), l2 = { payload: s2.payload, protectedHeader: s2.protectedHeader };
        return "function" == typeof t3 ? { ...l2, key: s2.key } : l2;
      }
      let tJ = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
      function tX(e10) {
        let t3, r2 = tJ.exec(e10);
        if (!r2 || r2[4] && r2[1]) throw TypeError("Invalid time period format");
        let n2 = parseFloat(r2[2]);
        switch (r2[3].toLowerCase()) {
          case "sec":
          case "secs":
          case "second":
          case "seconds":
          case "s":
            t3 = Math.round(n2);
            break;
          case "minute":
          case "minutes":
          case "min":
          case "mins":
          case "m":
            t3 = Math.round(60 * n2);
            break;
          case "hour":
          case "hours":
          case "hr":
          case "hrs":
          case "h":
            t3 = Math.round(3600 * n2);
            break;
          case "day":
          case "days":
          case "d":
            t3 = Math.round(86400 * n2);
            break;
          case "week":
          case "weeks":
          case "w":
            t3 = Math.round(604800 * n2);
            break;
          default:
            t3 = Math.round(31557600 * n2);
        }
        return "-" === r2[1] || "ago" === r2[4] ? -t3 : t3;
      }
      let tF = (e10) => e10.includes("/") ? e10.toLowerCase() : `application/${e10.toLowerCase()}`;
      async function tG(e10, t3, r2) {
        let n2 = await tV(e10, t3, r2);
        if (n2.protectedHeader.crit?.includes("b64") && false === n2.protectedHeader.b64) throw new tE("JWTs MUST NOT use unencoded payload");
        let i2 = { payload: function(e11, t5, r3 = {}) {
          var n3, i3;
          let o2, a2;
          try {
            o2 = JSON.parse(tf.decode(t5));
          } catch {
          }
          if (!tI(o2)) throw new tE("JWT Claims Set must be a top-level JSON object");
          let { typ: s2 } = r3;
          if (s2 && ("string" != typeof e11.typ || tF(e11.typ) !== tF(s2))) throw new tb('unexpected "typ" JWT header value', o2, "typ", "check_failed");
          let { requiredClaims: l2 = [], issuer: u2, subject: c2, audience: d2, maxTokenAge: p2 } = r3, h2 = [...l2];
          for (let e12 of (void 0 !== p2 && h2.push("iat"), void 0 !== d2 && h2.push("aud"), void 0 !== c2 && h2.push("sub"), void 0 !== u2 && h2.push("iss"), new Set(h2.reverse()))) if (!(e12 in o2)) throw new tb(`missing required "${e12}" claim`, o2, e12, "missing");
          if (u2 && !(Array.isArray(u2) ? u2 : [u2]).includes(o2.iss)) throw new tb('unexpected "iss" claim value', o2, "iss", "check_failed");
          if (c2 && o2.sub !== c2) throw new tb('unexpected "sub" claim value', o2, "sub", "check_failed");
          if (d2 && (n3 = o2.aud, i3 = "string" == typeof d2 ? [d2] : d2, "string" == typeof n3 ? !i3.includes(n3) : !(Array.isArray(n3) && i3.some(Set.prototype.has.bind(new Set(n3)))))) throw new tb('unexpected "aud" claim value', o2, "aud", "check_failed");
          switch (typeof r3.clockTolerance) {
            case "string":
              a2 = tX(r3.clockTolerance);
              break;
            case "number":
              a2 = r3.clockTolerance;
              break;
            case "undefined":
              a2 = 0;
              break;
            default:
              throw TypeError("Invalid clockTolerance option type");
          }
          let { currentDate: f2 } = r3, m2 = Math.floor((f2 || /* @__PURE__ */ new Date()).getTime() / 1e3);
          if ((void 0 !== o2.iat || p2) && "number" != typeof o2.iat) throw new tb('"iat" claim must be a number', o2, "iat", "invalid");
          if (void 0 !== o2.nbf) {
            if ("number" != typeof o2.nbf) throw new tb('"nbf" claim must be a number', o2, "nbf", "invalid");
            if (o2.nbf > m2 + a2) throw new tb('"nbf" claim timestamp check failed', o2, "nbf", "check_failed");
          }
          if (void 0 !== o2.exp) {
            if ("number" != typeof o2.exp) throw new tb('"exp" claim must be a number', o2, "exp", "invalid");
            if (o2.exp <= m2 - a2) throw new tv('"exp" claim timestamp check failed', o2, "exp", "check_failed");
          }
          if (p2) {
            let e12 = m2 - o2.iat;
            if (e12 - a2 > ("number" == typeof p2 ? p2 : tX(p2))) throw new tv('"iat" claim timestamp check failed (too far in the past)', o2, "iat", "check_failed");
            if (e12 < 0 - a2) throw new tb('"iat" claim timestamp check failed (it should be in the past)', o2, "iat", "check_failed");
          }
          return o2;
        }(n2.protectedHeader, n2.payload, r2), protectedHeader: n2.protectedHeader };
        return "function" == typeof t3 ? { ...i2, key: n2.key } : i2;
      }
      let tQ = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
      async function tY(e10) {
        let { pathname: t3 } = e10.nextUrl, r2 = t3.startsWith("/api/");
        if ("/admin/login" === t3) return $.next();
        let n2 = e10.cookies.get("jcni_session")?.value;
        if (!n2) return r2 ? $.json({ error: "Nao autorizado" }, { status: 401 }) : $.redirect(new URL("/admin/login", e10.url));
        try {
          let e11 = new TextEncoder().encode(process.env.JWT_SECRET);
          return await tG(n2, e11), $.next();
        } catch {
          if (r2) return $.json({ error: "Sessao invalida" }, { status: 401 });
          let t5 = $.redirect(new URL("/admin/login", e10.url));
          return t5.cookies.set("jcni_session", "", { maxAge: 0, path: "/" }), t5;
        }
      }
      var tZ = e.i(96592);
      Object.values({ NOT_FOUND: 404, FORBIDDEN: 403, UNAUTHORIZED: 401 });
      let t0 = { ...tZ }, t1 = t0.middleware || t0.default, t2 = "/middleware";
      if ("function" != typeof t1) throw Object.defineProperty(Error(`The Middleware "${t2}" must export a \`middleware\` or a \`default\` function`), "__NEXT_ERROR_CODE", { value: "E120", enumerable: false, configurable: true });
      function t4(e10) {
        return te({ ...e10, page: t2, handler: async (...e11) => {
          try {
            return await t1(...e11);
          } catch (i2) {
            let t3 = e11[0], r2 = new URL(t3.url), n2 = r2.pathname + r2.search;
            throw await a(i2, { path: n2, method: t3.method, headers: Object.fromEntries(t3.headers.entries()) }, { routerKind: "Pages Router", routePath: "/middleware", routeType: "middleware", revalidateReason: void 0 }), i2;
          }
        } });
      }
    }]);
  }
});

// .next/server/edge/chunks/turbopack-edge-wrapper_fb9739bb.js
var require_turbopack_edge_wrapper_fb9739bb = __commonJS({
  ".next/server/edge/chunks/turbopack-edge-wrapper_fb9739bb.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-edge-wrapper_fb9739bb.js", { otherChunks: ["chunks/[root-of-the-server]__fca94a62._.js", "chunks/[root-of-the-server]__cb0ed141._.js"], runtimeModuleIds: [88912] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      let t = /* @__PURE__ */ new WeakMap();
      function r(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let n = r.prototype, o = Object.prototype.hasOwnProperty, u = "undefined" != typeof Symbol && Symbol.toStringTag;
      function i(e2, t2, r2) {
        o.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function l(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = a(t2), e2[t2] = r2), r2;
      }
      function a(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function s(e2, t2) {
        i(e2, "__esModule", { value: true }), u && i(e2, u, { value: "Module" });
        let r2 = 0;
        for (; r2 < t2.length; ) {
          let n2 = t2[r2++], o2 = t2[r2++];
          "function" == typeof t2[r2] ? i(e2, n2, { get: o2, set: t2[r2++], enumerable: true }) : i(e2, n2, { get: o2, enumerable: true });
        }
        Object.seal(e2);
      }
      n.s = function(e2, t2) {
        let r2, n2;
        null != t2 ? n2 = (r2 = l(this.c, t2)).exports : (r2 = this.m, n2 = this.e), r2.namespaceObject = n2, s(n2, e2);
      }, n.j = function(e2, r2) {
        var n2, u2;
        let i2, a2, s2;
        null != r2 ? a2 = (i2 = l(this.c, r2)).exports : (i2 = this.m, a2 = this.e);
        let c2 = (n2 = i2, u2 = a2, (s2 = t.get(n2)) || (t.set(n2, s2 = []), n2.exports = n2.namespaceObject = new Proxy(u2, { get(e3, t2) {
          if (o.call(e3, t2) || "default" === t2 || "__esModule" === t2) return Reflect.get(e3, t2);
          for (let e4 of s2) {
            let r3 = Reflect.get(e4, t2);
            if (void 0 !== r3) return r3;
          }
        }, ownKeys(e3) {
          let t2 = Reflect.ownKeys(e3);
          for (let e4 of s2) for (let r3 of Reflect.ownKeys(e4)) "default" === r3 || t2.includes(r3) || t2.push(r3);
          return t2;
        } })), s2);
        "object" == typeof e2 && null !== e2 && c2.push(e2);
      }, n.v = function(e2, t2) {
        (null != t2 ? l(this.c, t2) : this.m).exports = e2;
      }, n.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? l(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let c = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, f = [null, c({}), c([]), c(c)];
      function d(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !f.includes(t3); t3 = c(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2[o2] = () => e2 : n2.push("default", () => e2)), s(t2, n2), t2;
      }
      function h(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function p(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      function m() {
        let e2, t2;
        return { promise: new Promise((r2, n2) => {
          t2 = n2, e2 = r2;
        }), resolve: e2, reject: t2 };
      }
      n.i = function(e2) {
        let t2 = x(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = d(r2, h(r2), r2 && r2.__esModule);
      }, n.A = function(e2) {
        return this.r(e2)(this.i.bind(this));
      }, n.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, n.r = function(e2) {
        return x(e2, this.m).exports;
      }, n.f = function(e2) {
        function t2(t3) {
          if (o.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (o.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let b = Symbol("turbopack queues"), y = Symbol("turbopack exports"), O = Symbol("turbopack error");
      function g(e2) {
        e2 && 1 !== e2.status && (e2.status = 1, e2.forEach((e3) => e3.queueCount--), e2.forEach((e3) => e3.queueCount-- ? e3.queueCount++ : e3()));
      }
      n.a = function(e2, t2) {
        let r2 = this.m, n2 = t2 ? Object.assign([], { status: -1 }) : void 0, o2 = /* @__PURE__ */ new Set(), { resolve: u2, reject: i2, promise: l2 } = m(), a2 = Object.assign(l2, { [y]: r2.exports, [b]: (e3) => {
          n2 && e3(n2), o2.forEach(e3), a2.catch(() => {
          });
        } }), s2 = { get: () => a2, set(e3) {
          e3 !== a2 && (a2[y] = e3);
        } };
        Object.defineProperty(r2, "exports", s2), Object.defineProperty(r2, "namespaceObject", s2), e2(function(e3) {
          let t3 = e3.map((e4) => {
            if (null !== e4 && "object" == typeof e4) {
              if (b in e4) return e4;
              if (null != e4 && "object" == typeof e4 && "then" in e4 && "function" == typeof e4.then) {
                let t4 = Object.assign([], { status: 0 }), r4 = { [y]: {}, [b]: (e5) => e5(t4) };
                return e4.then((e5) => {
                  r4[y] = e5, g(t4);
                }, (e5) => {
                  r4[O] = e5, g(t4);
                }), r4;
              }
            }
            return { [y]: e4, [b]: () => {
            } };
          }), r3 = () => t3.map((e4) => {
            if (e4[O]) throw e4[O];
            return e4[y];
          }), { promise: u3, resolve: i3 } = m(), l3 = Object.assign(() => i3(r3), { queueCount: 0 });
          function a3(e4) {
            e4 !== n2 && !o2.has(e4) && (o2.add(e4), e4 && 0 === e4.status && (l3.queueCount++, e4.push(l3)));
          }
          return t3.map((e4) => e4[b](a3)), l3.queueCount ? u3 : r3();
        }, function(e3) {
          e3 ? i2(a2[O] = e3) : u2(a2[y]), g(n2);
        }), n2 && -1 === n2.status && (n2.status = 0);
      };
      let w = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function _(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      w.prototype = URL.prototype, n.U = w, n.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, n.g = globalThis;
      let j = r.prototype;
      var C = function(e2) {
        return e2[e2.Runtime = 0] = "Runtime", e2[e2.Parent = 1] = "Parent", e2[e2.Update = 2] = "Update", e2;
      }(C || {});
      let k = /* @__PURE__ */ new Map();
      n.M = k;
      let R = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map();
      async function v(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return M(e2, t2, $(r2));
        let o2 = r2.included || [], u2 = o2.map((e3) => !!k.has(e3) || R.get(e3));
        if (u2.length > 0 && u2.every((e3) => e3)) return void await Promise.all(u2);
        let i2 = r2.moduleChunks || [], l2 = i2.map((e3) => U.get(e3)).filter((e3) => e3);
        if (l2.length > 0) {
          if (l2.length === i2.length) return void await Promise.all(l2);
          let r3 = /* @__PURE__ */ new Set();
          for (let e3 of i2) U.has(e3) || r3.add(e3);
          for (let n3 of r3) {
            let r4 = M(e2, t2, $(n3));
            U.set(n3, r4), l2.push(r4);
          }
          n2 = Promise.all(l2);
        } else {
          for (let o3 of (n2 = M(e2, t2, $(r2.path)), i2)) U.has(o3) || U.set(o3, n2);
        }
        for (let e3 of o2) R.has(e3) || R.set(e3, n2);
        await n2;
      }
      j.l = function(e2) {
        return v(1, this.m.id, e2);
      };
      let P = Promise.resolve(void 0), T = /* @__PURE__ */ new WeakMap();
      function M(t2, r2, n2) {
        let o2 = e.loadChunkCached(t2, n2), u2 = T.get(o2);
        if (void 0 === u2) {
          let e2 = T.set.bind(T, o2, P);
          u2 = o2.then(e2).catch((e3) => {
            let o3;
            switch (t2) {
              case 0:
                o3 = `as a runtime dependency of chunk ${r2}`;
                break;
              case 1:
                o3 = `from module ${r2}`;
                break;
              case 2:
                o3 = "from an HMR update";
                break;
              default:
                _(t2, (e4) => `Unknown source type: ${e4}`);
            }
            throw Error(`Failed to load chunk ${n2} ${o3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
          }), T.set(o2, u2);
        }
        return u2;
      }
      function $(e2) {
        return `${e2.split("/").map((e3) => encodeURIComponent(e3)).join("/")}`;
      }
      j.L = function(e2) {
        return M(1, this.m.id, e2);
      }, j.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, j.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, j.b = function(e2) {
        let t2 = new Blob([`self.TURBOPACK_WORKER_LOCATION = ${JSON.stringify(location.origin)};
self.TURBOPACK_NEXT_CHUNK_URLS = ${JSON.stringify(e2.reverse().map($), null, 2)};
importScripts(...self.TURBOPACK_NEXT_CHUNK_URLS.map(c => self.TURBOPACK_WORKER_LOCATION + c).reverse());`], { type: "text/javascript" });
        return URL.createObjectURL(t2);
      };
      let A = /\.js(?:\?[^#]*)?(?:#.*)?$/;
      n.w = function(t2, r2, n2) {
        return e.loadWebAssembly(1, this.m.id, t2, r2, n2);
      }, n.u = function(t2, r2) {
        return e.loadWebAssemblyModule(1, this.m.id, t2, r2);
      };
      let E = {};
      n.c = E;
      let x = (e2, t2) => {
        let r2 = E[e2];
        if (r2) {
          if (r2.error) throw r2.error;
          return r2;
        }
        return K(e2, C.Parent, t2.id);
      };
      function K(e2, t2, n2) {
        let o2 = k.get(e2);
        "function" != typeof o2 && function(e3, t3, r2) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r2}`;
              break;
            case 1:
              n3 = `because it was required from module ${r2}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              _(t3, (e4) => `Unknown source type: ${e4}`);
          }
          throw Error(`Module ${e3} was instantiated ${n3}, but the module factory is not available. It might have been deleted in an HMR update.`);
        }(e2, t2, n2);
        let u2 = a(e2), i2 = u2.exports;
        E[e2] = u2;
        let l2 = new r(u2, i2);
        try {
          o2(l2, u2, i2);
        } catch (e3) {
          throw u2.error = e3, e3;
        }
        return u2.namespaceObject && u2.exports !== u2.namespaceObject && d(u2.exports, u2.namespaceObject), u2;
      }
      function S(t2) {
        let r2, n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          let t3 = decodeURIComponent(("undefined" != typeof TURBOPACK_NEXT_CHUNK_URLS ? TURBOPACK_NEXT_CHUNK_URLS.pop() : e2.getAttribute("src")).replace(/[?#].*$/, ""));
          return t3.startsWith("") ? t3.slice(0) : t3;
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3, r3, n3) {
          let o2 = 1;
          for (; o2 < e2.length; ) {
            let t4 = e2[o2], n4 = o2 + 1;
            for (; n4 < e2.length && "function" != typeof e2[n4]; ) n4++;
            if (n4 === e2.length) throw Error("malformed chunk format, expected a factory function");
            if (!r3.has(t4)) {
              let u2 = e2[n4];
              for (Object.defineProperty(u2, "name", { value: "__TURBOPACK__module__evaluation__" }); o2 < n4; o2++) t4 = e2[o2], r3.set(t4, u2);
            }
            o2 = n4 + 1;
          }
        }(t2, 0, k)), e.registerChunk(n2, r2);
      }
      function N(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : d(n2, h(n2), true);
      }
      n.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? d(t2.default, h(t2), true) : t2;
      }, N.resolve = (e2, t2) => __require.resolve(e2, t2), n.x = N, (() => {
        e = { registerChunk(e2, o3) {
          t2.add(e2), function(e3) {
            let t3 = r2.get(e3);
            if (null != t3) {
              for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && n2(r3.runtimeModuleIds, r3.chunkPath);
              r2.delete(e3);
            }
          }(e2), null != o3 && (0 === o3.otherChunks.length ? n2(o3.runtimeModuleIds, e2) : function(e3, o4, u2) {
            let i2 = /* @__PURE__ */ new Set(), l2 = { runtimeModuleIds: u2, chunkPath: e3, requiredChunks: i2 };
            for (let e4 of o4) {
              let n3 = p(e4);
              if (t2.has(n3)) continue;
              i2.add(n3);
              let o5 = r2.get(n3);
              null == o5 && (o5 = /* @__PURE__ */ new Set(), r2.set(n3, o5)), o5.add(l2);
            }
            0 === l2.requiredChunks.size && n2(l2.runtimeModuleIds, l2.chunkPath);
          }(e2, o3.otherChunks.filter((e3) => {
            var t3;
            return t3 = p(e3), A.test(t3);
          }), o3.runtimeModuleIds));
        }, loadChunkCached(e2, t3) {
          throw Error("chunk loading is not supported");
        }, async loadWebAssembly(e2, t3, r3, n3, u2) {
          let i2 = await o2(r3, n3);
          return await WebAssembly.instantiate(i2, u2);
        }, loadWebAssemblyModule: async (e2, t3, r3, n3) => o2(r3, n3) };
        let t2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Map();
        function n2(e2, t3) {
          for (let r3 of e2) !function(e3, t4) {
            let r4 = E[t4];
            if (r4) {
              if (r4.error) throw r4.error;
              return;
            }
            K(t4, C.Runtime, e3);
          }(t3, r3);
        }
        async function o2(e2, t3) {
          let r3;
          try {
            r3 = t3();
          } catch (e3) {
          }
          if (!r3) throw Error(`dynamically loading WebAssembly is not supported in this runtime as global was not injected for chunk '${e2}'`);
          return r3;
        }
      })();
      let q = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: S }, q.forEach(S);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  const correspondingRoute = routes.find((route) => route.regex.some((r) => new RegExp(r).test(path3)));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/api\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$"] }];
    require_root_of_the_server_fca94a62();
    require_root_of_the_server_cb0ed141();
    require_turbopack_edge_wrapper_fb9739bb();
  }
});

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const store = globalThis.__openNextAls.getStore();
  const waitUntil = store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise));
  const nextAfterContext = {
    get: () => ({
      waitUntil
    })
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "eslint": { "ignoreDuringBuilds": false }, "typescript": { "ignoreBuildErrors": false, "tsconfigPath": "tsconfig.json" }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [16, 32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 60, "formats": ["image/avif", "image/webp"], "maximumResponseBody": 5e7, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "remotePatterns": [{ "protocol": "https", "hostname": "images.unsplash.com" }, { "protocol": "https", "hostname": "**.supabase.co" }], "unoptimized": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "amp": { "canonicalBase": "" }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "serverRuntimeConfig": {}, "publicRuntimeConfig": {}, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": {}, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "g:\\Desenvolvimento Clientes\\Jessica-Campos-Negocios-Imobiliarios\\jessica-campos-imoveis", "experimental": { "useSkewCookie": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 4294967294 } }, "cacheHandlers": {}, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "serverSourceMaps": false, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "clientSegmentCache": false, "clientParamParsing": false, "dynamicOnHover": false, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "middlewarePrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 11, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "imgOptSkipMetadata": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "viewTransition": false, "routerBFCache": false, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": false, "staleTimes": { "dynamic": 0, "static": 300 }, "serverComponentsHmrCache": true, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "cacheComponents": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "devtoolSegmentExplorer": true, "browserDebugInfoInTerminal": false, "optimizeRouterScrolling": false, "middlewareClientMaxBodySize": 10485760, "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "serverExternalPackages": ["sharp"], "turbopack": { "root": "g:\\Desenvolvimento Clientes\\Jessica-Campos-Negocios-Imobiliarios\\jessica-campos-imoveis" } };
var BuildId = "qTQLy9tSCiVEyUmfpVXR4";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/admin", "regex": "^/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin(?:/)?$" }, { "page": "/admin/comodidades", "regex": "^/admin/comodidades(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/comodidades(?:/)?$" }, { "page": "/admin/configuracoes", "regex": "^/admin/configuracoes(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/configuracoes(?:/)?$" }, { "page": "/admin/configuracoes/chat", "regex": "^/admin/configuracoes/chat(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/configuracoes/chat(?:/)?$" }, { "page": "/admin/imoveis", "regex": "^/admin/imoveis(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/imoveis(?:/)?$" }, { "page": "/admin/imoveis/novo", "regex": "^/admin/imoveis/novo(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/imoveis/novo(?:/)?$" }, { "page": "/admin/integracoes/portais", "regex": "^/admin/integracoes/portais(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/integracoes/portais(?:/)?$" }, { "page": "/admin/integracoes/portais/guia", "regex": "^/admin/integracoes/portais/guia(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/integracoes/portais/guia(?:/)?$" }, { "page": "/admin/leads", "regex": "^/admin/leads(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/leads(?:/)?$" }, { "page": "/admin/login", "regex": "^/admin/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/admin/login(?:/)?$" }, { "page": "/alugar", "regex": "^/alugar(?:/)?$", "routeKeys": {}, "namedRegex": "^/alugar(?:/)?$" }, { "page": "/comprar", "regex": "^/comprar(?:/)?$", "routeKeys": {}, "namedRegex": "^/comprar(?:/)?$" }, { "page": "/contato", "regex": "^/contato(?:/)?$", "routeKeys": {}, "namedRegex": "^/contato(?:/)?$" }, { "page": "/favicon.ico", "regex": "^/favicon\\.ico(?:/)?$", "routeKeys": {}, "namedRegex": "^/favicon\\.ico(?:/)?$" }, { "page": "/imoveis", "regex": "^/imoveis(?:/)?$", "routeKeys": {}, "namedRegex": "^/imoveis(?:/)?$" }, { "page": "/politica-de-privacidade", "regex": "^/politica\\-de\\-privacidade(?:/)?$", "routeKeys": {}, "namedRegex": "^/politica\\-de\\-privacidade(?:/)?$" }, { "page": "/robots.txt", "regex": "^/robots\\.txt(?:/)?$", "routeKeys": {}, "namedRegex": "^/robots\\.txt(?:/)?$" }, { "page": "/sitemap.xml", "regex": "^/sitemap\\.xml(?:/)?$", "routeKeys": {}, "namedRegex": "^/sitemap\\.xml(?:/)?$" }], "dynamic": [{ "page": "/admin/imoveis/[id]/editar", "regex": "^/admin/imoveis/([^/]+?)/editar(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/admin/imoveis/(?<nxtPid>[^/]+?)/editar(?:/)?$" }, { "page": "/api/admin/comodidades/categorias/[id]", "regex": "^/api/admin/comodidades/categorias/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/comodidades/categorias/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/comodidades/itens/[id]", "regex": "^/api/admin/comodidades/itens/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/comodidades/itens/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/imoveis/[id]", "regex": "^/api/admin/imoveis/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/imoveis/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/imoveis/[id]/comodos", "regex": "^/api/admin/imoveis/([^/]+?)/comodos(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/imoveis/(?<nxtPid>[^/]+?)/comodos(?:/)?$" }, { "page": "/api/admin/imoveis/[id]/comodos/[comodoId]", "regex": "^/api/admin/imoveis/([^/]+?)/comodos/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPcomodoId": "nxtPcomodoId" }, "namedRegex": "^/api/admin/imoveis/(?<nxtPid>[^/]+?)/comodos/(?<nxtPcomodoId>[^/]+?)(?:/)?$" }, { "page": "/api/admin/imoveis/[id]/fotos", "regex": "^/api/admin/imoveis/([^/]+?)/fotos(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/imoveis/(?<nxtPid>[^/]+?)/fotos(?:/)?$" }, { "page": "/api/admin/imoveis/[id]/fotos/reorder", "regex": "^/api/admin/imoveis/([^/]+?)/fotos/reorder(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/imoveis/(?<nxtPid>[^/]+?)/fotos/reorder(?:/)?$" }, { "page": "/api/admin/imoveis/[id]/fotos/[fotoId]", "regex": "^/api/admin/imoveis/([^/]+?)/fotos/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid", "nxtPfotoId": "nxtPfotoId" }, "namedRegex": "^/api/admin/imoveis/(?<nxtPid>[^/]+?)/fotos/(?<nxtPfotoId>[^/]+?)(?:/)?$" }, { "page": "/api/admin/leads/[id]", "regex": "^/api/admin/leads/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/leads/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/webhooks/[id]", "regex": "^/api/admin/webhooks/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/webhooks/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/admin/webhooks/[id]/testar", "regex": "^/api/admin/webhooks/([^/]+?)/testar(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/admin/webhooks/(?<nxtPid>[^/]+?)/testar(?:/)?$" }, { "page": "/api/imoveis/[slug]", "regex": "^/api/imoveis/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/api/imoveis/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/api/xml/[portal]", "regex": "^/api/xml/([^/]+?)(?:/)?$", "routeKeys": { "nxtPportal": "nxtPportal" }, "namedRegex": "^/api/xml/(?<nxtPportal>[^/]+?)(?:/)?$" }, { "page": "/imoveis/[slug]", "regex": "^/imoveis/([^/]+?)(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/imoveis/(?<nxtPslug>[^/]+?)(?:/)?$" }, { "page": "/imoveis/[slug]/opengraph-image", "regex": "^/imoveis/([^/]+?)/opengraph\\-image(?:/)?$", "routeKeys": { "nxtPslug": "nxtPslug" }, "namedRegex": "^/imoveis/(?<nxtPslug>[^/]+?)/opengraph\\-image(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/robots.txt": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "text/plain", "x-next-cache-tags": "_N_T_/layout,_N_T_/robots.txt/layout,_N_T_/robots.txt/route,_N_T_/robots.txt" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/robots.txt", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/sitemap.xml": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "application/xml", "x-next-cache-tags": "_N_T_/layout,_N_T_/sitemap.xml/layout,_N_T_/sitemap.xml/route,_N_T_/sitemap.xml" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/sitemap.xml", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/favicon.ico": { "initialHeaders": { "cache-control": "public, max-age=0, must-revalidate", "content-type": "image/x-icon", "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/favicon.ico", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/api/configuracoes/textos": { "initialHeaders": { "cache-control": "public, s-maxage=60, stale-while-revalidate=120", "content-type": "application/json", "x-next-cache-tags": "_N_T_/layout,_N_T_/api/layout,_N_T_/api/configuracoes/layout,_N_T_/api/configuracoes/textos/layout,_N_T_/api/configuracoes/textos/route,_N_T_/api/configuracoes/textos" }, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/api/configuracoes/textos", "dataRoute": null, "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/politica-de-privacidade": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/politica-de-privacidade", "dataRoute": "/politica-de-privacidade.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/_not-found": { "initialStatus": 404, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/_not-found", "dataRoute": "/_not-found.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/alugar": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/alugar", "dataRoute": "/alugar.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/comprar": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/comprar", "dataRoute": "/comprar.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/contato": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/contato", "dataRoute": "/contato.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] }, "/imoveis": { "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": 60, "initialExpireSeconds": 31536e3, "srcRoute": "/imoveis", "dataRoute": "/imoveis.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "75d8ebb37aab26d3b319a977e52013c0", "previewModeSigningKey": "4a9fb207a93d3978b15b17d080f6ed1140baa9fc097cdac73f3e43e2b5a651b5", "previewModeEncryptionKey": "582eed7aacf11681a6976efb3de370928afe2dba48c4ba37a6bbeb5270d9ae82" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/[root-of-the-server]__fca94a62._.js", "server/edge/chunks/[root-of-the-server]__cb0ed141._.js", "server/edge/chunks/turbopack-edge-wrapper_fb9739bb.js"], "name": "middleware", "page": "/", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "originalSource": "/admin/:path*" }, { "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?\\/api\\/admin(?:\\/((?:[^\\/#\\?]+?)(?:\\/(?:[^\\/#\\?]+?))*))?(\\\\.json)?[\\/#\\?]?$", "originalSource": "/api/admin/:path*" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "qTQLy9tSCiVEyUmfpVXR4", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "vu4L3+1d7WYCtcKU2UrtZNWORJE2bT5iZaMoJcogF4Q=", "__NEXT_PREVIEW_MODE_ID": "75d8ebb37aab26d3b319a977e52013c0", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "582eed7aacf11681a6976efb3de370928afe2dba48c4ba37a6bbeb5270d9ae82", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "4a9fb207a93d3978b15b17d080f6ed1140baa9fc097cdac73f3e43e2b5a651b5" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathRoutesManifest = { "/_not-found/page": "/_not-found", "/admin/comodidades/page": "/admin/comodidades", "/admin/configuracoes/chat/page": "/admin/configuracoes/chat", "/admin/configuracoes/page": "/admin/configuracoes", "/admin/imoveis/[id]/editar/page": "/admin/imoveis/[id]/editar", "/admin/imoveis/novo/page": "/admin/imoveis/novo", "/admin/imoveis/page": "/admin/imoveis", "/admin/integracoes/portais/guia/page": "/admin/integracoes/portais/guia", "/admin/integracoes/portais/page": "/admin/integracoes/portais", "/admin/leads/page": "/admin/leads", "/admin/login/page": "/admin/login", "/admin/page": "/admin", "/alugar/page": "/alugar", "/api/admin/chat/salvar/route": "/api/admin/chat/salvar", "/api/admin/chat/testar/route": "/api/admin/chat/testar", "/api/admin/comodidades/categorias/[id]/route": "/api/admin/comodidades/categorias/[id]", "/api/admin/comodidades/categorias/route": "/api/admin/comodidades/categorias", "/api/admin/comodidades/itens/[id]/route": "/api/admin/comodidades/itens/[id]", "/api/admin/comodidades/itens/route": "/api/admin/comodidades/itens", "/api/admin/configuracoes/route": "/api/admin/configuracoes", "/api/admin/configuracoes/upload/route": "/api/admin/configuracoes/upload", "/api/admin/imoveis/[id]/comodos/[comodoId]/route": "/api/admin/imoveis/[id]/comodos/[comodoId]", "/api/admin/imoveis/[id]/comodos/route": "/api/admin/imoveis/[id]/comodos", "/api/admin/imoveis/[id]/fotos/[fotoId]/route": "/api/admin/imoveis/[id]/fotos/[fotoId]", "/api/admin/imoveis/[id]/fotos/reorder/route": "/api/admin/imoveis/[id]/fotos/reorder", "/api/admin/imoveis/[id]/fotos/route": "/api/admin/imoveis/[id]/fotos", "/api/admin/imoveis/[id]/route": "/api/admin/imoveis/[id]", "/api/admin/imoveis/route": "/api/admin/imoveis", "/api/admin/leads/[id]/route": "/api/admin/leads/[id]", "/api/admin/leads/route": "/api/admin/leads", "/api/admin/portais/route": "/api/admin/portais", "/api/admin/webhooks/[id]/route": "/api/admin/webhooks/[id]", "/api/admin/webhooks/[id]/testar/route": "/api/admin/webhooks/[id]/testar", "/api/admin/webhooks/route": "/api/admin/webhooks", "/api/auth/login/route": "/api/auth/login", "/api/auth/logout/route": "/api/auth/logout", "/api/chat/route": "/api/chat", "/api/configuracoes/textos/route": "/api/configuracoes/textos", "/api/imoveis/[slug]/route": "/api/imoveis/[slug]", "/api/imoveis/route": "/api/imoveis", "/api/leads/route": "/api/leads", "/api/xml/[portal]/route": "/api/xml/[portal]", "/comprar/page": "/comprar", "/contato/page": "/contato", "/favicon.ico/route": "/favicon.ico", "/imoveis/[slug]/opengraph-image/route": "/imoveis/[slug]/opengraph-image", "/imoveis/[slug]/page": "/imoveis/[slug]", "/imoveis/page": "/imoveis", "/page": "/", "/politica-de-privacidade/page": "/politica-de-privacidade", "/robots.txt/route": "/robots.txt", "/sitemap.xml/route": "/sitemap.xml" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/imoveis/[slug]/opengraph-image": {} } };
var PagesManifest = { "/_app": "pages/_app.js", "/_document": "pages/_document.js", "/_error": "pages/_error.js", "/404": "pages/404.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
init_util();
import { Transform } from "node:stream";

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream2 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: match3?.[1] ? `/${match3[1]}` : url,
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream2({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
var CommonHeaders;
(function(CommonHeaders2) {
  CommonHeaders2["CACHE_CONTROL"] = "cache-control";
  CommonHeaders2["NEXT_CACHE"] = "x-nextjs-cache";
})(CommonHeaders || (CommonHeaders = {}));
function normalizeLocationHeader(location2, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location2)) {
    return location2;
  }
  const locationURL = new URL(location2);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.["x-next-cache-tags"]?.split(",") ?? [];
    delete value.meta?.headers?.["x-next-cache-tags"];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash("md5").update(str).digest("hex");
  const etag = hash(body);
  if (revalidate === 0) {
    return {
      "cache-control": "private, no-cache, no-store, max-age=0, must-revalidate",
      "x-opennext-cache": "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash ? `${path3}/` : path3;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${path3}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(path3)
      });
    }
    return {
      "cache-control": `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      "x-opennext-cache": isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    "cache-control": `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    "x-opennext-cache": "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  try {
    const segmentHeader = `${event.headers[NEXT_SEGMENT_PREFETCH_HEADER]}`;
    const isSegmentResponse = Boolean(segmentHeader) && segmentHeader in (cachedValue.segmentData || {}) && !NextConfig.experimental?.prefetchInlining;
    const body = isSegmentResponse ? cachedValue.segmentData[segmentHeader] : cachedValue.rsc;
    return {
      body,
      additionalHeaders: isSegmentResponse ? { [NEXT_PRERENDER_HEADER]: "1", [NEXT_POSTPONED_HEADER]: "2" } : {}
    };
  } catch (e) {
    error("Error while getting body for app router from cache:", e);
    return { body: cachedValue.rsc, additionalHeaders: {} };
  }
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false) {
  debug("Returning result from experimental cache");
  let body = "";
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = Boolean(event.headers.rsc);
    if (isDataRequest) {
      const { body: appRouterBody, additionalHeaders: appHeaders } = getBodyForAppRouter(event, cachedValue);
      body = appRouterBody;
      additionalHeaders = appHeaders;
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache);
  return {
    type: "core",
    // Sometimes other status codes can be cached, like 404. For these cases, we should return the correct status code
    // Also set the status code to the rewriteStatusCode if defined
    // This can happen in handleMiddleware in routingHandler.
    // `NextResponse.rewrite(url, { status: xxx})
    // The rewrite status code should take precedence over the cached one
    statusCode: event.rewriteStatusCode ?? cachedValue.meta?.status ?? 200,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers: {
      ...cacheControl,
      "content-type": type,
      ...cachedValue.meta?.headers,
      vary: VARY_HEADER,
      ...additionalHeaders
    }
  };
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => {
    try {
      return escapePathDelimiters(decodeURIComponent(segment), true);
    } catch (e) {
      return segment;
    }
  }).join("/");
}
async function cacheInterceptor(event) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers["x-prerender-revalidate"]))
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  let localizedPath = localizePath(event);
  if (NextConfig.basePath) {
    localizedPath = localizedPath.replace(NextConfig.basePath, "");
  }
  localizedPath = localizedPath.replace(/\/$/, "");
  localizedPath = decodePathParams(localizedPath);
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath ?? "/") || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
  debug("isISR", isISR);
  if (isISR) {
    try {
      const cachedData = await globalThis.incrementalCache.get(localizedPath ?? "/index");
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(localizedPath, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(localizedPath, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page":
          return generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale);
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          return {
            type: "core",
            statusCode: event.rewriteStatusCode ?? cachedData.value.meta?.status ?? 200,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers: {
              ...cacheControl,
              ...cachedData.value.meta?.headers,
              vary: VARY_HEADER
            },
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !event.headers["x-nextjs-data"] && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers["x-isr"] && headers["x-prerender-revalidate"] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie") {
        resHeaders[key] = resHeaders[key] ? [...resHeaders[key], value] : [value];
      } else if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      if (key.startsWith(INTERNAL_HEADER_PREFIX) || key.startsWith(MIDDLEWARE_HEADER_PREFIX)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": "private, no-cache, no-store, max-age=0, must-revalidate"
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    const resolvedRoutes = [
      ...foundStaticRoute,
      ...foundDynamicRoute
    ];
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers["x-isr"] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
