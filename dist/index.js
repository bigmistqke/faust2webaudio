(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Faust2WebAudio"] = factory();
	else
		root["Faust2WebAudio"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Faust.ts":
/*!**********************!*\
  !*** ./src/Faust.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Faust": () => (/* binding */ Faust)
/* harmony export */ });
/* harmony import */ var js_sha256__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-sha256 */ "./node_modules/js-sha256/src/sha256.js");
/* harmony import */ var js_sha256__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(js_sha256__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _LibFaustLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LibFaustLoader */ "./src/LibFaustLoader.js");
/* harmony import */ var _FaustWasmToScriptProcessor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./FaustWasmToScriptProcessor */ "./src/FaustWasmToScriptProcessor.ts");
/* harmony import */ var _FaustAudioWorkletProcessor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./FaustAudioWorkletProcessor */ "./src/FaustAudioWorkletProcessor.ts");
/* harmony import */ var _FaustAudioWorkletNode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./FaustAudioWorkletNode */ "./src/FaustAudioWorkletNode.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
/* harmony import */ var _FaustOfflineProcessor__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./FaustOfflineProcessor */ "./src/FaustOfflineProcessor.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};







class Faust {
  constructor(options) {
    this.debug = false;
    this.dspTable = {};
    this.workletProcessors = [];
    this._log = [];
    this.offlineProcessor = new _FaustOfflineProcessor__WEBPACK_IMPORTED_MODULE_6__.FaustOfflineProcessor();
    this.debug = !!(options && options.debug);
    this.wasmLocation = options.wasmLocation || "http://fr0stbyter.github.io/faust2webaudio/dist/libfaust-wasm.wasm";
    this.dataLocation = options.dataLocation || "http://fr0stbyter.github.io/faust2webaudio/dist/libfaust-wasm.data";
  }
  loadLibFaust() {
    return __async(this, null, function* () {
      if (this.libFaust)
        return this;
      this.libFaust = yield _LibFaustLoader__WEBPACK_IMPORTED_MODULE_1__.LibFaustLoader.load(this.wasmLocation, this.dataLocation);
      this.importLibFaustFunctions();
      return this;
    });
  }
  get ready() {
    return this.loadLibFaust();
  }
  importLibFaustFunctions() {
    if (!this.libFaust)
      return;
    this.createWasmCDSPFactoryFromString = this.libFaust.cwrap("createWasmCDSPFactoryFromString", "number", ["number", "number", "number", "number", "number", "number"]);
    this.deleteAllWasmCDSPFactories = this.libFaust.cwrap("deleteAllWasmCDSPFactories", null, []);
    this.expandCDSPFromString = this.libFaust.cwrap("expandCDSPFromString", "number", ["number", "number", "number", "number", "number", "number"]);
    this.getCLibFaustVersion = this.libFaust.cwrap("getCLibFaustVersion", "number", []);
    this.getWasmCModule = this.libFaust.cwrap("getWasmCModule", "number", ["number"]);
    this.getWasmCModuleSize = this.libFaust.cwrap("getWasmCModuleSize", "number", ["number"]);
    this.getWasmCHelpers = this.libFaust.cwrap("getWasmCHelpers", "number", ["number"]);
    this.freeWasmCModule = this.libFaust.cwrap("freeWasmCModule", null, ["number"]);
    this.freeCMemory = this.libFaust.cwrap("freeCMemory", null, ["number"]);
    this.cleanupAfterException = this.libFaust.cwrap("cleanupAfterException", null, []);
    this.getErrorAfterException = this.libFaust.cwrap("getErrorAfterException", "number", []);
    this.getLibFaustVersion = () => this.libFaust.UTF8ToString(this.getCLibFaustVersion());
    this.generateCAuxFilesFromString = this.libFaust.cwrap("generateCAuxFilesFromString", "number", ["number", "number", "number", "number", "number"]);
  }
  getNode(code, optionsIn) {
    return __async(this, null, function* () {
      const { audioCtx, voices, useWorklet, bufferSize, plotHandler, args } = optionsIn;
      const argv = _utils__WEBPACK_IMPORTED_MODULE_5__.toArgv(args);
      const compiledDsp = yield this.compileCodes(code, argv, !voices);
      if (!compiledDsp)
        return null;
      const options = { compiledDsp, audioCtx, voices, plotHandler, bufferSize: useWorklet ? 128 : bufferSize };
      return useWorklet ? this.getAudioWorkletNode(options) : this.getScriptProcessorNode(options);
    });
  }
  inspect(code, optionsIn) {
    return __async(this, null, function* () {
      const { voices, args } = optionsIn;
      const argv = _utils__WEBPACK_IMPORTED_MODULE_5__.toArgv(args);
      return this.compileCodes(code, argv, !voices);
    });
  }
  plot(optionsIn) {
    return __async(this, null, function* () {
      let compiledDsp;
      const argv = _utils__WEBPACK_IMPORTED_MODULE_5__.toArgv(optionsIn.args);
      if (optionsIn.code) {
        compiledDsp = yield this.compileCodes(optionsIn.code, argv, true);
        if (!compiledDsp)
          return null;
      }
      return this.offlineProcessor.plot(__spreadValues({ compiledDsp }, optionsIn));
    });
  }
  compileCode(factoryName, code, argvIn, internalMemory) {
    const codeSize = this.libFaust.lengthBytesUTF8(code) + 1;
    const $code = this.libFaust._malloc(codeSize);
    const name = "FaustDSP";
    const nameSize = this.libFaust.lengthBytesUTF8(name) + 1;
    const $name = this.libFaust._malloc(nameSize);
    const $errorMsg = this.libFaust._malloc(4096);
    this.libFaust.stringToUTF8(name, $name, nameSize);
    this.libFaust.stringToUTF8(code, $code, codeSize);
    const argv = argvIn || [];
    argv.push("-cn", factoryName);
    const ptrSize = 4;
    const $argv = this.libFaust._malloc(argv.length * ptrSize);
    let argvBuffer$ = new Int32Array(this.libFaust.HEAP32.buffer, $argv, argv.length);
    for (let i = 0; i < argv.length; i++) {
      const size$arg = this.libFaust.lengthBytesUTF8(argv[i]) + 1;
      const $arg = this.libFaust._malloc(size$arg);
      this.libFaust.stringToUTF8(argv[i], $arg, size$arg);
      argvBuffer$[i] = $arg;
    }
    try {
      const time1 = performance.now();
      const $moduleCode = this.createWasmCDSPFactoryFromString($name, $code, argv.length, $argv, $errorMsg, internalMemory);
      const time2 = performance.now();
      this.log("Faust compilation duration : " + (time2 - time1));
      const errorMsg = this.libFaust.UTF8ToString($errorMsg);
      if (errorMsg)
        throw new Error(errorMsg);
      if ($moduleCode === 0)
        return null;
      const $compiledCode = this.getWasmCModule($moduleCode);
      const compiledCodeSize = this.getWasmCModuleSize($moduleCode);
      const ui8Code = new Uint8Array(compiledCodeSize);
      for (let i = 0; i < compiledCodeSize; i++) {
        ui8Code[i] = this.libFaust.HEAP8[$compiledCode + i];
      }
      const $helpersCode = this.getWasmCHelpers($moduleCode);
      const helpersCode = this.libFaust.UTF8ToString($helpersCode);
      this.libFaust._free($code);
      this.libFaust._free($name);
      this.libFaust._free($errorMsg);
      this.freeWasmCModule($moduleCode);
      argvBuffer$ = new Int32Array(this.libFaust.HEAP32.buffer, $argv, argv.length);
      for (let i = 0; i < argv.length; i++) {
        this.libFaust._free(argvBuffer$[i]);
      }
      this.libFaust._free($argv);
      return { ui8Code, code, helpersCode };
    } catch (e) {
      const errorMsg = this.libFaust.UTF8ToString(this.getErrorAfterException());
      this.cleanupAfterException();
      throw errorMsg ? new Error(errorMsg) : e;
    }
  }
  compileCodes(code, argv, internalMemory) {
    return __async(this, null, function* () {
      const strArgv = argv.join("");
      const shaKey = (0,js_sha256__WEBPACK_IMPORTED_MODULE_0__.sha256)(this.expandCode(code, argv) + (internalMemory ? "internal_memory" : "external_memory") + strArgv);
      const compiledDsp = this.dspTable[shaKey];
      if (compiledDsp) {
        this.log("Existing library : " + shaKey);
        return compiledDsp;
      }
      this.log("libfaust.js version : " + this.getLibFaustVersion());
      const effectCode = `adapt(1,1) = _; adapt(2,2) = _,_; adapt(1,2) = _ <: _,_; adapt(2,1) = _,_ :> _;
adaptor(F,G) = adapt(outputs(F),inputs(G));
dsp_code = environment{${code}};
process = adaptor(dsp_code.process, dsp_code.effect) : dsp_code.effect;`;
      const dspCompiledCode = this.compileCode(shaKey, code, argv, internalMemory);
      let effectCompiledCode;
      try {
        effectCompiledCode = this.compileCode(shaKey + "_", effectCode, argv, internalMemory);
      } catch (e) {
      }
      const compiledCodes = { dsp: dspCompiledCode, effect: effectCompiledCode };
      return this.compileDsp(compiledCodes, shaKey);
    });
  }
  expandCode(code, args) {
    this.log("libfaust.js version : " + this.getLibFaustVersion());
    const codeSize = this.libFaust.lengthBytesUTF8(code) + 1;
    const $code = this.libFaust._malloc(codeSize);
    const name = "FaustDSP";
    const nameSize = this.libFaust.lengthBytesUTF8(name) + 1;
    const $name = this.libFaust._malloc(nameSize);
    const $shaKey = this.libFaust._malloc(64);
    const $errorMsg = this.libFaust._malloc(4096);
    this.libFaust.stringToUTF8(name, $name, nameSize);
    this.libFaust.stringToUTF8(code, $code, codeSize);
    const argvIn = args ? Array.isArray(args) ? args : _utils__WEBPACK_IMPORTED_MODULE_5__.toArgv(args) : [];
    const argv = [...argvIn, "-lang", "wasm"];
    const ptrSize = 4;
    const $argv = this.libFaust._malloc(argv.length * ptrSize);
    let argvBuffer$ = new Int32Array(this.libFaust.HEAP32.buffer, $argv, argv.length);
    for (let i = 0; i < argv.length; i++) {
      const size$arg = this.libFaust.lengthBytesUTF8(argv[i]) + 1;
      const $arg = this.libFaust._malloc(size$arg);
      this.libFaust.stringToUTF8(argv[i], $arg, size$arg);
      argvBuffer$[i] = $arg;
    }
    try {
      const $expandedCode = this.expandCDSPFromString($name, $code, argv.length, $argv, $shaKey, $errorMsg);
      const expandedCode = this.libFaust.UTF8ToString($expandedCode);
      const errorMsg = this.libFaust.UTF8ToString($errorMsg);
      if (errorMsg)
        this.error(errorMsg);
      this.libFaust._free($code);
      this.libFaust._free($name);
      this.libFaust._free($shaKey);
      this.libFaust._free($errorMsg);
      this.freeCMemory($expandedCode);
      argvBuffer$ = new Int32Array(this.libFaust.HEAP32.buffer, $argv, argv.length);
      for (let i = 0; i < argv.length; i++) {
        this.libFaust._free(argvBuffer$[i]);
      }
      this.libFaust._free($argv);
      return expandedCode;
    } catch (e) {
      const errorMsg = this.libFaust.UTF8ToString(this.getErrorAfterException());
      this.cleanupAfterException();
      throw errorMsg ? new Error(errorMsg) : e;
    }
  }
  compileDsp(codes, shaKey) {
    return __async(this, null, function* () {
      const time1 = performance.now();
      const dspModule = yield WebAssembly.compile(codes.dsp.ui8Code);
      if (!dspModule) {
        this.error("Faust DSP factory cannot be compiled");
        throw new Error("Faust DSP factory cannot be compiled");
      }
      const time2 = performance.now();
      this.log("WASM compilation duration : " + (time2 - time1));
      const compiledDsp = { shaKey, codes, dspModule, dspMeta: void 0 };
      try {
        const json = codes.dsp.helpersCode.match(/getJSON\w+?\(\)[\s\n]*{[\s\n]*return[\s\n]*'(\{.+?)';}/)[1].replace(/\\'/g, "'");
        const meta = JSON.parse(json);
        compiledDsp.dspMeta = meta;
      } catch (e) {
        this.error("Error in JSON.parse: " + e.message);
        throw e;
      }
      this.dspTable[shaKey] = compiledDsp;
      if (!codes.effect)
        return compiledDsp;
      try {
        const effectModule = yield WebAssembly.compile(codes.effect.ui8Code);
        compiledDsp.effectModule = effectModule;
        try {
          const json = codes.effect.helpersCode.match(/getJSON\w+?\(\)[\s\n]*{[\s\n]*return[\s\n]*'(\{.+?)';}/)[1].replace(/\\'/g, "'");
          const meta = JSON.parse(json);
          compiledDsp.effectMeta = meta;
        } catch (e) {
          this.error("Error in JSON.parse: " + e.message);
          throw e;
        }
      } catch (e) {
        return compiledDsp;
      }
      return compiledDsp;
    });
  }
  getScriptProcessorNode(optionsIn) {
    return __async(this, null, function* () {
      return new _FaustWasmToScriptProcessor__WEBPACK_IMPORTED_MODULE_2__.FaustWasmToScriptProcessor(this).getNode(optionsIn);
    });
  }
  getAudioWorkletNode(optionsIn) {
    return __async(this, null, function* () {
      const { compiledDsp: compiledDspWithCodes, audioCtx, voices, plotHandler } = optionsIn;
      const compiledDsp = __spreadValues({}, compiledDspWithCodes);
      delete compiledDsp.codes;
      const id = compiledDsp.shaKey + "_" + voices;
      if (this.workletProcessors.indexOf(id) === -1) {
        const strProcessor = `
const remap = ${_utils__WEBPACK_IMPORTED_MODULE_5__.remap.toString()};
const midiToFreq = ${_utils__WEBPACK_IMPORTED_MODULE_5__.midiToFreq.toString()};
const findPath = (${_utils__WEBPACK_IMPORTED_MODULE_5__.findPathClosure.toString()})();
const createWasmImport = ${_utils__WEBPACK_IMPORTED_MODULE_5__.createWasmImport.toString()};
const createWasmMemory = ${_utils__WEBPACK_IMPORTED_MODULE_5__.createWasmMemory.toString()};
const faustData = ${JSON.stringify({
          id,
          voices,
          dspMeta: compiledDsp.dspMeta,
          effectMeta: compiledDsp.effectMeta
        })};
(${_FaustAudioWorkletProcessor__WEBPACK_IMPORTED_MODULE_3__.FaustAudioWorkletProcessorWrapper.toString()})();
`;
        const url = window.URL.createObjectURL(new Blob([strProcessor], { type: "text/javascript" }));
        yield audioCtx.audioWorklet.addModule(url);
        this.workletProcessors.push(id);
      }
      return new _FaustAudioWorkletNode__WEBPACK_IMPORTED_MODULE_4__.FaustAudioWorkletNode({ audioCtx, id, voices, compiledDsp, plotHandler, mixer32Module: _utils__WEBPACK_IMPORTED_MODULE_5__.mixer32Module });
    });
  }
  deleteDsp(compiledDsp) {
    delete this.dspTable[compiledDsp.shaKey];
    this.deleteAllWasmCDSPFactories();
  }
  stringifyDspTable() {
    const strTable = {};
    for (const key in this.dspTable) {
      const { codes } = this.dspTable[key];
      strTable[key] = {
        dsp: {
          strCode: btoa(_utils__WEBPACK_IMPORTED_MODULE_5__.ab2str(codes.dsp.ui8Code)),
          code: codes.dsp.code,
          helpersCode: codes.dsp.helpersCode
        },
        effect: codes.effect ? {
          strCode: btoa(_utils__WEBPACK_IMPORTED_MODULE_5__.ab2str(codes.effect.ui8Code)),
          code: codes.effect.code,
          helpersCode: codes.effect.helpersCode
        } : void 0
      };
    }
    return JSON.stringify(strTable);
  }
  parseDspTable(str) {
    const strTable = JSON.parse(str);
    for (const shaKey in strTable) {
      if (this.dspTable[shaKey])
        continue;
      const strCodes = strTable[shaKey];
      const compiledCodes = {
        dsp: {
          ui8Code: _utils__WEBPACK_IMPORTED_MODULE_5__.str2ab(atob(strCodes.dsp.strCode)),
          code: strCodes.dsp.code,
          helpersCode: strCodes.dsp.helpersCode
        },
        effect: strCodes.effect ? {
          ui8Code: _utils__WEBPACK_IMPORTED_MODULE_5__.str2ab(atob(strCodes.effect.strCode)),
          code: strCodes.effect.code,
          helpersCode: strCodes.effect.helpersCode
        } : void 0
      };
      this.compileDsp(compiledCodes, shaKey).then((dsp) => this.dspTable[shaKey] = dsp);
    }
  }
  getDiagram(code, args) {
    const codeSize = this.libFaust.lengthBytesUTF8(code) + 1;
    const $code = this.libFaust._malloc(codeSize);
    const name = "FaustDSP";
    const nameSize = this.libFaust.lengthBytesUTF8(name) + 1;
    const $name = this.libFaust._malloc(nameSize);
    const $errorMsg = this.libFaust._malloc(4096);
    this.libFaust.stringToUTF8(name, $name, nameSize);
    this.libFaust.stringToUTF8(code, $code, codeSize);
    const argvIn = args ? _utils__WEBPACK_IMPORTED_MODULE_5__.toArgv(args) : [];
    const argv = [...argvIn, "-lang", "wast", "-o", "/dev/null", "-svg"];
    const ptrSize = 4;
    const $argv = this.libFaust._malloc(argv.length * ptrSize);
    let argvBuffer$ = new Int32Array(this.libFaust.HEAP32.buffer, $argv, argv.length);
    for (let i = 0; i < argv.length; i++) {
      const size$arg = this.libFaust.lengthBytesUTF8(argv[i]) + 1;
      const $arg = this.libFaust._malloc(size$arg);
      this.libFaust.stringToUTF8(argv[i], $arg, size$arg);
      argvBuffer$[i] = $arg;
    }
    try {
      this.generateCAuxFilesFromString($name, $code, argv.length, $argv, $errorMsg);
      this.libFaust._free($code);
      this.libFaust._free($name);
      this.libFaust._free($errorMsg);
      argvBuffer$ = new Int32Array(this.libFaust.HEAP32.buffer, $argv, argv.length);
      for (let i = 0; i < argv.length; i++) {
        this.libFaust._free(argvBuffer$[i]);
      }
      this.libFaust._free($argv);
    } catch (e) {
      const errorMsg = this.libFaust.UTF8ToString(this.getErrorAfterException());
      this.cleanupAfterException();
      throw errorMsg ? new Error(errorMsg) : e;
    }
    return this.libFaust.FS.readFile("FaustDSP-svg/process.svg", { encoding: "utf8" });
  }
  get fs() {
    return this.libFaust.FS;
  }
  log(...args) {
    if (this.debug)
      console.log(...args);
    const msg = args.length === 1 && typeof args[0] === "string" ? args[0] : JSON.stringify(args.length !== 1 ? args : args[0]);
    this._log.push(msg);
    if (typeof this.logHandler === "function")
      this.logHandler(msg, 0);
  }
  error(...args) {
    console.error(...args);
    const msg = args.length === 1 && typeof args[0] === "string" ? args[0] : JSON.stringify(args.length !== 1 ? args : args[0]);
    this._log.push(msg);
    if (typeof this.logHandler === "function")
      this.logHandler(msg, 1);
  }
}


/***/ }),

/***/ "./src/FaustAudioWorkletNode.ts":
/*!**************************************!*\
  !*** ./src/FaustAudioWorkletNode.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FaustAudioWorkletNode": () => (/* binding */ FaustAudioWorkletNode)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};

class FaustAudioWorkletNode extends (window.AudioWorkletNode ? AudioWorkletNode : null) {
  constructor(options) {
    super(options.audioCtx, options.id, {
      numberOfInputs: options.compiledDsp.dspMeta.inputs > 0 ? 1 : 0,
      numberOfOutputs: options.compiledDsp.dspMeta.outputs > 0 ? 1 : 0,
      channelCount: Math.max(1, options.compiledDsp.dspMeta.inputs),
      outputChannelCount: [options.compiledDsp.dspMeta.outputs],
      channelCountMode: "explicit",
      channelInterpretation: "speakers",
      processorOptions: { id: options.id, voices: options.voices, compiledDsp: options.compiledDsp, mixer32Module: options.mixer32Module }
    });
    this.onprocessorerror = (e) => {
      console.error("Error from " + this.dspMeta.name + " AudioWorkletNode: ");
      throw e.error;
    };
    this.port.onmessage = (e) => {
      if (e.data.type === "param" && this.outputHandler) {
        this.outputHandler(e.data.path, e.data.value);
      } else if (e.data.type === "plot") {
        if (this.plotHandler)
          this.plotHandler(e.data.value, e.data.index, e.data.events);
      }
    };
    this.voices = options.voices;
    this.dspMeta = options.compiledDsp.dspMeta;
    this.effectMeta = options.compiledDsp.effectMeta;
    this.outputHandler = null;
    this.inputsItems = [];
    this.outputsItems = [];
    this.fPitchwheelLabel = [];
    this.fCtrlLabel = new Array(128).fill(null).map(() => []);
    this.plotHandler = options.plotHandler;
    this.parseUI(this.dspMeta.ui);
    if (this.effectMeta)
      this.parseUI(this.effectMeta.ui);
    try {
      if (this.parameters)
        this.parameters.forEach((p) => p.automationRate = "k-rate");
    } catch (e) {
    }
  }
  parseUI(ui) {
    ui.forEach((group) => this.parseGroup(group));
  }
  parseGroup(group) {
    if (group.items)
      this.parseItems(group.items);
  }
  parseItems(items) {
    items.forEach((item) => this.parseItem(item));
  }
  parseItem(item) {
    if (item.type === "vgroup" || item.type === "hgroup" || item.type === "tgroup") {
      this.parseItems(item.items);
    } else if (item.type === "hbargraph" || item.type === "vbargraph") {
      this.outputsItems.push(item.address);
    } else if (item.type === "vslider" || item.type === "hslider" || item.type === "button" || item.type === "checkbox" || item.type === "nentry") {
      this.inputsItems.push(item.address);
      if (!item.meta)
        return;
      item.meta.forEach((meta) => {
        const { midi } = meta;
        if (!midi)
          return;
        const strMidi = midi.trim();
        if (strMidi === "pitchwheel") {
          this.fPitchwheelLabel.push({ path: item.address, min: item.min, max: item.max });
        } else {
          const matched = strMidi.match(/^ctrl\s(\d+)/);
          if (!matched)
            return;
          this.fCtrlLabel[parseInt(matched[1])].push({ path: item.address, min: item.min, max: item.max });
        }
      });
    }
  }
  keyOn(channel, pitch, velocity) {
    const e = { type: "keyOn", data: [channel, pitch, velocity] };
    this.port.postMessage(e);
  }
  keyOff(channel, pitch, velocity) {
    const e = { type: "keyOff", data: [channel, pitch, velocity] };
    this.port.postMessage(e);
  }
  allNotesOff() {
    const e = { type: "ctrlChange", data: [0, 123, 0] };
    this.port.postMessage(e);
  }
  ctrlChange(channel, ctrlIn, valueIn) {
    const e = { type: "ctrlChange", data: [channel, ctrlIn, valueIn] };
    this.port.postMessage(e);
    if (!this.fCtrlLabel[ctrlIn].length)
      return;
    this.fCtrlLabel[ctrlIn].forEach((ctrl) => {
      const { path } = ctrl;
      const value = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.remap)(valueIn, 0, 127, ctrl.min, ctrl.max);
      const param = this.parameters.get(path);
      if (param)
        param.setValueAtTime(value, this.context.currentTime);
    });
  }
  pitchWheel(channel, wheel) {
    const e = { type: "pitchWheel", data: [channel, wheel] };
    this.port.postMessage(e);
    this.fPitchwheelLabel.forEach((pw) => {
      const { path } = pw;
      const value = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.remap)(wheel, 0, 16383, pw.min, pw.max);
      const param = this.parameters.get(path);
      if (param)
        param.setValueAtTime(value, this.context.currentTime);
    });
  }
  midiMessage(data) {
    const cmd = data[0] >> 4;
    const channel = data[0] & 15;
    const data1 = data[1];
    const data2 = data[2];
    if (channel === 9)
      return;
    if (cmd === 8 || cmd === 9 && data2 === 0)
      this.keyOff(channel, data1, data2);
    else if (cmd === 9)
      this.keyOn(channel, data1, data2);
    else if (cmd === 11)
      this.ctrlChange(channel, data1, data2);
    else if (cmd === 14)
      this.pitchWheel(channel, data2 * 128 + data1);
    else
      this.port.postMessage({ data, type: "midi" });
  }
  metadata() {
  }
  setParamValue(path, value) {
    const e = { type: "param", data: { path, value } };
    this.port.postMessage(e);
    const param = this.parameters.get(path);
    if (param)
      param.setValueAtTime(value, this.context.currentTime);
  }
  getParamValue(path) {
    const param = this.parameters.get(path);
    if (param)
      return param.value;
    return null;
  }
  setOutputParamHandler(handler) {
    this.outputHandler = handler;
  }
  getOutputParamHandler() {
    return this.outputHandler;
  }
  getNumInputs() {
    return this.dspMeta.inputs;
  }
  getNumOutputs() {
    return this.dspMeta.outputs;
  }
  getParams() {
    return this.inputsItems;
  }
  getJSON() {
    if (this.voices) {
      const o = this.dspMeta;
      const e = this.effectMeta;
      const r = __spreadValues({}, o);
      if (e) {
        r.ui = [{ type: "tgroup", label: "Sequencer", items: [
          { type: "vgroup", label: "Instrument", items: o.ui },
          { type: "vgroup", label: "Effect", items: e.ui }
        ] }];
      } else {
        r.ui = [{ type: "tgroup", label: "Polyphonic", items: [
          { type: "vgroup", label: "Voices", items: o.ui }
        ] }];
      }
      return JSON.stringify(r);
    }
    return JSON.stringify(this.dspMeta);
  }
  getUI() {
    if (this.voices) {
      const o = this.dspMeta;
      const e = this.effectMeta;
      if (e) {
        return [{ type: "tgroup", label: "Sequencer", items: [
          { type: "vgroup", label: "Instrument", items: o.ui },
          { type: "vgroup", label: "Effect", items: e.ui }
        ] }];
      }
      return [{ type: "tgroup", label: "Polyphonic", items: [
        { type: "vgroup", label: "Voices", items: o.ui }
      ] }];
    }
    return this.dspMeta.ui;
  }
  destroy() {
    this.port.postMessage({ type: "destroy" });
    this.port.close();
    delete this.plotHandler;
    delete this.outputHandler;
  }
}


/***/ }),

/***/ "./src/FaustAudioWorkletProcessor.ts":
/*!*******************************************!*\
  !*** ./src/FaustAudioWorkletProcessor.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FaustAudioWorkletProcessorWrapper": () => (/* binding */ FaustAudioWorkletProcessorWrapper)
