Deno.readTextFile("./inputs/day_06_input").then((txt: string) => {
  const arrays = txt.split("\r\n").map((row) => row.split(""));
  let guardPoint: [Direction2, number, number] = ["UP", 0, 0];
  const originalMap: LabMap2 = arrays.map((row, i) => {
    return row.map((cell, j) => {
      if (cell === "#") return { type: "OBSTACLE" };
      const guardFacing = GuardChar2.get(cell);
      if (guardFacing) {
        guardPoint = [guardFacing, i, j];
        return {
          type: "VACANT",
          checkedIn: new Set<Direction2>().add(guardFacing),
        };
      }
      return { type: "VACANT", checkedIn: new Set<Direction2>() };
    });
  });
  const weakPoint = new Set<[number, number]>();
  for (let i = 0; i <= originalMap.length - 1; i++) {
    for (let j = 0; j <= originalMap[0].length - 1; j++) {
      const map = copyMap(originalMap);
      if (
        map[i][j].type === "VACANT" &&
        !(i === guardPoint[1] && j === guardPoint[2])
      ) {
        map[i][j] = { type: "OBSTACLE" };
      } else continue;
      const guard = new LabGuard2();
      guard.initialize(guardPoint[0], guardPoint[1], guardPoint[2]);
      while (true) {
        const result = guard.move(map);
        if (result === "LOOP") {
          weakPoint.add([i, j]);
          break;
        }
        if (result === "ESCAPED") break;
      }
    }
  }
  console.log(weakPoint.size);
});

type LabCell2 = { type: "OBSTACLE" } | {
  type: "VACANT";
  checkedIn: Set<Direction2>;
};
type LabMap2 = LabCell2[][];
type Direction2 = "LEFT" | "RIGHT" | "UP" | "DOWN";
const GuardChar2: Map<string, Direction2> = new Map([
  ["^", "UP"],
  [">", "RIGHT"],
  ["<", "LEFT"],
  ["v", "DOWN"],
]);

function visualizeCell(cell: LabCell2) {
  if (cell.type === "OBSTACLE") return "⬛";
  if (cell.type === "VACANT" && cell.checkedIn.size > 0) {
    if (cell.checkedIn.has("UP")) return "👆️";
    if (cell.checkedIn.has("RIGHT")) return "👉️";
    if (cell.checkedIn.has("LEFT")) return "👈️";
    if (cell.checkedIn.has("DOWN")) return "👇️";
  }
  return "⬜";
}

function visualizeMap(map: LabMap2) {
  return map.map((row) => row.map(visualizeCell).join("")).join("\r\n");
}

function copyMap(map: LabMap2): LabMap2 {
  const copied: LabCell2[][] = [];
  for (const row of map) {
    copied.push(row.map((r) => {
      if (r.type === "VACANT") {
        return { ...r, checkedIn: new Set<Direction2>() };
      }
      return { ...r };
    }));
  }
  return copied;
}

class LabGuard2 {
  private facing: Direction2;
  private i: number;
  private j: number;

  initialize(
    facing: Direction2,
    i: number,
    j: number,
  ) {
    this.facing = facing;
    this.i = i;
    this.j = j;
  }

  move(map: LabMap2): "MOVED" | "TURNED" | "LOOP" | "ESCAPED" {
    if (map[this.i][this.j].type === "OBSTACLE") return "LOOP";
    if (this.facing === "UP") {
      if (this.i - 1 < 0) return "ESCAPED";
      const nextCell = map[this.i - 1][this.j];
      if (nextCell.type === "OBSTACLE") {
        this.facing = "RIGHT";
        return "TURNED";
      }
      this.i = this.i - 1;
      this.j = this.j;
      if (map[this.i][this.j]["checkedIn"].has("UP")) {
        return "LOOP";
      }
      map[this.i][this.j]["checkedIn"].add("UP");
      return "MOVED";
    }
    if (this.facing === "RIGHT") {
      if (this.j + 1 > map[0].length - 1) return "ESCAPED";
      const nextCell = map[this.i][this.j + 1];
      if (nextCell.type === "OBSTACLE") {
        this.facing = "DOWN";
        return "TURNED";
      }
      this.i = this.i;
      this.j = this.j + 1;
      if (map[this.i][this.j]["checkedIn"].has("RIGHT")) {
        return "LOOP";
      }
      map[this.i][this.j]["checkedIn"].add("RIGHT");
      return "MOVED";
    }
    if (this.facing === "DOWN") {
      if (this.i + 1 > map.length - 1) return "ESCAPED";
      const nextCell = map[this.i + 1][this.j];
      if (nextCell.type === "OBSTACLE") {
        this.facing = "LEFT";
        return "TURNED";
      }
      this.i = this.i + 1;
      this.j = this.j;
      if (map[this.i][this.j]["checkedIn"].has("DOWN")) {
        return "LOOP";
      }
      map[this.i][this.j]["checkedIn"].add("DOWN");
      return "MOVED";
    }
    if (this.facing === "LEFT") {
      if (this.j - 1 < 0) return "ESCAPED";
      const nextCell = map[this.i][this.j - 1];
      if (nextCell.type === "OBSTACLE") {
        this.facing = "UP";
        return "TURNED";
      }
      this.i = this.i;
      this.j = this.j - 1;
      if (map[this.i][this.j]["checkedIn"].has("LEFT")) {
        return "LOOP";
      }
      map[this.i][this.j]["checkedIn"].add("LEFT");
      return "MOVED";
    }
    return "ESCAPED";
  }
}
