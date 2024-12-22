Deno.readTextFile("./inputs/day_19_input").then((txt: string) => {
  const [a, b] = txt.split("\r\n\r\n");
  const towels = a.split(", ");
  const designs = b.split("\r\n");
  console.log(
    designs.map((d) => combination(d, towels)).reduce((a, b) => a + b),
  );
});

function combination(design: string, towels: string[]) {
  const mem: Map<number, number> = new Map(); // i文字目までの作り方はN通り
  for (let i = 1; i <= design.length; i++) {
    if (towels.includes(design.substring(0, i))) {
      mem.set(i, (mem.get(i) ?? 0) + 1);
    }
    for (let j = 1; j < i; j++) {
      if (towels.includes(design.substring(j, i))) {
        mem.set(i, (mem.get(i) ?? 0) + (mem.get(j) ?? 0));
      }
    }
  }
  return mem.get(design.length) ?? 0;
}
