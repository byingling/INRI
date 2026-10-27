# INRI — Daily Faith

A Progressive Web App for daily devotion, inspiration, morning & night prayers, Bible reading (KJV), and personal journaling.

**INRI** = *Iesus Nazarenus, Rex Iudaeorum*  
(“Jesus of Nazareth, King of the Jews”)

## Features

- 7-second splash screen with the INRI artwork
- Daily Verse, Inspiration, and Devotion (53 rotating days)
- Verse study for every day: background, Hebrew/Greek key words, and tappable cross-references
- Long-form daily inspiration with a practical step and a reflection question
- **Daily Walk**: a full-screen guided time — stillness & breathing, the verse, study, map, inspiration, prayer, journal, and a closing blessing (with optional guided audio)
- **Church year**: Advent, Christmas, Lent, Holy Week, Easter, Pentecost and Thanksgiving get fitting readings, with a season banner
- **On location**: a map of where each day's passage happened, plus a timeline of biblical history
- **Listen to today**: the verse, inspiration and prayer read aloud with the best voice on your device
- **Ambient sound**: rain, fireside, Galilee shore, or a still pad (generated in the browser, nothing to download)
- **Memorize**: hide the verse step by step, then check yourself from memory
- Light that follows the time of day (dawn, day, evening, night)
- Morning & Night prayers
- Full King James Version Bible reader
- Private journal (stored only on your device)
- Works offline as a Progressive Web App
- Themes include spiritual warfare, marriage & relationships, gratitude, peace, hope, and more

## Live Demo

https://byingling.github.io/INRI/

## How to Deploy on GitHub Pages

1. Create a new repository on GitHub (public is easiest for free Pages).
2. Upload all the files from this folder to the repository.
3. Go to **Settings → Pages**.
4. Under **Source**, select **Deploy from a branch**.
5. Choose the `main` (or `master`) branch and `/ (root)` folder.
6. Click **Save**.
7. Wait 1–2 minutes, then open the URL GitHub shows you.

## Local Development

```bash
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:3000` or `http://localhost:8080`.

## Bible Text

King James Version (public domain) via the free [Midvash Bible API](https://api.midvash.com).

## Privacy

Your journal entries never leave your device (localStorage only).
