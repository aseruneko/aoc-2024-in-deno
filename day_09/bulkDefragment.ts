Deno.readTextFile("./inputs/day_09_input").then((txt: string) => {
  let rawData = "";
  let idCounter = -1;
  let isEmpty = false;
  const fragments: string[] = [];
  for (const chr of txt) {
    if (isEmpty) rawData += ".".repeat(parseInt(chr));
    if (!isEmpty) {
      idCounter++;
      const fragment = String.fromCodePoint(JP_CP + idCounter).repeat(
        parseInt(chr),
      );
      fragments.unshift(fragment);
      rawData += fragment;
    }
    isEmpty = !isEmpty;
  }
  const compacted = defrag(rawData, fragments);
  let output = 0;
  let index = 0;
  for (const c of compacted) {
    if (c !== ".") output += ((c.codePointAt(0) ?? 0) - JP_CP) * index;
    index += 1;
  }
  console.log(output);
});

function defrag(txt: string, fragments: string[]) {
  let output = txt;
  for (const fragment of fragments) {
    if (new RegExp(`\\.{${fragment.length}}`).test(output)) {
      output = output.replace(
        new RegExp(`\\.{${fragment.length}}`),
        fragment,
      );
      output = output.replace(
        new RegExp(`(.*)${fragment}`),
        "$1" + ".".repeat(fragment.length),
      );
    }
  }
  return output;
}

const JP_CP = 0x3041;
