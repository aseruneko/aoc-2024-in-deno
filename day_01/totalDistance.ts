Deno.readTextFile("./inputs/day_01_input").then((txt: string) => {
  const rows = txt.split("\r\n");
  const left: number[] = [];
  const right: number[] = [];
  rows.forEach((row) => {
    const [l, r] = row.split("   ");
    left.push(parseInt(l));
    right.push(parseInt(r));
  });
  left.sort();
  right.sort();
  let diff = 0;
  left.forEach((l, idx) => {
    diff += Math.abs(l - right[idx]);
  });
  console.log(diff);
});
