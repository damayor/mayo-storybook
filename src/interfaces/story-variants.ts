export const DM_THEME = {
  onlight: 'light',
  ondark: 'dark'
} as const

export type DmTheme = keyof typeof DM_THEME

export type DmColor = 'primary' | 'secondary' | 'neutral' | 'outline' | 'accent' |  'info' /* | 'success' |'warning' | 'error'*/;
