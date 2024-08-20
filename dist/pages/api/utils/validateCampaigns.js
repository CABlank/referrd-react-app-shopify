export function validateCampaigns(campaigns) {
    var selectedCampaign = null;
    campaigns.forEach(function (campaign) {
        if (campaign.status !== "Live")
            return;
        var closeDate = campaign.closeDate ? new Date(campaign.closeDate) : null;
        if (closeDate && closeDate < new Date())
            return;
        if (!selectedCampaign ||
            (closeDate && closeDate < new Date(selectedCampaign.closeDate))) {
            selectedCampaign = campaign;
        }
    });
    if (!selectedCampaign)
        return null;
    // Return both the selected campaign and its format
    return {
        campaign: selectedCampaign,
        format: selectedCampaign.format || "null", // Default to "Popup" if format is not specified
        id: selectedCampaign.id || "null", // Default to "null" if id is not specified
    };
}
