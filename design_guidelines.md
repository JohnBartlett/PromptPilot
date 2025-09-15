# Design Guidelines for Apple-Inspired OpenAI Prompt Manager

## Design Approach
**Reference-Based Approach**: Drawing inspiration from Apple's design language and macOS interfaces, emphasizing clean minimalism, subtle depth, and intuitive interactions.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 0 0% 98% (near white backgrounds)
- Surface: 220 13% 96% (subtle gray surfaces)
- Borders: 220 13% 91% (light gray borders)
- Text Primary: 222 47% 11% (rich dark text)
- Accent: 212 100% 50% (Apple blue for actions)

**Dark Mode:**
- Primary: 222 47% 11% (dark backgrounds)
- Surface: 224 33% 15% (elevated surfaces)
- Borders: 224 33% 25% (subtle borders)
- Text Primary: 0 0% 98% (light text)
- Accent: 212 100% 60% (brighter blue for dark mode)

### B. Typography
- **Primary Font**: -apple-system, BlinkMacSystemFont, "SF Pro Display"
- **Hierarchy**: 
  - Headings: 600 weight, generous line height (1.2)
  - Body: 400 weight, comfortable reading (1.6 line height)
  - Labels: 500 weight, tight spacing for UI elements

### C. Layout System
**Spacing Primitives**: Tailwind units 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, gap-2
- Standard spacing: p-4, m-4, gap-4
- Section spacing: p-8, mb-8
- Large spacing: p-12, p-16 for major sections

### D. Component Library

**Navigation & Layout:**
- Sidebar with frosted glass effect (backdrop-blur-xl)
- Rounded corners (rounded-xl) throughout
- Subtle shadows (shadow-sm for cards, shadow-lg for modals)

**Forms & Inputs:**
- Large rounded text areas with subtle borders
- Model selection dropdown with clean styling
- Focus states with blue ring (ring-blue-500)

**Cards & Panels:**
- Saved prompts as cards with hover elevation
- Chat messages in bubble format with subtle backgrounds
- History panel with collapsible accordion design

**Interactive Elements:**
- Buttons with rounded-lg styling
- Outline buttons on hero backgrounds with backdrop-blur-sm
- Smooth transitions (transition-all duration-200)

**Data Displays:**
- Chat interface with alternating message alignment
- Prompt history with timestamp and model indicators
- Response formatting with syntax highlighting

### E. Visual Treatments

**Depth & Elevation:**
- Subtle gradients for surface differentiation
- Layered shadows for floating elements
- Frosted glass effects for overlays

**Interactive Feedback:**
- Gentle hover states with scale transforms
- Loading states with Apple-style spinners
- Smooth state transitions throughout

**Content Organization:**
- Clear visual hierarchy with consistent spacing
- Generous whitespace for breathing room
- Logical grouping with subtle dividers

## Images
No hero images required. Focus on clean, content-driven interface with subtle iconography from SF Symbols or Heroicons for navigation and actions.