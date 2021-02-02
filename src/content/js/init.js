var port = browser.runtime.connect({name: 'init'});

var init = async () => {
    port.postMessage({ url: window.location.href });
};

init();