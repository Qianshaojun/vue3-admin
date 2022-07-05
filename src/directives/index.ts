import type { App } from 'vue'
import { setUpPermissionDirective } from './permission'
export function setupGlobDirectives(app: App) {
    setUpPermissionDirective(app)
}
