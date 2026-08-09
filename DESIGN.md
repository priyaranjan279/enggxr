---
version: 2.0
name: EnggXR Decision Instrument
description: |
  A trustworthy engineering-admissions interface that combines the precision of
  an instrument panel with the calm clarity of a financial decision document.
  Dark technical navigation frames focused reading surfaces; cyan identifies
  action and verified intelligence; amber marks time-sensitive counselling risk.

colors:
  ink-deep: "#071116"
  ink: "#0D171C"
  surface-dark: "#122027"
  surface-dark-raised: "#182930"
  surface-dark-active: "#15383D"
  canvas: "#F5F8F7"
  surface-light: "#FFFFFF"
  surface-light-soft: "#EAF0EF"
  text-on-dark: "#EAF4F3"
  text-on-dark-muted: "#9EB2B1"
  text-on-light: "#142323"
  text-on-light-muted: "#5E7270"
  hairline-dark: "#294047"
  hairline-light: "#D5E0DE"
  primary: "#10D9D2"
  primary-hover: "#08C2BC"
  primary-pressed: "#079F9B"
  primary-soft-dark: "#123C3F"
  primary-soft-light: "#D7F6F3"
  warning: "#F3B43F"
  warning-soft: "#FFF2D7"
  success: "#42C98A"
  success-soft: "#DDF6E9"
  risk: "#F06464"
  risk-soft: "#FCE2E2"
  info: "#5AA8E8"

typography:
  display:
    fontFamily: Sora Variable
    fontSize: 48px
    fontWeight: 720
    lineHeight: 1.08
    letterSpacing: -0.04em
  page-title:
    fontFamily: Sora Variable
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.14
    letterSpacing: -0.035em
  section-title:
    fontFamily: Sora Variable
    fontSize: 22px
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: -0.02em
  card-title:
    fontFamily: Sora Variable
    fontSize: 17px
    fontWeight: 650
    lineHeight: 1.35
    letterSpacing: -0.01em
  body:
    fontFamily: Manrope Variable
    fontSize: 16px
    fontWeight: 430
    lineHeight: 1.6
    letterSpacing: 0
  body-small:
    fontFamily: Manrope Variable
    fontSize: 14px
    fontWeight: 430
    lineHeight: 1.55
    letterSpacing: 0
  label:
    fontFamily: Manrope Variable
    fontSize: 11px
    fontWeight: 760
    lineHeight: 1.2
    letterSpacing: 0.12em
    textTransform: uppercase
  data:
    fontFamily: Manrope Variable
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
    fontVariantNumeric: tabular-nums

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px
  chapter: 96px

rounded:
  none: 0px
  compact: 5px
  control: 7px
  panel: 12px
  feature: 18px
  full: 9999px
---

# EnggXR Design System

## Design Context

### Users

The primary users are EAPCET students aged roughly 16-20 and the parents helping
them make a high-stakes college decision. They use EnggXR during research,
shortlisting and time-sensitive counselling rounds, often on ordinary Android
phones and inconsistent networks. Secondary users are counsellors, colleges and
administrators maintaining admissions information.

### Jobs to Be Done

- Understand which branches fit the student's interests and academic profile.
- Find colleges that are eligible, affordable and realistically attainable.
- Compare admission probability, fees, placements, distance, safety and ROI.
- Build and validate a counselling preference order without false certainty.
- Explore campuses and future careers before committing.
- Give parents a clear explanation for every recommendation.

### Brand Personality

**Precise, reassuring, forward-looking.**

EnggXR should feel like a trusted decision instrument, not a game, coaching-centre
advertisement or science-fiction control panel. Technology is visible through
clarity, responsiveness and explainability-not decorative jargon.

### Emotional Goal

Move users from confusion to orientation, then from orientation to confidence.
Urgency may be shown when a deadline is real, but the interface must never create
anxiety simply to increase engagement.

## Core Aesthetic: The Decision Instrument

EnggXR combines two coordinated modes:

