class UltraObfuscator {
    constructor() {
        this.chars = '魑魅魍魎魂魄幽灵鬼魔妖煞凶煞邪惡混沌虚空幽冥玄黄龍鳳麒麟妖怪魔王邪神';
        this.hexVariations = ['\\x', '\\u', '\\u0', '\\x0', '\\u00'];
    }

    randomName(length = 6) {
        let name = '';
        for (let i = 0; i < length; i++) {
            name += this.chars.charAt(Math.floor(Math.random() * this.chars.length));
        }
        return name + Math.floor(Math.random() * 999);
    }

    obfuscateString(str) {
        if (str.length <= 2) return str;
        
        const method = Math.floor(Math.random() * 4);
        switch(method) {
            case 0: // Full hex escape
                return `"${str.split('').map(c => `\\x${c.charCodeAt(0).toString(16).padStart(2,'0')}`).join('')}"`;
                
            case 1: // Split concatenation
                const parts = [];
                let remaining = str;
                while (remaining.length > 0) {
                    const take = Math.min(1 + Math.floor(Math.random() * 3), remaining.length);
                    parts.push(`"${remaining.substr(0, take)}"`);
                    remaining = remaining.substr(take);
                }
                return parts.join('+');
                
            case 2: // Unicode escape
                return `"${str.split('').map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4,'0')}`).join('')}"`;
                
            case 3: // Mixed encoding
                return str.split('').map(c => 
                    Math.random() > 0.5 
                        ? `\\x${c.charCodeAt(0).toString(16)}`
                        : c
                ).join('');
        }
    }

    mangleIdentifiers(code) {
        const identifierMap = {};
        const reserved = new Set(['function', 'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'var', 'let', 'const', 'new', 'this', 'class', 'extends']);
        
        // Find all identifiers
        const regex = /(?<!\w)([a-zA-Z_$][a-zA-Z0-9_$]*)(?!\w)/g;
        let match;
        while ((match = regex.exec(code)) !== null) {
            const id = match[1];
            if (!reserved.has(id) && !identifierMap[id]) {
                identifierMap[id] = this.randomName();
            }
        }
        
        // Replace all found identifiers
        for (const [original, obfuscated] of Object.entries(identifierMap)) {
            code = code.replace(new RegExp(`\\b${original}\\b`, 'g'), obfuscated);
        }
        
        return code;
    }

    addControlFlow(code) {
        const wrapperVar = this.randomName();
        const cases = [];
        const correctCase = Math.floor(Math.random() * 5);
        
        for (let i = 0; i < 5; i++) {
            if (i === correctCase) {
                cases.push(`case ${i}: ${code} break;`);
            } else {
                cases.push(`case ${i}: ${this.generateDeadCode()}; break;`);
            }
        }
        
        return `
            var ${wrapperVar} = ${correctCase};
            switch(${wrapperVar}) {
                ${cases.join('\n')}
                default: ${this.generateDeadCode()};
            }
        `;
    }

    generateDeadCode() {
        const deadVars = [];
        const count = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < count; i++) {
            deadVars.push(`var ${this.randomName(3)} = ${Math.random()};`);
        }
        
        return `
            ${deadVars.join('\n')}
            function ${this.randomName()}() {
                return ${Math.random() > 0.5 ? 'true' : 'false'};
            }
            ${this.randomName()}();
        `;
    }

    addAntiDebug() {
        return `
            function ${this.randomName()}() {
                var ${this.randomName()} = new Date();
                debugger;
                if (new Date() - ${this.randomName()} > 100) {
                    document.body.innerHTML = '<h1 style="color:red">DEBUGGER DETECTED</h1>';
                    while(1){}
                }
            }
            setInterval(${this.randomName()}, 1000);
        `;
    }

    obfuscate(code, options) {
        // Phase 1: Basic obfuscation
        code = this.mangleIdentifiers(code);
        
        // Phase 2: String obfuscation
        code = code.replace(/("|'|`)(?:(?=(\\?))\2.)*?\1/g, match => {
            return this.obfuscateString(match.slice(1, -1), match[0]);
        });
        
        // Phase 3: Advanced obfuscations
        if (options.controlFlow) code = this.addControlFlow(code);
        if (options.deadCode) code = this.generateDeadCode() + code;
        if (options.antiDebug) code = this.addAntiDebug() + code;
        
        // Final wrapper
        return `(function(){${code}})();`;
    }
}

// UI Setup
document.addEventListener('DOMContentLoaded', () => {
    const obfuscator = new UltraObfuscator();
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const obfuscateBtn = document.getElementById('obfuscate');
    
    obfuscateBtn.addEventListener('click', () => {
        const options = {
            antiDebug: document.getElementById('antiDebug').checked,
            controlFlow: document.getElementById('controlFlow').checked,
            deadCode: document.getElementById('deadCode').checked
        };
        
        try {
            const startTime = performance.now();
            output.value = obfuscator.obfuscate(input.value, options);
            const timeTaken = (performance.now() - startTime).toFixed(2);
            console.log(`Obfuscated in ${timeTaken}ms`);
        } catch (e) {
            output.value = `// Obfuscation Error:\n// ${e.message}`;
        }
    });
    
    // Sample code button (for demo purposes)
    input.value = `function greet(name) {\n  return 'Hello ' + name;\n}\n\nconsole.log(greet('World'));`;
});
