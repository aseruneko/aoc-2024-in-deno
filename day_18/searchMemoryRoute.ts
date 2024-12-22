import { Coord } from "../util/Coord.ts";
import { Decor } from "../util/Decor.ts";

Deno.readTextFile("./inputs/day_18_input").then((txt: string) => {
  const memory = new Memory(71, 71);
  memory.setCollapseList(txt);
  memory.explore(1024);
  memory.searchBestPath();
  Decor.logMatrix(memory.visualizeBestPath(1024));
  console.log(memory.countLeastSteps);
});

class Cell {
  collapseIn?: number;
  cost?: number;
  isBestPath?: boolean;

  explore(time: number, cost: number): boolean {
    if (time >= (this.collapseIn ?? Number.MAX_SAFE_INTEGER)) return false;
    if ((this.cost ?? Number.MAX_SAFE_INTEGER) > cost) {
      this.cost = cost;
      return true;
    }
    return false;
  }

  visualizeCost(time: number): Decor {
    if (this.cost !== undefined) return Decor.colorized(this.cost, 1);
    return Decor.default(
      time >= (this.collapseIn ?? Number.MAX_SAFE_INTEGER) ? "#" : ".",
    );
  }

  visualizeBestPath(time: number): Decor {
    if (this.isBestPath === true) return Decor.of("O", "white");
    return this.visualizeCost(time);
  }
}

class Memory {
  cells: Cell[][];

  constructor(
    readonly width: number,
    readonly height: number,
  ) {
    this.cells = new Array(height).fill(0).map(() => {
      return new Array(width).fill(0).map(() => {
        return new Cell();
      });
    });
  }

  setCollapseList(txt: string) {
    txt.split("\r\n").forEach((rowTxt, k) => {
      const [j, i] = rowTxt.split(",").map((cell) => parseInt(cell));
      this.cells[i][j].collapseIn = k + 1;
    });
  }

  explore(time: number, from: Coord = [0, 0], cost: number = 0) {
    if (this.cells[from[0]][from[1]].explore(time, cost)) {
      Coord.next(from, { width: this.width, height: this.height }).forEach((
        nxt,
      ) => this.explore(time, nxt, cost + 1));
    }
  }

  searchBestPath(
    from: Coord = [this.height - 1, this.width - 1],
    cost: number = (this.cells[this.height - 1][this.width - 1].cost ??
      Number.MAX_SAFE_INTEGER),
  ) {
    if (this.cells[from[0]][from[1]].cost === cost) {
      this.cells[from[0]][from[1]].isBestPath = true;
      Coord.next(from, { width: this.width, height: this.height }).some((
        nxt,
      ) => this.searchBestPath(nxt, cost - 1));
      return true;
    }
    return false;
  }

  get countLeastSteps() {
    return this.cells.flatMap((row) =>
      row.filter((cell) => cell.isBestPath === true)
    ).length - 1;
  }

  visualizeCost(time: number): Decor[][] {
    return this.cells.map((row) => {
      return row.map((cell) => {
        return cell.visualizeCost(time);
      });
    });
  }

  visualizeBestPath(time: number): Decor[][] {
    return this.cells.map((row) => {
      return row.map((cell) => {
        return cell.visualizeBestPath(time);
      });
    });
  }
}
