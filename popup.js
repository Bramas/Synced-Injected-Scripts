// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';


let submit = document.getElementById('button-saved');
let regHost = document.getElementById('input-reg-host');
let regPath = document.getElementById('input-reg-path');
//let textarea = document.getElementById('textarea-script');



// pass options to ace.edit
var editor = ace.edit("editor", {
  mode: "ace/mode/javascript",
  selectionStyle: "text"
})
// use setOptions method to set several options at once
editor.setOptions({
  autoScrollEditorIntoView: true,
  copyWithEmptySelection: true,
});
editor.setTheme("ace/theme/monokai");


function getNdN(hostname)
{
    return hostname.split('.').slice(-2).join('.')
}

let ndn = null;
let ndnScripts = null;

chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
}, function(tabs) {
  // and use that tab to fill in out title and url
  var tab = tabs[0];

  const url = new URL(tab.url);
  ndn = getNdN(url.hostname);
    
  chrome.storage.sync.get([ndn], function(data) {
    
    if(!data[ndn])
    {
      ndnScripts = [{
        regHost:url.hostname, 
        regPath:'*', 
        code:''
      }];
    } else {
      ndnScripts = JSON.parse(data[ndn]);
    }
    editor.setValue(ndnScripts[0].code);
    regHost.value = ndnScripts[0].regHost;
    regPath.value = ndnScripts[0].regPath;
  });
});



submit.addEventListener('click', function() {
  ndnScripts[0].regHost = regHost.value;
  ndnScripts[0].regPath = regPath.value;
  ndnScripts[0].code = editor.getValue();
  let obj = {};
  obj[ndn] = JSON.stringify(ndnScripts);
  chrome.storage.sync.set(obj, function() {
    console.log(ndn, '=>', ndnScripts);
  });
});


// some options are also available as methods e.g. 
//editor.setTheme(...)

// to get the value of the option use
//editor.getOption("optionName");