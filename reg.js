const _64_0 = "0".repeat(64)

class handler {
    constructor(reg) {
        this.reg = reg;
        this.size = 64;
        this.lastOp = ""
        this.in = ""
    }

    AND(n1, n2) {
        this.reg.rf()
        let n3 = n1 & n2
        if (t == 0) this.reg.sf("z")
            return n3
    }

    NAND(n1, n2) {
        this.reg.rf()
        let n3 = ~(n1 & n2)
        if (t == 0) this.reg.sf("z")
            return n3
    }

    OR(n1, n2) {
        this.reg.rf()
        let n3 = n1 | n2
        if (t == 0) this.reg.sf("z")
            return n3
    }

    NOR(n1, n2) {
        this.reg.rf()
        let n3 = n1 | n2
        t = ~t
        if (t == 0) this.reg.sf("z")
            return n3

    }

    XOR(n1, n2) {
        this.reg.rf()
        let n3 = n1 ^ n2
        flags(n1, n2, n3)
        return n3
    }

    XNOR(n1, n2) {
        this.reg.rf()
        let n3 = ~(n1 ^ n2)
        flags(n1, n2, n3)
        return n3
    }

    NOT(n1) {
        this.reg.rf()
        let n3 = ~n1
        flags(n1, n2, n3)
        return n3
    }

    SHL(n1, bits) {
        this.reg.rf()
        let n3 = n1 << bits
        flags(n1, n2, n3)
        return n3
    }

    SHR(n1, bits) {
        this.reg.rf()
        let n3 = n1 >> bits
        flags(n1, n2, n3)
        return n3
    }

    ADD(n1, n2) {
        this.reg.rf()
        let n3 = n1 + n2;
        flags(n1, n2, n3)
        return n3
    }

    SUB(n1, n2){
        this.reg.rf()
        let sum = n1 - n2
    }

flags(n1, n2, n3) {
    this.reg.f = [];

    // Equality checks
    if (n1 == n3 || n2 == n3) flags.push("equal");
    
    // Boundary and type checks for n3
    if (n3 > Number.MAX_SAFE_INTEGER) flags.push("quarry");
    if (n3 < 0) flags.push("parity");
    if (n3 > 0) flags.push("positive");
    if (n3 === 0) flags.push("zero");
    if (Math.abs(n3) === Number.POSITIVE_INFINITY) flags.push("pos_infinity");
    if (n3 === Number.POSITIVE_INFINITY) flags.push("pos_infinity");
    if (n3 === Number.NEGATIVE_INFINITY) flags.push("neg_infinity");
    if (isNaN(n3)) flags.push("nan");

    // Check if n3 is a float
    if (!Number.isInteger(n3)) flags.push("float");
    
    // Additional conditions for n1 and n2
    if (n1 > n2) flags.push("n1_greater");
    if (n1 < n2) flags.push("n1_smaller");
    if (n1 === n2) flags.push("n1_equal_n2");

    // Checks for n1 and n2 being negative, positive or zero
    if (n1 < 0) flags.push("n1_negative");
    if (n2 < 0) flags.push("n2_negative");
    if (n1 > 0) flags.push("n1_positive");
    if (n2 > 0) flags.push("n2_positive");
    if (n1 === 0) flags.push("n1_zero");
    if (n2 === 0) flags.push("n2_zero");

    // Boundary and type checks for n1 and n2
    if (n1 > Number.MAX_SAFE_INTEGER || n2 > Number.MAX_SAFE_INTEGER) flags.push("max_limit");
    if (n1 === Number.POSITIVE_INFINITY || n2 === Number.POSITIVE_INFINITY) flags.push("infinity");
    if (n1 === Number.NEGATIVE_INFINITY || n2 === Number.NEGATIVE_INFINITY) flags.push("neg_infinity");
    if (isNaN(n1) || isNaN(n2)) flags.push("nan_input");

    // Check if n1 and n2 are floats
    if (!Number.isInteger(n1)) flags.push("n1_float");
    if (!Number.isInteger(n2)) flags.push("n2_float");

    // Miscellaneous cases
    if (Math.abs(n1) > Math.abs(n2)) flags.push("n1_abs_greater");
    if (Math.abs(n1) < Math.abs(n2)) flags.push("n1_abs_smaller");
}



}

class register {
    constructor() {
        this.r = Array(32).fill(null);
        this.h = new handler(this);
        this.masks = {
            "64":2**64-1,
            "32":2**32-1,
            "16":2**16-1,
            "8":2**8-1,
            "4":2**4-1,
            "2":2**2-1
        }
        this.f = []
    }

    set(reg, val) {
        let { r, s } = regNames[reg];
        this.r[r] = this.h.AND(this.r[r], this.h.NOT(this.masks[s]));

        if (s.includes("h")) {
            val = this.h.SHL(val, 8);
        }

        this.r[r] = this.h.OR(this.r[r], this.h.AND(this.masks[s], val));
    }

    get(reg) {
        let { r, s } = regNames[reg];
        let val = this.h.AND(this.r[r], this.masks[s]);

        if (s.includes("h")) {
            val = this.h.SHR(val, 8);
        }

        return val;
    }
    log() {
        this.logfunc(this.r);
    }
}
module.exports = Register