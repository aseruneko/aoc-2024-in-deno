Deno.readTextFile("./inputs/day_09_input").then((txt: string) => {
  let rawData = "";
  let idCounter = 0;
  let isEmpty = false;
  for (const chr of txt) {
    if (isEmpty) rawData += ".".repeat(parseInt(chr));
    if (!isEmpty) {
      rawData += String.fromCodePoint(JP_CP + idCounter).repeat(parseInt(chr));
      idCounter++;
    }
    isEmpty = !isEmpty;
  }
  const compacted = defrag(rawData);
  let output = 0;
  let index = 0;
  for (const c of compacted) {
    if (c !== ".") output += ((c.codePointAt(0) ?? 0) - JP_CP) * index;
    index += 1;
  }
  console.log(output);
});

function defrag(txt: string) {
  let acc = "";
  let rest = txt;
  while (true) {
    if (rest.length === 0) break;
    if (rest[0] === ".") {
      if (rest[rest.length - 1] === ".") {
        rest = rest.slice(0, -1);
      } else {
        acc += rest[rest.length - 1];
        rest = rest.slice(1, -1);
      }
    } else {
      acc += rest[0];
      rest = rest.slice(1);
    }
  }
  return acc;
}

const JP_CP = 0x3041;
