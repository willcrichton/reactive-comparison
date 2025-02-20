export class Signal<E> {
  subscribers: ((effect: E) => void)[] = [];

  emit(eff: E) {
    this.subscribers.forEach(f => f(eff));
  }

  subscribe(f: (effect: E) => void): () => void {
    this.subscribers.push(f);
    return () => {
      let idx = this.subscribers.findIndex(f2 => f === f2);
      if (idx === -1) throw new Error("f is not a subscriber");
      this.subscribers.splice(idx, 1);
    };
  }
}

export interface RwSignal<R, W> {
  read: Signal<R>;
  write: Signal<W>;
}

function newRwSignal<R, W>(): RwSignal<R, W> {
  return {
    read: new Signal(),
    write: new Signal()
  };
}

const SIGNALS: RwSignal<any, any>[] = [];

export interface Tagged {
  type: string;
}
export type BaseRead = { type: "get" };
export type BaseWrite = { type: "set" };

export class Incr<
  T,
  R extends Tagged | never = never,
  W extends Tagged | never = never
> {
  signal: RwSignal<R | BaseRead, W | BaseWrite> = newRwSignal();

  constructor(public t: T) {
    SIGNALS.push(this.signal);
  }

  get(): T {
    this.signal.read.emit({ type: "get" });
    return this.t;
  }

  set(t: T) {
    this.t = t;
    this.signal.write.emit({ type: "set" });
  }

  lift<U>(f: (el: T) => U): Incr<U> {
    return new IncrLift(this, f).out;
  }

  clone(): Incr<T, R, W> {
    return new Incr(structuredClone(this.t));
  }
}

let debugFn = (f: (..._: any) => any) =>
  f.name !== "" ? f.name : f.toString();

export class IncrLift<
  I,
  O,
  R extends Tagged | never,
  W extends Tagged | never
> {
  out: Incr<O>;

  constructor(
    readonly inp: Incr<I, R, W>,
    readonly f: (inp: I) => O
  ) {
    this.out = new Incr(f(inp.get()));
    inp.signal.write.subscribe(this.update.bind(this));
  }

  update(eff: W | BaseWrite) {
    // if (eff.type === "set") {
    this.out.set(this.f(this.inp.get()));
    // }
  }
}

export type ArrayWrite =
  | {
      type: "setIndex";
      index: number;
    }
  | {
      type: "insert";
      index: number;
    }
  | {
      type: "remove";
      index: number;
    };

export class IncrArray<T> extends Incr<Incr<T>[], never, ArrayWrite> {
  constructor(t: Incr<T>[]) {
    super(t);
    this.t.forEach(this.subscribeElement.bind(this));
  }

  subscribeElement(el: Incr<T>, index: number) {
    el.signal.write.subscribe(effect => {
      if (effect.type === "set") {
        this.signal.write.emit({ type: "setIndex", index });
      }
    });
  }

  map<S>(f: (el: Incr<T>, i: number) => S): IncrArray<S> {
    return new IncrArrayMap(this, f).out;
  }

  filter(f: (el: Incr<T>) => boolean): IncrArray<T> {
    return new IncrArrayFilter(this, f).out;
  }

  setIndex(index: number, t: T) {
    this.t[index].set(t);
    this.signal.write.emit({ type: "setIndex", index });
  }

  rawInsert(index: number, t: Incr<T>) {
    this.t.splice(index, 1, t);
    this.subscribeElement(t, index);
    this.signal.write.emit({ type: "insert", index });
  }

  insert(index: number, t: T) {
    this.rawInsert(index, new Incr(t));
  }

  push(t: T) {
    this.insert(this.t.length, t);
  }

  remove(index: number) {
    this.t.splice(index, 1);
    this.signal.write.emit({ type: "remove", index });
  }

  swap(i: number, j: number) {
    let tmp = this.t[i].get();
    this.t[i].set(this.t[j].get());
    this.t[j].set(tmp);
  }
}

export let incrArray = <T>(...inp: Incr<T>[]): IncrArray<T> =>
  new IncrArray(inp);
export let array = <T>(...inp: T[]): IncrArray<T> =>
  new IncrArray(inp.map(t => new Incr(t)));

export class IncrArrayMap<I, O> {
  out: IncrArray<O>;

  constructor(
    readonly inp: IncrArray<I>,
    readonly f: (el: Incr<I>, i: number) => O
  ) {
    this.out = new IncrArray(inp.get().map((el, i) => new Incr(f(el, i))));
    inp.signal.write.subscribe(this.update.bind(this));
  }

  update(eff: BaseWrite | ArrayWrite) {
    console.debug("Map", eff, debugFn(this.f));
    if (eff.type === "setIndex") {
      let inpEl = this.inp.get()[eff.index];
      let outEl = this.f(inpEl, eff.index);
      this.out.setIndex(eff.index, outEl);
    } else if (eff.type === "insert") {
      let inpEl = this.inp.get()[eff.index];
      let outEl = this.f(inpEl, eff.index);
      this.out.insert(eff.index, outEl);
    } else if (eff.type === "remove") {
      this.out.remove(eff.index);
    } else if (eff.type === "set") {
      this.out.set(this.inp.get().map((el, i) => new Incr(this.f(el, i))));
    }
  }
}

