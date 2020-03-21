console.log('== Synced Injected Script ==');


function injectCode(code)
{
    var script = document.createElement('script');
    script.textContent = code;
    (document.head||document.documentElement).appendChild(script);
    script.remove();
}

function getHostname()
{
    return window.location.hostname.split('.').slice(-2).join('.')
}

var hostname = getHostname()

chrome.storage.sync.get([hostname], function(data) {
    if(data[hostname])
    {
        let ndnScripts = JSON.parse(data[hostname]);
        for(var obj of ndnScripts)
        {
            let regHost = obj.regHost.replace('.','\\.').replace('*', '.*');
            regHost.replace('https://', '');
            regHost.replace('http://', '');

            let regPath = obj.regPath.replace('.','\\.').replace('*', '.*');

            if(window.location.hostname.match(regHost)
            && window.location.pathname.match(regPath))
            {
                injectCode(obj.code);
            }
        }
    }
});