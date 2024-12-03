Deno.readTextFile('./inputs/day_03_input').then((txt: string) => {
    const matched: string[] = (txt.match(instructionRegExp) ?? []);
    const mulInstructions = extract(matched.map(strToInstruction));
    console.log(mulInstructions.reduce((acc, car) => (acc + car.a * car.b), 0));
})

const instructionRegExp = /(mul\([0-9]+,[0-9]+\))|(do\(\))|(don't\(\))/g

type Instruction = { type: 'DO' } | { type: 'DONT' } | MulInstruction
type MulInstruction = { type: 'MUL', a: number, b: number }

function strToInstruction(str: string): Instruction | undefined {
    if (str === 'do()') return { type: 'DO' }
    if (str === "don't()") return { type: 'DONT' }
    const nums = str.match(/[0-9]+/g) ?? []
    if (nums.length === 2) return { type: 'MUL', a: parseInt(nums[0]), b: parseInt(nums[1]) }
    return undefined;
}

function extract(inputs: (Instruction | undefined)[]): MulInstruction[] {
    let enable = true;
    let outputs: MulInstruction[] = [];

    for (const input of inputs) {
        if(input) {
            switch(input.type) {
                case 'DO':
                    enable = true;
                    break;
                case 'DONT':
                    enable = false;
                    break;
                case 'MUL':
                    if(enable) outputs.push(input);
                    break;
            }
        }
    }
    return outputs;
}