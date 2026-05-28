import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    caption: '#64748B',
  },
  roundness: 4,
  fonts: {
    ...MD3LightTheme.fonts,

    // Label / Caption
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      fontFamily: 'Inter-Regular',
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: 'Inter-Regular',
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: 'Inter-Medium',
    },

    // Body Text
    bodySmall: {
      ...MD3LightTheme.fonts.bodySmall,
      fontFamily: 'Inter-Regular',
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: 'Inter-Regular',
    },
    bodyLarge: { ...MD3LightTheme.fonts.bodyLarge, fontFamily: 'Inter-Medium' },

    // Title / Heading
    titleSmall: {
      ...MD3LightTheme.fonts.titleSmall,
      fontFamily: 'Inter-Medium',
    },
    titleMedium: {
      ...MD3LightTheme.fonts.titleMedium,
      fontFamily: 'Inter-Bold',
    },
    titleLarge: { ...MD3LightTheme.fonts.titleLarge, fontFamily: 'Inter-Bold' },

    // Display (jika dipakai)
    displaySmall: {
      ...MD3LightTheme.fonts.displaySmall,
      fontFamily: 'Inter-Bold',
    },
    displayMedium: {
      ...MD3LightTheme.fonts.displayMedium,
      fontFamily: 'Inter-Bold',
    },
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: 'Inter-Bold',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#818CF8',
    background: '#0F172A',
    surface: '#1E293B',
    onSurface: '#F8FAFC',
    caption: '#94A3B8',
  },
  roundness: 4,
  fonts: {
    ...MD3DarkTheme.fonts,

    // Label / Caption
    labelSmall: {
      ...MD3DarkTheme.fonts.labelSmall,
      fontFamily: 'Inter-Regular',
    },
    labelMedium: {
      ...MD3DarkTheme.fonts.labelMedium,
      fontFamily: 'Inter-Regular',
    },
    labelLarge: {
      ...MD3DarkTheme.fonts.labelLarge,
      fontFamily: 'Inter-Medium',
    },

    // Body Text
    bodySmall: {
      ...MD3DarkTheme.fonts.bodySmall,
      fontFamily: 'Inter-Regular',
    },
    bodyMedium: {
      ...MD3DarkTheme.fonts.bodyMedium,
      fontFamily: 'Inter-Regular',
    },
    bodyLarge: { ...MD3DarkTheme.fonts.bodyLarge, fontFamily: 'Inter-Medium' },

    // Title / Heading
    titleSmall: {
      ...MD3DarkTheme.fonts.titleSmall,
      fontFamily: 'Inter-Medium',
    },
    titleMedium: {
      ...MD3DarkTheme.fonts.titleMedium,
      fontFamily: 'Inter-Bold',
    },
    titleLarge: { ...MD3DarkTheme.fonts.titleLarge, fontFamily: 'Inter-Bold' },

    // Display (jika dipakai)
    displaySmall: {
      ...MD3DarkTheme.fonts.displaySmall,
      fontFamily: 'Inter-Bold',
    },
    displayMedium: {
      ...MD3DarkTheme.fonts.displayMedium,
      fontFamily: 'Inter-Bold',
    },
    displayLarge: {
      ...MD3DarkTheme.fonts.displayLarge,
      fontFamily: 'Inter-Bold',
    },
  },
};
