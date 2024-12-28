import { Coord } from "../util/Coord.ts";

Deno.readTextFile("./inputs/day_21_input").then((txt: string) => {
  let output = 0;
  for (const stroke of txt.split("\r\n")) {
    const arrow1 = numKeyToArrowKey(stroke);
    const arrow2 = arrow1.flatMap(arrowKeyToArrowKey);
    const arrow3 = arrow2.flatMap(arrowKeyToArrowKey);
    const cost = arrow3.map((ar) => ar.length).sort((a, b) => a - b)[0];
    const strokeNum = parseInt(stroke.replace(/[^0-9]/g, ""));
    output += cost * strokeNum;
  }
  console.log(output);
});

const NumKeyMap: Record<string, Coord> = {
  "7": [0, 0],
  "8": [0, 1],
  "9": [0, 2],
  "4": [1, 0],
  "5": [1, 1],
  "6": [1, 2],
  "1": [2, 0],
  "2": [2, 1],
  "3": [2, 2],
  "0": [3, 1],
  "A": [3, 2],
};

const ArrowKeyMap: Record<string, Coord> = {
  "^": [0, 1],
  "A": [0, 2],
  "<": [1, 0],
  "v": [1, 1],
  ">": [1, 2],
};

function moveIOf(di: number) {
  if (di > 0) {
    return new Array(di).fill("v").join("");
  } else {
    return new Array(Math.abs(di)).fill("^").join("");
  }
}

function moveJOf(dj: number) {
  if (dj > 0) {
    return new Array(dj).fill(">").join("");
  } else {
    return new Array(Math.abs(dj)).fill("<").join("");
  }
}

function numKeyToArrowKey(text: string) {
  let output: string[] = [""];
  let [i1, j1] = [3, 2];
  for (const key of text) {
    const [i2, j2] = NumKeyMap[key];
    const dj = j2 - j1;
    const di = i2 - i1;
    const mv: Set<string> = new Set();
    if (j1 !== 0 || i2 !== 3) {
      mv.add(moveIOf(di) + moveJOf(dj) + "A");
    }
    if (i1 !== 3 || j2 !== 0) {
      mv.add(moveJOf(dj) + moveIOf(di) + "A");
    }
    output = output.flatMap((o) => [...mv.values()].map((m) => o + m));
    [i1, j1] = [i2, j2];
  }
  return output;
}

function arrowKeyToArrowKey(text: string) {
  let output: string[] = [""];
  let [i1, j1] = [0, 2];
  for (const key of text) {
    const [i2, j2] = ArrowKeyMap[key];
    const dj = j2 - j1;
    const di = i2 - i1;
    const mv: Set<string> = new Set();
    if (j1 !== 0 || i2 !== 0) {
      mv.add(moveIOf(di) + moveJOf(dj) + "A");
    }
    if (i1 !== 0 || j2 !== 0) {
      mv.add(moveJOf(dj) + moveIOf(di) + "A");
    }
    output = output.flatMap((o) => [...mv.values()].map((m) => o + m));
    [i1, j1] = [i2, j2];
  }
  return output;
}
