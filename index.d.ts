import {Stream} from 'xstream';
import * as redux from 'redux';
import * as react from 'react';
import {Driver} from '@cycle/run';
export type Selector<S = any> = (state: S) => any;
export type Selectors<S> = StrMap<Selector<S>>;
export type ActionCreator<P = any> = (payload: P) => {type: string, payload: P};
type StrMap<T> = Record<string, T>;

type CycleMain<So extends StrMap<any>, Si extends StrMap<Stream<any>>> = (sources: So) => Si;

/** Utility to retrieve a payload type from an ActionCreator */
export type PayloadType<T extends ActionCreator> = T extends ActionCreator<infer P> ? P : any

/** Obtain the WarpedProps of a partially-applied warped function */
export type WarpedPropsOf<F extends (component: react.ComponentType<any>) => react.ComponentType<any>>
    = F extends (component: react.ComponentType<infer TProps>) => any ? TProps : any

/**
 * Associate a Redux reducer and a Cycle application with a Component
 * @param options The reducer and Cycle application
 * @param options.reducer A Redux reducer - a function which takes a state and an
 *    action, and returns a new state. Warped Components makes sure that
 *    whenever the connected component is mounted, this reducer will act as
 *    part of the reducers of your store.
 * @param options.effects A Cycle application - a function which takes a mapping of
 *    stream / stream-producers, and returns a mapping of streams.
 */
export declare function warped<S = any>(options: {
    reducer: redux.Reducer<S>
    effects: CycleMain<any, any>
}): (component: null) => react.Component

export interface WarpedSources<S = any> {
    action: Stream<redux.Action<string>>,
    state: Stream<S>,
}

type WarpedProps<
        TActions extends StrMap<ActionCreator>,
        TSelectors extends Selectors<any>,
    > = {[KActions in keyof TActions] : TActions[KActions]}
    & {[KSelectors in keyof TSelectors] : ReturnType<TSelectors[KSelectors]>};

/**
 * Associates a Redux reducer and a Cycle application with a Component
 * and connects it to the state using the given selectors and actions.
 *
 * See https://github.com/wearereasonablepeople/warped-components#warped
 *
 * @param options.reducer A Redux reducer - a function which takes a state and an
 *    action, and returns a new state. Warped Components makes sure that
 *    whenever the connected component is mounted, this reducer will act as
 *    part of the reducers of your store.
 * @param options.selectors An object whose keys correspond to properties, and values
 *  are functions that receive the state and return the value for the
 *  property.
 * @param options.actions A hash-map of action creators. The underlying component will
 *  receive them as props, and when called, the resulting action is
 *  dispatched to the store.
 * @param options.effects A Cycle application - a function which takes a mapping of
 *    stream / stream-producers, and returns a mapping of streams.
 */
export declare function warped<
    TSelectors extends Selectors<S>,
    TActions extends StrMap<ActionCreator>,
    S = any
    >(options: {
        reducer?: redux.Reducer<S, redux.Action<keyof TActions>>
        selectors: TSelectors,
        actions: TActions,
        effects?: CycleMain<WarpedSources<S>, any>
    }):<C extends react.ComponentType<Partial<WarpedProps<TActions, TSelectors>>>>(component: C) => C;


/**
 * This component does the wiring for your application:
 *
 * - Setting up your Redux store, and swapping out its `reducer` as needed.
 * - Setting up your Cycle application, and swapping out its `main` as needed.
 * - Linking the Redux Store and Cycle apps by adding two drivers:
 *     1. `state`: A read-only driver exposing a memory stream of the latest
 *       Redux state.
 *     2. `action`: A read-write driver exposing a stream of dispatched
 *       actions and allowing other actions to be dispatched.
 *
 * See https://github.com/wearereasonablepeople/warped-components#WarpedApp
 */
export declare const WarpedApp: react.SFC<{
    initialState?: any,
    enhancer?: redux.StoreEnhancer,
    drivers?: StrMap<Driver<Stream<any>, any>>
}>;


/**
 * Given a mapping of selectors, returns a `mapStateToProps` function, as
 * accepted by `connect` from React Redux.
 * See https://github.com/wearereasonablepeople/warped-components#compileSelectors
 */
export declare function compileSelectors<S = any>(selectors: Selectors<S>): (state: any, prevProps: any) => any;

/**
 * Given a mapping of action creators, as returned from
 * {@link createReducer}, returns a `mapDispatchToProps` function,
 * as accepted by `connect` from React Redux.
 * See https://github.com/wearereasonablepeople/warped-components#compileDispatchers
 */
export declare function compileDispatchers(actions: StrMap<ActionCreator>): (dispatch: any) => any;

/**
 * Given an array of reducers, returns a single reducer which transforms the
 * state by calling all reducers in sequence.
 * See https://github.com/wearereasonablepeople/warped-components#combineReducers
 */
export declare function combineReducers<S = any>(reducers: [redux.Reducer<S>]): redux.Reducer<S>;

/**
 * Given an array of `main` functions that take sources and return sinks,
 * returns a single `main` function which combines the effects of each.
 * See https://github.com/wearereasonablepeople/warped-components#compileCycles
 */
export declare function combineCycles<So extends StrMap<any>, Si extends StrMap<Stream<any>>>(mains: [CycleMain<So, Si>]): (sources: So) => Si;
