<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { slides, currentPage, currentFrontmatter, go } = useNav()

// Only real slide routes, excluding Slidev's generated end page.
const deckSlides = computed(() =>
  slides.value
    .filter(slide => slide.meta?.slide)
    .slice()
    .sort((a, b) => a.no - b.no),
)

// A custom `section` field marks the beginning of each section.
const sections = computed(() => {
  const boundaries = deckSlides.value.flatMap((slide) => {
    const label = slide.meta.slide?.frontmatter?.section

    if (typeof label !== 'string' || !label.trim())
      return []

    return [{
      label: label.trim(),
      start: slide.no,
    }]
  })

  const lastSlide = deckSlides.value.at(-1)?.no ?? 0

  return boundaries.map((section, index) => ({
    ...section,
    end: boundaries[index + 1]
      ? boundaries[index + 1].start - 1
      : lastSlide,
  }))
})

const visible = computed(() =>
  sections.value.length > 0
  && currentFrontmatter.value.hideSectionProgress !== true,
)

function status(section: { start: number; end: number }) {
  if (currentPage.value > section.end)
    return 'complete'

  if (currentPage.value >= section.start)
    return 'active'

  return 'upcoming'
}

function progress(section: { start: number; end: number }) {
  const page = currentPage.value

  if (page < section.start)
    return 0

  if (page > section.end)
    return 100

  const totalSlides = section.end - section.start + 1
  const currentSlide = page - section.start + 1

  return 100 * currentSlide / totalSlides
}

function description(section: {
  label: string
  start: number
  end: number
}) {
  const count = section.end - section.start + 1

  if (status(section) === 'active') {
    const position = currentPage.value - section.start + 1
    return `${section.label}: slide ${position} of ${count}`
  }

  return `${section.label}: ${status(section)}`
}
</script>

<template>
  <nav
    v-if="visible"
    class="section-progress"
    aria-label="Presentation sections"
    :style="{ '--section-count': sections.length }"
  >
    <button
      v-for="(section, index) in sections"
      :key="section.start"
      type="button"
      class="section-progress__item"
      :class="`is-${status(section)}`"
      :title="description(section)"
      :aria-label="description(section)"
      :aria-current="status(section) === 'active' ? 'step' : undefined"
      @click.stop="go(section.start)"
    >
      <span class="section-progress__label">
        <span class="section-progress__number">{{ index + 1 }}.</span>
        {{ section.label }}
      </span>

      <span class="section-progress__track" aria-hidden="true">
        <span
          class="section-progress__fill"
          :style="{ width: `${progress(section)}%` }"
        />
      </span>
    </button>
  </nav>
</template>

<style scoped>
.section-progress {
  --progress-background: var(--color-canvas);
  --progress-active: var(--color-accent);
  --progress-complete: var(--color-accent-soft);
  --progress-muted: var(--color-label);
  --progress-track: var(--color-line);
  --progress-text: var(--color-ink);

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;

  display: grid;
  grid-template-columns: repeat(var(--section-count), minmax(0, 1fr));
  gap: 12px;

  padding: 12px 24px 10px;
  background: var(--progress-background);
  border-bottom: 1px solid var(--progress-track);
  pointer-events: auto;
}

.section-progress__item {
  appearance: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  min-width: 0;

  padding: 0;
  border: 0;
  background: transparent;
  color: var(--progress-muted);
  text-align: left;
  cursor: pointer;
  font: inherit;
}

.section-progress__label {
  display: block;
  min-height: 30px;
  font-size: 11px;
  line-height: 1.3;
  font-weight: 500;
  white-space: normal;
}

.section-progress__number {
  margin-right: 2px;
}

.section-progress__track {
  display: block;
  width: 100%;
  height: 4px;
  overflow: hidden;
  background: var(--progress-track);
  border-radius: 2px;
}

.section-progress__fill {
  display: block;
  height: 100%;
  background: var(--progress-active);
  transition: width 200ms ease;
}

.is-active {
  color: var(--progress-active);
}

.is-active .section-progress__label {
  font-weight: 700;
}

.is-complete {
  color: var(--progress-text);
}

.is-complete .section-progress__fill {
  background: var(--progress-complete);
}

.section-progress__item:hover .section-progress__label {
  color: var(--progress-active);
}

.section-progress__item:focus-visible {
  outline: 2px solid var(--progress-active);
  outline-offset: 5px;
}

@media (prefers-reduced-motion: reduce) {
  .section-progress__fill {
    transition: none;
  }
}
</style>