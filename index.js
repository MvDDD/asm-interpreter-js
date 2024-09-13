let fs = require("fs")

let { register, strBIN } = require("./regs.js")

let file = fs.readFileSync(process.argv[2], "utf-8")

if (!file.trim().startsWith("format STR as RUN")) throw Error("invalid file")

file = file.replace("\t", " ").split("\n").filter(l=>l.length > 2).map(a=>a.split(";")[0])

let code = {}

let func = ""
file.forEach((line)=>{
    line = line.trim()
    if (line.split("").pop() == ":"){
        func = line
    } else {
        if (!code[func]){
            code[func] = []
        }
        code[func].push(handle(line))
    }
})

function handle(line){
    while (line.includes("  ")){
        line = line.replace("  ", " ")
    }
    let op = line.split(" ")[0]
    line = line.split(" ")
    line.shift()
    line = line.join(" ")
    line = line.split(",").map(a=>a.trim())
    let args = [...line]
    return {op, args}
}

console.log(code.main)