Deno.readTextFile('./inputs/day_06_input').then((txt: string) => {
    const arrays = txt.split("\r\n").map((row) => row.split(""));
    const guard = new LabGuard();
    const map: LabMap = arrays.map((row, i) => {
        return row.map((cell, j) => {
            if(cell === '#') return { type: 'OBSTACLE' };
            const guardFacing = GuardChar.get(cell);
            if(guardFacing) {
                guard.initialize(guardFacing, i, j);
                return { type: 'VACANT', checked: true }
            };
            return { type: 'VACANT', checked: false};
        })
    })
    while(true) {
        const moved = guard.move(map);
        if(!moved) break;
    }
    console.log(map.map((row) => row.filter((cell) => cell.type === 'VACANT' && cell.checked)).flat().length);
})

type LabCell = { type: 'OBSTACLE' } | { type: 'VACANT', checked: boolean } 
type LabMap = LabCell[][];
type Direction = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
const GuardChar: Map<string, Direction> = new Map([
    ['^', 'UP'],
    ['>', 'RIGHT'],
    ['<', 'LEFT'],
    ['v', 'DOWN'],
])

function visualizeCell(cell: LabCell) {
    if (cell.type === 'OBSTACLE') return '⬛';
    if (cell.type === 'VACANT' && cell.checked) return '❎';
    return '⬜';
}

function visualizeMap(map: LabMap) {
    return map.map((row) => row.map(visualizeCell).join('')).join("\r\n");
}

class LabGuard {

    private facing: Direction;
    private i: number;
    private j: number;

    initialize(
         facing: Direction,
         i: number,
         j: number,
    ) {
        this.facing = facing;
        this.i = i;
        this.j = j;
    }

    move(map: LabMap): boolean {
        if(this.facing === 'UP') {
            if(this.i - 1 < 0) return false;
            const nextCell = map[this.i - 1][this.j];
            if(nextCell.type === 'OBSTACLE') {
                this.facing = 'RIGHT';
                return true;
            }
            this.i = this.i - 1;
            this.j = this.j;
            map[this.i][this.j] = {...nextCell, checked: true};
            return true;
        }
        if(this.facing === 'RIGHT') {
            if(this.j + 1 > map[0].length - 1) return false;
            const nextCell = map[this.i][this.j + 1];
            if(nextCell.type === 'OBSTACLE') {
                this.facing = 'DOWN';
                return true;
            }
            this.i = this.i;
            this.j = this.j + 1;
            map[this.i][this.j] = {...nextCell, checked: true};
            return true;
        }
        if(this.facing === 'DOWN') {
            if(this.i + 1 > map.length - 1) return false;
            const nextCell = map[this.i + 1][this.j];
            if(nextCell.type === 'OBSTACLE') {
                this.facing = 'LEFT';
                return true;
            }
            this.i = this.i + 1;
            this.j = this.j;
            map[this.i][this.j] = {...nextCell, checked: true};
            return true;
        }
        if(this.facing === 'LEFT') {
            if(this.j - 1 < 0) return false;
            const nextCell = map[this.i][this.j - 1];
            if(nextCell.type === 'OBSTACLE') {
                this.facing = 'UP';
                return true;
            }
            this.i = this.i;
            this.j = this.j - 1;
            map[this.i][this.j] = {...nextCell, checked: true};
            return true;
        }
        return false;
    }
}