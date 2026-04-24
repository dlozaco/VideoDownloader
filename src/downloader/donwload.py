import yt_dlp
import sys
import os
import shutil

SUPPORTED_EXTENSIONS = {"mp4", "mp3"}
SUPPORTED_QUALITIES = {"1080", "720", "best"}


def build_mp4_format_selector(quality):
    selectors_by_quality = {
        "1080": (
            "bestvideo[ext=mp4][height=1080]+bestaudio[ext=m4a]/"
            "bestvideo*[height=1080]+bestaudio[ext=m4a]/"
            "bestvideo*[height=1080]+bestaudio[acodec^=mp4a]"
        ),
        "720": (
            "bestvideo[ext=mp4][height=720]+bestaudio[ext=m4a]/"
            "bestvideo*[height=720]+bestaudio[ext=m4a]/"
            "bestvideo*[height=720]+bestaudio[acodec^=mp4a]"
        ),
        "best": (
            "bestvideo[ext=mp4]+bestaudio[ext=m4a]/"
            "bestvideo+bestaudio[ext=m4a]/"
            "bestvideo+bestaudio[acodec^=mp4a]"
        ),
    }
    return selectors_by_quality[quality]


def build_output_template(extension, quality, video_path):
    if extension == "mp4":
        quality_suffix = f"_{quality}p" if quality in {"1080", "720"} else "_best"
        filename_pattern = f"%(title)s{quality_suffix}.%(ext)s"
    else:
        filename_pattern = "%(title)s.%(ext)s"

    return os.path.join(video_path, filename_pattern) if video_path else filename_pattern


def build_ydl_options(extension, quality, output_template):
    options = {
        "outtmpl": output_template,
        "noplaylist": True,
        "quiet": True,
        "no_warnings": False,
    }

    if extension == "mp3":
        options.update(
            {
                "format": "bestaudio/best",
                "postprocessors": [
                    {
                        "key": "FFmpegExtractAudio",
                        "preferredcodec": "mp3",
                        "preferredquality": "192",
                    }
                ],
            }
        )
    else:
        options.update(
            {
                "format": build_mp4_format_selector(quality),
                "merge_output_format": "mp4",
            }
        )

    return options


def validate_inputs(extension, quality):
    if extension not in SUPPORTED_EXTENSIONS:
        print("Error: extension must be 'mp4' or 'mp3'.", file=sys.stderr)
        return False

    if quality not in SUPPORTED_QUALITIES:
        print("Error: quality must be '1080', '720' or 'best'.", file=sys.stderr)
        return False

    ffmpeg_available = shutil.which("ffmpeg") is not None

    if extension == "mp3" and not ffmpeg_available:
        print("Error: MP3 requires ffmpeg installed.", file=sys.stderr)
        return False

    if extension == "mp4" and not ffmpeg_available:
        print(
            "Error: MP4 requires ffmpeg to merge video and audio streams. Install ffmpeg and add it to PATH.",
            file=sys.stderr,
        )
        return False

    return True


def download_video(url, extension, quality="1080", video_path=None):
    extension = (extension or "mp4").strip().lower()
    quality = (quality or "1080").strip().lower()

    if not validate_inputs(extension, quality):
        return False

    output_template = build_output_template(extension, quality, video_path)
    ydl_options = build_ydl_options(extension, quality, output_template)

    try:
        with yt_dlp.YoutubeDL(ydl_options) as ydl:
            if extension == "mp4":
                print(f"Downloading {extension.upper()} ({quality}) from: {url}")
            else:
                print(f"Downloading {extension.upper()} from: {url}")
            ydl.download([url])

        print("Download completed successfully.")
        return True
    except Exception as e:
        error_message = str(e)
        if "Requested format is not available" in error_message and extension == "mp4":
            print(
                f"Error: this video does not provide a {quality}p stream, so that download is not possible.",
                file=sys.stderr,
            )
        else:
            print(f"Error: {error_message}", file=sys.stderr)
        return False


def ensure_output_dir(path):
    if path and not os.path.exists(path):
        os.makedirs(path)


def parse_args(argv):
    if len(argv) < 3:
        print("Usage: python download.py <url> <extension> [quality] [output_path]")
        return None

    url_arg = argv[1]
    extension_arg = argv[2]
    quality_arg = argv[3] if len(argv) > 3 else "1080"
    output_path_arg = argv[4] if len(argv) > 4 else None

    return url_arg, extension_arg, quality_arg, output_path_arg


if __name__ == "__main__":
    parsed_args = parse_args(sys.argv)
    if parsed_args is None:
        sys.exit(1)

    url_arg, extension_arg, quality_arg, output_path_arg = parsed_args
    ensure_output_dir(output_path_arg)

    ok = download_video(url_arg, extension_arg, quality_arg, output_path_arg)
    sys.exit(0 if ok else 1)