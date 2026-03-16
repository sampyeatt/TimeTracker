import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const darkMode = definePreset(Aura, {
    semantic: {
        colorScheme: {
            dark: {
                primary: {
                    50: '{violet.50}',
                    100: '{violet.100}',
                    200: '{violet.200}',
                    300: '{violet.300}',
                    400: '{violet.400}',
                    500: '{violet.500}',
                    600: '{violet.600}',
                    700: '{violet.700}',
                    800: '{violet.800}',
                    900: '{violet.900}',
                    950: '{violet.950}'
                }
            }
        }
    },
    components: {
        button: {
            root: {
                raisedShadow:
                    '0 6px 2px -4px rgba(0, 0, 0, 0.2), 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
                roundedBorderRadius: '.8rem'
            }
        }
    }
})
