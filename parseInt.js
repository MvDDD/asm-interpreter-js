module.exports = (input, base)=>{
    if (base){
        if (input.startsWith("0b") || input.startsWith("0x") || input.startsWith("0o") || input.startsWith("0d")) {
            return parseInt(input.slice(2), base)
        } else {
            return parseInt(input, base)
        }
    }
    // Check for binary (0b), hexadecimal (0x), and octal (0o)
    if (typeof input === "string") {
        input = input.trim(); // Trim whitespace
        
        if (input.startsWith("0b")) {
            return Number.parseInt(input.slice(2), 2); // Binary
        } else if (input.startsWith("0x")) {
            return Number.parseInt(input.slice(2), 16); // Hexadecimal
        } else if (input.startsWith("0o")) {
            return Number.parseInt(input.slice(2), 8); // Octal
        } else if (input.startsWith("0d")) {
            return Number.parseInt(input.slice(2), 10); // Decimal (though this is redundant)
        }
    }
    
    // Default case: Use parseInt for normal decimal strings
    const number = Number.parseInt(input, 10);

    // Return NaN if the input was invalid
    return isNaN(number) ? null : number; // You can choose to return 0 or throw an error instead
}
