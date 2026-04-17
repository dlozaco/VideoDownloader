
import { useState } from "react";
import "./App.css";
import PreviewModal from "./components/PreviewModal";
import FormatSelector from "./components/FormatSelector";

export default function MainScreen() {
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [downloadFormat, setDownloadFormat] = useState("mp4");
    const [previewUrl, setPreviewUrl] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const openPreview = (youtubeLink) => {
        setPreviewUrl(youtubeLink);
        setIsPreviewOpen(true);
    };

    const closePreview = () => {
        setIsPreviewOpen(false);
    };

    const confirmVideo = () => {
        alert(`Video confirmado para descargar en ${downloadFormat.toUpperCase()}`);
        setIsPreviewOpen(false);
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
            />
            <button type="submit" className="start-button">Start</button>
            </form>

            <FormatSelector
                downloadFormat={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
            />
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