const Fonts = {
  family: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },

  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    title: 34,
  },

  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  // Helper styles for quick access
  regular: {
    fontFamily: 'System',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'System',
    fontWeight: '500' as const,
  },
  semibold: {
    fontFamily: 'System',
    fontWeight: '600' as const,
  },
  bold: {
    fontFamily: 'System',
    fontWeight: '700' as const,
  },
};

export default Fonts;