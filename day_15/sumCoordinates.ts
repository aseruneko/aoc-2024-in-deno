Deno.readTextFile("./inputs/day_15_input").then(async (txt: string) => {
  const [mapTxt, movesTxt] = txt.split("\r\n\r\n");
  const warehouse = new Warehouse(mapTxt);
  const moves = movesTxt.replaceAll("\r\n", "").split("").map((m) =>
    DirectionStr[m]
  );
  // await warehouse.visualize();
  for (let i = 0; i < moves.length; i++) {
    warehouse.robot.move(moves[i], warehouse);
    // await warehouse.visualize();
  }
  console.log(warehouse.totalCoordinatesOfBoxen);
});

type Coord = [number, number];
function eq(a: Coord, b: Coord) {
  return a[0] === b[0] && a[1] === b[1];
}

const Directions: Record<string, Coord> = {
  Up: [-1, 0],
  Right: [0, 1],
  Down: [1, 0],
  Left: [0, -1],
} as const;

const DirectionStr: Record<string, Coord> = {
  "^": Directions.Up,
  ">": Directions.Right,
  "v": Directions.Down,
  "<": Directions.Left,
} as const;

class Robot {
  constructor(public coord: Coord) {}
  move(direction: Coord, warehouse: Warehouse) {
    const [i, j] = [
      this.coord[0] + direction[0],
      this.coord[1] + direction[1],
    ];
    for (const box of warehouse.boxes) {
      if (eq(box.coord, [i, j])) {
        if (!box.move(direction, warehouse)) return false;
      }
    }
    if (warehouse.map[i][j] === "#") return false;
    this.coord = [i, j];
    return true;
  }
}

class Box {
  constructor(public coord: Coord) {}
  move(direction: Coord, warehouse: Warehouse) {
    const [i, j] = [
      this.coord[0] + direction[0],
      this.coord[1] + direction[1],
    ];
    for (const box of warehouse.boxes) {
      if (eq(box.coord, [i, j])) {
        if (!box.move(direction, warehouse)) return false;
      }
    }
    if (warehouse.map[i][j] === "#") return false;
    this.coord = [i, j];
    return true;
  }

  get coordinate() {
    return this.coord[0] * 100 + this.coord[1];
  }
}

class Warehouse {
  map: string[][];
  height: number;
  width: number;
  robot: Robot;
  boxes: Box[];

  constructor(
    txt: string,
  ) {
    const boxes: Box[] = [];
    let robotCoord: Coord = [0, 0];
    this.map = txt.split("\r\n").map((rowTxt, i) => {
      const row = rowTxt.split("");
      return row.map((cell, j) => {
        if (cell === "#") return "#";
        if (cell === "@") robotCoord = [i, j];
        if (cell === "O") boxes.push(new Box([i, j]));
        return ".";
      });
    });
    this.height = this.map.length;
    this.width = this.map[0].length;
    this.robot = new Robot(robotCoord);
    this.boxes = boxes;
  }

  async visualize(ms: number = 300) {
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    let output = "";
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        if (eq(this.robot.coord, [i, j])) {
          output += "@";
          continue;
        }
        if (this.boxes.some((box) => eq(box.coord, [i, j]))) {
          output += "O";
          continue;
        }
        output += this.map[i][j];
      }
      output += "\r\n";
    }
    console.clear();
    console.log(output);
    await sleep(ms);
  }

  get totalCoordinatesOfBoxen() {
    return this.boxes.map((box) => box.coordinate).reduce((a, b) => a + b);
  }
}
