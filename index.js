let fs = require("fs") // #include <fstream>
let file = fs.readFileSync(process.argv[2])

file = file.replace("\t", " ").split("\n")


let code = {}

let func = ""
file.forEach((line)=>{
    line = line.trim()
    if (line.endsWidth(":")){
        let func = line.slice(0, -1)
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
    let OP = line.split(" ")[0]
    line = line.split(" ")
    line.shift()
    line = line.join(" ")
    line = line.split(",").map(a=>a.trim())
    let args = [...line]
    return {op, args}
}

console.log(code)