import { Coord } from "../util/Coord.ts";
import { Decor } from "../util/Decor.ts";

Deno.readTextFile("./inputs/day_18_input").then((txt: string) => {
  const memory = new Memory(71, 71);
  memory.setCollapseList(txt);
  const criticalIdx = memory.searchCriticalCollapse();
  Decor.logMatrix(memory.visualize(criticalIdx - 1));
  const critical = memory.collapseList![criticalIdx - 1];
  console.log(`${critical[0]},${critical[1]}`);
});

class Cell {
  collapseIn?: number;
  filled: boolean = false;

  fill(time: number): boolean {
    if (time >= (this.collapseIn ?? Number.MAX_SAFE_INTEGER)) return false;
    if (this.filled) return false;
    this.filled = true;
    return true;
  }

  visualize(time: number): Decor {
    if (this.filled) return Decor.of(".", "red");
    return Decor.default(
      time >= (this.collapseIn ?? Number.MAX_SAFE_INTEGER) ? "#" : ".",
    );
  }
}

class Memory {
  cells: Cell[][];
  collapseList?: Coord[];

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
    this.collapseList = txt.split("\r\n").map((rowTxt, k) => {
      const [j, i] = rowTxt.split(",").map((cell) => parseInt(cell));
      this.cells[i][j].collapseIn = k + 1;
      return [j, i];
    });
  }

  searchCriticalCollapse() {
    let time = this.collapseList?.length ?? 0;
    while (true) {
      this.fill(time);
      if (this.cells[0][0].filled === true) {
        break;
      }
      time--;
    }
    return time + 1;
  }

  fill(time: number) {
    for (const row of this.cells) {
      for (const cell of row) {
        cell.filled = false;
      }
    }
    this._fill(time, [this.height - 1, this.width - 1]);
  }

  private _fill(time: number, from: Coord) {
    if (this.cells[from[0]][from[1]].fill(time)) {
      Coord.next(from, { width: this.width, height: this.height }).forEach((
        nxt,
      ) => this._fill(time, nxt));
    }
  }

  visualize(time: number): Decor[][] {
    return this.cells.map((row) => {
      return row.map((cell) => {
        return cell.visualize(time);
      });
    });
  }
}
