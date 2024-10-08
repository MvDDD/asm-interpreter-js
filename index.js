let asmparser = require("./asm.js");
asmparser = new asmparser(8, true); // Initialize AsmParser with RAM size

// Initialize RAM with example values


let asm = `
main:
    mov R0, 0
    call l
l:
    mov R1, [R0]
    add R1, R1
    mov [R0], R1
    print [R0]
    comp R0, 2
    jmp equal end
    add R0, 1
    call l
end:
    mcall -1
`;

// Parse and run the assembly code
let a = "a"
asmparser.parse(asm, a, a, a, a, a, a, a, "z");
console.log(asmparser.compiledASM + "\n"); // Log compiled assembly

// Run the program
console.log("\nFinal output: " + asmparser.run(1, 2, 3, 4, 5, 6, 7, 8) + "\n"); // Log the final output

// Log the final RAM state
console.log(JSON.stringify(asmparser.RAM));
