export interface Row {
  id: number;
  label: string;
}

const ADJECTIVES = [
  "pretty",
  "large",
  "big",
  "small",
  "tall",
  "short",
  "long",
  "handsome",
  "plain",
  "quaint",
  "clean",
  "elegant",
  "easy",
  "angry",
  "crazy",
  "helpful",
  "mushy",
  "odd",
  "unsightly",
  "adorable",
  "important",
  "inexpensive",
  "cheap",
  "expensive",
  "fancy"
];
const COLORS = [
  "red",
  "yellow",
  "blue",
  "green",
  "pink",
  "brown",
  "purple",
  "brown",
  "white",
  "black",
  "orange"
];
const NOUNS = [
  "table",
  "chair",
  "house",
  "bbq",
  "desk",
  "car",
  "pony",
  "cookie",
  "sandwich",
  "burger",
  "pizza",
  "mouse",
  "keyboard"
];

const pick = (words: string[]) =>
  words[Math.round(Math.random() * 1000) % words.length];
const genLabel = () => `${pick(ADJECTIVES)} ${pick(COLORS)} ${pick(NOUNS)}`;

export class DataGenerator {
  id = 0;

  gen(): Row {
    let id = this.id;
    this.id += 1;
    return { id: this.id, label: genLabel() };
  }

  genMany(): Row[] {
    let data = [];
    for (let i = 0; i < 1000; ++i) {
      data.push(this.gen());
    }
    return data;
  }
}
