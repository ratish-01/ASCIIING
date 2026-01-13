import { CHARACTER_SETS } from "../constants/charSets";

/**
 * Processes image data into ASCII characters and draws them to a destination canvas.
 */
export const processImageToAscii = ({
    imgSource,
    width,
    height,
    processingCanvas,
    displayCanvas,
    resolution,
    charSet,
    brightness,
    contrast,
    invert,
    zoom,
    pastingTarget
}) => {
    const pCtx = processingCanvas.getContext("2d", { willReadFrequently: true });
    const dCtx = displayCanvas.getContext("2d");

    const fontAspectRatio = 0.55;
    const scaledWidth = Math.floor(width / resolution);
    const scaledHeight = Math.floor((height / resolution) * fontAspectRatio);

    processingCanvas.width = scaledWidth;
    processingCanvas.height = scaledHeight;

    const sw = width / zoom;
    const sh = height / zoom;
    const sx = (width - sw) / 2;
    const sy = (height - sh) / 2;

    pCtx.drawImage(imgSource, sx, sy, sw, sh, 0, 0, scaledWidth, scaledHeight);

    const imageData = pCtx.getImageData(0, 0, scaledWidth, scaledHeight).data;

    displayCanvas.width = width;
    displayCanvas.height = height;
    dCtx.fillStyle = "#000";
    dCtx.fillRect(0, 0, width, height);

    const fontSize = resolution;
    dCtx.font = `${fontSize}px monospace`;
    dCtx.fillStyle = "#3b82f6";
    dCtx.textAlign = "center";

    let chars = CHARACTER_SETS[charSet];
    if (pastingTarget === "LIGHT") {
        chars = chars.split("").reverse().join("");
    }

    let asciiOutput = "";
    const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let y = 0; y < scaledHeight; y++) {
        let row = "";
        for (let x = 0; x < scaledWidth; x++) {
            const offset = (y * scaledWidth + x) * 4;

            let r = imageData[offset];
            let g = imageData[offset + 1];
            let b = imageData[offset + 2];

            if (contrast !== 1) {
                r = factor * (r - 128) + 128;
                g = factor * (g - 128) + 128;
                b = factor * (b - 128) + 128;
            }

            let bVal = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            bVal += brightness;
            if (invert) bVal = 255 - bVal;
            bVal = Math.max(0, Math.min(255, bVal));

            const charIndex = Math.floor((bVal / 255) * (chars.length - 1));
            let char = chars[charIndex];

            let displayChar = char;
            if (char === " ") {
                displayChar = pastingTarget === "DARK" ? "\u00A0" : " ";
            }

            dCtx.fillText(char, x * resolution, y * (resolution / fontAspectRatio));
            row += displayChar;
        }
        asciiOutput += row + "\n";
    }

    if (pastingTarget === "DARK") {
        return "```\n" + asciiOutput + "```";
    }
    return asciiOutput;
};
