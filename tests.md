# Pseudocode Interpreter Tests
# Pseudocode Interpreter Tests

## Variables

score ← 10
OUTPUT score

Expected:
10

Status:
PASS


## Arithmetic

OUTPUT 10 + 5
OUTPUT 10 - 5
OUTPUT 10 * 5
OUTPUT 10 / 5

Expected:
15
5
50
2

Status:
PASS


## Comparisons

OUTPUT 10 > 5
OUTPUT 10 < 5
OUTPUT 10 >= 10
OUTPUT 10 <= 5
OUTPUT 10 = 10
OUTPUT 10 <> 5

Expected:
true
false
true
false
true
true

Status:
PASS


## String Concatenation

INPUT name
OUTPUT "Hello " + name

Expected:
Hello John

Status:
PASS


## IF ELSE

score ← 5

IF score > 10 THEN
    OUTPUT "High"
ELSE
    OUTPUT "Low"
ENDIF

Expected:
Low

Status:
PASS


## Error Handling

IF score > 10
    OUTPUT "High"
ENDIF

Expected:
Error: IF statement must end with THEN

Status:
PASS

## Current Feature Coverage

### Arrays

```text
names[1] ← "Ali"
OUTPUT names[1]

Ali

String functions
OUTPUT LENGTH("Computer")
OUTPUT UCASE("test")
OUTPUT LCASE("TEST")
OUTPUT SUBSTRING("Computer", 4, 3)

Expected:

8
TEST
test
put
RANDOM
OUTPUT RANDOM(1, 6)

Expected:

A whole number from 1 to 6
MOD and DIV
OUTPUT 17 MOD 5
OUTPUT 17 DIV 5

Expected:

2
3