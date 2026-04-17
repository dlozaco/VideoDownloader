export default function FormatSelector({ downloadFormat, onChange }) {
  return (
    <div className="format-selector" role="radiogroup" aria-label="Formato de descarga">
      <span className="format-label">Formato:</span>

      <label className={`format-option ${downloadFormat === "mp3" ? "active" : ""}`}>
        <input
          type="radio"
          name="download-format"
          value="mp3"
          checked={downloadFormat === "mp3"}
          onChange={onChange}
        />
        MP3
      </label>

      <label className={`format-option ${downloadFormat === "mp4" ? "active" : ""}`}>
        <input
          type="radio"
          name="download-format"
          value="mp4"
          checked={downloadFormat === "mp4"}
          onChange={onChange}
        />
        MP4
      </label>
    </div>
  );
}
