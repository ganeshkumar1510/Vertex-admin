# Tesseract Vertex: Design System
> **"The Future of Focus"** — A multi-mode design system for the modern craftsman.

## 🌌 Philosophy
Tesseract Vertex is an evolution of the Tesseract design language. It introduces a dual-personality experience that adapts to the user's workflow intensity. It remains inspired by **Obsidian.md**'s aesthetic but adds a high-contrast, pure monochrome alternative for ultra-minimalist environments.

- **Aether Mode**: Mystical, cosmic violet dark mode. Designed for deep work and immersive focus.
- **Quasar Mode**: Pure greyscale, border-driven light mode. Designed for high-clarity, high-speed interaction.
- **Architectural Rhythm**: Consistent geometric spacing and industrial-grade typography.

---

## 🎨 Design Tokens (Vertex Core)

### Aether (Cosmic Violet Dark)
| Token | Hex / Value | Description |
| :--- | :--- | :--- |
| **Canvas** | `#000000` | Deepest background layer. |
| **Surface** | `#0A0A14` | Main UI surface. |
| **Aether Violet**| `#7C3AED` | Primary interaction and brand color. |
| **Pulsar Text** | `#EDE9FF` | Primary high-contrast text. |

### Quasar (Monochrome Light)
| Token | Hex / Value | Description |
| :--- | :--- | :--- |
| **Canvas** | `#FFFFFF` | Pure white background. |
| **Surface** | `#FAFAFA` | Subtle UI surface. |
| **Void Black** | `#000000` | Primary interaction and text color. |
| **Shadow Zinc** | `#6B6B6B` | Secondary metadata text. |

---

## 💠 Typography
| Typeface | Usage | Style |
| :--- | :--- | :--- |
| **Instrument Sans** | Global Interface | Sans-serif, Sharp, Modern |
| **JetBrains Mono** | IDs, Metrics, Code | Monospace, High Legibility |

---

## 🛠️ Components

### 1. The Mode Toggle
A custom sliding toggle that swaps the entire visual engine between Aether and Quasar without reloading.

### 2. The Card Primitives
- **Aether Cards**: Deep surfaces with subtle violet glows.
- **Quasar Cards**: Clean, border-based layouts with no shadows.

---

## 📸 Visual Identity
- **Logo**: Tesseract Vertex Mark.
- **Icons**: Lucide React (1.5px stroke weight).
- **Transitions**: Smooth 0.3s cubic-bezier transitions between all mode states.
