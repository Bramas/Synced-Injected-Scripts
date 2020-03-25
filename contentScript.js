console.log('== Inject Javascript -- Synced & Open Source ==');



function injectRawCode(code)
{
    var script = document.createElement('script');
    script.textContent = code;
    script.async = false;
    (document.head||document.documentElement).appendChild(script);
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
                injectRawCode(obj.code);
            }
        }
    }
});


injectRawCode(`
let _libToInject = []
function injectNextLib(cb)
{
    if(_libToInject.length === 0)
    {
        return cb();
    }
    var nextLib = _libToInject.shift();

    var script = document.createElement('script');
    script.src = nextLib;
    script.async = false;
    script.onload = () => { 
        injectNextLib(cb);
    };
    (document.head||document.documentElement).appendChild(script);
    console.log('== Inject Javascript -- ', nextLib);
}
function injectLibs(libs, cb)
{
    _libToInject = libs;
    injectNextLib(cb);
}
`);

