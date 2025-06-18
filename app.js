// Base obfuscation components
const 高宝座BaseObfuscator = {
    // Level 1: Basic Unicode renaming
    level1: function(code) {
        const prefixes = ['高宝座', '幽灵', '暗影', '龙焰', '虚空', '混沌', '神秘'];
        const suffixes = ['之刃', '之怒', '之影', '之力', '之魂', '之眼', '之翼'];
        const connectors = ['X', 'Z', 'Δ', 'Ψ', 'Ω', '∞', '※'];
        
        let varCounter = 0;
        const varMap = {};
        
        // Find all variables and functions to rename
        const varRegex = /(?:var|let|const|function)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)/g;
        let match;
        while ((match = varRegex.exec(code)) !== null) {
            if (!varMap[match[1]] && match[1].length > 1) {
                const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
                const connector = connectors[Math.floor(Math.random() * connectors.length)];
                varMap[match[1]] = `${prefix}${connector}${suffix}${varCounter++}`;
            }
        }
        
        // Replace all occurrences
        for (const [original, obfuscated] of Object.entries(varMap)) {
            const regex = new RegExp(`\\b${original}\\b`, 'g');
            code = code.replace(regex, obfuscated);
        }
        
        return code;
    },
    
    // Level 2: Extended Unicode with hex escapes
    level2: function(code) {
        // First apply level1
        code = this.level1(code);
        
        // Additional obfuscation
        const specialChars = ['齐', '魔', '幻', '幽', '冥', '煞', '魇'];
        const hexPrefixes = ['\\x', '\\u', '\\x', '\\u'];
        
        // Find strings to partially hex escape
        const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
        code = code.replace(stringRegex, (match) => {
            // Don't obfuscate very short strings
            if (match.length <= 4) return match;
            
            const quote = match[0];
            const content = match.slice(1, -1);
            let newContent = '';
            
            for (let i = 0; i < content.length; i++) {
                if (Math.random() > 0.7) {
                    const prefix = hexPrefixes[Math.floor(Math.random() * hexPrefixes.length)];
                    if (prefix === '\\x') {
                        newContent += `\\x${content.charCodeAt(i).toString(16).padStart(2, '0')}`;
                    } else {
                        newContent += `\\u${content.charCodeAt(i).toString(16).padStart(4, '0')}`;
                    }
                } else {
                    newContent += content[i];
                }
            }
            
            return quote + newContent + quote;
        });
        
        // Add random Unicode variable declarations
        const randomVarCount = 5 + Math.floor(Math.random() * 10);
        let randomVars = '';
        
        for (let i = 0; i < randomVarCount; i++) {
            const char1 = specialChars[Math.floor(Math.random() * specialChars.length)];
            const char2 = specialChars[Math.floor(Math.random() * specialChars.length)];
            const num = Math.floor(Math.random() * 1000);
            randomVars += `var ${char1}${char2}${num} = ${Math.random()};\n`;
        }
        
        return randomVars + code;
    },
    
    // Level 3: Extreme obfuscation
    level3: function(code) {
        // Apply level2 first
        code = this.level2(code);
        
        // Add more complex transformations
        const wrappers = [
            (c) => `(function(){ ${c} })();`,
            (c) => `!function(){ ${c} }();`,
            (c) => `var _ = []; _[0] = function(){ ${c} }; _[0]();`
        ];
        
        // Wrap the code in multiple layers
        for (let i = 0; i < 3; i++) {
            const wrapper = wrappers[Math.floor(Math.random() * wrappers.length)];
            code = wrapper(code);
        }
        
        // Add dead code
        const deadCode = `
            var 幽灵之影 = function() {
                var 暗影之力 = [${Array.from({length: 20}, () => Math.random()).join(',')}];
                return function() {
                    return 暗影之力[Math.floor(Math.random() * 暗影之力.length)];
                };
            }();
            
            try {
                var 虚空之怒 = new Function("return " + "this")();
                虚空之怒["\\x65\\x76\\x61\\x6c"]("\\x63\\x6f\\x6e\\x73\\x6f\\x6c\\x65['\\x6c\\x6f\\x67']('\\x44\\x65\\x61\\x64\\x20\\x43\\x6f\\x64\\x65\\x20\\x45\\x78\\x65\\x63\\x75\\x74\\x65\\x64')");
            } catch(龙焰之翼) {}
        `;
        
        return deadCode + code;
    }
};

// DOM interaction
document.getElementById('obfuscationLevel').addEventListener('change', function() {
    const level = parseInt(this.value);
    const infoDiv = document.getElementById('levelInfo');
    
    switch(level) {
        case 1:
            infoDiv.textContent = "Level 1: Basic Unicode variable/function renaming with common Chinese characters.";
            break;
        case 2:
            infoDiv.textContent = "Level 2: Extended Unicode with hex escapes in strings and random variable declarations.";
            break;
        case 3:
            infoDiv.textContent = "Level 3: Extreme obfuscation with multiple wrapper functions, dead code, and eval tricks.";
            break;
    }
});

document.getElementById('obfuscateBtn').addEventListener('click', function() {
    const code = document.getElementById('codeInput').value;
    const level = parseInt(document.getElementById('obfuscationLevel').value);
    
    if (!code.trim()) {
        alert("Please enter some code to obfuscate!");
        return;
    }
    
    let obfuscatedCode;
    try {
        switch(level) {
            case 1:
                obfuscatedCode = 高宝座BaseObfuscator.level1(code);
                break;
            case 2:
                obfuscatedCode = 高宝座BaseObfuscator.level2(code);
                break;
            case 3:
                obfuscatedCode = 高宝座BaseObfuscator.level3(code);
                break;
            default:
                obfuscatedCode = "Invalid level selected";
        }
        
        document.getElementById('codeOutput').value = obfuscatedCode;
    } catch (e) {
        alert("Obfuscation failed: " + e.message);
        console.error(e);
    }
});