1. **Instrument mode:** dark shell for navigation, dashboards, live counselling,
   AI analysis and XR entry points. It feels focused and operational.
2. **Decision-document mode:** light surfaces for comparisons, detailed college
   information, financial analysis, forms and parent review. It feels credible,
   printable and easy to read for extended periods.

The contrast between modes carries the hierarchy. Do not add ornamental effects
when a surface change, whitespace or hairline rule can do the job.

## Signature Motif

Use a restrained **registration mark**: two short 1px corner lines or a small
cyan square that visually "registers" a verified or actively computed panel.
It may appear once on a major module-not on every card.

Do not reproduce another company's trademark geometry, logo treatment or exact
component styling. The reference systems inform discipline, not imitation.

## Color System

### Primary Signal

`{colors.primary}` is the sole interactive brand signal. Use it for:

- Primary actions
- Active navigation
- Selected options
- Focus rings
- Verified AI/recommendation state
- Progress that represents completion

Do not use cyan as a general decoration. If more than roughly 10% of a screen is
cyan, the hierarchy has probably collapsed.

### Semantic Signals

- `{colors.success}`: verified, complete, eligible, safely saved.
- `{colors.warning}`: approaching deadline, incomplete input, moderate risk.
- `{colors.risk}`: validation failure, low probability, destructive action.
- `{colors.info}`: neutral contextual information that is not an AI result.

Never communicate Dream/Target/Safe or probability using color alone. Always pair
color with a word, icon or numeric value.

### Surfaces

- Use `{colors.ink-deep}` for the application shell and primary navigation.
- Use `{colors.surface-dark}` for dark-mode modules.
- Use `{colors.canvas}` as the light reading canvas.
- Use `{colors.surface-light}` for decision tables and editable forms.
- Use one-level lightness changes and hairlines for elevation; avoid stacked
  translucent panes.

## Typography

### Roles

- **Sora Variable**: display, page titles, section titles and decisive card titles.
- **Manrope Variable**: body copy, navigation, controls, metadata and numbers.
- Do not set paragraphs in monospace. Monospace may appear only for actual IDs,
  branch codes, hall-ticket numbers or developer diagnostics.

### Hierarchy Rules

- Use a small number of clearly separated sizes.
- Keep body copy at 16px minimum and within 65-72 characters per line.
- Use tabular numerals for ranks, fees, probabilities, packages and countdowns.
- Use uppercase labels only for short metadata; never for instructions or body copy.
- On dark surfaces, allow slightly more line-height than on light surfaces.

## Layout

### Grid

- Desktop: 12 columns, maximum content width 1440px, 24px gutters.
- Tablet: 8 columns, 20px gutters.
- Mobile: 4 columns, 16px margins and 12-16px gutters.
- Use a 4px base spacing system and semantic spacing tokens.

### Rhythm

- Page opening: generous space and one dominant decision or message.
- Working sections: tighter rhythm with aligned labels and tabular data.
- Important transitions: 48-64px, or a full surface-mode change.
- Avoid giving every section identical padding; hierarchy should be visible when
  the page is viewed blurred or from a distance.

### Composition

- Prefer aligned rows, comparison tables and open groups over repeated card grids.
- Cards are for distinct selectable or actionable entities-not every text block.
- Never nest a card inside another card. Use dividers and spacing inside a panel.
- Keep the primary action in a predictable location: top-right on desktop,
  full-width or sticky-bottom on mobile where appropriate.

## Elevation and Depth

Four levels are available:

1. **Canvas:** no border, no shadow.
2. **Grouped surface:** 1px hairline border or subtle surface change.
3. **Sticky navigation/action:** opaque or lightly blurred surface with a hairline.
4. **XR/media layer:** imagery or 3D content provides depth; UI remains flat above it.

Shadows are reserved for floating overlays and media, not routine cards. Decorative
glassmorphism and persistent glow are prohibited. A soft cyan glow may indicate a
brief active computation, then must resolve to a stable state.

