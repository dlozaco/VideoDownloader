
import { useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/core";
import PreviewModal from "./components/PreviewModal";
import FormatSelector from "./components/FormatSelector";

export default function MainScreen() {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [downloadFormat, setDownloadFormat] = useState("mp4");
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
        setStatusMessage("Starting the download");
        try {
            await invoke("descargar_video_cmd", { 
                url: previewUrl,
                format: downloadFormat,
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

    return (
        <main className="split-layout">
        <section className="main-screen">
            <h1>Video downloader by dlozaco</h1>

            <form className="row" onSubmit={handleSubmit}>
                <input
                    id="youtube-url-input"
                    type="url"
                    name="youtubeUrl"
                    placeholder="Pega aqui la URL de YouTube"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    required
                    disabled={isDownloading}
                />
                <button type="submit" className="start-button" disabled={isDownloading}>
                    {isDownloading ? "Cargando..." : "Start"}
                </button>
            </form>

            <FormatSelector
                downloadFormat={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                disabled={isDownloading}
            />

            {statusMessage && (
                <div className="status-message" style={{ marginTop: '20px', fontWeight: 'bold' }}>
                    {statusMessage}
                </div>
            )}
        </section>

        <aside className="split-accent" aria-hidden="true" />

        <PreviewModal
            isOpen={isPreviewOpen}
            youtubeUrl={previewUrl}
            downloadFormat={downloadFormat}
            onClose={closePreview}
            onConfirm={confirmVideo}
        />
        </main>
    );
}