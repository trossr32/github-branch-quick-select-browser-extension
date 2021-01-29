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
    log([window.location.host, window.location.href]);

    if (window.location.href.includes('/compare')) {
        waitForEl('.range-cross-repo-pair', function() {
            getSettings(function (settings) {
                log(settings);

                $('.range-cross-repo-pair').each(function (i, v) {
                    let container = $('<div class="range-cross-repo-pair"></div>');
                    let subContainer = $('<details class="details-reset details-overlay select-menu commitish-suggester hx_rsm"></details>');
                    let listItemContainer = $('<div data-filter-list=""></div>');

                    $.each(settings.branches, function(bi, branch) {
                        listItemContainer
                            .append(
                                $('<a id="gprbqs-' + (i == 0 ? 'from' : 'to') + '-' + branch + '" data-gprbqs-branch="' + branch + '" data-gprbqs-source="' + (i == 0 ? 'from' : 'to') + '" class="select-menu-item" aria-checked="false" role="menuitemradio" rel="nofollow">')
                                    .on('click', function(e) {
                                        log('click');
                                        e.preventDefault();

                                        let branch = $(this).attr('data-gprbqs-branch');
                                        let source = $(this).attr('data-gprbqs-source');
                                        let urlParts = window.location.href.split(/\/compare/);
                                        let url = urlParts[0] + '/compare/';

                                        log([branch, source, urlParts]);

                                        switch (source) {
                                            case 'from':
                                                if (urlParts.length > 1 && urlParts[urlParts.length - 1] != '') {
                                                    var urlBranch = urlParts[1].split(/\.\./);

                                                    if (urlBranch.length === 2 && urlBranch[1] != '') {
                                                        window.location = url + branch + '..' + urlBranch[1];
                                                    } else {
                                                        window.location = url + branch + '..';
                                                    }
                                                } else {
                                                    window.location = url + branch + '..';
                                                }
                                                break;
                                                
                                            case 'to':
                                                if (urlParts.length > 1 && urlParts[urlParts.length - 1] != '') {
                                                    var urlBranch = urlParts[urlParts.length - 1].split(/\.\./);

                                                    if (urlBranch[0] != '') {
                                                        window.location = url + urlBranch[0].replace('/','') + '..' + branch;
                                                    } else {
                                                        window.location = url + 'main..' + branch;
                                                    }
                                                } else {
                                                    window.location = url + 'main..' + branch;
                                                }
                                                break;
                                        }
                                    })
                                .append($('<span class="select-menu-item-text break-word" data-menu-button-text="" data-filter-item-text="">' + branch + '</span>'))
                            )
                    });

                    subContainer
                        .append($('<summary class="btn btn-sm select-menu-button branch" aria-haspopup="menu" role="button"></summary>')
                            .append($('<span class="css-truncate css-truncate-target" data-menu-button="" title="Pinned" style="margin-right: 5px;">Pinned</span>'))
                        )
                        .append($('<details-menu class="select-menu-modal position-absolute" style="z-index: 99;" role="menu"></details-menu>')
                            .append($('<tab-container class="js-branches-tags-tabs"></tab-container>')
                                .append($('<div class="select-menu-list" role="tabpanel" data-pjax=""></div>')
                                    .append(listItemContainer)
                                )
                            )
                        );

                    $(this).after(container.append(subContainer));
                });
            });
        });
    }
}

var oldHref = window.location.href;

function listen(currentHref) {
    log(currentHref, oldHref)

    if (currentHref != oldHref) {
        process();
    }

    oldHref = window.location.href;

    setTimeout(function () {
        listen(window.location.href);
    }, 1000);
}

var init = function (settings) {
    if (!settings.enabled) {
        return;
    }

    process();

    listen(window.location.href);
};

$(function(){
    getSettings(init);
});