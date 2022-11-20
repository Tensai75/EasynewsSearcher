let $56fca9218aa06700$var$cache = !0;

function $56fca9218aa06700$var$isCurrentPathname(path) {
  if (!path) return !1;
  try {
    const {pathname: pathname} = new URL(path, location.origin);
    return pathname === location.pathname;
  } catch {
    return !1;
  }
}

function $56fca9218aa06700$var$getManifest(_version) {
  return globalThis.chrome?.runtime?.getManifest?.();
}

function $56fca9218aa06700$var$once(function_) {
  let result;
  return () => ($56fca9218aa06700$var$cache && void 0 !== result || (result = function_()), 
  result);
}

const $56fca9218aa06700$export$e7c4a1c4ed7f09ac = $56fca9218aa06700$var$once((() => globalThis.location?.protocol.startsWith("http"))), $56fca9218aa06700$export$1291dbea3b2eb4e1 = $56fca9218aa06700$var$once((() => "object" == typeof globalThis.chrome?.extension)), $56fca9218aa06700$export$d0790c2ac1fc6894 = ($56fca9218aa06700$var$once((() => $56fca9218aa06700$export$1291dbea3b2eb4e1() && $56fca9218aa06700$export$e7c4a1c4ed7f09ac())), 
() => $56fca9218aa06700$export$ede7a9f5470a0118() || $56fca9218aa06700$export$933c8adc355f9a14()), $56fca9218aa06700$export$ede7a9f5470a0118 = $56fca9218aa06700$var$once((() => {
  const manifest = $56fca9218aa06700$var$getManifest();
  return !(!manifest || !$56fca9218aa06700$var$isCurrentPathname(manifest.background_page || manifest.background?.page)) || Boolean(manifest?.background?.scripts && $56fca9218aa06700$var$isCurrentPathname("/_generated_background_page.html"));
})), $56fca9218aa06700$export$933c8adc355f9a14 = $56fca9218aa06700$var$once((() => $56fca9218aa06700$var$isCurrentPathname($56fca9218aa06700$var$getManifest()?.background?.service_worker)));

$56fca9218aa06700$var$once((() => {
  if (!$56fca9218aa06700$export$1291dbea3b2eb4e1() || !chrome.runtime.getManifest) return !1;
  const {options_ui: optionsUi} = chrome.runtime.getManifest();
  if ("string" != typeof optionsUi?.page) return !1;
  return new URL(optionsUi.page, location.origin).pathname === location.pathname;
})), $56fca9218aa06700$var$once((() => {
  if (!$56fca9218aa06700$export$1291dbea3b2eb4e1() || !chrome.devtools) return !1;
  const {devtools_page: devtoolsPage} = chrome.runtime.getManifest();
  if ("string" != typeof devtoolsPage) return !1;
  return new URL(devtoolsPage, location.origin).pathname === location.pathname;
}));

function $9749222ac2c29308$var$throttle(delay, noTrailing, callback, debounceMode) {
  var timeoutID, cancelled = !1, lastExec = 0;
  function clearExistingTimeout() {
    timeoutID && clearTimeout(timeoutID);
  }
  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) arguments_[_key] = arguments[_key];
    var self = this, elapsed = Date.now() - lastExec;
    function exec() {
      lastExec = Date.now(), callback.apply(self, arguments_);
    }
    function clear() {
      timeoutID = void 0;
    }
    cancelled || (debounceMode && !timeoutID && exec(), clearExistingTimeout(), void 0 === debounceMode && elapsed > delay ? exec() : !0 !== noTrailing && (timeoutID = setTimeout(debounceMode ? clear : exec, void 0 === debounceMode ? delay - elapsed : delay)));
  }
  return "boolean" != typeof noTrailing && (debounceMode = callback, callback = noTrailing, 
  noTrailing = void 0), wrapper.cancel = function() {
    clearExistingTimeout(), cancelled = !0;
  }, wrapper;
}

class $9749222ac2c29308$var$TypeRegistry {
  constructor(initial = {}) {
    this.registeredTypes = initial;
  }
  get(type) {
    return void 0 !== this.registeredTypes[type] ? this.registeredTypes[type] : this.registeredTypes.default;
  }
  register(type, item) {
    void 0 === this.registeredTypes[type] && (this.registeredTypes[type] = item);
  }
  registerDefault(item) {
    this.register("default", item);
  }
}

