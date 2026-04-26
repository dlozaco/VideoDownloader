use std::path::PathBuf;
use std::process::Command;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

use tauri::{path::BaseDirectory, Manager};

#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x08000000;

fn normalize_extension(extension: &str) -> Option<&str> {
    match extension.trim().to_lowercase().as_str() {
        "mp4" => Some("mp4"),
        "mp3" => Some("mp3"),
        _ => None,
    }
}

fn normalize_quality(quality: &str) -> Option<&str> {
    match quality.trim().to_lowercase().as_str() {
        "1080" => Some("1080"),
        "720" => Some("720"),
        "best" => Some("best"),
        _ => None,
    }
}

fn build_mp4_format_selector(quality: &str) -> &'static str {
    match quality {
        "1080" => {
            "bestvideo[ext=mp4][height=1080]+bestaudio[ext=m4a]/bestvideo*[height=1080]+bestaudio[ext=m4a]/bestvideo*[height=1080]+bestaudio[acodec^=mp4a]"
        }
        "720" => {
            "bestvideo[ext=mp4][height=720]+bestaudio[ext=m4a]/bestvideo*[height=720]+bestaudio[ext=m4a]/bestvideo*[height=720]+bestaudio[acodec^=mp4a]"
        }
        _ => {
            "bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio[ext=m4a]/bestvideo+bestaudio[acodec^=mp4a]"
        }
    }
}

fn build_output_template(extension: &str, quality: &str, video_path: &str) -> String {
    let filename_pattern = if extension == "mp4" {
        let suffix = match quality {
            "1080" => "_1080p",
            "720" => "_720p",
            _ => "_best",
        };
        format!("%(title)s{}.%(ext)s", suffix)
    } else {
        "%(title)s.%(ext)s".to_string()
    };

    if video_path.trim().is_empty() {
        filename_pattern
    } else {
        PathBuf::from(video_path)
            .join(filename_pattern)
            .to_string_lossy()
            .to_string()
    }
}

fn resolve_ffmpeg_path(app: &tauri::AppHandle) -> Option<PathBuf> {
    let target_candidates = [
        "ffmpeg-x86_64-pc-windows-msvc.exe",
        "ffmpeg-x86_64-pc-windows-gnu.exe",
        "ffmpeg.exe",
    ];

    for candidate in target_candidates {
        if let Ok(path) = app.path().resolve(candidate, BaseDirectory::Resource) {
            if path.exists() {
                return Some(path);
            }
        }
    }

    // Dev-mode fallback: binaries in src-tauri/bin.
    let dev_bin = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("bin");

    for candidate in target_candidates {
        let candidate_path = dev_bin.join(candidate);
        if candidate_path.exists() {
            return Some(candidate_path);
        }
    }

    None
}

fn resolve_yt_dlp_path(app: &tauri::AppHandle) -> Option<PathBuf> {
    let target_candidates = [
        "yt-dlp-x86_64-pc-windows-msvc.exe",
        "yt-dlp-x86_64-pc-windows-gnu.exe",
        "yt-dlp.exe",
    ];

    for candidate in target_candidates {
        if let Ok(path) = app.path().resolve(candidate, BaseDirectory::Resource) {
            if path.exists() {
                return Some(path);
            }
        }
    }

    // Dev-mode fallback: binaries in src-tauri/bin.
    let dev_bin = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("bin");

    for candidate in target_candidates {
        let candidate_path = dev_bin.join(candidate);
        if candidate_path.exists() {
            return Some(candidate_path);
        }
    }

    None
}

#[tauri::command]
async fn descargar_video_cmd(
    app: tauri::AppHandle,
    url: String,
    format: String,
    quality: String,
    video_path: String,
) -> Result<String, String> {
    let extension = normalize_extension(&format)
        .ok_or_else(|| "Format must be 'mp4' or 'mp3'".to_string())?;
    let selected_quality = normalize_quality(&quality)
        .ok_or_else(|| "Quality must be '1080', '720', or 'best'".to_string())?;

    let yt_dlp_path = resolve_yt_dlp_path(&app)
        .ok_or_else(|| "yt-dlp sidecar not found in app resources".to_string())?;
    let ffmpeg_path = resolve_ffmpeg_path(&app)
        .ok_or_else(|| "ffmpeg sidecar not found in app resources".to_string())?;

    if !video_path.trim().is_empty() {
        std::fs::create_dir_all(&video_path)
            .map_err(|e| format!("Could not create output folder: {}", e))?;
    }

    let output_template = build_output_template(extension, selected_quality, &video_path);

    let mut command = Command::new(yt_dlp_path);
    command
        .arg("--no-playlist")
        .arg("--newline")
        .arg("-o")
        .arg(output_template)
        .arg("--ffmpeg-location")
        .arg(ffmpeg_path);

    if extension == "mp3" {
        command
            .arg("-f")
            .arg("bestaudio/best")
            .arg("-x")
            .arg("--audio-format")
            .arg("mp3")
            .arg("--audio-quality")
            .arg("192K");
    } else {
        command
            .arg("-f")
            .arg(build_mp4_format_selector(selected_quality))
            .arg("--merge-output-format")
            .arg("mp4");
    }

    command.arg(&url);

    #[cfg(windows)]
    {
        // Prevent opening a visible console window in packaged app.
        command.creation_flags(CREATE_NO_WINDOW);
    }

    let output = command
        .output()
        .map_err(|e| format!("Error while executing yt-dlp: {}", e))?;

    if output.status.success() {
        Ok("Download completed".to_string())
    } else {
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
        let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
        let detail = if !stderr.is_empty() {
            stderr
        } else if !stdout.is_empty() {
            stdout
        } else {
            format!("yt-dlp exited with status {} and no output", output.status)
        };

        Err(format!("Error in yt-dlp: {}", detail))
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![descargar_video_cmd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