/* harmony export */ });
const FaustAudioWorkletProcessorWrapper = () => {
  class FaustConst {
  }
  FaustConst.id = faustData.id;
  FaustConst.dspMeta = faustData.dspMeta;
  FaustConst.effectMeta = faustData.effectMeta;
  const _FaustAudioWorkletProcessor = class extends AudioWorkletProcessor {
    constructor(options) {
      super(options);
      this.handleMessage = (e) => {
        const msg = e.data;
        this.cachedEvents.push({ type: e.data.type, data: e.data.data });
        switch (msg.type) {
          case "midi":
            this.midiMessage(msg.data);
            break;
          case "keyOn":
            this.keyOn(msg.data[0], msg.data[1], msg.data[2]);
            break;
          case "keyOff":
            this.keyOff(msg.data[0], msg.data[1], msg.data[2]);
            break;
          case "ctrlChange":
            this.ctrlChange(msg.data[0], msg.data[1], msg.data[2]);
            break;
          case "pitchWheel":
            this.pitchWheel(msg.data[0], msg.data[1]);
            break;
          case "param":
            this.setParamValue(msg.data.path, msg.data.value);
            break;
          case "destroy": {
            this.port.close();
            this.destroyed = true;
            delete this.outputHandler;
            delete this.computeHandler;
            break;
          }
          default:
        }
      };
      const processorOptions = options.processorOptions;
      this.instantiateWasm(processorOptions);
      this.port.onmessage = this.handleMessage;
      this.destroyed = false;
      this.bufferSize = 128;
      this.voices = processorOptions.voices;
      this.dspMeta = processorOptions.compiledDsp.dspMeta;
      this.outputHandler = (path, value) => this.port.postMessage({ path, value, type: "param" });
      this.computeHandler = null;
      this.$ins = null;
      this.$outs = null;
      this.dspInChannnels = [];
      this.dspOutChannnels = [];
      this.fPitchwheelLabel = [];
      this.fCtrlLabel = new Array(128).fill(null).map(() => []);
      this.numIn = this.dspMeta.inputs;
      this.numOut = this.dspMeta.outputs;
      this.ptrSize = 4;
      this.sampleSize = 4;
      this.factory = this.dspInstance.exports;
      this.HEAP = this.voices ? this.memory.buffer : this.factory.memory.buffer;
      this.HEAP32 = new Int32Array(this.HEAP);
      this.HEAPF32 = new Float32Array(this.HEAP);
      this.outputsTimer = 5;
      this.outputsItems = [];
      this.inputsItems = [];
      this.$audioHeap = this.voices ? 0 : this.dspMeta.size;
      this.$$audioHeapInputs = this.$audioHeap;
      this.$$audioHeapOutputs = this.$$audioHeapInputs + this.numIn * this.ptrSize;
      this.$audioHeapInputs = this.$$audioHeapOutputs + this.numOut * this.ptrSize;
      this.$audioHeapOutputs = this.$audioHeapInputs + this.numIn * this.bufferSize * this.sampleSize;
      if (this.voices) {
        this.$$audioHeapMixing = this.$$audioHeapOutputs + this.numOut * this.ptrSize;
        this.$audioHeapInputs = this.$$audioHeapMixing + this.numOut * this.ptrSize;
        this.$audioHeapOutputs = this.$audioHeapInputs + this.numIn * this.bufferSize * this.sampleSize;
        this.$audioHeapMixing = this.$audioHeapOutputs + this.numOut * this.bufferSize * this.sampleSize;
        this.$dsp = this.$audioHeapMixing + this.numOut * this.bufferSize * this.sampleSize;
      } else {
        this.$audioHeapInputs = this.$$audioHeapOutputs + this.numOut * this.ptrSize;
        this.$audioHeapOutputs = this.$audioHeapInputs + this.numIn * this.bufferSize * this.sampleSize;
        this.$dsp = 0;
      }
      if (this.voices) {
        this.effectMeta = FaustConst.effectMeta;
        this.$mixing = null;
        this.fFreqLabel$ = [];
        this.fKeyLabel$ = [];
        this.fGateLabel$ = [];
        this.fGainLabel$ = [];
        this.fVelLabel$ = [];
        this.fDate = 0;
        this.mixer = this.mixerInstance.exports;
        this.effect = this.effectInstance ? this.effectInstance.exports : null;
        this.dspVoices$ = [];
        this.dspVoicesState = [];
        this.dspVoicesLevel = [];
        this.dspVoicesDate = [];
        this.kActiveVoice = 0;
        this.kFreeVoice = -1;
        this.kReleaseVoice = -2;
        this.kNoVoice = -3;
        for (let i = 0; i < this.voices; i++) {
          this.dspVoices$[i] = this.$dsp + i * this.dspMeta.size;
          this.dspVoicesState[i] = this.kFreeVoice;
          this.dspVoicesLevel[i] = 0;
          this.dspVoicesDate[i] = 0;
        }
        this.$effect = this.dspVoices$[this.voices - 1] + this.dspMeta.size;
      }
      this.pathTable$ = {};
      this.$buffer = 0;
      this.cachedEvents = [];
      this.setup();
    }
    static parseUI(ui, obj, callback) {
      for (let i = 0; i < ui.length; i++) {
        this.parseGroup(ui[i], obj, callback);
      }
    }
    static parseGroup(group, obj, callback) {
      if (group.items) {
        this.parseItems(group.items, obj, callback);
      }
    }
    static parseItems(items, obj, callback) {
      for (let i = 0; i < items.length; i++) {
        callback(items[i], obj, callback);
      }
    }
    static parseItem(item, obj, callback) {
      if (item.type === "vgroup" || item.type === "hgroup" || item.type === "tgroup") {
        _FaustAudioWorkletProcessor.parseItems(item.items, obj, callback);
      } else if (item.type === "hbargraph" || item.type === "vbargraph") {
      } else if (item.type === "vslider" || item.type === "hslider" || item.type === "nentry") {
        if (!faustData.voices || !item.address.endsWith("/gate") && !item.address.endsWith("/freq") && !item.address.endsWith("/key") && !item.address.endsWith("/vel") && !item.address.endsWith("/velocity") && !item.address.endsWith("/gain")) {
          obj.push({ name: item.address, defaultValue: item.init || 0, minValue: item.min || 0, maxValue: item.max || 0 });
        }
      } else if (item.type === "button" || item.type === "checkbox") {
        if (!faustData.voices || !item.address.endsWith("/gate") && !item.address.endsWith("/freq") && !item.address.endsWith("/key") && !item.address.endsWith("/vel") && !item.address.endsWith("/velocity") && !item.address.endsWith("/gain")) {
          obj.push({ name: item.address, defaultValue: item.init || 0, minValue: 0, maxValue: 1 });
        }
      }
    }
    static parseItem2(item, obj, callback) {
      if (item.type === "vgroup" || item.type === "hgroup" || item.type === "tgroup") {
        _FaustAudioWorkletProcessor.parseItems(item.items, obj, callback);
      } else if (item.type === "hbargraph" || item.type === "vbargraph") {
        obj.outputsItems.push(item.address);
        obj.pathTable$[item.address] = item.index;
      } else if (item.type === "vslider" || item.type === "hslider" || item.type === "button" || item.type === "checkbox" || item.type === "nentry") {
        obj.inputsItems.push(item.address);
        obj.pathTable$[item.address] = item.index;
        if (!item.meta)
          return;
        item.meta.forEach((meta) => {
          const { midi } = meta;
          if (!midi)
            return;
          const strMidi = midi.trim();
          if (strMidi === "pitchwheel") {
            obj.fPitchwheelLabel.push({ path: item.address, min: item.min, max: item.max });
          } else {
            const matched = strMidi.match(/^ctrl\s(\d+)/);
            if (!matched)
              return;
            obj.fCtrlLabel[parseInt(matched[1])].push({ path: item.address, min: item.min, max: item.max });
          }
        });
      }
    }
    static get parameterDescriptors() {
      const params = [];
      this.parseUI(FaustConst.dspMeta.ui, params, this.parseItem);
      if (FaustConst.effectMeta)
        this.parseUI(FaustConst.effectMeta.ui, params, this.parseItem);
      return params;
    }
    instantiateWasm(options) {
      const memory = createWasmMemory(options.voices, options.compiledDsp.dspMeta, options.compiledDsp.effectMeta, 128);
      this.memory = memory;
      const imports = createWasmImport(options.voices, memory);
      this.dspInstance = new WebAssembly.Instance(options.compiledDsp.dspModule, imports);
      if (options.compiledDsp.effectModule) {
        this.effectInstance = new WebAssembly.Instance(options.compiledDsp.effectModule, imports);
      }
      if (options.voices) {
        const mixerImports = { imports: { print: console.log }, memory: { memory } };
        this.mixerInstance = new WebAssembly.Instance(options.mixer32Module, mixerImports);
      }
    }
    updateOutputs() {
      if (this.outputsItems.length > 0 && this.outputHandler && this.outputsTimer-- === 0) {
        this.outputsTimer = 5;
        this.outputsItems.forEach((item) => this.outputHandler(item, this.factory.getParamValue(this.$dsp, this.pathTable$[item])));
      }
    }
    parseUI(ui) {
      return _FaustAudioWorkletProcessor.parseUI(ui, this, _FaustAudioWorkletProcessor.parseItem2);
    }
    parseGroup(group) {
      return _FaustAudioWorkletProcessor.parseGroup(group, this, _FaustAudioWorkletProcessor.parseItem2);
    }
    parseItems(items) {
      return _FaustAudioWorkletProcessor.parseItems(items, this, _FaustAudioWorkletProcessor.parseItem2);
    }
    parseItem(item) {
      return _FaustAudioWorkletProcessor.parseItem2(item, this, _FaustAudioWorkletProcessor.parseItem2);
    }
    setParamValue(path, val) {
      if (this.voices) {
        if (this.effect && findPath(this.effectMeta.ui, path))
          this.effect.setParamValue(this.$effect, this.pathTable$[path], val);
        else
          this.dspVoices$.forEach(($voice) => this.factory.setParamValue($voice, this.pathTable$[path], val));
      } else {
        this.factory.setParamValue(this.$dsp, this.pathTable$[path], val);
      }
    }
    getParamValue(path) {
      if (this.voices) {
        if (this.effect && findPath(this.effectMeta.ui, path))
          return this.effect.getParamValue(this.$effect, this.pathTable$[path]);
        return this.factory.getParamValue(this.dspVoices$[0], this.pathTable$[path]);
      }
      return this.factory.getParamValue(this.$dsp, this.pathTable$[path]);
    }
    setup() {
      if (this.numIn > 0) {
        this.$ins = this.$$audioHeapInputs;
        for (let i = 0; i < this.numIn; i++) {
          this.HEAP32[(this.$ins >> 2) + i] = this.$audioHeapInputs + this.bufferSize * this.sampleSize * i;
        }
        const dspInChans = this.HEAP32.subarray(this.$ins >> 2, this.$ins + this.numIn * this.ptrSize >> 2);
        for (let i = 0; i < this.numIn; i++) {
          this.dspInChannnels[i] = this.HEAPF32.subarray(dspInChans[i] >> 2, dspInChans[i] + this.bufferSize * this.sampleSize >> 2);
        }
      }
      if (this.numOut > 0) {
        this.$outs = this.$$audioHeapOutputs;
        if (this.voices)
          this.$mixing = this.$$audioHeapMixing;
        for (let i = 0; i < this.numOut; i++) {
          this.HEAP32[(this.$outs >> 2) + i] = this.$audioHeapOutputs + this.bufferSize * this.sampleSize * i;
          if (this.voices)
            this.HEAP32[(this.$mixing >> 2) + i] = this.$audioHeapMixing + this.bufferSize * this.sampleSize * i;
        }
        const dspOutChans = this.HEAP32.subarray(this.$outs >> 2, this.$outs + this.numOut * this.ptrSize >> 2);
        for (let i = 0; i < this.numOut; i++) {
          this.dspOutChannnels[i] = this.HEAPF32.subarray(dspOutChans[i] >> 2, dspOutChans[i] + this.bufferSize * this.sampleSize >> 2);
        }
      }
      this.parseUI(this.dspMeta.ui);
      if (this.effect)
        this.parseUI(this.effectMeta.ui);
      if (this.voices) {
        this.inputsItems.forEach((item) => {
          if (item.endsWith("/gate"))
            this.fGateLabel$.push(this.pathTable$[item]);
          else if (item.endsWith("/freq"))
            this.fFreqLabel$.push(this.pathTable$[item]);
          else if (item.endsWith("/key"))
            this.fKeyLabel$.push(this.pathTable$[item]);
          else if (item.endsWith("/gain"))
            this.fGainLabel$.push(this.pathTable$[item]);
          else if (item.endsWith("/vel") || item.endsWith("/velocity"))
            this.fVelLabel$.push(this.pathTable$[item]);
        });
        this.dspVoices$.forEach(($voice) => this.factory.init($voice, sampleRate));
        if (this.effect)
          this.effect.init(this.$effect, sampleRate);
      } else {
        this.factory.init(this.$dsp, sampleRate);
      }
    }
    getPlayingVoice(pitch) {
      if (!this.voices)
        return null;
      let voice = this.kNoVoice;
      let oldestDatePlaying = Number.MAX_VALUE;
      for (let i = 0; i < this.voices; i++) {
        if (this.dspVoicesState[i] === pitch) {
          if (this.dspVoicesDate[i] < oldestDatePlaying) {
            oldestDatePlaying = this.dspVoicesDate[i];
            voice = i;
          }
        }
      }
      return voice;
    }
    allocVoice(voice) {
      if (!this.voices)
        return null;
      this.factory.instanceClear(this.dspVoices$[voice]);
      this.dspVoicesDate[voice] = this.fDate++;
      this.dspVoicesState[voice] = this.kActiveVoice;
      return voice;
    }
    getFreeVoice() {
      if (!this.voices)
        return null;
      for (let i = 0; i < this.voices; i++) {
        if (this.dspVoicesState[i] === this.kFreeVoice)
          return this.allocVoice(i);
      }
      let voiceRelease = this.kNoVoice;
      let voicePlaying = this.kNoVoice;
      let oldestDateRelease = Number.MAX_VALUE;
      let oldestDatePlaying = Number.MAX_VALUE;
      for (let i = 0; i < this.voices; i++) {
        if (this.dspVoicesState[i] === this.kReleaseVoice) {
          if (this.dspVoicesDate[i] < oldestDateRelease) {
            oldestDateRelease = this.dspVoicesDate[i];
            voiceRelease = i;
          }
        } else if (this.dspVoicesDate[i] < oldestDatePlaying) {
          oldestDatePlaying = this.dspVoicesDate[i];
          voicePlaying = i;
        }
      }
      if (oldestDateRelease !== Number.MAX_VALUE) {
        return this.allocVoice(voiceRelease);
      }
      if (oldestDatePlaying !== Number.MAX_VALUE) {
        return this.allocVoice(voicePlaying);
      }
      return this.kNoVoice;
    }
    keyOn(channel, pitch, velocity) {
      if (!this.voices)
        return;
      const voice = this.getFreeVoice();
      this.fFreqLabel$.forEach(($) => this.factory.setParamValue(this.dspVoices$[voice], $, midiToFreq(pitch)));
      this.fKeyLabel$.forEach(($) => this.factory.setParamValue(this.dspVoices$[voice], $, pitch));
      this.fGateLabel$.forEach(($) => this.factory.setParamValue(this.dspVoices$[voice], $, 1));
      this.fGainLabel$.forEach(($) => this.factory.setParamValue(this.dspVoices$[voice], $, velocity / 127));
      this.fVelLabel$.forEach(($) => this.factory.setParamValue(this.dspVoices$[voice], $, velocity));
      this.dspVoicesState[voice] = pitch;
    }
    keyOff(channel, pitch, velocity) {
      if (!this.voices)
        return;
      const voice = this.getPlayingVoice(pitch);
      if (voice === this.kNoVoice)
        return;
      this.fGateLabel$.forEach(($) => this.factory.setParamValue(this.dspVoices$[voice], $, 0));
      this.dspVoicesState[voice] = this.kReleaseVoice;
    }
    allNotesOff() {
      if (!this.voices)
        return;
      for (let i = 0; i < this.voices; i++) {
        this.fGateLabel$.forEach(($gate) => this.factory.setParamValue(this.dspVoices$[i], $gate, 0));
        this.dspVoicesState[i] = this.kReleaseVoice;
      }
    }
    midiMessage(data) {
      const cmd = data[0] >> 4;
      const channel = data[0] & 15;
      const data1 = data[1];
      const data2 = data[2];
      if (channel === 9)
        return;
      if (cmd === 8 || cmd === 9 && data2 === 0)
        this.keyOff(channel, data1, data2);
      else if (cmd === 9)
        this.keyOn(channel, data1, data2);
      else if (cmd === 11)
        this.ctrlChange(channel, data1, data2);
      else if (cmd === 14)
        this.pitchWheel(channel, data2 * 128 + data1);
    }
    ctrlChange(channel, ctrl, value) {
      if (ctrl === 123 || ctrl === 120) {
        this.allNotesOff();
      }
      if (!this.fCtrlLabel[ctrl].length)
        return;
      this.fCtrlLabel[ctrl].forEach((ctrl2) => {
        const { path } = ctrl2;
        this.setParamValue(path, remap(value, 0, 127, ctrl2.min, ctrl2.max));
        if (this.outputHandler)
          this.outputHandler(path, this.getParamValue(path));
      });
    }
    pitchWheel(channel, wheel) {
      this.fPitchwheelLabel.forEach((pw) => {
        this.setParamValue(pw.path, remap(wheel, 0, 16383, pw.min, pw.max));
        if (this.outputHandler)
          this.outputHandler(pw.path, this.getParamValue(pw.path));
      });
    }
    process(inputs, outputs, parameters) {
      if (this.destroyed)
        return false;
      const input = inputs[0];
      const output = outputs[0];
      if (this.numIn > 0 && (!input || !input[0] || input[0].length === 0)) {
        return true;
      }
      if (this.numOut > 0 && (!output || !output[0] || output[0].length === 0)) {
        return true;
      }
      if (input !== void 0) {
        for (let chan = 0; chan < Math.min(this.numIn, input.length); ++chan) {
          const dspInput = this.dspInChannnels[chan];
          dspInput.set(input[chan]);
        }
      }
      for (const path in parameters) {
        const paramArray = parameters[path];
        this.setParamValue(path, paramArray[0]);
      }
      if (this.computeHandler)
        this.computeHandler(this.bufferSize);
      if (this.voices) {
        this.mixer.clearOutput(this.bufferSize, this.numOut, this.$outs);
        for (let i = 0; i < this.voices; i++) {
          this.factory.compute(this.dspVoices$[i], this.bufferSize, this.$ins, this.$mixing);
          this.mixer.mixVoice(this.bufferSize, this.numOut, this.$mixing, this.$outs);
        }
        if (this.effect)
          this.effect.compute(this.$effect, this.bufferSize, this.$outs, this.$outs);
      } else {
        this.factory.compute(this.$dsp, this.bufferSize, this.$ins, this.$outs);
      }
      this.updateOutputs();
      if (output !== void 0) {
        for (let i = 0; i < Math.min(this.numOut, output.length); i++) {
          const dspOutput = this.dspOutChannnels[i];
          output[i].set(dspOutput);
        }
        this.port.postMessage({ type: "plot", value: output, index: this.$buffer++, events: this.cachedEvents });
        this.cachedEvents = [];
      }
      return true;
    }
    printMemory() {
      console.log("============== Memory layout ==============");
      console.log("dspMeta.size: " + this.dspMeta.size);
      console.log("$audioHeap: " + this.$audioHeap);
      console.log("$$audioHeapInputs: " + this.$$audioHeapInputs);
      console.log("$$audioHeapOutputs: " + this.$$audioHeapOutputs);
      console.log("$$audioHeapMixing: " + this.$$audioHeapMixing);
      console.log("$audioHeapInputs: " + this.$audioHeapInputs);
      console.log("$audioHeapOutputs: " + this.$audioHeapOutputs);
      console.log("$audioHeapMixing: " + this.$audioHeapMixing);
      console.log("$dsp: " + this.$dsp);
      if (this.dspVoices$)
        this.dspVoices$.forEach(($voice, i) => console.log("dspVoices$[" + i + "]: " + $voice));
      console.log("$effect: " + this.$effect);
      console.log("$mixing: " + this.$mixing);
    }
  };
  let FaustAudioWorkletProcessor = _FaustAudioWorkletProcessor;
  FaustAudioWorkletProcessor.bufferSize = 128;
  registerProcessor(FaustConst.id || "mydsp", FaustAudioWorkletProcessor);
};


/***/ }),

/***/ "./src/FaustOfflineProcessor.ts":
/*!**************************************!*\
  !*** ./src/FaustOfflineProcessor.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FaustOfflineProcessor": () => (/* binding */ FaustOfflineProcessor)
/* harmony export */ });
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
class FaustOfflineProcessor {
  constructor() {
    this.bufferSize = 1024;
  }
  static get importObject() {
    return {
      env: {
        memory: void 0,
        memoryBase: 0,
        tableBase: 0,
        _abs: Math.abs,
        _acosf: Math.acos,
        _asinf: Math.asin,
        _atanf: Math.atan,
        _atan2f: Math.atan2,
        _ceilf: Math.ceil,
        _cosf: Math.cos,
        _expf: Math.exp,
        _floorf: Math.floor,
        _fmodf: (x, y) => x % y,
        _logf: Math.log,
        _log10f: Math.log10,
        _max_f: Math.max,
        _min_f: Math.min,
        _remainderf: (x, y) => x - Math.round(x / y) * y,
        _powf: Math.pow,
        _roundf: Math.fround,
        _sinf: Math.sin,
        _sqrtf: Math.sqrt,
        _tanf: Math.tan,
        _acoshf: Math.acosh,
        _asinhf: Math.asinh,
        _atanhf: Math.atanh,
        _coshf: Math.cosh,
        _sinhf: Math.sinh,
        _tanhf: Math.tanh,
        _isnanf: Number.isNaN,
        _isinff: (x) => !isFinite(x),
        _copysignf: (x, y) => Math.sign(x) === Math.sign(y) ? x : -x,
        _acos: Math.acos,
        _asin: Math.asin,
        _atan: Math.atan,
        _atan2: Math.atan2,
        _ceil: Math.ceil,
        _cos: Math.cos,
        _exp: Math.exp,
        _floor: Math.floor,
        _fmod: (x, y) => x % y,
        _log: Math.log,
        _log10: Math.log10,
        _max_: Math.max,
        _min_: Math.min,
        _remainder: (x, y) => x - Math.round(x / y) * y,
        _pow: Math.pow,
        _round: Math.fround,
        _sin: Math.sin,
        _sqrt: Math.sqrt,
        _tan: Math.tan,
        _acosh: Math.acosh,
        _asinh: Math.asinh,
        _atanh: Math.atanh,
        _cosh: Math.cosh,
        _sinh: Math.sinh,
        _tanh: Math.tanh,
        _isnan: Number.isNaN,
        _isinf: (x) => !isFinite(x),
        _copysign: (x, y) => Math.sign(x) === Math.sign(y) ? x : -x,
        table: new WebAssembly.Table({ initial: 0, element: "anyfunc" })
      }
    };
  }
  init(options) {
    return __async(this, null, function* () {
      const { compiledDsp } = options;
      if (!compiledDsp)
        throw new Error("No Dsp input");
      this.dspMeta = compiledDsp.dspMeta;
      this.$ins = null;
      this.$outs = null;
      this.dspInChannnels = [];
      this.dspOutChannnels = [];
      this.numIn = this.dspMeta.inputs;
      this.numOut = this.dspMeta.outputs;
      this.ptrSize = 4;
      this.sampleSize = 4;
      const dspInstance = yield WebAssembly.instantiate(compiledDsp.dspModule, FaustOfflineProcessor.importObject);
      this.factory = dspInstance.exports;
      this.HEAP = this.factory.memory.buffer;
      this.HEAP32 = new Int32Array(this.HEAP);
      this.HEAPF32 = new Float32Array(this.HEAP);
      this.output = new Array(this.numOut).fill(null).map(() => new Float32Array(this.bufferSize));
    });
  }
  setup(options) {
    if (!this.dspMeta)
      throw new Error("No Dsp");
    this.sampleRate = options && options.sampleRate || 48e3;
    this.$audioHeap = this.dspMeta.size;
    this.$$audioHeapInputs = this.$audioHeap;
    this.$$audioHeapOutputs = this.$$audioHeapInputs + this.numIn * this.ptrSize;
    this.$audioHeapInputs = this.$$audioHeapOutputs + this.numOut * this.ptrSize;
    this.$audioHeapOutputs = this.$audioHeapInputs + this.numIn * this.bufferSize * this.sampleSize;
    this.$dsp = 0;
    if (this.numIn > 0) {
      this.$ins = this.$$audioHeapInputs;
      for (let i = 0; i < this.numIn; i++) {
        this.HEAP32[(this.$ins >> 2) + i] = this.$audioHeapInputs + this.bufferSize * this.sampleSize * i;
      }
      const dspInChans = this.HEAP32.subarray(this.$ins >> 2, this.$ins + this.numIn * this.ptrSize >> 2);
      for (let i = 0; i < this.numIn; i++) {
        this.dspInChannnels[i] = this.HEAPF32.subarray(dspInChans[i] >> 2, dspInChans[i] + this.bufferSize * this.sampleSize >> 2);
      }
    }
    if (this.numOut > 0) {
      this.$outs = this.$$audioHeapOutputs;
      for (let i = 0; i < this.numOut; i++) {
        this.HEAP32[(this.$outs >> 2) + i] = this.$audioHeapOutputs + this.bufferSize * this.sampleSize * i;
      }
      const dspOutChans = this.HEAP32.subarray(this.$outs >> 2, this.$outs + this.numOut * this.ptrSize >> 2);
      for (let i = 0; i < this.numOut; i++) {
        this.dspOutChannnels[i] = this.HEAPF32.subarray(dspOutChans[i] >> 2, dspOutChans[i] + this.bufferSize * this.sampleSize >> 2);
      }
    }
    this.factory.init(this.$dsp, this.sampleRate);
  }
  compute() {
    if (!this.factory)
      return this.output;
    for (let i = 0; i < this.numIn; i++) {
      this.dspInChannnels[i].fill(0);
    }
    this.factory.compute(this.$dsp, this.bufferSize, this.$ins, this.$outs);
    if (this.output !== void 0) {
      for (let i = 0; i < this.numOut; i++) {
        this.output[i].set(this.dspOutChannnels[i]);
      }
    }
    return this.output;
  }
  plot(options) {
    return __async(this, null, function* () {
      if (options && options.compiledDsp)
        yield this.init(options);
      this.setup(options);
      const size = options && options.size || 128;
      const plotted = new Array(this.numOut).fill(null).map(() => new Float32Array(size));
      for (let i = 0; i < size; i += this.bufferSize) {
        const computed = this.compute();
        for (let j = 0; j < plotted.length; j++) {
          plotted[j].set(size - i > this.bufferSize ? computed[j] : computed[j].subarray(0, size - i), i);
        }
      }
      return plotted;
    });
  }
}


/***/ }),

/***/ "./src/FaustWasmToScriptProcessor.ts":
/*!*******************************************!*\
  !*** ./src/FaustWasmToScriptProcessor.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FaustWasmToScriptProcessor": () => (/* binding */ FaustWasmToScriptProcessor)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/utils.ts");
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

