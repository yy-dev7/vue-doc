module.exports = {
  each(array, callback) {
    for (let i = 0, l = array.length; i < l; i++) {
      callback(array[i], i, array)
    }
  },

  merge(target, override) {
    var key
    for (key in override) {
      if (override.hasOwnProperty(key)) {
        target[key] = override[key]
      }
    }
    return target
  },

  eval(string) {
    try {
      return eval("("+string+")")
    } catch (e) {
      return {}
    }
  }

}
