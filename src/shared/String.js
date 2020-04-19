// eslint-disable-next-line no-extend-native
String.prototype.endWith = function (str) {
  if (!str || str === '' || this.length === 0 || str.length > this.length) {
    return false
  }
  return this.substring(this.length - str.length) === str
}
// eslint-disable-next-line no-extend-native
String.prototype.startWith = function (str) {
  if (!str || str === '' || this.length === 0 || str.length > this.length) {
    return false
  }
  return this.substr(0, str.length) === str
}
