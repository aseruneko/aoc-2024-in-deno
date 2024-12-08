Deno.readTextFile('./inputs/day_05_input').then((txt: string) => {
    let rule: Rule = new Map();
    let ruleInv: RuleInv = new Map();
    let manuals: Manual[] = [];
    const rows = txt.split('\r\n');
    for(const row of rows) {
        if(/[0-9]+\|[0-9]+/g.test(row)) {
            const nums = row.split('|').map((n) => parseInt(n));
            rule.set(nums[0], [...(rule.get(nums[0]) ?? []), nums[1]]);
            ruleInv.set(nums[1], [...(ruleInv.get(nums[1]) ?? []), nums[0]]);
            continue;
        }
        if(/,/g.test(row)) {
            const nums = row.split(',').map((n) => parseInt(n));
            manuals.push(nums.map((num, idx) => ({ value: num, originalIndex: idx })));
            continue;
        }
    }
    let output = 0;
    for(const manual of manuals) {
        const sorted = [...manual].sort((a,b) => sortPage(a,b,rule,ruleInv));
        if(arrayEq(sorted, manual)) {
            output += manual[Math.floor(manual.length / 2)].value;
        }
    }
    console.log(output);
})

function sortPage(a: Page, b: Page, rule: Rule, ruleInv: RuleInv) {
    if(rule.get(a.value)?.includes(b.value)) return -1;
    if(ruleInv.get(a.value)?.includes(b.value)) return 1;
    return a.originalIndex - b.originalIndex;
}

function arrayEq<T>(a: T[], b: T[]): boolean {
    if(a.length !== b.length) return false;
    for(let i = 0; i < a.length - 1; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

type Page = { value: number, originalIndex: number };
type Manual = Page[];
type Rule = Map<number, number[]>; // first number should come prior from second numbers.
type RuleInv = Map<number, number[]>; // first number should come later from second numbers.