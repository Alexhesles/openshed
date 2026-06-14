// OpenShed Design Tokens — Apple-inspired light design system

export const C = {
  // Backgrounds
  bg:       "#F5F5F7",
  card:     "#FFFFFF",
  cardAlt:  "#F2F2F7",

  // Brand
  blue:     "#007AFF",
  blueD:    "#0060D0",
  blueL:    "#EAF3FF",

  // Accents
  orange:   "#FF9500",
  orangeL:  "#FFF4E0",
  green:    "#34C759",
  greenL:   "#E8F9ED",
  red:      "#FF3B30",
  redL:     "#FFECEB",
  purple:   "#AF52DE",
  purpleL:  "#F5EAFA",

  // Text
  t1:       "#1D1D1F",   // primary
  t2:       "#6E6E73",   // secondary
  t3:       "#AEAEB2",   // tertiary / placeholder

  // UI chrome
  brd:      "rgba(60,60,67,.1)",
  brdM:     "rgba(60,60,67,.18)",

  // Shadows
  sh:       "0 1px 3px rgba(0,0,0,.07), 0 1px 2px rgba(0,0,0,.04)",
  shM:      "0 4px 20px rgba(0,0,0,.09)",
}

export const hlt = (p) => {
  if (p >= 85) return { c:"#34C759", l:"Excellent", bg:"#E8F9ED" }
  if (p >= 65) return { c:"#007AFF", l:"Good",      bg:"#EAF3FF" }
  if (p >= 45) return { c:"#FF9500", l:"Fair",      bg:"#FFF4E0" }
  if (p >= 25) return { c:"#FF6B00", l:"Worn",      bg:"#FFF0E5" }
  return              { c:"#FF3B30", l:"Service",   bg:"#FFECEB" }
}
