module.exports = {
  each(array, callback) {
    for (let i = 0, l = array.length; i < l; i++) {
      callback(array[i], i, array)
    }
  }
}
