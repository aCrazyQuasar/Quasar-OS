/**
 * Quasar OS Animated Wallpaper - Sci-Fi Cyber Terminal
 * Theme: Spicy Blue Terminal with Continuous Auto-Scrolling Python Code
 */

// Python code snippets to feed the auto-typer
const PYTHON_SNIPPETS = [
    "import asyncio",
    "import numpy as np",
    "from quasar_core import SystemEngine, SecurityProtocol",
    "",
    "class CyberMatrix(SystemEngine):",
    "    def __init__(self, core_id: str, max_threads: int = 128):",
    "        super().__init__(core_id)",
    "        self.active_threads = max_threads",
    "        self.encryption_key = SecurityProtocol.generate_rsa_key(bits=4096)",
    "        self._status = 'INITIALIZED'",
    "",
    "    async def initialize_stream(self, target_host: str, port: int = 8443) -> bool:",
    "        print(f'[SYSTEM] Connecting to quantum node at {target_host}:{port}...')",
    "        await asyncio.sleep(0.05)",
    "        if not self.verify_handshake(target_host):",
    "            raise ConnectionError('Handshake failed: Invalid response hash')",
    "        ",
    "        self._status = 'CONNECTED'",
    "        print('[SUCCESS] Encrypted pipeline established.')",
    "        return True",
    "",
    "    def execute_payload(self, buffer: bytes) -> np.ndarray:",
    "        matrix = np.frombuffer(buffer, dtype=np.float32)",
    "        transformed = np.fft.fft2(matrix) * np.sin(np.pi / 4)",
    "        return transformed.reshape((-1, 64))",
    "",
    "async def main():",
    "    node = CyberMatrix(core_id='QSR-9982-FX', max_threads=256)",
    "    connected = await node.initialize_stream('127.0.0.1', port=9090)",
    "    ",
    "    while connected:",
    "        data_chunk = np.random.bytes(2048)",
    "        result = node.execute_payload(data_chunk)",
    "        await asyncio.sleep(0.01)",
    "",
    "if __name__ == '__main__':",
    "    asyncio.run(main())"
];

