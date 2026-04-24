# VideoDownloader 🎬🎵

A modern, fast, and lightweight desktop application designed to download videos and music.

## 🚀 Technologies

This project uses a hybrid technology stack to provide excellent performance and ease of use:

* **[Tauri](https://tauri.app/):** The main framework used to build secure and lightweight desktop apps with Rust.
* **[React](https://reactjs.org/) + [Vite](https://vitejs.dev/):** For a fast, reactive, and modern user interface (Frontend).
* **[Rust](https://www.rust-lang.org/):** Handles high-performance backend logic with memory safety.
* **[Python](https://www.python.org/):** Used for media processing and downloading.

## 🛠️ Prerequisites

Before getting started, make sure you have the following installed on your system:

1.  **Node.js** (LTS version recommended)
2.  **Rust and Cargo** (install via [rustup](https://rustup.rs/))
3.  **Python 3.x**
4.  **[FFmpeg](https://ffmpeg.org/download.html):** Required to process, convert, and merge downloaded video and audio tracks. Make sure it is added to your system PATH.
5.  **System dependencies for Tauri:** Check the [official Tauri prerequisites guide](https://tauri.app/v1/guides/getting-started/prerequisites) for your operating system (Windows, macOS, or Linux).

## ⚙️ Installation

Follow these steps to set up the development environment:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/dlozaco/VideoDownloader.git
    cd VideoDownloader
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## 📥 Download (End Users)

If you only want to use the app (without developing it), use one of these options:

1.  **Download a prebuilt release (recommended):**
    - Open the project Releases page: https://github.com/dlozaco/VideoDownloader/releases
    - Download the installer or executable for your OS.

2.  **Build the executable locally:**
    ```bash
    npm run tauri build
    ```
    After build finishes, the executable is typically generated at:
    - `src-tauri/target/release/videodownloader.exe`

    Installers/bundles are typically generated inside:
    - `src-tauri/target/release/bundle`

## ▶️ Quick Start (Using the App)

1.  Open the app.
2.  Paste a YouTube URL.
3.  Choose format (`MP4` or `MP3`).
4.  If `MP4` is selected, choose quality (`720p`, `1080p`, or `Best`).
5.  Click **Start**.
6.  Confirm the preview and select destination folder.
7.  Wait for the download to complete.

## 🖥️ Development Usage

To run the application in development mode with live reload:

```bash
npm run tauri dev
```