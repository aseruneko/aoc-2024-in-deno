type Coord = [number, number];
type Route = Coord[];
const VECTORS = [[0, 1], [1, 0], [0, -1], [-1, 0]];

Deno.readTextFile("./inputs/day_10_input").then((txt: string) => {
  const map = txt.split("\r\n").map((r) => r.split(""));
  let score = 0;
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map.length; j++) {
      if (map[i][j] === "0") {
        const dests = destinations(searchTrail(map, [i, j]));
        score += dests.length;
      }
    }
  }
  console.log(score);
});

function searchTrail(map: string[][], current: Coord): Route[] {
  const altitude = map[current[0]][current[1]].charCodeAt(0);
  const candidates = next(current, map[0].length, map.length);
  const nexts = candidates.filter(([i, j]) =>
    map[i][j].charCodeAt(0) - altitude === 1
  );
  if (nexts.length === 0) return [[current]];
  return nexts.flatMap((nxt) =>
    searchTrail(map, nxt).map((t) => [current, ...t])
  );
}

function destinations(routes: Route[]): Coord[] {
  const destinations = new Set(
    routes.filter((r) => r.length === 10).map((r) => r[9])
      .map(([i, j]) => `${i},${j}`),
  );
  return [...destinations].map((d) =>
    d.split(",").map((d) => parseInt(d)) as Coord
  );
}

function next(
  current: Coord,
  width: number,
  height: number,
): Coord[] {
  const nxt: Coord[] = [];
  VECTORS.forEach(([a, b]) => {
    const ni = current[0] + a;
    const nj = current[1] + b;
    if (ni >= 0 && nj >= 0 && ni < height && nj < width) {
      nxt.push([ni, nj]);
    }
  });
  return nxt;
}

function visualize(map: string[][], coords: Coord[]) {
  console.log("=".repeat(map[0].length));
  map.forEach((row, i) => {
    let rowStr = "";
    const styles: string[] = [];
    row.forEach((cell, j) => {
      rowStr += `%c${cell}`;
      if (coords.some(([ci, cj]) => ci === i && cj === j)) {
        styles.push("color: red;");
      } else styles.push("color: none;");
    });
    console.log(rowStr, ...styles);
  });
}
