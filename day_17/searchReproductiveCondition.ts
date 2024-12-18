Deno.readTextFile("./inputs/day_17_input").then((txt: string) => {
  const device = new Device(txt, 202991746427434);
  //   device.exec(Number.MAX_SAFE_INTEGER);
  //   console.log(device.outputs);
  let inits = ["X".repeat(1000)];
  for (let j = 0; j < device.operations.length; j++) {
    const first = device.operations[j];
    const next = inits.flatMap((init) => {
      return [0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => {
        const [a, b, c] = (first ^ 4 ^ i).toString(2).padStart(3, "0").split(
          "",
        );
        const [d, e, f] = (i ^ 1).toString(2).padStart(3, "0").split("");
        return replace(
          replace(
            replace(
              replace(
                replace(replace([init], j * 3 + i, c), j * 3 + i + 1, b),
                j * 3 + i + 2,
                a,
              ),
              j * 3 + 0,
              f,
            ),
            j * 3 + 1,
            e,
          ),
          j * 3 + 2,
          d,
        );
      });
    });
    inits = next;
  }
  const last = inits.map(least);
  last.sort();
  console.log(last.toSorted((a, b) => a - b)[0]);
  //  100
  // 1317
  // 1317
  // 101930
  // 10794
  // 10794
  // 236464682
  // 1926244906
  // 1926244906
  // 121113684522
  // 131851102762
  // 539872995882
  // 31880249354794
  // 31880249354794
  // 150215188294186
  //   1276115095136810
  //   for (let j = 0; j < 100; j++) {
  //     if (firstCond(j)) {
  //       console.log(j.toString(2).padStart(7, "0"));
  //     }
  //   }
  //   for (let i = 0; true; i++) {
  //     if (firstCond(i) && secondCond(i) && thirdCond(i)) {
  //       const device = new Device(txt, i);
  //       device.exec(Number.MAX_SAFE_INTEGER);
  //       if (device.operations.join() === device.outputs.join()) {
  //         console.log(`${i}: true`);
  //         break;
  //       }
  //     }
  //   }
});

function replace(strs: string[], i: number, char: string): string[] {
  return strs.flatMap((str) => {
    if (str[i] === "X" || str[i] === char) {
      return [str.slice(0, i) + char + str.slice(i + 1)];
    }
    return [];
  });
}

function least(str: string) {
  let output = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] !== "X") {
      output += parseInt(str[i]) * (2 ** i);
    }
  }
  return output;
}

function firstCond(A: number) {
  return (((((A % 8) ^ 1) ^ Math.floor(A / (2 ** ((A % 8) ^ 1)))) ^ 4) % 8) ===
    2;
}

function secondCond(A: number) {
  return (((((Math.floor(A / 8) % 8) ^ 1) ^
    Math.floor(Math.floor(A / 8) / (2 ** ((Math.floor(A / 8) % 8) ^ 1)))) ^ 4) %
    8) === 4;
}

function firstCand(i: number) {
  return (((i ^ Math.floor(0b0000000011111111100000 / (2 ** i))) ^ 4) % 8);
}

class Device {
  counter: number = 0;
  outputs: (number | string)[] = [];
  regB: number | string;
  regC: number | string;
  operations: number[];
  constructor(
    txt: string,
    public regA: number | string,
  ) {
    const rows = txt.replace(/\r\n\r\n/, "\r\n").replace(/[^0-9,(\r\n)]/g, "")
      .split("\r\n");
    this.regB = parseInt(rows[1]);
    this.regC = parseInt(rows[2]);
    this.operations = rows[3].split(",").map((r) => parseInt(r));
  }

  exec(num: number) {
    for (let i = 0; i < num; i++) {
      const result = this.step();
      if (!result) break;
    }
  }

  private step() {
    if (this.counter + 1 < this.operations.length) {
      const opcode = this.operations[this.counter];
      const operator = this.operations[this.counter + 1];
      if (opcode >= this.instructions.length) {
        throw Error(`invalid opcode: ${opcode}`);
      }
      this.instructions[opcode](operator);
      this.counter += 2;
      return true;
    } else return false;
  }

  private valueOf(operand: number) {
    if (operand <= 3) return operand;
    if (operand === 4) return this.regA;
    if (operand === 5) return this.regB;
    if (operand === 6) return this.regC;
    throw Error(`invalid operand: ${operand}`);
  }

  private instructions = [
    (op: number) => this.adv(op),
    (op: number) => this.bxl(op),
    (op: number) => this.bst(op),
    (op: number) => this.jnz(op),
    (op: number) => this.bxc(op),
    (op: number) => this.out(op),
    (op: number) => this.bdv(op),
    (op: number) => this.cdv(op),
  ];

  private adv(op: number) {
    const v = this.valueOf(op);
    if (typeof this.regA === "string") {
      if (typeof v === "string") {
        this.regA = `Math.floor(${this.regA} / (2 ** ${v}))`;
      } else this.regA = `Math.floor(${this.regA} / ${2 ** v})`;
    } else {
      if (typeof v === "string") {
        this.regA = `Math.floor(${this.regA} / (2 ** ${v}))`;
      } else this.regA = Math.floor(this.regA / 2 ** v);
    }
  }

  private bxl(op: number) {
    if (typeof this.regB === "string") {
      this.regB = `(${this.regB} ^ ${op})`;
    } else {
      this.regB = this.regB ^ op;
    }
  }

  private bst(op: number) {
    const v = this.valueOf(op);
    if (typeof v === "string") {
      this.regB = `(${v} % 8)`;
    } else {
      this.regB = v % 8;
    }
  }

  private jnz(op: number) {
    if (typeof this.regA === "string") {
      console.log("*".repeat(100));
      console.log(this.regA);
      console.log(this.outputs);
    }
    if (this.regA === 0) return;
    this.counter = op - 2;
  }

  private bxc(_: number) {
    if (typeof this.regB === "string" || typeof this.regC === "string") {
      this.regB = `(${this.regB} ^ ${this.regC})`;
    } else {
      this.regB = this.regB ^ this.regC;
    }
  }

  private out(op: number) {
    const v = this.valueOf(op);
    if (typeof v === "string") {
      this.outputs.push(`(${v} % 8)`);
    } else {
      this.outputs.push(v % 8);
    }
  }

  private bdv(op: number) {
    const v = this.valueOf(op);
    if (typeof v === "string") {
      this.regB = `Math.floor(${this.regA} / (2 ** ${v}))`;
    } else {
      if (typeof this.regA === "string") {
        this.regB = `Math.floor(${this.regA} / ${2 ** v})`;
      } else {
        this.regB = Math.floor(this.regA / (2 ** v));
      }
    }
  }

  private cdv(op: number) {
    const v = this.valueOf(op);
    if (typeof v === "string") {
      this.regC = `Math.floor(${this.regA} / (2 ** ${v}))`;
    } else {
      if (typeof this.regA === "string") {
        this.regC = `Math.floor(${this.regA} / ${2 ** v})`;
      } else {
        this.regC = Math.floor(this.regA / (2 ** v));
      }
    }
  }
}
