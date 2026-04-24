import VideoPreview from "./VideoPreview";
import { open } from "@tauri-apps/plugin-dialog";
import { getYoutubeEmbedUrl } from "../helpers/ParseYoutubeUrl";

export default function PreviewModal({ isOpen, youtubeUrl, downloadFormat, downloadQuality, onClose, onConfirm}) {

    if (!isOpen) {
        return null;
    }
    const isValidPreview = Boolean(getYoutubeEmbedUrl(youtubeUrl));

    const handleConfirm = async () => {
        const selectedFolder = await open({
            directory: true,
            multiple: false,
            title: "Selecciona la carpeta de destino"
        });

        if (!selectedFolder) {
            return;
        }

        onConfirm(selectedFolder);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Confirm video</h2>
                <p>Check if the video is correct before starting the download.</p>

                <p className="selected-format">
                Format selected: {downloadFormat.toUpperCase()}
                </p>

                {downloadFormat === "mp4" && (
                    <p className="selected-format">Quality selected: {downloadQuality.toUpperCase()}</p>
                )}

                <VideoPreview youtubeUrl={youtubeUrl} />

                {isValidPreview ? (
                <div className="modal-actions">
                    <button type="button" className="secondary-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="confirm-button" onClick={handleConfirm}>
                        Confirm
                    </button>
                </div>
                ) : (
                <div className="modal-actions">
                    <button type="button" className="secondary-button" onClick={onClose}>
                        Back
                    </button>
                </div>
                )}
            </div>
        </div>
    );
}
