
function getYoutubeEmbedUrl(url) {
    if (!url) return "";

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match?.[1]) {
            return `https://www.youtube.com/embed/${match[1]}?vq=hd1080`;
        }
    }

    return "";
}

export { getYoutubeEmbedUrl };