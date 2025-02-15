// This file was auto-generated by Claude Opus 3 from the flapjax.js source code.
// It definitely has bugs.

interface Pulse<T> {
  stamp: number;
  value: T;
}

interface PriorityQueueItem {
  k: number;
  n: EventStream<any>;
  v: Pulse<any>;
}

declare class PQ {
  private val: PriorityQueueItem[];
  insert(kv: PriorityQueueItem): void;
  isEmpty(): boolean;
  pop(): PriorityQueueItem;
}

declare class EventStream<T> {
  updater: (pulse: Pulse<T>) => Pulse<T> | typeof doNotPropagate;
  sendsTo: EventStream<any>[];
  rank: number;

  attachListener(dependent: EventStream<any>): void;
  removeListener(dependent: EventStream<any>, isWeak?: boolean): void;

  // Core operations
  mapE<U>(f: (value: T) => U): EventStream<U>;
  filterE(pred: (value: T) => boolean): EventStream<T>;
  mergeE(...streams: EventStream<T>[]): EventStream<T>;
  bindE<U>(k: (value: T) => EventStream<U>): EventStream<U>;
  constantE<U>(constantValue: U): EventStream<U>;

  // Time-based operations
  delayE(time: number | Behavior<number>): EventStream<T>;
  blindE(time: number | Behavior<number>): EventStream<T>;
  calmE(time: number | Behavior<number>): EventStream<T>;

  // State operations
  startsWith(init: T): Behavior<T>;
  collectE<U>(init: U, fold: (current: T, acc: U) => U): EventStream<U>;

  // Control flow
  switchE(): EventStream<T>;
  ifE<U>(thenE: EventStream<U>, elseE: EventStream<U>): EventStream<U>;

  // Filtering operations
  skipFirstE(): EventStream<T>;
  onceE(): EventStream<T>;
  filterRepeatsE(optStart?: T): EventStream<T>;

  // Boolean operations
  notE(): EventStream<boolean>;
  andE(...others: EventStream<boolean>[]): EventStream<boolean>;
  orE(...others: EventStream<boolean>[]): EventStream<boolean>;

  // DOM-specific operations
  snapshotE<U>(valueB: Behavior<U>): EventStream<U>;
}

declare class Behavior<T> {
  last: T;
  underlying: EventStream<T>;
  underlyingRaw: EventStream<T>;

  // Core operations
  valueNow(): T;
  changes(): EventStream<T>;

  // Transformation
  switchB(): Behavior<T>;
  delayB(time: number | Behavior<number>, init?: T): Behavior<T>;
  blindB(intervalB: number | Behavior<number>): Behavior<T>;
  calmB(intervalB: number | Behavior<number>): Behavior<T>;

  // Boolean operations
  notB(): Behavior<boolean>;
  andB(...others: Behavior<boolean>[]): Behavior<boolean>;
  orB(...others: Behavior<boolean>[]): Behavior<boolean>;

  // Control flow
  ifB<U>(trueB: Behavior<U> | U, falseB: Behavior<U> | U): Behavior<U>;

  // Lifting
  liftB<U>(f: (val: T) => U): Behavior<U>;

  // DOM
  sendBehavior(val: T): void;
}

type InsertPosition =
  | "over"
  | "before"
  | "after"
  | "leftMost"
  | "rightMost"
  | "beginning"
  | "end";

type DomConstructor = (
  attributes?: object,
  ...children: (Node | string | Behavior<any>)[]
) => HTMLElement;

interface WebServiceRequest {
  url: string;
  request?: "get" | "post" | "rawPost" | "rest";
  fields?: object;
  body?: string;
  response?: "json" | "xml" | "plain";
  async?: boolean;
}

// Global constants and values
declare const doNotPropagate: unique symbol;

// Core event constructors
declare function receiverE<T>(): EventStream<T>;
declare function zeroE<T>(): EventStream<T>;
declare function oneE<T>(val: T): EventStream<T>;
declare function mergeE<S, T>(
  stream1: EventStream<S>,
  stream2: EventStream<T>
): EventStream<S | T>;

// Behavior constructors and operations
declare function constantB<T>(val: T): Behavior<T>;
declare function timerB(interval: number): Behavior<number>;
declare function delayB<T>(
  srcB: Behavior<T>,
  timeB: number | Behavior<number>,
  init?: T
): Behavior<T>;
declare function liftB<T>(
  fn: Function,
  ...behaviors: Behavior<any>[]
): Behavior<T>;

