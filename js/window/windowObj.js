let winId = 1;
class QuasarWindow {
    constructor(element) {
        if (!element) return;
        
        this.win = element;
        this.bar = this.win.querySelector('.bar');
        this.handle = this.win.querySelector('.resize-handle');
        this.closeBtn = this.win.querySelector('.close-btn');
        
        // 1. Target the first button in the container for Fullscreen
        this.fullscreenBtn = this.win.querySelector('.btns .btn:first-child');

        // State tracking
        this.isDragging = false;
        this.isResizing = false;
        
        // 2. Added states to track fullscreen and remember old sizes
        this.isMaximized = false;
        this.savedStyles = { top: '', left: '', width: '', height: '' };

        this.startX = 0;
        this.startY = 0;
        this.initialLeft = 0;
        this.initialTop = 0;
        this.startWidth = 0;
        this.startHeight = 0;

        this.initEvents();
    }

    initEvents() {
        // --- DRAG EVENTS ---
        if (this.bar) {
            this.bar.addEventListener('mousedown', (e) => {
                if (e.target.closest('.btns')) return;
                if (this.isMaximized) return; // 3. Prevent dragging if it's fullscreen
                
                this.isDragging = true;
                this.win.classList.add('dragging');
                this.win.style.zIndex = '100';

                this.startX = e.clientX;
                this.startY = e.clientY;
                this.initialLeft = this.win.offsetLeft;
                this.initialTop = this.win.offsetTop;

                this.dragMoveHandler = this.dragMove.bind(this);
                this.dragEndHandler = this.dragEnd.bind(this);

                document.addEventListener('mousemove', this.dragMoveHandler);
                document.addEventListener('mouseup', this.dragEndHandler);
            });
        }

        if (this.handle) {
        this.handle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.isMaximized) return;

            this.isResizing = true;
            // Add this line so the iframe ignores mouse movements while resizing
            this.win.classList.add('dragging'); 

            this.startX = e.clientX;
            this.startY = e.clientY;
            this.startWidth = this.win.offsetWidth;
            this.startHeight = this.win.offsetHeight;

            this.resizeMoveHandler = this.resizeMove.bind(this);
            this.resizeEndHandler = this.resizeEnd.bind(this);

            document.addEventListener('mousemove', this.resizeMoveHandler);
            document.addEventListener('mouseup', this.resizeEndHandler);
        });
    }

        // --- FULLSCREEN / MAXIMIZE EVENT ---
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // --- CLOSE EVENT ---
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.win.remove();
            });
        }
        
        // --- FOCUS WINDOW ON CLICK ---
        this.win.addEventListener('mousedown', () => {
            document.querySelectorAll('.window').forEach(w => w.style.zIndex = '1');
            this.win.style.zIndex = '2';
        });
    }

    // 5. New Toggle Fullscreen Method
    toggleFullscreen() {
        if (!this.isMaximized) {
            // Save current position and dimensions before breaking them
            this.savedStyles.top = this.win.style.top;
            this.savedStyles.left = this.win.style.left;
            this.savedStyles.width = this.win.style.width;
            this.savedStyles.height = this.win.style.height;

            // Turn on fullscreen styling
            this.win.classList.add('maximized');
            this.isMaximized = true;
        } else {
            // Revert back to the exact window dimensions it had before maximizing
            this.win.classList.remove('maximized');
            this.win.style.top = this.savedStyles.top;
            this.win.style.left = this.savedStyles.left;
            this.win.style.width = this.savedStyles.width;
            this.win.style.height = this.savedStyles.height;
            this.isMaximized = false;
        }
    }

    // Drag Actions
    dragMove(e) {
        if (!this.isDragging) return;
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        this.win.style.left = `${this.initialLeft + deltaX}px`;
        this.win.style.top = `${this.initialTop + deltaY}px`;
    }

    dragEnd() {
        this.isDragging = false;
        this.win.classList.remove('dragging');
        document.removeEventListener('mousemove', this.dragMoveHandler);
        document.removeEventListener('mouseup', this.dragEndHandler);
    }

    // Resize Actions
    resizeMove(e) {
        if (!this.isResizing) return;
        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;
        this.win.style.width = `${this.startWidth + deltaX}px`;
        this.win.style.height = `${this.startHeight + deltaY}px`;
    }

    resizeEnd() {
        this.isResizing = false;
        this.win.classList.remove('dragging');
        document.removeEventListener('mousemove', this.resizeMoveHandler);
        document.removeEventListener('mouseup', this.resizeEndHandler);
    }
}
function createWindowCode(name, rawCode) {
    const currentId = `quasar-win-${winId}`;
    const code = `
        <div class="window" id="${currentId}" style="top: ${100 + (winId * 20) % 200}px; left: ${100 + (winId * 20) % 300}px;">
            <div class="bar">
                <p>${name}</p>
                <div class="btns">
                    <div class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>
                    </div>
                    <div class="btn close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                </div>
            </div>
            <iframe sandbox="allow-scripts allow-same-origin"></iframe>
            <div class="resize-handle"></div>
        </div>
    `;
    winId += 1;
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    const newWindowEl = doc.body.firstElementChild;
    const iframe = newWindowEl.querySelector('iframe');
    if (iframe) {
        iframe.srcdoc = rawCode;
    }
    document.body.appendChild(newWindowEl);
    new QuasarWindow(newWindowEl);
    newWindowEl.focus();
    return newWindowEl;
}
function createWindowWebpage(name, src) {
    const currentId = `quasar-win-${winId}`;
    const code = `
        <div class="window" id="${currentId}" style="top: ${100 + (winId * 20) % 200}px; left: ${100 + (winId * 20) % 300}px;">
            <div class="bar">
                <p>${name}</p>
                <div class="btns">
                    <div class="btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>
                    </div>
                    <div class="btn close-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                    </div>
                </div>
            </div>
            <iframe src="${src}"></iframe>
            <div class="resize-handle"></div>
        </div>
    `;
    winId += 1;
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    const newWindowEl = doc.body.firstElementChild;
    document.body.appendChild(newWindowEl);
    new QuasarWindow(newWindowEl);
    newWindowEl.focus();
    return newWindowEl;
}
function createWindowJsDelivr(name, src) {
    const currentId = `quasar-win-${winId}`;
    fetch(src)
    .then(response => response.text())
    .then(rawCode => {
        const code = `
            <div class="window" id="${currentId}" style="top: ${100 + (winId * 20) % 200}px; left: ${100 + (winId * 20) % 300}px;">
                <div class="bar">
                    <p>${name}</p>
                    <div class="btns">
                        <div class="btn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>
                        </div>
                        <div class="btn close-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </div>
                    </div>
                </div>
                <iframe></iframe>
                <div class="resize-handle"></div>
            </div>
        `;
        winId += 1;
        const parser = new DOMParser();
        const doc = parser.parseFromString(code, 'text/html');
        const newWindowEl = doc.body.firstElementChild;
        const iframe = newWindowEl.querySelector('iframe');
        if (iframe) {
            iframe.srcdoc = rawCode;
        }
        document.body.appendChild(newWindowEl);
        new QuasarWindow(newWindowEl);
        newWindowEl.focus();
        return newWindowEl;
    });
}

export {createWindowCode, createWindowWebpage, createWindowJsDelivr};