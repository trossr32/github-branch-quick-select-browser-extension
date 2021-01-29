browser.runtime.onConnect.addListener(function(port) {
    switch (port.name) {
        case 'init':
            port.onMessage.addListener(function (request) {
                getSettings(function (settings) {
                    setIcon(settings);

                    browser.tabs.executeScript({ file: 'content/js/content_script.js' });
                });
            });
            break;

        case 'icon':
            port.onMessage.addListener(function (request) {
                getSettings(function (settings) {
                    setIcon(settings);
                });
            });
            break;
    }
});

/**
 * Set the extension icon
 * @param {Settings} settings 
 */
var setIcon = function(settings) {
    browser.tabs.getCurrent(function(tab) {
        var img = 'content/assets/images/gprbqs16.png';

        browser.browserAction.setIcon({ path: img });
    });
};
