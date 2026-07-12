import { definePreset } from '@primeuix/themes';
import Material from '@primeuix/themes/material';

export const MyPreset = definePreset(Material, {
  semantic: {
    primary: {
      50: '{green.50}',
      100: '{green.100}',
      200: '{green.200}',
      300: '{green.300}',
      400: '{green.400}',
      500: '{green.500}',
      600: '{green.600}',
      700: '{green.700}',
      800: '{green.800}',
      900: '{green.900}',
      950: '{green.950}',
      color: 'light-dark({primary.500}, {primary.400})',
      contrastColor: 'light-dark(#ffffff, {surface.900})',
    },
  },
});
