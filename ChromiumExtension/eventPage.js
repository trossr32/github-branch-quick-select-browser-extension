chrome.runtime.onConnect.addListener(function(port) {
    switch (port.name) {
        case 'init':
            port.onMessage.addListener(function (request) {
                getSettings(function (settings) {
                    setIcon(settings);

                    chrome.tabs.executeScript(null, { file: 'content/js/content_script.js' }, function () {});
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
    chrome.tabs.getCurrent(function(tab) {
        var img = 'content/assets/images/gprbqs16.png';

        chrome.browserAction.setIcon({ path: img });
    });
};