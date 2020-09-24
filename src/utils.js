const pipe = (fn) => x => fn.reduce((x, f) => f(x), x);

module.exports = {
  pipe
}