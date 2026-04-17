
import { getYoutubeEmbedUrl } from "../helpers/ParseYoutubeUrl";

export default function VideoPreview({ youtubeUrl }) {
    const embedUrl = getYoutubeEmbedUrl(youtubeUrl);

    if (!embedUrl) {
        return <p className="preview-error">No existe video con esta URL.</p>;
    }

    return (
        <div className="video-frame-wrapper">
            <iframe
                src={embedUrl}
                title="Previsualizacion de video de YouTube"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />
        </div>
    );
}