class $9749222ac2c29308$var$KeyExtractors extends $9749222ac2c29308$var$TypeRegistry {
  constructor(options) {
    super(options), this.registerDefault((el => el.getAttribute("name") || ""));
  }
}

class $9749222ac2c29308$var$InputReaders extends $9749222ac2c29308$var$TypeRegistry {
  constructor(options1) {
    super(options1), this.registerDefault((el => el.value)), this.register("checkbox", (el => null !== el.getAttribute("value") ? el.checked ? el.getAttribute("value") : null : el.checked)), 
    this.register("select", (el => function(elem) {
      var value, option, i, options = elem.options, index = elem.selectedIndex, one = "select-one" === elem.type, values = one ? null : [], max = one ? index + 1 : options.length;
      for (i = index < 0 ? max : one ? index : 0; i < max; i++) if (((option = options[i]).selected || i === index) && !option.disabled && (!option.parentNode.disabled || "optgroup" !== option.parentNode.tagName.toLowerCase())) {
        if (value = option.value, one) return value;
        values.push(value);
      }
      return values;
    }(el)));
  }
}

class $9749222ac2c29308$var$KeyAssignmentValidators extends $9749222ac2c29308$var$TypeRegistry {
  constructor(options) {
    super(options), this.registerDefault((() => !0)), this.register("radio", (el => el.checked));
  }
}

function $9749222ac2c29308$var$keySplitter(key) {
  let lastKey, matches = key.match(/[^[\]]+/g);
  return key.length > 1 && key.indexOf("[]") === key.length - 2 && (lastKey = matches.pop(), 
  matches.push([ lastKey ])), matches;
}

function $9749222ac2c29308$var$getElementType(el) {
  let typeAttr, tagName = el.tagName, type = tagName;
  return "input" === tagName.toLowerCase() && (typeAttr = el.getAttribute("type"), 
  type = typeAttr || "text"), type.toLowerCase();
}

function $9749222ac2c29308$var$getInputElements(element, options) {
  return Array.prototype.filter.call(element.querySelectorAll("input,select,textarea"), (el => {
    if ("input" === el.tagName.toLowerCase() && ("submit" === el.type || "reset" === el.type)) return !1;
    let myType = $9749222ac2c29308$var$getElementType(el), identifier = options.keyExtractors.get(myType)(el), foundInInclude = -1 !== (options.include || []).indexOf(identifier), foundInExclude = -1 !== (options.exclude || []).indexOf(identifier), foundInIgnored = !1, reject = !1;
    if (options.ignoredTypes) for (let selector of options.ignoredTypes) el.matches(selector) && (foundInIgnored = !0);
    return reject = !foundInInclude && (!!options.include || foundInExclude || foundInIgnored), 
    !reject;
  }));
}

function $9749222ac2c29308$var$assignKeyValue(obj, keychain, value) {
  if (!keychain) return obj;
  var key = keychain.shift();
  return obj[key] || (obj[key] = Array.isArray(key) ? [] : {}), 0 === keychain.length && (Array.isArray(obj[key]) ? null !== value && obj[key].push(value) : obj[key] = value), 
  keychain.length > 0 && $9749222ac2c29308$var$assignKeyValue(obj[key], keychain, value), 
  obj;
}

function $9749222ac2c29308$var$serialize(element, options = {}) {
  let data = {};
  return options.keySplitter = options.keySplitter || $9749222ac2c29308$var$keySplitter, 
  options.keyExtractors = new $9749222ac2c29308$var$KeyExtractors(options.keyExtractors || {}), 
  options.inputReaders = new $9749222ac2c29308$var$InputReaders(options.inputReaders || {}), 
  options.keyAssignmentValidators = new $9749222ac2c29308$var$KeyAssignmentValidators(options.keyAssignmentValidators || {}), 
  Array.prototype.forEach.call($9749222ac2c29308$var$getInputElements(element, options), (el => {
    let type = $9749222ac2c29308$var$getElementType(el), key = options.keyExtractors.get(type)(el), value = options.inputReaders.get(type)(el);
    if (options.keyAssignmentValidators.get(type)(el, key, value)) {
      let keychain = options.keySplitter(key);
      data = $9749222ac2c29308$var$assignKeyValue(data, keychain, value);
    }
  })), data;
}

