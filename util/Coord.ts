export type Coord = [number, number];
export const Coord = {
  of(d: Direction): Coord {
    switch (d) {
      case Directions.Up:
        return [-1, 0];
      case Directions.Right:
        return [0, 1];
      case Directions.Down:
        return [1, 0];
      case Directions.Left:
        return [0, -1];
    }
  },
  plus(a: Coord, b: Coord): Coord {
    return [a[0] + b[0], a[1] + b[1]];
  },
  next(from: Coord, limit?: { width: number; height: number }): Coord[] {
    return Object.values(Directions).map(Coord.of).map((c) =>
      Coord.plus(c, from)
    )
      .filter((c) => !limit || Coord.in(c, limit.height - 1, limit.width - 1));
  },
  in(a: Coord, iSup: number, jSup: number, iInf: number = 0, jInf: number = 0) {
    return (iInf <= a[0] && jInf <= a[1] && a[0] <= iSup && a[1] <= jSup);
  },
};

export const Directions = {
  "Up": "UP",
  "Right": "RIGHT",
  "Down": "DOWN",
  "Left": "LEFT",
} as const;

export type Direction = (typeof Directions)[keyof typeof Directions];
