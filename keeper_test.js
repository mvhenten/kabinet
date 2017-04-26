"use strict";

const test = require("tape");
const Store = require("./store");
const Keeper = require("./keeper");

test("Keeper.getStore returns the store", function(assert) {
    let Things =Store.create("Things", { count: Number });
    let keeper = new Keeper();
    
    let things = keeper.getStore(Things, { count: 123 });

    assert.deepEqual(things.getState(), { count: 123 });
    assert.ok(things instanceof Things, "we got a things");

    assert.end();
});
