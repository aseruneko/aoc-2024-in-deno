Deno.readTextFile("./inputs/day_01_input").then((txt: string) => {
  const rows = txt.split("\r\n");
  const left: number[] = [];
  const freq: Map<number, number> = new Map();
  rows.forEach((row) => {
    const [ls, rs] = row.split("   ");
    const [l, r] = [parseInt(ls), parseInt(rs)];
    left.push(l);
    freq.set(r, (freq.get(r) ?? 0) + 1);
  });
  let score = 0;
  left.forEach((l) => {
    score += l * (freq.get(l) ?? 0);
  });
  console.log(score);
});
