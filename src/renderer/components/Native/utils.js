import { DARK_THEME } from '@shared/constants'

export function getSystemTheme () {
  let result = DARK_THEME
  // result = remote.nativeTheme.shouldUseDarkColors ? LIGHT_THEME : DARK_THEME
  return result
}
