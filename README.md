# Quasar OS

**Quasar OS** is a modern browser-based operating system built entirely with web technologies. It combines the flexibility of the web with the familiar experience of a desktop environment, allowing applications to run inside isolated windows while sharing a unified operating system interface.

Quasar OS is designed to be lightweight, extensible, and highly customizable. From animated wallpapers to third-party applications, nearly every part of the system can be modified or extended.

---

# ✨ Features

## 🖥️ Desktop Environment

* Full desktop-style interface
* Draggable and resizable windows
* Taskbar and application launcher
* Multi-window application support
* Responsive design for multiple screen sizes

## 📦 Application System

Applications run inside isolated iframes, providing:

* Security through sandboxing
* Independent application execution
* Easy third-party app development
* Crash isolation
* Modular architecture

Each application can be developed using standard web technologies:

* HTML
* CSS
* JavaScript
* qScript (currently in development)
* WebAssembly (optional)


# 🏗️ Architecture

```text
┌──────────────────────────────┐
│          Quasar OS           │
├──────────────────────────────┤
│         Desktop UI           │
├──────────────────────────────┤
│      Window Management       │
├──────────────────────────────┤
│       Application API        │
├──────────────────────────────┤
│      Sandboxed Iframes       │
├──────────────────────────────┤
│        Web Browser           │
└──────────────────────────────┘
```

## Core Components

### Desktop Manager

Responsible for:

* Desktop rendering
* Wallpaper management
* Context menus (later)

### Window Manager

Handles:

* Window creation
* Focus management
* Resizing
* Dragging
* Minimize/restore
* Z-index ordering

### Application Runtime

Responsible for:

* Loading applications
* Managing iframe containers
* Inter-process communication
* Permission handling

### Wallpaper Runtime

Responsible for:

* Loading wallpaper modules
* Managing render loops
* Canvas rendering
* Performance optimization

---

# 📁 Project Structure

```text
quasar-os/
│
├── apps/
│   ├── browser/
│   ├── settings/
│   ├── terminal/
│   └── ...
│
├── wallpapers/
│   ├── sunset.js
│   ├── asteroidField.js
│   └── ...
│
├── js/
│   ├── desktop/
│   ├── window/
│   ├── wallpaper/
│   └── ...
│
├── css/
│
├── assets/
│
├── index.html
│
└── README.md
```

---

# 🧩 Creating Applications

Applications are simply web pages loaded inside iframes.

Example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello App</title>
</head>
<body>
    <h1>Hello Quasar!</h1>
</body>
</html>
```

Register the application: (feature in dev)

```javascript
registerApp({
    id: "hello",
    name: "Hello App",
    icon: "/icons/hello.svg",
    entry: "/apps/hello/index.html"
});
```

---

# ⚡ Performance Goals

Quasar OS aims to:

* Maintain smooth desktop rendering
* Support multiple concurrent applications
* Minimize memory usage
* Reduce startup times
* Efficiently render animated wallpapers

---

# 🌍 Vision

The long-term goal of Quasar OS is to create a highly capable web operating system that feels native while remaining fully accessible through the browser.

Future goals include:

* File system support
* App marketplace
* User accounts
* Cloud synchronization
* Window snapping
* Virtual desktops
* PWA integration
* WebRTC-powered communication
* Plugin ecosystem
* Theme marketplace

---

# 🤝 Contributing

Contributions are welcome.

You can help by:

* Reporting bugs
* Suggesting features
* Improving documentation
* Creating wallpapers
* Developing applications
* Optimizing performance

---

# 📜 License

This project is licensed under the MIT License.

See the LICENSE file for details.

---

# Quasar OS

*"The browser is the platform. The desktop is the experience."*
