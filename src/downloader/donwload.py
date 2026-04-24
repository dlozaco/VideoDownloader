import yt_dlp
import sys
import os
import shutil

def download_video(url, extension, video_path=None):
    extension = (extension or "mp4").strip().lower()

    if extension not in {"mp4", "mp3"}:
        print("Error: extension must be 'mp4' or 'mp3'.", file=sys.stderr)
        return False

    if extension == "mp3" and shutil.which("ffmpeg") is None:
        print("Error: MP3 requires ffmpeg installed.", file=sys.stderr)
        return False

    ffmpeg_available = shutil.which("ffmpeg") is not None

    output_template = os.path.join(video_path, "%(title)s.%(ext)s") if video_path else "%(title)s.%(ext)s"

    ydl_opts = {
        'outtmpl': output_template,
        'noplaylist': True,
        'quiet': True,
        'no_warnings': False,
        'extractor_args': {
            'youtube': {
                'player_client': ['android', 'web']
            }
        },
    }

    if extension == "mp3":
        ydl_opts.update({
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        })
    else:
        if ffmpeg_available:
            ydl_opts.update({
                'format': 'bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]/best',
                'merge_output_format': 'mp4',
            })
        else:
            ydl_opts.update({
                'format': 'best[ext=mp4][height<=1080]/best[height<=1080]/best',
            })
            print("Warning: ffmpeg not found, downloading MP4 without track merge (quality may be lower).")

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Downloading {extension.upper()} from: {url}")
            ydl.download([url])
        print("Download completed successfully.")
        return True
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python download.py <url> <extension> [output_path]")
        sys.exit(1)

    url_arg = sys.argv[1]
    extension_arg = sys.argv[2]
    output_path_arg = sys.argv[3] if len(sys.argv) > 3 else None

    if output_path_arg and not os.path.exists(output_path_arg):
        os.makedirs(output_path_arg)

    ok = download_video(url_arg, extension_arg, output_path_arg)
    sys.exit(0 if ok else 1)