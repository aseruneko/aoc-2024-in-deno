Deno.readTextFile("./inputs/day_17_input").then((txt: string) => {
  const device = new Device(txt);
  device.exec();
  console.log(device.outputs.join());
});

class Device {
  counter: number = 0;
  outputs: number[] = [];
  regA: number;
  regB: number;
  regC: number;
  operations: number[];
  constructor(
    txt: string,
  ) {
    const rows = txt.replace(/\r\n\r\n/, "\r\n").replace(/[^0-9,(\r\n)]/g, "")
      .split("\r\n");
    this.regA = parseInt(rows[0]);
    this.regB = parseInt(rows[1]);
    this.regC = parseInt(rows[2]);
    this.operations = rows[3].split(",").map((r) => parseInt(r));
  }

  exec() {
    while (true) {
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
    this.regA = Math.floor(this.regA / Math.pow(2, this.valueOf(op)));
  }

  private bxl(op: number) {
    this.regB = this.regB ^ op;
  }

  private bst(op: number) {
    this.regB = this.valueOf(op) % 8;
  }

  private jnz(op: number) {
    if (this.regA === 0) return;
    this.counter = op - 2;
  }

  private bxc(_: number) {
    this.regB = this.regB ^ this.regC;
  }

  private out(op: number) {
    this.outputs.push(this.valueOf(op) % 8);
  }

  private bdv(op: number) {
    this.regB = Math.floor(this.regA / Math.pow(2, this.valueOf(op)));
  }

  private cdv(op: number) {
    this.regC = Math.floor(this.regA / Math.pow(2, this.valueOf(op)));
  }
}
