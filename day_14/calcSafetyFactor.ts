Deno.readTextFile("./inputs/day_14_input").then(async (txt: string) => {
  const robots = txt.split("\r\n").map((res) =>
    res.replaceAll(" ", ",").replace(/[^0-9,\-]/g, "")
      .split(",").map((r) => parseInt(r))
  ).map((r) => new Robot(...r as [number, number, number, number]));
  const bathroom = new Bathroom(robots);
  for (let i = 0; i < 100; i++) {
    bathroom.move();
  }
  // await bathroom.visualize();
  console.log(bathroom.safetyFactor);
});

class Robot {
  constructor(
    public x: number,
    public y: number,
    private vx: number,
    private vy: number,
  ) {}

  move(w: number, h: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x += Math.ceil(Math.abs(this.x) / w) * w;
    if (this.y < 0) this.y += Math.ceil(Math.abs(this.y) / h) * h;
    if (this.x >= w) this.x -= (Math.floor((this.x - w) / w) + 1) * w;
    if (this.y >= h) this.y -= (Math.floor((this.y - h) / h) + 1) * h;
  }
}

class Bathroom {
  static WIDTH = 101; // 11
  static HEIGHT = 103; // 7

  constructor(
    public robots: Robot[],
  ) {}

  move() {
    this.robots.forEach((r) => r.move(Bathroom.WIDTH, Bathroom.HEIGHT));
  }

  get robotMap() {
    const map: number[][] = new Array(Bathroom.HEIGHT).fill([]).map(() =>
      new Array(Bathroom.WIDTH).fill(0)
    );
    this.robots.map((robot) => {
      map[robot.y][robot.x] += 1;
    });
    return map;
  }

  get safetyFactor() {
    const map = this.robotMap;
    const count = { nw: 0, ne: 0, sw: 0, se: 0 };
    map.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (i <= Bathroom.HEIGHT / 2 - 1) {
          if (j <= Bathroom.WIDTH / 2 - 1) count.nw += cell;
          else if (j >= Bathroom.WIDTH / 2) count.ne += cell;
        } else if (i >= Bathroom.HEIGHT / 2) {
          if (j <= Bathroom.WIDTH / 2 - 1) count.sw += cell;
          else if (j >= Bathroom.WIDTH / 2) count.se += cell;
        }
      });
    });
    return count.nw * count.ne * count.sw * count.se;
  }

  async visualize(ms: number = 0) {
    const map = this.robotMap;
    let output = "";
    for (let i = 0; i < Bathroom.HEIGHT; i++) {
      for (let j = 0; j < Bathroom.WIDTH; j++) {
        output += map[i][j].toString();
      }
      output += "\r\n";
    }
    console.clear();
    console.log(output);
    await sleep(ms);
  }
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
