// settings.ts
export function getPopupSettings(campaignData: any) {
  return campaignData.settingsPopupState
    ? JSON.parse(campaignData.settingsPopupState)
    : null;
}

export function getTopbarSettings(campaignData: any) {
  return campaignData.settingsTopbarState
    ? JSON.parse(campaignData.settingsTopbarState)
    : null;
}
