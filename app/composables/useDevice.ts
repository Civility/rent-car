import { useBreakpoints } from "@vueuse/core";

// Ваши кастомные брейкпоинты из main.css
// 40rem = 640px, 48rem = 768px, 90rem = 1440px
const customBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1440, // 90rem
};

export const useDevice = () => {
  const breakpoints = useBreakpoints(customBreakpoints);

  return {
    // True, если экран меньше 'md' (768px)
    isMobile: breakpoints.smaller("md"),

    // True, если экран больше или равен 'lg' (1440px)
    isDesktop: breakpoints.greaterOrEqual("lg"),

    // Планшет: между 'md' (768px) и 'lg' (1440px)
    isTablet: breakpoints.between("md", "lg"),
  };
};
