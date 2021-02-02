/**
 * A setting
 * @typedef {Object} Setting
 * @property {string[]} branches - branches to pin
 * @property {bool} enabled - is enabled
 * @property {bool} debug - show debug logging
 */

/**
 * A branch config
 * @typedef {Object} BranchConfig
 * @property {string} id - unique id. will be unix timestamp at point of save
 * @property {string} name - branch name
 */

/**
 * Global variables
 */
var sessionId,
    defaultSettings = {
        branches: [
            { id: '1', name: 'develop' },
            { id: '2', name: 'qa' },
            { id: '3', name: 'staging' }
        ],
        enabled: true,
        debug: false
    };

/**
 * logs to console if the debug flag is set
 * @param {any[]} content 
 */
var log = async (content) => {
    let settings = await getSettings();
    
    if (!settings.debug) {
        return;
    }

    console.log(content);
}

/*
* Log old and new values when an item in a storage area is changed
*/
var logStorageChange = async (changes, area) => {
    let changedItems = Object.keys(changes);
  
    for (let item of changedItems) {
        await log(`Change in storage area: ${area} to item ${item}`);
        await log(['Old value: ', changes[item].oldValue]);
        await log(['New value: ', changes[item].newValue]);
    }
}

browser.storage.onChanged.addListener(logStorageChange);

/**
 * Retrieves settings from local storage
 * Checks for potentially missing properties in the settings object (caused by new properties being added on new versions of the code) 
 * and create those properties as defaults or from the defaultSettings object.
 * @returns {Setting}
 */
var getSettings = async () => {
    let data = await browser.storage.sync.get({ 'githubBranchQuickSelectSettings': defaultSettings });

    if (!data.githubBranchQuickSelectSettings.hasOwnProperty('enabled')) {
        data.githubBranchQuickSelectSettings.enabled = true;
    }

    if (!data.githubBranchQuickSelectSettings.hasOwnProperty('debug')) {
        data.githubBranchQuickSelectSettings.debug = false;
    }

    if (!data.githubBranchQuickSelectSettings.hasOwnProperty('branches')) {
        data.githubBranchQuickSelectSettings.branches = defaultSettings.branches;
    }
            
    return data.githubBranchQuickSelectSettings;
};

/**
 * Saves settings to local storage
 * Checks for potentially missing properties in the settings object (caused by new properties being added on new versions of the code) 
 * and create those properties as defaults or from the defaultSettings object.
 * @param {Setting} data - settings to save
 * @returns {Setting}
 */
var setSettings = async (data) => {
    if (!data.hasOwnProperty('enabled')) {
        data.enabled = true;
    }

    if (!data.hasOwnProperty('debug')) {
        data.enabled = false;
    }

    if (!data.hasOwnProperty('branches')) {
        data.branches = defaultSettings.branches;
    }

    var obj = {
        githubBranchQuickSelectSettings: data
    };

    await browser.storage.sync.set(obj);

    return data;
};

/**
 * Set the extension icon
 */
var setIcon = async () => {
    const tab = await browser.tabs.getCurrent();
    const settings = await getSettings();
    
    var img = 'content/assets/images/gprbqs16.png';

    await browser.browserAction.setIcon({ path: img });
};