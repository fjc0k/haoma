import { StrictOmit } from 'ts-essentials';

/**
 * 同 `T | T[]`。
 *
 * @public
 * @example
 * ```typescript
 * type X = OneOrMore<number> // => number | number[]
 * ```
 */
declare type OneOrMore<T> = T | T[];

/**
 * 首先，每一行紧跟前导空白的插入值为多行时，保持缩进。
 * 然后，移除每一行的公共前导空白。
 *
 * @public
 * @param literals 字面值
 * @param interpolations 插入值
 * @returns 返回处理后的结果
 * @example
 * ```typescript
 * dedent` a\n b` // => 'a\nb'
 * ```
 */
declare function dedent(literals: TemplateStringsArray, ...interpolations: Array<string | number>): string;

declare type EventBusListenerTag = string | number;
declare type EventBusListener<TCallback extends (...args: any[]) => any = (...args: any[]) => any> = TCallback & {
    __EVENT_BUS_TAG__?: EventBusListenerTag;
};
declare type EventBusOffListener = () => any;
declare type EventBusListeners = Record<string, EventBusListener>;
interface EventBusListenerDescriptor<TListenerName extends keyof EventBusListeners> {
    name: TListenerName;
    context?: any;
    tag?: EventBusListenerTag;
}
declare type EventBusBeforeOn<TListeners extends EventBusListeners> = {
    [TListenerName in keyof TListeners]?: (this: EventBus<TListeners>, callback: EventBusListener<TListeners[TListenerName]>) => TListeners[TListenerName];
};
declare type EventBusBeforeEmit<TListeners extends EventBusListeners> = {
    [TListenerName in keyof TListeners]?: (this: EventBus<TListeners>, context: any) => any;
};
interface EventBusOptions<TListeners extends EventBusListeners> {
    beforeOn?: EventBusBeforeOn<TListeners>;
    beforeEmit?: EventBusBeforeEmit<TListeners>;
}
/**
 * 事件巴士，管理事件的发布与订阅。
 *
 * @template TListeners 事件名称及其对应的回调描述
 * @example
 * ```typescript
 * const bus = new EventBus<{
 *   success: (payload: { message: string }) => any
 * }>()
 * bus.on('success', ({ message }) => console.log(message))
 * bus.emit('success', { message: '提交成功' })
 * // => 控制台输出: 提交成功
 * ```
 */
declare class EventBus<TListeners extends EventBusListeners> {
    private options?;
    /**
     * 构造函数。
     */
    constructor(options?: EventBusOptions<TListeners> | undefined);
    /**
     * 回调列表。
     */
    private callbacks;
    /**
     * 订阅事件。
     *
     * @param eventName 事件名称
     * @param callback 事件触发回调
     * @returns 返回取消订阅的函数
     */
    on<TListenerName extends keyof TListeners>(eventName: TListenerName, callback: TListeners[TListenerName]): EventBusOffListener;
    /**
     * 订阅事件，但只订阅一次即取消订阅。
     *
     * @param eventName 事件名称
     * @param callback 事件触发回调
     * @returns 返回取消订阅的函数
     */
    once<TListenerName extends keyof TListeners>(eventName: TListenerName, callback: TListeners[TListenerName]): EventBusOffListener;
    /**
     * 取消订阅事件，若没有指定回调，则取消所有回调。
     *
     * @param eventName 事件名称
     * @param callback 事件触发回调
     */
    off<TListenerName extends keyof TListeners>(eventName: TListenerName, callbackOrTag?: TListeners[TListenerName] | string | number): void;
    /**
     * 发布事件。
     *
     * @param eventNameAndContext 事件名称和上下文
     * @param args 传给事件回调的参数
     * @returns 返回各事件回调的返回结果组成的数组
     */
    emit<TListenerName extends keyof TListeners>(eventName: TListenerName | EventBusListenerDescriptor<TListenerName>, ...args: Parameters<TListeners[TListenerName]>): Array<ReturnType<TListeners[TListenerName]>>;
    /**
     * 清空事件订阅。
     */
    clear(): void;
    /**
     * 销毁。
     */
    destroy(): void;
}

/**
 * 同 {@link https://lodash.com/docs/4.17.15#omit | omit}，不过采用了严格的类型定义。
 *
 * @public
 */
declare const omitStrict: <T extends Record<any, any>, K extends keyof T>(object: T, ...paths: OneOrMore<K>[]) => StrictOmit<T, K>;

/**
 * @public
 */
interface WaitResult<T> extends Promise<T> {
    /**
     * 取消等待，不执行后续逻辑。
     */
    cancel: () => void;
}
/**
 * 等待一段时间 resolve。
 *
 * @public
 * @param milliseconds 等待时间(毫秒)
 * @param value resolve 值
 * @example
 * ```typescript
 * wait(1000).then(() => {
 *   console.log('ok')
 * }) // => 1秒后在控制台打印字符串: ok
 * ```
 */
declare function wait<T>(milliseconds: number, value?: T): WaitResult<T>;
declare namespace wait {
    var reject: (milliseconds: number, value?: any) => WaitResult<void>;
}

export { EventBus, dedent, omitStrict, wait };
