"usee strict";

var React = require('react');
var hoistNonReactStatics = require('hoist-non-react-statics');
var _ = require('lodash');

module.exports = function StoreConnect(Component) {
    if (!Component.stateProps)
        throw new Error("You should not wrap a component without stateProps, did you define statics.stateProps?");

    var name = Component.displayName || "";

    var Wrapper = React.createClass({

        displayName: name + "StoreWrapper",

        contextTypes: {
            getStore: React.PropTypes.func.isRequired,
        },

        getInitialState: function() {
            return this.getStateFromStores(this.props);
        },

        componentDidMount: function componentDidMount() {
            this._getStores().forEach(function(kv) {
                kv.store.observe(kv.name, this._onStoreChange);
            }, this);
        },

        componentWillUnmount: function componentWillUnmount() {
            this._getStores().forEach(function(kv) {
                kv.store.stopObserving(kv.name, this._onStoreChange);
            }, this);
        },
        
        componentWillReceiveProps: function(props) {
            this.setState(this.getStateFromStores(props));
        },

        _getStores: function(handle) {
            return Object.keys(Component.stateProps).map(function(key) {
                if (!Component.stateProps[key]) {
                    throw new Error("There is an error in the stateProps definition of component " + Component.displayName);
                }
                
                var properties = {
                    store: this.context.getStore(Component.stateProps[key].store),
                    name: Component.stateProps[key].name,
                    attribute: key
                };
                
                if (Component.stateProps[key]._query) {
                    properties._query = Component.stateProps[key]._query;
                }
                
                return properties;
            }, this);
        },

        _onStoreChange: function onStoreChange() {
            if (!this.isMounted())
                return;

            this.setState(this.getStateFromStores(this.props));
        },

        getStateFromStores: function(props) {
            return this._getStores().reduce(function(state, kv) {
                if (kv._query) {
                    state[kv.attribute] = kv._query.call(this, kv.store, props); 
                } else {
                    state[kv.attribute] = kv.store.state[kv.name];
                }
                return state;
            }.bind(this), {});
        },

        render: function() {
            return React.createElement(Component, _.assign({ ref: "_store_connect_child"}, this.props, this.state));
        }
    });

    return hoistNonReactStatics(Wrapper, Component);
};
