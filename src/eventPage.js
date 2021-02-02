browser.runtime.onConnect.addListener((port) => {
    switch (port.name) {
        case 'init':
            port.onMessage.addListener(async (request) => {
                try {
                    await setIcon();

                    let settings = await getSettings();
    
                    if (settings.enabled) {
                        await browser.tabs.executeScript({ file: 'content/js/content_script.js' });
                    }
                }
                catch (e) {
                    console.error('failed')
                }
            });
            break;
    }
});
