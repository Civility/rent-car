import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

export const useDevice = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind);

  return {
    // True, если экран меньше 'md' (768px)
    isMobile: breakpoints.smaller("md"),
    // True, если экран больше или равен 'lg' (1024px)
    isDesktop: breakpoints.greaterOrEqual("lg"),
    // Можно проверять любой конкретный диапазон
    isTablet: breakpoints.between("md", "lg"),
  };
};