class $9749222ac2c29308$var$InputWriters extends $9749222ac2c29308$var$TypeRegistry {
  constructor(options) {
    super(options), this.registerDefault(((el, value) => {
      el.value = value;
    })), this.register("checkbox", ((el, value) => {
      null === value ? el.indeterminate = !0 : el.checked = Array.isArray(value) ? -1 !== value.indexOf(el.value) : value;
    })), this.register("radio", (function(el, value) {
      void 0 !== value && (el.checked = el.value === value.toString());
    })), this.register("select", $9749222ac2c29308$var$setSelectValue);
  }
}

function $9749222ac2c29308$var$setSelectValue(elem, value) {
  for (var optionSet, option, arr, ret, options = elem.options, values = (ret = [], 
  null !== (arr = value) && (Array.isArray(arr) ? ret.push.apply(ret, arr) : ret.push(arr)), 
  ret), i = options.length; i--; ) option = options[i], values.indexOf(option.value) > -1 && (option.setAttribute("selected", !0), 
  optionSet = !0);
  optionSet || (elem.selectedIndex = -1);
}

function $9749222ac2c29308$var$keyJoiner(parentKey, childKey) {
  return parentKey + "[" + childKey + "]";
}

function $9749222ac2c29308$var$flattenData(data, parentKey, options = {}) {
  let flatData = {}, keyJoiner$1 = options.keyJoiner || $9749222ac2c29308$var$keyJoiner;
  for (let keyName in data) {
    if (!data.hasOwnProperty(keyName)) continue;
    let value = data[keyName], hash = {};
    parentKey && (keyName = keyJoiner$1(parentKey, keyName)), Array.isArray(value) ? (hash[keyName + "[]"] = value, 
    hash[keyName] = value) : "object" == typeof value ? hash = $9749222ac2c29308$var$flattenData(value, keyName, options) : hash[keyName] = value, 
    Object.assign(flatData, hash);
  }
  return flatData;
}

function $9749222ac2c29308$var$deserialize(form, data, options = {}) {
  let flattenedData = $9749222ac2c29308$var$flattenData(data, null, options);
  options.keyExtractors = new $9749222ac2c29308$var$KeyExtractors(options.keyExtractors || {}), 
  options.inputWriters = new $9749222ac2c29308$var$InputWriters(options.inputWriters || {}), 
  Array.prototype.forEach.call($9749222ac2c29308$var$getInputElements(form, options), (el => {
    let type = $9749222ac2c29308$var$getElementType(el), key = options.keyExtractors.get(type)(el);
    options.inputWriters.get(type)(el, flattenedData[key]);
  }));
}

var $9749222ac2c29308$var$module, $9749222ac2c29308$var$LZString, $9749222ac2c29308$var$lzString = {
  exports: {}
};

