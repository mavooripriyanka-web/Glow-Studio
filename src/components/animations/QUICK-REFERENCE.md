# 🎯 Quick Reference: Animation Components

## 🚀 Quick Start

### 1. Import
```tsx
import { FloatingSphere, ScrollReveal, ParallaxSection } from "@/components/animations"
```

### 2. Use in Your Component

#### Floating 3D Sphere (Hero sections)
```tsx
<section className="relative">
  <FloatingSphere />
  {/* Your hero content */}
</section>
```

#### Scroll Reveal (Fade in on scroll)
```tsx
<ScrollReveal direction="up">
  <h2>This fades in from bottom</h2>
</ScrollReveal>
```

#### Staggered Cards
```tsx
{products.map((product, i) => (
  <ScrollReveal key={i} direction="up" delay={i * 0.1}>
    <ProductCard {...product} />
  </ScrollReveal>
))}
```

---

## 📋 Component Props

### FloatingSphere
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `""` | Additional CSS classes |
| `disableOnMobile` | boolean | `true` | Disable on mobile for performance |

### ScrollReveal
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `"up" \| "down" \| "left" \| "right" \| "fade"` | `"up"` | Animation direction |
| `delay` | number | `0` | Delay in seconds |
| `duration` | number | `1` | Animation duration in seconds |
| `className` | string | `""` | Additional CSS classes |

### ParallaxSection
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `speed` | number | `0.5` | Parallax speed (higher = more effect) |
| `className` | string | `""` | Additional CSS classes |

---

## 💡 Common Patterns

### Hero with 3D Background
```tsx
<section className="relative h-screen">
  <FloatingSphere className="opacity-30" />
  <div className="relative z-10">
    <h1>Your Hero Title</h1>
  </div>
</section>
```

### Section Title Reveal
```tsx
<ScrollReveal direction="up">
  <h2 className="text-4xl font-bold">Section Title</h2>
</ScrollReveal>
```

### Grid with Staggered Animation
```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map((item, index) => (
    <ScrollReveal 
      key={index}
      direction="up"
      delay={index * 0.15}
    >
      <Card>{item}</Card>
    </ScrollReveal>
  ))}
</div>
```

### Alternating Directions
```tsx
{features.map((feature, i) => (
  <ScrollReveal 
    key={i}
    direction={i % 2 === 0 ? "left" : "right"}
  >
    <FeatureCard {...feature} />
  </ScrollReveal>
))}
```

---

## ⚡ Performance Tips

1. **Limit 3D elements**: Max 1-2 `FloatingSphere` per page
2. **Stagger delays**: Use `delay={index * 0.1}` for smooth cascading
3. **Mobile optimization**: `disableOnMobile={true}` is default for 3D
4. **Test scroll performance**: Check smooth 60fps on slower devices

---

## 🎨 Luxury Skincare Aesthetic

### Recommended Settings

**Hero Section:**
```tsx
<FloatingSphere className="opacity-20" disableOnMobile={true} />
```

**Product Cards:**
```tsx
<ScrollReveal direction="up" delay={index * 0.12} duration={0.8}>
```

**Section Titles:**
```tsx
<ScrollReveal direction="fade" duration={1.2}>
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "window is not defined" | ✅ Already fixed - all components use `"use client"` |
| Animations not triggering | Scroll down more - triggers at 85% viewport |
| Laggy on mobile | 3D is disabled by default on mobile |
| Multiple animations at once | Add staggered delays |

---

## 📦 Dependencies

Already installed:
- ✅ `three` - 3D graphics
- ✅ `@types/three` - TypeScript types
- ✅ `gsap` - Animations
- ✅ `@gsap/react` - React integration

---

## 🔗 Related Files

- Components: `src/components/animations/`
- Hook: `src/hooks/use-is-mobile.ts`
- Documentation: `src/components/animations/README.md`
- Implementation: See [implementation-summary.md](./implementation-summary.md)

---

## ✨ Examples in Your Site

Current implementations:
1. **Hero Section** - `FloatingSphere` with gold wireframe
2. **Treatments Title** - `ScrollReveal` fade up
3. **Treatment Cards** - Staggered `ScrollReveal` (100ms delay)
4. **Testimonials Title** - `ScrollReveal` fade up

---

**Dev Server:** http://localhost:9002
**Test it:** Open the site and scroll to see animations! 🎉
