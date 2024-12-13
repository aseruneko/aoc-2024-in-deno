Deno.readTextFile("./inputs/day_13_input").then((txt: string) => {
  const rows = txt.split("\r\n\r\n").map((res) =>
    res.replaceAll("\r\n", ",").replace(/[^0-9,]/g, "").split(",").map((r) =>
      parseInt(r)
    )
  );
  const machines = rows.map((row) => new ClawMachine(row));
  console.log(
    machines.map((m) => m.tokenCost).reduce((a, b) => (a ?? 0) + (b ?? 0)),
  );
});

class ClawMachine {
  a: { x: number; y: number };
  b: { x: number; y: number };
  prise: { x: number; y: number };

  constructor(
    rules: number[],
  ) {
    this.a = { x: rules[0], y: rules[1] };
    this.b = { x: rules[2], y: rules[3] };
    this.prise = { x: rules[4] + 10000000000000, y: rules[5] + 10000000000000 };
  }

  way(): [number, number] | undefined {
    const b = Math.round(
      (this.prise.y - (this.a.y * this.prise.x) / this.a.x) /
        (this.b.y - (this.b.x * this.a.y) / this.a.x),
    );
    const a = Math.round((this.prise.x - this.b.x * b) / this.a.x);
    if (a < 0 || b < 0) return undefined;
    if (
      !(this.a.x * a + this.b.x * b === this.prise.x &&
        this.a.y * a + this.b.y * b === this.prise.y)
    ) return undefined;
    return [a, b];
  }

  get tokenCost(): number | undefined {
    const way = this.way();
    if (!way) return undefined;
    return way[0] * 3 + way[1];
  }
}