class FaustWasmToScriptProcessor {
  constructor(faust) {
    this.faust = faust;
  }
  initNode(compiledDsp, dspInstance, effectInstance, mixerInstance, audioCtx, bufferSize, memory, voices, plotHandler) {
    let node;
    const dspMeta = compiledDsp.dspMeta;
    const inputs = dspMeta.inputs;
    const outputs = dspMeta.outputs;
    try {
      node = audioCtx.createScriptProcessor(bufferSize, inputs, outputs);
    } catch (e) {
      this.faust.error("Error in createScriptProcessor: " + e.message);
      throw e;
    }
    node.destroyed = false;
    node.voices = voices;
    node.dspMeta = dspMeta;
    node.outputHandler = null;
    node.computeHandler = null;
    node.$ins = null;
    node.$outs = null;
    node.dspInChannnels = [];
    node.dspOutChannnels = [];
    node.fPitchwheelLabel = [];
    node.fCtrlLabel = new Array(128).fill(null).map(() => []);
    node.numIn = inputs;
    node.numOut = outputs;
    this.faust.log(node.numIn);
    this.faust.log(node.numOut);
    node.ptrSize = 4;
    node.sampleSize = 4;
    node.factory = dspInstance.exports;
    node.HEAP = node.voices ? memory.buffer : node.factory.memory.buffer;
    node.HEAP32 = new Int32Array(node.HEAP);
    node.HEAPF32 = new Float32Array(node.HEAP);
    this.faust.log(node.HEAP);
    this.faust.log(node.HEAP32);
    this.faust.log(node.HEAPF32);
    node.outputsTimer = 5;
    node.outputsItems = [];
    node.inputsItems = [];
    node.$audioHeap = node.voices ? 0 : node.dspMeta.size;
    node.$$audioHeapInputs = node.$audioHeap;
    node.$$audioHeapOutputs = node.$$audioHeapInputs + node.numIn * node.ptrSize;
    if (node.voices) {
      node.$$audioHeapMixing = node.$$audioHeapOutputs + node.numOut * node.ptrSize;
      node.$audioHeapInputs = node.$$audioHeapMixing + node.numOut * node.ptrSize;
      node.$audioHeapOutputs = node.$audioHeapInputs + node.numIn * node.bufferSize * node.sampleSize;
      node.$audioHeapMixing = node.$audioHeapOutputs + node.numOut * node.bufferSize * node.sampleSize;
      node.$dsp = node.$audioHeapMixing + node.numOut * node.bufferSize * node.sampleSize;
    } else {
      node.$audioHeapInputs = node.$$audioHeapOutputs + node.numOut * node.ptrSize;
      node.$audioHeapOutputs = node.$audioHeapInputs + node.numIn * node.bufferSize * node.sampleSize;
      node.$dsp = 0;
    }
    if (node.voices) {
      node.effectMeta = compiledDsp.effectMeta;
      node.$mixing = null;
      node.fFreqLabel$ = [];
      node.fKeyLabel$ = [];
      node.fGateLabel$ = [];
      node.fGainLabel$ = [];
      node.fVelLabel$ = [];
      node.fDate = 0;
      node.mixer = mixerInstance.exports;
      node.effect = effectInstance ? effectInstance.exports : null;
      this.faust.log(node.mixer);
      this.faust.log(node.factory);
      this.faust.log(node.effect);
      node.dspVoices$ = [];
      node.dspVoicesState = [];
      node.dspVoicesLevel = [];
      node.dspVoicesDate = [];
      node.kActiveVoice = 0;
      node.kFreeVoice = -1;
      node.kReleaseVoice = -2;
      node.kNoVoice = -3;
      for (let i = 0; i < node.voices; i++) {
        node.dspVoices$[i] = node.$dsp + i * node.dspMeta.size;
        node.dspVoicesState[i] = node.kFreeVoice;
        node.dspVoicesLevel[i] = 0;
        node.dspVoicesDate[i] = 0;
      }
      node.$effect = node.dspVoices$[node.voices - 1] + node.dspMeta.size;
    }
    node.pathTable$ = {};
    node.$buffer = 0;
    node.cachedEvents = [];
    node.plotHandler = plotHandler;
    node.updateOutputs = () => {
      if (node.outputsItems.length > 0 && node.outputHandler && node.outputsTimer-- === 0) {
        node.outputsTimer = 5;
        node.outputsItems.forEach((item) => node.outputHandler(item, node.factory.getParamValue(node.$dsp, node.pathTable$[item])));
      }
    };
    node.parseUI = (ui) => ui.forEach((group) => node.parseGroup(group));
    node.parseGroup = (group) => group.items ? node.parseItems(group.items) : null;
    node.parseItems = (items) => items.forEach((item) => node.parseItem(item));
    node.parseItem = (item) => {
      if (item.type === "vgroup" || item.type === "hgroup" || item.type === "tgroup") {
        node.parseItems(item.items);
      } else if (item.type === "hbargraph" || item.type === "vbargraph") {
        node.outputsItems.push(item.address);
        node.pathTable$[item.address] = item.index;
      } else if (item.type === "vslider" || item.type === "hslider" || item.type === "button" || item.type === "checkbox" || item.type === "nentry") {
        node.inputsItems.push(item.address);
        node.pathTable$[item.address] = item.index;
        if (!item.meta)
          return;
        item.meta.forEach((meta) => {
          const { midi } = meta;
          if (!midi)
            return;
          const strMidi = midi.trim();
          if (strMidi === "pitchwheel") {
            node.fPitchwheelLabel.push({ path: item.address, min: item.min, max: item.max });
          } else {
            const matched = strMidi.match(/^ctrl\s(\d+)/);
            if (!matched)
              return;
            node.fCtrlLabel[parseInt(matched[1])].push({ path: item.address, min: item.min, max: item.max });
          }
        });
      }
    };
    if (node.voices) {
      node.getPlayingVoice = (pitch) => {
        let voice = node.kNoVoice;
        let oldestDatePlaying = Number.MAX_VALUE;
        for (let i = 0; i < node.voices; i++) {
          if (node.dspVoicesState[i] === pitch) {
            if (node.dspVoicesDate[i] < oldestDatePlaying) {
              oldestDatePlaying = node.dspVoicesDate[i];
              voice = i;
            }
          }
        }
        return voice;
      };
      node.allocVoice = (voice) => {
        node.factory.instanceClear(node.dspVoices$[voice]);
        node.dspVoicesDate[voice] = node.fDate++;
        node.dspVoicesState[voice] = node.kActiveVoice;
        return voice;
      };
      node.getFreeVoice = () => {
        for (let i = 0; i < node.voices; i++) {
          if (node.dspVoicesState[i] === node.kFreeVoice)
            return node.allocVoice(i);
        }
        let voiceRelease = node.kNoVoice;
        let voicePlaying = node.kNoVoice;
        let oldestDateRelease = Number.MAX_VALUE;
        let oldestDatePlaying = Number.MAX_VALUE;
        for (let i = 0; i < node.voices; i++) {
          if (node.dspVoicesState[i] === node.kReleaseVoice) {
            if (node.dspVoicesDate[i] < oldestDateRelease) {
              oldestDateRelease = node.dspVoicesDate[i];
              voiceRelease = i;
            }
          } else if (node.dspVoicesDate[i] < oldestDatePlaying) {
            oldestDatePlaying = node.dspVoicesDate[i];
            voicePlaying = i;
          }
        }
        if (oldestDateRelease !== Number.MAX_VALUE) {
          this.faust.log(`Steal release voice : voice_date = ${node.dspVoicesDate[voiceRelease]} cur_date = ${node.fDate} voice = ${voiceRelease}`);
          return node.allocVoice(voiceRelease);
        }
        if (oldestDatePlaying !== Number.MAX_VALUE) {
          this.faust.log(`Steal playing voice : voice_date = ${node.dspVoicesDate[voicePlaying]} cur_date = ${node.fDate} voice = ${voicePlaying}`);
          return node.allocVoice(voicePlaying);
        }
        return node.kNoVoice;
      };
      node.keyOn = (channel, pitch, velocity) => {
        node.cachedEvents.push({ type: "keyOn", data: [channel, pitch, velocity] });
        const voice = node.getFreeVoice();
        this.faust.log("keyOn voice " + voice);
        node.fFreqLabel$.forEach(($) => node.factory.setParamValue(node.dspVoices$[voice], $, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.midiToFreq)(pitch)));
        node.fKeyLabel$.forEach(($) => node.factory.setParamValue(node.dspVoices$[voice], $, pitch));
        node.fGateLabel$.forEach(($) => node.factory.setParamValue(node.dspVoices$[voice], $, 1));
        node.fGainLabel$.forEach(($) => node.factory.setParamValue(node.dspVoices$[voice], $, velocity / 127));
        node.fVelLabel$.forEach(($) => node.factory.setParamValue(node.dspVoices$[voice], $, velocity));
        node.dspVoicesState[voice] = pitch;
      };
      node.keyOff = (channel, pitch, velocity) => {
        node.cachedEvents.push({ type: "keyOff", data: [channel, pitch, velocity] });
        const voice = node.getPlayingVoice(pitch);
        if (voice === node.kNoVoice)
          return this.faust.log("Playing voice not found...");
        node.fGateLabel$.forEach(($) => node.factory.setParamValue(node.dspVoices$[voice], $, 0));
        node.dspVoicesState[voice] = node.kReleaseVoice;
        return this.faust.log("keyOff voice " + voice);
      };
      node.allNotesOff = () => {
        node.cachedEvents.push({ type: "ctrlChange", data: [0, 123, 0] });
        for (let i = 0; i < node.voices; i++) {
          node.fGateLabel$.forEach(($gate) => node.factory.setParamValue(node.dspVoices$[i], $gate, 0));
          node.dspVoicesState[i] = node.kReleaseVoice;
        }
      };
    }
    node.midiMessage = (data) => {
      node.cachedEvents.push({ data, type: "midi" });
      const cmd = data[0] >> 4;
      const channel = data[0] & 15;
      const data1 = data[1];
      const data2 = data[2];
      if (channel === 9)
        return void 0;
      if (node.voices) {
        if (cmd === 8 || cmd === 9 && data2 === 0)
          return node.keyOff(channel, data1, data2);
        if (cmd === 9)
          return node.keyOn(channel, data1, data2);
      }
      if (cmd === 11)
        return node.ctrlChange(channel, data1, data2);
      if (cmd === 14)
        return node.pitchWheel(channel, data2 * 128 + data1);
      return void 0;
    };
    node.ctrlChange = (channel, ctrl, value) => {
      node.cachedEvents.push({ type: "ctrlChange", data: [channel, ctrl, value] });
      if (ctrl === 123 || ctrl === 120) {
        node.allNotesOff();
      }
      if (!node.fCtrlLabel[ctrl].length)
        return;
      node.fCtrlLabel[ctrl].forEach((ctrl2) => {
        const { path } = ctrl2;
        node.setParamValue(path, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.remap)(value, 0, 127, ctrl2.min, ctrl2.max));
        if (node.outputHandler)
          node.outputHandler(path, node.getParamValue(path));
      });
    };
    node.pitchWheel = (channel, wheel) => {
      node.cachedEvents.push({ type: "pitchWheel", data: [channel, wheel] });
      node.fPitchwheelLabel.forEach((pw) => {
        node.setParamValue(pw.path, (0,_utils__WEBPACK_IMPORTED_MODULE_0__.remap)(wheel, 0, 16383, pw.min, pw.max));
        if (node.outputHandler)
          node.outputHandler(pw.path, node.getParamValue(pw.path));
      });
    };
    node.compute = (e) => {
      if (node.destroyed)
        return false;
      for (let i = 0; i < node.numIn; i++) {
        const input = e.inputBuffer.getChannelData(i);
        const dspInput = node.dspInChannnels[i];
        dspInput.set(input);
      }
      if (node.computeHandler)
        node.computeHandler(node.bufferSize);
      if (node.voices) {
        node.mixer.clearOutput(node.bufferSize, node.numOut, node.$outs);
        for (let i = 0; i < node.voices; i++) {
          node.factory.compute(node.dspVoices$[i], node.bufferSize, node.$ins, node.$mixing);
          node.mixer.mixVoice(node.bufferSize, node.numOut, node.$mixing, node.$outs);
        }
        if (node.effect)
          node.effect.compute(node.$effect, node.bufferSize, node.$outs, node.$outs);
      } else {
        node.factory.compute(node.$dsp, node.bufferSize, node.$ins, node.$outs);
      }
      node.updateOutputs();
      const outputs2 = new Array(node.numOut).fill(null).map(() => new Float32Array(node.bufferSize));
      for (let i = 0; i < node.numOut; i++) {
        const output = e.outputBuffer.getChannelData(i);
        const dspOutput = node.dspOutChannnels[i];
        output.set(dspOutput);
        outputs2[i].set(dspOutput);
      }
      if (node.plotHandler)
        node.plotHandler(outputs2, node.$buffer++, node.cachedEvents.length ? node.cachedEvents : void 0);
      node.cachedEvents = [];
      return true;
    };
    node.setup = () => {
      this.faust.log("buffer_size " + node.bufferSize);
      node.onaudioprocess = node.compute;
      if (node.numIn > 0) {
        node.$ins = node.$$audioHeapInputs;
        for (let i = 0; i < node.numIn; i++) {
          node.HEAP32[(node.$ins >> 2) + i] = node.$audioHeapInputs + node.bufferSize * node.sampleSize * i;
        }
        const dspInChans = node.HEAP32.subarray(node.$ins >> 2, node.$ins + node.numIn * node.ptrSize >> 2);
        for (let i = 0; i < node.numIn; i++) {
          node.dspInChannnels[i] = node.HEAPF32.subarray(dspInChans[i] >> 2, dspInChans[i] + node.bufferSize * node.sampleSize >> 2);
        }
      }
      if (node.numOut > 0) {
        node.$outs = node.$$audioHeapOutputs;
        if (node.voices)
          node.$mixing = node.$$audioHeapMixing;
        for (let i = 0; i < node.numOut; i++) {
          node.HEAP32[(node.$outs >> 2) + i] = node.$audioHeapOutputs + node.bufferSize * node.sampleSize * i;
          if (node.voices)
            node.HEAP32[(node.$mixing >> 2) + i] = node.$audioHeapMixing + node.bufferSize * node.sampleSize * i;
        }
        const dspOutChans = node.HEAP32.subarray(node.$outs >> 2, node.$outs + node.numOut * node.ptrSize >> 2);
        for (let i = 0; i < node.numOut; i++) {
          node.dspOutChannnels[i] = node.HEAPF32.subarray(dspOutChans[i] >> 2, dspOutChans[i] + node.bufferSize * node.sampleSize >> 2);
        }
      }
      node.parseUI(node.dspMeta.ui);
      if (node.effect)
        node.parseUI(node.effectMeta.ui);
      if (node.voices) {
        node.inputsItems.forEach((item) => {
          if (item.endsWith("/gate"))
            node.fGateLabel$.push(node.pathTable$[item]);
          else if (item.endsWith("/freq"))
            node.fFreqLabel$.push(node.pathTable$[item]);
          else if (item.endsWith("/key"))
            node.fKeyLabel$.push(node.pathTable$[item]);
          else if (item.endsWith("/gain"))
            node.fGainLabel$.push(node.pathTable$[item]);
          else if (item.endsWith("/vel") || item.endsWith("/velocity"))
            node.fVelLabel$.push(node.pathTable$[item]);
        });
        node.dspVoices$.forEach(($voice) => node.factory.init($voice, audioCtx.sampleRate));
        if (node.effect)
          node.effect.init(node.$effect, audioCtx.sampleRate);
      } else {
        node.factory.init(node.$dsp, audioCtx.sampleRate);
      }
    };
    node.getSampleRate = () => audioCtx.sampleRate;
    node.getNumInputs = () => node.numIn;
    node.getNumOutputs = () => node.numOut;
    node.init = (sampleRate) => {
      if (node.voices)
        node.dspVoices$.forEach(($voice) => node.factory.init($voice, sampleRate));
      else
        node.factory.init(node.$dsp, sampleRate);
    };
    node.instanceInit = (sampleRate) => {
      if (node.voices)
        node.dspVoices$.forEach(($voice) => node.factory.instanceInit($voice, sampleRate));
      else
        node.factory.instanceInit(node.$dsp, sampleRate);
    };
    node.instanceConstants = (sampleRate) => {
      if (node.voices)
        node.dspVoices$.forEach(($voice) => node.factory.instanceConstants($voice, sampleRate));
      else
        node.factory.instanceConstants(node.$dsp, sampleRate);
    };
    node.instanceResetUserInterface = () => {
      if (node.voices)
        node.dspVoices$.forEach(($voice) => node.factory.instanceResetUserInterface($voice));
      else
        node.factory.instanceResetUserInterface(node.$dsp);
    };
    node.instanceClear = () => {
      if (node.voices)
        node.dspVoices$.forEach(($voice) => node.factory.instanceClear($voice));
      else
        node.factory.instanceClear(node.$dsp);
    };
    node.metadata = (handler) => node.dspMeta.meta ? node.dspMeta.meta.forEach((meta) => handler.declare(Object.keys(meta)[0], meta[Object.keys(meta)[0]])) : void 0;
    node.setOutputParamHandler = (handler) => node.outputHandler = handler;
    node.getOutputParamHandler = () => node.outputHandler;
    node.setComputeHandler = (handler) => node.computeHandler = handler;
    node.getComputeHandler = () => node.computeHandler;
    const findPath = (o, p) => {
      if (typeof o !== "object")
        return false;
      if (o.address) {
        if (o.address === p)
          return true;
        return false;
      }
      for (const k in o) {
        if (findPath(o[k], p))
          return true;
      }
      return false;
    };
    node.setParamValue = (path, value) => {
      node.cachedEvents.push({ type: "param", data: { path, value } });
      if (node.voices) {
        if (node.effect && findPath(node.effectMeta.ui, path))
          node.effect.setParamValue(node.$effect, node.pathTable$[path], value);
        else
          node.dspVoices$.forEach(($voice) => node.factory.setParamValue($voice, node.pathTable$[path], value));
      } else {
        node.factory.setParamValue(node.$dsp, node.pathTable$[path], value);
      }
    };
    node.getParamValue = (path) => {
      if (node.voices) {
        if (node.effect && findPath(node.effectMeta.ui, path))
          return node.effect.getParamValue(node.$effect, node.pathTable$[path]);
        return node.factory.getParamValue(node.dspVoices$[0], node.pathTable$[path]);
      }
      return node.factory.getParamValue(node.$dsp, node.pathTable$[path]);
    };
    node.getParams = () => node.inputsItems;
    node.getJSON = () => {
      if (node.voices) {
        const o = node.dspMeta;
        const e = node.effectMeta;
        const r = __spreadValues({}, o);
        if (e) {
          r.ui = [{ type: "tgroup", label: "Sequencer", items: [
            { type: "vgroup", label: "Instrument", items: o.ui },
            { type: "vgroup", label: "Effect", items: e.ui }
          ] }];
        } else {
          r.ui = [{ type: "tgroup", label: "Polyphonic", items: [
            { type: "vgroup", label: "Voices", items: o.ui }
          ] }];
        }
        return JSON.stringify(r);
      }
      return JSON.stringify(node.dspMeta);
    };
    node.getUI = () => {
      if (node.voices) {
        const o = node.dspMeta;
        const e = node.effectMeta;
        if (e) {
          return [{ type: "tgroup", label: "Sequencer", items: [
            { type: "vgroup", label: "Instrument", items: o.ui },
            { type: "vgroup", label: "Effect", items: e.ui }
          ] }];
        }
        return [{ type: "tgroup", label: "Polyphonic", items: [
          { type: "vgroup", label: "Voices", items: o.ui }
        ] }];
      }
      return node.dspMeta.ui;
    };
    node.destroy = () => {
      node.destroyed = true;
      delete node.outputHandler;
      delete node.computeHandler;
      delete node.plotHandler;
    };
    node.setup();
    return node;
  }
  getNode(optionsIn) {
    return __async(this, null, function* () {
      const { compiledDsp, audioCtx, bufferSize: bufferSizeIn, voices, plotHandler } = optionsIn;
      const bufferSize = bufferSizeIn || 512;
      let node;
      try {
        let effectInstance;
        let mixerInstance;
        const memory = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.createWasmMemory)(voices, compiledDsp.dspMeta, compiledDsp.effectMeta, bufferSize);
        const importObject = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.createWasmImport)(voices, memory);
        if (voices) {
          const mixerObject = { imports: { print: console.log }, memory: { memory } };
          mixerInstance = new WebAssembly.Instance(_utils__WEBPACK_IMPORTED_MODULE_0__.mixer32Module, mixerObject);
          try {
            effectInstance = yield WebAssembly.instantiate(compiledDsp.effectModule, importObject);
          } catch (e) {
          }
        }
        const dspInstance = yield WebAssembly.instantiate(compiledDsp.dspModule, importObject);
        node = this.initNode(compiledDsp, dspInstance, effectInstance, mixerInstance, audioCtx, bufferSize, memory, voices, plotHandler);
      } catch (e) {
        this.faust.error("Faust " + compiledDsp.shaKey + " cannot be loaded or compiled");
        throw e;
      }
      return node;
    });
  }
}


/***/ }),

/***/ "./src/LibFaustLoader.js":
/*!*******************************!*\
  !*** ./src/LibFaustLoader.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LibFaust": () => (/* reexport module object */ _libfaust_wasm__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "LibFaustLoader": () => (/* binding */ LibFaustLoader)
/* harmony export */ });
/* harmony import */ var _libfaust_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./libfaust-wasm */ "./src/libfaust-wasm.js");
/* harmony import */ var _libfaust_wasm__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_libfaust_wasm__WEBPACK_IMPORTED_MODULE_0__);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

class LibFaustLoader {
  static load(wasmLocation, dataLocation) {
    return __async(this, null, function* () {
      const locateFile = (path, dir) => ({
        "libfaust-wasm.wasm": wasmLocation,
        "libfaust-wasm.data": dataLocation
      })[path] || dir + path;
      const libFaust = yield _libfaust_wasm__WEBPACK_IMPORTED_MODULE_0__({ locateFile });
      return libFaust;
    });
  }
}



/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ab2str": () => (/* binding */ ab2str),
/* harmony export */   "atoUint6": () => (/* binding */ atoUint6),
/* harmony export */   "atoab": () => (/* binding */ atoab),
/* harmony export */   "createWasmImport": () => (/* binding */ createWasmImport),
/* harmony export */   "createWasmMemory": () => (/* binding */ createWasmMemory),
/* harmony export */   "findPath": () => (/* binding */ findPath),
/* harmony export */   "findPathClosure": () => (/* binding */ findPathClosure),
/* harmony export */   "heap2Str": () => (/* binding */ heap2Str),
/* harmony export */   "midiToFreq": () => (/* binding */ midiToFreq),
/* harmony export */   "mixer32Module": () => (/* binding */ mixer32Module),
/* harmony export */   "remap": () => (/* binding */ remap),
/* harmony export */   "str2ab": () => (/* binding */ str2ab),
/* harmony export */   "toArgv": () => (/* binding */ toArgv)
/* harmony export */ });
/* harmony import */ var _wasm_mixer32_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wasm/mixer32.wasm */ "./src/wasm/mixer32.wasm");

const ab2str = (buf) => buf ? String.fromCharCode.apply(null, new Uint8Array(buf)) : null;
const str2ab = (str) => {
  if (!str)
    return null;
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
const atoUint6 = (nChr) => {
  return nChr > 64 && nChr < 91 ? nChr - 65 : nChr > 96 && nChr < 123 ? nChr - 71 : nChr > 47 && nChr < 58 ? nChr + 4 : nChr === 43 ? 62 : nChr === 47 ? 63 : 0;
};
const atoab = (sBase64, nBlocksSize) => {
  if (typeof window.atob === "function")
    return str2ab(atob(sBase64));
  const sB64Enc = sBase64.replace(/[^A-Za-z0-9+/]/g, "");
  const nInLen = sB64Enc.length;
  const nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2;
  const taBytes = new Uint8Array(nOutLen);
  for (let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
    nMod4 = nInIdx & 3;
    nUint24 |= atoUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
    if (nMod4 === 3 || nInLen - nInIdx === 1) {
      for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
      }
      nUint24 = 0;
    }
  }
  return taBytes.buffer;
};
const heap2Str = (buf) => {
  let str = "";
  let i = 0;
  while (buf[i] !== 0) {
    str += String.fromCharCode(buf[i++]);
  }
  return str;
};
const mixer32Module = new WebAssembly.Module(atoab(_wasm_mixer32_wasm__WEBPACK_IMPORTED_MODULE_0__["default"].split(",")[1]));
const midiToFreq = (note) => 440 * 2 ** ((note - 69) / 12);
const remap = (v, mn0, mx0, mn1, mx1) => (v - mn0) / (mx0 - mn0) * (mx1 - mn1) + mn1;
const findPath = (o, p) => {
  if (typeof o !== "object")
    return false;
  if (o.address) {
    return o.address === p;
  }
  for (const k in o) {
    if (findPath(o[k], p))
      return true;
  }
  return false;
};
const findPathClosure = () => {
  const findPath2 = (o, p) => {
    if (typeof o !== "object")
      return false;
    if (o.address) {
      return o.address === p;
    }
    for (const k in o) {
      if (findPath2(o[k], p))
        return true;
    }
    return false;
  };
  return findPath2;
};
const createWasmImport = (voices, memory) => ({
  env: {
    memory: voices ? memory : void 0,
    memoryBase: 0,
    tableBase: 0,
    _abs: Math.abs,
    _acosf: Math.acos,
    _asinf: Math.asin,
    _atanf: Math.atan,
    _atan2f: Math.atan2,
    _ceilf: Math.ceil,
    _cosf: Math.cos,
    _expf: Math.exp,
    _floorf: Math.floor,
    _fmodf: (x, y) => x % y,
    _logf: Math.log,
    _log10f: Math.log10,
    _max_f: Math.max,
    _min_f: Math.min,
    _remainderf: (x, y) => x - Math.round(x / y) * y,
    _powf: Math.pow,
    _roundf: Math.fround,
    _sinf: Math.sin,
    _sqrtf: Math.sqrt,
    _tanf: Math.tan,
    _acoshf: Math.acosh,
    _asinhf: Math.asinh,
    _atanhf: Math.atanh,
    _coshf: Math.cosh,
    _sinhf: Math.sinh,
    _tanhf: Math.tanh,
    _isnanf: Number.isNaN,
    _isinff: (x) => !isFinite(x),
    _copysignf: (x, y) => Math.sign(x) === Math.sign(y) ? x : -x,
    _acos: Math.acos,
    _asin: Math.asin,
    _atan: Math.atan,
    _atan2: Math.atan2,
    _ceil: Math.ceil,
    _cos: Math.cos,
    _exp: Math.exp,
    _floor: Math.floor,
    _fmod: (x, y) => x % y,
    _log: Math.log,
    _log10: Math.log10,
    _max_: Math.max,
    _min_: Math.min,
    _remainder: (x, y) => x - Math.round(x / y) * y,
    _pow: Math.pow,
    _round: Math.fround,
    _sin: Math.sin,
    _sqrt: Math.sqrt,
    _tan: Math.tan,
    _acosh: Math.acosh,
    _asinh: Math.asinh,
    _atanh: Math.atanh,
    _cosh: Math.cosh,
    _sinh: Math.sinh,
    _tanh: Math.tanh,
    _isnan: Number.isNaN,
    _isinf: (x) => !isFinite(x),
    _copysign: (x, y) => Math.sign(x) === Math.sign(y) ? x : -x,
    table: new WebAssembly.Table({ initial: 0, element: "anyfunc" })
  }
});
const createWasmMemory = (voicesIn, dspMeta, effectMeta, bufferSize) => {
  const voices = Math.max(4, voicesIn);
  const ptrSize = 4;
  const sampleSize = 4;
  const pow2limit = (x) => {
    let n = 65536;
    while (n < x) {
      n *= 2;
    }
    return n;
  };
  const effectSize = effectMeta ? effectMeta.size : 0;
  let memorySize = pow2limit(
    effectSize + dspMeta.size * voices + (dspMeta.inputs + dspMeta.outputs * 2) * (ptrSize + bufferSize * sampleSize)
  ) / 65536;
  memorySize = Math.max(2, memorySize);
  return new WebAssembly.Memory({ initial: memorySize, maximum: memorySize });
};
const toArgv = (args) => {
  const argv = [];
  for (const key in args) {
    const arg = args[key];
    if (Array.isArray(arg))
      arg.forEach((s) => argv.push(key, s));
    else if (typeof arg === "number")
      argv.push(key, arg.toString());
    else
      argv.push(key, arg);
  }
  return argv;
};


/***/ }),

/***/ "./node_modules/js-sha256/src/sha256.js":
/*!**********************************************!*\
  !*** ./node_modules/js-sha256/src/sha256.js ***!
  \**********************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_RESULT__;/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.9.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var WINDOW = typeof window === 'object';
  var root = WINDOW ? window : {};
  if (root.JS_SHA256_NO_WINDOW) {
    WINDOW = false;
  }
  var WEB_WORKER = !WINDOW && typeof self === 'object';
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = __webpack_require__.g;
  } else if (WEB_WORKER) {
    root = self;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && "object" === 'object' && module.exports;
  var AMD =  true && __webpack_require__.amdO;
  var ARRAY_BUFFER = !root.JS_SHA256_NO_ARRAY_BUFFER && typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  if (ARRAY_BUFFER && (root.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW || !ArrayBuffer.isView)) {
    ArrayBuffer.isView = function (obj) {
      return typeof obj === 'object' && obj.buffer && obj.buffer.constructor === ArrayBuffer;
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = eval("require('crypto')");
    var Buffer = eval("require('buffer').Buffer");
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw new Error(ERROR);
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = this.hBytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString, type = typeof message;
    if (type !== 'string') {
      if (type === 'object') {
        if (message === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        } else if (!Array.isArray(message)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(message)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
      notString = true;
    }
    var code, index = 0, i, length = message.length, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
          blocks[4] = blocks[5] = blocks[6] = blocks[7] =
          blocks[8] = blocks[9] = blocks[10] = blocks[11] =
          blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    if (this.bytes > 4294967295) {
      this.hBytes += this.bytes / 4294967296 << 0;
      this.bytes = this.bytes % 4294967296;
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[14] = this.hBytes << 3 | this.bytes >>> 29;
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var i, type = typeof key;
    if (type === 'string') {
      var bytes = [], length = key.length, index = 0, code;
      for (i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    } else {
      if (type === 'object') {
        if (key === null) {
          throw new Error(ERROR);
        } else if (ARRAY_BUFFER && key.constructor === ArrayBuffer) {
          key = new Uint8Array(key);
        } else if (!Array.isArray(key)) {
          if (!ARRAY_BUFFER || !ArrayBuffer.isView(key)) {
            throw new Error(ERROR);
          }
        }
      } else {
        throw new Error(ERROR);
      }
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
        return exports;
      }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
  }
})();


/***/ }),

/***/ "./src/wasm/mixer32.wasm":
/*!*******************************!*\
  !*** ./src/wasm/mixer32.wasm ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("data:application/wasm;base64,AGFzbQEAAAABj4CAgAACYAN/f38AYAR/f39/AX0CkoCAgAABBm1lbW9yeQZtZW1vcnkCAAIDg4CAgAACAAEHmoCAgAACC2NsZWFyT3V0cHV0AAAIbWl4Vm9pY2UAAQqKgoCAAALigICAAAEDfwJAQQAhBQNAAkAgAiAFQQJ0aigCACEDQQAhBANAAkAgAyAEQQJ0akMAAAAAOAIAIARBAWohBCAEIABIBEAMAgUMAQsACwsgBUEBaiEFIAUgAUgEQAwCBQwBCwALCwsLnYGAgAACBH8DfQJ9QQAhB0MAAAAAIQgDQAJAQQAhBiACIAdBAnRqKAIAIQQgAyAHQQJ0aigCACEFA0ACQCAEIAZBAnRqKgIAIQkgCCAJi5chCCAFIAZBAnRqKgIAIQogBSAGQQJ0aiAKIAmSOAIAIAZBAWohBiAGIABIBEAMAgUMAQsACwsgB0EBaiEHIAcgAUgEQAwCBQwBCwALCyAIDwsL");

/***/ }),

