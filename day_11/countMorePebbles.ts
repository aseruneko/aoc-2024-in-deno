type Stone = [string, number];
type StoneMap = Map<string, number>;

Deno.readTextFile("./inputs/day_11_input").then((txt: string) => {
  const stones = txt.split(" ");
  let stoneMap = countStone(stones.map((stone) => [stone, 1]));
  for (let i = 0; i < 75; i++) {
    stoneMap = blink(stoneMap);
  }
  console.log(stoneMap.values().reduce((a, b) => a + b));
});

function blink(stoneMap: StoneMap): StoneMap {
  return countStone([...stoneMap.entries()].flatMap((stone) => change(stone)));
}

function change(stone: Stone): Stone[] {
  if (stone[0] === "0") return [["1", stone[1]]];
  if (stone[0].length % 2 === 0) {
    const center = stone[0].length / 2;
    return [
      [parseInt(stone[0].slice(0, center)).toString(), stone[1]],
      [parseInt(stone[0].slice(center)).toString(), stone[1]],
    ];
  }
  return [[(parseInt(stone[0]) * 2024).toString(), stone[1]]];
}

function countStone(stones: Stone[]): StoneMap {
  const map: StoneMap = new Map();
  stones.map(([x, i]) => {
    map.set(x, (map.get(x) ?? 0) + i);
  });
  return map;
}
