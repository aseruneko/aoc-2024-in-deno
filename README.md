# aoc-2024-in-deno

trying to solve [Deno Advent of Code 2024](https://deno.com/blog/advent-of-code-2024) 😾

## prepare

copy inputs in puzzles into `inputs/` and name like `day_XX_input` (without extension)

### why not includes input files?

> please don't include parts of Advent of Code like the puzzle text or your inputs

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

Part.1 took a lot of time aginst my expectation. Difference between example and actual about which one is long height or width caused a bug in my code. Part.2 is easy.

## Day05

「これで順番は一意に定まらないだろ」と思いつつも、実装するだけなら簡単。Part.1でのモデリングが良かったのか、Part.2は一瞬。

Although I thought these rules cannot determine orders by unique, just solving was easy. My modeling in part.1 might be good, part.2 has been solved immediately.

## Day06

何度も間違えた回答を提出してしまったし、最終的なコードは非効率的に思える。自分は二次元配列をどうこうするのが苦手だ...。

I have submitted wrong answer many times, in addition, I assume my eventual code is inefficient. I must be not good at deal with a two-dimensional array.

## Day07

式1つあたりのオペランドがこれ以上増えた場合、自分のコードは壊れてしまうだろうが、通ったのでヨシ！そんな雑実装なので、割とすぐに実装できました。

If there were more operands per an equation, my code would be broken, but DONE. Thanks to such vulnerable implementation, I have done it in short time somehow.