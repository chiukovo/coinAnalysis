"use strict";
window.DeadSimpleChat = {
  __serialize: function (e) {
    var t = [];
    for (var n in e) e.hasOwnProperty(n) && t.push(encodeURIComponent(n) + "=" + encodeURIComponent(e[n]));
    return t.join("&");
  },
  initBubble: function (e) {
    if (!e) throw new Error("Options are required");
    if (!e.roomId) throw new Error("roomId is required");
    var t = "https://deadsimplechat.com";
    e.location && (t = e.location);
    var n = "small";
    if (e.size && "small" !== e.size && "large" !== e.size) throw new Error("Please specify size of 'small' or 'large'");
    e.size && (n = e.size);
    var i = "",
      o = "",
      d = {};
    "small" === n && (window.matchMedia("screen and (max-width:600px)").matches ? ((o = i = "100%"), (d.width = "100%"), (d.height = "100%")) : ((i = "450px"), (o = "680px"), (d.width = "400px"), (d.height = "600px"))),
      "large" === n && (window.matchMedia("screen and (max-width:600px)").matches ? ((o = i = "100%"), (d.width = "100%"), (d.height = "100%")) : ((i = "850px"), (o = "680px"), (d.width = "800px"), (d.height = "600px"))),
      e.username && (d.username = e.username),
      e.disableCustomCSS && (d.disableCustomCSS = e.disableCustomCSS),
      (!0 !== e.open && "true" !== e.open) || (d.open = !0);
    var r = "";
    if ((Object.keys(d).length && (r = this.__serialize(d)), !window.matchMedia("screen and (max-width:600px)").matches || (!0 !== e.open && "true" !== e.open))) {
      console.log("Close");
      a = '<div id="bubble" style="position: fixed;bottom: 20px;right: 20px;width: 3.5rem;height: 3.5rem;">\n\n            <iframe style="height: 150px; border: none;" id="bubble-frame" src="'
        .concat(t, "/")
        .concat(e.roomId, "/bubble?")
        .concat(r, '" ></iframe>\n            </div>');
    } else {
      console.log("open");
      var a = '<div id="bubble" style="position: fixed;top:0; left:0; bottom:0; right:0; width: 3.5rem;height: 3.5rem; border:none; margin:0; padding:0; overflow:hidden; ">\n           \n            <iframe style="height: 150px; border: none;" id="bubble-frame" src="'
        .concat(t, "/")
        .concat(e.roomId, "/bubble?")
        .concat(r, '" ></iframe>\n            </div>');
    }
    (document.querySelector("#chat").innerHTML += a),
      window.addEventListener(
        "message",
        function (e) {
          "CHAT_OPEN" == e.data &&
            ((document.getElementById("bubble").style.width = i),
              (document.getElementById("bubble").style.height = o),
              (document.getElementById("bubble-frame").style.width = i),
              (document.getElementById("bubble-frame").style.height = o),
              window.matchMedia("screen and (max-width:600px)").matches && ((document.getElementById("bubble").style.top = "0"), (document.getElementById("bubble").style.right = "0"))),
            "CHAT_CLOSED" == e.data &&
            ((document.getElementById("bubble").style.width = "3.5rem"),
              (document.getElementById("bubble").style.height = "3.5rem"),
              (document.getElementById("bubble-frame").style.width = "60px"),
              (document.getElementById("bubble-frame").style.height = "150px"));
        },
        !1
      ),
      document.getElementById("bubble-frame").addEventListener("click", function () { });
  },
};
