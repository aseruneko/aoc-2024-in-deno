export type Decor = {
  value: string;
  style: string;
};
export const Decor = {
  default(v: string): Decor {
    return { value: v, style: "color: unset" };
  },
  of(v: string, color: string): Decor {
    return { value: v, style: `color: ${color}` };
  },
  colorized(v: number, step: number = 5): Decor {
    return {
      value: (v % 10).toString(),
      style: `color: hsl(${(v * step) % 360} , 100%, 50%)`,
    };
  },
  log(d: Decor) {
    console.log(`%c${d.value}`, d.style);
  },
  logArray(ds: Decor[]) {
    const values = ds.map((d) => `%c${d.value}`).join("");
    const styles = ds.map((d) => d.style);
    console.log(values, ...styles);
  },
  logMatrix(matrix: Decor[][]) {
    for (const row of matrix) {
      Decor.logArray(row);
    }
  },
};
