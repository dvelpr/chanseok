# Chanseok Archive — Edition 02

Unzip the folder and open index.html in a modern browser. The website works offline; no installation or server is needed.

## What's new
- A custom generated 3D-style portrait based on the supplied photos.
- A real WebGL tessellated depth surface rotates from -28 to +28 degrees while scrolling through the sticky opening section. This is an artistic 2.5D relief, not a full 360-degree head scan. The unseen sides are not reconstructed.
- A manual rotation slider, motion pause button, reduced-motion support, and a static-image fallback if WebGL is unavailable.
- Purple and lime art direction, clearer typography, consistent archive frames, responsive layouts, scroll progress, and visible gallery controls.
- Original archive, coffee gauge, interview game, phrase generator, bingo, notes, and FAQs retained.

The portrait texture is also embedded in portrait-texture.js so WebGL works when index.html is opened directly from disk. Keep all files together.

## Files
- index.html: page content
- style.css: original styles plus Edition 02 overrides
- script.js: archive and games
- portrait.js: depth mesh, scroll rotation, accessibility and fallback
- portrait-texture.js: embedded portrait texture for offline use
- assets/: supplied images and generated portrait

## Portrait asset
Created using the built-in image-generation tool. Prompt: Create an isolated transparent, front-facing stylized 3D head of Chanseok using the supplied interview and profile photos; preserve facial likeness, swept black hair and gentle smile; warm natural skin, soft studio lighting with purple rim light; head and short neck only, no text or additional objects.

This is an unofficial fan-made humor page. Added captions, answers, phrases, and metrics are fictional, not factual statements or real quotes. No analytics or data collection.