## Shape Language

- 5-7px radii for buttons, inputs, tabs and compact controls.
- 12px radius for panels and comparison modules.
- 18px only for feature media or immersive XR canvases.
- Full pills only for short status chips or a single compact action.
- Do not mix several radius styles within one component.

## Components

### Application Navigation

Desktop uses a dark persistent sidebar with restrained icons and visible labels.
The active route has a primary-soft surface plus cyan icon/text; inactive routes
remain quiet. Mobile uses a five-item bottom bar and a compact top bar. Critical
features must remain available on mobile.

### Buttons

**Primary:** solid `{colors.primary}` with dark text, 44px minimum height, compact
radius. Use once per decision region.

**Secondary:** transparent or surface fill with a hairline border. It must not
compete with the primary action.

**Text action:** no container; cyan label and directional icon. Use for low-risk
navigation such as "See all colleges."

**Destructive:** risk-colored text and border; use a filled risk button only for
the final irreversible action.

All buttons require default, hover, focus-visible, active, disabled and loading
states. Active state may scale to 0.98; never bounce.

### Inputs

- Visible labels always remain above fields.
- 44px minimum height; 16px minimum input text on mobile.
- Validate on blur and on submit, not on every keystroke.
- Place specific error text directly below the field and connect it with ARIA.
- Show units and examples outside placeholders when the meaning may be ambiguous.
- Category, gender, eligibility and financial fields require explanatory help text.

### College Match Row

The default college result is a horizontal decision row, not a promotional card.
It includes:

1. Rank/order
2. College identity and recommended branch
3. Dream/Target/Safe classification
4. Admission probability with confidence context
5. Fee and placement outcome
6. One concise "Why it fits" explanation
7. Shortlist, compare and detail actions

On mobile it becomes a vertical decision sheet while preserving every metric.
Never hide uncertainty, source dates or eligibility caveats.

### Probability

Display probability as a number plus label. Gauges are allowed only for a single
headline score; lists and tables use bars or plain tabular values. Add confidence
language such as "based on 3 years of cutoffs." Never imply guaranteed admission.

### Dream / Target / Safe

- Dream: low probability but meaningful upside.
- Target: plausible and aligned.
- Safe: comparatively high probability, never a guarantee.

Use distinct labels and icons. Avoid red for Dream; ambition is not an error.

### Comparison

Comparison is a light decision-document surface, even when launched from the dark
shell. Rows are grouped under Admission, Cost, Career, Campus and Personal Fit.
Highlight the strongest value in each row, not one universal winner. Explain
trade-offs in plain language.

### Counselling War Room

This is the most operational screen. Use dark instrument mode with:

- Current round and verified deadline
- Ordered preferences
- Probability and cutoff movement
- Risk warnings
- Change history and final checklist

It must feel calm, auditable and reversible. Do not use gaming language, sirens,
flicker, fake live indicators or countdowns without authoritative data.

### AI Counsellor

Separate three types of message:

- **Verified fact**: sourced and dated.
- **Model estimate**: includes confidence and key assumptions.
- **General guidance**: clearly advisory.

AI explanations should lead with the recommendation, followed by two or three
reasons and a "How this was calculated" disclosure. Never present invented college
facts or admission guarantees.

### XR Explorer

XR is a media experience, not the default UI style. Use a dark, distraction-free
canvas with minimal controls, a visible exit, captions, device fallbacks and a
standard gallery alternative. Users must be able to reach the same factual content
without XR hardware.

## Data Visualization

- Every chart must answer a decision question.
- Prefer cutoff bands, ranked bars and direct labels over decorative donuts.
- Start bar axes at zero unless the chart explicitly explains otherwise.
- Label source, period and last-updated date near the visualization.
- Provide a table or textual summary for accessibility.
- Use no more than one accent plus semantic exception colors in a chart.

## Content and Voice

### Voice

Direct, calm and specific. Use familiar Indian admissions terminology, but explain
specialized terms the first time they appear.

