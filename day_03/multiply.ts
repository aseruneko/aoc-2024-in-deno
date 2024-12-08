Deno.readTextFile("./inputs/day_03_input").then((txt: string) => {
  const matched = txt.match(/mul\([0-9]+,[0-9]+\)/g) ?? [];
  const products = matched.map(multiStr);
  console.log(products.reduce((acc, car) => (acc + car)));
});

function multiStr(str: string): number {
  return (str.match(/[0-9]+/g) ?? []).map((r) => parseInt(r)).reduce(
    (acc, car) => (acc * car),
    1,
  );
}
