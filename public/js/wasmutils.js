window.wabt = this.WabtModule()

function hex2buf (hex) {
  let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16)
  }))
  return typedArray
}

// buffer is an ArrayBuffer
function buf2hex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

// note that the readWasm function is broken on wabt.js 1.0.5.
// use wabt.js 1.0.0
function wasm2wast (wasm) {
  var wasmBuf = hex2buf(wasm)
  var ret

  try {
    var module = this.wabt.readWasm(wasmBuf, { readDebugNames: true })
    module.generateNames()
    module.applyNames()
    var result = module.toText({ foldExprs: true, inlineExport: true })
    ret = result
  } catch (e) {
    ret = e.toString()
  } finally {
    if (module) module.destroy()
  }

  return ret
}

function wast2wasm(wast) {
  try {
    return this.wabt.parseWat('module.wast', wast)
  } catch (e) {
    alert(e)
  }
}
