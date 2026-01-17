import { getThemeSettings } from "@/actions/settings";

function hexToOklch(hex: string): string {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // Convert RGB to linear RGB
  const linearR = r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const linearG = g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const linearB = b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Convert to XYZ
  const x = 0.4124564 * linearR + 0.3575761 * linearG + 0.1804375 * linearB;
  const y = 0.2126729 * linearR + 0.7151522 * linearG + 0.072175 * linearB;
  const z = 0.0193339 * linearR + 0.119192 * linearG + 0.9503041 * linearB;

  // Convert XYZ to OKLab
  const l_ = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m_ = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s_ = 0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z;

  const l_cuberoot = Math.cbrt(l_);
  const m_cuberoot = Math.cbrt(m_);
  const s_cuberoot = Math.cbrt(s_);

  const L =
    0.2104542553 * l_cuberoot +
    0.793617785 * m_cuberoot -
    0.0040720468 * s_cuberoot;
  const a =
    1.9779984951 * l_cuberoot -
    2.428592205 * m_cuberoot +
    0.4505937099 * s_cuberoot;
  const b_val =
    0.0259040371 * l_cuberoot +
    0.7827717662 * m_cuberoot -
    0.808675766 * s_cuberoot;

  // Convert OKLab to OKLCH
  const C = Math.sqrt(a * a + b_val * b_val);
  let H = Math.atan2(b_val, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(3)})`;
}

// Generate a lighter/darker variant
function adjustLightness(oklch: string, adjustment: number): string {
  const match = oklch.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return oklch;
  const L = Math.min(1, Math.max(0, parseFloat(match[1]) + adjustment));
  return `oklch(${L.toFixed(3)} ${match[2]} ${match[3]})`;
}

export async function ThemeStyles() {
  const themeSettings = await getThemeSettings();

  const primaryColor = themeSettings.primaryColor || "#3B82F6";
  const secondaryColor = themeSettings.secondaryColor || "#10B981";
  const accentColor = themeSettings.accentColor || "#8B5CF6";

  // Convert hex colors to OKLCH for CSS variables
  const primaryOklch = hexToOklch(primaryColor);
  const secondaryOklch = hexToOklch(secondaryColor);
  const accentOklch = hexToOklch(accentColor);

  // Generate variants
  const primaryLight = adjustLightness(primaryOklch, 0.15);
  const primaryDark = adjustLightness(primaryOklch, -0.15);
  const secondaryLight = adjustLightness(secondaryOklch, 0.15);
  const secondaryDark = adjustLightness(secondaryOklch, -0.15);
  const accentLight = adjustLightness(accentOklch, 0.15);
  const accentDark = adjustLightness(accentOklch, -0.15);

  const customCss = themeSettings.customCss || "";

  const cssVariables = `
    :root {
      /* Theme Colors */
      --theme-primary: ${primaryOklch};
      --theme-primary-light: ${primaryLight};
      --theme-primary-dark: ${primaryDark};
      --theme-secondary: ${secondaryOklch};
      --theme-secondary-light: ${secondaryLight};
      --theme-secondary-dark: ${secondaryDark};
      --theme-accent: ${accentOklch};
      --theme-accent-light: ${accentLight};
      --theme-accent-dark: ${accentDark};
      
      /* Override shadcn/ui primary */
      --primary: ${primaryOklch};
      --primary-foreground: oklch(0.985 0 0);
      
      /* Override shadcn/ui secondary */
      --secondary: ${secondaryOklch};
      --secondary-foreground: oklch(0.985 0 0);
      
      /* Override shadcn/ui accent */
      --accent: ${accentOklch};
      --accent-foreground: oklch(0.985 0 0);
      
      /* Ring color for focus states */
      --ring: ${primaryOklch};
    }
    
    .dark {
      --primary: ${primaryOklch};
      --primary-foreground: oklch(0.985 0 0);
      --secondary: ${secondaryOklch};
      --secondary-foreground: oklch(0.985 0 0);
      --accent: ${accentOklch};
      --accent-foreground: oklch(0.985 0 0);
      --ring: ${primaryOklch};
    }

    /* Utility classes for theme colors */
    .bg-theme-primary { background-color: var(--theme-primary); }
    .bg-theme-secondary { background-color: var(--theme-secondary); }
    .bg-theme-accent { background-color: var(--theme-accent); }
    .text-theme-primary { color: var(--theme-primary); }
    .text-theme-secondary { color: var(--theme-secondary); }
    .text-theme-accent { color: var(--theme-accent); }
    .border-theme-primary { border-color: var(--theme-primary); }
    .border-theme-secondary { border-color: var(--theme-secondary); }
    .border-theme-accent { border-color: var(--theme-accent); }
    
    /* Gradient utilities */
    .bg-gradient-primary {
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-primary-dark));
    }
    .bg-gradient-secondary {
      background: linear-gradient(135deg, var(--theme-secondary), var(--theme-secondary-dark));
    }
    .bg-gradient-accent {
      background: linear-gradient(135deg, var(--theme-accent), var(--theme-accent-dark));
    }
    .bg-gradient-primary-accent {
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-accent));
    }
    .bg-gradient-primary-secondary {
      background: linear-gradient(135deg, var(--theme-primary), var(--theme-secondary));
    }
    .bg-gradient-secondary-accent {
      background: linear-gradient(135deg, var(--theme-secondary), var(--theme-accent));
    }
    
    /* Hero gradient - maintains the beautiful default look */
    .bg-gradient-hero {
      background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-accent) 50%, var(--theme-secondary) 100%);
    }
    .bg-gradient-hero-subtle {
      background: linear-gradient(135deg, var(--theme-primary)/10 0%, var(--theme-accent)/5 50%, var(--theme-secondary)/10 100%);
    }
    
    /* Radial gradients for decorative elements */
    .bg-radial-primary {
      background: radial-gradient(circle at center, var(--theme-primary), var(--theme-primary-dark));
    }
    .bg-radial-accent {
      background: radial-gradient(circle at center, var(--theme-accent), var(--theme-accent-dark));
    }

    /* Custom CSS from settings */
    ${customCss}
  `;

  return <style dangerouslySetInnerHTML={{ __html: cssVariables }} />;
}
