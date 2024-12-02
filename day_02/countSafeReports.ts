Deno.readTextFile('./inputs/day_02_input').then((txt: string) => {
    const rows = txt.split('\r\n')
    const reports: number[][] = [];
    rows.forEach((row) => {
        reports.push(row.split(' ').map((x) => parseInt(x)));
    })
    const count = reports.filter(isSafe).length;
    console.log(count);
})

type LevelChange = 'GRAD_INC' | 'GRAD_DEC' | 'UNSAFE'

function levelChangeOf(a: number, b: number): LevelChange {
    const diff = a - b;
    if(1 <= diff && diff <= 3) return 'GRAD_INC';
    if(-3 <= diff && diff <= -1) return 'GRAD_DEC';
    return 'UNSAFE'
}

function isSafe(report: number[]): boolean {
    let prev: LevelChange | undefined = undefined;
    for(let i = 0; i < report.length - 1; i++) {
        const current = levelChangeOf(report[i], report[i + 1]);
        if (current === 'UNSAFE') return false;
        if (prev && prev !== current) return false;
        prev = current;
    }
    return true;
}