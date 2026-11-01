# Cliff texture generation

Tool: built-in ImageGen.

Reference and replacement: `public/img/mg_cliff.png`.

Original generation prompt:

> Use case: stylized-concept. Asset type: production game cliff texture atlas, replacing mg_cliff.png. Input image: the viewed original 256x256 image is a reference for the precise layout and palette. Create a new high-quality 2048x2048 square texture atlas retaining THREE equal-width vertical cliff strips side by side, all spanning the full height. Each strip should have an irregular rock edge on its LEFT with a flat olive-brown background on the left, and its rocky mass continuing to the RIGHT edge of its own third. Preserve the original earthy olive, ochre, muted brown palette, layered underwater cliff rock formations and small scattered orange-red coral clusters. Middle strip mostly rocks, right strip more coral near upper half, left strip scattered coral. Hand-painted stylized Toontown game art, smooth detailed stone planes, crisp clean contours, subtle ambient crevices, no pixelation or blur. Flat neutral diffuse lighting suitable for a color texture, no scene perspective. Fill all three strips completely from top to bottom. No text, no borders, no logos, no objects outside the cliff material. Match the original atlas arrangement so code can sample its horizontal thirds independently.

Final transparency edit prompt (built-in ImageGen, transparent background enabled):

> Use case: background-extraction. Edit target: the supplied current mg_cliff.png game texture atlas. Remove ONLY the flat olive-brown empty background around the rock edges in EACH of the three equal-width vertical atlas strips. Replace those empty regions with TRUE alpha transparency, not a solid color or painted checkerboard. Keep all three cliff strips in their EXACT current positions, at exactly one-third widths, keeping every rock contour, orange coral cluster, rock surface color, shading, sharp detail, and full-height crop unchanged. Rocks and coral remain fully opaque. The left-hand empty area of each individual third must be fully transparent all the way to that third's left edge; the rock mass continues to the right edge of each third. Preserve three separate vertical strips and the square atlas layout; do not merge strips, shift objects, add shadows, add borders, or add new objects. High quality game PNG with clean anti-aliased cutout edges and genuine transparent background.