/***/ "./src/libfaust-wasm.js":
/*!******************************!*\
  !*** ./src/libfaust-wasm.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __filename = "/index.js";
var __dirname = "/";

var FaustModule = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  if (true) _scriptDir = _scriptDir || __filename;
  return (
function(FaustModule) {
  FaustModule = FaustModule || {};

var Module=typeof FaustModule!=="undefined"?FaustModule:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});if(!Object.getOwnPropertyDescriptor(Module["ready"],"_createWasmCDSPFactoryFromString")){Object.defineProperty(Module["ready"],"_createWasmCDSPFactoryFromString",{configurable:true,get:function(){abort("You are getting _createWasmCDSPFactoryFromString on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_createWasmCDSPFactoryFromString",{configurable:true,set:function(){abort("You are setting _createWasmCDSPFactoryFromString on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_expandCDSPFromString")){Object.defineProperty(Module["ready"],"_expandCDSPFromString",{configurable:true,get:function(){abort("You are getting _expandCDSPFromString on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_expandCDSPFromString",{configurable:true,set:function(){abort("You are setting _expandCDSPFromString on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_deleteAllWasmCDSPFactories")){Object.defineProperty(Module["ready"],"_deleteAllWasmCDSPFactories",{configurable:true,get:function(){abort("You are getting _deleteAllWasmCDSPFactories on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_deleteAllWasmCDSPFactories",{configurable:true,set:function(){abort("You are setting _deleteAllWasmCDSPFactories on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_getCLibFaustVersion")){Object.defineProperty(Module["ready"],"_getCLibFaustVersion",{configurable:true,get:function(){abort("You are getting _getCLibFaustVersion on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_getCLibFaustVersion",{configurable:true,set:function(){abort("You are setting _getCLibFaustVersion on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_getWasmCModule")){Object.defineProperty(Module["ready"],"_getWasmCModule",{configurable:true,get:function(){abort("You are getting _getWasmCModule on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_getWasmCModule",{configurable:true,set:function(){abort("You are setting _getWasmCModule on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_getWasmCModuleSize")){Object.defineProperty(Module["ready"],"_getWasmCModuleSize",{configurable:true,get:function(){abort("You are getting _getWasmCModuleSize on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_getWasmCModuleSize",{configurable:true,set:function(){abort("You are setting _getWasmCModuleSize on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_getWasmCHelpers")){Object.defineProperty(Module["ready"],"_getWasmCHelpers",{configurable:true,get:function(){abort("You are getting _getWasmCHelpers on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_getWasmCHelpers",{configurable:true,set:function(){abort("You are setting _getWasmCHelpers on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_freeWasmCModule")){Object.defineProperty(Module["ready"],"_freeWasmCModule",{configurable:true,get:function(){abort("You are getting _freeWasmCModule on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_freeWasmCModule",{configurable:true,set:function(){abort("You are setting _freeWasmCModule on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_freeCMemory")){Object.defineProperty(Module["ready"],"_freeCMemory",{configurable:true,get:function(){abort("You are getting _freeCMemory on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_freeCMemory",{configurable:true,set:function(){abort("You are setting _freeCMemory on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_cleanupAfterException")){Object.defineProperty(Module["ready"],"_cleanupAfterException",{configurable:true,get:function(){abort("You are getting _cleanupAfterException on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_cleanupAfterException",{configurable:true,set:function(){abort("You are setting _cleanupAfterException on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_getErrorAfterException")){Object.defineProperty(Module["ready"],"_getErrorAfterException",{configurable:true,get:function(){abort("You are getting _getErrorAfterException on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_getErrorAfterException",{configurable:true,set:function(){abort("You are setting _getErrorAfterException on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_generateCAuxFilesFromString")){Object.defineProperty(Module["ready"],"_generateCAuxFilesFromString",{configurable:true,get:function(){abort("You are getting _generateCAuxFilesFromString on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_generateCAuxFilesFromString",{configurable:true,set:function(){abort("You are setting _generateCAuxFilesFromString on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_emscripten_stack_get_end")){Object.defineProperty(Module["ready"],"_emscripten_stack_get_end",{configurable:true,get:function(){abort("You are getting _emscripten_stack_get_end on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_emscripten_stack_get_end",{configurable:true,set:function(){abort("You are setting _emscripten_stack_get_end on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_emscripten_stack_get_free")){Object.defineProperty(Module["ready"],"_emscripten_stack_get_free",{configurable:true,get:function(){abort("You are getting _emscripten_stack_get_free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_emscripten_stack_get_free",{configurable:true,set:function(){abort("You are setting _emscripten_stack_get_free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_emscripten_stack_init")){Object.defineProperty(Module["ready"],"_emscripten_stack_init",{configurable:true,get:function(){abort("You are getting _emscripten_stack_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_emscripten_stack_init",{configurable:true,set:function(){abort("You are setting _emscripten_stack_init on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_stackSave")){Object.defineProperty(Module["ready"],"_stackSave",{configurable:true,get:function(){abort("You are getting _stackSave on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_stackSave",{configurable:true,set:function(){abort("You are setting _stackSave on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_stackRestore")){Object.defineProperty(Module["ready"],"_stackRestore",{configurable:true,get:function(){abort("You are getting _stackRestore on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_stackRestore",{configurable:true,set:function(){abort("You are setting _stackRestore on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_stackAlloc")){Object.defineProperty(Module["ready"],"_stackAlloc",{configurable:true,get:function(){abort("You are getting _stackAlloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_stackAlloc",{configurable:true,set:function(){abort("You are setting _stackAlloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"___wasm_call_ctors")){Object.defineProperty(Module["ready"],"___wasm_call_ctors",{configurable:true,get:function(){abort("You are getting ___wasm_call_ctors on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"___wasm_call_ctors",{configurable:true,set:function(){abort("You are setting ___wasm_call_ctors on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_fflush")){Object.defineProperty(Module["ready"],"_fflush",{configurable:true,get:function(){abort("You are getting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_fflush",{configurable:true,set:function(){abort("You are setting _fflush on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"___errno_location")){Object.defineProperty(Module["ready"],"___errno_location",{configurable:true,get:function(){abort("You are getting ___errno_location on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"___errno_location",{configurable:true,set:function(){abort("You are setting ___errno_location on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_malloc")){Object.defineProperty(Module["ready"],"_malloc",{configurable:true,get:function(){abort("You are getting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_malloc",{configurable:true,set:function(){abort("You are setting _malloc on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_free")){Object.defineProperty(Module["ready"],"_free",{configurable:true,get:function(){abort("You are getting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_free",{configurable:true,set:function(){abort("You are setting _free on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"__get_tzname")){Object.defineProperty(Module["ready"],"__get_tzname",{configurable:true,get:function(){abort("You are getting __get_tzname on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"__get_tzname",{configurable:true,set:function(){abort("You are setting __get_tzname on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"__get_daylight")){Object.defineProperty(Module["ready"],"__get_daylight",{configurable:true,get:function(){abort("You are getting __get_daylight on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"__get_daylight",{configurable:true,set:function(){abort("You are setting __get_daylight on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"__get_timezone")){Object.defineProperty(Module["ready"],"__get_timezone",{configurable:true,get:function(){abort("You are getting __get_timezone on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"__get_timezone",{configurable:true,set:function(){abort("You are setting __get_timezone on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_ntohs")){Object.defineProperty(Module["ready"],"_ntohs",{configurable:true,get:function(){abort("You are getting _ntohs on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_ntohs",{configurable:true,set:function(){abort("You are setting _ntohs on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"_htons")){Object.defineProperty(Module["ready"],"_htons",{configurable:true,get:function(){abort("You are getting _htons on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"_htons",{configurable:true,set:function(){abort("You are setting _htons on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"___getTypeName")){Object.defineProperty(Module["ready"],"___getTypeName",{configurable:true,get:function(){abort("You are getting ___getTypeName on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"___getTypeName",{configurable:true,set:function(){abort("You are setting ___getTypeName on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"___embind_register_native_and_builtin_types")){Object.defineProperty(Module["ready"],"___embind_register_native_and_builtin_types",{configurable:true,get:function(){abort("You are getting ___embind_register_native_and_builtin_types on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"___embind_register_native_and_builtin_types",{configurable:true,set:function(){abort("You are setting ___embind_register_native_and_builtin_types on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Object.getOwnPropertyDescriptor(Module["ready"],"onRuntimeInitialized")){Object.defineProperty(Module["ready"],"onRuntimeInitialized",{configurable:true,get:function(){abort("You are getting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}});Object.defineProperty(Module["ready"],"onRuntimeInitialized",{configurable:true,set:function(){abort("You are setting onRuntimeInitialized on the Promise object, instead of the instance. Use .then() to get called back with the instance, see the MODULARIZE docs in src/settings.js")}})}if(!Module.expectedDataFileDownloads){Module.expectedDataFileDownloads=0}Module.expectedDataFileDownloads++;(function(){var loadPackage=function(metadata){var PACKAGE_PATH="";if(typeof window==="object"){PACKAGE_PATH=window["encodeURIComponent"](window.location.pathname.toString().substring(0,window.location.pathname.toString().lastIndexOf("/"))+"/")}else if(typeof process==="undefined"&&typeof location!=="undefined"){PACKAGE_PATH=encodeURIComponent(location.pathname.toString().substring(0,location.pathname.toString().lastIndexOf("/"))+"/")}var PACKAGE_NAME="../../lib/libfaust-wasm.data";var REMOTE_PACKAGE_BASE="libfaust-wasm.data";if(typeof Module["locateFilePackage"]==="function"&&!Module["locateFile"]){Module["locateFile"]=Module["locateFilePackage"];err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")}var REMOTE_PACKAGE_NAME=Module["locateFile"]?Module["locateFile"](REMOTE_PACKAGE_BASE,""):REMOTE_PACKAGE_BASE;var REMOTE_PACKAGE_SIZE=metadata["remote_package_size"];var PACKAGE_UUID=metadata["package_uuid"];function fetchRemotePackage(packageName,packageSize,callback,errback){if(typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string"){(__webpack_require__(/*! fs */ "?569f").readFile)(packageName,function(err,contents){if(err){errback(err)}else{callback(contents.buffer)}});return}var xhr=new XMLHttpRequest;xhr.open("GET",packageName,true);xhr.responseType="arraybuffer";xhr.onprogress=function(event){var url=packageName;var size=packageSize;if(event.total)size=event.total;if(event.loaded){if(!xhr.addedTotal){xhr.addedTotal=true;if(!Module.dataFileDownloads)Module.dataFileDownloads={};Module.dataFileDownloads[url]={loaded:event.loaded,total:size}}else{Module.dataFileDownloads[url].loaded=event.loaded}var total=0;var loaded=0;var num=0;for(var download in Module.dataFileDownloads){var data=Module.dataFileDownloads[download];total+=data.total;loaded+=data.loaded;num++}total=Math.ceil(total*Module.expectedDataFileDownloads/num);if(Module["setStatus"])Module["setStatus"]("Downloading data... ("+loaded+"/"+total+")")}else if(!Module.dataFileDownloads){if(Module["setStatus"])Module["setStatus"]("Downloading data...")}};xhr.onerror=function(event){throw new Error("NetworkError for: "+packageName)};xhr.onload=function(event){if(xhr.status==200||xhr.status==304||xhr.status==206||xhr.status==0&&xhr.response){var packageData=xhr.response;callback(packageData)}else{throw new Error(xhr.statusText+" : "+xhr.responseURL)}};xhr.send(null)}function handleError(error){console.error("package error:",error)}var fetchedCallback=null;var fetched=Module["getPreloadedPackage"]?Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE):null;if(!fetched)fetchRemotePackage(REMOTE_PACKAGE_NAME,REMOTE_PACKAGE_SIZE,function(data){if(fetchedCallback){fetchedCallback(data);fetchedCallback=null}else{fetched=data}},handleError);function runWithFS(){function assert(check,msg){if(!check)throw msg+(new Error).stack}Module["FS_createPath"]("/","libraries",true,true);function DataRequest(start,end,audio){this.start=start;this.end=end;this.audio=audio}DataRequest.prototype={requests:{},open:function(mode,name){this.name=name;this.requests[name]=this;Module["addRunDependency"]("fp "+this.name)},send:function(){},onload:function(){var byteArray=this.byteArray.subarray(this.start,this.end);this.finish(byteArray)},finish:function(byteArray){var that=this;Module["FS_createDataFile"](this.name,null,byteArray,true,true,true);Module["removeRunDependency"]("fp "+that.name);this.requests[this.name]=null}};var files=metadata["files"];for(var i=0;i<files.length;++i){new DataRequest(files[i]["start"],files[i]["end"],files[i]["audio"]||0).open("GET",files[i]["filename"])}function processPackageData(arrayBuffer){assert(arrayBuffer,"Loading data file failed.");assert(arrayBuffer instanceof ArrayBuffer,"bad input to processPackageData");var byteArray=new Uint8Array(arrayBuffer);DataRequest.prototype.byteArray=byteArray;var files=metadata["files"];for(var i=0;i<files.length;++i){DataRequest.prototype.requests[files[i].filename].onload()}Module["removeRunDependency"]("datafile_../../lib/libfaust-wasm.data")}Module["addRunDependency"]("datafile_../../lib/libfaust-wasm.data");if(!Module.preloadResults)Module.preloadResults={};Module.preloadResults[PACKAGE_NAME]={fromCache:false};if(fetched){processPackageData(fetched);fetched=null}else{fetchedCallback=processPackageData}}if(Module["calledRun"]){runWithFS()}else{if(!Module["preRun"])Module["preRun"]=[];Module["preRun"].push(runWithFS)}};loadPackage({"files":[{"filename":"/libraries/hoa.lib","start":0,"end":42743},{"filename":"/libraries/compressors.lib","start":42743,"end":107497},{"filename":"/libraries/basics.lib","start":107497,"end":163310},{"filename":"/libraries/dx7.lib","start":163310,"end":232413},{"filename":"/libraries/analyzers.lib","start":232413,"end":269925},{"filename":"/libraries/spats.lib","start":269925,"end":275118},{"filename":"/libraries/envelopes.lib","start":275118,"end":287150},{"filename":"/libraries/oscillators.lib","start":287150,"end":336374},{"filename":"/libraries/mi.lib","start":336374,"end":353654},{"filename":"/libraries/misceffects.lib","start":353654,"end":375407},{"filename":"/libraries/version.lib","start":375407,"end":376317},{"filename":"/libraries/webaudio.lib","start":376317,"end":388437},{"filename":"/libraries/math.lib","start":388437,"end":409915},{"filename":"/libraries/stdfaust.lib","start":409915,"end":411185},{"filename":"/libraries/filter.lib","start":411185,"end":476571},{"filename":"/libraries/delays.lib","start":476571,"end":491693},{"filename":"/libraries/routes.lib","start":491693,"end":500258},{"filename":"/libraries/soundfiles.lib","start":500258,"end":509619},{"filename":"/libraries/tonestacks.lib","start":509619,"end":521973},{"filename":"/libraries/aanl.lib","start":521973,"end":549726},{"filename":"/libraries/wdmodels.lib","start":549726,"end":639679},{"filename":"/libraries/all.lib","start":639679,"end":640695},{"filename":"/libraries/music.lib","start":640695,"end":659129},{"filename":"/libraries/tubes.lib","start":659129,"end":1008918},{"filename":"/libraries/effect.lib","start":1008918,"end":1077948},{"filename":"/libraries/vaeffects.lib","start":1077948,"end":1113845},{"filename":"/libraries/maxmsp.lib","start":1113845,"end":1122019},{"filename":"/libraries/platform.lib","start":1122019,"end":1125099},{"filename":"/libraries/synths.lib","start":1125099,"end":1136494},{"filename":"/libraries/sf.lib","start":1136494,"end":1137560},{"filename":"/libraries/fds.lib","start":1137560,"end":1158112},{"filename":"/libraries/reducemaps.lib","start":1158112,"end":1162948},{"filename":"/libraries/phaflangers.lib","start":1162948,"end":1172972},{"filename":"/libraries/filters.lib","start":1172972,"end":1288450},{"filename":"/libraries/signals.lib","start":1288450,"end":1304866},{"filename":"/libraries/instruments.lib","start":1304866,"end":1314261},{"filename":"/libraries/quantizers.lib","start":1314261,"end":1324116},{"filename":"/libraries/noises.lib","start":1324116,"end":1340202},{"filename":"/libraries/oscillator.lib","start":1340202,"end":1360053},{"filename":"/libraries/interpolators.lib","start":1360053,"end":1383968},{"filename":"/libraries/demos.lib","start":1383968,"end":1449149},{"filename":"/libraries/reverbs.lib","start":1449149,"end":1486655},{"filename":"/libraries/physmodels.lib","start":1486655,"end":1657938},{"filename":"/libraries/maths.lib","start":1657938,"end":1679421}],"remote_package_size":1679421,"package_uuid":"7c36eeba-6680-46fb-9ba5-b64869e42681"})})();var necessaryPreJSTasks=Module["preRun"].slice();if(!Module["preRun"])throw"Module.preRun should exist because file support used it; did a pre-js delete it?";necessaryPreJSTasks.forEach(function(task){if(Module["preRun"].indexOf(task)<0)throw"All preRun tasks that exist before user pre-js code should remain after; did you replace Module or modify Module.preRun?"});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=typeof window==="object";var ENVIRONMENT_IS_WORKER=typeof importScripts==="function";var ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";var ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;if(Module["ENVIRONMENT"]){throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)")}var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;function logExceptionOnExit(e){if(e instanceof ExitStatus)return;var toLog=e;if(e&&typeof e==="object"&&e.stack){toLog=[e,e.stack]}err("exiting due to exception: "+toLog)}var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(!(typeof process==="object"&&"function"==="function"))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");if(ENVIRONMENT_IS_WORKER){scriptDirectory=(__webpack_require__(/*! path */ "?3f59").dirname)(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}read_=function shell_read(filename,binary){if(!nodeFS)nodeFS=__webpack_require__(/*! fs */ "?569f");if(!nodePath)nodePath=__webpack_require__(/*! path */ "?3f59");filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};readAsync=function readAsync(filename,onload,onerror){if(!nodeFS)nodeFS=__webpack_require__(/*! fs */ "?569f");if(!nodePath)nodePath=__webpack_require__(/*! path */ "?3f59");filename=nodePath["normalize"](filename);nodeFS["readFile"](filename,function(err,data){if(err)onerror(err);else onload(data.buffer)})};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",function(reason){throw reason});quit_=function(status,toThrow){if(keepRuntimeAlive()){process["exitCode"]=status;throw toThrow}logExceptionOnExit(toThrow);process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_SHELL){if(typeof process==="object"&&"function"==="function"||typeof window==="object"||typeof importScripts==="function")throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");if(typeof read!="undefined"){read_=function shell_read(f){return read(f)}}readBinary=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};readAsync=function readAsync(f,onload,onerror){setTimeout(function(){onload(readBinary(f))},0)};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs}else if(typeof arguments!="undefined"){arguments_=arguments}if(typeof quit==="function"){quit_=function(status,toThrow){logExceptionOnExit(toThrow);quit(status)}}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}if(!(typeof window==="object"||typeof importScripts==="function"))throw new Error("not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)");{read_=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=function(title){document.title=title}}else{throw new Error("environment detection error")}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(!Object.getOwnPropertyDescriptor(Module,"arguments")){Object.defineProperty(Module,"arguments",{configurable:true,get:function(){abort("Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(!Object.getOwnPropertyDescriptor(Module,"thisProgram")){Object.defineProperty(Module,"thisProgram",{configurable:true,get:function(){abort("Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}if(Module["quit"])quit_=Module["quit"];if(!Object.getOwnPropertyDescriptor(Module,"quit")){Object.defineProperty(Module,"quit",{configurable:true,get:function(){abort("Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}assert(typeof Module["memoryInitializerPrefixURL"]==="undefined","Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["pthreadMainPrefixURL"]==="undefined","Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["cdInitializerPrefixURL"]==="undefined","Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["filePackagePrefixURL"]==="undefined","Module.filePackagePrefixURL option was removed, use Module.locateFile instead");assert(typeof Module["read"]==="undefined","Module.read option was removed (modify read_ in JS)");assert(typeof Module["readAsync"]==="undefined","Module.readAsync option was removed (modify readAsync in JS)");assert(typeof Module["readBinary"]==="undefined","Module.readBinary option was removed (modify readBinary in JS)");assert(typeof Module["setWindowTitle"]==="undefined","Module.setWindowTitle option was removed (modify setWindowTitle in JS)");assert(typeof Module["TOTAL_MEMORY"]==="undefined","Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");if(!Object.getOwnPropertyDescriptor(Module,"read")){Object.defineProperty(Module,"read",{configurable:true,get:function(){abort("Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}if(!Object.getOwnPropertyDescriptor(Module,"readAsync")){Object.defineProperty(Module,"readAsync",{configurable:true,get:function(){abort("Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}if(!Object.getOwnPropertyDescriptor(Module,"readBinary")){Object.defineProperty(Module,"readBinary",{configurable:true,get:function(){abort("Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}if(!Object.getOwnPropertyDescriptor(Module,"setWindowTitle")){Object.defineProperty(Module,"setWindowTitle",{configurable:true,get:function(){abort("Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}assert(!ENVIRONMENT_IS_SHELL,"shell environment detected but not enabled at build time.  Add 'shell' to `-s ENVIRONMENT` to enable.");function getPointerSize(){return 4}function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}function convertJsFunctionToWasm(func,sig){if(typeof WebAssembly.Function==="function"){var typeNames={"i":"i32","j":"i64","f":"f32","d":"f64"};var type={parameters:[],results:sig[0]=="v"?[]:[typeNames[sig[0]]]};for(var i=1;i<sig.length;++i){type.parameters.push(typeNames[sig[i]])}return new WebAssembly.Function(type,func)}var typeSection=[1,0,1,96];var sigRet=sig.slice(0,1);var sigParam=sig.slice(1);var typeCodes={"i":127,"j":126,"f":125,"d":124};typeSection.push(sigParam.length);for(var i=0;i<sigParam.length;++i){typeSection.push(typeCodes[sigParam[i]])}if(sigRet=="v"){typeSection.push(0)}else{typeSection=typeSection.concat([1,typeCodes[sigRet]])}typeSection[1]=typeSection.length-2;var bytes=new Uint8Array([0,97,115,109,1,0,0,0].concat(typeSection,[2,7,1,1,101,1,102,0,0,7,5,1,1,102,0,0]));var module=new WebAssembly.Module(bytes);var instance=new WebAssembly.Instance(module,{"e":{"f":func}});var wrappedFunc=instance.exports["f"];return wrappedFunc}var freeTableIndexes=[];var functionsInTableMap;function getEmptyTableSlot(){if(freeTableIndexes.length){return freeTableIndexes.pop()}try{wasmTable.grow(1)}catch(err){if(!(err instanceof RangeError)){throw err}throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."}return wasmTable.length-1}function updateTableMap(offset,count){for(var i=offset;i<offset+count;i++){var item=getWasmTableEntry(i);if(item){functionsInTableMap.set(item,i)}}}var tempRet0=0;var setTempRet0=function(value){tempRet0=value};var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];if(!Object.getOwnPropertyDescriptor(Module,"wasmBinary")){Object.defineProperty(Module,"wasmBinary",{configurable:true,get:function(){abort("Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}var noExitRuntime=Module["noExitRuntime"]||true;if(!Object.getOwnPropertyDescriptor(Module,"noExitRuntime")){Object.defineProperty(Module,"noExitRuntime",{configurable:true,get:function(){abort("Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}if(typeof WebAssembly!=="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;assert(returnType!=="array",'Return type should not be "array".');if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret}function cwrap(ident,returnType,argTypes,opts){return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}var ALLOC_STACK=1;function allocate(slab,allocator){var ret;assert(typeof allocator==="number","allocate no longer takes a type argument");assert(typeof slab!=="number","allocate no longer takes a number as arg0");if(allocator==ALLOC_STACK){ret=stackAlloc(slab.length)}else{ret=_malloc(slab.length)}if(slab.subarray||slab.slice){HEAPU8.set(slab,ret)}else{HEAPU8.set(new Uint8Array(slab),ret)}return ret}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{if((u0&248)!=240)warnOnce("Invalid UTF-8 leading byte 0x"+u0.toString(16)+" encountered when deserializing a UTF-8 string in wasm memory to a JS string!");u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;if(u>1114111)warnOnce("Invalid Unicode code point 0x"+u.toString(16)+" encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).");heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){assert(typeof maxBytesToWrite=="number","stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function UTF16ToString(ptr,maxBytesToRead){assert(ptr%2==0,"Pointer passed to UTF16ToString must be aligned to two bytes!");var endPtr=ptr;var idx=endPtr>>1;var maxIdx=idx+maxBytesToRead/2;while(!(idx>=maxIdx)&&HEAPU16[idx])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder){return UTF16Decoder.decode(HEAPU8.subarray(ptr,endPtr))}else{var str="";for(var i=0;!(i>=maxBytesToRead/2);++i){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)break;str+=String.fromCharCode(codeUnit)}return str}}function stringToUTF16(str,outPtr,maxBytesToWrite){assert(outPtr%2==0,"Pointer passed to stringToUTF16 must be aligned to two bytes!");assert(typeof maxBytesToWrite=="number","stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2}HEAP16[outPtr>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr,maxBytesToRead){assert(ptr%4==0,"Pointer passed to UTF32ToString must be aligned to four bytes!");var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}else{str+=String.fromCharCode(utf32)}}return str}function stringToUTF32(str,outPtr,maxBytesToWrite){assert(outPtr%4==0,"Pointer passed to stringToUTF32 must be aligned to four bytes!");assert(typeof maxBytesToWrite=="number","stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4}return len}function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function writeArrayToMemory(array,buffer){assert(array.length>=0,"writeArrayToMemory array must have a length (should be an array or typed array)");HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){assert(str.charCodeAt(i)===(str.charCodeAt(i)&255));HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var TOTAL_STACK=5242880;if(Module["TOTAL_STACK"])assert(TOTAL_STACK===Module["TOTAL_STACK"],"the stack size can no longer be determined at runtime");var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||16777216;if(!Object.getOwnPropertyDescriptor(Module,"INITIAL_MEMORY")){Object.defineProperty(Module,"INITIAL_MEMORY",{configurable:true,get:function(){abort("Module.INITIAL_MEMORY has been replaced with plain INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)")}})}assert(INITIAL_MEMORY>=TOTAL_STACK,"INITIAL_MEMORY should be larger than TOTAL_STACK, was "+INITIAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")");assert(typeof Int32Array!=="undefined"&&typeof Float64Array!=="undefined"&&Int32Array.prototype.subarray!==undefined&&Int32Array.prototype.set!==undefined,"JS engine does not provide full typed array support");assert(!Module["wasmMemory"],"Use of `wasmMemory` detected.  Use -s IMPORTED_MEMORY to define wasmMemory externally");assert(INITIAL_MEMORY==16777216,"Detected runtime INITIAL_MEMORY setting.  Use -s IMPORTED_MEMORY to define wasmMemory dynamically");var wasmTable;function writeStackCookie(){var max=_emscripten_stack_get_end();assert((max&3)==0);HEAP32[max+4>>2]=34821223;HEAP32[max+8>>2]=2310721022;HEAP32[0]=1668509029}function checkStackCookie(){if(ABORT)return;var max=_emscripten_stack_get_end();var cookie1=HEAPU32[max+4>>2];var cookie2=HEAPU32[max+8>>2];if(cookie1!=34821223||cookie2!=2310721022){abort("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x"+cookie2.toString(16)+" "+cookie1.toString(16))}if(HEAP32[0]!==1668509029)abort("Runtime error: The application has corrupted its heap memory area (address zero)!")}(function(){var h16=new Int16Array(1);var h8=new Int8Array(h16.buffer);h16[0]=25459;if(h8[0]!==115||h8[1]!==99)throw"Runtime error: expected the system to be little-endian! (Run with -s SUPPORT_BIG_ENDIAN=1 to bypass)"})();var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;var runtimeKeepaliveCounter=0;function keepRuntimeAlive(){return noExitRuntime||runtimeKeepaliveCounter>0}function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){checkStackCookie();assert(!runtimeInitialized);runtimeInitialized=true;if(!Module["noFSInit"]&&!FS.init.initialized)FS.init();FS.ignorePermissions=false;TTY.init();SOCKFS.root=FS.mount(SOCKFS,{},null);callRuntimeCallbacks(__ATINIT__)}function exitRuntime(){checkStackCookie();runtimeExited=true}function postRun(){checkStackCookie();if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}assert(Math.imul,"This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");assert(Math.fround,"This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");assert(Math.clz32,"This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");assert(Math.trunc,"This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;var runDependencyTracking={};function getUniqueRunDependency(id){var orig=id;while(1){if(!runDependencyTracking[id])return id;id=orig+Math.random()}}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(id){assert(!runDependencyTracking[id]);runDependencyTracking[id]=1;if(runDependencyWatcher===null&&typeof setInterval!=="undefined"){runDependencyWatcher=setInterval(function(){if(ABORT){clearInterval(runDependencyWatcher);runDependencyWatcher=null;return}var shown=false;for(var dep in runDependencyTracking){if(!shown){shown=true;err("still waiting on run dependencies:")}err("dependency: "+dep)}if(shown){err("(end of list)")}},1e4)}}else{err("warning: run dependency added without ID")}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(id){assert(runDependencyTracking[id]);delete runDependencyTracking[id]}else{err("warning: run dependency removed without ID")}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){{if(Module["onAbort"]){Module["onAbort"](what)}}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}function createExportWrapper(name,fixedasm){return function(){var displayName=name;var asm=fixedasm;if(!fixedasm){asm=Module["asm"]}assert(runtimeInitialized,"native function `"+displayName+"` called before runtime initialization");assert(!runtimeExited,"native function `"+displayName+"` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)");if(!asm[name]){assert(asm[name],"exported native function `"+displayName+"` not found")}return asm[name].apply(null,arguments)}}var wasmBinaryFile;wasmBinaryFile="libfaust-wasm.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"env":asmLibraryArg,"wasi_snapshot_preview1":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["memory"];assert(wasmMemory,"memory not found in wasm exports");updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["__indirect_function_table"];assert(wasmTable,"table not found in wasm exports");addOnInit(Module["asm"]["__wasm_call_ctors"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");var trueModule=Module;function receiveInstantiationResult(result){assert(Module===trueModule,"the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");trueModule=null;receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){return WebAssembly.instantiate(binary,info)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);if(isFileURI(wasmBinaryFile)){err("warning: Loading from a file URI ("+wasmBinaryFile+") is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing")}abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return{}}var tempDouble;var tempI64;var ASM_CONSTS={151328:function($0){var dsp_code="";try{var xmlhttp=new XMLHttpRequest;xmlhttp.open("GET",Module.UTF8ToString($0),false);xmlhttp.send();if(xmlhttp.status==200){dsp_code=xmlhttp.responseText}}catch(e){console.log(e)}return allocate(intArrayFromString(dsp_code),"i8",ALLOC_STACK)},151623:function($0){faust_module.faust.wasm_instance[$0]=null},151672:function($0){return faust_module._malloc($0)},151709:function($0){faust_module._free($0)},151737:function($0,$1){return faust_module.faust.wasm_instance[$0].exports.getNumInputs($1)},151811:function($0,$1){return faust_module.faust.wasm_instance[$0].exports.getNumOutputs($1)},151886:function($0,$1){return faust_module.faust.wasm_instance[$0].exports.getSampleRate($1)},151961:function($0,$1,$2){faust_module.faust.wasm_instance[$0].exports.init($1,$2)},152024:function($0,$1,$2){faust_module.faust.wasm_instance[$0].exports.instanceInit($1,$2)},152095:function($0,$1,$2){faust_module.faust.wasm_instance[$0].exports.instanceConstants($1,$2)},152171:function($0,$1){faust_module.faust.wasm_instance[$0].exports.instanceResetUserInterface($1)},152252:function($0,$1){faust_module.faust.wasm_instance[$0].exports.instanceClear($1)},152320:function($0,$1,$2,$3,$4){faust_module.faust.wasm_instance[$0].exports.compute($1,$2,$3,$4)},152394:function($0,$1,$2,$3,$4){faust_module.faust.wasm_instance[$0].exports.compute($1,$2,$3,$4)}};function connectMemory(){faust_module.faust=faust_module.faust||{};faust_module.faust.memory=faust_module.faust.memory||wasmMemory}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){getWasmTableEntry(func)()}else{getWasmTableEntry(func)(callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}function demangle(func){warnOnce("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");return func}function demangleAll(text){var regex=/\b_Z[\w\d_]+/g;return text.replace(regex,function(x){var y=demangle(x);return x===y?x:y+" ["+x+"]"})}var wasmTableMirror=[];function getWasmTableEntry(funcPtr){var func=wasmTableMirror[funcPtr];if(!func){if(funcPtr>=wasmTableMirror.length)wasmTableMirror.length=funcPtr+1;wasmTableMirror[funcPtr]=func=wasmTable.get(funcPtr)}assert(wasmTable.get(funcPtr)==func,"JavaScript-side Wasm function table mirror is out of date!");return func}function jsStackTrace(){var error=new Error;if(!error.stack){try{throw new Error}catch(e){error=e}if(!error.stack){return"(no stack trace available)"}}return error.stack.toString()}function setWasmTableEntry(idx,func){wasmTable.set(idx,func);wasmTableMirror[idx]=func}function ___assert_fail(condition,filename,line,func){abort("Assertion failed: "+UTF8ToString(condition)+", at: "+[filename?UTF8ToString(filename):"unknown filename",line,func?UTF8ToString(func):"unknown function"])}function ___cxa_allocate_exception(size){return _malloc(size+16)+16}function _atexit(func,arg){}function ___cxa_atexit(a0,a1){return _atexit(a0,a1)}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-16;this.set_type=function(type){HEAP32[this.ptr+4>>2]=type};this.get_type=function(){return HEAP32[this.ptr+4>>2]};this.set_destructor=function(destructor){HEAP32[this.ptr+8>>2]=destructor};this.get_destructor=function(){return HEAP32[this.ptr+8>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr>>2]=refcount};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+12>>0]=caught};this.get_caught=function(){return HEAP8[this.ptr+12>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+13>>0]=rethrown};this.get_rethrown=function(){return HEAP8[this.ptr+13>>0]!=0};this.init=function(type,destructor){this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false)};this.add_ref=function(){var value=HEAP32[this.ptr>>2];HEAP32[this.ptr>>2]=value+1};this.release_ref=function(){var prev=HEAP32[this.ptr>>2];HEAP32[this.ptr>>2]=prev-1;assert(prev>0);return prev===1}}var exceptionLast=0;var uncaughtExceptionCount=0;function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw ptr+" - Exception catching is disabled, this exception cannot be caught. Compile with -s NO_DISABLE_EXCEPTION_CATCHING or -s EXCEPTION_CATCHING_ALLOWED=[..] to catch."}function _tzset_impl(){var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAP32[__get_timezone()>>2]=stdTimezoneOffset*60;HEAP32[__get_daylight()>>2]=Number(winterOffset!=summerOffset);function extractZone(date){var match=date.toTimeString().match(/\(([A-Za-z ]+)\)$/);return match?match[1]:"GMT"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=allocateUTF8(winterName);var summerNamePtr=allocateUTF8(summerName);if(summerOffset<winterOffset){HEAP32[__get_tzname()>>2]=winterNamePtr;HEAP32[__get_tzname()+4>>2]=summerNamePtr}else{HEAP32[__get_tzname()>>2]=summerNamePtr;HEAP32[__get_tzname()+4>>2]=winterNamePtr}}function _tzset(){if(_tzset.called)return;_tzset.called=true;_tzset_impl()}function _localtime_r(time,tmPtr){_tzset();var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var start=new Date(date.getFullYear(),0,1);var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst;var zonePtr=HEAP32[__get_tzname()+(dst?4:0)>>2];HEAP32[tmPtr+40>>2]=zonePtr;return tmPtr}function ___localtime_r(a0,a1){return _localtime_r(a0,a1)}var PATH={splitPath:function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:function(path){if(path==="/")return"/";path=PATH.normalize(path);path=path.replace(/\/$/,"");var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},extname:function(path){return PATH.splitPath(path)[3]},join:function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))},join2:function(l,r){return PATH.normalize(l+"/"+r)}};function getRandomDevice(){if(typeof crypto==="object"&&typeof crypto["getRandomValues"]==="function"){var randomBuffer=new Uint8Array(1);return function(){crypto.getRandomValues(randomBuffer);return randomBuffer[0]}}else if(ENVIRONMENT_IS_NODE){try{var crypto_module=__webpack_require__(/*! crypto */ "?fe02");return function(){return crypto_module["randomBytes"](1)[0]}}catch(e){}}return function(){abort("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };")}}var PATH_FS={resolve:function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:FS.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/"}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(function(p){return!!p}),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:function(from,to){from=PATH_FS.resolve(from).substr(1);to=PATH_FS.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var TTY={ttys:[],init:function(){},shutdown:function(){},register:function(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open:function(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close:function(stream){stream.tty.ops.flush(stream.tty)},flush:function(stream){stream.tty.ops.flush(stream.tty)},read:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.timestamp=Date.now()}return i}},default_tty_ops:{get_char:function(tty){if(!tty.input.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc(BUFSIZE);var bytesRead=0;try{bytesRead=nodeFS.readSync(process.stdin.fd,buf,0,BUFSIZE,null)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}else{result=null}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else if(typeof readline=="function"){result=readline();if(result!==null){result+="\n"}}if(!result){return null}tty.input=intArrayFromString(result,true)}return tty.input.shift()},put_char:function(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},flush:function(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}}},default_tty1_ops:{put_char:function(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},flush:function(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}}}};function mmapAlloc(size){abort("internal error: mmapAlloc called but `memalign` native symbol not exported")}var MEMFS={ops_table:null,mount:function(mount){return MEMFS.createNode(null,"/",16384|511,0)},createNode:function(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}if(!MEMFS.ops_table){MEMFS.ops_table={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}}}var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node;parent.timestamp=node.timestamp}return node},getFileDataAsTypedArray:function(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage:function(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage:function(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr:function(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr:function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup:function(parent,name){throw FS.genericErrors[44]},mknod:function(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename:function(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}}delete old_node.parent.contents[old_node.name];old_node.parent.timestamp=Date.now();old_node.name=new_name;new_dir.contents[new_name]=old_node;new_dir.timestamp=old_node.parent.timestamp;old_node.parent=new_dir},unlink:function(parent,name){delete parent.contents[name];parent.timestamp=Date.now()},rmdir:function(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.timestamp=Date.now()},readdir:function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries},symlink:function(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink:function(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read:function(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);assert(size>=0);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write:function(stream,buffer,offset,length,position,canOwn){assert(!(buffer instanceof ArrayBuffer));if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){assert(position===0,"canOwn must imply no weird position inside the file");node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek:function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},allocate:function(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)},mmap:function(stream,address,length,position,prot,flags){if(address!==0){throw new FS.ErrnoError(28)}if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents.buffer===buffer){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}HEAP8.set(contents,ptr)}return{ptr:ptr,allocated:allocated}},msync:function(stream,buffer,offset,length,mmapFlags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(mmapFlags&2){return 0}var bytesWritten=MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};function asyncLoad(url,onload,onerror,noRunDep){var dep=!noRunDep?getUniqueRunDependency("al "+url):"";readAsync(url,function(arrayBuffer){assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)},function(event){if(onerror){onerror()}else{throw'Loading data file "'+url+'" failed.'}});if(dep)addRunDependency(dep)}var ERRNO_MESSAGES={0:"Success",1:"Arg list too long",2:"Permission denied",3:"Address already in use",4:"Address not available",5:"Address family not supported by protocol family",6:"No more processes",7:"Socket already connected",8:"Bad file number",9:"Trying to read unreadable message",10:"Mount device busy",11:"Operation canceled",12:"No children",13:"Connection aborted",14:"Connection refused",15:"Connection reset by peer",16:"File locking deadlock error",17:"Destination address required",18:"Math arg out of domain of func",19:"Quota exceeded",20:"File exists",21:"Bad address",22:"File too large",23:"Host is unreachable",24:"Identifier removed",25:"Illegal byte sequence",26:"Connection already in progress",27:"Interrupted system call",28:"Invalid argument",29:"I/O error",30:"Socket is already connected",31:"Is a directory",32:"Too many symbolic links",33:"Too many open files",34:"Too many links",35:"Message too long",36:"Multihop attempted",37:"File or path name too long",38:"Network interface is not configured",39:"Connection reset by network",40:"Network is unreachable",41:"Too many open files in system",42:"No buffer space available",43:"No such device",44:"No such file or directory",45:"Exec format error",46:"No record locks available",47:"The link has been severed",48:"Not enough core",49:"No message of desired type",50:"Protocol not available",51:"No space left on device",52:"Function not implemented",53:"Socket is not connected",54:"Not a directory",55:"Directory not empty",56:"State not recoverable",57:"Socket operation on non-socket",59:"Not a typewriter",60:"No such device or address",61:"Value too large for defined data type",62:"Previous owner died",63:"Not super-user",64:"Broken pipe",65:"Protocol error",66:"Unknown protocol",67:"Protocol wrong type for socket",68:"Math result not representable",69:"Read only file system",70:"Illegal seek",71:"No such process",72:"Stale file handle",73:"Connection timed out",74:"Text file busy",75:"Cross-device link",100:"Device not a stream",101:"Bad font file fmt",102:"Invalid slot",103:"Invalid request code",104:"No anode",105:"Block device required",106:"Channel number out of range",107:"Level 3 halted",108:"Level 3 reset",109:"Link number out of range",110:"Protocol driver not attached",111:"No CSI structure available",112:"Level 2 halted",113:"Invalid exchange",114:"Invalid request descriptor",115:"Exchange full",116:"No data (for no delay io)",117:"Timer expired",118:"Out of streams resources",119:"Machine is not on the network",120:"Package not installed",121:"The object is remote",122:"Advertise error",123:"Srmount error",124:"Communication error on send",125:"Cross mount point (not really error)",126:"Given log. name not unique",127:"f.d. invalid for this operation",128:"Remote address changed",129:"Can   access a needed shared lib",130:"Accessing a corrupted shared lib",131:".lib section in a.out corrupted",132:"Attempting to link in too many libs",133:"Attempting to exec a shared library",135:"Streams pipe error",136:"Too many users",137:"Socket type not supported",138:"Not supported",139:"Protocol family not supported",140:"Can't send after socket shutdown",141:"Too many references",142:"Host is down",148:"No medium (in tape drive)",156:"Level 2 not synchronized"};var ERRNO_CODES={};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:function(path,opts){path=PATH_FS.resolve(FS.cwd(),path);opts=opts||{};if(!path)return{path:"",node:null};var defaults={follow_mount:true,recurse_count:0};for(var key in defaults){if(opts[key]===undefined){opts[key]=defaults[key]}}if(opts.recurse_count>8){throw new FS.ErrnoError(32)}var parts=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),false);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH_FS.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count});current=lookup.node;if(count++>40){throw new FS.ErrnoError(32)}}}}return{path:current_path,node:current}},getPath:function(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?mount+"/"+path:mount+path}path=path?node.name+"/"+path:node.name;node=node.parent}},hashName:function(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode:function(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode:function(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode:function(parent,name){var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode,parent)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode:function(parent,name,mode,rdev){assert(typeof parent==="object");var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode:function(node){FS.hashRemoveNode(node)},isRoot:function(node){return node===node.parent},isMountpoint:function(node){return!!node.mounted},isFile:function(mode){return(mode&61440)===32768},isDir:function(mode){return(mode&61440)===16384},isLink:function(mode){return(mode&61440)===40960},isChrdev:function(mode){return(mode&61440)===8192},isBlkdev:function(mode){return(mode&61440)===24576},isFIFO:function(mode){return(mode&61440)===4096},isSocket:function(mode){return(mode&49152)===49152},flagModes:{"r":0,"r+":2,"w":577,"w+":578,"a":1089,"a+":1090},modeStringToFlags:function(str){var flags=FS.flagModes[str];if(typeof flags==="undefined"){throw new Error("Unknown file open mode: "+str)}return flags},flagsToPermissionString:function(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions:function(node,perms){if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup:function(dir){var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate:function(dir,name){try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete:function(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen:function(node,flags){if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},MAX_OPEN_FDS:4096,nextfd:function(fd_start,fd_end){fd_start=fd_start||0;fd_end=fd_end||FS.MAX_OPEN_FDS;for(var fd=fd_start;fd<=fd_end;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStream:function(fd){return FS.streams[fd]},createStream:function(stream,fd_start,fd_end){if(!FS.FSStream){FS.FSStream=function(){};FS.FSStream.prototype={object:{get:function(){return this.node},set:function(val){this.node=val}},isRead:{get:function(){return(this.flags&2097155)!==1}},isWrite:{get:function(){return(this.flags&2097155)!==0}},isAppend:{get:function(){return this.flags&1024}}}}var newStream=new FS.FSStream;for(var p in stream){newStream[p]=stream[p]}stream=newStream;var fd=FS.nextfd(fd_start,fd_end);stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream:function(fd){FS.streams[fd]=null},chrdev_stream_ops:{open:function(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;if(stream.stream_ops.open){stream.stream_ops.open(stream)}},llseek:function(){throw new FS.ErrnoError(70)}},major:function(dev){return dev>>8},minor:function(dev){return dev&255},makedev:function(ma,mi){return ma<<8|mi},registerDevice:function(dev,ops){FS.devices[dev]={stream_ops:ops}},getDevice:function(dev){return FS.devices[dev]},getMounts:function(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push.apply(check,m.mounts)}return mounts},syncfs:function(populate,callback){if(typeof populate==="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err("warning: "+FS.syncFSRequests+" FS.syncfs operations in flight at once, probably just doing extra work")}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){assert(FS.syncFSRequests>0);FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(function(mount){if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount:function(type,opts,mountpoint){if(typeof type==="string"){throw type}var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount:function(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(function(hash){var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);assert(idx!==-1);node.mount.mounts.splice(idx,1)},lookup:function(parent,name){return parent.node_ops.lookup(parent,name)},mknod:function(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(28)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},create:function(path,mode){mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir:function(path,mode){mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree:function(path,mode){var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev:function(path,mode,dev){if(typeof dev==="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink:function(oldpath,newpath){if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename:function(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}},rmdir:function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node)},readdir:function(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(54)}return node.node_ops.readdir(node)},unlink:function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}parent.node_ops.unlink(parent,name);FS.destroyNode(node)},readlink:function(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return PATH_FS.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))},stat:function(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(44)}if(!node.node_ops.getattr){throw new FS.ErrnoError(63)}return node.node_ops.getattr(node)},lstat:function(path){return FS.stat(path,true)},chmod:function(path,mode,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})},lchmod:function(path,mode){FS.chmod(path,mode,true)},fchmod:function(fd,mode){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chmod(stream.node,mode)},chown:function(path,uid,gid,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{timestamp:Date.now()})},lchown:function(path,uid,gid){FS.chown(path,uid,gid,true)},fchown:function(fd,uid,gid){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chown(stream.node,uid,gid)},truncate:function(path,len){if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})},ftruncate:function(fd,len){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.truncate(stream.node,len)},utime:function(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})},open:function(path,flags,mode,fd_start,fd_end){if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags==="string"?FS.modeStringToFlags(flags):flags;mode=typeof mode==="undefined"?438:mode;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path==="object"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node:node,path:FS.getPath(node),id:node.id,flags:flags,mode:node.mode,seekable:true,position:0,stream_ops:node.stream_ops,node_ops:node.node_ops,ungotten:[],error:false},fd_start,fd_end);if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1}}return stream},close:function(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed:function(stream){return stream.fd===null},llseek:function(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read:function(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write:function(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;return bytesWritten},allocate:function(stream,offset,length){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(offset<0||length<=0){throw new FS.ErrnoError(28)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(43)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(138)}stream.stream_ops.allocate(stream,offset,length)},mmap:function(stream,address,length,position,prot,flags){if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}return stream.stream_ops.mmap(stream,address,length,position,prot,flags)},msync:function(stream,buffer,offset,length,mmapFlags){if(!stream||!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},munmap:function(stream){return 0},ioctl:function(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile:function(path,opts){opts=opts||{};opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error('Invalid encoding type "'+opts.encoding+'"')}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret},writeFile:function(path,data,opts){opts=opts||{};opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data==="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)},cwd:function(){return FS.currentPath},chdir:function(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories:function(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices:function(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:function(){return 0},write:function(stream,buffer,offset,length,pos){return length}});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var random_device=getRandomDevice();FS.createDevice("/dev","random",random_device);FS.createDevice("/dev","urandom",random_device);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories:function(){FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount:function(){var node=FS.createNode(proc_self,"fd",16384|511,73);node.node_ops={lookup:function(parent,name){var fd=+name;var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:function(){return stream.path}}};ret.parent=ret;return ret}};return node}},{},"/proc/self/fd")},createStandardStreams:function(){if(Module["stdin"]){FS.createDevice("/dev","stdin",Module["stdin"])}else{FS.symlink("/dev/tty","/dev/stdin")}if(Module["stdout"]){FS.createDevice("/dev","stdout",null,Module["stdout"])}else{FS.symlink("/dev/tty","/dev/stdout")}if(Module["stderr"]){FS.createDevice("/dev","stderr",null,Module["stderr"])}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1);assert(stdin.fd===0,"invalid handle for stdin ("+stdin.fd+")");assert(stdout.fd===1,"invalid handle for stdout ("+stdout.fd+")");assert(stderr.fd===2,"invalid handle for stderr ("+stderr.fd+")")},ensureErrnoError:function(){if(FS.ErrnoError)return;FS.ErrnoError=function ErrnoError(errno,node){this.node=node;this.setErrno=function(errno){this.errno=errno;for(var key in ERRNO_CODES){if(ERRNO_CODES[key]===errno){this.code=key;break}}};this.setErrno(errno);this.message=ERRNO_MESSAGES[errno];if(this.stack){Object.defineProperty(this,"stack",{value:(new Error).stack,writable:true});this.stack=demangleAll(this.stack)}};FS.ErrnoError.prototype=new Error;FS.ErrnoError.prototype.constructor=FS.ErrnoError;[44].forEach(function(code){FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack="<generic error, no stack>"})},staticInit:function(){FS.ensureErrnoError();FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={"MEMFS":MEMFS}},init:function(input,output,error){assert(!FS.init.initialized,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");FS.init.initialized=true;FS.ensureErrnoError();Module["stdin"]=input||Module["stdin"];Module["stdout"]=output||Module["stdout"];Module["stderr"]=error||Module["stderr"];FS.createStandardStreams()},quit:function(){FS.init.initialized=false;var fflush=Module["_fflush"];if(fflush)fflush(0);for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}},getMode:function(canRead,canWrite){var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode},findObject:function(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(ret.exists){return ret.object}else{return null}},analyzePath:function(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath:function(parent,path,canRead,canWrite){parent=typeof parent==="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current},createFile:function(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile:function(parent,name,data,canRead,canWrite,canOwn){var path=name?PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name):parent;var mode=FS.getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data==="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}return node},createDevice:function(parent,name,input,output){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open:function(stream){stream.seekable=false},close:function(stream){if(output&&output.buffer&&output.buffer.length){output(10)}},read:function(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:function(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.timestamp=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile:function(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!=="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else if(read_){try{obj.contents=intArrayFromString(read_(obj.url),true);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}else{throw new Error("Cannot load without read() or XMLHttpRequest.")}},createLazyFile:function(parent,name,url,canRead,canWrite){function LazyUint8Array(){this.lengthKnown=false;this.chunks=[]}LazyUint8Array.prototype.get=function LazyUint8Array_get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]};LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter){this.getter=getter};LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=function(from,to){if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);if(typeof Uint8Array!="undefined")xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}else{return intArrayFromString(xhr.responseText||"",true)}};var lazyArray=this;lazyArray.setDataGetter(function(chunkNum){var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]==="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]==="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true};if(typeof XMLHttpRequest!=="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;Object.defineProperties(lazyArray,{length:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._length}},chunkSize:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}});var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(function(key){var fn=node.stream_ops[key];stream_ops[key]=function forceLoadLazyFile(){FS.forceLoadFile(node);return fn.apply(null,arguments)}});stream_ops.read=function stream_ops_read(stream,buffer,offset,length,position){FS.forceLoadFile(node);var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);assert(size>=0);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size};node.stream_ops=stream_ops;return node},createPreloadedFile:function(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish){Browser.init();var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency("cp "+fullname);function processData(byteArray){function finish(byteArray){if(preFinish)preFinish();if(!dontCreateFile){FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}if(onload)onload();removeRunDependency(dep)}var handled=false;Module["preloadPlugins"].forEach(function(plugin){if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,function(){if(onerror)onerror();removeRunDependency(dep)});handled=true}});if(!handled)finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){asyncLoad(url,function(byteArray){processData(byteArray)},onerror)}else{processData(url)}},indexedDB:function(){return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB},DB_NAME:function(){return"EM_FS_"+window.location.pathname},DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(paths,onload,onerror){onload=onload||function(){};onerror=onerror||function(){};var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=function openRequest_onupgradeneeded(){out("creating db");var db=openRequest.result;db.createObjectStore(FS.DB_STORE_NAME)};openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;var transaction=db.transaction([FS.DB_STORE_NAME],"readwrite");var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach(function(path){var putRequest=files.put(FS.analyzePath(path).object.contents,path);putRequest.onsuccess=function putRequest_onsuccess(){ok++;if(ok+fail==total)finish()};putRequest.onerror=function putRequest_onerror(){fail++;if(ok+fail==total)finish()}});transaction.onerror=onerror};openRequest.onerror=onerror},loadFilesFromDB:function(paths,onload,onerror){onload=onload||function(){};onerror=onerror||function(){};var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=onerror;openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;try{var transaction=db.transaction([FS.DB_STORE_NAME],"readonly")}catch(e){onerror(e);return}var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach(function(path){var getRequest=files.get(path);getRequest.onsuccess=function getRequest_onsuccess(){if(FS.analyzePath(path).exists){FS.unlink(path)}FS.createDataFile(PATH.dirname(path),PATH.basename(path),getRequest.result,true,true,true);ok++;if(ok+fail==total)finish()};getRequest.onerror=function getRequest_onerror(){fail++;if(ok+fail==total)finish()}});transaction.onerror=onerror};openRequest.onerror=onerror},absolutePath:function(){abort("FS.absolutePath has been removed; use PATH_FS.resolve instead")},createFolder:function(){abort("FS.createFolder has been removed; use FS.mkdir instead")},createLink:function(){abort("FS.createLink has been removed; use FS.symlink instead")},joinPath:function(){abort("FS.joinPath has been removed; use PATH.join instead")},mmapAlloc:function(){abort("FS.mmapAlloc has been replaced by the top level function mmapAlloc")},standardizePath:function(){abort("FS.standardizePath has been removed; use PATH.normalize instead")}};var SYSCALLS={mappings:{},DEFAULT_POLLMASK:5,calculateAt:function(dirfd,path,allowEmpty){if(path[0]==="/"){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=FS.getStream(dirfd);if(!dirstream)throw new FS.ErrnoError(8);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return PATH.join2(dir,path)},doStat:function(func,path,buf){try{var stat=func(path)}catch(e){if(e&&e.node&&PATH.normalize(path)!==PATH.normalize(FS.getPath(e.node))){return-54}throw e}HEAP32[buf>>2]=stat.dev;HEAP32[buf+4>>2]=0;HEAP32[buf+8>>2]=stat.ino;HEAP32[buf+12>>2]=stat.mode;HEAP32[buf+16>>2]=stat.nlink;HEAP32[buf+20>>2]=stat.uid;HEAP32[buf+24>>2]=stat.gid;HEAP32[buf+28>>2]=stat.rdev;HEAP32[buf+32>>2]=0;tempI64=[stat.size>>>0,(tempDouble=stat.size,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+40>>2]=tempI64[0],HEAP32[buf+44>>2]=tempI64[1];HEAP32[buf+48>>2]=4096;HEAP32[buf+52>>2]=stat.blocks;HEAP32[buf+56>>2]=stat.atime.getTime()/1e3|0;HEAP32[buf+60>>2]=0;HEAP32[buf+64>>2]=stat.mtime.getTime()/1e3|0;HEAP32[buf+68>>2]=0;HEAP32[buf+72>>2]=stat.ctime.getTime()/1e3|0;HEAP32[buf+76>>2]=0;tempI64=[stat.ino>>>0,(tempDouble=stat.ino,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+80>>2]=tempI64[0],HEAP32[buf+84>>2]=tempI64[1];return 0},doMsync:function(addr,stream,len,flags,offset){var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},doMkdir:function(path,mode){path=PATH.normalize(path);if(path[path.length-1]==="/")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0},doMknod:function(path,mode,dev){switch(mode&61440){case 32768:case 8192:case 24576:case 4096:case 49152:break;default:return-28}FS.mknod(path,mode,dev);return 0},doReadlink:function(path,buf,bufsize){if(bufsize<=0)return-28;var ret=FS.readlink(path);var len=Math.min(bufsize,lengthBytesUTF8(ret));var endChar=HEAP8[buf+len];stringToUTF8(ret,buf,bufsize+1);HEAP8[buf+len]=endChar;return len},doAccess:function(path,amode){if(amode&~7){return-28}var node;var lookup=FS.lookupPath(path,{follow:true});node=lookup.node;if(!node){return-44}var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-2}return 0},doDup:function(path,flags,suggestFD){var suggest=FS.getStream(suggestFD);if(suggest)FS.close(suggest);return FS.open(path,flags,0,suggestFD,suggestFD).fd},doReadv:function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break}return ret},doWritev:function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr}return ret},varargs:undefined,get:function(){assert(SYSCALLS.varargs!=undefined);SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},getStreamFromFD:function(fd){var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);return stream},get64:function(low,high){if(low>=0)assert(high===0);else assert(high===-1);return low}};function ___syscall__newselect(nfds,readfds,writefds,exceptfds,timeout){try{assert(nfds<=64,"nfds must be less than or equal to 64");assert(!exceptfds,"exceptfds not supported");var total=0;var srcReadLow=readfds?HEAP32[readfds>>2]:0,srcReadHigh=readfds?HEAP32[readfds+4>>2]:0;var srcWriteLow=writefds?HEAP32[writefds>>2]:0,srcWriteHigh=writefds?HEAP32[writefds+4>>2]:0;var srcExceptLow=exceptfds?HEAP32[exceptfds>>2]:0,srcExceptHigh=exceptfds?HEAP32[exceptfds+4>>2]:0;var dstReadLow=0,dstReadHigh=0;var dstWriteLow=0,dstWriteHigh=0;var dstExceptLow=0,dstExceptHigh=0;var allLow=(readfds?HEAP32[readfds>>2]:0)|(writefds?HEAP32[writefds>>2]:0)|(exceptfds?HEAP32[exceptfds>>2]:0);var allHigh=(readfds?HEAP32[readfds+4>>2]:0)|(writefds?HEAP32[writefds+4>>2]:0)|(exceptfds?HEAP32[exceptfds+4>>2]:0);var check=function(fd,low,high,val){return fd<32?low&val:high&val};for(var fd=0;fd<nfds;fd++){var mask=1<<fd%32;if(!check(fd,allLow,allHigh,mask)){continue}var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);var flags=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){flags=stream.stream_ops.poll(stream)}if(flags&1&&check(fd,srcReadLow,srcReadHigh,mask)){fd<32?dstReadLow=dstReadLow|mask:dstReadHigh=dstReadHigh|mask;total++}if(flags&4&&check(fd,srcWriteLow,srcWriteHigh,mask)){fd<32?dstWriteLow=dstWriteLow|mask:dstWriteHigh=dstWriteHigh|mask;total++}if(flags&2&&check(fd,srcExceptLow,srcExceptHigh,mask)){fd<32?dstExceptLow=dstExceptLow|mask:dstExceptHigh=dstExceptHigh|mask;total++}}if(readfds){HEAP32[readfds>>2]=dstReadLow;HEAP32[readfds+4>>2]=dstReadHigh}if(writefds){HEAP32[writefds>>2]=dstWriteLow;HEAP32[writefds+4>>2]=dstWriteHigh}if(exceptfds){HEAP32[exceptfds>>2]=dstExceptLow;HEAP32[exceptfds+4>>2]=dstExceptHigh}return total}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_chdir(path){try{path=SYSCALLS.getStr(path);FS.chdir(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var SOCKFS={mount:function(mount){Module["websocket"]=Module["websocket"]&&"object"===typeof Module["websocket"]?Module["websocket"]:{};Module["websocket"]._callbacks={};Module["websocket"]["on"]=function(event,callback){if("function"===typeof callback){this._callbacks[event]=callback}return this};Module["websocket"].emit=function(event,param){if("function"===typeof this._callbacks[event]){this._callbacks[event].call(this,param)}};return FS.createNode(null,"/",16384|511,0)},createSocket:function(family,type,protocol){type&=~526336;var streaming=type==1;if(protocol){assert(streaming==(protocol==6))}var sock={family:family,type:type,protocol:protocol,server:null,error:null,peers:{},pending:[],recv_queue:[],sock_ops:SOCKFS.websocket_sock_ops};var name=SOCKFS.nextname();var node=FS.createNode(SOCKFS.root,name,49152,0);node.sock=sock;var stream=FS.createStream({path:name,node:node,flags:2,seekable:false,stream_ops:SOCKFS.stream_ops});sock.stream=stream;return sock},getSocket:function(fd){var stream=FS.getStream(fd);if(!stream||!FS.isSocket(stream.node.mode)){return null}return stream.node.sock},stream_ops:{poll:function(stream){var sock=stream.node.sock;return sock.sock_ops.poll(sock)},ioctl:function(stream,request,varargs){var sock=stream.node.sock;return sock.sock_ops.ioctl(sock,request,varargs)},read:function(stream,buffer,offset,length,position){var sock=stream.node.sock;var msg=sock.sock_ops.recvmsg(sock,length);if(!msg){return 0}buffer.set(msg.buffer,offset);return msg.buffer.length},write:function(stream,buffer,offset,length,position){var sock=stream.node.sock;return sock.sock_ops.sendmsg(sock,buffer,offset,length)},close:function(stream){var sock=stream.node.sock;sock.sock_ops.close(sock)}},nextname:function(){if(!SOCKFS.nextname.current){SOCKFS.nextname.current=0}return"socket["+SOCKFS.nextname.current+++"]"},websocket_sock_ops:{createPeer:function(sock,addr,port){var ws;if(typeof addr==="object"){ws=addr;addr=null;port=null}if(ws){if(ws._socket){addr=ws._socket.remoteAddress;port=ws._socket.remotePort}else{var result=/ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);if(!result){throw new Error("WebSocket URL must be in the format ws(s)://address:port")}addr=result[1];port=parseInt(result[2],10)}}else{try{var runtimeConfig=Module["websocket"]&&"object"===typeof Module["websocket"];var url="ws:#".replace("#","//");if(runtimeConfig){if("string"===typeof Module["websocket"]["url"]){url=Module["websocket"]["url"]}}if(url==="ws://"||url==="wss://"){var parts=addr.split("/");url=url+parts[0]+":"+port+"/"+parts.slice(1).join("/")}var subProtocols="binary";if(runtimeConfig){if("string"===typeof Module["websocket"]["subprotocol"]){subProtocols=Module["websocket"]["subprotocol"]}}var opts=undefined;if(subProtocols!=="null"){subProtocols=subProtocols.replace(/^ +| +$/g,"").split(/ *, */);opts=ENVIRONMENT_IS_NODE?{"protocol":subProtocols.toString()}:subProtocols}if(runtimeConfig&&null===Module["websocket"]["subprotocol"]){subProtocols="null";opts=undefined}var WebSocketConstructor;if(ENVIRONMENT_IS_NODE){WebSocketConstructor=__webpack_require__(/*! ws */ "?7ba9")}else{WebSocketConstructor=WebSocket}ws=new WebSocketConstructor(url,opts);ws.binaryType="arraybuffer"}catch(e){throw new FS.ErrnoError(23)}}var peer={addr:addr,port:port,socket:ws,dgram_send_queue:[]};SOCKFS.websocket_sock_ops.addPeer(sock,peer);SOCKFS.websocket_sock_ops.handlePeerEvents(sock,peer);if(sock.type===2&&typeof sock.sport!=="undefined"){peer.dgram_send_queue.push(new Uint8Array([255,255,255,255,"p".charCodeAt(0),"o".charCodeAt(0),"r".charCodeAt(0),"t".charCodeAt(0),(sock.sport&65280)>>8,sock.sport&255]))}return peer},getPeer:function(sock,addr,port){return sock.peers[addr+":"+port]},addPeer:function(sock,peer){sock.peers[peer.addr+":"+peer.port]=peer},removePeer:function(sock,peer){delete sock.peers[peer.addr+":"+peer.port]},handlePeerEvents:function(sock,peer){var first=true;var handleOpen=function(){Module["websocket"].emit("open",sock.stream.fd);try{var queued=peer.dgram_send_queue.shift();while(queued){peer.socket.send(queued);queued=peer.dgram_send_queue.shift()}}catch(e){peer.socket.close()}};function handleMessage(data){if(typeof data==="string"){var encoder=new TextEncoder;data=encoder.encode(data)}else{assert(data.byteLength!==undefined);if(data.byteLength==0){return}else{data=new Uint8Array(data)}}var wasfirst=first;first=false;if(wasfirst&&data.length===10&&data[0]===255&&data[1]===255&&data[2]===255&&data[3]===255&&data[4]==="p".charCodeAt(0)&&data[5]==="o".charCodeAt(0)&&data[6]==="r".charCodeAt(0)&&data[7]==="t".charCodeAt(0)){var newport=data[8]<<8|data[9];SOCKFS.websocket_sock_ops.removePeer(sock,peer);peer.port=newport;SOCKFS.websocket_sock_ops.addPeer(sock,peer);return}sock.recv_queue.push({addr:peer.addr,port:peer.port,data:data});Module["websocket"].emit("message",sock.stream.fd)}if(ENVIRONMENT_IS_NODE){peer.socket.on("open",handleOpen);peer.socket.on("message",function(data,flags){if(!flags.binary){return}handleMessage(new Uint8Array(data).buffer)});peer.socket.on("close",function(){Module["websocket"].emit("close",sock.stream.fd)});peer.socket.on("error",function(error){sock.error=14;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])})}else{peer.socket.onopen=handleOpen;peer.socket.onclose=function(){Module["websocket"].emit("close",sock.stream.fd)};peer.socket.onmessage=function peer_socket_onmessage(event){handleMessage(event.data)};peer.socket.onerror=function(error){sock.error=14;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])}}},poll:function(sock){if(sock.type===1&&sock.server){return sock.pending.length?64|1:0}var mask=0;var dest=sock.type===1?SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport):null;if(sock.recv_queue.length||!dest||dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=64|1}if(!dest||dest&&dest.socket.readyState===dest.socket.OPEN){mask|=4}if(dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=16}return mask},ioctl:function(sock,request,arg){switch(request){case 21531:var bytes=0;if(sock.recv_queue.length){bytes=sock.recv_queue[0].data.length}HEAP32[arg>>2]=bytes;return 0;default:return 28}},close:function(sock){if(sock.server){try{sock.server.close()}catch(e){}sock.server=null}var peers=Object.keys(sock.peers);for(var i=0;i<peers.length;i++){var peer=sock.peers[peers[i]];try{peer.socket.close()}catch(e){}SOCKFS.websocket_sock_ops.removePeer(sock,peer)}return 0},bind:function(sock,addr,port){if(typeof sock.saddr!=="undefined"||typeof sock.sport!=="undefined"){throw new FS.ErrnoError(28)}sock.saddr=addr;sock.sport=port;if(sock.type===2){if(sock.server){sock.server.close();sock.server=null}try{sock.sock_ops.listen(sock,0)}catch(e){if(!(e instanceof FS.ErrnoError))throw e;if(e.errno!==138)throw e}}},connect:function(sock,addr,port){if(sock.server){throw new FS.ErrnoError(138)}if(typeof sock.daddr!=="undefined"&&typeof sock.dport!=="undefined"){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(dest){if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(7)}else{throw new FS.ErrnoError(30)}}}var peer=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port);sock.daddr=peer.addr;sock.dport=peer.port;throw new FS.ErrnoError(26)},listen:function(sock,backlog){if(!ENVIRONMENT_IS_NODE){throw new FS.ErrnoError(138)}if(sock.server){throw new FS.ErrnoError(28)}var WebSocketServer=(__webpack_require__(/*! ws */ "?7ba9").Server);var host=sock.saddr;sock.server=new WebSocketServer({host:host,port:sock.sport});Module["websocket"].emit("listen",sock.stream.fd);sock.server.on("connection",function(ws){if(sock.type===1){var newsock=SOCKFS.createSocket(sock.family,sock.type,sock.protocol);var peer=SOCKFS.websocket_sock_ops.createPeer(newsock,ws);newsock.daddr=peer.addr;newsock.dport=peer.port;sock.pending.push(newsock);Module["websocket"].emit("connection",newsock.stream.fd)}else{SOCKFS.websocket_sock_ops.createPeer(sock,ws);Module["websocket"].emit("connection",sock.stream.fd)}});sock.server.on("closed",function(){Module["websocket"].emit("close",sock.stream.fd);sock.server=null});sock.server.on("error",function(error){sock.error=23;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"EHOSTUNREACH: Host is unreachable"])})},accept:function(listensock){if(!listensock.server){throw new FS.ErrnoError(28)}var newsock=listensock.pending.shift();newsock.stream.flags=listensock.stream.flags;return newsock},getname:function(sock,peer){var addr,port;if(peer){if(sock.daddr===undefined||sock.dport===undefined){throw new FS.ErrnoError(53)}addr=sock.daddr;port=sock.dport}else{addr=sock.saddr||0;port=sock.sport||0}return{addr:addr,port:port}},sendmsg:function(sock,buffer,offset,length,addr,port){if(sock.type===2){if(addr===undefined||port===undefined){addr=sock.daddr;port=sock.dport}if(addr===undefined||port===undefined){throw new FS.ErrnoError(17)}}else{addr=sock.daddr;port=sock.dport}var dest=SOCKFS.websocket_sock_ops.getPeer(sock,addr,port);if(sock.type===1){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){throw new FS.ErrnoError(53)}else if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(6)}}if(ArrayBuffer.isView(buffer)){offset+=buffer.byteOffset;buffer=buffer.buffer}var data;data=buffer.slice(offset,offset+length);if(sock.type===2){if(!dest||dest.socket.readyState!==dest.socket.OPEN){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){dest=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port)}dest.dgram_send_queue.push(data);return length}}try{dest.socket.send(data);return length}catch(e){throw new FS.ErrnoError(28)}},recvmsg:function(sock,length){if(sock.type===1&&sock.server){throw new FS.ErrnoError(53)}var queued=sock.recv_queue.shift();if(!queued){if(sock.type===1){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(!dest){throw new FS.ErrnoError(53)}else if(dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){return null}else{throw new FS.ErrnoError(6)}}else{throw new FS.ErrnoError(6)}}var queuedLength=queued.data.byteLength||queued.data.length;var queuedOffset=queued.data.byteOffset||0;var queuedBuffer=queued.data.buffer||queued.data;var bytesRead=Math.min(length,queuedLength);var res={buffer:new Uint8Array(queuedBuffer,queuedOffset,bytesRead),addr:queued.addr,port:queued.port};if(sock.type===1&&bytesRead<queuedLength){var bytesRemaining=queuedLength-bytesRead;queued.data=new Uint8Array(queuedBuffer,queuedOffset+bytesRead,bytesRemaining);sock.recv_queue.unshift(queued)}return res}}};function getSocketFromFD(fd){var socket=SOCKFS.getSocket(fd);if(!socket)throw new FS.ErrnoError(8);return socket}function setErrNo(value){HEAP32[___errno_location()>>2]=value;return value}function inetNtop4(addr){return(addr&255)+"."+(addr>>8&255)+"."+(addr>>16&255)+"."+(addr>>24&255)}function inetNtop6(ints){var str="";var word=0;var longest=0;var lastzero=0;var zstart=0;var len=0;var i=0;var parts=[ints[0]&65535,ints[0]>>16,ints[1]&65535,ints[1]>>16,ints[2]&65535,ints[2]>>16,ints[3]&65535,ints[3]>>16];var hasipv4=true;var v4part="";for(i=0;i<5;i++){if(parts[i]!==0){hasipv4=false;break}}if(hasipv4){v4part=inetNtop4(parts[6]|parts[7]<<16);if(parts[5]===-1){str="::ffff:";str+=v4part;return str}if(parts[5]===0){str="::";if(v4part==="0.0.0.0")v4part="";if(v4part==="0.0.0.1")v4part="1";str+=v4part;return str}}for(word=0;word<8;word++){if(parts[word]===0){if(word-lastzero>1){len=0}lastzero=word;len++}if(len>longest){longest=len;zstart=word-longest+1}}for(word=0;word<8;word++){if(longest>1){if(parts[word]===0&&word>=zstart&&word<zstart+longest){if(word===zstart){str+=":";if(zstart===0)str+=":"}continue}}str+=Number(_ntohs(parts[word]&65535)).toString(16);str+=word<7?":":""}return str}function readSockaddr(sa,salen){var family=HEAP16[sa>>1];var port=_ntohs(HEAPU16[sa+2>>1]);var addr;switch(family){case 2:if(salen!==16){return{errno:28}}addr=HEAP32[sa+4>>2];addr=inetNtop4(addr);break;case 10:if(salen!==28){return{errno:28}}addr=[HEAP32[sa+8>>2],HEAP32[sa+12>>2],HEAP32[sa+16>>2],HEAP32[sa+20>>2]];addr=inetNtop6(addr);break;default:return{errno:5}}return{family:family,addr:addr,port:port}}function inetPton4(str){var b=str.split(".");for(var i=0;i<4;i++){var tmp=Number(b[i]);if(isNaN(tmp))return null;b[i]=tmp}return(b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0}function jstoi_q(str){return parseInt(str)}function inetPton6(str){var words;var w,offset,z;var valid6regx=/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;var parts=[];if(!valid6regx.test(str)){return null}if(str==="::"){return[0,0,0,0,0,0,0,0]}if(str.startsWith("::")){str=str.replace("::","Z:")}else{str=str.replace("::",":Z:")}if(str.indexOf(".")>0){str=str.replace(new RegExp("[.]","g"),":");words=str.split(":");words[words.length-4]=jstoi_q(words[words.length-4])+jstoi_q(words[words.length-3])*256;words[words.length-3]=jstoi_q(words[words.length-2])+jstoi_q(words[words.length-1])*256;words=words.slice(0,words.length-2)}else{words=str.split(":")}offset=0;z=0;for(w=0;w<words.length;w++){if(typeof words[w]==="string"){if(words[w]==="Z"){for(z=0;z<8-words.length+1;z++){parts[w+z]=0}offset=z-1}else{parts[w+offset]=_htons(parseInt(words[w],16))}}else{parts[w+offset]=words[w]}}return[parts[1]<<16|parts[0],parts[3]<<16|parts[2],parts[5]<<16|parts[4],parts[7]<<16|parts[6]]}var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:function(name){var res=inetPton4(name);if(res!==null){return name}res=inetPton6(name);if(res!==null){return name}var addr;if(DNS.address_map.addrs[name]){addr=DNS.address_map.addrs[name]}else{var id=DNS.address_map.id++;assert(id<65535,"exceeded max address mappings of 65535");addr="172.29."+(id&255)+"."+(id&65280);DNS.address_map.names[addr]=name;DNS.address_map.addrs[name]=addr}return addr},lookup_addr:function(addr){if(DNS.address_map.names[addr]){return DNS.address_map.names[addr]}return null}};function getSocketAddress(addrp,addrlen,allowNull){if(allowNull&&addrp===0)return null;var info=readSockaddr(addrp,addrlen);if(info.errno)throw new FS.ErrnoError(info.errno);info.addr=DNS.lookup_addr(info.addr)||info.addr;return info}function ___syscall_connect(fd,addr,addrlen){try{var sock=getSocketFromFD(fd);var info=getSocketAddress(addr,addrlen);sock.sock_ops.connect(sock,info.addr,info.port);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=SYSCALLS.get();if(arg<0){return-28}var newStream;newStream=FS.open(stream.path,stream.flags,0,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=SYSCALLS.get();stream.flags|=arg;return 0}case 12:{var arg=SYSCALLS.get();var offset=0;HEAP16[arg+offset>>1]=2;return 0}case 13:case 14:return 0;case 16:case 8:return-28;case 9:setErrNo(28);return-1;default:{return-28}}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_fstat64(fd,buf){try{var stream=SYSCALLS.getStreamFromFD(fd);return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_getcwd(buf,size){try{if(size===0)return-28;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd);if(size<cwdLengthInBytes+1)return-68;stringToUTF8(cwd,buf,size);return buf}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:case 21505:{if(!stream.tty)return-59;return 0}case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:{if(!stream.tty)return-59;return 0}case 21519:{if(!stream.tty)return-59;var argp=SYSCALLS.get();HEAP32[argp>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=SYSCALLS.get();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;return 0}case 21524:{if(!stream.tty)return-59;return 0}default:abort("bad ioctl syscall "+op)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_mkdir(path,mode){try{path=SYSCALLS.getStr(path);return SYSCALLS.doMkdir(path,mode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_open(path,flags,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(path);var mode=varargs?SYSCALLS.get():0;var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_readlink(path,buf,bufsize){try{path=SYSCALLS.getStr(path);return SYSCALLS.doReadlink(path,buf,bufsize)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_socket(domain,type,protocol){try{var sock=SOCKFS.createSocket(domain,type,protocol);assert(sock.stream.fd<64);return sock.stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___syscall_stat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function __embind_register_bigint(primitiveType,name,size,minRange,maxRange){}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i)}embind_charCodes=codes}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]]}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return"_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return"_"+name}else{return name}}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return new Function("body","return function "+name+"() {\n"+'    "use strict";'+"    return body.apply(this, arguments);\n"+"};\n")(body)}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"")}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else{return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count")}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i])}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach(function(dt,i){if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt]}else{unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[]}awaitingDependencies[dt].push(function(){typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters)}})}});if(0===unregisteredTypes.length){onComplete(typeConverters)}}function registerType(rawType,registeredInstance,options){options=options||{};if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer')}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else{throwBindingError("Cannot register type '"+name+"' twice")}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(function(cb){cb()})}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return!!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8}else if(size===2){heap=HEAP16}else if(size===4){heap=HEAP32}else{throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>shift])},destructorFunction:null})}function ClassHandle_isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass}return leftClass===rightClass&&left===right}function shallowCopyInternalPointer(o){return{count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType}}function throwInstanceAlreadyDeleted(obj){function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted")}var finalizationRegistry=false;function detachFinalizer(handle){}function runDestructor($$){if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr)}else{$$.ptrType.registeredClass.rawDestructor($$.ptr)}}function releaseClassHandle($$){$$.count.value-=1;var toDelete=0===$$.count.value;if(toDelete){runDestructor($$)}}function attachFinalizer(handle){if("undefined"===typeof FinalizationRegistry){attachFinalizer=function(handle){return handle};return handle}finalizationRegistry=new FinalizationRegistry(function(info){console.warn(info.leakWarning.stack.replace(/^Error: /,""));releaseClassHandle(info.$$)});attachFinalizer=function(handle){var $$=handle.$$;var info={$$:$$};var cls=$$.ptrType.registeredClass;info.leakWarning=new Error("Embind found a leaked C++ instance "+cls.name+" <0x"+$$.ptr.toString(16)+">.\n"+"We'll free it automatically in this case, but this functionality is not reliable across various environments.\n"+"Make sure to invoke .delete() manually once you're done with the instance instead.\n"+"Originally allocated");if("captureStackTrace"in Error){Error.captureStackTrace(info.leakWarning,cls.constructor)}finalizationRegistry.register(handle,info,handle);return handle};detachFinalizer=function(handle){finalizationRegistry.unregister(handle)};return attachFinalizer(handle)}function ClassHandle_clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else{var clone=attachFinalizer(Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}}));clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}}function ClassHandle_delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion")}detachFinalizer(this);releaseClassHandle(this.$$);if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined}}function ClassHandle_isDeleted(){return!this.$$.ptr}var delayFunction=undefined;var deletionQueue=[];function flushPendingDeletes(){while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]()}}function ClassHandle_deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this)}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion")}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes)}this.$$.deleteScheduled=true;return this}function init_ClassHandle(){ClassHandle.prototype["isAliasOf"]=ClassHandle_isAliasOf;ClassHandle.prototype["clone"]=ClassHandle_clone;ClassHandle.prototype["delete"]=ClassHandle_delete;ClassHandle.prototype["isDeleted"]=ClassHandle_isDeleted;ClassHandle.prototype["deleteLater"]=ClassHandle_deleteLater}function ClassHandle(){}var registeredPointers={};function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!")}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice")}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!")}Module[name].overloadTable[numArguments]=value}else{Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments}}}function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[]}function upcastPointer(ptr,ptrClass,desiredClass){while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError("Expected null or instance of "+desiredClass.name+", got an instance of "+ptrClass.name)}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass}return ptr}function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name)}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name)}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name)}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name)}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr)}return ptr}else{return 0}}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name)}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name)}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name)}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal")}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr}else{throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name)}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr}else{var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,Emval.toHandle(function(){clonedHandle["delete"]()}));if(destructors!==null){destructors.push(this.rawDestructor,ptr)}}break;default:throwBindingError("Unsupporting sharing policy")}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name)}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name)}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name)}if(handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+handle.$$.ptrType.name+" to parameter type "+this.name)}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>2])}function RegisteredPointer_getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr)}return ptr}function RegisteredPointer_destructor(ptr){if(this.rawDestructor){this.rawDestructor(ptr)}}function RegisteredPointer_deleteObject(handle){if(handle!==null){handle["delete"]()}}function downcastPointer(ptr,ptrClass,desiredClass){if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)}function getInheritedInstanceCount(){return Object.keys(registeredInstances).length}function getLiveInheritedInstances(){var rv=[];for(var k in registeredInstances){if(registeredInstances.hasOwnProperty(k)){rv.push(registeredInstances[k])}}return rv}function setDelayFunction(fn){delayFunction=fn;if(deletionQueue.length&&delayFunction){delayFunction(flushPendingDeletes)}}function init_embind(){Module["getInheritedInstanceCount"]=getInheritedInstanceCount;Module["getLiveInheritedInstances"]=getLiveInheritedInstances;Module["flushPendingDeletes"]=flushPendingDeletes;Module["setDelayFunction"]=setDelayFunction}var registeredInstances={};function getBasestPointer(class_,ptr){if(ptr===undefined){throwBindingError("ptr should not be undefined")}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass}return ptr}function getInheritedInstance(class_,ptr){ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]}function makeClassHandle(prototype,record){if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType")}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified")}record.count={value:1};return attachFinalizer(Object.create(prototype,{$$:{value:record}}))}function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else{var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr:ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType}else{toType=registeredPointerRecord.pointerType}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else{return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}function init_RegisteredPointer(){RegisteredPointer.prototype.getPointee=RegisteredPointer_getPointee;RegisteredPointer.prototype.destructor=RegisteredPointer_destructor;RegisteredPointer.prototype["argPackAdvance"]=8;RegisteredPointer.prototype["readValueFromPointer"]=simpleReadValueFromPointer;RegisteredPointer.prototype["deleteObject"]=RegisteredPointer_deleteObject;RegisteredPointer.prototype["fromWireType"]=RegisteredPointer_fromWireType}function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this["toWireType"]=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null}else{this["toWireType"]=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null}}else{this["toWireType"]=genericPointerToWireType}}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol")}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value}else{Module[name]=value;Module[name].argCount=numArguments}}function dynCallLegacy(sig,ptr,args){assert("dynCall_"+sig in Module,"bad function pointer type - no table for sig '"+sig+"'");if(args&&args.length){assert(args.length===sig.substring(1).replace(/j/g,"--").length)}else{assert(sig.length==1)}var f=Module["dynCall_"+sig];return args&&args.length?f.apply(null,[ptr].concat(args)):f.call(null,ptr)}function dynCall(sig,ptr,args){if(sig.includes("j")){return dynCallLegacy(sig,ptr,args)}assert(getWasmTableEntry(ptr),"missing table entry in dynCall: "+ptr);return getWasmTableEntry(ptr).apply(null,args)}function getDynCaller(sig,ptr){assert(sig.includes("j"),"getDynCaller should only be called with i64 sigs");var argCache=[];return function(){argCache.length=arguments.length;for(var i=0;i<arguments.length;i++){argCache[i]=arguments[i]}return dynCall(sig,ptr,argCache)}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(){if(signature.includes("j")){return getDynCaller(signature,rawFunction)}return getWasmTableEntry(rawFunction)}var fp=makeDynCaller();if(typeof fp!=="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction)}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_class(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor){name=readLatin1String(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);if(upcast){upcast=embind__requireFunction(upcastSignature,upcast)}if(downcast){downcast=embind__requireFunction(downcastSignature,downcast)}rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError("Cannot construct "+name+" due to unbound types",[baseClassRawType])});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],function(base){base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype}else{basePrototype=ClassHandle.prototype}var constructor=createNamedFunction(legalFunctionName,function(){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError("Use 'new' to construct "+name)}if(undefined===registeredClass.constructor_body){throw new BindingError(name+" has no accessible constructor")}var body=registeredClass.constructor_body[arguments.length];if(undefined===body){throw new BindingError("Tried to invoke ctor of "+name+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(registeredClass.constructor_body).toString()+") parameters instead!")}return body.apply(this,arguments)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return[referenceConverter,pointerConverter,constPointerConverter]})}function new_(constructor,argumentList){if(!(constructor instanceof Function)){throw new TypeError("new_ called with constructor type "+typeof constructor+" which is not a function")}var dummy=createNamedFunction(constructor.name||"unknownFunctionName",function(){});dummy.prototype=constructor.prototype;var obj=new dummy;var r=constructor.apply(obj,argumentList);return r instanceof Object?r:obj}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr)}}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var argsList="";var argsListWired="";for(var i=0;i<argCount-2;++i){argsList+=(i!==0?", ":"")+"arg"+i;argsListWired+=(i!==0?", ":"")+"arg"+i+"Wired"}var invokerFnBody="return function "+makeLegalFunctionName(humanName)+"("+argsList+") {\n"+"if (arguments.length !== "+(argCount-2)+") {\n"+"throwBindingError('function "+humanName+" called with ' + arguments.length + ' arguments, expected "+(argCount-2)+" args!');\n"+"}\n";if(needsDestructorStack){invokerFnBody+="var destructors = [];\n"}var dtorStack=needsDestructorStack?"destructors":"null";var args1=["throwBindingError","invoker","fn","runDestructors","retType","classParam"];var args2=[throwBindingError,cppInvokerFunc,cppTargetFunc,runDestructors,argTypes[0],argTypes[1]];if(isClassMethodFunc){invokerFnBody+="var thisWired = classParam.toWireType("+dtorStack+", this);\n"}for(var i=0;i<argCount-2;++i){invokerFnBody+="var arg"+i+"Wired = argType"+i+".toWireType("+dtorStack+", arg"+i+"); // "+argTypes[i+2].name+"\n";args1.push("argType"+i);args2.push(argTypes[i+2])}if(isClassMethodFunc){argsListWired="thisWired"+(argsListWired.length>0?", ":"")+argsListWired}invokerFnBody+=(returns?"var rv = ":"")+"invoker(fn"+(argsListWired.length>0?", ":"")+argsListWired+");\n";if(needsDestructorStack){invokerFnBody+="runDestructors(destructors);\n"}else{for(var i=isClassMethodFunc?1:2;i<argTypes.length;++i){var paramName=i===1?"thisWired":"arg"+(i-2)+"Wired";if(argTypes[i].destructorFunction!==null){invokerFnBody+=paramName+"_dtor("+paramName+"); // "+argTypes[i].name+"\n";args1.push(paramName+"_dtor");args2.push(argTypes[i].destructorFunction)}}}if(returns){invokerFnBody+="var ret = retType.fromWireType(rv);\n"+"return ret;\n"}else{}invokerFnBody+="}\n";args1.push(invokerFnBody);var invokerFunction=new_(Function,args1).apply(null,args2);return invokerFunction}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAP32[(firstElement>>2)+i])}return array}function __embind_register_class_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,fn){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes)}if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)]}var proto=classType.registeredClass.constructor;if(undefined===proto[methodName]){unboundTypesHandler.argCount=argCount-1;proto[methodName]=unboundTypesHandler}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-1]=unboundTypesHandler}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));var func=craftInvokerFunction(humanName,invokerArgsArray,null,rawInvoker,fn);if(undefined===proto[methodName].overloadTable){func.argCount=argCount-1;proto[methodName]=func}else{proto[methodName].overloadTable[argCount-1]=func}return[]});return[]})}function __embind_register_class_constructor(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor){assert(argCount>0);var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName="constructor "+classType.name;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[]}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError("Cannot register multiple constructors with identical number of parameters ("+(argCount-1)+") for class '"+classType.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!")}classType.registeredClass.constructor_body[argCount-1]=function unboundTypeHandler(){throwUnboundTypeError("Cannot construct "+classType.name+" due to unbound types",rawArgTypes)};whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){argTypes.splice(1,0,null);classType.registeredClass.constructor_body[argCount-1]=craftInvokerFunction(humanName,argTypes,null,invoker,rawConstructor);return[]});return[]})}function __embind_register_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)]}if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName)}function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes)}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler}else{ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction}else{proto[methodName].overloadTable[argCount-2]=memberFunction}return[]});return[]})}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle)}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval}var Emval={toValue:function(handle){if(!handle){throwBindingError("Cannot use deleted val. handle = "+handle)}return emval_handle_array[handle].value},toHandle:function(value){switch(value){case undefined:{return 1}case null:{return 2}case true:{return 3}case false:{return 4}default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}};function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=Emval.toValue(handle);__emval_decref(handle);return rv},"toWireType":function(destructors,value){return Emval.toHandle(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null})}function _embind_repr(v){if(v===null){return"null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else{return""+v}}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null})}function __embind_register_function(name,argCount,rawArgTypesAddr,signature,rawInvoker,fn){var argTypes=heap32VectorToArray(argCount,rawArgTypesAddr);name=readLatin1String(name);rawInvoker=embind__requireFunction(signature,rawInvoker);exposePublicSymbol(name,function(){throwUnboundTypeError("Cannot call "+name+" due to unbound types",argTypes)},argCount-1);whenDependentTypesAreResolved([],argTypes,function(argTypes){var invokerArgsArray=[argTypes[0],null].concat(argTypes.slice(1));replacePublicSymbol(name,craftInvokerFunction(name,invokerArgsArray,null,rawInvoker,fn),argCount-1);return[]})}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer]}:function readU8FromPointer(pointer){return HEAPU8[pointer]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295}var shift=getShiftFromSize(size);var fromWireType=function(value){return value};if(minRange===0){var bitshift=32-8*size;fromWireType=function(value){return value<<bitshift>>>bitshift}}var isUnsignedType=name.includes("unsigned");registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}if(value<minRange||value>maxRange){throw new TypeError('Passing a number "'+_embind_repr(value)+'" from JS side to C/C++ side to an argument of type "'+name+'", which is outside the valid range ['+minRange+", "+maxRange+"]!")}return isUnsignedType?value>>>0:value|0},"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null})}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle];var data=heap[handle+1];return new TA(buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true})}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var str;if(stdStringIsUTF8){var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i;if(i==length||HEAPU8[currentBytePtr]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+1}}}else{var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[value+4+i])}str=a.join("")}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value)}var getLength;var valueIsOfTypeString=typeof value==="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string")}if(stdStringIsUTF8&&valueIsOfTypeString){getLength=function(){return lengthBytesUTF8(value)}}else{getLength=function(){return value.length}}var length=getLength();var ptr=_malloc(4+length+1);HEAPU32[ptr>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr+4,length+1)}else{if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits")}HEAPU8[ptr+4+i]=charCode}}else{for(var i=0;i<length;++i){HEAPU8[ptr+4+i]=value[i]}}}if(destructors!==null){destructors.push(_free,ptr)}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr)}})}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=function(){return HEAPU16};shift=1}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=function(){return HEAPU32};shift=2}registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment}else{str+=String.fromCharCode(0);str+=stringSegment}decodeStartPtr=currentBytePtr+charSize}}_free(value);return str},"toWireType":function(destructors,value){if(!(typeof value==="string")){throwBindingError("Cannot pass non-string to C++ string type "+name)}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr)}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr)}})}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}})}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1}}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType))}return impl}function __emval_take_value(type,argv){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](argv);return Emval.toHandle(v)}function _abort(){abort("native code called abort()")}var readAsmConstArgsArray=[];function readAsmConstArgs(sigPtr,buf){assert(Array.isArray(readAsmConstArgsArray));assert(buf%16==0);readAsmConstArgsArray.length=0;var ch;buf>>=2;while(ch=HEAPU8[sigPtr++]){assert(ch===100||ch===102||ch===105);var readAsmConstArgsDouble=ch<105;if(readAsmConstArgsDouble&&buf&1)buf++;readAsmConstArgsArray.push(readAsmConstArgsDouble?HEAPF64[buf++>>1]:HEAP32[buf]);++buf}return readAsmConstArgsArray}function _emscripten_asm_const_int(code,sigPtr,argbuf){var args=readAsmConstArgs(sigPtr,argbuf);if(!ASM_CONSTS.hasOwnProperty(code))abort("No EM_ASM constant found at address "+code);return ASM_CONSTS[code].apply(null,args)}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){err("emscripten_realloc_buffer: Attempted to grow heap from "+buffer.byteLength+" bytes to "+size+" bytes, but got error: "+e)}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;assert(requestedSize>oldSize);var maxHeapSize=2147483648;if(requestedSize>maxHeapSize){err("Cannot enlarge memory, asked to go up to "+requestedSize+" bytes, but the limit is "+maxHeapSize+" bytes!");return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}err("Failed to grow the heap from "+oldSize+" bytes to "+newSize+" bytes, not enough memory!");return false}var ENV={};function getExecutableName(){return thisProgram||"./this.program"}function getEnvStrings(){if(!getEnvStrings.strings){var lang=(typeof navigator==="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={"USER":"web_user","LOGNAME":"web_user","PATH":"/","PWD":"/","HOME":"/home/web_user","LANG":lang,"_":getExecutableName()};for(var x in ENV){if(ENV[x]===undefined)delete env[x];else env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(x+"="+env[x])}getEnvStrings.strings=strings}return getEnvStrings.strings}function _environ_get(__environ,environ_buf){var bufSize=0;getEnvStrings().forEach(function(string,i){var ptr=environ_buf+bufSize;HEAP32[__environ+i*4>>2]=ptr;writeAsciiToMemory(string,ptr);bufSize+=string.length+1});return 0}function _environ_sizes_get(penviron_count,penviron_buf_size){var strings=getEnvStrings();HEAP32[penviron_count>>2]=strings.length;var bufSize=0;strings.forEach(function(string){bufSize+=string.length+1});HEAP32[penviron_buf_size>>2]=bufSize;return 0}function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_fdstat_get(fd,pbuf){try{var stream=SYSCALLS.getStreamFromFD(fd);var type=stream.tty?2:FS.isDir(stream.mode)?3:FS.isLink(stream.mode)?7:4;HEAP8[pbuf>>0]=type;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doReadv(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){try{var stream=SYSCALLS.getStreamFromFD(fd);var HIGH_OFFSET=4294967296;var offset=offset_high*HIGH_OFFSET+(offset_low>>>0);var DOUBLE_LIMIT=9007199254740992;if(offset<=-DOUBLE_LIMIT||offset>=DOUBLE_LIMIT){return-61}FS.llseek(stream,offset,whence);tempI64=[stream.position>>>0,(tempDouble=stream.position,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[newOffset>>2]=tempI64[0],HEAP32[newOffset+4>>2]=tempI64[1];if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doWritev(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function getHostByName(name){var ret=_malloc(20);var nameBuf=_malloc(name.length+1);stringToUTF8(name,nameBuf,name.length+1);HEAP32[ret>>2]=nameBuf;var aliasesBuf=_malloc(4);HEAP32[aliasesBuf>>2]=0;HEAP32[ret+4>>2]=aliasesBuf;var afinet=2;HEAP32[ret+8>>2]=afinet;HEAP32[ret+12>>2]=4;var addrListBuf=_malloc(12);HEAP32[addrListBuf>>2]=addrListBuf+8;HEAP32[addrListBuf+4>>2]=0;HEAP32[addrListBuf+8>>2]=inetPton4(DNS.lookup_name(name));HEAP32[ret+16>>2]=addrListBuf;return ret}function _gethostbyname(name){return getHostByName(UTF8ToString(name))}function _gettimeofday(ptr){var now=Date.now();HEAP32[ptr>>2]=now/1e3|0;HEAP32[ptr+4>>2]=now%1e3*1e3|0;return 0}function _setTempRet0(val){setTempRet0(val)}function __isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}function __arraySum(array,index){var sum=0;for(var i=0;i<=index;sum+=array[i++]){}return sum}var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date,days){var newDate=new Date(date.getTime());while(days>0){var leap=__isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate}function _strftime(s,maxsize,format,tm){var tm_zone=HEAP32[tm+40>>2];var date={tm_sec:HEAP32[tm>>2],tm_min:HEAP32[tm+4>>2],tm_hour:HEAP32[tm+8>>2],tm_mday:HEAP32[tm+12>>2],tm_mon:HEAP32[tm+16>>2],tm_year:HEAP32[tm+20>>2],tm_wday:HEAP32[tm+24>>2],tm_yday:HEAP32[tm+28>>2],tm_isdst:HEAP32[tm+32>>2],tm_gmtoff:HEAP32[tm+36>>2],tm_zone:tm_zone?UTF8ToString(tm_zone):""};var pattern=UTF8ToString(format);var EXPANSION_RULES_1={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_1[rule])}var WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];function leadingSomething(value,digits,character){var str=typeof value==="number"?value.toString():value||"";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,"0")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}else{return thisDate.getFullYear()}}else{return thisDate.getFullYear()-1}}var EXPANSION_RULES_2={"%a":function(date){return WEEKDAYS[date.tm_wday].substring(0,3)},"%A":function(date){return WEEKDAYS[date.tm_wday]},"%b":function(date){return MONTHS[date.tm_mon].substring(0,3)},"%B":function(date){return MONTHS[date.tm_mon]},"%C":function(date){var year=date.tm_year+1900;return leadingNulls(year/100|0,2)},"%d":function(date){return leadingNulls(date.tm_mday,2)},"%e":function(date){return leadingSomething(date.tm_mday,2," ")},"%g":function(date){return getWeekBasedYear(date).toString().substring(2)},"%G":function(date){return getWeekBasedYear(date)},"%H":function(date){return leadingNulls(date.tm_hour,2)},"%I":function(date){var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)},"%j":function(date){return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900)?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,date.tm_mon-1),3)},"%m":function(date){return leadingNulls(date.tm_mon+1,2)},"%M":function(date){return leadingNulls(date.tm_min,2)},"%n":function(){return"\n"},"%p":function(date){if(date.tm_hour>=0&&date.tm_hour<12){return"AM"}else{return"PM"}},"%S":function(date){return leadingNulls(date.tm_sec,2)},"%t":function(){return"\t"},"%u":function(date){return date.tm_wday||7},"%U":function(date){var janFirst=new Date(date.tm_year+1900,0,1);var firstSunday=janFirst.getDay()===0?janFirst:__addDays(janFirst,7-janFirst.getDay());var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstSunday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstSundayUntilEndJanuary=31-firstSunday.getDate();var days=firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstSunday,janFirst)===0?"01":"00"},"%V":function(date){var janFourthThisYear=new Date(date.tm_year+1900,0,4);var janFourthNextYear=new Date(date.tm_year+1901,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);var endDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);if(compareByDay(endDate,firstWeekStartThisYear)<0){return"53"}if(compareByDay(firstWeekStartNextYear,endDate)<=0){return"01"}var daysDifference;if(firstWeekStartThisYear.getFullYear()<date.tm_year+1900){daysDifference=date.tm_yday+32-firstWeekStartThisYear.getDate()}else{daysDifference=date.tm_yday+1-firstWeekStartThisYear.getDate()}return leadingNulls(Math.ceil(daysDifference/7),2)},"%w":function(date){return date.tm_wday},"%W":function(date){var janFirst=new Date(date.tm_year,0,1);var firstMonday=janFirst.getDay()===1?janFirst:__addDays(janFirst,janFirst.getDay()===0?1:7-janFirst.getDay()+1);var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstMonday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstMondayUntilEndJanuary=31-firstMonday.getDate();var days=firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstMonday,janFirst)===0?"01":"00"},"%y":function(date){return(date.tm_year+1900).toString().substring(2)},"%Y":function(date){return date.tm_year+1900},"%z":function(date){var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?"+":"-")+String("0000"+off).slice(-4)},"%Z":function(date){return date.tm_zone},"%%":function(){return"%"}};for(var rule in EXPANSION_RULES_2){if(pattern.includes(rule)){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_2[rule](date))}}var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1}function _strftime_l(s,maxsize,format,tm){return _strftime(s,maxsize,format,tm)}function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}var FSNode=function(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev};var readMode=292|73;var writeMode=146;Object.defineProperties(FSNode.prototype,{read:{get:function(){return(this.mode&readMode)===readMode},set:function(val){val?this.mode|=readMode:this.mode&=~readMode}},write:{get:function(){return(this.mode&writeMode)===writeMode},set:function(val){val?this.mode|=writeMode:this.mode&=~writeMode}},isFolder:{get:function(){return FS.isDir(this.mode)}},isDevice:{get:function(){return FS.isChrdev(this.mode)}}});FS.FSNode=FSNode;FS.staticInit();Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;Module["FS_createPreloadedFile"]=FS.createPreloadedFile;Module["FS_createLazyFile"]=FS.createLazyFile;Module["FS_createDevice"]=FS.createDevice;Module["FS_unlink"]=FS.unlink;ERRNO_CODES={"EPERM":63,"ENOENT":44,"ESRCH":71,"EINTR":27,"EIO":29,"ENXIO":60,"E2BIG":1,"ENOEXEC":45,"EBADF":8,"ECHILD":12,"EAGAIN":6,"EWOULDBLOCK":6,"ENOMEM":48,"EACCES":2,"EFAULT":21,"ENOTBLK":105,"EBUSY":10,"EEXIST":20,"EXDEV":75,"ENODEV":43,"ENOTDIR":54,"EISDIR":31,"EINVAL":28,"ENFILE":41,"EMFILE":33,"ENOTTY":59,"ETXTBSY":74,"EFBIG":22,"ENOSPC":51,"ESPIPE":70,"EROFS":69,"EMLINK":34,"EPIPE":64,"EDOM":18,"ERANGE":68,"ENOMSG":49,"EIDRM":24,"ECHRNG":106,"EL2NSYNC":156,"EL3HLT":107,"EL3RST":108,"ELNRNG":109,"EUNATCH":110,"ENOCSI":111,"EL2HLT":112,"EDEADLK":16,"ENOLCK":46,"EBADE":113,"EBADR":114,"EXFULL":115,"ENOANO":104,"EBADRQC":103,"EBADSLT":102,"EDEADLOCK":16,"EBFONT":101,"ENOSTR":100,"ENODATA":116,"ETIME":117,"ENOSR":118,"ENONET":119,"ENOPKG":120,"EREMOTE":121,"ENOLINK":47,"EADV":122,"ESRMNT":123,"ECOMM":124,"EPROTO":65,"EMULTIHOP":36,"EDOTDOT":125,"EBADMSG":9,"ENOTUNIQ":126,"EBADFD":127,"EREMCHG":128,"ELIBACC":129,"ELIBBAD":130,"ELIBSCN":131,"ELIBMAX":132,"ELIBEXEC":133,"ENOSYS":52,"ENOTEMPTY":55,"ENAMETOOLONG":37,"ELOOP":32,"EOPNOTSUPP":138,"EPFNOSUPPORT":139,"ECONNRESET":15,"ENOBUFS":42,"EAFNOSUPPORT":5,"EPROTOTYPE":67,"ENOTSOCK":57,"ENOPROTOOPT":50,"ESHUTDOWN":140,"ECONNREFUSED":14,"EADDRINUSE":3,"ECONNABORTED":13,"ENETUNREACH":40,"ENETDOWN":38,"ETIMEDOUT":73,"EHOSTDOWN":142,"EHOSTUNREACH":23,"EINPROGRESS":26,"EALREADY":7,"EDESTADDRREQ":17,"EMSGSIZE":35,"EPROTONOSUPPORT":66,"ESOCKTNOSUPPORT":137,"EADDRNOTAVAIL":4,"ENETRESET":39,"EISCONN":30,"ENOTCONN":53,"ETOOMANYREFS":141,"EUSERS":136,"EDQUOT":19,"ESTALE":72,"ENOTSUP":138,"ENOMEDIUM":148,"EILSEQ":25,"EOVERFLOW":61,"ECANCELED":11,"ENOTRECOVERABLE":56,"EOWNERDEAD":62,"ESTRPIPE":135};embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_ClassHandle();init_RegisteredPointer();init_embind();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");init_emval();var ASSERTIONS=true;function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}var decodeBase64=typeof atob==="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output};function intArrayFromBase64(s){if(typeof ENVIRONMENT_IS_NODE==="boolean"&&ENVIRONMENT_IS_NODE){var buf=Buffer.from(s,"base64");return new Uint8Array(buf["buffer"],buf["byteOffset"],buf["byteLength"])}try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}var asmLibraryArg={"__assert_fail":___assert_fail,"__cxa_allocate_exception":___cxa_allocate_exception,"__cxa_atexit":___cxa_atexit,"__cxa_throw":___cxa_throw,"__localtime_r":___localtime_r,"__syscall__newselect":___syscall__newselect,"__syscall_chdir":___syscall_chdir,"__syscall_connect":___syscall_connect,"__syscall_fcntl64":___syscall_fcntl64,"__syscall_fstat64":___syscall_fstat64,"__syscall_getcwd":___syscall_getcwd,"__syscall_ioctl":___syscall_ioctl,"__syscall_mkdir":___syscall_mkdir,"__syscall_open":___syscall_open,"__syscall_readlink":___syscall_readlink,"__syscall_socket":___syscall_socket,"__syscall_stat64":___syscall_stat64,"_embind_register_bigint":__embind_register_bigint,"_embind_register_bool":__embind_register_bool,"_embind_register_class":__embind_register_class,"_embind_register_class_class_function":__embind_register_class_class_function,"_embind_register_class_constructor":__embind_register_class_constructor,"_embind_register_class_function":__embind_register_class_function,"_embind_register_emval":__embind_register_emval,"_embind_register_float":__embind_register_float,"_embind_register_function":__embind_register_function,"_embind_register_integer":__embind_register_integer,"_embind_register_memory_view":__embind_register_memory_view,"_embind_register_std_string":__embind_register_std_string,"_embind_register_std_wstring":__embind_register_std_wstring,"_embind_register_void":__embind_register_void,"_emval_decref":__emval_decref,"_emval_incref":__emval_incref,"_emval_take_value":__emval_take_value,"abort":_abort,"connectMemory":connectMemory,"emscripten_asm_const_int":_emscripten_asm_const_int,"emscripten_memcpy_big":_emscripten_memcpy_big,"emscripten_resize_heap":_emscripten_resize_heap,"environ_get":_environ_get,"environ_sizes_get":_environ_sizes_get,"fd_close":_fd_close,"fd_fdstat_get":_fd_fdstat_get,"fd_read":_fd_read,"fd_seek":_fd_seek,"fd_write":_fd_write,"gethostbyname":_gethostbyname,"gettimeofday":_gettimeofday,"setTempRet0":_setTempRet0,"strftime":_strftime,"strftime_l":_strftime_l,"time":_time};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=createExportWrapper("__wasm_call_ctors");var _expandCDSPFromString=Module["_expandCDSPFromString"]=createExportWrapper("expandCDSPFromString");var _generateCAuxFilesFromString=Module["_generateCAuxFilesFromString"]=createExportWrapper("generateCAuxFilesFromString");var _freeCMemory=Module["_freeCMemory"]=createExportWrapper("freeCMemory");var _free=Module["_free"]=createExportWrapper("free");var _getCLibFaustVersion=Module["_getCLibFaustVersion"]=createExportWrapper("getCLibFaustVersion");var _getErrorAfterException=Module["_getErrorAfterException"]=createExportWrapper("getErrorAfterException");var _cleanupAfterException=Module["_cleanupAfterException"]=createExportWrapper("cleanupAfterException");var _malloc=Module["_malloc"]=createExportWrapper("malloc");var ___errno_location=Module["___errno_location"]=createExportWrapper("__errno_location");var _htons=Module["_htons"]=createExportWrapper("htons");var _deleteAllWasmCDSPFactories=Module["_deleteAllWasmCDSPFactories"]=createExportWrapper("deleteAllWasmCDSPFactories");var _createWasmCDSPFactoryFromString=Module["_createWasmCDSPFactoryFromString"]=createExportWrapper("createWasmCDSPFactoryFromString");var _getWasmCModule=Module["_getWasmCModule"]=createExportWrapper("getWasmCModule");var _getWasmCModuleSize=Module["_getWasmCModuleSize"]=createExportWrapper("getWasmCModuleSize");var _getWasmCHelpers=Module["_getWasmCHelpers"]=createExportWrapper("getWasmCHelpers");var _freeWasmCModule=Module["_freeWasmCModule"]=createExportWrapper("freeWasmCModule");var ___getTypeName=Module["___getTypeName"]=createExportWrapper("__getTypeName");var ___embind_register_native_and_builtin_types=Module["___embind_register_native_and_builtin_types"]=createExportWrapper("__embind_register_native_and_builtin_types");var _ntohs=Module["_ntohs"]=createExportWrapper("ntohs");var _fflush=Module["_fflush"]=createExportWrapper("fflush");var __get_tzname=Module["__get_tzname"]=createExportWrapper("_get_tzname");var __get_daylight=Module["__get_daylight"]=createExportWrapper("_get_daylight");var __get_timezone=Module["__get_timezone"]=createExportWrapper("_get_timezone");var stackSave=Module["stackSave"]=createExportWrapper("stackSave");var stackRestore=Module["stackRestore"]=createExportWrapper("stackRestore");var stackAlloc=Module["stackAlloc"]=createExportWrapper("stackAlloc");var _emscripten_stack_init=Module["_emscripten_stack_init"]=function(){return(_emscripten_stack_init=Module["_emscripten_stack_init"]=Module["asm"]["emscripten_stack_init"]).apply(null,arguments)};var _emscripten_stack_get_free=Module["_emscripten_stack_get_free"]=function(){return(_emscripten_stack_get_free=Module["_emscripten_stack_get_free"]=Module["asm"]["emscripten_stack_get_free"]).apply(null,arguments)};var _emscripten_stack_get_end=Module["_emscripten_stack_get_end"]=function(){return(_emscripten_stack_get_end=Module["_emscripten_stack_get_end"]=Module["asm"]["emscripten_stack_get_end"]).apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=createExportWrapper("dynCall_jiji");var dynCall_iiiiij=Module["dynCall_iiiiij"]=createExportWrapper("dynCall_iiiiij");var dynCall_iiiiijj=Module["dynCall_iiiiijj"]=createExportWrapper("dynCall_iiiiijj");var dynCall_iiiiiijj=Module["dynCall_iiiiiijj"]=createExportWrapper("dynCall_iiiiiijj");var dynCall_viijii=Module["dynCall_viijii"]=createExportWrapper("dynCall_viijii");if(!Object.getOwnPropertyDescriptor(Module,"intArrayFromString"))Module["intArrayFromString"]=function(){abort("'intArrayFromString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"intArrayToString"))Module["intArrayToString"]=function(){abort("'intArrayToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ccall"))Module["ccall"]=function(){abort("'ccall' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["cwrap"]=cwrap;if(!Object.getOwnPropertyDescriptor(Module,"setValue"))Module["setValue"]=function(){abort("'setValue' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getValue"))Module["getValue"]=function(){abort("'getValue' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"allocate"))Module["allocate"]=function(){abort("'allocate' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"UTF8ArrayToString"))Module["UTF8ArrayToString"]=function(){abort("'UTF8ArrayToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["UTF8ToString"]=UTF8ToString;if(!Object.getOwnPropertyDescriptor(Module,"stringToUTF8Array"))Module["stringToUTF8Array"]=function(){abort("'stringToUTF8Array' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["stringToUTF8"]=stringToUTF8;Module["lengthBytesUTF8"]=lengthBytesUTF8;if(!Object.getOwnPropertyDescriptor(Module,"stackTrace"))Module["stackTrace"]=function(){abort("'stackTrace' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"addOnPreRun"))Module["addOnPreRun"]=function(){abort("'addOnPreRun' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"addOnInit"))Module["addOnInit"]=function(){abort("'addOnInit' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"addOnPreMain"))Module["addOnPreMain"]=function(){abort("'addOnPreMain' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"addOnExit"))Module["addOnExit"]=function(){abort("'addOnExit' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"addOnPostRun"))Module["addOnPostRun"]=function(){abort("'addOnPostRun' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeStringToMemory"))Module["writeStringToMemory"]=function(){abort("'writeStringToMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeArrayToMemory"))Module["writeArrayToMemory"]=function(){abort("'writeArrayToMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeAsciiToMemory"))Module["writeAsciiToMemory"]=function(){abort("'writeAsciiToMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["addRunDependency"]=addRunDependency;Module["removeRunDependency"]=removeRunDependency;if(!Object.getOwnPropertyDescriptor(Module,"FS_createFolder"))Module["FS_createFolder"]=function(){abort("'FS_createFolder' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;Module["FS_createPreloadedFile"]=FS.createPreloadedFile;Module["FS_createLazyFile"]=FS.createLazyFile;if(!Object.getOwnPropertyDescriptor(Module,"FS_createLink"))Module["FS_createLink"]=function(){abort("'FS_createLink' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["FS_createDevice"]=FS.createDevice;Module["FS_unlink"]=FS.unlink;if(!Object.getOwnPropertyDescriptor(Module,"getLEB"))Module["getLEB"]=function(){abort("'getLEB' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getFunctionTables"))Module["getFunctionTables"]=function(){abort("'getFunctionTables' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"alignFunctionTables"))Module["alignFunctionTables"]=function(){abort("'alignFunctionTables' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerFunctions"))Module["registerFunctions"]=function(){abort("'registerFunctions' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"addFunction"))Module["addFunction"]=function(){abort("'addFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"removeFunction"))Module["removeFunction"]=function(){abort("'removeFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getFuncWrapper"))Module["getFuncWrapper"]=function(){abort("'getFuncWrapper' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"prettyPrint"))Module["prettyPrint"]=function(){abort("'prettyPrint' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"dynCall"))Module["dynCall"]=function(){abort("'dynCall' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getCompilerSetting"))Module["getCompilerSetting"]=function(){abort("'getCompilerSetting' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"print"))Module["print"]=function(){abort("'print' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"printErr"))Module["printErr"]=function(){abort("'printErr' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getTempRet0"))Module["getTempRet0"]=function(){abort("'getTempRet0' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setTempRet0"))Module["setTempRet0"]=function(){abort("'setTempRet0' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"callMain"))Module["callMain"]=function(){abort("'callMain' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"abort"))Module["abort"]=function(){abort("'abort' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"keepRuntimeAlive"))Module["keepRuntimeAlive"]=function(){abort("'keepRuntimeAlive' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"zeroMemory"))Module["zeroMemory"]=function(){abort("'zeroMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stringToNewUTF8"))Module["stringToNewUTF8"]=function(){abort("'stringToNewUTF8' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setFileTime"))Module["setFileTime"]=function(){abort("'setFileTime' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emscripten_realloc_buffer"))Module["emscripten_realloc_buffer"]=function(){abort("'emscripten_realloc_buffer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ENV"))Module["ENV"]=function(){abort("'ENV' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"withStackSave"))Module["withStackSave"]=function(){abort("'withStackSave' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ERRNO_CODES"))Module["ERRNO_CODES"]=function(){abort("'ERRNO_CODES' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ERRNO_MESSAGES"))Module["ERRNO_MESSAGES"]=function(){abort("'ERRNO_MESSAGES' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setErrNo"))Module["setErrNo"]=function(){abort("'setErrNo' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"inetPton4"))Module["inetPton4"]=function(){abort("'inetPton4' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"inetNtop4"))Module["inetNtop4"]=function(){abort("'inetNtop4' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"inetPton6"))Module["inetPton6"]=function(){abort("'inetPton6' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"inetNtop6"))Module["inetNtop6"]=function(){abort("'inetNtop6' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"readSockaddr"))Module["readSockaddr"]=function(){abort("'readSockaddr' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeSockaddr"))Module["writeSockaddr"]=function(){abort("'writeSockaddr' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"DNS"))Module["DNS"]=function(){abort("'DNS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getHostByName"))Module["getHostByName"]=function(){abort("'getHostByName' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"GAI_ERRNO_MESSAGES"))Module["GAI_ERRNO_MESSAGES"]=function(){abort("'GAI_ERRNO_MESSAGES' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"Protocols"))Module["Protocols"]=function(){abort("'Protocols' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"Sockets"))Module["Sockets"]=function(){abort("'Sockets' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getRandomDevice"))Module["getRandomDevice"]=function(){abort("'getRandomDevice' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"traverseStack"))Module["traverseStack"]=function(){abort("'traverseStack' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"UNWIND_CACHE"))Module["UNWIND_CACHE"]=function(){abort("'UNWIND_CACHE' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"readAsmConstArgsArray"))Module["readAsmConstArgsArray"]=function(){abort("'readAsmConstArgsArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"readAsmConstArgs"))Module["readAsmConstArgs"]=function(){abort("'readAsmConstArgs' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"mainThreadEM_ASM"))Module["mainThreadEM_ASM"]=function(){abort("'mainThreadEM_ASM' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"jstoi_q"))Module["jstoi_q"]=function(){abort("'jstoi_q' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"jstoi_s"))Module["jstoi_s"]=function(){abort("'jstoi_s' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getExecutableName"))Module["getExecutableName"]=function(){abort("'getExecutableName' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"listenOnce"))Module["listenOnce"]=function(){abort("'listenOnce' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"autoResumeAudioContext"))Module["autoResumeAudioContext"]=function(){abort("'autoResumeAudioContext' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"dynCallLegacy"))Module["dynCallLegacy"]=function(){abort("'dynCallLegacy' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getDynCaller"))Module["getDynCaller"]=function(){abort("'getDynCaller' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"dynCall"))Module["dynCall"]=function(){abort("'dynCall' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"callRuntimeCallbacks"))Module["callRuntimeCallbacks"]=function(){abort("'callRuntimeCallbacks' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"wasmTableMirror"))Module["wasmTableMirror"]=function(){abort("'wasmTableMirror' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setWasmTableEntry"))Module["setWasmTableEntry"]=function(){abort("'setWasmTableEntry' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getWasmTableEntry"))Module["getWasmTableEntry"]=function(){abort("'getWasmTableEntry' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"handleException"))Module["handleException"]=function(){abort("'handleException' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"runtimeKeepalivePush"))Module["runtimeKeepalivePush"]=function(){abort("'runtimeKeepalivePush' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"runtimeKeepalivePop"))Module["runtimeKeepalivePop"]=function(){abort("'runtimeKeepalivePop' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"callUserCallback"))Module["callUserCallback"]=function(){abort("'callUserCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"maybeExit"))Module["maybeExit"]=function(){abort("'maybeExit' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"safeSetTimeout"))Module["safeSetTimeout"]=function(){abort("'safeSetTimeout' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"asmjsMangle"))Module["asmjsMangle"]=function(){abort("'asmjsMangle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"asyncLoad"))Module["asyncLoad"]=function(){abort("'asyncLoad' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"alignMemory"))Module["alignMemory"]=function(){abort("'alignMemory' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"mmapAlloc"))Module["mmapAlloc"]=function(){abort("'mmapAlloc' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"reallyNegative"))Module["reallyNegative"]=function(){abort("'reallyNegative' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"unSign"))Module["unSign"]=function(){abort("'unSign' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"reSign"))Module["reSign"]=function(){abort("'reSign' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"formatString"))Module["formatString"]=function(){abort("'formatString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"PATH"))Module["PATH"]=function(){abort("'PATH' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"PATH_FS"))Module["PATH_FS"]=function(){abort("'PATH_FS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SYSCALLS"))Module["SYSCALLS"]=function(){abort("'SYSCALLS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"syscallMmap2"))Module["syscallMmap2"]=function(){abort("'syscallMmap2' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"syscallMunmap"))Module["syscallMunmap"]=function(){abort("'syscallMunmap' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getSocketFromFD"))Module["getSocketFromFD"]=function(){abort("'getSocketFromFD' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getSocketAddress"))Module["getSocketAddress"]=function(){abort("'getSocketAddress' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"JSEvents"))Module["JSEvents"]=function(){abort("'JSEvents' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerKeyEventCallback"))Module["registerKeyEventCallback"]=function(){abort("'registerKeyEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"specialHTMLTargets"))Module["specialHTMLTargets"]=function(){abort("'specialHTMLTargets' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"maybeCStringToJsString"))Module["maybeCStringToJsString"]=function(){abort("'maybeCStringToJsString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"findEventTarget"))Module["findEventTarget"]=function(){abort("'findEventTarget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"findCanvasEventTarget"))Module["findCanvasEventTarget"]=function(){abort("'findCanvasEventTarget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getBoundingClientRect"))Module["getBoundingClientRect"]=function(){abort("'getBoundingClientRect' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillMouseEventData"))Module["fillMouseEventData"]=function(){abort("'fillMouseEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerMouseEventCallback"))Module["registerMouseEventCallback"]=function(){abort("'registerMouseEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerWheelEventCallback"))Module["registerWheelEventCallback"]=function(){abort("'registerWheelEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerUiEventCallback"))Module["registerUiEventCallback"]=function(){abort("'registerUiEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerFocusEventCallback"))Module["registerFocusEventCallback"]=function(){abort("'registerFocusEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillDeviceOrientationEventData"))Module["fillDeviceOrientationEventData"]=function(){abort("'fillDeviceOrientationEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerDeviceOrientationEventCallback"))Module["registerDeviceOrientationEventCallback"]=function(){abort("'registerDeviceOrientationEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillDeviceMotionEventData"))Module["fillDeviceMotionEventData"]=function(){abort("'fillDeviceMotionEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerDeviceMotionEventCallback"))Module["registerDeviceMotionEventCallback"]=function(){abort("'registerDeviceMotionEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"screenOrientation"))Module["screenOrientation"]=function(){abort("'screenOrientation' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillOrientationChangeEventData"))Module["fillOrientationChangeEventData"]=function(){abort("'fillOrientationChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerOrientationChangeEventCallback"))Module["registerOrientationChangeEventCallback"]=function(){abort("'registerOrientationChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillFullscreenChangeEventData"))Module["fillFullscreenChangeEventData"]=function(){abort("'fillFullscreenChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerFullscreenChangeEventCallback"))Module["registerFullscreenChangeEventCallback"]=function(){abort("'registerFullscreenChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerRestoreOldStyle"))Module["registerRestoreOldStyle"]=function(){abort("'registerRestoreOldStyle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"hideEverythingExceptGivenElement"))Module["hideEverythingExceptGivenElement"]=function(){abort("'hideEverythingExceptGivenElement' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"restoreHiddenElements"))Module["restoreHiddenElements"]=function(){abort("'restoreHiddenElements' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setLetterbox"))Module["setLetterbox"]=function(){abort("'setLetterbox' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"currentFullscreenStrategy"))Module["currentFullscreenStrategy"]=function(){abort("'currentFullscreenStrategy' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"restoreOldWindowedStyle"))Module["restoreOldWindowedStyle"]=function(){abort("'restoreOldWindowedStyle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"softFullscreenResizeWebGLRenderTarget"))Module["softFullscreenResizeWebGLRenderTarget"]=function(){abort("'softFullscreenResizeWebGLRenderTarget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"doRequestFullscreen"))Module["doRequestFullscreen"]=function(){abort("'doRequestFullscreen' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillPointerlockChangeEventData"))Module["fillPointerlockChangeEventData"]=function(){abort("'fillPointerlockChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerPointerlockChangeEventCallback"))Module["registerPointerlockChangeEventCallback"]=function(){abort("'registerPointerlockChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerPointerlockErrorEventCallback"))Module["registerPointerlockErrorEventCallback"]=function(){abort("'registerPointerlockErrorEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"requestPointerLock"))Module["requestPointerLock"]=function(){abort("'requestPointerLock' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillVisibilityChangeEventData"))Module["fillVisibilityChangeEventData"]=function(){abort("'fillVisibilityChangeEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerVisibilityChangeEventCallback"))Module["registerVisibilityChangeEventCallback"]=function(){abort("'registerVisibilityChangeEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerTouchEventCallback"))Module["registerTouchEventCallback"]=function(){abort("'registerTouchEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillGamepadEventData"))Module["fillGamepadEventData"]=function(){abort("'fillGamepadEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerGamepadEventCallback"))Module["registerGamepadEventCallback"]=function(){abort("'registerGamepadEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerBeforeUnloadEventCallback"))Module["registerBeforeUnloadEventCallback"]=function(){abort("'registerBeforeUnloadEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"fillBatteryEventData"))Module["fillBatteryEventData"]=function(){abort("'fillBatteryEventData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"battery"))Module["battery"]=function(){abort("'battery' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerBatteryEventCallback"))Module["registerBatteryEventCallback"]=function(){abort("'registerBatteryEventCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setCanvasElementSize"))Module["setCanvasElementSize"]=function(){abort("'setCanvasElementSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getCanvasElementSize"))Module["getCanvasElementSize"]=function(){abort("'getCanvasElementSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"demangle"))Module["demangle"]=function(){abort("'demangle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"demangleAll"))Module["demangleAll"]=function(){abort("'demangleAll' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"jsStackTrace"))Module["jsStackTrace"]=function(){abort("'jsStackTrace' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stackTrace"))Module["stackTrace"]=function(){abort("'stackTrace' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getEnvStrings"))Module["getEnvStrings"]=function(){abort("'getEnvStrings' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"checkWasiClock"))Module["checkWasiClock"]=function(){abort("'checkWasiClock' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeI53ToI64"))Module["writeI53ToI64"]=function(){abort("'writeI53ToI64' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeI53ToI64Clamped"))Module["writeI53ToI64Clamped"]=function(){abort("'writeI53ToI64Clamped' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeI53ToI64Signaling"))Module["writeI53ToI64Signaling"]=function(){abort("'writeI53ToI64Signaling' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeI53ToU64Clamped"))Module["writeI53ToU64Clamped"]=function(){abort("'writeI53ToU64Clamped' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeI53ToU64Signaling"))Module["writeI53ToU64Signaling"]=function(){abort("'writeI53ToU64Signaling' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"readI53FromI64"))Module["readI53FromI64"]=function(){abort("'readI53FromI64' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"readI53FromU64"))Module["readI53FromU64"]=function(){abort("'readI53FromU64' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"convertI32PairToI53"))Module["convertI32PairToI53"]=function(){abort("'convertI32PairToI53' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"convertU32PairToI53"))Module["convertU32PairToI53"]=function(){abort("'convertU32PairToI53' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setImmediateWrapped"))Module["setImmediateWrapped"]=function(){abort("'setImmediateWrapped' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"clearImmediateWrapped"))Module["clearImmediateWrapped"]=function(){abort("'clearImmediateWrapped' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"polyfillSetImmediate"))Module["polyfillSetImmediate"]=function(){abort("'polyfillSetImmediate' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"uncaughtExceptionCount"))Module["uncaughtExceptionCount"]=function(){abort("'uncaughtExceptionCount' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"exceptionLast"))Module["exceptionLast"]=function(){abort("'exceptionLast' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"exceptionCaught"))Module["exceptionCaught"]=function(){abort("'exceptionCaught' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ExceptionInfo"))Module["ExceptionInfo"]=function(){abort("'ExceptionInfo' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"CatchInfo"))Module["CatchInfo"]=function(){abort("'CatchInfo' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"exception_addRef"))Module["exception_addRef"]=function(){abort("'exception_addRef' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"exception_decRef"))Module["exception_decRef"]=function(){abort("'exception_decRef' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"Browser"))Module["Browser"]=function(){abort("'Browser' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"funcWrappers"))Module["funcWrappers"]=function(){abort("'funcWrappers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getFuncWrapper"))Module["getFuncWrapper"]=function(){abort("'getFuncWrapper' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setMainLoop"))Module["setMainLoop"]=function(){abort("'setMainLoop' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"wget"))Module["wget"]=function(){abort("'wget' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["FS"]=FS;if(!Object.getOwnPropertyDescriptor(Module,"MEMFS"))Module["MEMFS"]=function(){abort("'MEMFS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"TTY"))Module["TTY"]=function(){abort("'TTY' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"PIPEFS"))Module["PIPEFS"]=function(){abort("'PIPEFS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SOCKFS"))Module["SOCKFS"]=function(){abort("'SOCKFS' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"_setNetworkCallback"))Module["_setNetworkCallback"]=function(){abort("'_setNetworkCallback' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"tempFixedLengthArray"))Module["tempFixedLengthArray"]=function(){abort("'tempFixedLengthArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"miniTempWebGLFloatBuffers"))Module["miniTempWebGLFloatBuffers"]=function(){abort("'miniTempWebGLFloatBuffers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"heapObjectForWebGLType"))Module["heapObjectForWebGLType"]=function(){abort("'heapObjectForWebGLType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"heapAccessShiftForWebGLHeap"))Module["heapAccessShiftForWebGLHeap"]=function(){abort("'heapAccessShiftForWebGLHeap' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"GL"))Module["GL"]=function(){abort("'GL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emscriptenWebGLGet"))Module["emscriptenWebGLGet"]=function(){abort("'emscriptenWebGLGet' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"computeUnpackAlignedImageSize"))Module["computeUnpackAlignedImageSize"]=function(){abort("'computeUnpackAlignedImageSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emscriptenWebGLGetTexPixelData"))Module["emscriptenWebGLGetTexPixelData"]=function(){abort("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emscriptenWebGLGetUniform"))Module["emscriptenWebGLGetUniform"]=function(){abort("'emscriptenWebGLGetUniform' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"webglGetUniformLocation"))Module["webglGetUniformLocation"]=function(){abort("'webglGetUniformLocation' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"webglPrepareUniformLocationsBeforeFirstUse"))Module["webglPrepareUniformLocationsBeforeFirstUse"]=function(){abort("'webglPrepareUniformLocationsBeforeFirstUse' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"webglGetLeftBracePos"))Module["webglGetLeftBracePos"]=function(){abort("'webglGetLeftBracePos' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emscriptenWebGLGetVertexAttrib"))Module["emscriptenWebGLGetVertexAttrib"]=function(){abort("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"writeGLArray"))Module["writeGLArray"]=function(){abort("'writeGLArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"AL"))Module["AL"]=function(){abort("'AL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SDL_unicode"))Module["SDL_unicode"]=function(){abort("'SDL_unicode' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SDL_ttfContext"))Module["SDL_ttfContext"]=function(){abort("'SDL_ttfContext' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SDL_audio"))Module["SDL_audio"]=function(){abort("'SDL_audio' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SDL"))Module["SDL"]=function(){abort("'SDL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"SDL_gfx"))Module["SDL_gfx"]=function(){abort("'SDL_gfx' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"GLUT"))Module["GLUT"]=function(){abort("'GLUT' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"EGL"))Module["EGL"]=function(){abort("'EGL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"GLFW_Window"))Module["GLFW_Window"]=function(){abort("'GLFW_Window' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"GLFW"))Module["GLFW"]=function(){abort("'GLFW' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"GLEW"))Module["GLEW"]=function(){abort("'GLEW' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"IDBStore"))Module["IDBStore"]=function(){abort("'IDBStore' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"runAndAbortIfError"))Module["runAndAbortIfError"]=function(){abort("'runAndAbortIfError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emval_handle_array"))Module["emval_handle_array"]=function(){abort("'emval_handle_array' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emval_free_list"))Module["emval_free_list"]=function(){abort("'emval_free_list' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emval_symbols"))Module["emval_symbols"]=function(){abort("'emval_symbols' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"init_emval"))Module["init_emval"]=function(){abort("'init_emval' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"count_emval_handles"))Module["count_emval_handles"]=function(){abort("'count_emval_handles' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"get_first_emval"))Module["get_first_emval"]=function(){abort("'get_first_emval' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getStringOrSymbol"))Module["getStringOrSymbol"]=function(){abort("'getStringOrSymbol' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"Emval"))Module["Emval"]=function(){abort("'Emval' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emval_newers"))Module["emval_newers"]=function(){abort("'emval_newers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"craftEmvalAllocator"))Module["craftEmvalAllocator"]=function(){abort("'craftEmvalAllocator' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emval_get_global"))Module["emval_get_global"]=function(){abort("'emval_get_global' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"emval_methodCallers"))Module["emval_methodCallers"]=function(){abort("'emval_methodCallers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"InternalError"))Module["InternalError"]=function(){abort("'InternalError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"BindingError"))Module["BindingError"]=function(){abort("'BindingError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"UnboundTypeError"))Module["UnboundTypeError"]=function(){abort("'UnboundTypeError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"PureVirtualError"))Module["PureVirtualError"]=function(){abort("'PureVirtualError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"init_embind"))Module["init_embind"]=function(){abort("'init_embind' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"throwInternalError"))Module["throwInternalError"]=function(){abort("'throwInternalError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"throwBindingError"))Module["throwBindingError"]=function(){abort("'throwBindingError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"throwUnboundTypeError"))Module["throwUnboundTypeError"]=function(){abort("'throwUnboundTypeError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ensureOverloadTable"))Module["ensureOverloadTable"]=function(){abort("'ensureOverloadTable' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"exposePublicSymbol"))Module["exposePublicSymbol"]=function(){abort("'exposePublicSymbol' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"replacePublicSymbol"))Module["replacePublicSymbol"]=function(){abort("'replacePublicSymbol' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"extendError"))Module["extendError"]=function(){abort("'extendError' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"createNamedFunction"))Module["createNamedFunction"]=function(){abort("'createNamedFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registeredInstances"))Module["registeredInstances"]=function(){abort("'registeredInstances' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getBasestPointer"))Module["getBasestPointer"]=function(){abort("'getBasestPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerInheritedInstance"))Module["registerInheritedInstance"]=function(){abort("'registerInheritedInstance' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"unregisterInheritedInstance"))Module["unregisterInheritedInstance"]=function(){abort("'unregisterInheritedInstance' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getInheritedInstance"))Module["getInheritedInstance"]=function(){abort("'getInheritedInstance' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getInheritedInstanceCount"))Module["getInheritedInstanceCount"]=function(){abort("'getInheritedInstanceCount' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getLiveInheritedInstances"))Module["getLiveInheritedInstances"]=function(){abort("'getLiveInheritedInstances' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registeredTypes"))Module["registeredTypes"]=function(){abort("'registeredTypes' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"awaitingDependencies"))Module["awaitingDependencies"]=function(){abort("'awaitingDependencies' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"typeDependencies"))Module["typeDependencies"]=function(){abort("'typeDependencies' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registeredPointers"))Module["registeredPointers"]=function(){abort("'registeredPointers' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"registerType"))Module["registerType"]=function(){abort("'registerType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"whenDependentTypesAreResolved"))Module["whenDependentTypesAreResolved"]=function(){abort("'whenDependentTypesAreResolved' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"embind_charCodes"))Module["embind_charCodes"]=function(){abort("'embind_charCodes' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"embind_init_charCodes"))Module["embind_init_charCodes"]=function(){abort("'embind_init_charCodes' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"readLatin1String"))Module["readLatin1String"]=function(){abort("'readLatin1String' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getTypeName"))Module["getTypeName"]=function(){abort("'getTypeName' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"heap32VectorToArray"))Module["heap32VectorToArray"]=function(){abort("'heap32VectorToArray' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"requireRegisteredType"))Module["requireRegisteredType"]=function(){abort("'requireRegisteredType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"getShiftFromSize"))Module["getShiftFromSize"]=function(){abort("'getShiftFromSize' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"integerReadValueFromPointer"))Module["integerReadValueFromPointer"]=function(){abort("'integerReadValueFromPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"enumReadValueFromPointer"))Module["enumReadValueFromPointer"]=function(){abort("'enumReadValueFromPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"floatReadValueFromPointer"))Module["floatReadValueFromPointer"]=function(){abort("'floatReadValueFromPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"simpleReadValueFromPointer"))Module["simpleReadValueFromPointer"]=function(){abort("'simpleReadValueFromPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"runDestructors"))Module["runDestructors"]=function(){abort("'runDestructors' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"new_"))Module["new_"]=function(){abort("'new_' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"craftInvokerFunction"))Module["craftInvokerFunction"]=function(){abort("'craftInvokerFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"embind__requireFunction"))Module["embind__requireFunction"]=function(){abort("'embind__requireFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"tupleRegistrations"))Module["tupleRegistrations"]=function(){abort("'tupleRegistrations' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"structRegistrations"))Module["structRegistrations"]=function(){abort("'structRegistrations' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"genericPointerToWireType"))Module["genericPointerToWireType"]=function(){abort("'genericPointerToWireType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"constNoSmartPtrRawPointerToWireType"))Module["constNoSmartPtrRawPointerToWireType"]=function(){abort("'constNoSmartPtrRawPointerToWireType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"nonConstNoSmartPtrRawPointerToWireType"))Module["nonConstNoSmartPtrRawPointerToWireType"]=function(){abort("'nonConstNoSmartPtrRawPointerToWireType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"init_RegisteredPointer"))Module["init_RegisteredPointer"]=function(){abort("'init_RegisteredPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"RegisteredPointer"))Module["RegisteredPointer"]=function(){abort("'RegisteredPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"RegisteredPointer_getPointee"))Module["RegisteredPointer_getPointee"]=function(){abort("'RegisteredPointer_getPointee' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"RegisteredPointer_destructor"))Module["RegisteredPointer_destructor"]=function(){abort("'RegisteredPointer_destructor' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"RegisteredPointer_deleteObject"))Module["RegisteredPointer_deleteObject"]=function(){abort("'RegisteredPointer_deleteObject' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"RegisteredPointer_fromWireType"))Module["RegisteredPointer_fromWireType"]=function(){abort("'RegisteredPointer_fromWireType' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"runDestructor"))Module["runDestructor"]=function(){abort("'runDestructor' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"releaseClassHandle"))Module["releaseClassHandle"]=function(){abort("'releaseClassHandle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"finalizationRegistry"))Module["finalizationRegistry"]=function(){abort("'finalizationRegistry' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"detachFinalizer_deps"))Module["detachFinalizer_deps"]=function(){abort("'detachFinalizer_deps' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"detachFinalizer"))Module["detachFinalizer"]=function(){abort("'detachFinalizer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"attachFinalizer"))Module["attachFinalizer"]=function(){abort("'attachFinalizer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"makeClassHandle"))Module["makeClassHandle"]=function(){abort("'makeClassHandle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"init_ClassHandle"))Module["init_ClassHandle"]=function(){abort("'init_ClassHandle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ClassHandle"))Module["ClassHandle"]=function(){abort("'ClassHandle' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ClassHandle_isAliasOf"))Module["ClassHandle_isAliasOf"]=function(){abort("'ClassHandle_isAliasOf' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"throwInstanceAlreadyDeleted"))Module["throwInstanceAlreadyDeleted"]=function(){abort("'throwInstanceAlreadyDeleted' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ClassHandle_clone"))Module["ClassHandle_clone"]=function(){abort("'ClassHandle_clone' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ClassHandle_delete"))Module["ClassHandle_delete"]=function(){abort("'ClassHandle_delete' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"deletionQueue"))Module["deletionQueue"]=function(){abort("'deletionQueue' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ClassHandle_isDeleted"))Module["ClassHandle_isDeleted"]=function(){abort("'ClassHandle_isDeleted' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"ClassHandle_deleteLater"))Module["ClassHandle_deleteLater"]=function(){abort("'ClassHandle_deleteLater' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"flushPendingDeletes"))Module["flushPendingDeletes"]=function(){abort("'flushPendingDeletes' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"delayFunction"))Module["delayFunction"]=function(){abort("'delayFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"setDelayFunction"))Module["setDelayFunction"]=function(){abort("'setDelayFunction' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"RegisteredClass"))Module["RegisteredClass"]=function(){abort("'RegisteredClass' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"shallowCopyInternalPointer"))Module["shallowCopyInternalPointer"]=function(){abort("'shallowCopyInternalPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"downcastPointer"))Module["downcastPointer"]=function(){abort("'downcastPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"upcastPointer"))Module["upcastPointer"]=function(){abort("'upcastPointer' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"validateThis"))Module["validateThis"]=function(){abort("'validateThis' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"char_0"))Module["char_0"]=function(){abort("'char_0' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"char_9"))Module["char_9"]=function(){abort("'char_9' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"makeLegalFunctionName"))Module["makeLegalFunctionName"]=function(){abort("'makeLegalFunctionName' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"warnOnce"))Module["warnOnce"]=function(){abort("'warnOnce' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stackSave"))Module["stackSave"]=function(){abort("'stackSave' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stackRestore"))Module["stackRestore"]=function(){abort("'stackRestore' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stackAlloc"))Module["stackAlloc"]=function(){abort("'stackAlloc' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"AsciiToString"))Module["AsciiToString"]=function(){abort("'AsciiToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stringToAscii"))Module["stringToAscii"]=function(){abort("'stringToAscii' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"UTF16ToString"))Module["UTF16ToString"]=function(){abort("'UTF16ToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stringToUTF16"))Module["stringToUTF16"]=function(){abort("'stringToUTF16' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"lengthBytesUTF16"))Module["lengthBytesUTF16"]=function(){abort("'lengthBytesUTF16' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"UTF32ToString"))Module["UTF32ToString"]=function(){abort("'UTF32ToString' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"stringToUTF32"))Module["stringToUTF32"]=function(){abort("'stringToUTF32' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"lengthBytesUTF32"))Module["lengthBytesUTF32"]=function(){abort("'lengthBytesUTF32' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"allocateUTF8"))Module["allocateUTF8"]=function(){abort("'allocateUTF8' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};if(!Object.getOwnPropertyDescriptor(Module,"allocateUTF8OnStack"))Module["allocateUTF8OnStack"]=function(){abort("'allocateUTF8OnStack' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")};Module["writeStackCookie"]=writeStackCookie;Module["checkStackCookie"]=checkStackCookie;if(!Object.getOwnPropertyDescriptor(Module,"ALLOC_NORMAL"))Object.defineProperty(Module,"ALLOC_NORMAL",{configurable:true,get:function(){abort("'ALLOC_NORMAL' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")}});if(!Object.getOwnPropertyDescriptor(Module,"ALLOC_STACK"))Object.defineProperty(Module,"ALLOC_STACK",{configurable:true,get:function(){abort("'ALLOC_STACK' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the FAQ)")}});var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function stackCheckInit(){_emscripten_stack_init();writeStackCookie()}function run(args){args=args||arguments_;if(runDependencies>0){return}stackCheckInit();preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();assert(!Module["_main"],'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}checkStackCookie()}Module["run"]=run;function checkUnflushedContent(){var oldOut=out;var oldErr=err;var has=false;out=err=function(x){has=true};try{var flush=Module["_fflush"];if(flush)flush(0);["stdout","stderr"].forEach(function(name){var info=FS.analyzePath("/dev/"+name);if(!info)return;var stream=info.object;var rdev=stream.rdev;var tty=TTY.ttys[rdev];if(tty&&tty.output&&tty.output.length){has=true}})}catch(e){}out=oldOut;err=oldErr;if(has){warnOnce("stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the FAQ), or make sure to emit a newline when you printf etc.")}}function procExit(code){EXITSTATUS=code;if(!keepRuntimeAlive()){if(Module["onExit"])Module["onExit"](code);ABORT=true}quit_(code,new ExitStatus(code))}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return FaustModule.ready
}
);
})();
if (true)
  module.exports = FaustModule;
else {}


/***/ }),

/***/ "?fe02":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?569f":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?3f59":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "?7ba9":
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Faust": () => (/* reexport safe */ _Faust__WEBPACK_IMPORTED_MODULE_0__.Faust),
/* harmony export */   "FaustAudioWorkletNode": () => (/* reexport safe */ _FaustAudioWorkletNode__WEBPACK_IMPORTED_MODULE_1__.FaustAudioWorkletNode)
/* harmony export */ });
/* harmony import */ var _Faust__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Faust */ "./src/Faust.ts");
/* harmony import */ var _FaustAudioWorkletNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./FaustAudioWorkletNode */ "./src/FaustAudioWorkletNode.ts");



})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=index.js.map