Deno.readTextFile('./inputs/day_04_input').then((txt: string) => {
    const rows = txt.split('\r\n').map((r) => r.split(''));
    console.log(countXshapeMas(rows))
})

function countXshapeMas(text: string[][]) {
    let count = 0;
    for(let i = 0; i < text.length - 1; i++){
        for(let j = 0; j < text.length - 1; j++){
            if(text[i][j] === 'A') {
                if(i === 0 || i === text.length - 1 || j === 0 || j === text[0].length - 1) continue;
                const [lu, ll, ru, rl] = [text[i-1][j-1], text[i+1][j-1], text[i-1][j+1], text[i+1][j+1]];
                if(
                    (
                    (lu === 'M' && rl === 'S') ||
                    (lu === 'S' && rl === 'M')
                    ) && (
                    (ll === 'M' && ru === 'S') ||
                    (ll === 'S' && ru === 'M')
                    )
                ) count += 1;
            }
        }
    }
    return count;
}