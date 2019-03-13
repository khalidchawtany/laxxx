"use strict";

//
// laxxx v0.0.1 (Alex Fox)
// Simple & light weight vanilla javascript plugin to create beautiful animations things when you scrolllll!!
//
// Licensed under the terms of the MIT license.
//
// You may use it in your theme if you credit me. 
// It is also free to use on any individual website.
//
// Exception:
// The only restriction is to not publish any  
// extension for browsers or native application
// without getting a written permission first.
//
var laxxx = {};
window.laxxx = laxxx;
var parallaxObjects = [];
var transforms = {
  "laxxx-opacity": function laxxxOpacity(style, v) {
    style.opacity = v;
  },
  "laxxx-translate": function laxxxTranslate(style, v) {
    style.transform += " translate(".concat(v, "px, ").concat(v, "px)");
  },
  "laxxx-translate-x": function laxxxTranslateX(style, v) {
    style.transform += " translateX(".concat(v, "px)");
  },
  "laxxx-translate-y": function laxxxTranslateY(style, v) {
    style.transform += " translateY(".concat(v, "px)");
  },
  "laxxx-scale": function laxxxScale(style, v) {
    style.transform += " scale(".concat(v);
  },
  "laxxx-scale-x": function laxxxScaleX(style, v) {
    style.transform += " scaleX(".concat(v, ")");
  },
  "laxxx-scale-y": function laxxxScaleY(style, v) {
    style.transform += " scaleY(".concat(v, ")");
  },
  "laxxx-skew": function laxxxSkew(style, v) {
    style.transform += " skew(".concat(v, "deg, ").concat(v, "deg");
  },
  "laxxx-skew-x": function laxxxSkewX(style, v) {
    style.transform += " skewX(".concat(v, "deg)");
  },
  "laxxx-skew-y": function laxxxSkewY(style, v) {
    style.transform += " skewY(".concat(v, "deg)");
  },
  "laxxx-rotate": function laxxxRotate(style, v) {
    style.transform += " rotate(".concat(v, "deg)");
  },
  "laxxx-brightness": function laxxxBrightness(style, v) {
    style.filter += " brightness(".concat(v, "%)");
  },
  "laxxx-contrast": function laxxxContrast(style, v) {
    style.filter += " contrast(".concat(v, "%)");
  },
  "laxxx-hue-rotate": function laxxxHueRotate(style, v) {
    style.filter += " hue-rotate(".concat(v, "deg)");
  },
  "laxxx-blur": function laxxxBlur(style, v) {
    style.filter += " blur(".concat(v, "px)");
  },
  "laxxx-invert": function laxxxInvert(style, v) {
    style.filter += "  invert(".concat(v, "%)");
  },
  "laxxx-saturate": function laxxxSaturate(style, v) {
    style.filter += "  saturate(".concat(v, "%)");
  },
  "laxxx-grayscale": function laxxxGrayscale(style, v) {
    style.filter += "  grayscale(".concat(v, "%)");
  }
};
var crazy = "";

for (var i = 0; i < 100; i++) {
  crazy += " " + -(window.innerHeight * ((100 - i) / 100)) + " " + Math.random() * 360;
}

laxxx.presets = {
  linger: {
    "laxxx-translate-y": "(-vh) -400, (-vh*0.8) -300, -300 -400"
  },
  lazy: {
    "laxxx-translate-y": "(-vh) 100, 0 -100"
  },
  eager: {
    "laxxx-translate-y": "(-vh) -100, 0 100"
  },
  slalom: {
    "laxxx-translate-x": "-vh 50, (-vh*0.8) -50, (-vh*0.6) 50, (-vh*0.4) -50, (-vh*0.2) 50, (-vh*0) -50, (vh*0.2) 50"
  },
  crazy: {
    "laxxx-hue-rotate": crazy
  },
  spin: {
    "laxxx-rotate": "(-vh) 0, (vh*0.1) 360"
  },
  spinIn: {
    "laxxx-rotate": "(-vh*2) 1000, (-vh*0.5) 0"
  },
  spinOut: {
    "laxxx-rotate": "(-vh*0.4) 0, (vh) 1000"
  },
  blurInOut: {
    "laxxx-blur": "(-vh*0.8) 40, (-vh*0.6) 0, (-vh*0.15) 0, (vh*0.1) 40"
  },
  blurIn: {
    "laxxx-blur": "(-vh*0.8) 40, (-vh*0.6) 0"
  },
  blurOut: {
    "laxxx-blur": "(-vh*0.3) 0, 0 40"
  },
  fadeInOut: {
    "laxxx-opacity": "(-vh*0.8) 0, (-vh*0.6) 1, (-vh*0.15) 1, (vh*0.1) 0"
  },
  fadeIn: {
    "laxxx-opacity": "(-vh*0.8) 0, (-vh*0.6) 1"
  },
  fadeOut: {
    "laxxx-opacity": "(-vh*0.3) 1, 0 0"
  },
  driftLeft: {
    "laxxx-translate-x": "(-vh*0.8) 100, (vh*0.1) -100"
  },
  driftRight: {
    "laxxx-translate-x": "(-vh*0.8) -100, (vh*0.1) 100"
  },
  slideLeft: {
    "laxxx-translate-x": "(-vh*0.8) 1000, (vh*0.1) -1000"
  },
  slideRight: {
    "laxxx-translate-x": "(-vh*0.8) -1000, (vh*0.1) 1000"
  },
  zoomInOut: {
    "laxxx-scale": "(-vh*0.8) 0.5, (-vh*0.6) 1, (-vh*0.15) 1, (vh*0.1) 0.5"
  },
  zoomIn: {
    "laxxx-scale": "(-vh*0.8) 0.5, (-vh*0.6) 1"
  },
  zoomOut: {
    "laxxx-scale": "(-vh*0.4) 1, 100 0.5"
  }
};

