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
    const canMove = warehouse.map[i][j] !== "#" &&
      !warehouse.boxes.some((box) =>
        (eq(box.coord.left, [i, j]) || eq(box.coord.right, [i, j])) &&
        !box.canMove(direction, warehouse)
      );
    if (canMove) {
      warehouse.boxes.filter(
        (box) => eq(box.coord.left, [i, j]) || eq(box.coord.right, [i, j]),
      ).forEach((box) => box.move(direction, warehouse));
      this.coord = [i, j];
    }
  }
}

class BigBox {
  coord: {
    left: Coord;
    right: Coord;
  };
  constructor(public leftCoord: Coord) {
    this.coord = {
      left: leftCoord,
      right: [leftCoord[0], leftCoord[1] + 1],
    };
  }
  canMove(direction: Coord, warehouse: Warehouse): boolean {
    const [li, lj] = [
      this.coord.left[0] + direction[0],
      this.coord.left[1] + direction[1],
    ];
    const [ri, rj] = [
      this.coord.right[0] + direction[0],
      this.coord.right[1] + direction[1],
    ];
    return !(warehouse.map[li][lj] === "#" || warehouse.map[ri][rj] === "#") &&
      !warehouse.boxes.some((box) =>
        !(eq(box.coord.left, this.coord.left) &&
          eq(box.coord.right, this.coord.right)) &&
        (eq(box.coord.left, [li, lj]) || eq(box.coord.left, [ri, rj]) ||
          eq(box.coord.right, [li, lj]) || eq(box.coord.right, [ri, rj])) &&
        !box.canMove(direction, warehouse)
      );
  }
  move(direction: Coord, warehouse: Warehouse) {
    const [li, lj] = [
      this.coord.left[0] + direction[0],
      this.coord.left[1] + direction[1],
    ];
    const [ri, rj] = [
      this.coord.right[0] + direction[0],
      this.coord.right[1] + direction[1],
    ];
    warehouse.boxes.filter((
      box,
    ) =>
      !(eq(box.coord.left, this.coord.left) &&
        eq(box.coord.right, this.coord.right)) &&
      (eq(box.coord.left, [li, lj]) || eq(box.coord.left, [ri, rj]) ||
        eq(box.coord.right, [li, lj]) || eq(box.coord.right, [ri, rj]))
    ).map((box) => box.move(direction, warehouse));
    this.coord = { left: [li, lj], right: [ri, rj] };
  }
  get coordinate() {
    return this.coord.left[0] * 100 + this.coord.left[1];
  }
}

class Warehouse {
  map: string[][];
  height: number;
  width: number;
  robot: Robot;
  boxes: BigBox[];

  constructor(
    txt: string,
  ) {
    const boxes: BigBox[] = [];
    let robotCoord: Coord = [0, 0];
    const bigMapTxt = txt.split("").map((char) => {
      if (char === "#") return "##";
      if (char === "@") return "@.";
      if (char === ".") return "..";
      if (char === "O") return "[]";
      return char;
    }).join("");
    this.map = bigMapTxt.split("\r\n").map((rowTxt, i) => {
      const row = rowTxt.split("");
      return row.map((cell, j) => {
        if (cell === "#") return "#";
        if (cell === "@") robotCoord = [i, j];
        if (cell === "[") boxes.push(new BigBox([i, j]));
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
        if (this.boxes.some((box) => eq(box.coord.left, [i, j]))) {
          output += "[";
          continue;
        }
        if (this.boxes.some((box) => eq(box.coord.right, [i, j]))) {
          output += "]";
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
