var oldCount = $('.range-cross-repo-pair').find('a.select-menu-item').length,
    paused = false
    isOrdered = [
        false,
        false
    ];

/**
 * Attempts to find a jQuery element using the supplied selector every 100 milliseconds until found 
 * or max number of attempts reached (defaulted to 10 attempts, one second)
 * @param {string} selector - jQuery selector
 * @param {function} callback - callback function
 * @param {int} maxAttempts - max attempts
 * @param {int} count - attempt iterator
 */
var waitForEl = async (selector, maxAttempts = 10, count) => {
    if ($(selector).length) {
        return;
    } else {
        setTimeout(async () => {
            if (!count) {
                count = 0;
            }

            count++;
            
            if (count < maxAttempts) {
                await waitForEl(selector, maxAttempts, count);
            } else {
                return;
            }
        }, 100);
    }
};

/**
 * gets a value from an element based on the supplied selector
 * @param {any} el - jQuery element
 * @param {string} selector - selector type
 * @returns {string}
 */
var getElementValue = async (el, selector) => {
    switch (selector) {
        case 'text':
            return el.text();
            
        default: // attribute
            return el.attr(selector);
    }
}

/**
 * Process the dropdowns and reorder branches
 */
var process = async () => {
    // only run on pull requests for now
    if (!window.location.href.includes('/compare')) {
        return;
    }
    
    await waitForEl('.range-cross-repo-pair');
    
    let settings = await getSettings();

    await log(settings);

    $('.range-cross-repo-pair').each(async (i, el) => {
        if (isOrdered[i]) {
            return;
        }

        let rootEl = $(el);
        let menuItems = rootEl.find('a.select-menu-item');

        let priorityItems = [];

        $.each(menuItems, async (i, m) => {
            let itemBranch = $.trim(`${$(m).children('.select-menu-item-text').html()}`).toLowerCase();

            if (settings.branches.some(branch => branch.name == itemBranch)) {
                priorityItems.push($(m));
            }
        });

        await log(priorityItems);

        $.each(priorityItems, function(pi, item) {
            $(item).remove();

            let list = rootEl.find('div.select-menu-list > div');
            list.prepend($(item));

            isOrdered[i] = true;
        });

        oldCount = $('.range-cross-repo-pair').find('a.select-menu-item').length;
    });

    paused = false;
}

/**
 * Listen for the branch dropdowns being opened
 * @param {int} currentCount 
 */
var listen = async (currentCount) => {
    await log(oldCount, currentCount);

    if (currentCount != oldCount) {
        paused = true;

        await process();
    }

    oldCount = currentCount;

    setTimeout(async () => {
        if (!paused) {
            await listen($('.range-cross-repo-pair').find('a.select-menu-item').length);
        }
    }, 1000);
}

var init = async () => {
    let settings = await getSettings();

    if (!settings.enabled) {
        return;
    }

    await listen($('.range-cross-repo-pair').find('a.select-menu-item').length);
};

init();