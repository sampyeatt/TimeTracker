import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection
} from '@angular/core'
import {provideRouter} from '@angular/router'
import {DarkMode} from './component/theme/theme'
import {providePrimeNG} from 'primeng/config'
import {provideHttpClient, withFetch} from '@angular/common/http'
import {provideClientHydration, withEventReplay} from '@angular/platform-browser'
import {routes} from './app.routes'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'


export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        provideClientHydration(withEventReplay()),
        providePrimeNG({
            theme: {
                preset: DarkMode
            }
        })
    ]
}
