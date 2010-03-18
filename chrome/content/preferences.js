var BarTapPreferences = {

  prefs: Components.classes["@mozilla.org/preferences-service;1"]
         .getService(Components.interfaces.nsIPrefBranch)
         .QueryInterface(Components.interfaces.nsIPrefBranch2),

  onLoad: function() {
    this.onTimeoutChange();
    this.updateHostWhitelist();
  },

  onTimeoutChange: function() {
    var menuitem = document.getElementById('tapAfterTimeout').selectedItem;
    var timerWidgets = document.getElementById('timerWidgets');
    var visibility = (menuitem.value == "true") ? 'visible' : 'hidden';
    timerWidgets.style.visibility = visibility;
  },

  updateHostWhitelist: function() {
    var list = document.getElementById("hostWhitelist");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
 
    var whitelist = this.getHostWhitelist();
    whitelist.forEach(function(host) {
        let row = document.createElement("listitem");
        row.setAttribute("label", host);
        list.appendChild(row);
      });
  },

  hostSelected: function() {
    var removeButton = document.getElementById("hostWhitelistRemove");
    var list = document.getElementById("hostWhitelist");
    if (list.selectedItem) {
      removeButton.setAttribute("disabled", "false");
    } else {
      removeButton.setAttribute("disabled", "true");
    }
  },

  removeHost: function() {
    var list = document.getElementById("hostWhitelist");
    var host = list.selectedItem.getAttribute("label");
    
    var whitelist = this.getHostWhitelist();
    var index = whitelist.indexOf(host);
    if (index == -1) {
      return;
    }

    whitelist.splice(index, 1);
    this.setHostWhitelist(whitelist);
    this.updateHostWhitelist();
  },

  //XXX TODO need to observe preference service for changes to
  // 'extensions.bartap.hostWhitelist' and then call updateHostWhitelist()


  /* For now these methods are duplicated from browser.js :\ */

  getHostWhitelist: function() {
    var whitelist = this.prefs.getCharPref("extensions.bartap.hostWhitelist");
    if (!whitelist) {
      return [];
    }
    return whitelist.split(";");
  },

  setHostWhitelist: function(whitelist) {
    this.prefs.setCharPref("extensions.bartap.hostWhitelist",
                           whitelist.join(";"));
  }
};