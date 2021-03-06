"use strict";

const State = new WeakMap();

const clone = value => {
  // no need to clone null, undefined, 0, false or ""
  if (!value) return value;

  if (Array.isArray(value)) return value.map(clone);

  if (typeof value == "object")
    return Object.keys(value).reduce((o, key) => {
      return Object.assign(o, {
        [key]: clone(value[key])
      });
    }, {});

  return value;
};

const check = (name, type, value) => {
  if (
    /^(Boolean|Number|String|RegExp|Array|Object|Date|Function)$/.test(
      type.name
    )
  ) {
    if (typeof value === type.name.toLowerCase()) return true;
    if (value instanceof type) return true;
    throw new TypeError(
      `type of ${name} must be ${type.name}, not ${typeof value}`
    );
  }
};

function observers() {
  let state = State.get(this);
  state.observers.forEach(fn => fn.call(null, this.getState()));
}

const proto = {
  getState() {
    return clone(State.get(this).state);
  },

  observe(fn) {
    State.get(this).observers.set(fn, fn);
  },

  stopObserving(fn) {
    State.get(this).observers.delete(fn);
  },

  clearState() {
    State.get(this).state = {};
    observers.call(this);
  },

  setState(name, value) {
    let state = State.get(this);
    let newState = name;

    if (arguments.length == 2) newState = { [name]: value };
    else newState = name;

    for (let key in newState) {
      if (!(key in state.storeProps))
        throw new TypeError(`unknown property "${name}" for ${state.name}`);
      check(key, state.storeProps[key], newState[key]);
      state.state[key] = clone(newState[key]);
    }

    observers.call(this);
  }
};

module.exports.create = function create(name = "StoreName", storeProps = {}) {
  check('first argument "name"', String, name);
  check('second argument "storeProps"', Object, storeProps);

  const ctor = function(defaults) {
    State.set(this, {
      name: name,
      state: {},
      observers: new Map(),
      storeProps: storeProps
    });

    if (defaults) this.setState(defaults);
  };

  ctor.prototype = Object.create(proto);

  return Object.defineProperty(ctor, "name", {
    value: name
  });
};
