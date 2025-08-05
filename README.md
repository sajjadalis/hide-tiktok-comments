# Hide TikTok Comments

A lightweight Chrome extension that automatically hides the comments section on TikTok video and photo pages, providing a cleaner, distraction-free viewing experience.

## Features

### 🎯 Automatic Comment Hiding
- Automatically hides comments on TikTok video and photo pages
- Works seamlessly with TikTok's lightbox modal interface
- Instant application with no visible flash or delay

### 🔄 Easy Toggle Control
- One-click toggle via extension icon in toolbar
- In-page floating button for quick access
- Clear visual feedback showing current state

### 📱 Smart Navigation Support
- Works with TikTok's single-page application (SPA) navigation
- Automatically applies settings when switching between videos
- Maintains state across page refreshes and browser sessions

### 🎨 Native TikTok Design
- Floating comment toggle button matches TikTok's UI style
- Positioned above the volume controls for easy access
- Proper hover effects and smooth interactions

## Installation

### From GitHub Releases
1. Download the latest release from the [Releases page](../../releases)
2. Unzip the downloaded file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the unzipped folder

### Manual Installation
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project folder

## Usage

1. **Install the extension** following the steps above
2. **Visit TikTok** and open any video or photo post
3. **Toggle comments** using either:
   - The extension icon in your Chrome toolbar
   - The floating comment button above the volume control

## Supported Content Types

This extension works on all TikTok content types:
- **Video posts**: `@username/video/1234567890`
- **Photo slideshows**: `@username/photo/1234567890`
- **All TikTok subdomains**: Works across different TikTok regional domains

## Privacy

This extension:
- ✅ Only works on TikTok.com domains
- ✅ Stores settings locally in your browser
- ✅ Does not collect or transmit any personal data
- ✅ Does not require any network permissions
- ✅ Open source - inspect the code yourself

## Technical Details

### Architecture
- **Manifest V3** Chrome extension
- **Content Script**: Handles DOM manipulation and comment hiding
- **Background Script**: Manages extension state and icon updates
- **Local Storage**: Persists user preferences across sessions

### Performance
- Minimal impact on page load times
- Efficient CSS injection for instant comment hiding
- Smart URL detection to avoid unnecessary processing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0
- Initial release
- Basic comment hiding functionality
- Extension icon toggle
- Support for both video and photo posts

## Disclaimer

This extension is not affiliated with, endorsed by, or connected to TikTok, ByteDance, or any related companies. Use at your own discretion.