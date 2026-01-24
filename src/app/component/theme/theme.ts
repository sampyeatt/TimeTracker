import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

export const darkMode = definePreset(Aura, {
    semantic: {
        colorScheme: {
            dark: {
                formField: {
                    hoverBorderColor: '{purple.50}'
                },
                primary: {
                    50: '{purple.50}',
                    100: '{purple.100}',
                    200: '{purple.200}',
                    300: '{purple.300}',
                    400: '{purple.400}',
                    500: '{purple.500}',
                    600: '{purple.600}',
                    700: '{purple.700}',
                    800: '{purple.800}',
                    900: '{purple.900}',
                    950: '{purple.950}'
                }
            }
        }
    },
    components: {
        button: {
            extend: {
                accent: {
                    color: '{purple-600}'
                }
            },
            root: {
                raisedShadow:
                    '0 6px 2px -4px rgba(0, 0, 0, 0.2), 0 4px 4px 0 rgba(0, 0, 0, 0.14), 0 2px 10px 0 rgba(0, 0, 0, 0.12)',
                roundedBorderRadius: '.8rem'
            }
        }
    },
    card: {
        colorScheme: {
            dark: {
                root: {
                    background: '{surface.500}',
                    color: '{surface.0}'
                },
                subtitle: {
                    color: '{surface.400}'
                }
            }
        }
    }
})
