# Immersive Motion Upgrade — Design Specification

## Direction

Turn the storybook into a premium interactive digital love letter. Retain the
approved emotional flow and blush/cherry/burgundy palette, but replace the flat
chapter presentation with cinematic depth, editorial scale, and tactile motion.
The supplied Instagram references inform the ceremony—heart keypad, playful
reveals, balloons, surprise choices—not the final visual execution.

## Signature experience

- A living backdrop of slow blurred color fields, grain, and fine orbit lines.
- A sealed glass-and-paper letter that opens into the story.
- Full-viewport chapter transitions with directional depth rather than repeated
  fades.
- Oversized editorial typography that becomes part of the composition.
- Photographs presented as floating film frames, a dimensional mosaic, and a
  draggable-feeling stack rather than uniform cards.
- An animated dock that communicates progress and houses audio/navigation.
- Interaction-specific feedback: balloon strings recoil and release particles;
  the candle glow illuminates the scene before fading; the future note unfolds;
  the final message arrives in a quiet spotlight.

## Motion language

Use three motion layers:

1. Ambient: very slow background drift with no effect on reading.
2. Narrative: one coordinated transition when a chapter changes.
3. Responsive: spring feedback for buttons, photographs, balloons, candle, and
   letter actions.

Do not animate every text block independently. Honor reduced motion by removing
parallax, transforms, particles, and ambient drift while preserving immediate
state changes.

## Modern interaction details

- Pointer-capable devices receive subtle perspective tilt and magnetic button
  movement; touch devices receive spring scale feedback.
- Chapter changes preserve semantic headings and announce the new title.
- Photos keep explicit focal points and optimized responsive loading.
- The final Friends line remains the only Friends reference.
- Missing photographs remain attractive abstract art panels until real images
  arrive.

## Quality bar

The result must feel intentionally art-directed at 375px and 1440px, remain
usable at 320px, pass automated tests/lint/build, keep keyboard focus visible,
and expose the complete story when motion is disabled.
