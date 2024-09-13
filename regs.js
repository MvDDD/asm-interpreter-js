class strBIN {
	constructor(length){
		if (length){
			this.fixed = length
		} else {
			this.fixed = undefined
		}
	}
	AND(str1, str2){
		let size = Math.max(str1.length, str2.length)
		str1 = str1.padStart(size, "0").split("").reverse()
		str2 = str2.padStart(size, "0").split("").reverse()
		let out = ""
		for (let i = 0; i < size; i++) {
			let bool1 = (str1[i]=="1")?true:false
			let bool2 = (str2[i]=="1")?true:false
			out += bool1 && bool2?"1":"0"
		}
		out = out.split("").reverse().join("")
		return out.slice(0, this.fixed || Infinity).padStart("0", this.fixed || size)
	}
	OR(str1, str2){
		let size = Math.max(str1.length, str2.length)
		str1 = str1.padStart(size, "0").split("").reverse()
		str2 = str2.padStart(size, "0").split("").reverse()
		let out = ""
		for (let i = 0; i < size; i++) {
			let bool1 = (str1[i]=="1")?true:false
			let bool2 = (str2[i]=="1")?true:false
			out += bool1 || bool2?"1":"0"
		}
		out = out.split("").reverse().join("")
		return out.slice(0, this.fixed || Infinity).padStart("0", this.fixed || size)
	}
	XOR(str1, str2){
		let size = Math.max(str1.length, str2.length)
		str1 = str1.padStart(size, "0").split("").reverse()
		str2 = str2.padStart(size, "0").split("").reverse()
		let out = ""
		for (let i = 0; i < size; i++) {
			let bool1 = (str1[i]=="1")?true:false
			let bool2 = (str2[i]=="1")?true:false
			out += bool1 ^ bool2?"1":"0"
		}
		out = out.split("").reverse().join("")
		return out.slice(0, this.fixed || Infinity).padStart("0", this.fixed || size)
	}
	NOT(str1){
		let size = str1.length
		str1 = str1.split().reverse()
		let out = ""
		for (let i = 0; i < str1.length; i++) {
			out += str1[i]=="1"?"0":"1"
		}
		out = out.split("").reverse().join("")
		return out.slice(0, this.fixed || Infinity).padStart("0", this.fixed || size)
	}
	ADD(str1, str2){
		let size = Math.max(str1.length, str2.length)
		str1 = str1.padStart(size, "0").split("").reverse()
		str2 = str2.padStart(size, "0").split("").reverse()
		let out = ""
		let q = false
		for (let i = 0; i < size; i++) {
			let bool1 = (str1[i]=="1")?true:false
			let bool2 = (str2[i]=="1")?true:false
			out += bool1 ^ bool2 ^ q?"1":"0"
			q = (bool1 && bool2) || (bool2 && q) || (bool1 && q)
		}
		out = out.split("").reverse().join("")
		return out.slice(0, this.fixed || Infinity).padStart("0", this.fixed || size)
	}
}



class register {
	constructor(){
		this.r = Array(16).fill("0".repeat(64))
		this.masks = {
			"64" : "1".repeat(64),
			"32l": "0".repeat(32) + "1".repeat(32),
			"32h": "1".repeat(32) + "0".repeat(32),
			"16l": "0".repeat(32) + "0".repeat(16) + "1".repeat(16),
			"16h": "0".repeat(32) + "1".repeat(16) + "0".repeat(16),
			"8l":  "0".repeat(32) + "0".repeat(16) + "0".repeat(8) + "1".repeat(8),
			"8h":  "0".repeat(32) + "0".repeat(16) + "1".repeat(8) + "0".repeat(8)
		}
		this.H = strBin(64)
	}
	set(reg, val){
		if (typeof val == "number"){
			val = val.toString(2);
		}
		if (val.startsWith("0x")){
			val = parseInt(val.slice(2, Infinity), 16).toString(2)
		} else if (val.startsWith("0b")){
			val = this.h.AND(val.slice(2, Infinity), )
		}
		let type = this.getType(reg)
		let mask = this.masks[type[1]];
		let invmask = this.h.NOT(mask);
		let masked = this.h.AND(val, mask);
		this.r[type[0]] = this.h.AND(this.r[type[0]], invmask);
		this.r[type[0]] = this.h.OR(this.r[type[0]], masked);
	}
	getType(reg){
		let sizeMap = {
			'': '64',
			'd': '32l',
			'w': '16l',
			'h': '8h',
			'l': '8l'
		};
		let match = reg.match(/^r(\d+)([a-z]*)$/);
		let num = parseInt(match[1]);
		let suffix = match[2];
		return [num, sizeMap[suffix] || '64'];
	}

	get(reg){

	}
}



module.exports = {strBIN, register}