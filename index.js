let asmparser = new require("./asm.js")


let asm = `
main:
mov R0, 0xf0f0f80f
mov R1, R0
call l
l:
mov R2, R0
xor R1, R0
and R2, R0
shl R2, 1
mov R0, R1
mov R1, R2
call l`


