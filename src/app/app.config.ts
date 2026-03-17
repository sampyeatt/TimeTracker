import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core'
import { provideRouter } from '@angular/router'
import { darkMode } from './component/theme/theme'
import { providePrimeNG } from 'primeng/config'
import { provideClientHydration, withEventReplay } from '@angular/platform-browser'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        providePrimeNG({
            ripple: true,
            theme: {
                preset: darkMode,
                options: {
                    cssLayer: {
                        name: 'darkMode',
                        order: 'theme, base, primeng'
                    }
                }
            }
        })
    ]
}
