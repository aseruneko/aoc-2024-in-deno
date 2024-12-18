Deno.readTextFile("./inputs/day_16_input").then((txt: string) => {
  const maze = new Maze(txt);
  maze.explore(maze.start);
  maze.checkBestPaths();
  maze.visualizePath();
  console.log(maze.bestPathsCount);
});

type Coord = [number, number];
const Coord = {
  eq(a: Coord, b: Coord): boolean {
    return a[0] === b[0] && a[1] === b[1];
  },
  move(c: Coord, d: Direction): Coord {
    return [c[0] + DirectionCoord[d][0], c[1] + DirectionCoord[d][1]];
  },
};

const Directions = ["Up", "Right", "Down", "Left"] as const;
type Direction = typeof Directions[number];
const Direction = {
  turnRight(d: Direction) {
    const i = Directions.indexOf(d) + 1;
    return Directions[i === 4 ? 0 : i];
  },
  turnLeft(d: Direction) {
    const i = Directions.indexOf(d) - 1;
    return Directions[i === -1 ? 3 : i];
  },
  turnBack(d: Direction) {
    const i = Directions.indexOf(d) - 2;
    return Directions[i < 0 ? i + 4 : i];
  },
};
const DirectionCoord: Record<Direction, Coord> = {
  [Directions[0]]: [-1, 0],
  [Directions[1]]: [0, 1],
  [Directions[2]]: [1, 0],
  [Directions[3]]: [0, -1],
};

type DecStr = { value: string; style: string };
const DecStr = {
  console(decStr: DecStr[]) {
    console.log(
      decStr.map((d) => "%c" + d.value).join(""),
      ...decStr.map((d) => d.style),
    );
  },
  default(value: string) {
    return { value: value, style: "color: white;" };
  },
};
function colorCode(v: number | undefined, step: number = 0.01) {
  if (!v) return "#000000";
  return "hsl(" + v * step % 360 + ", 100%, 50%);";
}

class Cell {
  readonly value: string;
  public memCost: Record<Direction, number | undefined> = {
    [Directions[0]]: undefined,
    [Directions[1]]: undefined,
    [Directions[2]]: undefined,
    [Directions[3]]: undefined,
  };
  public isBestPath?: boolean;

  constructor(
    value: string,
  ) {
    this.value = value === "#" ? "#" : ".";
  }

  get cost() {
    const costs = Object.values(this.memCost).flatMap((mc) => mc ? [mc] : []);
    return costs.toSorted().at(0);
  }

  visualizeCost(): DecStr {
    if (this.value === "#") return DecStr.default("#");
    const cost = this.cost;
    if (cost === undefined) return DecStr.default(".");
    return {
      value: (cost % 10).toString(),
      style: `color: ${colorCode(cost)};`,
    };
  }

  visualizePath(): DecStr {
    if (this.value === "#") return DecStr.default("#");
    if (this.isBestPath !== true) return DecStr.default(".");
    return {
      value: "O",
      style: `color: red;`,
    };
  }

  explore(d: Direction, cost: number): "FAILURE" | "SUCCESS" | "TOO_EXPENSIVE" {
    if (this.value === "#") return "FAILURE";
    const memCost = this.memCost[d] ?? Number.MAX_SAFE_INTEGER;
    if (memCost <= cost) return "TOO_EXPENSIVE";
    this.memCost[d] = cost;
    return "SUCCESS";
  }

  checkBestPath(d: Direction, cost: number): boolean {
    if (cost !== this.memCost[Direction.turnBack(d)]) return false;
    this.isBestPath = true;
    return true;
  }
}

class Maze {
  map: Cell[][];
  start: Coord;
  end: Coord;
  constructor(
    str: string,
  ) {
    const map: Cell[][] = [];
    let [start, end]: [Coord, Coord] = [[0, 0], [0, 0]];
    str.split("\r\n").forEach((rowStr, i) => {
      const row: Cell[] = [];
      rowStr.split("").forEach((cellStr, j) => {
        if (cellStr === "S") start = [i, j];
        if (cellStr === "E") end = [i, j];
        row.push(new Cell(cellStr));
      });
      map.push(row);
    });
    [this.map, this.start, this.end] = [map, start, end];
  }

  explore(pos: Coord, d: Direction = Directions[1], cost: number = 0) {
    if (this.map[pos[0]][pos[1]].explore(d, cost) === "SUCCESS") {
      this.explore(Coord.move(pos, d), d, cost + 1);
      this.explore(pos, Direction.turnRight(d), cost + 1000);
      this.explore(pos, Direction.turnLeft(d), cost + 1000);
    }
  }

  checkBestPaths() {
    Directions.map((d) => {
      this._checkBestPaths(
        this.end,
        d,
        this.map[this.end[0]][this.end[1]].cost,
      );
    });
  }

  private _checkBestPaths(
    pos: Coord,
    d: Direction = Directions[1],
    cost: number = 0,
  ) {
    if (this.map[pos[0]][pos[1]].checkBestPath(d, cost)) {
      this._checkBestPaths(Coord.move(pos, d), d, cost - 1);
      this._checkBestPaths(pos, Direction.turnRight(d), cost - 1000);
      this._checkBestPaths(pos, Direction.turnLeft(d), cost - 1000);
    }
  }

  get bestPathsCount() {
    return this.map.flatMap((row) => row.filter((cell) => cell.isBestPath))
      .length;
  }

  visualizeCost() {
    const output = this.map.map((row, i) => {
      return row.map((cell, j) => {
        if (Coord.eq(this.start, [i, j])) return DecStr.default("S");
        if (Coord.eq(this.end, [i, j])) return DecStr.default("E");
        return cell.visualizeCost();
      });
    });
    console.clear();
    output.forEach((o) => DecStr.console(o));
  }

  visualizePath() {
    const output = this.map.map((row) => {
      return row.map((cell) => {
        return cell.visualizePath();
      });
    });
    console.clear();
    output.forEach((o) => DecStr.console(o));
  }
}
