

class handler {
    constructor(r) {
        this.r = r;
    }

    AND(n1, n2) {
        let n3 = n1 & n2
        this.flags(n1, n2, n3)
        return n3
    }

    NAND(n1, n2) {
        let n3 = ~(n1 & n2)
        this.flags(n1, n2, n3)
        return n3
    }

    OR(n1, n2) {
        let n3 = n1 | n2
        this.flags(n1, n2, n3)
        return n3
    }

    NOR(n1, n2) {
        let n3 = n1 | n2
        n3 = ~n3
        this.flags(n1, n2, n3)
        return n3

    }

    XOR(n1, n2) {
        let n3 = n1 ^ n2
        this.flags(n1, n2, n3)
        return n3
    }

    XNOR(n1, n2) {
        let n3 = ~(n1 ^ n2)
        this.flags(n1, n2, n3)
        return n3
    }

    NOT(n1) {
        let n3 = ~n1
        this.flags(n1, null, n3)
        return n3
    }

    SHL(n1, bits) {
        let n3 = n1 << bits
        this.flags(n1, null, n3)
        return n3
    }

    SHR(n1, bits) {
        let n3 = n1 >> bits
        this.flags(n1, null, n3)
        return n3
    }

    ADD(n1, n2) {
        let n3 = n1 + n2;
        this.flags(n1, n2, n3)
        return n3
    }

    SUB(n1, n2){
        let n3 = n1 - n2
        this.flags(n1, n2, n3)
        return n3
    }

    flags(n1, n2 = null, n3 = null, comp) {
        this.r.flags = [];
        if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
            this.r.flags.push("nan_input");
            return; 
        }
        if (comp){
            if (!Number.isInteger(n2)) this.r.flags.push("float"); 

            if (n1 < 0) this.r.flags.push("negative"); 
            if (n1 > 0) this.r.flags.push("positive"); 
            if (n1 === 0) this.r.flags.push("zero");
            if (n1 > Number.MAX_SAFE_INTEGER) this.r.flags.push("max_limit");  
            if (n1 === Number.POSITIVE_INFINITY) this.r.flags.push("pos_infinity"); 
            if (n2 === Number.NEGATIVE_INFINITY) this.r.flags.push("neg_infinity"); 

            if (n1 != n2){
                this.r.flags.push("not_equal"); 
            }

            if (n1 > n2) {
                this.r.flags.push("greater"); 
            } else if (n1 < n2) {
                this.r.flags.push("smaller"); 
            } else if (n1 == n2){
                this.r.flags.push("equal"); 
            }

            if (Math.abs(n1) > Math.abs(n2)) this.r.flags.push("abs_greater"); 
            if (Math.abs(n1) < Math.abs(n2)) this.r.flags.push("abs_smaller");  
        }else{
            if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
                this.r.flags.push("nan_input");
                return; 
            }

            if (n3 > Number.MAX_SAFE_INTEGER) this.r.flags.push("quarry"); 
            if (n3 < 0) this.r.flags.push("negative"); 
            if (n3 === 0) this.r.flags.push("zero"); 
            if (n3 === Number.POSITIVE_INFINITY) this.r.flags.push("pos_infinity"); 
            if (n3 === Number.NEGATIVE_INFINITY) this.r.flags.push("neg_infinity"); 
            if (Math.abs(n3) === Number.POSITIVE_INFINITY) this.r.flags.push("infinity"); 
            if (!Number.isInteger(n3)) this.r.flags.push("float"); 

            if (n1 === n3) this.r.flags.push("src_equal"); 
            if (n2 === n3) this.r.flags.push("dest_equal"); 

            if (!Number.isInteger(n1)) this.r.flags.push("src_float"); 
            if (!Number.isInteger(n2)) this.r.flags.push("dest_float"); 

            if (n1 < 0) this.r.flags.push("src_negative"); 
            if (n2 < 0) this.r.flags.push("dest_negative"); 
            if (n3 < 0) this.r.flags.push("negative"); 
            if (n1 > 0) this.r.flags.push("src_positive"); 
            if (n2 > 0) this.r.flags.push("dest_positive"); 
            if (n3 > 0) this.r.flags.push("positive"); 

            if (n1 === 0) this.r.flags.push("src_zero"); 
            if (n2 === 0) this.r.flags.push("dest_zero"); 
            if (n3 === 0) this.r.flags.push("zero"); 

            if (n1 > Number.MAX_SAFE_INTEGER) this.r.flags.push("src_max_limit"); 
            if (n2 > Number.MAX_SAFE_INTEGER) this.r.flags.push("dest_max_limit"); 
            if (n1 === Number.NEGATIVE_INFINITY) this.r.flags.push("src_neg_infinity"); 
            if (n2 === Number.NEGATIVE_INFINITY) this.r.flags.push("dest_neg_infinity"); 

            if (n1 > n2) {
                this.r.flags.push("greater"); 
            } else if (n1 < n2) {
                this.r.flags.push("smaller"); 
            } else {
                this.r.flags.push("src_dest_equal"); 
            }

            if (Math.abs(n1) > Math.abs(n2)) this.r.flags.push("src_abs_greater"); 
            if (Math.abs(n1) < Math.abs(n2)) this.r.flags.push("src_abs_smaller"); 

            if (n1 !== n2) this.r.flags.push("src_dest_not_equal"); 
            if (n1 === Number.POSITIVE_INFINITY || n2 === Number.POSITIVE_INFINITY) {
                this.r.flags.push("infinity"); 
            }
        }
    }
}

class Register {
    constructor() {
        this.r = Array(32).fill(0);
        this.h = new handler(this);
        this.flags = []
    }

    set(reg, val) {
        this.r[reg.slice(1)] = val
    }

    get(reg) {
        return this.r[reg.slice(1)];
    }
}
module.exports = new Register()