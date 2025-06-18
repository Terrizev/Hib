// Level 1: Polymorphic code generator
const _0x = (function() {
    const chars = '0123456789abcdef';
    const dict = {};
    for (let i = 0; i < 256; i++) {
        const key = '0x' + chars[(i >> 4) & 0xF] + chars[i & 0xF];
        dict[key] = String.fromCharCode(i);
    }
    return function(s) {
        return s.replace(/0x[0-9a-f]{2}/g, function(m) {
            return dict[m] || m;
        });
    };
})();

// Level 2: Environment detection
const isDebugging = (function() {
    const start = Date.now();
    debugger;
    return Date.now() - start > 100;
})();

// Level 3: Control flow obfuscation
function _0xf1a9b(_0x5c3d2a) {
    function _0x2a7b45(_0x5a1d8f) {
        if (typeof _0x5a1d8f === 'string') {
            return function(_0x3e7a80) {}
            .constructor('while (true) {}').apply('counter');
        } else {
            if (('' + _0x5a1d8f / _0x5a1d8f).length !== 1 || _0x5a1d8f % 20 === 0) {
                (function() {
                    return true;
                }
                .constructor(_0x_('0x6465627567') + _0x_('0x676572')).call(_0x_('0x616374696f6e')));
            } else {
                (function() {
                    return false;
                }
                .constructor(_0x_('0x6465627567') + _0x_('0x676572')).call(_0x_('0x616374696f6e')));
            }
        }
        _0x2a7b45(++_0x5a1d8f);
    }
    try {
        if (_0x5c3d2a) {
            return _0x2a7b45;
        } else {
            _0x2a7b45(0);
        }
    } catch (_0x3a1d5e) {}
}

// Level 4: Cryptographic obfuscation
const _0x4d2f1 = (function() {
    let _0x1e3a5d = true;
    return function(_0x5b8a2c, _0x2d7a4e) {
        const _0x3c1a9f = _0x1e3a5d ? function() {
            if (_0x2d7a4e) {
                const _0x5e8a3d = _0x2d7a4e.apply(_0x5b8a2c, arguments);
                _0x2d7a4e = null;
                return _0x5e8a3d;
            }
        } : function() {};
        _0x1e3a5d = false;
        return _0x3c1a9f;
    };
})();

// Level 5: Runtime code generation
const _0x1a2f8 = _0x4d2f1(this, function() {
    const _0x5e8a3e = function() {
        let _0x3c1aa0;
        try {
            const _0x2a7b46 = Function('return (function() {}.constructor("return this")());');
            _0x3c1aa0 = _0x2a7b46();
        } catch (_0x5b8a2d) {
            _0x3c1aa0 = window;
        }
        return _0x3c1aa0;
    };
    const _0x3c1aa1 = _0x5e8a3e();
    const _0x2d7a4f = _0x3c1aa1.console = _0x3c1aa1.console || {};
    const _0x1e3a5e = ['log', 'warn', 'error', 'exception', 'table', 'trace'];
    
    for (let _0x5c3d2b = 0; _0x5c3d2b < _0x1e3a5e.length; _0x5c3d2b++) {
        _0x2d7a4f[_0x1e3a5e[_0x5c3d2b]] = _0x4d2f1(this, function() {
            return Function.prototype.constructor(_0x_('0x72657475726e20') + _0x_('0x66616c7365')).call(_0x_('0x6465627567'));
        });
    }
});

_0x1a2f8();

// Application initialization with anti-tampering
(function() {
    // Anti-tampering checks
    if (isDebugging || typeof window._$ !== 'undefined') {
        document.body.innerHTML = _0x_('0x4163636573732064656e696564');
        return;
    }

    // Shadow DOM manipulation
    const template = document.getElementById('shadow-template');
    const shadowRoot = template.shadowRoot;
    
    // Polymorphic content injection
    const content = document.createElement('div');
    content.slot = 'content';
    content.innerHTML = `
        <style>
            :host {
                display: block;
                padding: 20px;
                font-family: Arial;
            }
            h1 {
                color: #${Math.floor(Math.random()*16777215).toString(16)};
            }
        </style>
        <h1>${_0x_('0x536563757265204170706c69636174696f6e')}</h1>
        <p>${_0x_('0x54686973206170706c69636174696f6e2069732070726f7465637465642077697468206d756c7469706c65206c6179657273206f66206f62667573636174696f6e')}</p>
    `;
    
    shadowRoot.appendChild(content);
    
    // Deceptive event listeners
    window.addEventListener('resize', function() {
        if (window.outerWidth - window.innerWidth > 200 || 
            window.outerHeight - window.innerHeight > 200) {
            document.body.innerHTML = _0x_('0x446576546f6f6c73206465746563746564');
        }
    });
    
    // Fake debugger trap
    setInterval(function() {
        if (Date.now() % 10000 < 50) {
            debugger;
        }
    }, 1000);
})();

// Helper function for hex string conversion
function _0x_(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}