// DOM Event utilities
declare function extractEventE(
  elt: HTMLElement | Behavior<HTMLElement>,
  eventName: string
): EventStream<Event>;
declare function insertValueB<T>(
  triggerB: Behavior<T>,
  domObj: HTMLElement | string,
  ...indices: string[]
): void;
declare function insertDomB(
  initTriggerB: Behavior<Node | string> | Node | string,
  optID?: string | null,
  optPosition?: InsertPosition,
  unsafe?: boolean
): Behavior<Node>;
declare function extractValueB<T>(domObj: HTMLElement | string): Behavior<T>;
declare function extractValueStaticB<T>(
  domObj: HTMLElement | string,
  triggerE?: EventStream<any>
): Behavior<T>;

// Web service combinators
declare function getWebServiceObjectE(
  requestE: EventStream<WebServiceRequest>
): EventStream<any>;

// Mouse event utilities
declare function mouseE(
  elem: HTMLElement
): EventStream<{ left: number; top: number }>;
declare function mouseB(
  elem: HTMLElement
): Behavior<{ left: number; top: number }>;
declare function clicksE(elem: HTMLElement): EventStream<Event>;

// DOM Element constructors (as globals)
declare const DIV: DomConstructor;
declare const SPAN: DomConstructor;
declare const INPUT: DomConstructor;
declare const BUTTON: DomConstructor;
declare const A: DomConstructor;
declare const BLOCKQUOTE: DomConstructor;
declare const BR: DomConstructor;
declare const CANVAS: DomConstructor;
declare const FIELDSET: DomConstructor;
declare const FORM: DomConstructor;
declare const H1: DomConstructor;
declare const H2: DomConstructor;
declare const H3: DomConstructor;
declare const H4: DomConstructor;
declare const HR: DomConstructor;
declare const IMG: DomConstructor;
declare const IFRAME: DomConstructor;
declare const LABEL: DomConstructor;
declare const LEGEND: DomConstructor;
declare const LI: DomConstructor;
declare const OL: DomConstructor;
declare const OPTGROUP: DomConstructor;
declare const OPTION: DomConstructor;
declare const P: DomConstructor;
declare const PRE: DomConstructor;
declare const SELECT: DomConstructor;
declare const STRONG: DomConstructor;
declare const TABLE: DomConstructor;
declare const TBODY: DomConstructor;
declare const TD: DomConstructor;
declare const TEXTAREA: DomConstructor;
declare const TFOOT: DomConstructor;
declare const TH: DomConstructor;
declare const THEAD: DomConstructor;
declare const TR: DomConstructor;
declare const TT: DomConstructor;
declare const UL: DomConstructor;

// Additional utility functions
declare function sendEvent<S extends T>(node: EventStream<S>, value: T): void;
declare function valueNow<T>(behavior: Behavior<T>): T;
declare function changes<T>(behavior: Behavior<T>): EventStream<T>;
declare function filterRepeatsE<T>(
  sourceE: EventStream<T>,
  optStart?: T
): EventStream<T>;
declare function andE(...nodes: EventStream<boolean>[]): EventStream<boolean>;
declare function orE(...nodes: EventStream<boolean>[]): EventStream<boolean>;
declare function delayE<T>(
  sourceE: EventStream<T>,
  interval: number | Behavior<number>
): EventStream<T>;
declare function blindE<T>(
  sourceE: EventStream<T>,
  interval: number | Behavior<number>
): EventStream<T>;
declare function calmE<T>(
  sourceE: EventStream<T>,
  interval: number | Behavior<number>
): EventStream<T>;
declare function insertDom(
  replaceWithD: Node | string,
  hook: string | Node,
  optPosition?: InsertPosition
): void;
declare function getObj(name: string | Node): Node;

// Compiler support functions
declare function compilerInsertDomB(
  mixedB: Behavior<any> | any,
  target: string | Node
): void;
declare function compilerInsertValueB(
  mixedB: Behavior<any> | any,
  target: string | Node,
  attrib: string
): void;
declare function compilerLift(f: Function, ...args: any[]): any;
declare function compilerCall(f: Function, ...args: any[]): any;
declare function compilerIf(test: any, cons: any, alt: any): any;
declare function compilerEventStreamArg(x: any): any;
declare function compilerUnbehavior(v: any): any;