### Preferred Copy

- "You have a strong chance based on the last three counselling rounds."
- "Complete your budget to improve financial-fit accuracy."
- "This estimate is not an admission guarantee."
- "Why this college matches you"

### Avoid

- "Neural sync complete"
- "Protocol 0X992"
- "AI has selected your perfect college"
- "Guaranteed admission"
- Empty urgency such as "Act now!" without a real deadline

## Motion

- Use motion to explain state change, ordering and progress.
- Standard duration: 160-220ms; large view transitions: up to 320ms.
- Use ease-out-quart or ease-out-quint; no bounce or elastic easing.
- Animate transform and opacity only where possible.
- Honour `prefers-reduced-motion` and keep all workflows usable without animation.
- Computation indicators may pulse briefly; stable results must stop moving.

## Responsive Behaviour

### Breakpoints

- 480px: small-phone content adjustments.
- 640px: single-column decision layouts.
- 820px: sidebar changes to mobile navigation.
- 1100px: dense comparison and result rows simplify.
- 1440px: content width locks; margins absorb extra space.

### Adaptation Rules

- Do not merely shrink desktop tables. Transform each row into a labelled decision
  sheet on mobile.
- Keep touch targets at least 44x44px.
- Place the primary action within thumb reach for long mobile flows.
- Account for safe-area insets and the virtual keyboard.
- Preserve filters, explanations and uncertainty on mobile.
- Support 200% browser zoom without horizontal page scrolling.

## Accessibility

- Meet WCAG 2.2 AA contrast and interaction requirements.
- Provide visible 2px focus rings using `{colors.primary}` or an appropriate
  high-contrast semantic color.
- Never disable zoom.
- Use semantic headings, landmarks, labels, tables and button elements.
- Do not depend on color, hover, animation or drag-and-drop as the only interaction.
- Preference ordering requires keyboard-accessible move-up and move-down controls.
- Announce saves, errors and reordered items through appropriate live regions.

## Do

- Lead each screen with the decision the user needs to make.
- Show sources, dates, assumptions and confidence alongside recommendations.
- Use cyan sparingly and consistently as the action/verified-intelligence signal.
- Alternate dark operational views with light reading-heavy decision surfaces.
- Use realistic Indian fees, ranks, branches and counselling terminology.
- Design explicit loading, partial-data, no-result, error and stale-data states.
- Let parents switch to a simplified explanation without losing underlying data.

## Do Not

- Do not make the entire product look like a HUD or terminal.
- Do not use decorative gradients, gradient text or permanent neon glows.
- Do not use monospace for normal body text.
- Do not wrap every section in a card or nest cards.
- Do not use side-stripe callouts as a generic emphasis pattern.
- Do not use stock graduation-cap imagery as the primary brand language.
- Do not show decorative charts or fake live data.
- Do not copy the distinctive trade dress of reference brands.
- Do not declare a college universally "best"; explain fit and trade-offs.

## Agent Implementation Guide

When generating an EnggXR screen:

1. Identify the user's immediate decision and make it the strongest visual element.
2. Choose instrument mode or decision-document mode based on reading density.
3. Use tokens from this file; do not introduce arbitrary hex colors or radii.
4. Use one primary action per decision region.
5. Include uncertainty, sources and stale/missing-data behaviour.
6. Build the semantic structure before decorative details.
7. Verify desktop, 390px mobile, keyboard navigation and reduced motion.
8. Run the AI-slop test: remove unnecessary glow, pills, cards and generic metrics.

## Reference Influence

The system was strengthened through comparative study of:

- NVIDIA: engineering confidence, single-accent discipline and hairline structure.
- Together AI: blueprint-like technical organization.
- Linear: restrained hierarchy and operational density.
- Coinbase and Mastercard: trust, financial clarity and human reassurance.
- Apple: whitespace, purposeful depth and reduction of decorative chrome.

These are principles only. EnggXR remains an original admissions and XR product.
