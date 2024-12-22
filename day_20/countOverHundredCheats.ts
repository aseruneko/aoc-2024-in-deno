import { Coord } from "../util/Coord.ts";
import { Decor } from "../util/Decor.ts";

Deno.readTextFile("./inputs/day_20_input").then((txt: string) => {
  const track = new Track(txt);
  track.explore();
  console.log(
    track.efficiencyMap.entries()
      .filter(([ef]) => ef >= 100).map(([, cnt]) => cnt)
      .reduce((a, b) => a + b),
  );
});

class Cell {
  cost?: number;
  constructor(public value: string) {}

  explore(cost: number) {
    if (this.value === "#") return false;
    if ((this.cost ?? Number.MAX_SAFE_INTEGER) < cost) return false;
    this.cost = cost;
    return true;
  }

  visualize() {
    if (this.cost !== undefined) return Decor.colorized(this.cost);
    return Decor.default(this.value);
  }
}

class Track {
  matrix: Cell[][];
  start: Coord;
  end: Coord;
  width: number;
  height: number;

  constructor(txt: string) {
    let start: Coord;
    let end: Coord;
    this.matrix = txt.split("\r\n").map((row, i) => {
      return row.split("").map((cell, j) => {
        if (cell === "S") start = [i, j];
        if (cell === "E") end = [i, j];
        return new Cell(cell === "#" ? "#" : ".");
      });
    });
    this.start = start!;
    this.end = end!;
    this.height = this.matrix.length;
    this.width = this.matrix[0].length;
  }

  explore() {
    let next: Coord[] = [this.start];
    let cost = 0;
    while (next.length > 0) {
      const n: Coord[] = [];
      next.forEach((from) => {
        if (this.matrix[from[0]][from[1]].explore(cost)) {
          n.push(
            ...Coord.next(from, { width: this.width, height: this.height }),
          );
        }
      });
      cost++;
      next = n;
    }
  }

  get efficiencyMap() {
    const map = new Map<number, number>();
    this.matrix.forEach((row, i) => {
      row.forEach((_, j) => {
        Coord.rangeOfMovement([i, j], 2, {
          width: this.width,
          height: this.height,
        })
          .forEach((to) => {
            const from = [i, j] as Coord;
            const ef = this.efficiencyOf({ from, to });
            if (ef !== undefined) map.set(ef, (map.get(ef) ?? 0) + 1);
          });
      });
    });
    return map;
  }

  efficiencyOf(cheat: Cheat) {
    const fromCost = this.matrix[cheat.from[0]][cheat.from[1]].cost;
    const toCost = this.matrix[cheat.to[0]][cheat.to[1]].cost;
    if (fromCost === undefined || toCost === undefined) return undefined;
    const efficiency = toCost -
      (fromCost + Coord.manhattanDistance(cheat.from, cheat.to));
    return efficiency > 0 ? efficiency : undefined;
  }

  visualize() {
    return this.matrix.map((row) => {
      return row.map((cell) => cell.visualize());
    });
  }
}

type Cheat = { from: Coord; to: Coord };
