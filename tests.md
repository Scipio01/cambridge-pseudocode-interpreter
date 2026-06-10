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