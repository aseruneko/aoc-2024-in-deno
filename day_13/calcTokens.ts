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
    this.prise = { x: rules[4], y: rules[5] };
  }

  way(): [number, number] | undefined {
    let aTimes = 0;
    while (true) {
      if (
        aTimes * this.a.x > this.prise.x || aTimes * this.a.y > this.prise.y
      ) return undefined;
      const restX = this.prise.x - aTimes * this.a.x;
      const restY = this.prise.y - aTimes * this.a.y;
      if (
        restX % this.b.x === 0 &&
        restY % this.b.y === 0 &&
        restX / this.b.x === restY / this.b.y
      ) {
        return [
          aTimes,
          restX / this.b.x,
        ];
      }
      aTimes++;
    }
  }

  get tokenCost(): number | undefined {
    const way = this.way();
    if (!way) return undefined;
    return way[0] * 3 + way[1];
  }
}
