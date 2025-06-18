// Core obfuscation engine
class UltimateObfuscator {
    constructor() {
        this.unicodeChars = '魑魅魍魎魂魄幽灵鬼魔妖煞凶煞邪惡混沌虚空幽冥玄黄';
        this.hexPrefixes = ['\\x', '\\u', '\\u0', '\\x0'];
        this.wrappers = [
            c => `(function(){${c}})();`,
            c => `!function(){${c}}();`,
            c => `+function(){${c}}();`,
            c => `var _=[];_[0]=function(){${c}};_[0]();`,
            c => `(function(a,b){${c}})(+[],+[]);`
        ];
        this.antiDebugCode = `
            function 检测调试器(){
                var 开始时间=performance.now();
                debugger;
                var 结束时间=performance.now();
                if(结束时间-开始时间>100){
                    document.body.innerHTML='<h1 style="color:red">DEBUGGER DETECTED</h1>';
                    while(true){}
                }
            }
            setInterval(检测调试器,1000);
            检测调试器();
        `;
    }

    // Generate random Unicode identifier
    randomIdentifier(length = 8) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.unicodeChars.charAt(Math.floor(Math.random() * this.unicodeChars.length));
        }
        return result + Math.floor(Math.random() * 1000);
    }

    // String obfuscation with hex/unicode escapes
    obfuscateString(str) {
        let result = '';
        const method = Math.floor(Math.random() * 3);
        
        switch(method) {
            case 0: // Hex escape
                for (let i = 0; i < str.length; i++) {
                    result += `\\x${str.charCodeAt(i).toString(16).padStart(2, '0')}`;
                }
                return `"${result}"`;
                
            case 1: // Unicode escape
                for (let i = 0; i < str.length; i++) {
                    result += `\\u${str.charCodeAt(i).toString(16).padStart(4, '0')}`;
                }
                return `"${result}"`;
                
            case 2: // Split and concatenate
                const parts = [];
                let remaining = str;
                while (remaining.length > 0) {
                    const partLength = Math.max(1, Math.floor(Math.random() * Math.min(5, remaining.length)));
                    const part = remaining.substring(0, partLength);
                    remaining = remaining.substring(partLength);
                    
                    if (Math.random() > 0.5) {
                        parts.push(this.obfuscateString(part));
                    } else {
                        parts.push(`"${part}"`);
                    }
                }
                return parts.join('+');
        }
    }

    // Rename all identifiers
    renameIdentifiers(code) {
        const identifierMap = {};
        const reservedWords = new Set([
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
            'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if',
            'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw',
            'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'await'
        ]);

        // Find all identifiers
        const identifierRegex = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
        let match;
        const identifiers = new Set();
        
        while ((match = identifierRegex.exec(code)) !== null) {
            if (!reservedWords.has(match[1])) {
                identifiers.add(match[1]);
            }
        }

        // Create mapping
        Array.from(identifiers).forEach(id => {
            identifierMap[id] = this.randomIdentifier();
        });

        // Replace all identifiers
        for (const [original, obfuscated] of Object.entries(identifierMap)) {
            const regex = new RegExp(`\\b${original}\\b`, 'g');
            code = code.replace(regex, obfuscated);
        }

        return code;
    }

    // Add control flow obfuscation
    addControlFlow(code) {
        const wrapperId = this.randomIdentifier();
        const cases = [];
        const defaultCase = Math.floor(Math.random() * 5) + 1;
        
        for (let i = 1; i <= 5; i++) {
            if (i === defaultCase) {
                cases.push(`case ${i}:${code}break;`);
            } else {
                const deadCode = `console.${['log','warn','error'][Math.floor(Math.random()*3)]}(${this.obfuscateString('Red herring ' + Math.random().toString(36).substring(2, 15))});`;
                cases.push(`case ${i}:${deadCode}break;`);
            }
        }
        
        return `
            var ${wrapperId}=${Math.floor(Math.random()*4)+1};
            switch(${wrapperId}){
                ${cases.join('\n')}
                default:${code}
            }
        `;
    }

    // Add dead code
    addDeadCode(code) {
        const deadFuncs = [];
        const deadFuncCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < deadFuncCount; i++) {
            const funcName = this.randomIdentifier();
            const operations = [];
            const opCount = Math.floor(Math.random() * 5) + 2;
            
            for (let j = 0; j < opCount; j++) {
                operations.push(
                    `var ${this.randomIdentifier(4)}=${Math.floor(Math.random()*1000)};` +
                    `${this.randomIdentifier(4)}=${Math.random().toString(36).substring(2, 15)};`
                );
            }
            
            deadFuncs.push(`
                function ${funcName}(){
                    ${operations.join('\n')}
                    return ${Math.random() > 0.5 ? 'true' : 'false'};
                }
                ${funcName}();
            `);
        }
        
        return deadFuncs.join('\n') + '\n' + code;
    }

    // Main obfuscation function
    obfuscate(code, options = {}) {
        // Apply basic renaming first
        code = this.renameIdentifiers(code);
        
        // Apply string obfuscation
        const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
        code = code.replace(stringRegex, match => {
            if (match.length <= 2) return match;
            return this.obfuscateString(match.slice(1, -1), match[0]);
        });
        
        // Apply selected obfuscation techniques
        if (options.controlFlow) {
            code = this.addControlFlow(code);
        }
        
        if (options.deadCode) {
            code = this.addDeadCode(code);
        }
        
        // Add anti-debug if enabled
        if (options.antiDebug) {
            code = this.antiDebugCode + code;
        }
        
        // Apply multiple wrappers
        for (let i = 0; i < 3; i++) {
            const wrapper = this.wrappers[Math.floor(Math.random() * this.wrappers.length)];
            code = wrapper(code);
        }
        
        return code;
    }
}

// UI Interaction
document.addEventListener('DOMContentLoaded', () => {
    const obfuscator = new UltimateObfuscator();
    const inputCode = document.getElementById('inputCode');
    const outputCode = document.getElementById('outputCode');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    
    obfuscateBtn.addEventListener('click', () => {
        const options = {
            antiDebug: document.getElementById('antiDebug').checked,
            stringSplitting: document.getElementById('stringSplitting').checked,
            controlFlow: document.getElementById('controlFlow').checked,
            deadCode: document.getElementById('deadCode').checked
        };
        
        try {
            const obfuscated = obfuscator.obfuscate(inputCode.value, options);
            outputCode.value = obfuscated;
        } catch (e) {
            outputCode.value = `/* Obfuscation Error: ${e.message} */\n${inputCode.value}`;
        }
    });
    
    copyBtn.addEventListener('click', () => {
        outputCode.select();
        document.execCommand('copy');
    });
});
