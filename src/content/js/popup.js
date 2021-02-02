var setEnabledDisabledButtonState = async (settings) => {
    $('#toggleActive').removeClass('btn-success btn-danger').addClass('btn-' + (settings.enabled ? 'danger' : 'success'));
    $('#toggleActive').html('<i class="fas fa-power-off"></i>&nbsp;&nbsp;&nbsp;&nbsp;' + (settings.enabled ? 'Disable' : '&nbsp;Enable'));
};

$(async () => {
    // initialise page on load
    getSettings(setEnabledDisabledButtonState);
    
    $('#toggleActive').on('click', async (e) => {
        let settings = await getSettings();

        // update enabled setting
        settings.enabled = !settings.enabled;

        settings = await setSettings(settings);
            
        // update popup ui
        await setEnabledDisabledButtonState(settings);

        // update icon
        await setIcon();
    });

    $('#btnSettings').on('click', async () => {
        chrome.runtime.openOptionsPage(); // add open flag in settings?
    });
});