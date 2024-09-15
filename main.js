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


let regOut = document.createElement("canvas")
document.body.appendChild(regOut)
regOut.width = 64*4
regOut.height = 32*4
let ctx = regOut.getContext("2d")

let RAM = Array(1024).fill("0".repeat(64))


asm = asm.split("\n").map(a=>a.split(";").shift().trim()).filter(a=>a.trim()!="")

let code = {"":[]}
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

let regs = new register()
regs.logfunc = (r)=>{
    r = r.map(a=>a.split(""))
    ctx.fillStyle = "#000"
    ctx.fillRect(0,0,64*4,32*4)
    r.forEach((reg, regnr)=>{
        reg.forEach((bit, bitnr)=>{
            ctx.fillStyle = bit == "1"?"#fff":"#000"
            ctx.fillRect(bitnr*4,regnr*4,4,4)
        })
    })
    r = r.join("")
}

let callstack = [...code.main]



step()

function step(){
    let ex = callstack.shift()
    
    switch (ex.op) {
        case 'mov':{
            if (ex.pa.includes("[")){
                
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
            mcall()
        }
        default:
            console.error(ex)
    }
    regs.log()
    
    
    if (callstack.length > 0){
        setTimeout(step, 0)
    }
}