Deno.readTextFile('./inputs/day_08_input').then((txt: string) => {
    const cells = txt.split("\r\n").map((r) => r.split(''));
    const antennaMap: AntennaMap = new Map();
    const height = cells.length;
    const width = cells[0].length;
    cells.map((row, i) => {
        row.map((cell, j) => {
            if(cell !== '.') {
                antennaMap.set(cell, (antennaMap.get(cell) ?? []).concat({i, j}))
            }
        })
    })
    const output = flattenLocationList([...antennaMap.values()].map((value) => {
        const antinodes = calcAntionodes(value, width, height);
        return antinodes;
    }));
    console.log(output.length);
})

type Location = { i: number, j: number }
type AntennaMap = Map<string, Location[]>;

function flattenLocationList(locationLists: Location[][]): Location[] {
    const output: Set<string> = new Set();
    for(const list of locationLists) {
        for(const loc of list) {
            output.add(`${loc.i},${loc.j}`)
        }
    }
    return [...output.values()].map((v) => {
        const [i, j] = v.split(',').map((r) => parseInt(r));
        return { i, j };
    })
}

function calcAntionodes(locations: Location[], width: number, height: number): Location[] {
    const output: Set<string> = new Set();
    locations.forEach((loc, i) => {
        locations.forEach((l, j) => {
            if(i === j) return;
            calcAntinodePair(loc, l, width, height).forEach((anti) => output.add(`${anti.i},${anti.j}`));
        })
    })
    return [...output.values()].map((v) => {
        const [i, j] = v.split(',').map((r) => parseInt(r));
        return { i, j };
    })
}

function calcAntinodePair(a: Location, b: Location, width: number, height: number): Location[] {
    const output: Location[] = [
     {i: a.i - (b.i - a.i), j: a.j - (b.j - a.j)},
     {i: b.i - (a.i - b.i), j: b.j - (a.j - b.j)}
    ];
    return output.filter((o) => o.i >= 0 && o.i < height && o.j >= 0 && o.j < width);
}