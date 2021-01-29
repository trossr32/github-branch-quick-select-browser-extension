/**
 * A setting
 * @typedef {Object} Setting
 * @property {string[]} branches - branches to pin
 * @property {bool} enabled - is enabled
 * @property {bool} debug - show debug logging
 */

/**
 * Global variables
 */
var sessionId,
    defaultSettings = {
        branches: [
            'master',
            'main',
            'develop',
            'qa',
            'staging'
        ],
        enabled: true,
        debug: false
    };

/**
 * logs to console if the debug flag is set
 * @param {any[]} content 
 */
var log = function(content) {
    getSettings(function(settings) {
        if (!settings.debug) {
            return;
        }
    
        console.log(content);
    });
}

/*
* Log old and new values when an item in a storage area is changed
*/
var logStorageChange = function(changes, area) {
    let changedItems = Object.keys(changes);
  
    for (let item of changedItems) {
        log(`Change in storage area: ${area} to item ${item}`);
        log(['Old value: ', changes[item].oldValue]);
        log(['New value: ', changes[item].newValue]);
    }
}

browser.storage.onChanged.addListener(logStorageChange);

/**
 * Retrieves settings from local storage
 * Checks for potentially missing properties in the settings object (caused by new properties being added on new versions of the code) 
 * and create those properties as defaults or from the defaultSettings object.
 * @param {function} callback - function to call on completion
 */
var getSettings = function(callback) {
    browser.storage.sync.get({ 'githubPullRequestBranchQuickSelectSettings': defaultSettings }, function (data) {
        if (typeof callback === "function") {
            if (!data.githubPullRequestBranchQuickSelectSettings.hasOwnProperty('enabled')) {
                data.githubPullRequestBranchQuickSelectSettings.enabled = true;
            }

            if (!data.githubPullRequestBranchQuickSelectSettings.hasOwnProperty('debug')) {
                data.githubPullRequestBranchQuickSelectSettings.debug = false;
            }

            if (!data.githubPullRequestBranchQuickSelectSettings.hasOwnProperty('branches')) {
                data.githubPullRequestBranchQuickSelectSettings.integrations = defaultSettings.branches;
            }
            
            callback(data.githubPullRequestBranchQuickSelectSettings);
        }
    });
};

/**
 * Saves settings to local storage
 * Checks for potentially missing properties in the settings object (caused by new properties being added on new versions of the code) 
 * and create those properties as defaults or from the defaultSettings object.
 * @param {Setting} data - settings to save
 * @param {function} callback - function to call on completion
 */
var setSettings = function (data, callback) {
    if (!data.hasOwnProperty('enabled')) {
        data.enabled = true;
    }

    if (!data.hasOwnProperty('debug')) {
        data.enabled = false;
    }

    if (!data.hasOwnProperty('branches')) {
        data.integrations = defaultSettings.branches;
    }

    var obj = {};
    obj['githubPullRequestBranchQuickSelectSettings'] = data;

    browser.storage.sync.set(obj, function() {
        if (typeof callback === "function") {
            callback(data);
        }
    });
};