
import { useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import PreviewModal from "./components/PreviewModal";
import FormatSelector from "./components/FormatSelector";

export default function MainScreen() {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [downloadFormat, setDownloadFormat] = useState("mp4");
    const [downloadQuality, setDownloadQuality] = useState("1080");
    const [previewUrl, setPreviewUrl] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const [isDownloading, setIsDownloading] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const openPreview = (youtubeLink) => {
        setPreviewUrl(youtubeLink);
        setIsPreviewOpen(true);
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    const confirmVideo = async (selectedFolder) => {
        setIsPreviewOpen(false);

        setIsDownloading(true);
        setStatusMessage("Downloading");
        try {
            await invoke("descargar_video_cmd", { 
                url: previewUrl,
                format: downloadFormat,
                quality: downloadQuality,
                videoPath: selectedFolder
            });
            setStatusMessage("Download complete! 🎉");
            setYoutubeUrl("");
        } catch (error) {
            console.error("Error in the download:", error);
            setStatusMessage(`Error: ${error}`);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        openPreview(youtubeUrl);
    };

    const hasStatus = isDownloading || Boolean(statusMessage);

    return (
        <main className="split-layout">
        <section className="main-screen">
            <h1>Video downloader by dlozaco</h1>
            <br></br>
            <form className="row" onSubmit={handleSubmit}>
                <input
                    id="youtube-url-input"
                    type="url"
                    name="youtubeUrl"
                    placeholder="Paste the YouTube URL"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    required
                    disabled={isDownloading}
                />
                <button type="submit" className="start-button" disabled={isDownloading}>
                    {isDownloading ? "Loading..." : "Start"}
                </button>
            </form>

            <FormatSelector
                downloadFormat={downloadFormat}
                quality={downloadQuality}
                onChange={(e) => setDownloadFormat(e.target.value)}
                onQualityChange={(e) => setDownloadQuality(e.target.value)}
                disabled={isDownloading}
            />

            {hasStatus && (
                <div className="status-message" role="status" aria-live="polite">
                    {isDownloading && <span className="loading-spinner" aria-hidden="true" />}
                    <span>{isDownloading ? "Downloading..." : statusMessage}</span>
                </div>
            )}
        </section>

        <aside className="split-accent" aria-hidden="true" />

        <PreviewModal
            isOpen={isPreviewOpen}
            youtubeUrl={previewUrl}
            downloadFormat={downloadFormat}
            downloadQuality={downloadQuality}
            onClose={closePreview}
            onConfirm={confirmVideo}
        />
        </main>
    );
}