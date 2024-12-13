Deno.readTextFile("./inputs/day_12_input").then((txt: string) => {
  const rows = txt.split("\r\n").map((r) => r.split(""));
  const garden = new GardenMap(rows);
  console.log(garden.totalCost);
});

type Cell = { type: string; searched: boolean };
type Result = { area: number; corners: string[] };
const Result = {
  AlreadySearched: { area: 0, corners: [] } as Result,
  NotSame: { area: 0, corners: [] } as Result,
};

const Directions = {
  North: [-1, 0],
  South: [1, 0],
  East: [0, 1],
  West: [0, -1],
} as const;
const Diagonals = {
  NE: [-1, 1],
  SE: [1, 1],
  SW: [1, -1],
  NW: [-1, -1],
};
type Direction = (typeof Directions)[keyof typeof Directions];

function nexts(i: number, j: number): [number, number][] {
  return Object.values(Directions).map(([y, x]) =>
    [i + y, j + x] as [number, number]
  );
}

class GardenMap {
  map: Cell[][];
  w: number;
  h: number;

  constructor(rows: string[][]) {
    this.map = rows.map((row) =>
      row.map((cell) => ({
        type: cell,
        searched: false,
      }))
    );
    this.h = this.map.length;
    this.w = this.map[0].length;
  }

  paint(y: number, x: number, type?: string): Result {
    if (!(y >= 0 && x >= 0 && y < this.h && x < this.w)) return Result.NotSame;
    const painting = type ?? this.map[y][x].type;
    if (this.map[y][x].type !== painting) return Result.NotSame;
    if (this.map[y][x].searched) return Result.AlreadySearched;
    this.map[y][x].searched = true;
    const corners: string[] = [];
    if (this.isCornerNW(y, x)) corners.push(`${y},${x}`);
    if (this.isCornerNE(y, x)) corners.push(`${y},${x + 1}`);
    if (this.isCornerSW(y, x)) corners.push(`${y + 1},${x}`);
    if (this.isCornerSE(y, x)) corners.push(`${y + 1},${x + 1}`);
    const results = nexts(y, x).map(([ny, nx]) => this.paint(ny, nx, painting));
    return {
      area: results.map((res) => res.area).reduce((a, b) => a + b) + 1,
      corners: [...corners, ...results.flatMap((res) => res.corners)],
    };
  }

  estimate(): Result[] {
    const results: Result[] = [];
    for (let i = 0; i < this.h; i++) {
      for (let j = 0; j < this.w; j++) {
        if (!this.map[i][j].searched) {
          results.push(this.paint(i, j));
        }
      }
    }
    return results;
  }

  visualize() {
    let output = "";
    const outputStyle: string[] = [];
    this.map.forEach((row) => {
      row.forEach((cell) => {
        output += "%c" + cell.type;
        outputStyle.push(
          cell.searched ? "color: red" : "color: white",
        );
      });
      output += "\r\n";
    });
    console.log(output, ...outputStyle);
  }

  isCornerNE(i: number, j: number) {
    const bools = [Directions.North, Diagonals.NE, Directions.East].map(
      ([y, x]) => this.isTypeOf(this.map[i][j].type, i + y, j + x),
    ).join("");
    return ["fff", "ftf", "tft"].includes(bools);
  }

  isCornerSE(i: number, j: number) {
    const bools = [Directions.South, Diagonals.SE, Directions.East].map(
      ([y, x]) => this.isTypeOf(this.map[i][j].type, i + y, j + x),
    ).join("");
    return ["fff", "ftf", "tft"].includes(bools);
  }

  isCornerSW(i: number, j: number) {
    const bools = [Directions.South, Diagonals.SW, Directions.West].map(
      ([y, x]) => this.isTypeOf(this.map[i][j].type, i + y, j + x),
    ).join("");
    return ["fff", "ftf", "tft"].includes(bools);
  }

  isCornerNW(i: number, j: number) {
    const bools = [Directions.North, Diagonals.NW, Directions.West].map(
      ([y, x]) => this.isTypeOf(this.map[i][j].type, i + y, j + x),
    ).join("");
    return ["fff", "ftf", "tft"].includes(bools);
  }

  isTypeOf(type: string, i: number, j: number) {
    if (!(i >= 0 && j >= 0 && i < this.h && j < this.w)) return "f";
    return this.map[i][j].type === type ? "t" : "f";
  }

  get totalCost() {
    const results = this.estimate();
    return results.map((res) => res.area * res.corners.length).reduce((
      a,
      b,
    ) => a + b);
  }
}
