# Animation Components

This folder contains reusable animation components built with **Three.js** and **GSAP** for the Lune Skincare Next.js application.

## ⚠️ Important: Next.js SSR Compatibility

All components in this folder are **client-side only** and use the `"use client"` directive. They properly handle:

- ✅ Window access in `useEffect`
- ✅ Proper cleanup to prevent memory leaks
- ✅ Responsive resize handling
- ✅ Animation frame cancellation

## Components

### 1. FloatingSphere

A luxury 3D floating sphere using Three.js with subtle rotation animation.

**Usage:**
```tsx
import { FloatingSphere } from "@/components/animations"

<FloatingSphere className="opacity-50" />
```

**Props:**
- `className` (optional): Additional CSS classes

**Features:**
- Gold wireframe sphere for luxury aesthetic
- Subtle rotation for premium feel
- Transparent and non-intrusive
- Responsive to window resize
- Proper cleanup on unmount

---

### 2. ScrollReveal

GSAP-powered scroll-triggered reveal animations.

**Usage:**
```tsx
import { ScrollReveal } from "@/components/animations"

<ScrollReveal direction="up" delay={0.2}>
  <h2>Your Content</h2>
</ScrollReveal>
```

**Props:**
- `direction`: `"up" | "down" | "left" | "right" | "fade"` (default: `"up"`)
- `delay`: Number in seconds (default: `0`)
- `duration`: Number in seconds (default: `1`)
- `className` (optional): Additional CSS classes

**Features:**
- Smooth fade and slide animations
- Triggers at 85% viewport
- Customizable direction and timing
- Proper ScrollTrigger cleanup

---

### 3. ParallaxSection

GSAP-powered parallax scrolling effect.

**Usage:**
```tsx
import { ParallaxSection } from "@/components/animations"

<ParallaxSection speed={0.5}>
  <div>Your content moves slower than scroll</div>
</ParallaxSection>
```

**Props:**
- `speed`: Number (default: `0.5`) - Higher = more parallax
- `className` (optional): Additional CSS classes

**Features:**
- Smooth parallax effect
- Scrub animation tied to scroll
- Proper cleanup

---

## Best Practices

### ✅ DO:
- Use subtle animations for luxury feel
- Stagger delays for cascading effects
- Keep animations smooth and professional
- Test on mobile devices

### ❌ DON'T:
- Use heavy 3D models (keep it simple)
- Animate too many elements at once
- Forget to test performance on mobile
- Use jarring or fast animations

---

## Performance Tips

1. **Limit 3D elements**: Use `FloatingSphere` sparingly (1-2 per page max)
2. **Stagger animations**: Use delays to avoid simultaneous triggers
3. **Mobile optimization**: Consider reducing animation complexity on mobile
4. **Pixel ratio**: Already capped at 2x for performance

---

## Example: Staggered Card Animations

```tsx
{items.map((item, index) => (
  <ScrollReveal 
    key={index}
    direction="up"
    delay={index * 0.1} // Stagger by 100ms
  >
    <Card>{item.content}</Card>
  </ScrollReveal>
))}
```

---

## Troubleshooting

### "window is not defined" error
- ✅ All components use `"use client"` directive
- ✅ Window access is inside `useEffect`
- ✅ Check you're not importing these in server components

### Animations not triggering
- Check ScrollTrigger start position (default: `"top 85%"`)
- Ensure element has enough scroll distance
- Verify GSAP is installed: `npm list gsap`

### Memory leaks
- All components have proper cleanup in `useEffect` return
- Animations are killed on unmount
- Event listeners are removed

---

## Dependencies

- `three` - 3D graphics library
- `@types/three` - TypeScript types for Three.js
- `gsap` - Animation library
- `gsap/ScrollTrigger` - Scroll-based animations

All dependencies are already installed in the project.
