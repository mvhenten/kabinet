"use strict";

var test = require("tape");
var sinon = require("sinon");
var Store = require("./store");

test("Store.create", function(assert) {
  assert.equal(
    Store.create("TestStore").name,
    "TestStore",
    "It creates a named function"
  );

  assert.throws(() => {
    Store.create(1);
  }, /type of first argument "name" must be String/);

  assert.throws(() => {
    Store.create("test", 33);
  }, /type of second argument "storeProps" must be Object/);

  assert.end();
});

test("Store.setState", function(assert) {
  let MyStore = Store.create("MyStore", {
    things: Array
  });

  let store = new MyStore();
  let things = [1, 2, 3];

  assert.deepEqual(store.getState(), {});
  store.setState("things", things);

  assert.deepEqual(
    store.getState(),
    {
      things: things
    },
    "Thing was stored"
  );

  let copy = store.getState().things;
  copy.push(42);

  assert.deepEqual(
    store.getState(),
    {
      things: things
    },
    "State was immutable"
  );

  let thingsCloned = [].concat(things);
  things.push(43);

  assert.deepEqual(
    store.getState(),
    {
      things: thingsCloned
    },
    "State is not a ref to the original"
  );

  assert.throws(
    () => {
      store.setState("things", {});
    },
    /TypeError: type of things must be Array, not object/,
    "State is typechecked"
  );

  assert.throws(
    () => {
      store.setState("others", {});
    },
    /unknown property "others" for MyStore/,
    "Cannot add unknown properties"
  );

  let alt = new MyStore();

  assert.notDeepEqual(
    alt.getState(),
    store.getState(),
    "Stores don't share state"
  );

  store.setState({
    things: []
  });

  assert.end();
});

test("Store.observe", function(assert) {
  let Test = Store.create("Test", {
    count: Number
  });

  let store = new Test();

  let observer = sinon.spy();

  store.observe(observer);

  store.setState("count", 1);

  assert.ok(observer.calledOnce, "Observer was called");

  assert.ok(
    observer.calledWith({
      count: 1
    })
  );

  store.setState("count", 2);

  assert.ok(
    observer.calledWith({
      count: 2
    })
  );

  assert.ok(observer.calledTwice, "Observer called twice");

  assert.end();
});

test("Store.stopObserving", function(assert) {
  let Test = Store.create("Test", {
    count: Number
  });

  let store = new Test();
  let observer = sinon.spy();

  store.observe(observer);
  store.setState("count", 1);

  assert.ok(observer.calledOnce, "Observer was called");

  store.stopObserving(observer);
  store.setState("count", 2);
  assert.ok(observer.calledOnce, "Observer was not called again");

  store.stopObserving(observer);
  assert.pass("Calling stopObserving again did not crash");

  assert.end();
});

test("Store.observers", function(assert) {
  let Test = Store.create("Test", {
    count: Number
  });

  let store = new Test();
  let first = sinon.spy();
  let second = sinon.spy();

  store.observe(first);
  store.observe(second);

  store.setState("count", 2);

  assert.ok(first.calledOnce, "First observer was called");
  assert.ok(second.calledOnce, "Second observer was called");

  store.stopObserving(second);

  store.setState("count", 2);

  assert.ok(first.calledTwice, "First observer called again");
  assert.ok(second.calledOnce, "Second observer was not called");

  assert.end();
});

test("Store.clearState", function(assert) {
  let Test = Store.create("Test", {
    count: Number
  });

  let store = new Test();
  let observer = sinon.spy();
  let count = Math.random();

  store.observe(observer);
  store.setState("count", count);

  assert.ok(observer.calledOnce, "Observer was called");
  assert.ok(
    observer.calledWith({
      count: count
    })
  );
  assert.deepEqual(store.getState(), {
    count: count
  });

  store.clearState();

  assert.ok(observer.calledTwice, "Observer was called");
  assert.ok(observer.calledWith({}));
  assert.deepEqual(store.getState(), {});

  assert.end();
});

test("Store.getState wihtout arguments", function(assert) {
  let Test = Store.create("Test", {
    things: Array
  });

  let store = new Test();

  store.setState("things", []);

  assert.deepEqual(store.getState(), {
    things: []
  });

  store.setState("things", [1, 2, 3]);

  assert.deepEqual(store.getState(), {
    things: [1, 2, 3]
  });

  assert.end();
});

test("Store.getState with null value", function(assert) {
  let Test = Store.create("Test", {
    things: Object
  });

  let store = new Test();

  store.setState("things", null);

  assert.deepEqual(store.getState(), {
    things: null
  });

  store.setState("things", {
    ok: true
  });

  assert.deepEqual(store.getState(), {
    things: {
      ok: true
    }
  });

  assert.end();
});

test("Store.getState with nested object values containing all sorts of stuff", function(
  assert
) {
  let Test = Store.create("Test", {
    things: Object
  });

  let store = new Test();

  const expect = {
    nothing: undefined,
    num: 12,
    bool: false,
    neg: -1,
    arr: [1, 2, 3],
    tree: {
      leaf: null,
      branch: false,
      trunk: {
        branch: "here"
      }
    }
  };

  store.setState("things", expect);

  assert.deepEqual(store.getState(), {
    things: expect
  });

  assert.end();
});

test("Store supports setting defaults in constructor", function(assert) {
  let Test = Store.create("Test", {
    count: Number,
    things: Object
  });

  const things = {
    nothing: undefined,
    num: 12,
    bool: false,
    neg: -1,
    arr: [1, 2, 3],
    tree: {
      leaf: null,
      branch: false,
      trunk: {
        branch: "here"
      }
    }
  };

  let store = new Test({
    count: 123,
    things
  });

  assert.deepEqual(store.getState(), {
    count: 123,
    things
  });

  store.setState("count", 345);

  assert.deepEqual(store.getState(), {
    count: 345,
    things
  });

  assert.end();
});
