export type CurriedHandler<P = any, S = any> = (payload: P) => (state: S) => S;

// TODO: figure out how import this from redux, since this pkg has no dependencies
type Reducer = (state: any, action: {type: any, payload: any}) => any;
type ActionCreator<P = any> = (payload: P) => {type: string, payload: P};
type StrMap<T> = Record<string, T>;

/** Utility to get the payload type of a CurriedHandler */
export type HandlerPayloadType<T extends CurriedHandler> = T extends CurriedHandler<infer P> ? P : any

export declare function createType(namespace: string, actionName: string): string;

export declare function compileActionTypes<T extends StrMap<CurriedHandler>>(
    namespace: string,
    actions: T,
): Record<keyof T, string>;

export declare function compileActionCreators<T extends StrMap<string>>(types: T):
Record<keyof T, ActionCreator>;

export declare function compileReducer<T extends StrMap<CurriedHandler>>(
    namespace: string,
    actions: T,
): Reducer;

export default createReducer;

/**
 * Namespaces a set of actions into action types, action creators and
 * a reducer.
 *
 * See https://github.com/wearereasonablepeople/warped-reducers#createReducer
 */
export declare function createReducer(namespace: string):
<T extends StrMap<CurriedHandler>>(actions: T) => {
    types: {[K in keyof T]: string};
    actions: {[K in keyof T]: ActionCreator<HandlerPayloadType<T[K]>>};
    reducer: Reducer;
};

/**
 * A conveniently named function that does nothing to your state.
 *
 * See https://github.com/wearereasonablepeople/warped-reducers#noopAction
 */
export declare var noopAction: CurriedHandler<null>;
