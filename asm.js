class AsmParser {
	constructor(size, disableLogs) {
		this.disableLogs = disableLogs;
		if (!this.disableLogs) {
			console.warn("RAM size includes in/outputs");
		}
		this.ramSize = size - 1;
		this.ramAdrSize = (size).toString(16).length;
		this.RAM = Array(size).fill(0);
		Object.seal(this.RAM);
		this.regs = require("./reg.js")
		this.parseInt = require("./parseInt.js");
		this.code = {};
		this.compiledASM = "";
	}
	parse(str, ...inputs) {
		if (inputs.length > this.ramSize+1){
			let e = "more inputs than adresses: " + inputs.length + " of " + (this.ramSize + 1) + " inputs used"
			throw new SyntaxError(e)
		}
		inputs.forEach((input, index) => {
			const addr = `[0x${(this.ramSize - index).toString(16).padStart(this.ramAdrSize, "0")}]`;
			str = str.split("\n").map(a => a.split(";")[0].trim()).join("\n").replace(new RegExp(`(^|\\s|,|\\n)(${input})(\\s|,|$|\\n)`, 'g'), addr);
		});
		this.compiledASM = str;
		const asm = str.split("\n").map(a => a.split(";")[0].trim()).filter(a => a);
		let func = "";
		this.code = {};
		asm.forEach(line => {
			if (line.endsWith(":")) {
				func = line.slice(0, -1);
				this.code[func] = [];
			} else {
				this.code[func].push(this.parseLine(line));
			}
		});
	}
	parseLine(line) {
		const parts = line.split(" ");
		const op = parts[0];
		const pa = parts.slice(1).join("").split(",").map(a => a.trim());
		return { op, pa };
	}
	run(...inputs) {
		if (inputs.length > this.ramSize+1){
			let e = "more inputs than configured"
			throw new SyntaxError(e)
		}
		inputs.forEach((input, i) => {
			this.RAM[this.ramSize - i] = input || 0;
		});
		this.callstack = [...(this.code.main || (() => { throw new SyntaxError("No main function in assembly code") })())];
		this.step();
		while (this.callstack.length > 0) {
		}
		return [...this.RAM.slice(-inputs.length).reverse()];
	}
	step() {
		const ex = this.callstack.shift();
		if (!ex) {
			console.error("No more instructions to execute.");
			return;
		}
		switch (ex.op) {
		case 'print':
			this.handlePrint(ex);
			break;
		case 'mov':
			this.handleMov(ex);
			break;
		case 'shl':
		case 'shr':
		case 'and':
		case 'or':
		case 'xor':
		case 'not':
		case 'add':
		case 'sub':
			this.handleLogical(ex, ex.op.toUpperCase());
			break;
		case 'comp':
			this.handleComp(ex);
			break;
		case 'call':
			this.callstack.push(...this.code[ex.pa[0]]);
			break;
		case 'jmp':
			this.handleJump(ex.pa[0], ex.pa[1], ex.pa[2])
			break;
		case 'mcall':
			this.mcall(ex.pa[0], ...this.regs.get("all"));
			break;
		default:
			console.error(`Unknown operation: ${ex.op}`);
			break;
		}
		if (this.callstack.length > 0){
			this.step()
		}
	}
	parseNum(num) {
		if (num.startsWith("[") && num.endsWith("]")) {
			return this.RAM[this.parseNum(num.slice(1, -1))];
		} else if (num.startsWith("R")) {
			return this.regs.get(num);
		} else {
			const t = this.parseInt(num);
			return isNaN(t) ? num : t;
		}
	}
	handleMov(ex) {
		const [dest, src] = ex.pa.slice(0, 2);
		const val = this.parseNum(src);
		if (dest.startsWith("[") && dest.endsWith("]")) {
			this.RAM[this.parseNum(dest.slice(1, -1))] = val;
		} else if (dest.startsWith("R")) {
			this.regs.set(dest, val);
		}
	}
	handleLogical(ex, operation) {
		const result = this.regs.h[operation](this.parseNum(ex.pa[0]), this.parseNum(ex.pa[1]));
		this.regs.set(ex.pa[0], result);
	}
	handleComp(ex) {
		const n1 = this.parseNum(ex.pa[0]);
		const n2 = this.parseNum(ex.pa[1]);
		this.regs.h.flags(n1, n2, null, true);
	}
	handlePrint(ex) {
		if (ex.pa[0].startsWith('"')){
			console.log(...ex.pa)
		} else {
			console.log(...ex.pa.map(this.parseNum, this));
		}
	}
	handleJump(param, dest){
		if (this.regs.flags.includes(param)){
			this.callstack = this.code[dest]
		}
	}
}
module.exports = AsmParser;