laxxx.addPreset = function (name, o) {
  laxxx.presets[name] = o;
};

function intrp(table, v) {
  var i = 0;

  while (table[i] !== undefined && table[i] <= v && table[i + 2] !== undefined) {
    i += 2;
  }

  var x2 = table[i];
  var x1 = table[i - 2] === undefined ? x2 : table[i - 2];
  var y2 = table[i + 1];
  var y1 = table[i - 1] === undefined ? y2 : table[i - 1];
  var xPoint = Math.min(Math.max((v - x1) / (x2 - x1), 0), 1);
  var yPoint = xPoint * (y2 - y1) + y1;
  return yPoint;
}

laxxx.setup = function (o) {
  laxxx.populateParallaxObjects();
};

laxxx.populateParallaxObjects = function () {
  var selector = Object.keys(transforms).map(function (t) {
    return "[".concat(t, "]");
  }).join(",");
  selector += ",[laxxx-preset]";
  document.querySelectorAll(selector).forEach(function (el) {
    var o = {
      el: el,
      transforms: []
    };
    var presetNames = el.attributes["laxxx-preset"] && el.attributes["laxxx-preset"].value;

    if (presetNames) {
      presetNames.split(" ").forEach(function (p) {
        var preset = laxxx.presets[p];

        for (var k in preset) {
          el.setAttribute(k, preset[k]);
        }
      });
      el.setAttribute("laxxx-anchor", "self");
      el.attributes.removeNamedItem("laxxx-preset");
    }

    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      var bits = a.name.split("-");

      if (bits[0] === "laxxx") {
        if (a.name === "laxxx-anchor") {
          o["laxxx-anchor"] = a.value === "self" ? el : document.querySelector(a.value);
        } else {
          o.transforms[a.name] = a.value.replace(",", " ").replace(/\s+/g, " ").trim().replace(new RegExp('vw', 'g'), window.innerWidth).replace(new RegExp('vh', 'g'), window.innerHeight).replace(new RegExp('elh', 'g'), el.clientHeight).replace(new RegExp('elw', 'g'), el.clientWidth).replace(new RegExp('-vw', 'g'), -window.innerWidth).replace(new RegExp('-vh', 'g'), -window.innerHeight).replace(new RegExp('-elh', 'g'), -el.clientHeight).replace(new RegExp('-elw', 'g'), -el.clientWidth).split(" ").map(function (x) {
            if (x[0] === "(") return eval(x);else return parseFloat(x);
          });
        }
      }
    }

    parallaxObjects.push(o);
  });
};

var lastScroll = 0;

laxxx.update = function (y) {
  var momentum = lastScroll - y;
  lastScroll = y; // console.log(momentum)

  parallaxObjects.forEach(function (o) {
    var transformString = "";
    var offsetTop = o["laxxx-anchor"] ? o["laxxx-anchor"].offsetTop : 0;
    var r = y - offsetTop;
    var style = {
      transform: "",
      filter: ""
    };

    for (var i in o.transforms) {
      var arr = o.transforms[i];
      var t = transforms[i];
      var v = intrp(arr, r);

      if (!t) {
        console.error("laxxx: " + i + " is not supported");
        return;
      }

      t(style, v);
    }

    for (k in style) {
      if (style.opacity === 0) {
        // if opacity 0 don't update
        o.el.style.opacity = 0;
      } else {
        o.el.style[k] = style[k];
      }
    }
  });
};