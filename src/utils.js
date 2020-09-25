const pipe = (fn) => (x) => fn.reduce((x, f) => f(x), x);
const through = (handle = () => {}) => (params) => {
  handle(params);
  return params;
};

module.exports = {
  pipe,
  through,
};
