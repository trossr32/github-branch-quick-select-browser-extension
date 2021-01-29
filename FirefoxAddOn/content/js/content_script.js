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
var waitForEl = function(selector, callback, maxAttempts = 10, count) {
    if ($(selector).length) {
        callback();
    } else {
        setTimeout(function() {
            if (!count) {
                count = 0;
            }

            count++;
            
            if (count < maxAttempts) {
                waitForEl(selector, callback, maxAttempts, count);
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
var getElementValue = function(el, selector) {
    switch (selector) {
        case 'text':
            return el.text();
            
        default: // attribute
            return el.attr(selector);
    }
}

var process = function() {
    if (window.location.href.includes('/compare')) {
        waitForEl('.range-cross-repo-pair', function() {
            getSettings(function (settings) {
                log(settings);

                $('.range-cross-repo-pair').each(function (i, v) {
                    if (isOrdered[i]) {
                        return;
                    }

                    let rootEl = $(this);
                    let menuItems = rootEl.find('a.select-menu-item');

                    let priorityItems = [];

                    $.each(menuItems, function(i,m) {
                        let itemBranch = $.trim($(m).children('.select-menu-item-text').html() + '').toLowerCase();

                        if (settings.branches.some(branch => branch == itemBranch)) {
                            priorityItems.push($(m));
                        }
                    });

                    log(priorityItems);

                    $.each(priorityItems, function(pi, item) {
                        $(item).remove();

                        let list = rootEl.find('div.select-menu-list > div');
                        list.prepend($(item));

                        isOrdered[i].complete = true;
                    });

                    oldCount = $('.range-cross-repo-pair').find('a.select-menu-item').length;
                });

                paused = false;
            });
        });
    }
}

function listen(currentCount) {
    log(oldCount, currentCount);

    if (currentCount != oldCount) {
        paused = true;

        process();
    }

    oldCount = currentCount;

    setTimeout(function () {
        if (!paused) {
            listen($('.range-cross-repo-pair').find('a.select-menu-item').length);
        }
    }, 1000);
}

var init = function (settings) {
    if (!settings.enabled) {
        return;
    }

    listen($('.range-cross-repo-pair').find('a.select-menu-item').length);
};

$(function(){
    getSettings(init);
});