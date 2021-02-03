import './eff'
import './x.css'
import { relative } from 'path'

const rrr = {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  xx: () => {},
}

function x1() {
  if (rrr.xx) {
    rrr?.xx()
  }
  const x = `
    ${[1, 2]
      .map(i => {
        return i
      })
      .join(',')}
  `
  return x
}

console.log(x1, relative)
export type x = number

export interface YY {
  x: number
  y: string
  xx?: boolean
}

export function getType(value: unknown): string {
  return Object.prototype.toString.call(value)
}

export class MyClass {
  static x = 1

  private yy = 2

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  foo1 = () => {}

  public foo() {
    //...
  }

  public bar() {
    //...
  }
}

export type DisposerItemName = string | number
export type Dispose = () => void

/**
 * 处置器。
 */
export default class Disposer {
  /**
   * 待处置项目存放容器。
   *
   * @private
   */
  private jar: {
    [name: string]: Dispose[]
  } = Object.create(null)

  /**
   * 将待处置项目加入容器。
   *
   * @param name 待处置项目名称
   * @param dispose 处置行为
   */
  public add(name: DisposerItemName, dispose: Dispose | Dispose[]): void {
    dispose = Array.isArray(dispose) ? dispose : [dispose]
    this.jar[name] = [...(this.jar[name] || []), ...dispose]
  }

  public dispose(name: string): void

  public dispose(name: number): number

  /**
   * 处置项目。
   *
   * @param name 欲处置项目名称
   */
  public dispose(name: unknown, y?: number): unknown {
    return y
  }

  /**
   * 处置所有未处置项目。
   */
  public disposeAll(): void {
    for (const key in this.jar) {
      this.dispose(key)
    }
  }
}

/**
 * 遍历对象的可枚举属性。若回调函数返回 false，遍历会提前退出。
 *
 * @param obj 要遍历的对象
 * @param callback 回调函数
 */
export function forOwn<
  T extends { [key: string]: unknown },
  K extends Extract<keyof T, string>
>(obj: T, callback: (value: T[K], key: K, obj: T) => unknown): void {
  for (const key in obj) {
    /* istanbul ignore else */
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (callback((obj as any)[key], key as K, obj) === false) {
        break
      }
    }
  }
}
export const isInNode2 =
  typeof process !== 'undefined' ? process.versions != null : process != null
export const isInNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null
const obj = {
  x: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  y: { z: 1, fn: () => {} },
  n: [0.2],
}
obj.y.fn()
const x = 1
switch (x) {
  case 1:
    console.log(x + 1)
    break
  default:
    console.log(2)
}

export function p(): Promise<{
  x: number
}> {
  return Promise.resolve({ x: 1 })
}

class Component {}

export class Button extends Component {
  public constructor() {
    super()
  }
}

/**
 * 打算斯洛伐克；啊；发卡量；发的是；反馈递四方速递浪费了；的看法施工队；松岗街道顺口溜国家大事；理发的首付款电动机；附件
 */
export interface TTD {
  x: string
}