$9749222ac2c29308$var$module = $9749222ac2c29308$var$lzString, $9749222ac2c29308$var$LZString = function() {
  var f = String.fromCharCode, keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$", baseReverseDic = {};
  function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
      baseReverseDic[alphabet] = {};
      for (var i = 0; i < alphabet.length; i++) baseReverseDic[alphabet][alphabet.charAt(i)] = i;
    }
    return baseReverseDic[alphabet][character];
  }
  var LZString1 = {
    compressToBase64: function(input) {
      if (null == input) return "";
      var res = LZString1._compress(input, 6, (function(a) {
        return keyStrBase64.charAt(a);
      }));
      switch (res.length % 4) {
       default:
       case 0:
        return res;

       case 1:
        return res + "===";

       case 2:
        return res + "==";

       case 3:
        return res + "=";
      }
    },
    decompressFromBase64: function(input) {
      return null == input ? "" : "" == input ? null : LZString1._decompress(input.length, 32, (function(index) {
        return getBaseValue(keyStrBase64, input.charAt(index));
      }));
    },
    compressToUTF16: function(input) {
      return null == input ? "" : LZString1._compress(input, 15, (function(a) {
        return f(a + 32);
      })) + " ";
    },
    decompressFromUTF16: function(compressed) {
      return null == compressed ? "" : "" == compressed ? null : LZString1._decompress(compressed.length, 16384, (function(index) {
        return compressed.charCodeAt(index) - 32;
      }));
    },
    compressToUint8Array: function(uncompressed) {
      for (var compressed = LZString1.compress(uncompressed), buf = new Uint8Array(2 * compressed.length), i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
        var current_value = compressed.charCodeAt(i);
        buf[2 * i] = current_value >>> 8, buf[2 * i + 1] = current_value % 256;
      }
      return buf;
    },
    decompressFromUint8Array: function(compressed) {
      if (null == compressed) return LZString1.decompress(compressed);
      for (var buf = new Array(compressed.length / 2), i = 0, TotalLen = buf.length; i < TotalLen; i++) buf[i] = 256 * compressed[2 * i] + compressed[2 * i + 1];
      var result = [];
      return buf.forEach((function(c) {
        result.push(f(c));
      })), LZString1.decompress(result.join(""));
    },
    compressToEncodedURIComponent: function(input) {
      return null == input ? "" : LZString1._compress(input, 6, (function(a) {
        return keyStrUriSafe.charAt(a);
      }));
    },
    decompressFromEncodedURIComponent: function(input) {
      return null == input ? "" : "" == input ? null : (input = input.replace(/ /g, "+"), 
      LZString1._decompress(input.length, 32, (function(index) {
        return getBaseValue(keyStrUriSafe, input.charAt(index));
      })));
    },
    compress: function(uncompressed) {
      return LZString1._compress(uncompressed, 16, (function(a) {
        return f(a);
      }));
    },
    _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
      if (null == uncompressed) return "";
      var i, value, ii, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0;
      for (ii = 0; ii < uncompressed.length; ii += 1) if (context_c = uncompressed.charAt(ii), 
      Object.prototype.hasOwnProperty.call(context_dictionary, context_c) || (context_dictionary[context_c] = context_dictSize++, 
      context_dictionaryToCreate[context_c] = !0), context_wc = context_w + context_c, 
      Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) context_w = context_wc; else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) context_data_val <<= 1, context_data_position == bitsPerChar - 1 ? (context_data_position = 0, 
            context_data.push(getCharFromInt(context_data_val)), context_data_val = 0) : context_data_position++;
            for (value = context_w.charCodeAt(0), i = 0; i < 8; i++) context_data_val = context_data_val << 1 | 1 & value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value >>= 1;
          } else {
            for (value = 1, i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value = 0;
            for (value = context_w.charCodeAt(0), i = 0; i < 16; i++) context_data_val = context_data_val << 1 | 1 & value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value >>= 1;
          }
          0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++), 
          delete context_dictionaryToCreate[context_w];
        } else for (value = context_dictionary[context_w], i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | 1 & value, 
        context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
        context_data_val = 0) : context_data_position++, value >>= 1;
        0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++), 
        context_dictionary[context_wc] = context_dictSize++, context_w = String(context_c);
      }
      if ("" !== context_w) {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) context_data_val <<= 1, context_data_position == bitsPerChar - 1 ? (context_data_position = 0, 
            context_data.push(getCharFromInt(context_data_val)), context_data_val = 0) : context_data_position++;
            for (value = context_w.charCodeAt(0), i = 0; i < 8; i++) context_data_val = context_data_val << 1 | 1 & value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value >>= 1;
          } else {
            for (value = 1, i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value = 0;
            for (value = context_w.charCodeAt(0), i = 0; i < 16; i++) context_data_val = context_data_val << 1 | 1 & value, 
            context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
            context_data_val = 0) : context_data_position++, value >>= 1;
          }
          0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++), 
          delete context_dictionaryToCreate[context_w];
        } else for (value = context_dictionary[context_w], i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | 1 & value, 
        context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
        context_data_val = 0) : context_data_position++, value >>= 1;
        0 == --context_enlargeIn && (context_enlargeIn = Math.pow(2, context_numBits), context_numBits++);
      }
      for (value = 2, i = 0; i < context_numBits; i++) context_data_val = context_data_val << 1 | 1 & value, 
      context_data_position == bitsPerChar - 1 ? (context_data_position = 0, context_data.push(getCharFromInt(context_data_val)), 
      context_data_val = 0) : context_data_position++, value >>= 1;
      for (;;) {
        if (context_data_val <<= 1, context_data_position == bitsPerChar - 1) {
          context_data.push(getCharFromInt(context_data_val));
          break;
        }
        context_data_position++;
      }
      return context_data.join("");
    },
    decompress: function(compressed) {
      return null == compressed ? "" : "" == compressed ? null : LZString1._decompress(compressed.length, 32768, (function(index) {
        return compressed.charCodeAt(index);
      }));
    },
    _decompress: function(length, resetValue, getNextValue) {
      var i, w, bits, resb, maxpower, power, c, dictionary = [], enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], data = {
        val: getNextValue(0),
        position: resetValue,
        index: 1
      };
      for (i = 0; i < 3; i += 1) dictionary[i] = i;
      for (bits = 0, maxpower = Math.pow(2, 2), power = 1; power != maxpower; ) resb = data.val & data.position, 
      data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
      bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
      switch (bits) {
       case 0:
        for (bits = 0, maxpower = Math.pow(2, 8), power = 1; power != maxpower; ) resb = data.val & data.position, 
        data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
        bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
        c = f(bits);
        break;

       case 1:
        for (bits = 0, maxpower = Math.pow(2, 16), power = 1; power != maxpower; ) resb = data.val & data.position, 
        data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
        bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
        c = f(bits);
        break;

       case 2:
        return "";
      }
      for (dictionary[3] = c, w = c, result.push(c); ;) {
        if (data.index > length) return "";
        for (bits = 0, maxpower = Math.pow(2, numBits), power = 1; power != maxpower; ) resb = data.val & data.position, 
        data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
        bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
        switch (c = bits) {
         case 0:
          for (bits = 0, maxpower = Math.pow(2, 8), power = 1; power != maxpower; ) resb = data.val & data.position, 
          data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
          bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
          dictionary[dictSize++] = f(bits), c = dictSize - 1, enlargeIn--;
          break;

         case 1:
          for (bits = 0, maxpower = Math.pow(2, 16), power = 1; power != maxpower; ) resb = data.val & data.position, 
          data.position >>= 1, 0 == data.position && (data.position = resetValue, data.val = getNextValue(data.index++)), 
          bits |= (resb > 0 ? 1 : 0) * power, power <<= 1;
          dictionary[dictSize++] = f(bits), c = dictSize - 1, enlargeIn--;
          break;

         case 2:
          return result.join("");
        }
        if (0 == enlargeIn && (enlargeIn = Math.pow(2, numBits), numBits++), dictionary[c]) entry = dictionary[c]; else {
          if (c !== dictSize) return null;
          entry = w + w.charAt(0);
        }
        result.push(entry), dictionary[dictSize++] = w + entry.charAt(0), w = entry, 0 == --enlargeIn && (enlargeIn = Math.pow(2, numBits), 
        numBits++);
      }
    }
  };
  return LZString1;
}(), null != $9749222ac2c29308$var$module && ($9749222ac2c29308$var$module.exports = $9749222ac2c29308$var$LZString);

