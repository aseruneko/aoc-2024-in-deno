Deno.readTextFile("./inputs/day_19_input").then((txt: string) => {
  const [a, b] = txt.split("\r\n\r\n");
  const towels = new Towels(a);
  const designs = Design.from(b);
  towels.simplify();
  console.log(designs.filter((d) => towels.isAvailable(d)).length);
});

type Towel = string;

class Towels {
  value: Towel[];
  constructor(txt: string) {
    this.value = txt.split(", ");
  }

  isAvailable(d: Design) {
    let cands: Design[] = this.value;
    while (cands.length !== 0) {
      const next = cands.flatMap((c) => this.arrange(c));
      cands = next.filter((n) => d.startsWith(n));
      if (cands.includes(d)) break;
    }
    return (cands.includes(d));
  }

  arrange(acc: Design) {
    return this.value.map((v) => acc + v);
  }

  simplify() {
    while (true) {
      const simplified = this.value.filter((v) => !this.isAvailable(v));
      if (this.value.length !== simplified.length) {
        this.value = simplified;
      } else break;
    }
  }
}

type Design = string;
const Design = {
  from(txt: string): Design[] {
    return txt.split("\r\n");
  },
};
