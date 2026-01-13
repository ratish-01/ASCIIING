# ASCIIING - Advanced ASCII Art Studio

ASCIIING is a modern, high-performance web application that transforms live camera streams and static images into stunning ASCII art. Built with React and Vite, it features a real-time extraction engine with granular controls for resolution, contrast, and brightness.

## Features

- **Live Camera Extraction**: Real-time ASCII conversion from your webcam.
- **Image Upload**: Process any image into ASCII text.
- **Multiple Character Sets**: Choose from Standard, Simple, Matrix, Blocks, or Dots mappings.
- **Structure-Preserved Copy**: Special logic ensures ASCII art maintains its structure when pasted into Notepad (Light BG) or Social Media (Dark BG/Discord/YouTube).
- **Pro Controls**:
  - **Extraction Detail**: Adjust the ASCII resolution.
  - **Sensor Zoom**: Digital crop for focusing on details.
  - **Contrast & Luminance**: Fine-tune the image pre-extraction.
  - **Inverse Polarity**: Toggle between dark and light themes.

## Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ratish-01/ASCIIING.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ASCIIING
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm run dev
```

## Built With
- **React** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **HTML5 Canvas** - Image processing core

