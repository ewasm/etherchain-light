function hex2buf (hex) {
  let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
    return parseInt(h, 16);
  }));
  return typedArray;
}

function wasm2wast(wasm) {
  var wasmBuf = hex2buf(wasm)
  var pre = document.querySelector('.wast')
  WabtModule().then(function(wabt) {
    try {
      var module = wabt.readWasm(wasmBuf, {readDebugNames: true})
      module.generateNames()
      module.applyNames()
      var result = module.toText({foldExprs: true, inlineExport: true})
      pre.innerHTML = result
    } catch (e) {
      pre.innerHTML = e.toString()
    } finally {
      if (module) module.destroy()
    }

  })
}
