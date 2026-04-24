use std::process::Command;
use std::path::PathBuf;

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[cfg(windows)]
const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
async fn descargar_video_cmd(url: String, format: String, quality: String, video_path: String) -> Result<String, String> {
    let script_path: PathBuf = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../src/downloader/donwload.py");

    if !script_path.exists() {
        return Err(format!(
            "Python script not found at: {}",
            script_path.display()
        ));
    }

    let mut command = Command::new("python");
    command
        .arg(script_path)
        .arg(&url)
        .arg(&format)
        .arg(&quality)
        .arg(&video_path);

    #[cfg(windows)]
    {
        // Prevent opening a visible python.exe console window in packaged app.
        command.creation_flags(CREATE_NO_WINDOW);
    }

    let output = command
        .output()
        .map_err(|e| format!("Error while executing Python: {}", e))?;

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
            format!("Python exited with status {} and no output", output.status)
        };

        Err(format!("Error in Python: {}", detail))
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
