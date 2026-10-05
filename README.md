# Quasar OS

**Quasar OS** is a modern browser-based operating system built entirely with web technologies. It combines the flexibility of the web with the familiar experience of a desktop environment, allowing applications to run inside isolated windows while sharing a unified operating system interface.

Quasar OS is designed to be lightweight, extensible, and highly customizable. From animated wallpapers to third-party applications, nearly every part of the system can be modified or extended.

# Features

## Desktop Environment

* Full desktop-style interface
* Draggable and resizable windows
* Taskbar and application launcher
* Multi-window application support
* Responsive design for multiple screen sizes

## Application System

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
* WebAssembly (optional/indev)

Applications will eventually be packaged as a ```.qap``` file which should be self dependent/contain all dependencies.

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
* qScript Interpreting
* App decompression/loading

### Wallpaper Runtime

Responsible for:

* Loading wallpaper modules
* Managing render loops
* Canvas rendering
* Performance optimization
* Wallpaper Decompression

# Creating Applications

Applications can be built in many different ways. You can use vanilla web technologies like HTML/CSS/JS, QX, or WASM. QX is currently indev, and the app loader is currently not working so more details when that releases.

# Performance Goals

Quasar OS aims to run a fast as possible with minimal memory usage possible.

# Vision

The long-term goal of Quasar OS is to create a highly capable web operating system that feels native while remaining fully accessible through the browser.

Future goals include:

* File system support
* App marketplace
* Window snapping
* PWA integration
* WebRTC-powered communication
* Plugin ecosystem
* Theme marketplace

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
