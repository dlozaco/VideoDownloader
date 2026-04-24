const qualityOptions = [
  { value: "720", label: "720p" },
  { value: "1080", label: "1080p" },
  { value: "best", label: "Best" },
];

export default function FormatSelector({
  downloadFormat,
  quality,
  onChange,
  onQualityChange,
  disabled,
}) {
  const qualityDisabled = disabled || downloadFormat === "mp3";

  return (
    <>
      <div className="format-selector" role="radiogroup" aria-label="Formato de descarga">
        <span className="format-label">Formato:</span>

        <label className={`format-option ${downloadFormat === "mp3" ? "active" : ""}`}>
          <input
            type="radio"
            name="download-format"
            value="mp3"
            checked={downloadFormat === "mp3"}
            onChange={onChange}
            disabled={disabled}
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
            disabled={disabled}
          />
          MP4
        </label>
      </div>

      <div className="format-selector" role="radiogroup" aria-label="Calidad de descarga">
        <span className="format-label">Calidad:</span>

        {qualityOptions.map((option) => (
          <label
            key={option.value}
            className={`format-option ${quality === option.value ? "active" : ""} ${
              qualityDisabled ? "is-disabled" : ""
            }`}
          >
            <input
              type="radio"
              name="download-quality"
              value={option.value}
              checked={quality === option.value}
              onChange={onQualityChange}
              disabled={qualityDisabled}
            />
            {option.label}
          </label>
        ))}
      </div>
    </>
  );
}
