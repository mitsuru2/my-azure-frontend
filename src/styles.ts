import { definePreset } from '@primeuix/themes';
import Material from '@primeuix/themes/material';

export const MyPreset = definePreset(Material, {
    semantic: {
        primary: {
            color: 'light-dark({primary.500}, {primary.400})',
            contrastColor: 'light-dark(#ffffff, {surface.900})'
        }
    }
});
