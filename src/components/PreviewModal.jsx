import VideoPreview from "./VideoPreview";
import { getYoutubeEmbedUrl } from "../helpers/ParseYoutubeUrl";

export default function PreviewModal({ isOpen, youtubeUrl, downloadFormat, onClose, onConfirm}) {

    if (!isOpen) {
        return null;
    }
    const isValidPreview = Boolean(getYoutubeEmbedUrl(youtubeUrl));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Confirmar video</h2>
                <p>Revisa que este sea el video correcto antes de continuar.</p>

                <p className="selected-format">
                Formato seleccionado: {downloadFormat.toUpperCase()}
                </p>

                <VideoPreview youtubeUrl={youtubeUrl} />

                {isValidPreview ? (
                <div className="modal-actions">
                    <button type="button" className="secondary-button" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="button" className="confirm-button" onClick={onConfirm}>
                        Confirmar
                    </button>
                </div>
                ) : (
                <div className="modal-actions">
                    <button type="button" className="secondary-button" onClick={onClose}>
                        Atras
                    </button>
                </div>
                )}
            </div>
        </div>
    );
}
