Deno.readTextFile("./inputs/day_07_input").then((txt: string) => {
  const arrays = txt.split("\r\n");
  const equations: Equation[] = [];
  for (const row of arrays) {
    const [sumStr, operandsStr] = row.split(":");
    const sum = parseInt(sumStr);
    const operands = operandsStr.trim().split(" ").map((x) => parseInt(x));
    equations.push({ sum, operands });
  }
  let output = 0;
  for (const equation of equations) {
    const reachables = reachableNumbers([undefined], equation.operands);
    if (reachables.includes(equation.sum)) output += equation.sum;
  }
  console.log(output);
});

type Equation = { sum: number; operands: number[] };

function plusOrMultipleOrConcat(a: number | undefined, b: number): number[] {
  if (a === undefined) return [b];
  return [a + b, a * b, parseInt("" + a + b)];
}

function reachableNumbers(
  acc: (number | undefined)[],
  rest: number[],
): number[] {
  if (rest.length === 0) return acc.flatMap((x) => x === undefined ? [] : [x]);
  const next = acc.flatMap((x) => plusOrMultipleOrConcat(x, rest[0]));
  return reachableNumbers(next, rest.slice(1));
}
