class asmParser {
    constructor(size, disableLogs){
        this.disableLogs = disableLogs
        if (!this.disableLogs){

        }
        this.ramsize = size
        this.RAM = Array(size).fill(0)
        Object.seal(this.ram);
        this.regs = new register()
    }
    parse(str, inputs){
        inputs.forEach((input, index)=>{
            str.replace(input, "RAM(" + (this.ramsize - index).toString(16) + ")")
        })
        asm = str.split("\n").map(a=>a.split(";").shift().trim()).filter(a=>a.trim()!="")
        this.code = {"":[]}
        let func = ""
        asm.forEach(line=>{
            if (line.slice(-1) == ":"){
                func = line.substr(0, line.length-1)
                code[func] = []
            } else {
                code[func].push(((line)=>{
                    let p = {}
                    p.op = line.split(" ")[0]
                    p.pa = line.split(" ")
                    p.pa.shift()
                    p.pa = p.pa.join("").split(",").map(a=>a.trim())
                    return p
                })(line))
            }
        })
    }

    run(...inputs){
        inputs = inputs.reverse()
        inputs.forEach((input, i)=>{this.ram[this.ramsize - i] = input})
        let callstack = [...this.code.main];

        return [...this.ram.slice(-inputs.length)]

    }

    step(){
        let ex = callstack.shift()

        switch (ex.op) {
        case 'mov':{
            if (ex.pa.includes("[")){
                let adr = ex.pa.slice(1, -1)
                

            }else{
                regs.set(ex.pa[0],regs.h.parse(ex.pa[1]))
            }
            break;
        }
    case 'shl':{
        let t = "R" + regNames[ex.pa[0]].r
        regs.set(t, regs.h.SHL(regs.get(t), ex.pa[1]))
        break;
    }
case 'shr':{
    let t = "R" + regNames[ex.pa[0]].r
    regs.set(t, regs.h.SHL(regs.get(t), ex.pa[1]))
    break;
}
case 'and':{
    let t1 = ex.pa[0]
    let t2 = ex.pa[1]
    regs.set(t1, regs.h.AND(regs.get(t1), regs.get(t2)))
    break;
}
case 'or': {
    let t1 = ex.pa[0]
    let t2 = ex.pa[1]
    regs.set(t1, regs.h.OR(regs.get(t1), regs.get(t2)))
    break;
}
case 'xor': {
    let t1 = ex.pa[0]
    let t2 = ex.pa[1]
    regs.set(t1, regs.h.XOR(regs.get(t1), regs.get(t2)))
    break;
}
case 'not': {
    let t1 = ex.pa[0]
    regs.set(t1, regs.h.NOT(regs.get(t1)))
    break;
}
case 'comp':{
    let r1 = regs.get(ex.pa[0])
    let r2 = regs.get(ex.pa[1])
    let v1 = BigInt("0b"+r1)
    let v2 = BigInt("0b"+r2)
    if (r1 == r2) regs.sf("eq")
        if (v1 < v2) regs.sf("st")
            if (v1 > v2) regs.sf("gt")
        }
case 'call':{
    callstack = [...callstack, ...code[ex.pa[0]]]
    break;
}
case "mcall":{
    this.mcall(ex.pa1, ...regs.get("all"))
}
default:
    console.error(ex)
}
regs.log()


if (callstack.length > 0){
    step()
}
}
}

let callstack = [...code.main]






step()

function step(){

}