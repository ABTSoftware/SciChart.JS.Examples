/**
 * @license Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-shiv-mq-teststyles-prefixes-load
 */
;



window.Modernizr = (function (window, document, undefined) {

    var version = '2.6.2',

    Modernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,


    injectElementWithStyles = function (rule, callback, nodes, testnames) {

        var style, ret, node, docOverflow,
            div = document.createElement('div'),
                  body = document.body,
                  fakeBody = body || document.createElement('body');

        if (parseInt(nodes, 10)) {
            while (nodes--) {
                node = document.createElement('div');
                node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
                div.appendChild(node);
            }
        }

        style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
        div.id = mod;
        (body ? div : fakeBody).innerHTML += style;
        fakeBody.appendChild(div);
        if (!body) {
            fakeBody.style.background = '';
            fakeBody.style.overflow = 'hidden';
            docOverflow = docElement.style.overflow;
            docElement.style.overflow = 'hidden';
            docElement.appendChild(fakeBody);
        }

        ret = callback(div, rule);
        if (!body) {
            fakeBody.parentNode.removeChild(fakeBody);
            docElement.style.overflow = docOverflow;
        } else {
            div.parentNode.removeChild(div);
        }

        return !!ret;

    },

    testMediaQuery = function (mq) {

        var matchMedia = window.matchMedia || window.msMatchMedia;
        if (matchMedia) {
            return matchMedia(mq).matches;
        }

        var bool;

        injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function (node) {
            bool = (window.getComputedStyle ?
                      getComputedStyle(node, null) :
                      node.currentStyle)['position'] == 'absolute';
        });

        return bool;

    },
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function (object, property) {
            return _hasOwnProperty.call(object, property);
        };
    }
    else {
        hasOwnProp = function (object, property) {
            return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
    }


    if (!Function.prototype.bind) {
        Function.prototype.bind = function bind(that) {

            var target = this;

            if (typeof target != "function") {
                throw new TypeError();
            }

            var args = slice.call(arguments, 1),
                bound = function () {

                    if (this instanceof bound) {

                        var F = function () { };
                        F.prototype = target.prototype;
                        var self = new F();

                        var result = target.apply(
                            self,
                            args.concat(slice.call(arguments))
                        );
                        if (Object(result) === result) {
                            return result;
                        }
                        return self;

                    } else {

                        return target.apply(
                            that,
                            args.concat(slice.call(arguments))
                        );

                    }

                };

            return bound;
        };
    }

    function setCss(str) {
        mStyle.cssText = str;
    }

    function setCssAll(str1, str2) {
        return setCss(prefixes.join(str1 + ';') + (str2 || ''));
    }

    function is(obj, type) {
        return typeof obj === type;
    }

    function contains(str, substr) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps(props, obj, elem) {
        for (var i in props) {
            var item = obj[props[i]];
            if (item !== undefined) {

                if (elem === false) return props[i];

                if (is(item, 'function')) {
                    return item.bind(elem || obj);
                }

                return item;
            }
        }
        return false;
    }
    tests['touch'] = function () {
        var bool;

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            bool = true;
        } else {
            injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function (node) {
                bool = node.offsetTop === 9;
            });
        }

        return bool;
    };
    for (var feature in tests) {
        if (hasOwnProp(tests, feature)) {
            featureName = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



    Modernizr.addTest = function (feature, test) {
        if (typeof feature == 'object') {
            for (var key in feature) {
                if (hasOwnProp(feature, key)) {
                    Modernizr.addTest(key, feature[key]);
                }
            }
        } else {

            feature = feature.toLowerCase();

            if (Modernizr[feature] !== undefined) {
                return Modernizr;
            }

            test = typeof test == 'function' ? test() : test;

            if (typeof enableClasses !== "undefined" && enableClasses) {
                docElement.className += ' ' + (test ? '' : 'no-') + feature;
            }
            Modernizr[feature] = test;

        }

        return Modernizr;
    };


    setCss('');
    modElem = inputElem = null;

    ; (function (window, document) {
        var options = window.html5 || {};

        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        var supportsHtml5Styles;

        var expando = '_html5shiv';

        var expanID = 0;

        var expandoData = {};

        var supportsUnknownElements;

        (function () {
            try {
                var a = document.createElement('a');
                a.innerHTML = '<xyz></xyz>';
                supportsHtml5Styles = ('hidden' in a);

                supportsUnknownElements = a.childNodes.length == 1 || (function () {
                    (document.createElement)('a');
                    var frag = document.createDocumentFragment();
                    return (
                      typeof frag.cloneNode == 'undefined' ||
                      typeof frag.createDocumentFragment == 'undefined' ||
                      typeof frag.createElement == 'undefined'
                    );
                }());
            } catch (e) {
                supportsHtml5Styles = true;
                supportsUnknownElements = true;
            }

        }()); function addStyleSheet(ownerDocument, cssText) {
            var p = ownerDocument.createElement('p'),
                parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

            p.innerHTML = 'x<style>' + cssText + '</style>';
            return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        function getElements() {
            var elements = html5.elements;
            return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        function getExpandoData(ownerDocument) {
            var data = expandoData[ownerDocument[expando]];
            if (!data) {
                data = {};
                expanID++;
                ownerDocument[expando] = expanID;
                expandoData[expanID] = data;
            }
            return data;
        }

        function createElement(nodeName, ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createElement(nodeName);
            }
            if (!data) {
                data = getExpandoData(ownerDocument);
            }
            var node;

            if (data.cache[nodeName]) {
                node = data.cache[nodeName].cloneNode();
            } else if (saveClones.test(nodeName)) {
                node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
            } else {
                node = data.createElem(nodeName);
            }

            return node.canHaveChildren && !reSkip.test(nodeName) ? data.frag.appendChild(node) : node;
        }

        function createDocumentFragment(ownerDocument, data) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            if (supportsUnknownElements) {
                return ownerDocument.createDocumentFragment();
            }
            data = data || getExpandoData(ownerDocument);
            var clone = data.frag.cloneNode(),
                i = 0,
                elems = getElements(),
                l = elems.length;
            for (; i < l; i++) {
                clone.createElement(elems[i]);
            }
            return clone;
        }

        function shivMethods(ownerDocument, data) {
            if (!data.cache) {
                data.cache = {};
                data.createElem = ownerDocument.createElement;
                data.createFrag = ownerDocument.createDocumentFragment;
                data.frag = data.createFrag();
            }


            ownerDocument.createElement = function (nodeName) {
                if (!html5.shivMethods) {
                    return data.createElem(nodeName);
                }
                return createElement(nodeName, ownerDocument, data);
            };

            ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
              'var n=f.cloneNode(),c=n.createElement;' +
              'h.shivMethods&&(' +
                        getElements().join().replace(/\w+/g, function (nodeName) {
                            data.createElem(nodeName);
                            data.frag.createElement(nodeName);
                            return 'c("' + nodeName + '")';
                        }) +
              ');return n}'
            )(html5, data.frag);
        } function shivDocument(ownerDocument) {
            if (!ownerDocument) {
                ownerDocument = document;
            }
            var data = getExpandoData(ownerDocument);

            if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
                data.hasCSS = !!addStyleSheet(ownerDocument,
                          'article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}' +
                          'mark{background:#FF0;color:#000}'
                );
            }
            if (!supportsUnknownElements) {
                shivMethods(ownerDocument, data);
            }
            return ownerDocument;
        } var html5 = {

            'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video',

            'shivCSS': (options.shivCSS !== false),

            'supportsUnknownElements': supportsUnknownElements,

            'shivMethods': (options.shivMethods !== false),

            'type': 'default',

            'shivDocument': shivDocument,

            createElement: createElement,

            createDocumentFragment: createDocumentFragment
        }; window.html5 = html5;

        shivDocument(document);

    }(this, document));

    Modernizr._version = version;

    Modernizr._prefixes = prefixes;

    Modernizr.mq = testMediaQuery;
    Modernizr.testStyles = injectElementWithStyles;
    return Modernizr;

})(this, this.document);

Modernizr.load = function () { yepnope.apply(window, [].slice.call(arguments, 0)); };
;