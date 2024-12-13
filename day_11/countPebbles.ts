Deno.readTextFile("./inputs/day_11_input").then((txt: string) => {
  let stones = txt.split(" ");
  for (let i = 0; i < 25; i++) {
    stones = blink(stones);
  }
  console.log(stones.length);
});

function blink(stones: string[]): string[] {
  return stones.flatMap(change);
}

function change(stone: string): string[] {
  if (stone === "0") return ["1"];
  if (stone.length % 2 === 0) {
    const center = stone.length / 2;
    return [stone.slice(0, center), stone.slice(center)].map((i) =>
      parseInt(i).toString()
    );
  }
  return [(parseInt(stone) * 2024).toString()];
}
