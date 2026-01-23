import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection
} from '@angular/core'
import {provideRouter} from '@angular/router'
import {DarkMode} from './component/theme/theme'
import {providePrimeNG} from 'primeng/config'
import {provideClientHydration, withEventReplay} from '@angular/platform-browser'
import {routes} from './app.routes'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import Aura from '@primeuix/themes/aura'

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideAnimationsAsync(),
        provideClientHydration(withEventReplay()),
        providePrimeNG({
            ripple: true,
            theme: {
                preset: Aura
            }
        })
    ]
}
