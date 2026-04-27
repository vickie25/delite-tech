# 🖥️ Delite Tech — Complete Design & Build Guide
### Inspired by Back Market | Built for Laptops & iPhones

---

## TABLE OF CONTENTS
1. [Site Overview & Philosophy](#1-site-overview--philosophy)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Layout & Grid](#4-layout--grid)
5. [Header & Navigation](#5-header--navigation)
6. [Homepage Structure](#6-homepage-structure)
7. [Product Listing Page (PLP)](#7-product-listing-page-plp)
8. [Product Detail Page (PDP)](#8-product-detail-page-pdp)
9. [Cart & Checkout Flow](#9-cart--checkout-flow)
10. [Component Library](#10-component-library)
11. [Icons & Imagery](#11-icons--imagery)
12. [Footer](#12-footer)
13. [Spacing & Sizing System](#13-spacing--sizing-system)
14. [Mobile Responsiveness](#14-mobile-responsiveness)
15. [CSS Variables — Master Token Sheet](#15-css-variables--master-token-sheet)

---

## 1. SITE OVERVIEW & PHILOSOPHY

**Back Market's Core Design DNA (adapt for Delite Tech):**
- Clean, modern, trust-first ecommerce
- Lots of white space — nothing feels cluttered
- Strong use of black (#1A1A1A) as primary text on white (#FFFFFF) backgrounds
- One bold accent color used sparingly on CTAs
- Product photography is centered, clean, on white/light grey backgrounds
- Clear grading/condition badges on every product card
- The site builds TRUST through visual clarity and quality signals (ratings, guarantees, condition)

**Delite Tech Positioning:**
- Selling laptops + iPhones (new or refurbished)
- Brand tone: Tech-forward, reliable, honest, approachable
- Design tone: Clean minimalism with confident dark accents

---

## 2. COLOR SYSTEM

### Primary Palette (Back Market-inspired, adapted for Delite Tech)

```
/* BACKGROUNDS */
--color-bg-primary:       #FFFFFF   /* Main page background */
--color-bg-secondary:     #F5F5F5   /* Section alternates, product card bg */
--color-bg-dark:          #1A1A1A   /* Dark sections, footer, feature banners */
--color-bg-banner:        #F0EBE3   /* Warm off-white for promo banners */

/* TEXT */
--color-text-primary:     #1A1A1A   /* All main headings & body */
--color-text-secondary:   #6B6B6B   /* Subtext, captions, metadata */
--color-text-muted:       #9B9B9B   /* Placeholder text, disabled states */
--color-text-inverse:     #FFFFFF   /* Text on dark backgrounds */

/* BRAND ACCENT — Back Market uses a teal/green. For Delite Tech use electric blue */
--color-accent-primary:   #0A84FF   /* Primary CTA buttons, links, highlights */
--color-accent-hover:     #0066CC   /* Hover state of accent */
--color-accent-light:     #E8F3FF   /* Light accent bg for badges/tags */

/* CONDITION GRADE BADGES */
--color-grade-mint:       #00A878   /* "Like New" / "Excellent" */
--color-grade-good:       #F5A623   /* "Good" condition */
--color-grade-fair:       #E74C3C   /* "Fair" condition */

/* UTILITY */
--color-success:          #00A878   /* Success states, in-stock */
--color-warning:          #F5A623   /* Low stock, warnings */
--color-error:            #E74C3C   /* Error states */
--color-border:           #E8E8E8   /* Card borders, dividers */
--color-border-focus:     #0A84FF   /* Input focus rings */

/* STARS / RATINGS */
--color-star:             #F5A623   /* Star rating color */
```

### How Back Market uses color:
- **95% of the site is black text on white** — color is used very sparingly
- Accent (green/teal on Back Market, blue for Delite Tech) ONLY appears on:
  - Primary "Add to Cart" button
  - Active navigation states
  - Badges ("Best seller", "Verified")
  - Price highlights
- Dark (#1A1A1A) banners appear for featured promos / hero sections
- Product cards have ZERO color — pure white background, grey border

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack

Back Market uses a custom geometric sans-serif. For Delite Tech use:

```css
/* PRIMARY FONT — Headings, bold statements */
font-family: 'Nunito Sans', sans-serif;
/* Import: https://fonts.google.com/specimen/Nunito+Sans */
/* Weights used: 400, 600, 700, 800 */

/* SECONDARY FONT — Body, UI labels */
font-family: 'DM Sans', sans-serif;
/* Import: https://fonts.google.com/specimen/DM+Sans */
/* Weights used: 400, 500, 600 */

/* FALLBACK STACK */
font-family: 'Nunito Sans', 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale (px values for desktop)

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Nunito Sans | 56px | 800 | 1.1 | -0.02em |
| Section H2 | Nunito Sans | 36px | 700 | 1.2 | -0.01em |
| Card H3 | Nunito Sans | 20px | 700 | 1.3 | 0 |
| Product Title H4 | Nunito Sans | 18px | 600 | 1.4 | 0 |
| Body Large | DM Sans | 18px | 400 | 1.6 | 0 |
| Body Regular | DM Sans | 16px | 400 | 1.6 | 0 |
| Body Small | DM Sans | 14px | 400 | 1.5 | 0 |
| Caption | DM Sans | 12px | 400 | 1.4 | 0.02em |
| Button / Label | DM Sans | 15px | 600 | 1 | 0.01em |
| Price (large) | Nunito Sans | 28px | 700 | 1 | 0 |
| Price (card) | Nunito Sans | 20px | 700 | 1 | 0 |
| Badge / Tag | DM Sans | 11px | 700 | 1 | 0.06em UPPERCASE |

### Key Back Market Typography Rules:
- Product names are **bold, short, sentence-case** (e.g. "iPhone 14 Pro Max")
- Price is always the **largest, darkest** element on a card
- Condition grade is ALWAYS shown prominently below the product name
- "Was / Now" pricing uses strikethrough on old price in muted color
- Navigation items are ~14px, medium weight, dark grey

---

## 4. LAYOUT & GRID

### Container Widths
```css
--container-max: 1280px;    /* Maximum content width */
--container-wide: 1440px;   /* Full-bleed sections only */
--container-narrow: 760px;  /* Blog posts, legal pages */
--container-padding: 24px;  /* Side padding on desktop */
--container-padding-mobile: 16px;
```

### Grid System
```css
/* Product Grid — listing pages */
--grid-columns-desktop: 4;   /* 4 products per row on desktop */
--grid-columns-tablet: 3;    /* 3 on tablet (768–1024px) */
--grid-columns-mobile: 2;    /* 2 on mobile */
--grid-gap: 16px;            /* Gap between cards */

/* Category Tiles — homepage */
--category-grid-columns: 5;  /* 5 category icons in a row */
--category-gap: 12px;
```

### Section Spacing
```css
--section-padding-y: 64px;   /* Vertical padding between sections */
--section-padding-y-sm: 40px; /* Smaller sections */
--card-padding: 16px;        /* Inside product cards */
```

---

## 5. HEADER & NAVIGATION

### Structure (exact layout like Back Market)

```
[ Top utility bar — 40px height, #F5F5F5 background ]
  Left: "Free shipping on orders over $50"  
  Right: Country/Language | Help | Account

[ Main Header — 64px height, #FFFFFF, border-bottom: 1px solid #E8E8E8 ]
  Left:    LOGO (Delite Tech)
  Center:  Search bar (full-width, 480px max, rounded pill, grey bg)
  Right:   Trade-in link | Cart icon (with count badge) | Account icon

[ Primary Navigation — 48px, #FFFFFF, subtle border-bottom ]
  Tabs: Great Deals | Smartphones | Laptops | iPads | Accessories | Trade-In
```

### Search Bar Specs
```css
.search-bar {
  background: #F5F5F5;
  border: 1.5px solid transparent;
  border-radius: 100px;       /* Full pill shape */
  height: 44px;
  padding: 0 16px 0 44px;    /* Left padding for search icon */
  font-size: 15px;
  width: 100%;
  max-width: 480px;
}
.search-bar:focus {
  border-color: #0A84FF;
  background: #FFFFFF;
  outline: none;
}
/* Search icon: magnifying glass, 18px, #6B6B6B, positioned left inside bar */
```

### Navigation Dropdown (mega-menu)
When user hovers a nav tab (e.g. "Smartphones"):
```
[ Dropdown panel — full width, white bg, 8px rounded bottom, shadow ]
  Left col:   "Good to know" promo blurb (trade-in value, deals)
  Right cols: Category tiles with small images + label
              e.g. iPhone | Samsung Galaxy | Google Pixel | Android | Accessories
  
Each category tile:
  - 80×80px product image (no border, transparent bg)
  - 13px label below, dark, centered
  - Hover: slight scale(1.05) + underline
```

### Header Component Specs
```css
.header-logo {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #1A1A1A;
  letter-spacing: -0.03em;
}

.nav-item {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
  padding: 0 16px;
  height: 48px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid transparent;
  transition: border-color 0.2s;
}
.nav-item:hover, .nav-item.active {
  border-bottom-color: #0A84FF;
  color: #0A84FF;
}

.cart-icon {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #0A84FF;
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

---

## 6. HOMEPAGE STRUCTURE

Layout flows top to bottom in these sections:

### Section 1 — Hero Banner (full-width)
```
Height: 480px (desktop) / 320px (mobile)
Background: Dark (#1A1A1A) OR brand photography
Layout: 50/50 split — left is text, right is product image

LEFT SIDE:
  - Eyebrow tag: Small badge "New Arrivals" or "Limited Deal" in accent color
  - H1: Large bold headline (56px) e.g. "Premium Tech. Smarter Prices."
  - Subtext: 18px body text — 2 lines max
  - CTA Button: "Shop Now" — accent blue, pill shape, 52px height

RIGHT SIDE:
  - Hero product image (iPhone / MacBook) — centered, no shadow, transparent bg
  - Optional: floating badge "Up to 40% off"
```

### Section 2 — Trust Bar (thin stripe)
```
Background: #F5F5F5
Height: 72px
Layout: 4 items evenly spaced in a row

Items (with small icon + text):
  🛡️  12-Month Warranty
  ✓   Certified Condition
  🔄  30-Day Returns  
  📦  Free Shipping over $50
  
Style: 13px text, icon 20px, dark grey text, medium weight
```

### Section 3 — Category Quick-Links
```
Section title: "Shop by Category" (H2, left-aligned)
Layout: 5 horizontal tiles in a row

Each tile:
  - 160×160px card, white bg, 12px border-radius, subtle border
  - Product image (top 60% of card), centered
  - Category name below (16px, semibold, centered)
  - Hover: shadow deepens, slight translateY(-4px)

Categories: iPhones | MacBooks | Windows Laptops | iPads | Accessories
```

### Section 4 — Featured Deals / Best Sellers
```
Section title: "Today's Best Deals" (H2)
Subtitle: "Handpicked certified tech — all inspected and verified" (body text)
Layout: 4-column product card grid

[ See all deals → ] link, right-aligned, accent color
```

### Section 5 — Dark Feature Banner
```
Background: #1A1A1A (full-width dark stripe)
Layout: Split — left text, right image

LEFT:
  - H2 (white): "Trade In Your Old Device"
  - Body (grey): "Get up to $500 for your iPhone or laptop"
  - CTA: White outlined button "Get a Quote"

RIGHT:
  - Lifestyle image or device mockup
```

### Section 6 — More Products (Second Grid)
```
Section title: "Top Laptops" (H2)
4-column grid, same as Section 4
```

### Section 7 — Why Delite Tech (Trust Section)
```
Background: #F5F5F5
Layout: 3 columns, icon + heading + description

Col 1: 🔍 "Rigorously Tested" — Every device goes through 25-point inspection
Col 2: 🛡️ "12-Month Warranty" — Full coverage on every order
Col 3: 🔄 "30-Day Returns" — Changed your mind? No problem.
```

### Section 8 — Social Proof / Reviews
```
Background: White
Layout: Star rating + count headline + 3-column review cards

Headline: "★★★★★  Trusted by 50,000+ customers"
Review cards: Name + stars + review text (3 lines max) + date
```

---

## 7. PRODUCT LISTING PAGE (PLP)

### URL Pattern
`/category/iphones` | `/category/laptops` | `/search?q=macbook`

### Page Layout
```
[ Breadcrumb: Home > Smartphones > iPhone ]

[ Page Header ]
  H1: "Refurbished iPhones" (28px)
  Count: "247 products found" (14px, grey)

[ Filter + Sort Bar — sticky on scroll ]
  Left: Filter chips (Condition | Brand | Price | Storage | Color)
  Right: "Sort by: Best Match ▾"

[ 2-column layout ]
  Left sidebar (240px): Filter panel (desktop only)
  Right main (flex-1): Product grid 3-col
```

### Filter Panel (Left Sidebar)
```
CONDITION
  ☐ Like New (Grade A) — 94 items
  ☐ Excellent (Grade B) — 123 items
  ☐ Good (Grade C) — 30 items

PRICE RANGE
  Slider: $0 ————●————— $1500
  Min: [____] Max: [____]

BRAND
  ☐ Apple (185)
  ☐ Samsung (42)
  ☐ Google (20)

STORAGE
  ☐ 64GB | ☐ 128GB | ☐ 256GB | ☐ 512GB

COLOR
  ○ Midnight ○ Starlight ○ Blue ○ Red

[ Apply Filters ] button (accent blue, full width)
[ Clear all ] text link
```

### Filter Bar (Mobile — horizontal scroll chips)
```
[ All ] [ Condition ▾ ] [ Price ▾ ] [ Brand ▾ ] [ Storage ▾ ] [ Sort ▾ ]
Height: 44px, chips: 32px height, 12px border-radius, border style when inactive, filled when active
```

---

## 8. PRODUCT CARD COMPONENT

This is the most important component — used everywhere.

### Card Dimensions
```css
.product-card {
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  position: relative;
}
.product-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}
```

### Card Image Area
```css
.card-image-wrapper {
  background: #F5F5F5;
  height: 220px;          /* Desktop */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
}
.card-image {
  max-height: 180px;
  max-width: 100%;
  object-fit: contain;    /* ALWAYS contain, never cover for tech products */
}
```

### Card Badges (positioned top-left of image)
```css
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 4px 8px;
  border-radius: 4px;
}
.badge-deal    { background: #E74C3C; color: white; }   /* "Hot Deal" */
.badge-new     { background: #0A84FF; color: white; }   /* "New Arrival" */
.badge-popular { background: #1A1A1A; color: white; }   /* "Best Seller" */
```

### Favorite / Wishlist Button
```css
.card-wishlist {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: white;
  border-radius: 50%;
  border: 1px solid #E8E8E8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}
.product-card:hover .card-wishlist { opacity: 1; }
/* Heart icon SVG, 18px, grey when unfilled, red when filled */
```

### Card Body
```css
.card-body {
  padding: 14px 16px 16px;
}

/* Condition Grade — always first below image */
.condition-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #00A878;         /* Green for good conditions */
  margin-bottom: 6px;
}
/* Circle dot indicator: width 8px, height 8px, same color as text */

/* Product Title */
.card-title {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1.4;
  margin-bottom: 4px;
  /* Max 2 lines, then ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Spec tags (storage, color) */
.card-specs {
  font-size: 12px;
  color: #6B6B6B;
  margin-bottom: 8px;
}

/* Star Rating */
.card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6B6B6B;
  margin-bottom: 12px;
}
.stars { color: #F5A623; font-size: 12px; }

/* Price Block */
.card-price-block {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.price-current {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #1A1A1A;
}
.price-original {
  font-size: 14px;
  color: #9B9B9B;
  text-decoration: line-through;
}
.price-save {
  font-size: 12px;
  color: #00A878;
  font-weight: 600;
}
```

### Full Card HTML Structure
```html
<div class="product-card">
  <div class="card-image-wrapper">
    <img class="card-image" src="..." alt="iPhone 14 Pro 128GB Space Black">
    <span class="badge badge-deal">Hot Deal</span>
    <button class="card-wishlist">♡</button>
  </div>
  <div class="card-body">
    <div class="condition-tag">
      <span class="dot"></span> Excellent Condition
    </div>
    <h3 class="card-title">Apple iPhone 14 Pro 128GB Space Black</h3>
    <p class="card-specs">128GB · Space Black</p>
    <div class="card-rating">
      <span class="stars">★★★★★</span>
      <span>4.8 (312)</span>
    </div>
    <div class="card-price-block">
      <span class="price-current">$649</span>
      <span class="price-original">$999</span>
      <span class="price-save">Save 35%</span>
    </div>
  </div>
</div>
```

---

## 9. PRODUCT DETAIL PAGE (PDP)

### Layout: 2-Column (60/40 split)

```
LEFT COLUMN (60%) — Image Gallery
  - Main image: large, white bg, 500×500px display area
  - Thumbnail strip below: 5 small images, 64×64px each, bordered on selected
  - Zoom on hover (CSS transform scale)
  - Image navigation arrows for mobile

RIGHT COLUMN (40%) — Product Info
  ┌─────────────────────────────────┐
  │ Breadcrumb: Home > iPhone > 14  │
  │                                 │
  │ [CONDITION BADGE: Excellent ●]  │
  │                                 │
  │ H1: iPhone 14 Pro 128GB         │
  │     Space Black (20px, bold)    │
  │                                 │
  │ ★★★★★ 4.8   (312 reviews) →    │
  │                                 │
  │ $649  ~~$999~~  Save $350 (35%) │
  │                                 │
  │ ─────── Variant Selectors ───── │
  │                                 │
  │ Storage:                        │
  │ [64GB] [128GB●] [256GB] [512GB] │
  │                                 │
  │ Color:                          │
  │ ○ ● ○ ○  (color dot selectors) │
  │                                 │
  │ Condition:                      │
  │ ○ Like New $699                 │
  │ ● Excellent $649 (selected)     │
  │ ○ Good $549                     │
  │                                 │
  │ ─────────────────────────────── │
  │                                 │
  │ [  🛒 Add to Cart  ] (full w)   │
  │ [  ♡ Save to List  ] (outline)  │
  │                                 │
  │ ─────────────────────────────── │
  │                                 │
  │ ✓ Free shipping on this order   │
  │ ✓ 12-month warranty included    │
  │ ✓ 30-day return policy          │
  │ ✓ Secure checkout               │
  └─────────────────────────────────┘
```

### Button Specs (PDP)
```css
.btn-add-to-cart {
  background: #0A84FF;
  color: #FFFFFF;
  border: none;
  border-radius: 100px;        /* Full pill */
  height: 56px;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-add-to-cart:hover {
  background: #0066CC;
}
.btn-add-to-cart:active {
  transform: scale(0.98);
}

.btn-wishlist {
  background: transparent;
  color: #1A1A1A;
  border: 1.5px solid #E8E8E8;
  border-radius: 100px;
  height: 56px;
  width: 100%;
  font-size: 15px;
  font-weight: 600;
  margin-top: 10px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.btn-wishlist:hover {
  border-color: #1A1A1A;
}
```

### Variant Selector (Storage/Color)
```css
.variant-chip {
  border: 1.5px solid #E8E8E8;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}
.variant-chip:hover {
  border-color: #1A1A1A;
}
.variant-chip.selected {
  border-color: #0A84FF;
  background: #E8F3FF;
  color: #0A84FF;
  font-weight: 600;
}
.variant-chip.out-of-stock {
  color: #9B9B9B;
  border-color: #E8E8E8;
  text-decoration: line-through;
  cursor: not-allowed;
}
```

### Product Description Section (below 2-col layout)
```
Tabs: [Description] [Specifications] [What's in the Box] [Reviews]

Description tab:
  - About the condition (what "Excellent" means)
  - Device features paragraph
  - Condition checklist: ✓ Fully functional / ✓ Minor cosmetic wear / ✓ Unlocked

Specifications tab:
  - Table: Processor | RAM | Storage | Display | Battery | Camera | OS
  - Two-column alternating row table (white / light grey rows)

Reviews tab:
  - Summary: large star rating, bar chart of 5★/4★/3★/2★/1★ distribution
  - Individual review cards with: Name | Date | Stars | Title | Body
  - Pagination or "Load more" button
```

---

## 10. CART & CHECKOUT FLOW

### Cart Sidebar (Slide-in drawer)
Opens from right side when "Add to Cart" clicked.

```
[ Cart Drawer — 400px width, white bg, shadow ]
  Header: "Your Cart (3 items)"  [X close]
  ─────────────────────────────────
  Product row × 3:
    [Image 60×60] | Product Name (2 lines)
                  | Condition: Excellent
                  | 128GB · Space Black
                  | [-] 1 [+]     $649
  ─────────────────────────────────
  Subtotal:                   $1,847
  Shipping:                    Free
  ─────────────────────────────────
  TOTAL:                      $1,847
  
  [ Proceed to Checkout ]  ← accent blue pill button, full width
  [ Continue Shopping ]    ← text link, centered
```

### Checkout Page (3-step)
```
STEP 1: Contact & Shipping
  - Email field
  - Name (first + last)
  - Address line 1
  - Address line 2 (optional)
  - City | State | ZIP
  - Phone number
  [ Continue to Payment → ]

STEP 2: Payment
  - Card number
  - Expiry | CVV
  - Name on card
  - Billing address checkbox
  Payment icons: Visa / MC / Amex / PayPal / Apple Pay
  [ Place Order → ]

STEP 3: Confirmation
  - Order number
  - Summary of items
  - Expected delivery date
  - Email confirmation notice
```

### Checkout Input Styles
```css
.form-input {
  width: 100%;
  height: 52px;
  border: 1.5px solid #E8E8E8;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 15px;
  color: #1A1A1A;
  background: #FFFFFF;
  transition: border-color 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #0A84FF;
  box-shadow: 0 0 0 3px rgba(10,132,255,0.12);
}
.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
  display: block;
}
```

---

## 11. COMPONENT LIBRARY

### Buttons — All Variants
```css
/* PRIMARY — Main CTA */
.btn-primary {
  background: #0A84FF;
  color: white;
  border: none;
  border-radius: 100px;
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
}

/* SECONDARY — Ghost button */
.btn-secondary {
  background: transparent;
  color: #1A1A1A;
  border: 1.5px solid #1A1A1A;
  border-radius: 100px;
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
}

/* SMALL — For compact actions */
.btn-sm {
  height: 36px;
  padding: 0 16px;
  font-size: 13px;
  border-radius: 100px;
}

/* LARGE — Hero CTAs */
.btn-lg {
  height: 56px;
  padding: 0 36px;
  font-size: 17px;
  border-radius: 100px;
}

/* DARK — Used on dark backgrounds */
.btn-dark {
  background: white;
  color: #1A1A1A;
  border: none;
  border-radius: 100px;
}
```

### Rating Stars Component
```html
<div class="star-rating">
  <span class="stars">★★★★★</span>
  <span class="rating-value">4.8</span>
  <span class="rating-count">(312 reviews)</span>
</div>
```
```css
.star-rating { display: flex; align-items: center; gap: 4px; }
.stars { color: #F5A623; font-size: 14px; letter-spacing: 1px; }
.rating-value { font-weight: 700; font-size: 14px; color: #1A1A1A; }
.rating-count { font-size: 13px; color: #6B6B6B; }
```

### Condition Badge Component
```html
<div class="condition-badge condition-excellent">
  <span class="condition-dot"></span>
  Excellent Condition
</div>
```
```css
.condition-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.condition-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
}
.condition-excellent { color: #00A878; }
.condition-excellent .condition-dot { background: #00A878; }
.condition-good { color: #F5A623; }
.condition-good .condition-dot { background: #F5A623; }
.condition-fair { color: #E74C3C; }
.condition-fair .condition-dot { background: #E74C3C; }
```

### Toast / Notification
```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1A1A1A;
  color: white;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Breadcrumb
```html
<nav class="breadcrumb">
  <a href="/">Home</a>
  <span class="sep">/</span>
  <a href="/smartphones">Smartphones</a>
  <span class="sep">/</span>
  <span class="current">iPhone 14 Pro</span>
</nav>
```
```css
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.breadcrumb a { color: #6B6B6B; text-decoration: none; }
.breadcrumb a:hover { color: #1A1A1A; text-decoration: underline; }
.breadcrumb .sep { color: #9B9B9B; }
.breadcrumb .current { color: #1A1A1A; font-weight: 500; }
```

---

## 12. FOOTER

### Structure
```
[ Footer — dark background #1A1A1A, padding 64px top/bottom ]

  ROW 1 — 5 columns
  ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
  │ Delite Tech  │   Shop       │   Company    │   Support    │ Connect      │
  │ (logo)       │ iPhones      │ About Us     │ Help Center  │ [Instagram]  │
  │              │ Laptops      │ Blog         │ Contact Us   │ [Twitter/X]  │
  │ Short brand  │ iPads        │ Careers      │ Shipping     │ [Facebook]   │
  │ mission      │ Accessories  │ Press        │ Returns      │ [LinkedIn]   │
  │ statement    │ Trade-In     │ Sustainability│ Warranty     │              │
  │ (body text   │ Gift Cards   │              │ Track Order  │ App stores:  │
  │ 14px, grey)  │              │              │              │ [App Store]  │
  │              │              │              │              │ [Google Play]│
  └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

  ROW 2 — Bottom bar (border-top 1px solid #333)
  Left: © 2025 Delite Tech. All rights reserved.
  Center: [Privacy Policy] [Terms of Use] [Cookie Settings]
  Right: Payment icons (Visa, MC, Amex, PayPal, Apple Pay)
```

```css
.footer { background: #1A1A1A; color: #FFFFFF; padding: 64px 0 32px; }
.footer-heading { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #FFFFFF; margin-bottom: 20px; }
.footer-link { display: block; font-size: 14px; color: #9B9B9B; text-decoration: none; margin-bottom: 10px; transition: color 0.2s; }
.footer-link:hover { color: #FFFFFF; }
.footer-bottom { border-top: 1px solid #333; margin-top: 48px; padding-top: 24px; display: flex; justify-content: space-between; align-items: center; }
.footer-legal { font-size: 13px; color: #6B6B6B; }
```

---

## 13. SPACING & SIZING SYSTEM

Use an **8px base unit** for all spacing.

```css
--space-1:  4px    /* Tight: icon-to-text gap */
--space-2:  8px    /* Small: within components */
--space-3:  12px   /* Between related elements */
--space-4:  16px   /* Card padding, form gaps */
--space-5:  20px   /* Section sub-gaps */
--space-6:  24px   /* Container padding */
--space-8:  32px   /* Between card sections */
--space-10: 40px   /* Small section padding */
--space-12: 48px   /* Medium section padding */
--space-16: 64px   /* Large section padding */
--space-20: 80px   /* Hero paddings */
--space-24: 96px   /* XL hero sections */

/* BORDER RADIUS */
--radius-sm:  4px   /* Badges, chips */
--radius-md:  8px   /* Inputs, small cards */
--radius-lg:  12px  /* Product cards */
--radius-xl:  16px  /* Large panels */
--radius-pill: 100px /* Buttons */

/* SHADOWS */
--shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
--shadow-md: 0 4px 16px rgba(0,0,0,0.10);
--shadow-lg: 0 8px 32px rgba(0,0,0,0.14);
--shadow-xl: 0 16px 48px rgba(0,0,0,0.18);
```

---

## 14. MOBILE RESPONSIVENESS

### Breakpoints
```css
/* Mobile first approach */
--bp-sm:  480px   /* Large phones */
--bp-md:  768px   /* Tablets portrait */
--bp-lg:  1024px  /* Tablets landscape / small laptops */
--bp-xl:  1280px  /* Desktop */
--bp-2xl: 1440px  /* Wide desktop */
```

### Mobile-Specific Rules
```css
/* Header becomes 2-row on mobile */
/* Row 1: Logo + Cart icon + Hamburger menu */
/* Row 2: Full-width search bar */

/* Navigation becomes hamburger drawer */
.mobile-nav { position: fixed; top: 0; left: -100%; width: 85%; height: 100vh; background: white; z-index: 999; transition: left 0.3s ease; }
.mobile-nav.open { left: 0; }

/* Product grid: 2 columns */
@media (max-width: 768px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .card-image-wrapper { height: 160px; }
  .price-current { font-size: 18px; }
}

/* PDP: stacked columns */
@media (max-width: 768px) {
  .pdp-layout { flex-direction: column; }
  .pdp-images { width: 100%; }
  .pdp-info { width: 100%; }
  .btn-add-to-cart { position: fixed; bottom: 0; left: 0; right: 0; border-radius: 0; z-index: 100; }
}

/* Cart: full-screen drawer */
@media (max-width: 768px) {
  .cart-drawer { width: 100%; }
}
```

---

## 15. CSS VARIABLES — MASTER TOKEN SHEET

Copy this block into your root CSS. Every other style references these variables.

```css
:root {
  /* COLORS */
  --clr-bg:             #FFFFFF;
  --clr-bg-alt:         #F5F5F5;
  --clr-bg-dark:        #1A1A1A;
  --clr-bg-banner:      #F0EBE3;
  --clr-text:           #1A1A1A;
  --clr-text-secondary: #6B6B6B;
  --clr-text-muted:     #9B9B9B;
  --clr-text-inverse:   #FFFFFF;
  --clr-accent:         #0A84FF;
  --clr-accent-hover:   #0066CC;
  --clr-accent-light:   #E8F3FF;
  --clr-success:        #00A878;
  --clr-warning:        #F5A623;
  --clr-error:          #E74C3C;
  --clr-star:           #F5A623;
  --clr-border:         #E8E8E8;
  --clr-border-focus:   #0A84FF;

  /* TYPOGRAPHY */
  --font-heading: 'Nunito Sans', sans-serif;
  --font-body:    'DM Sans', sans-serif;

  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 15px;
  --text-md:   16px;
  --text-lg:   18px;
  --text-xl:   20px;
  --text-2xl:  24px;
  --text-3xl:  30px;
  --text-4xl:  36px;
  --text-5xl:  48px;
  --text-hero: 56px;

  /* SPACING */
  --sp-1:  4px;   --sp-2:  8px;   --sp-3:  12px;
  --sp-4:  16px;  --sp-5:  20px;  --sp-6:  24px;
  --sp-8:  32px;  --sp-10: 40px;  --sp-12: 48px;
  --sp-16: 64px;  --sp-20: 80px;  --sp-24: 96px;

  /* BORDER RADIUS */
  --r-sm:   4px;
  --r-md:   8px;
  --r-lg:   12px;
  --r-xl:   16px;
  --r-pill: 100px;

  /* SHADOWS */
  --sh-sm: 0 1px 4px rgba(0,0,0,0.06);
  --sh-md: 0 4px 16px rgba(0,0,0,0.10);
  --sh-lg: 0 8px 32px rgba(0,0,0,0.14);
  --sh-xl: 0 16px 48px rgba(0,0,0,0.18);

  /* TRANSITIONS */
  --tr-fast: 0.15s ease;
  --tr-base: 0.25s ease;
  --tr-slow: 0.4s ease;

  /* LAYOUT */
  --container: 1280px;
  --container-pad: 24px;
  --header-h: 64px;
  --topbar-h: 40px;
  --nav-h: 48px;
}
```

---

## QUICK REFERENCE CHEATSHEET

| Element | Value |
|---------|-------|
| Brand font | Nunito Sans |
| Body font | DM Sans |
| Hero H1 | 56px / 800 weight |
| Section H2 | 36px / 700 weight |
| Card title | 15px / 600 weight |
| Price (card) | 22px / 700 weight |
| Button height | 48px (default) / 56px (large) |
| Button radius | 100px (pill) |
| Card radius | 12px |
| Input height | 52px |
| Input radius | 10px |
| Primary color | #0A84FF |
| Text dark | #1A1A1A |
| Text grey | #6B6B6B |
| Border | #E8E8E8 |
| Background | #FFFFFF |
| Alt background | #F5F5F5 |
| Success green | #00A878 |
| Grid gap | 16px |
| Products per row | 4 (desktop) / 3 (tablet) / 2 (mobile) |
| Container max | 1280px |
| Container padding | 24px |
| Section spacing | 64px |

---

*Delite Tech Design Guide v1.0 — Based on Back Market analysis*
*Use this document as the single source of truth when instructing AI to build any page of the Delite Tech website.*
