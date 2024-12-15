# aoc-2024-in-deno

trying to solve
[Deno Advent of Code 2024](https://deno.com/blog/advent-of-code-2024) 😾

## prepare

copy inputs in puzzles into `inputs/` and name like `day_XX_input` (without
extension)

### why not includes input files?

> please don't include parts of Advent of Code like the puzzle text or your
> inputs

https://adventofcode.com/2024/about

## to run

```
deno task start $FILE_PATH_FROM_ROOT
```

## to watch

```
deno task watch $FILE_PATH_FROM_ROOT
```

# daily feeling

## Day04

Part.1でやけに手こずってしまった。exampleと本番の入力で、縦が長いのか横が長いのかが違うせいで、バグを産んでしまった。Part.2は簡単。

Part.1 took a lot of time aginst my expectation. Difference between example and
actual about which one is long height or width caused a bug in my code. Part.2
is easy.

## Day05

「これで順番は一意に定まらないだろ」と思いつつも、実装するだけなら簡単。Part.1でのモデリングが良かったのか、Part.2は一瞬。

Although I thought these rules cannot determine orders by unique, just solving
was easy. My modeling in part.1 might be good, part.2 has been solved
immediately.

## Day06

何度も間違えた回答を提出してしまったし、最終的なコードは非効率的に思える。自分は二次元配列をどうこうするのが苦手だ...。

I have submitted wrong answer many times, in addition, I assume my eventual code
is inefficient. I must be not good at deal with a two-dimensional array.

## Day07

式1つあたりのオペランドがこれ以上増えた場合、自分のコードは壊れてしまうだろうが、通ったのでヨシ！そんな雑実装なので、割とすぐに実装できました。

If there were more operands per an equation, my code would be broken, but DONE.
Thanks to such vulnerable implementation, I have done it in short time somehow.

## Day08

割合簡単に解くことができた。重複のチェックの方法を指定できるSetが欲しいけれど、自分の知る限りはそんなものはない（あったっけ？）。

I solved this quite easily. I want Set whose way of verification for duplicate
is configurable, but I dont know some sort of such thing. (is it true?)

## Day09

Regex is too op pls nerf.

Regex is too op pls nerf.

## Day10

とりあえず全探索したら、Part.2は一瞬で解けてしまった。せっかくなのでvisualizeもしてみた。

I used an exhaustive search without thinking, it results in immediate solvation
for Part2. That's why I visualized it.

## Day11

ちょうど、目を離すと石が動くゲームをやっていたので、助かりました。

This is a good puzzle because I was just playing a game including automatically
moving stone when I don't observe.

## Day12

辺の数を数えるの、本当に難しいので、花を引きちぎりたくなりました。

Counting sides of an area is terribly difficult, so I was almost to tear flowers
apart. seriously.

## Day13

久しぶりに連立一次方程式を解いた気がします。

I think I solved simultaneous linear equations in a while.

## Day14

鳩が豆鉄砲を食ったような顔になってしまいました。最高。

I became look like a deer in a headlight. AWESOME.

## Day15

Part2は、あまり書いたことがないコードを書く必要があったけど、こういうのを書くのが一番楽しいので、よかった。

I had to write a code which I had never really been written, in Part2, but to
write such codes is the most intersting for me. Good.
