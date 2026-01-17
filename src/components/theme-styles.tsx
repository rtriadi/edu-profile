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
  const y = 0.2126729 * linearR + 0.7151522 * linearG + 0.0721750 * linearB;
  const z = 0.0193339 * linearR + 0.1191920 * linearG + 0.9503041 * linearB;

  // Convert XYZ to OKLab
  const l_ = 0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z;
  const m_ = 0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z;
  const s_ = 0.0482003018 * x + 0.2643662691 * y + 0.6338517070 * z;

  const l_cuberoot = Math.cbrt(l_);
  const m_cuberoot = Math.cbrt(m_);
  const s_cuberoot = Math.cbrt(s_);

  const L = 0.2104542553 * l_cuberoot + 0.7936177850 * m_cuberoot - 0.0040720468 * s_cuberoot;
  const a = 1.9779984951 * l_cuberoot - 2.4285922050 * m_cuberoot + 0.4505937099 * s_cuberoot;
  const b_val = 0.0259040371 * l_cuberoot + 0.7827717662 * m_cuberoot - 0.8086757660 * s_cuberoot;

  // Convert OKLab to OKLCH
  const C = Math.sqrt(a * a + b_val * b_val);
  let H = Math.atan2(b_val, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(3)})`;
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

  // Generate foreground colors (light versions for dark backgrounds)
  const customCss = themeSettings.customCss || "";

  const cssVariables = `
    :root {
      --theme-primary: ${primaryOklch};
      --theme-secondary: ${secondaryOklch};
      --theme-accent: ${accentOklch};
    }

    /* Override primary color */
    :root {
      --primary: ${primaryOklch};
      --primary-foreground: oklch(0.985 0 0);
    }

    /* Custom CSS from settings */
    ${customCss}
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
  );
}