export class FilterIndex<T> {
  // Invariant: a[i] = j if f(a[i]) is true and a[i] is at b[j]
  idxs: (number | null)[];
  constructor(els: Incr<T>[], f: (t: Incr<T>) => boolean) {
    let i = 0;
    this.idxs = els.map(el => {
      if (f(el)) {
        let j = i;
        i += 1;
        return j;
      } else {
        return null;
      }
    });
  }

  private seekFrom(start: number): number | null {
    for (let j = start; j >= 0; j--) {
      if (this.idxs[j] !== null) return this.idxs[j];
    }
    return null;
  }

  set(srcIdx: number, pred: boolean): { idx: number | null; changed: boolean } {
    if (pred) {
      if (this.idxs[srcIdx] === null) {
        let lastIdx = this.seekFrom(srcIdx);
        let dstIdx = lastIdx !== null ? lastIdx + 1 : 0;
        this.idxs[srcIdx] = dstIdx;
        for (let i = srcIdx + 1; i < this.idxs.length; ++i) {
          if (this.idxs[i] !== null) this.idxs[i]! += 1;
        }
        return { idx: dstIdx, changed: true };
      } else {
        return { idx: this.idxs[srcIdx], changed: false };
      }
    } else {
      if (this.idxs[srcIdx] !== null) {
        let dstIdx = this.idxs[srcIdx]!;
        this.idxs[srcIdx] = null;
        for (let i = srcIdx + 1; i < this.idxs.length; ++i) {
          if (this.idxs[i] !== null) this.idxs[i]! -= 1;
        }
        return { idx: dstIdx, changed: true };
      } else {
        return { idx: null, changed: false };
      }
    }
  }

  insert(srcIdx: number, pred: boolean): number | null {
    if (pred) {
      let dstIdx: number;
      if (srcIdx === this.idxs.length) {
        let maxIdx = this.seekFrom(this.idxs.length - 1);
        dstIdx = maxIdx !== null ? maxIdx + 1 : 0;
      } else {
        dstIdx = this.seekFrom(srcIdx) || 0;
      }
      this.idxs.splice(srcIdx, 0, dstIdx);
      return dstIdx;
    } else {
      this.idxs.splice(srcIdx, 0, null);
      return null;
    }
  }

  remove(srcIdx: number, pred: boolean) {
    throw new Error("todo");
  }
}

export class IncrArrayFilter<T> {
  out: IncrArray<T>;
  index: FilterIndex<T>;

  constructor(
    readonly inp: IncrArray<T>,
    readonly f: (el: Incr<T>) => boolean
  ) {
    this.index = new FilterIndex(inp.get(), f);
    this.out = new IncrArray(inp.get().filter(f));
    inp.signal.write.subscribe(this.update.bind(this));
  }

  update(eff: BaseWrite | ArrayWrite) {
    console.debug("Filter", eff, debugFn(this.f));
    if (eff.type === "setIndex") {
      let inpEl = this.inp.get()[eff.index];
      let pred = this.f(inpEl);
      let setResult = this.index.set(eff.index, pred);
      if (setResult.changed) {
        if (pred) this.out.rawInsert(setResult.idx!, inpEl.clone());
        else this.out.remove(setResult.idx!);
      } else if (setResult.idx !== null) {
        this.out.setIndex(setResult.idx, inpEl.get());
      }
    } else if (eff.type === "insert") {
      let inpEl = this.inp.get()[eff.index];
      let pred = this.f(inpEl);
      let dstIdx = this.index.insert(eff.index, pred);
      if (pred) this.out.rawInsert(dstIdx!, inpEl);
    } else if (eff.type === "remove") {
      // let inpEl = this.inp.els[eff.index];
      // let pred = this.f(inpEl);
      // let dstIdx = this.index.remove(eff.index, pred);
      // if (pred) this.out.remove(dstIdx);
    } else if (eff.type === "set") {
    }
  }
}

export class IncrElement {
  el: HTMLElement;

  constructor(
    readonly tag: string,
    readonly children: IncrArray<Node>
  ) {
    this.el = document.createElement(tag);
    this.el.append(...children.get().map(child => child.get()));
    children.signal.write.subscribe(this.update.bind(this));
  }

  update(eff: BaseWrite | ArrayWrite) {
    if (eff.type === "setIndex") {
      let oldChild = this.el.childNodes[eff.index];
      let newChild = this.children.get()[eff.index];
      this.el.replaceChild(newChild.get(), oldChild);
    } else if (eff.type === "insert") {
      let oldChild =
        eff.index === this.children.get().length
          ? null
          : this.el.childNodes[eff.index];
      let newChild = this.children.get()[eff.index];
      this.el.insertBefore(newChild.get(), oldChild);
    } else if (eff.type === "remove") {
      // todo
    }
  }
}

export let element = (tag: string, children: IncrArray<Node>): HTMLElement =>
  new IncrElement(tag, children).el;

export function autorun(f: () => void) {
  let fSignals: Signal<any>[] = [];
  let disposers = SIGNALS.map(signal =>
    signal.read.subscribe(() => fSignals.push(signal.write))
  );
  f();
  disposers.forEach(dispose => dispose());
  fSignals.forEach(signal => signal.subscribe(f));
}
