(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.warpedReducers = {})));
}(this, (function (exports) { 'use strict';

  //. # Warped Reducers
  //.
  //. [![Build Status](https://travis-ci.com/wearereasonablepeople/warped-reducers.svg?branch=master)](https://travis-ci.com/wearereasonablepeople/warped-reducers)
  //. [![Greenkeeper Enabled](https://badges.greenkeeper.io/wearereasonablepeople/warped-reducers.svg)](https://greenkeeper.io/)
  //.
  //. Compile a standard Redux reducer from a brief definition.
  //.
  //. Usage in Node depends on `--experimental-modules`.
  //. With older Node versions, use [`esm`][1].

  // createType :: (String, String) -> String
  function createType(namespace, actionName) {
    return 'Warped/' + namespace + '/' + actionName;
  }

  // compileActionTypes :: (String, StrMap Any) -> StrMap String
  function compileActionTypes(namespace, actions) {
    var actionTypes = Object.create (null);
    Object.keys (actions).forEach (function(key) {
      actionTypes[key] = createType (namespace, key);
    });
    return actionTypes;
  }

  // compileActionTypes :: StrMap String
  //                    -> StrMap (a -> { type :: String, payload :: a })
  function compileActionCreators(types) {
    var creators = Object.create (null);
    Object.entries (types).forEach (function(entry) {
      creators[entry[0]] = function(payload) {
        return {type: entry[1], payload: payload};
      };
    });
    return creators;
  }

  // compileReducer :: (String, StrMap b -> a -> a) -> (a, b) -> a
  function compileReducer(namespace, actions) {
    var handlers = Object.create (null);
    Object.entries (actions).forEach (function(entry) {
      handlers[createType (namespace, entry[0])] = entry[1];
    });
    return function(state, action) {
      return handlers[action.type] ?
             handlers[action.type] (action.payload) (state) :
             state;
    };
  }
  function createReducer(namespace) {
    return function(actions) {
      var types = compileActionTypes (namespace, actions);
      return {
        types: types,
        actions: compileActionCreators (types),
        reducer: compileReducer (namespace, actions)
      };
    };
  }

  //# noopAction :: a -> b -> b
  //.
  //. A conveniently named function that does nothing to your state.
  //.
  //. To be used when you need to define an action type which should not affect
  //. the state, but can be used as a message to your Redux side-effect handling
  //. middleware.
  //.
  //. ```js
  //. > noopAction ({do: 'nothing'}) ({myState: 'whatever'})
  //. {myState: 'whatever'}
  //. ```
  function noopAction(payload) {
    return function(state) {
      return state;
    };
  }

  //. [1]: https://github.com/standard-things/esm
  //. [2]: http://ramdajs.com/

  exports.createType = createType;
  exports.compileActionTypes = compileActionTypes;
  exports.compileActionCreators = compileActionCreators;
  exports.compileReducer = compileReducer;
  exports.default = createReducer;
  exports.createReducer = createReducer;
  exports.noopAction = noopAction;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