class $9749222ac2c29308$export$2e2bcd8739ae039 {
  constructor({defaults: defaults = {}, storageName: storageName = "options", migrations: migrations = [], logging: logging = !0, storageType: storageType = "sync"} = {}) {
    Object.defineProperty(this, "storageName", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "storageType", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "defaults", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_form", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), Object.defineProperty(this, "_migrations", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: void 0
    }), this.storageName = storageName, this.defaults = defaults, this.storageType = storageType, 
    this._handleFormInput = (300, $9749222ac2c29308$var$throttle(300, this._handleFormInput.bind(this), !1)), 
    this._handleStorageChangeOnForm = this._handleStorageChangeOnForm.bind(this), logging || (this._log = () => {}), 
    this._migrations = this._runMigrations(migrations);
  }
  get storage() {
    return chrome.storage[this.storageType];
  }
  async getAll() {
    return await this._migrations, this._getAll();
  }
  async setAll(newOptions) {
    return await this._migrations, this._setAll(newOptions);
  }
  async set(newOptions) {
    return this.setAll({
      ...await this.getAll(),
      ...newOptions
    });
  }
  async syncForm(form) {
    this._form = form instanceof HTMLFormElement ? form : document.querySelector(form), 
    this._form.addEventListener("input", this._handleFormInput), this._form.addEventListener("submit", this._handleFormSubmit), 
    chrome.storage.onChanged.addListener(this._handleStorageChangeOnForm), this._updateForm(this._form, await this.getAll());
  }
  async stopSyncForm() {
    this._form && (this._form.removeEventListener("input", this._handleFormInput), this._form.removeEventListener("submit", this._handleFormSubmit), 
    chrome.storage.onChanged.removeListener(this._handleStorageChangeOnForm), delete this._form);
  }
  _log(method, ...args) {
    console[method](...args);
  }
  async _getAll() {
    return new Promise(((resolve, reject) => {
      this.storage.get(this.storageName, (result => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve(this._decode(result[this.storageName]));
      }));
    }));
  }
  async _setAll(newOptions) {
    return this._log("log", "Saving options", newOptions), new Promise(((resolve, reject) => {
      this.storage.set({
        [this.storageName]: this._encode(newOptions)
      }, (() => {
        chrome.runtime.lastError ? reject(chrome.runtime.lastError) : resolve();
      }));
    }));
  }
  _encode(options) {
    const thinnedOptions = {
      ...options
    };
    for (const [key, value] of Object.entries(thinnedOptions)) this.defaults[key] === value && delete thinnedOptions[key];
    return this._log("log", "Without the default values", thinnedOptions), $9749222ac2c29308$var$lzString.exports.compressToEncodedURIComponent(JSON.stringify(thinnedOptions));
  }
  _decode(options) {
    let decompressed = options;
    return "string" == typeof options && (decompressed = JSON.parse($9749222ac2c29308$var$lzString.exports.decompressFromEncodedURIComponent(options))), 
    {
      ...this.defaults,
      ...decompressed
    };
  }
  async _runMigrations(migrations) {
    if (0 === migrations.length || !$56fca9218aa06700$export$d0790c2ac1fc6894() || !await async function() {
      return new Promise((resolve => {
        const callback = installType => {
          "development" !== installType ? (chrome.runtime.onInstalled.addListener((() => {
            resolve(!0);
          })), setTimeout(resolve, 500, !1)) : resolve(!0);
        };
        chrome.management?.getSelf ? chrome.management.getSelf((({installType: installType}) => {
          callback(installType);
        })) : callback("unknown");
      }));
    }()) return;
    const options = await this._getAll(), initial = JSON.stringify(options);
    this._log("log", "Found these stored options", {
      ...options
    }), this._log("info", "Will run", migrations.length, 1 === migrations.length ? "migration" : " migrations");
    for (const migrate of migrations) migrate(options, this.defaults);
    initial !== JSON.stringify(options) && await this._setAll(options);
  }
  async _handleFormInput({target: target}) {
    const field = target;
    field.name && (await this.set(this._parseForm(field.form)), field.form.dispatchEvent(new CustomEvent("options-sync:form-synced", {
      bubbles: !0
    })));
  }
  _handleFormSubmit(event) {
    event.preventDefault();
  }
  _updateForm(form, options) {
    const currentFormState = this._parseForm(form);
    for (const [key, value] of Object.entries(options)) currentFormState[key] === value && delete options[key];
    const include = Object.keys(options);
    include.length > 0 && $9749222ac2c29308$var$deserialize(form, options, {
      include: include
    });
  }
  _parseForm(form) {
    const include = [];
    for (const field of form.querySelectorAll("[name]")) field.validity.valid && !field.disabled && include.push(field.name.replace(/\[.*]/, ""));
    return $9749222ac2c29308$var$serialize(form, {
      include: include
    });
  }
  _handleStorageChangeOnForm(changes, areaName) {
    areaName !== this.storageType || !changes[this.storageName] || document.hasFocus() && this._form.contains(document.activeElement) || this._updateForm(this._form, this._decode(changes[this.storageName].newValue));
  }
}

Object.defineProperty($9749222ac2c29308$export$2e2bcd8739ae039, "migrations", {
  enumerable: !0,
  configurable: !0,
  writable: !0,
  value: {
    removeUnused(options, defaults) {
      for (const key of Object.keys(options)) key in defaults || delete options[key];
    }
  }
});

var $04dad1c1de767c9c$export$2e2bcd8739ae039 = new $9749222ac2c29308$export$2e2bcd8739ae039({
  defaults: {
    username: "",
    password: "",
    title: "periods"
  },
  migrations: [ $9749222ac2c29308$export$2e2bcd8739ae039.migrations.removeUnused ],
  logging: !0
});

!async function() {
  await $04dad1c1de767c9c$export$2e2bcd8739ae039.syncForm("#options-form");
}();