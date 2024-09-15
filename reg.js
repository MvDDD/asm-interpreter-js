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
        n1 = BigInt("0b" + this.f(n1))
        n2 = BigInt("0b" + this.f(n2))
        let t = n1 & n2
        t = this.f(t.toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    NAND(n1, n2) {
        this.reg.rf()
        n1 = BigInt("0b" + this.f(n1))
        n2 = BigInt("0b" + this.f(n2))
        let t = n1 & n2
        t = this.f((~t).toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    OR(n1, n2) {
        this.reg.rf()
        n1 = BigInt("0b" + this.f(n1))
        n2 = BigInt("0b" + this.f(n2))
        let t = n1 | n2
        t = this.f(t.toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    NOR(n1, n2) {
        this.reg.rf()
        n1 = BigInt("0b" + this.f(n1))
        n2 = BigInt("0b" + this.f(n2))
        let t = n1 | n2
        t = this.f((~t).toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t

    }

    XOR(n1, n2) {
        this.reg.rf()
        n1 = BigInt("0b" + this.f(n1))
        n2 = BigInt("0b" + this.f(n2))
        let t = n1 ^ n2
        t = this.f(t.toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    XNOR(n1, n2) {
        this.reg.rf()
        n1 = BigInt("0b" + this.f(n1))
        n2 = BigInt("0b" + this.f(n2))
        let t = n1 ^ n2
        t = this.f((~t).toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    NOT(n1) {
        this.reg.rf()
        n1 = BigInt("0b" + this.f(n1));
        let t = this.f((~n1).toString(2))
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    SHL(n1, bits) {
        this.reg.rf()
        n1 = this.f(n1);
        let t = n1.slice(bits) + "0".repeat(bits);
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    SHR(n1, bits) {
        this.reg.rf()
        n1 = this.f(n1);
        let t = "0".repeat(bits) + n1.slice(0, -bits)
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    ADD(n1, n2) {
        this.reg.rf()
        let int1 = BigInt("0b" + n1);
        let int2 = BigInt("0b" + n2);
        const MAX_64BIT = BigInt("0xFFFFFFFFFFFFFFFF");
        let sum = int1 + int2;
        if (sum > MAX_64BIT) this.reg.sf("qu")
        let t = this.f(result.toString(2));
        if (t == _64_0) this.reg.sf("z")
        return t
    }

    parse(n) {
        this.reg.rf()
        if (n.startsWith("R")) {
            return this.f(this.reg.get(n));
        } else if (typeof n === "number") {
            return this.f(n.toString(2));
        } else if (typeof n === "string") {
            if (n.startsWith("0x")) {
                return this.f(parseInt(n.slice(2), 16).toString(2));
            } else if (n.startsWith("0b")) {
                return this.f(n.slice(2));
            }
        }
    }

    f(n1) {
        return n1.slice(0, this.size).padStart(this.size, "0");
    }
}

class register {
    constructor() {
        this.r = Array(32).fill("0".repeat(64));
        this.masks = {
            "64": "1".repeat(64),
            "32": "0".repeat(32) + "1".repeat(32),
            "16": "0".repeat(32) + "0".repeat(16) + "1".repeat(16),
            "8l": "0".repeat(32) + "0".repeat(16) + "0".repeat(8) + "1".repeat(8),
            "8h": "0".repeat(32) + "0".repeat(16) + "1".repeat(8) + "0".repeat(8),
        };
        this.h = new handler(this);
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
    sf(flag) {
        // zero, equal, quarry, parity, sign
        let flags = ["z", "eq", "qu", "pt", "si"];
        let index = flags.indexOf(flag);

        if (index !== -1) {
            // Create a bitmask with the flag bit set at the specified index
            let flagBitmask = "0".repeat(index) + "1" + "0".repeat(63 - index);
            // Update the flags register using the OR operation
            this.f = this.h.OR(this.f, flagBitmask);
        }
    }

    rf() {
        this.f = "0".repeat(64)
    }

    log() {
        this.logfunc(this.r);
    }
}