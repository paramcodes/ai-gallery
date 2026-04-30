# Image Gallery Website - Specification

## 1. Project Overview
- **Project Name**: Lumina Gallery
- **Type**: Single-page image gallery with upload functionality
- **Core Feature**: Upload, display, and view images with elegant animations
- **Target Users**: Anyone wanting a beautiful personal image gallery

## 2. Visual & Rendering Specification

### Scene Setup
- Clean, minimal design with focus on imagery
- Dark mode aesthetic with subtle gradients
- Responsive masonry-style grid layout

### Materials & Effects
- Smooth fade-in animations for images
- Hover effects with subtle zoom and glow
- Modal/popup with backdrop blur and scale animation

### Color Palette
- **Primary Background**: #0f0f0f (near black)
- **Secondary Background**: #1a1a1a (card backgrounds)
- **Accent Color**: #8b5cf6 (violet)
- **Text Primary**: #ffffff
- **Text Secondary**: #a1a1aa

## 3. Image Storage Strategy

### Primary: ImgBB (Free)
- No API key required for anonymous uploads
- Direct URL-based upload
- 10MB file size limit per image
- Images hosted for free indefinitely

### Fallback: LocalStorage
- Store image data URLs in browser
- Note: Limited storage (~5-10MB), shows warning to users

## 4. Interaction Specification

### Upload
- Drag-and-drop zone with visual feedback
- Click to browse files
- Progress indicator during upload
- Success/error notifications

### Gallery Grid
- Masonry layout (responsive columns)
- Lazy loading for performance
- Hover: slight zoom + shadow effect
- Click: opens lightbox popup

### Lightbox/Popup
- Full-screen overlay with blur background
- Image centered with smooth scale animation
- Close on: X button, backdrop click, Escape key
- Navigation arrows for prev/next (if multiple images)

### Animations
- **Upload zone**: Pulse animation on drag-over
- **Image cards**: Fade-in with stagger on load
- **Lightbox**: Scale from 0.9 to 1 + fade in
- **Hover**: Transform scale(1.03) with shadow

## 5. UI Components

### Header
- Logo/Title: "Lumina Gallery"
- Upload button (prominent)
- Image count indicator

### Upload Zone
- Dashed border, icon + text
- States: default, drag-over, uploading, error

### Gallery Grid
- Responsive: 1 col (mobile), 2 cols (tablet), 3-4 cols (desktop)
- Image cards with rounded corners
- Loading skeleton placeholders

### Lightbox Modal
- Close button (top-right)
- Image container with max dimensions
- Optional: navigation arrows
- Optional: image info/caption area

### Toast Notifications
- Success (green), Error (red), Info (blue)
- Auto-dismiss after 3 seconds

## 6. Technical Implementation

### Stack
- React + Vite
- Tailwind CSS for styling
- Framer Motion for animations (or CSS animations)

### Key Features
- LocalStorage for image persistence (data URLs)
- Image upload to ImgBB for free hosting
- CSS masonry grid
- Smooth lightbox component

## 7. Acceptance Criteria

1. ✅ User can upload images via drag-drop or click
2. ✅ Images appear in a responsive grid
3. ✅ Clicking image opens popup with smooth animation
4. ✅ Popup can be closed via X, backdrop click, or Escape
5. ✅ Images persist in browser localStorage
6. ✅ Upload progress feedback shown
7. ✅ Error handling for failed uploads
8. ✅ Responsive design works on mobile/tablet/desktop
9. ✅ Nice hover effects on image cards
10. ✅ Toast notifications for user feedback