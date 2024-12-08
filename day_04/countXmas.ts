Deno.readTextFile("./inputs/day_04_input").then((txt: string) => {
  const rows = txt.split("\r\n").map((r) => r.split(""));
  const horizontal = patchHorizontal(rows);
  const vertical = patchVertical(rows);
  const diagonalL = patchDiagonalL(rows);
  const diagonalR = patchDiagonalR(rows);
  console.log(
    countXMAS(horizontal) +
      countSAMX(horizontal) +
      countXMAS(vertical) +
      countSAMX(vertical) +
      countXMAS(diagonalL) +
      countSAMX(diagonalL) +
      countXMAS(diagonalR) +
      countSAMX(diagonalR),
  );
});

function patchHorizontal(rows: string[][]): string {
  let output = "";
  let [i, j] = [0, 0];
  while (true) {
    output += rows[i][j];
    j++;
    if (j > rows[i].length - 1) {
      i++;
      j = 0;
      output += SEPARATOR;
    }
    if (i > rows.length - 1) {
      break;
    }
  }
  return output;
}

function patchVertical(rows: string[][]): string {
  let output = "";
  let [i, j] = [0, 0];
  while (true) {
    output += rows[i][j];
    i++;
    if (i > rows.length - 1) {
      j++;
      i = 0;
      output += SEPARATOR;
    }
    if (j > rows[i].length - 1) {
      break;
    }
  }
  return output;
}

function patchDiagonalR(rows: string[][]): string {
  let output = "";
  let [i, j, k] = [0, rows[0].length - 1, rows.length - 1];
  while (true) {
    output += rows[i][j];
    i++;
    j++;
    if (i < 0 || i > rows.length - 1 || j < 0 || j > rows[0].length - 1) {
      k -= 1;
      output += SEPARATOR;
      if (Math.abs(k) > rows.length - 1) break;
      if (k >= 0) {
        i = 0;
        j = k;
      }
      if (k < 0) {
        i = Math.abs(k);
        j = 0;
      }
    }
  }
  return output;
}

function patchDiagonalL(rows: string[][]): string {
  let output = "";
  let [i, j, k] = [0, 0, rows[0].length - 1];
  while (true) {
    output += rows[i][j];
    i++;
    j--;
    if (i < 0 || i > rows.length - 1 || j < 0 || j > rows[0].length - 1) {
      k -= 1;
      output += SEPARATOR;
      if (Math.abs(k) > rows.length - 1) break;
      if (k >= 0) {
        i = 0;
        j = rows[0].length - 1 - k;
      }
      if (k < 0) {
        i = Math.abs(k);
        j = rows[0].length - 1;
      }
    }
  }
  return output;
}

function countXMAS(text: string) {
  return (text.match(/XMAS/g) ?? []).length;
}

function countSAMX(text: string) {
  return (text.match(/SAMX/g) ?? []).length;
}

const SEPARATOR = "🦌";
