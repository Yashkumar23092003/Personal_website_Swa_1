# Website context

## Purpose

This is a private-feeling romantic photo scrapbook made as a thoughtful surprise for Swati. It should feel personal, warm, and sincere without explicitly labeling the relationship anywhere in the interface. The photos and small details carry the emotional weight.

The experience is designed to feel like opening a handmade memory book: calm at first, playful in the middle, and intimate at the end.

## Creative direction

- Mood: romantic, gentle, nostalgic, playful, and quietly celebratory.
- Visual metaphor: a tactile scrapbook made from cream paper, printed photographs, handwritten notes, stamps, tape, and soft ink.
- Emotional arc: welcome her into a small world, revisit shared memories, add a funny outtake, invite a little play, then finish with a personal letter.
- Tone of voice: simple, specific, affectionate, and conversational. Avoid grand declarations, clichés, or overly polished corporate language.
- Use small imperfections intentionally: slightly rotated photographs, handwritten captions, uneven tape, dashed borders, and gentle paper texture.

## Color system

The palette is deliberately soft and warm:

- `--paper: #f8f5ef` — warm ivory page background.
- `--ink: #3e3534` — dark brown charcoal for readable text.
- `--muted: #79706b` — quiet gray-brown for supporting copy.
- `--rose: #914b58` — dusty berry accent for links, emphasis, hearts, and buttons.
- `--pink: #eee0df` — pale blush for ribbons, the letter section, and soft contrast.
- `--line: #e3dcd2` — warm, low-contrast dividers.

Keep contrast gentle but readable. Accent colors should appear as details, not flood the whole page. The overall page should remain light so the photographs stay visually important.

## Typography

Three typefaces create the scrapbook hierarchy:

- `Playfair Display` (`--serif`) for headlines, chapter titles, and emotional phrases. It gives the page a literary, timeless feeling. Italic text uses the rose accent to create the “love note” emphasis.
- `DM Sans` (`--sans`) for navigation, labels, body copy, buttons, metadata, and accessible interface text. It keeps the practical parts clean and legible.
- `Caveat` (`--hand`) for handwritten captions, stamps, small notes, signatures, and playful annotations. It should feel like a real pen note without making core information hard to read.

Google Fonts are loaded when online. The CSS includes system fallbacks so the site remains usable offline.

## Layout and composition

The page is a single scrolling story:

1. **Hero** — large “Some things are better with you.” headline, a collage of two photographs, a handwritten annotation, and a clear invitation to begin.
2. **Ribbon** — a narrow scrapbook-style divider with short phrases and small stars.
3. **Our little collection** — three chapter cards for the first, third, and fourth meetings. Each card opens a photo album dialog.
4. **Bonus outtake** — a separate awkward-but-sweet photograph with playful copy: “posing skills: still loading…”
5. **And then, there’s you** — two solo photographs and a short appreciation section.
6. **A little game** — a photo matching game using shared memories. It is intentionally low-pressure: no timer, no score anxiety, just matching pairs.
7. **For you, always** — a clickable envelope that opens the letter dialog.
8. **Footer** — a quiet sign-off and a link back to the beginning.

The main content width is capped with generous whitespace. On smaller screens, columns collapse into a single story, photos remain large, and navigation becomes simpler.

## Photo treatment

Photographs use white or warm-ivory polaroid frames with subtle shadows. Different rotations make the collage feel assembled by hand rather than generated from a rigid grid. Captions sit below images in the handwritten font.

The album viewer keeps the original images and uses `object-fit: contain` so important details are not cropped. The sideways train selfie is rotated only inside the viewer with a `.sideways` class.

## Interaction design

- Navigation uses normal anchor links so the site is easy to understand and share.
- Memory cards are buttons, not plain divs, so albums are keyboard accessible.
- Albums open in native `<dialog>` elements with previous/next controls, Escape support, and live captions.
- The game shuffles eight cards into four pairs. Matched cards stay open, the progress hearts update, and a small heart confetti effect appears after completion.
- The game has a restart button and respects `prefers-reduced-motion`.
- The letter is hidden inside an envelope to create a small reveal moment. The completed game can also lead into the letter.
- Focus styles are visible and the page includes a skip link.

## Content notes

The first-meeting chapter includes the exact memory: “Hi, so atlast we met”. Preserve that wording unless the owner asks for a correction.

The fourth-meet album currently contains four photographs. The awkward-but-sweet image lives in its own bonus memory section so it feels like a charming blooper rather than another formal chapter.

The letter should remain personal and direct. It speaks about ordinary days, shared smiles, future photographs, and being loved. Keep it specific without exposing private details that were not supplied by the owner.

## Implementation notes

- `index.html` contains the page structure and copy.
- `style.css` contains the visual system, responsive rules, paper texture, polaroids, dialogs, game cards, and motion.
- `app.js` contains albums, dialog behavior, keyboard controls, game logic, progress updates, and confetti.
- `server.js` is a tiny dependency-free local server.
- `assets/Swati/` contains the original photographs organized by memory folder.
- `.gitignore` excludes dependencies, local environment files, logs, temporary files, browser artifacts, and OS/editor clutter.

## Guardrails for future edits

- Keep the page personal and understated; avoid adding generic “couple website” language.
- Do not replace the warm scrapbook palette with saturated red or bright pink.
- Keep the serif/handwritten/sans hierarchy consistent.
- Let photos remain the focus; decorative elements should support them.
- Preserve keyboard access, dialog Escape behavior, reduced-motion support, and mobile responsiveness.
- Test all photo paths after adding or renaming assets.