// Python syntax highlighter token definitions
const TOKENS = [
    { type: 'keyword', regex: /^\b(import|from|class|def|return|if|else|elif|while|for|in|async|await|raise|as|pass|break|continue|try|except|finally|with|assert)\b/ },
    { type: 'builtin', regex: /^\b(print|super|len|range|int|float|str|bytes|bool|dict|list|set|tuple|type|isinstance)\b/ },
    { type: 'constant', regex: /^\b(True|False|None)\b/ },
    { type: 'string', regex: /^('[^']*'|"[^"]*")/ },
    { type: 'comment', regex: /^(#.*)/ },
    { type: 'number', regex: /^\b\d+(\.\d+)?\b/ },
    { type: 'decorator', regex: /^@[a_zA_Z_]\w*/ },
    { type: 'symbol', regex: /^[{}()[\]:;=+\-*/%,.<>!&|^]/ },
    { type: 'identifier', regex: /^[a-zA-Z_]\w*/ },
    { type: 'whitespace', regex: /^\s+/ }
];

export const PythonTerminalWallpaper = {
    init(API) {
        this.fontSize = 15;
        this.lineHeight = 22;
        this.padding = 35;
        
        // Color Palette (Spicy Blue Theme)
        this.colors = {
            bg: '#040b16',
            panelBg: 'rgba(7, 18, 38, 0.75)',
            panelBorder: 'rgba(0, 212, 255, 0.25)',
            glow: 'rgba(0, 180, 255, 0.15)',
            prompt: '#00ffcc',
            cursor: '#00d4ff',
            syntax: {
                keyword: '#ff007f',    // Spicy magenta/pink key
                builtin: '#00f0ff',    // Bright electric cyan
                constant: '#ffaa00',   // Spicy amber
                string: '#00ff99',     // Neon green-blue
                comment: '#48658a',    // Muted blue gray
                number: '#ff5577',     // Spicy coral
                symbol: '#00d4ff',     // Vibrant blue
                identifier: '#d0f0ff', // Ice light blue
                text: '#a0c8e6'        // Default blue-tint text
            }
        };

        // State variables
        this.lines = ['>>> # Quasar OS Python Kernel v4.12 initialized', '>>> '];
        this.snippetIndex = 0;
        this.charIndex = 0;
        this.typingTimer = 0;
        this.typingSpeed = 25; // Milliseconds per char
        this.cursorVisible = true;
        this.cursorTimer = 0;

        // Background decorative grids/particles
        this.bgGridOffset = 0;
    },

    tokenize(text) {
        let tokens = [];
        let index = 0;

        while (index < text.length) {
            let substring = text.slice(index);
            let matched = false;

            for (const tokenDef of TOKENS) {
                const match = substring.match(tokenDef.regex);
                if (match) {
                    tokens.push({ type: tokenDef.type, value: match[0] });
                    index += match[0].length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                tokens.push({ type: 'text', value: text[index] });
                index++;
            }
        }
        return tokens;
    },

    updateTyping(dt) {
        this.typingTimer += dt;
        this.cursorTimer += dt;

        if (this.cursorTimer >= 500) {
            this.cursorVisible = !this.cursorVisible;
            this.cursorTimer = 0;
        }

        if (this.typingTimer >= this.typingSpeed) {
            this.typingTimer = 0;

            const targetSnippet = PYTHON_SNIPPETS[this.snippetIndex];

            if (this.charIndex < targetSnippet.length) {
                // Type next character
                this.lines[this.lines.length - 1] += targetSnippet[this.charIndex];
                this.charIndex++;
            } else {
                // Advance to next line
                this.snippetIndex = (this.snippetIndex + 1) % PYTHON_SNIPPETS.length;
                this.charIndex = 0;
                
                // Add new prompt if next line is a top-level construct, else indent continuation
                const nextSnippet = PYTHON_SNIPPETS[this.snippetIndex];
                const isTopLevel = !nextSnippet.startsWith(' ') && nextSnippet.length > 0;
                
                this.lines.push(isTopLevel ? '>>> ' : '... ');
            }
        }
    },

    render(ctx, API, time, dt) {
        this.updateTyping(dt);

        const width = API.width;
        const height = API.height;

        // 1. Draw Deep Cyber/Spicy Blue Background
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#020610');
        bgGradient.addColorStop(0.5, '#051329');
        bgGradient.addColorStop(1, '#01050d');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // 2. Ambient Grid Background Animation
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 150, 255, 0.04)';
        ctx.lineWidth = 1;
        const gridSize = 40;
        this.bgGridOffset = (this.bgGridOffset + dt * 0.01) % gridSize;

        for (let x = 0; x < width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = this.bgGridOffset; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.restore();

        // 3. Draw Terminal Window Container
        const windowMargin = 40;
        const termX = windowMargin;
        const termY = windowMargin;
        const termWidth = width - windowMargin * 2;
        const termHeight = height - windowMargin * 2;

        // Outer Glow & Panel Background
        ctx.save();
        ctx.shadowColor = 'rgba(0, 212, 255, 0.2)';
        ctx.shadowBlur = 20;
        ctx.fillStyle = this.colors.panelBg;
        ctx.strokeStyle = this.colors.panelBorder;
        ctx.lineWidth = 1.5;

        // Rounded Rectangle Window
        ctx.beginPath();
        ctx.roundRect(termX, termY, termWidth, termHeight, 10);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Header / Window Control Bar
        ctx.save();
        ctx.fillStyle = 'rgba(0, 212, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(termX, termY, termWidth, 36, [10, 10, 0, 0]);
        ctx.fill();

        // Terminal Window Buttons
        const btnColors = ['#ff5f56', '#ffbd2e', '#27c93f'];
        btnColors.forEach((color, i) => {
            ctx.beginPath();
            ctx.arc(termX + 20 + i * 20, termY + 18, 5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });

        // Window Title
        ctx.font = '12px "Fira Code", "Consolas", monospace';
        ctx.fillStyle = 'rgba(0, 212, 255, 0.6)';
        ctx.textAlign = 'center';
        ctx.fillText('quasar_os_kernel_terminal_v4.py', termX + termWidth / 2, termY + 22);
        ctx.restore();

        // 4. Terminal Text Rendering & Auto-Scrolling Logic
        ctx.save();
        ctx.font = `${this.fontSize}px "Fira Code", "JetBrains Mono", "Consolas", monospace`;
        ctx.textBaseline = 'top';

        // Set clipping mask for terminal text content area
        const contentX = termX + this.padding;
        const contentY = termY + 50;
        const contentWidth = termWidth - this.padding * 2;
        const contentHeight = termHeight - 70;

        ctx.beginPath();
        ctx.rect(contentX, contentY, contentWidth, contentHeight);
        ctx.clip();

        // Calculate scrolling offset
        const totalTextHeight = this.lines.length * this.lineHeight;
        let scrollOffsetY = 0;

        if (totalTextHeight > contentHeight) {
            scrollOffsetY = totalTextHeight - contentHeight;
        }

        // Render visible lines
        this.lines.forEach((lineText, index) => {
            const lineY = contentY + index * this.lineHeight - scrollOffsetY;

            // Render line only if visible inside clip area
            if (lineY + this.lineHeight > contentY && lineY < contentY + contentHeight) {
                let currentX = contentX;

                // Handle system prompts vs normal syntax
                if (lineText.startsWith('>>> ') || lineText.startsWith('... ')) {
                    const prompt = lineText.slice(0, 4);
                    const code = lineText.slice(4);

                    // Render Prompt
                    ctx.fillStyle = this.colors.prompt;
                    ctx.fillText(prompt, currentX, lineY);
                    currentX += ctx.measureText(prompt).width;

                    // Tokenize and Render Syntax
                    const tokens = this.tokenize(code);
                    for (const token of tokens) {
                        ctx.fillStyle = this.colors.syntax[token.type] || this.colors.syntax.text;
                        ctx.fillText(token.value, currentX, lineY);
                        currentX += ctx.measureText(token.value).width;
                    }
                } else {
                    ctx.fillStyle = this.colors.syntax.comment;
                    ctx.fillText(lineText, currentX, lineY);
                    currentX += ctx.measureText(lineText).width;
                }

                // Render Blinking Cursor on the current active line
                if (index === this.lines.length - 1 && this.cursorVisible) {
                    ctx.fillStyle = this.colors.cursor;
                    ctx.fillRect(currentX, lineY + 2, 8, this.fontSize);
                }
            }
        });

        ctx.restore();

        // 5. Subtle Scanlines & Vignette overlay effect
        ctx.save();
        ctx.fillStyle = 'rgba(0, 20, 40, 0.03)';
        for (let y = termY; y < termY + termHeight; y += 4) {
            ctx.fillRect(termX, y, termWidth, 2);
        }
        ctx.restore();
    },

    destroy() {
        this.lines = [];
    }
};