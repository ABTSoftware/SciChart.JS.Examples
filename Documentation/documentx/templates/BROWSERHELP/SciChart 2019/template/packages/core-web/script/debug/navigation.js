var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* eslint @typescript-eslint/no-unused-vars: "off" */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var browserInfoConstants = {
            minHeightChange: 10,
            ie7Version: 7
        };
        var BrowserInfo = /** @class */ (function () {
            function BrowserInfo() {
                var ua = BrowserInfo.getUserAgent().toLowerCase();
                var match = /(chrome)[ /]([\w.]+)/.exec(ua) ||
                    /(webkit)[ /]([\w.]+)/.exec(ua) ||
                    /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
                    /(msie) ([\w.]+)/.exec(ua) ||
                    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                    [];
                this.name = match[1] || "";
                var versionIndex = 2;
                this.version = parseInt(match[versionIndex] || "0", 10);
            }
            /**
             * Returns the current user agent string
             */
            BrowserInfo.getUserAgent = function () {
                return navigator.userAgent;
            };
            return BrowserInfo;
        }());
        Content.BrowserInfo = BrowserInfo;
        var Browser = /** @class */ (function () {
            function Browser() {
            }
            /**
             * Return Microsoft Internet Explorer (major) version number, or 0 for others.
             */
            Browser.msIeVersion = function () {
                if (Browser.info.name === "msie") {
                    // is Microsoft Internet Explorer; return version number
                    return Browser.info.version;
                }
                else {
                    return 0; // is other browser
                }
            };
            /**
             * Get a document instance from a given page element.
             */
            Browser.getDocumentInstance = function (element) {
                var elementSelector;
                if (!(element instanceof jQuery)) {
                    elementSelector = $(element);
                }
                else {
                    elementSelector = element;
                }
                // Find the container element
                var root = elementSelector.hasClass("content-root") ? elementSelector : elementSelector.parents(".content-root");
                if (root.length === 0) {
                    root = $("body");
                }
                else {
                    root = $(root.get(0));
                }
                // Now we have the root, check for a document object
                if (root.data("innovasys-document") != null) {
                    return root.data("innovasys-document");
                }
                else {
                    // No existing document, create a new one
                    var newDocument = new Content.Document(root.get(0));
                    root.data("innovasys-document", newDocument);
                    return newDocument;
                }
            };
            /**
             * Returns basic information about the current browser location.
             */
            Browser.getLocationInfo = function () {
                return location;
            };
            /**
             * Return the current document compatMode value.
             */
            Browser.getCompatMode = function () {
                return document.compatMode;
            };
            /**
             * Reload the current page.
             */
            Browser.reload = function () {
                location.reload();
            };
            /**
             * Replace the current location.
             */
            Browser.replaceLocation = function (newLocation) {
                if (window.history.replaceState) {
                    try {
                        window.history.replaceState("", "", "#" + newLocation);
                    }
                    catch (ex) {
                        // May fail with security exception on local file system
                    }
                }
                else {
                    window.location.replace("#" + newLocation);
                }
            };
            /**
             * Navigate to a new url.
             * @param url The url to navigate to.
             * @param replace Pass true in order to replace the current entry in the browser history.
             */
            Browser.navigateTo = function (url, replace) {
                if (replace) {
                    window.location.replace(url);
                }
                else {
                    window.location.href = url;
                }
            };
            /**
             * Cross browser helper for stopping event propagation.
             */
            Browser.stopPropagation = function (e) {
                if (e.stopPropagation) {
                    e.stopPropagation();
                }
                else {
                    e.returnValue = false;
                }
            };
            /**
             * Loads a stylesheet from the specified Url.
             */
            Browser.loadStylesheet = function (stylesheetUrl, stylesheetId, beforeElementId, onLoaded) {
                if (onLoaded === void 0) { onLoaded = null; }
                var id = "file" + this.dynamicallyLoadedFileIndex;
                this.dynamicallyLoadedFileIndex++;
                var attributes = { "data-stylesheet-id": stylesheetId };
                yepnope.injectCss({ href: stylesheetUrl, attrs: attributes }, function () {
                    onLoaded(id);
                });
                return id;
            };
            /**
             * Loads a script file from the specified Url.
             */
            Browser.loadScript = function (scriptUrl, scriptId, beforeElementId, onLoaded) {
                if (onLoaded === void 0) { onLoaded = null; }
                var id = "file" + this.dynamicallyLoadedFileIndex;
                this.dynamicallyLoadedFileIndex++;
                var attributes = { "data-script-id": scriptId };
                yepnope.injectJs({ src: scriptUrl, attrs: attributes }, function () {
                    onLoaded(id);
                });
                return id;
            };
            Browser.resizeIFrames = function (selector, ignoreOffScreen) {
                if (ignoreOffScreen === void 0) { ignoreOffScreen = false; }
                var maxHeight = 0;
                var minAllowedHeight;
                try {
                    minAllowedHeight = $(window.top).height();
                }
                catch (ex) {
                    minAllowedHeight = $(window).height();
                }
                $("iframe", selector).each(function (index, element) {
                    var currentHeight = 0;
                    if ($(element).is(":visible") && (ignoreOffScreen || $(element).offset().left >= 0)) {
                        // Only resize if visible
                        var doc = null;
                        try {
                            doc = element.contentDocument
                                ? element.contentDocument
                                : (element.contentWindow.document || element.document);
                        }
                        catch (exDocument) {
                            // Security may prevent access if frame hasn't loaded or is cross origin
                        }
                        if (doc != null) {
                            // Firefox throws an error here, so we trap and fallback
                            try {
                                currentHeight = $(doc).height();
                            }
                            catch (exHeight) {
                                currentHeight = minAllowedHeight;
                            }
                        }
                        else {
                            currentHeight = minAllowedHeight;
                        }
                        var lastHeight = $(element).data("last-height");
                        if (!lastHeight) {
                            lastHeight = 0;
                        }
                        var heightDifference = currentHeight - lastHeight;
                        if (heightDifference > browserInfoConstants.minHeightChange
                            || (heightDifference < 0 && heightDifference < browserInfoConstants.minHeightChange)) {
                            var parent_1 = $(element).parent();
                            if (parent_1.get(0).tagName === "DIV" && currentHeight < parent_1.height()) {
                                // Resize to at least the containing DIV height
                                currentHeight = parent_1.height();
                            }
                            if (currentHeight < minAllowedHeight) {
                                // Make sure at least as high as the window
                                currentHeight = minAllowedHeight;
                            }
                            $(element).height(currentHeight + "px");
                            $(element).data("last-height", currentHeight);
                        }
                    }
                    else if (!$(element).is(":visible")) {
                        // Not visible, collapse to zero
                        $(element).height(0);
                        $(element).data("last-height", 0);
                    }
                    if (currentHeight > maxHeight) {
                        // Record the maximum iframe height
                        maxHeight = currentHeight;
                    }
                });
                var busy = $("#i-busy");
                if (busy.length !== 0) {
                    busy.height(maxHeight);
                }
                return maxHeight;
            };
            Browser.showElement = function (query, tagName) {
                // Firefox does not remove a display: none on show so we check for that specifically here
                query.show();
                if (tagName === "body") {
                    $("body").css("display", "block");
                }
            };
            /**
             * Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
             */
            Browser.checkForIe7ModeJqueryBug = function () {
                if (Browser.info.name === "msie" && Browser.info.version <= browserInfoConstants.ie7Version) {
                    var mshvAttributeSetWorkaround = {
                        set: function (elem, value, name) {
                            elem.setAttribute(name, value);
                            return elem.getAttributeNode(name);
                        }
                    };
                    if ($ != null && $.attrHooks != null) {
                        var attributeHooks = $.attrHooks;
                        attributeHooks["aria-describedby"] = mshvAttributeSetWorkaround;
                        attributeHooks["aria-live"] = mshvAttributeSetWorkaround;
                        attributeHooks["aria-atomic"] = mshvAttributeSetWorkaround;
                        attributeHooks["aria-hidden"] = mshvAttributeSetWorkaround;
                    }
                }
            };
            Browser.getQueryStringParameter = function (name) {
                name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
                var results = regex.exec(Browser.getLocationInfo().search);
                return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
            };
            Browser.isCompiledHelp = function () {
                var currentHref = Browser.getLocationInfo().href + ".";
                var currentProtocol = Browser.getLocationInfo().protocol;
                if (currentHref.indexOf("mk:@MSITStore") === 0) {
                    return true;
                }
                else if (currentHref.indexOf("ms-its:") === 0) {
                    return true;
                }
                else if (currentProtocol === "ms-help:") {
                    return true;
                }
                else if (currentProtocol === "ms-xhelp:" ||
                    currentHref.indexOf("ms.help?") !== -1 ||
                    currentHref.indexOf("?method=page&") !== -1) {
                    return true;
                }
                return false;
            };
            Browser.isEditor = function () {
                return location.protocol === "about:";
            };
            /**
             * Returns a unique id, randomnly generated and checked for uniqueness in the DOM
             */
            Browser.getUniqueId = function () {
                var idlength = 10;
                var getId = function () {
                    var idValue = "";
                    for (var i = 0; i < idlength; i++) {
                        idValue += Browser._idCharacters[Math.floor(Math.random() * Browser._idCharacters.length)];
                    }
                    return idValue;
                };
                var id = getId();
                while ($("#" + id).length > 0) {
                    id = getId();
                }
                return id;
            };
            /**
             * Returns common feature settings
             */
            Browser.getCommonSettings = function () {
                return (Innovasys.overrides || Innovasys.settings) || {};
            };
            /**
             * Compares 2 version strings and returns an integer indicating the result. < 0 if a < b, > 0 if a > b, 0 if a = b
             */
            Browser.compareVersionStrings = function (a, b) {
                var regExStrip0 = /(\.0+)+$/;
                var segmentsA = a.replace(regExStrip0, "").split(".");
                var segmentsB = b.replace(regExStrip0, "").split(".");
                var l = Math.min(segmentsA.length, segmentsB.length);
                for (var i = 0; i < l; i++) {
                    var diff = parseInt(segmentsA[i], 10) - parseInt(segmentsB[i], 10);
                    if (diff) {
                        return diff;
                    }
                }
                return segmentsA.length - segmentsB.length;
            };
            /**
             * Creates or returns a <style> element to contain custom style markup
             */
            Browser.getDynamicStyleContainer = function (id) {
                var $dynamicStyleElement = $("#" + id);
                if ($dynamicStyleElement.length === 0) {
                    $dynamicStyleElement = $("<style type=\"text/css\" id=\"" + id + "\"></style>");
                    $("head").append($dynamicStyleElement);
                }
                return $dynamicStyleElement;
            };
            Browser.isElementInView = function (element, fullyInView) {
                if (element == null) {
                    return false;
                }
                if (!$(element).is(":visible")) {
                    return false;
                }
                var pageTop = $(window).scrollTop();
                var pageBottom = pageTop + $(window).height();
                var elementTop = $(element).offset().top;
                var elementBottom = elementTop + $(element).height();
                if (fullyInView) {
                    return ((pageTop < elementTop) && (pageBottom > elementBottom));
                }
                else {
                    return ((elementTop <= pageBottom) && (elementBottom >= pageTop));
                }
            };
            /** Indicates that we are running in a design time environment (i.e. the editor) */
            Browser.isDesignTime = false;
            /** Indicates that animations should be disabled */
            Browser.isAnimationDisabled = false;
            /** Provides access to more information about the browser agent etc. */
            Browser.info = new BrowserInfo();
            /** Index for dynamically loaded stylesheets */
            Browser.dynamicallyLoadedFileIndex = 0;
            Browser._idCharacters = "_0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".split("");
            return Browser;
        }());
        Content.Browser = Browser;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint @typescript-eslint/no-explicit-any: "off" */
var overrides = (Innovasys.overrides || Innovasys.settings);
if (document.compatMode !== "BackCompat"
    || !(location.protocol === "ms-xhelp:"
        || location.href.indexOf("ms.help?") !== -1
        || location.href.indexOf("?method=page&") !== -1)) {
    if (overrides == null || !overrides.isHideBodyDuringLoadDisabled) {
        // Prevent flickering by setting body to display:none during initialization
        document.write("<style type=\"text/css\">body{display:none;}</style>");
    }
    else if (overrides.isOverflowClippedDuringLoad) {
        // Prevent adding of a vertical scrollbar during load
        document.write("<style type=\"text/css\">body{overflow-y:hidden;}</style>");
    }
}
/* eslint @typescript-eslint/no-unused-vars: "off" */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * Encapsulates a left and top position.
         */
        var ElementPosition = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ElementPosition(left, top) {
                this.left = left;
                this.top = top;
            }
            return ElementPosition;
        }());
        Content.ElementPosition = ElementPosition;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var DomHelpers = /** @class */ (function () {
            function DomHelpers() {
            }
            /**
             * Returns an elements absolute position, allowing for the non-scrolling header
             * @param element The element to find the absolute position of
             */
            DomHelpers.getElementPosition = function (element) {
                var offsetLeft = 0;
                var offsetTop = 0;
                while (element) {
                    var MSIE_4_VERSION = 4;
                    // Allow for the scrolling body region in IE
                    if (Content.Browser.msIeVersion() > MSIE_4_VERSION) {
                        offsetLeft += (element.offsetLeft - element.scrollLeft);
                        offsetTop += (element.offsetTop - element.scrollTop);
                    }
                    else {
                        offsetLeft += element.offsetLeft;
                        offsetTop += element.offsetTop;
                    }
                    element = element.offsetParent;
                }
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                var leftMargin = document.body.leftMargin;
                if (Content.BrowserInfo.getUserAgent().indexOf("Mac") !== -1
                    && typeof leftMargin !== "undefined") {
                    offsetLeft += leftMargin;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    offsetTop += document.body.topMargin;
                }
                return new Content.ElementPosition(offsetLeft, offsetTop);
            };
            /**
             * Returns the text from the containing table. Uses this as the context element from which to find the containing table.
             */
            DomHelpers.getTextFromContainingTable = function (element) {
                var parentTableQuery = $(element)
                    .parents("table")
                    .get(0);
                var parentTable = $(parentTableQuery);
                var tableCell = parentTable.find("td").get(0);
                if (tableCell != null) {
                    if (tableCell.textContent != null) {
                        return tableCell.textContent;
                    }
                    else if (tableCell.innerText != null) {
                        return tableCell.innerText;
                    }
                    else {
                        return $(tableCell).text();
                    }
                }
            };
            return DomHelpers;
        }());
        Content.DomHelpers = DomHelpers;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* .NET Framework Help Topic Resolution */
var getCurrentHelp2Namespace = function () {
    var namespace = "";
    var location = Innovasys.Content.Browser.getLocationInfo();
    if (location.protocol === "ms-help:") {
        namespace = location.hostname;
        var URL_PREFIX_LENGTH = 2;
        if (namespace.substring(0, URL_PREFIX_LENGTH) === "//") {
            namespace = namespace.substring(URL_PREFIX_LENGTH);
        }
    }
    return namespace;
};
var findHelp2Keyword = function (namespaceName, keyword) {
    if (namespaceName.length > 0) {
        try {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            var session = new ActiveXObject("HxDs.HxSession");
            session.Initialize("ms-help://" + namespaceName, 0);
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            var topics = session.Query(keyword, "!DefaultAssociativeIndex", 0, "");
            if (topics.Count > 0) {
                return topics(1).URL;
            }
        }
        catch (e) {
            //
        }
    }
    return "";
};
// This function is Copyright 2006 Innovasys Limited. No reproduction or usage
//  allowed other than in documentation generated by licensed Innovasys products
var resolveHelp2Keyword = function (keyword, onlineKeyword) {
    var url = "";
    try {
        // Try the current namespace
        url = findHelp2Keyword(getCurrentHelp2Namespace(), keyword);
        if (url === "") {
            // Try the likely namespaces first, most recent first
            url = findHelp2Keyword("MS.VSCC.v80", keyword);
            if (url === "") {
                url = findHelp2Keyword("MS.VSCC.2003", keyword);
                if (url === "") {
                    url = findHelp2Keyword("MS.VSCC", keyword);
                }
            }
        }
        // URL found in one of the known VSCC namespaces
        if (url !== "") {
            return url;
        }
        else {
            // For future proofing, try other VSCC namespaces
            var registryWalker = new ActiveXObject("HxDs.HxRegistryWalker");
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            var namespaces = registryWalker.RegisteredNamespaceList("MS.VSCC");
            if (namespaces.Count > 0) {
                for (var n = 1; n <= namespaces.Count; n++) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var namespace = namespaces.Item(n);
                    var namespaceName = namespace.Name;
                    var PREFIX_LENGTH = 7;
                    if (namespaceName.substring(0, PREFIX_LENGTH) === "MS.VSCC") {
                        switch (namespaceName) {
                            case "MS.VSCC.v80":
                                break;
                            case "MS.VSCC.2003":
                                break;
                            case "MS.VSCC":
                                break;
                            default:
                                url = findHelp2Keyword(namespaceName, "");
                                if (url !== "") {
                                    return url;
                                }
                        }
                    }
                }
            }
        }
    }
    catch (e) {
        //
    }
    // No match found in any applicable namespace
    // Msdn doesn't support links to individual overloads, only to the master page
    //  so we trim off the brackets when directing to Msdn
    var bracketPosition = onlineKeyword.indexOf("(");
    if (bracketPosition !== -1) {
        onlineKeyword = onlineKeyword.substring(0, bracketPosition);
    }
    var keywordForUrl = onlineKeyword.replace("`", "-").toLowerCase();
    return "https://docs.microsoft.com/dotnet/api/" + keywordForUrl;
};
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var navigateToHelp2Keyword = function (keyword, onlineKeyword, replacePage) {
    window.status = "Resolving link. Please wait a moment...";
    var url = resolveHelp2Keyword(keyword, onlineKeyword);
    window.status = "";
    var MSDN_PREFIX_LENGTH = 25;
    var DOCS_PREFIX_LENGTH = 26;
    if ((url.substring(0, MSDN_PREFIX_LENGTH) === "http://msdn.microsoft.com"
        || url.substring(0, DOCS_PREFIX_LENGTH) === "https://docs.microsoft.com") &&
        window.parent != null) {
        // MSDN no longer support hosting in an IFRAME so open in new browser window
        window.open(url, "_blank");
    }
    else if (replacePage) {
        location.replace(url);
    }
    else {
        location.href = url;
    }
};
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * Wrapper for handling load/save to localstorage. Handles the difference in functionality when executing at design time
         *  and in a CHM.
         */
        var LocalStorageHandler = /** @class */ (function () {
            function LocalStorageHandler(attributePrefix) {
                if (attributePrefix === void 0) { attributePrefix = ""; }
                this.attributePrefix = attributePrefix;
                this.storageMethod = "native";
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                this.cookieData = null;
                this.storageElement = null;
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                var windowLocalStorage;
                try {
                    // Edge throws an exception when querying localStorage in local file system output
                    windowLocalStorage = window.localStorage;
                }
                catch (e) {
                    //
                }
                if (!windowLocalStorage) {
                    if (location.protocol === "ms-its:") {
                        // Cookies don't work in CHM so we use userdata behavior instead
                        this.storageMethod = "userdata";
                        var storageElement = $("<link />");
                        storageElement.css("behavior", "url(#default#userdata)");
                        storageElement.appendTo("body");
                        this.storageElement = storageElement.get(0);
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        this.storageElement.load("localStorage");
                    }
                    else {
                        // If local storage isn't available, fall back to cookie storage
                        this.storageMethod = "cookie";
                        var cookieValue = Cookies.get("localStorage");
                        if (cookieValue) {
                            this.cookieData = JSON.parse(cookieValue);
                        }
                        else {
                            this.cookieData = {};
                        }
                    }
                }
            }
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            LocalStorageHandler.prototype.load = function (name) {
                // local storage automatically saves
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            LocalStorageHandler.prototype.save = function (name) {
                // local storage automatically saves
            };
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            LocalStorageHandler.prototype.setAttribute = function (key, value) {
                if (this.attributePrefix != null) {
                    key = this.attributePrefix + key;
                }
                if (this.storageMethod === "native") {
                    if (value == null || typeof value === "undefined") {
                        window.localStorage.removeItem(key);
                    }
                    else {
                        window.localStorage.setItem(key, value);
                    }
                }
                else if (this.storageMethod === "cookie") {
                    if (value == null) {
                        this.cookieData[key] = null;
                    }
                    else {
                        this.cookieData[key] = "" + value;
                    }
                    Cookies.set("localStorage", JSON.stringify(this.cookieData), { expires: 365, path: "/", domain: "" });
                }
                else if (this.storageMethod === "userdata") {
                    this.storageElement.setAttribute(key, "" + value);
                    // Save method is added by the userdata behavior
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    this.storageElement.save("localStorage");
                }
            };
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            LocalStorageHandler.prototype.getAttribute = function (key) {
                if (this.attributePrefix != null) {
                    key = this.attributePrefix + key;
                }
                if (this.storageMethod === "native") {
                    return window.localStorage.getItem(key);
                }
                else if (this.storageMethod === "cookie") {
                    if (typeof this.cookieData[key] === "undefined") {
                        return null;
                    }
                    else {
                        return this.cookieData[key];
                    }
                }
                else if (this.storageMethod === "userdata") {
                    return this.storageElement.getAttribute(key);
                }
            };
            return LocalStorageHandler;
        }());
        Content.LocalStorageHandler = LocalStorageHandler;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        /**
         * A message object, used for cross frame communication.
         */
        var WindowMessage = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function WindowMessage(messageType, messageData) {
                this.messageType = messageType;
                this.messageData = messageData;
            }
            return WindowMessage;
        }());
        Content.WindowMessage = WindowMessage;
        /**
         * Cross frame messaging utility functionality.
         */
        var Messaging = /** @class */ (function () {
            function Messaging() {
            }
            /**
             * Returns true if PostMessage support is available in the current browser.
             */
            Messaging.isPostMessageEnabled = function () {
                return (window.postMessage != null);
            };
            /**
             * Registers to receive message events incoming to the current window.
             * @param receiver The receiving event handler.
             */
            Messaging.addMessageListener = function (receiver) {
                if (Messaging.isPostMessageEnabled()) {
                    if (window.addEventListener) {
                        window.addEventListener("message", receiver, false);
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        window.attachEvent("onmessage", receiver);
                    }
                }
            };
            /**
             * Removes a previous registered window event listener
             * @param receiver The receiving event handler.
             */
            Messaging.removeMessageListener = function (receiver) {
                if (Messaging.isPostMessageEnabled()) {
                    if (window.addEventListener) {
                        window.removeEventListener("message", receiver, false);
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        window.detachEvent("onmessage", receiver);
                    }
                }
            };
            /**
             * Gets a WindowMessage object from string message data.
             * @param data The string containing the message data (format MessageType|MessageData).
             */
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            Messaging.getMessageFromData = function (data) {
                var separator = data.indexOf("|");
                var messageType;
                var messageData;
                if (separator !== -1) {
                    messageType = data.substring(0, separator);
                    messageData = data.substring(separator + 1);
                }
                else {
                    messageType = data;
                    messageData = "";
                }
                return new WindowMessage(messageType, messageData);
            };
            Messaging.routeMessageToFrameElement = function (windowName, messageType, messageData) {
                var element = document.getElementById(windowName);
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                if (element != null && element.contentWindow != null) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    Messaging.routeMessageToWindow(element.contentWindow, messageType, messageData);
                }
            };
            Messaging.routeMessageToWindow = function (window, messageType, messageData) {
                if (window != null && self !== window) {
                    if (window != null && window.postMessage != null) {
                        window.postMessage(messageType + "|" + messageData, "*");
                    }
                }
            };
            Messaging.routeMessageToParentFrame = function (messageType, messageData) {
                if (parent != null && self !== parent) {
                    this.routeMessageToWindow(parent, messageType, messageData);
                }
            };
            return Messaging;
        }());
        Content.Messaging = Messaging;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var ResponsiveClickTargetKind;
        (function (ResponsiveClickTargetKind) {
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["auto"] = 0] = "auto";
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["inline"] = 1] = "inline";
            ResponsiveClickTargetKind[ResponsiveClickTargetKind["block"] = 2] = "block";
        })(ResponsiveClickTargetKind = Content.ResponsiveClickTargetKind || (Content.ResponsiveClickTargetKind = {}));
        var DocumentFeatureBase = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function DocumentFeatureBase(documentInstance) {
                if (documentInstance === void 0) { documentInstance = null; }
                this.documentInstance = documentInstance;
            }
            DocumentFeatureBase.prototype.initializeDocument = function () {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.onMessage = function (message) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.ensureElementVisible = function (element) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.beforeSetElementVisibility = function (element, isVisible, isImmediate) {
                return false;
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.afterSetElementVisibility = function (element, isVisible) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.populateResponsiveConfiguration = function (configuration) {
                //
            };
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            DocumentFeatureBase.prototype.applyResponsiveConfiguration = function (configuration) {
                //
            };
            /**
             * Returns a number used to determine the order of content initialization amongst document features.
             */
            DocumentFeatureBase.prototype.initializeContentOrdinal = function () {
                return 0;
            };
            return DocumentFeatureBase;
        }());
        Content.DocumentFeatureBase = DocumentFeatureBase;
        var DocumentFeatureConfiguration = /** @class */ (function () {
            function DocumentFeatureConfiguration() {
            }
            DocumentFeatureConfiguration.registerDocumentFeatureFactory = function (factory) {
                DocumentFeatureConfiguration._featureFactories.push(factory);
            };
            DocumentFeatureConfiguration.getFeatureFactories = function () {
                return DocumentFeatureConfiguration._featureFactories;
            };
            // TODO: Would be useful to key this array so that a feature factory can override a default implementation
            DocumentFeatureConfiguration._featureFactories = [];
            return DocumentFeatureConfiguration;
        }());
        Content.DocumentFeatureConfiguration = DocumentFeatureConfiguration;
        var ResponsiveConfiguration = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ResponsiveConfiguration(profileName, clickTargets) {
                if (clickTargets === void 0) { clickTargets = []; }
                this.profileName = profileName;
                this.clickTargets = clickTargets;
                this.stylesheetUrls = [];
                this.tablesToPivot = [];
            }
            return ResponsiveConfiguration;
        }());
        Content.ResponsiveConfiguration = ResponsiveConfiguration;
        var ResponsiveClickTarget = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ResponsiveClickTarget(className, kind) {
                this.className = className;
                this.kind = kind;
            }
            return ResponsiveClickTarget;
        }());
        Content.ResponsiveClickTarget = ResponsiveClickTarget;
        var ResponsiveTable = /** @class */ (function () {
            /* eslint-disable-next-line no-useless-constructor */
            function ResponsiveTable(selector, onAfterPivot) {
                if (onAfterPivot === void 0) { onAfterPivot = null; }
                this.selector = selector;
                this.onAfterPivot = onAfterPivot;
            }
            return ResponsiveTable;
        }());
        Content.ResponsiveTable = ResponsiveTable;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* Userdata support in CHMs requires pages are loaded under the ms-its protocol and not mk:@MSITStore */
var currentLocation = location.href + ".";
var mkPrefix = "mk:@MSITStore";
if (currentLocation.indexOf(mkPrefix) === 0) {
    var restOfUrl = currentLocation.substring(mkPrefix.length + 1, currentLocation.length - 1);
    var newLocation = "ms-its:" + restOfUrl;
    location.replace(newLocation);
}
/* eslint @typescript-eslint/no-unused-vars: "off" */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Document = /** @class */ (function () {
            function Document(rootElement, id) {
                var _this = this;
                if (id === void 0) { id = ""; }
                /** Indicates if this document instance has been unloaded */
                this._isUnloaded = true;
                /** Provides an id that can be used to disambiguate this document if it is loaded in a parent document */
                this.id = "";
                this.id = id;
                this.rootElement = rootElement;
                this.rootSelector = $(rootElement);
                this._featureSettings = {};
                this.setBodyVisibleAfterLoadComplete = true;
                this.isNew = false;
                this.isResponsiveEnabled = false;
                this.isContentDocument = true;
                this.rootSelector.data("innovasys-document", this);
                // Create the features instances according to configuration. Some factories may return null if the feature
                //  is not required for this document.
                this._features = $.map(Content.DocumentFeatureConfiguration.getFeatureFactories(), function (factory) { return factory.createInstance(_this); });
                // Initialize the features.
                $.each(this._features, function (index, feature) {
                    feature.initializeDocument();
                });
                if (Content.Browser.isDesignTime) {
                    $("body").addClass("i-designtime");
                }
                if (Content.Browser.isEditor()) {
                    $("body").addClass("i-editor");
                }
            }
            /**
             * Get a local storage instance, initializing the first time it is called.
             */
            Document.prototype.getLocalStorage = function () {
                if (Content.Browser.isDesignTime) {
                    try {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        if (window.external.IsInnovasysDesigner) {
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            this._localStorageInstance = window.external;
                        }
                    }
                    catch (e) {
                        //
                    }
                }
                if (!this._localStorageInstance) {
                    this._localStorageInstance = new Content.LocalStorageHandler(this.id);
                }
                return this._localStorageInstance;
            };
            /**
             * Called once the DOM has loaded. Performs content initialization.
             */
            Document.prototype.load = function () {
                var _this = this;
                var overrides = Content.Browser.getCommonSettings();
                if (overrides.isNew) {
                    this.isNew = true;
                }
                // If running in a frame, set up a message listener and let
                //  the parent frame know we have loaded
                if (this.id === "") {
                    // Running in a frame - listen for commands
                    if (Content.Messaging.isPostMessageEnabled()) {
                        this._windowMessageEventListener = function (ev) { return _this.receiveMessage(ev); };
                        Content.Messaging.addMessageListener(this._windowMessageEventListener);
                        if (this.isContentDocument) {
                            // Notify the parent frame that we have loaded, and give it our page title
                            Content.Messaging.routeMessageToParentFrame("loaded", location.href);
                            Content.Messaging.routeMessageToParentFrame("updatePageTitle", document.title);
                        }
                    }
                }
                // Add a class to the body that indicates that kind of navigation we are using
                if (overrides.navigationKind !== "inpage") {
                    $("body").addClass("i-navigation-frames");
                }
                else {
                    $("body").addClass("i-navigation-inpage");
                }
                // Configure our document content for each of the features
                this.initializeContent(this.rootSelector, true);
                if (this.id === "" && this.setBodyVisibleAfterLoadComplete) {
                    // Resume rendering updates after loading complete
                    this.setBodyVisible();
                }
            };
            Document.prototype.setBodyVisible = function () {
                $("html").addClass("i-loaded");
                Content.Browser.showElement($("body"), "body");
                setTimeout(function () {
                    if (Content.Browser.getCommonSettings().isOverflowClippedDuringLoad) {
                        $("body").css("overflow-y", "auto");
                    }
                    $(".i-busy-overlay").hide();
                }, 1);
            };
            Document.prototype.unload = function () {
                if (this.id === "") {
                    // Running in a frame - remove message listener
                    if (Content.Messaging.isPostMessageEnabled() && this._windowMessageEventListener != null) {
                        Content.Messaging.removeMessageListener(this._windowMessageEventListener);
                    }
                }
                this._isUnloaded = true;
            };
            /**
             * Initializes new DOM content, either on page load or subsequently when new content is created.
             */
            Document.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                if (isInitialLoad === void 0) { isInitialLoad = false; }
                $.each(this._features.sort(function (a, b) { return a.initializeContentOrdinal() - b.initializeContentOrdinal(); }), function (_, feature) {
                    feature.initializeContent(rootSelector, isInitialLoad);
                });
            };
            /**
             * Creates, populates and returns a responsive configuration instance.
             */
            Document.prototype.getResponsiveConfiguration = function (profileName) {
                var configuration = new Content.ResponsiveConfiguration(profileName);
                $.each(this._features, function (index, feature) {
                    feature.populateResponsiveConfiguration(configuration);
                });
                return configuration;
            };
            /**
             * Applies a responsive configuration.
             */
            Document.prototype.applyResponsiveConfiguration = function (responsiveConfiguration) {
                $.each(this._features, function (index, feature) {
                    feature.applyResponsiveConfiguration(responsiveConfiguration);
                });
            };
            /**
             * Cross frame message processor.
             * @param event The message event containing message data.
             */
            Document.prototype.receiveMessage = function (event) {
                var message;
                try {
                    message = Content.Messaging.getMessageFromData(event.data);
                }
                catch (ex) {
                    // Catch exceptions that can fire at design time
                }
                this.processWindowMessage(message);
            };
            /**
             * Process the passed message.
             */
            Document.prototype.processWindowMessage = function (message) {
                if (message) {
                    switch (message.messageType) {
                        case "refresh":
                            document.location.reload();
                            break;
                        default:
                            if (this._features != null) {
                                $.each(this._features, function (index, feature) {
                                    feature.onMessage(message);
                                });
                            }
                    }
                }
            };
            /**
             * Ensures that the passed element is visible. Calls document features to apply
             *  any necessary logic (e.g. where the element is within a collapsed section or tab)
             */
            Document.prototype.ensureElementVisible = function (element) {
                $.each(this._features, function (index, feature) {
                    feature.ensureElementVisible(element);
                });
            };
            /**
             * Toggle the state of an element or elements.
             * @param elements JQuery selector representing Element(s) to toggle state for.
             * @param isImmediate When set to true, animations are disabled.
             * @param isVisible Indicates if the element(s) should be made visible or not.
             */
            Document.prototype.setElementVisibility = function (elements, isVisible, isImmediate) {
                var _this = this;
                return elements.each(function (index, element) {
                    var cancelDefault = false;
                    // Allow features to add custom behavior and/or prevent default
                    $.each(_this._features, function (_, feature) {
                        if (!cancelDefault) {
                            if (feature.beforeSetElementVisibility(element, isVisible, isImmediate) === true) {
                                cancelDefault = true;
                            }
                        }
                    });
                    if (!cancelDefault) {
                        if ($(element).css("display") !== "none" !== isVisible) {
                            if ($(element).css("display") === "none") {
                                if (isImmediate || Content.Browser.isAnimationDisabled) {
                                    // Element is currently not visible - make it visible
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    var originalDisplay = $(element).data("i-original-display");
                                    if (originalDisplay != null) {
                                        $(element).css("display", originalDisplay);
                                        $(element).data("i-original-display", null);
                                    }
                                    else {
                                        if (element.tagName === "TR") {
                                            $(element).css("display", "table-row");
                                        }
                                        else {
                                            $(element).css("display", "block");
                                        }
                                    }
                                }
                                else {
                                    $(element).slideDown("fast");
                                }
                            }
                            else {
                                // Element is currently visible, hide
                                $(element).data("i-original-display", $(element).css("display"));
                                if (isImmediate || Content.Browser.isAnimationDisabled) {
                                    $(element).hide();
                                }
                                else {
                                    $(element).slideUp("fast");
                                }
                            }
                        }
                        $.each(_this._features, function (_, feature) {
                            feature.afterSetElementVisibility(element, isVisible);
                        });
                    }
                });
            };
            /**
             * Returns a feature matching the passed name
             */
            Document.prototype.getFeatureByName = function (name) {
                if (name == null) {
                    return null;
                }
                var matchingFeatures = $.map(this._features, function (feature, index) {
                    if (feature.getName().toLowerCase() === name.toLowerCase()) {
                        return feature;
                    }
                    else {
                        return null;
                    }
                });
                if (matchingFeatures.length > 0) {
                    return matchingFeatures[0];
                }
            };
            Document.prototype.getFeatureSettings = function (name, getBaseSettings) {
                if (name == null) {
                    return null;
                }
                if (this._featureSettings[name] != null) {
                    return this._featureSettings[name];
                }
                else {
                    var baseSettings = getBaseSettings != null ? getBaseSettings() : {};
                    var newSettings = void 0;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var defaults = Innovasys.overrides || Innovasys.settings;
                    var defaultSettings = defaults == null ? null : defaults[name.toLowerCase()];
                    if (defaultSettings != null) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        newSettings = __assign(__assign({}, baseSettings), defaultSettings);
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        newSettings = __assign({}, baseSettings);
                    }
                    this._featureSettings[name] = newSettings;
                    return newSettings;
                }
            };
            return Document;
        }());
        Content.Document = Document;
        var DocumentMessageNames = /** @class */ (function () {
            function DocumentMessageNames() {
            }
            DocumentMessageNames.quickSearch = "quickSearch";
            DocumentMessageNames.resetQuickSearch = "resetQuickSearch";
            DocumentMessageNames.insertNavigationHeader = "insertNavigationHeader";
            DocumentMessageNames.searchHighlightComplete = "searchHighlightComplete";
            return DocumentMessageNames;
        }());
        Content.DocumentMessageNames = DocumentMessageNames;
        var RootMessageNames = /** @class */ (function () {
            function RootMessageNames() {
            }
            RootMessageNames.navigate = "navigate";
            RootMessageNames.openNavigationPane = "openNavigationPane";
            return RootMessageNames;
        }());
        Content.RootMessageNames = RootMessageNames;
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var INNOVASYS_PREFIX_LENGTH = 2;
            var ResponsiveDocumentFeature = /** @class */ (function (_super) {
                __extends(ResponsiveDocumentFeature, _super);
                function ResponsiveDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._pendingResponsiveFiles = [];
                    _this._configuration = null;
                    return _this;
                }
                ResponsiveDocumentFeature.pivotTable = function (table) {
                    var sourceTable = $(table);
                    var container = $("<div class=\"i-pivot-table-container\"></div>");
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var labels = {};
                    var pivotColumnIndex = sourceTable
                        .find("tr")
                        .children("td.i-pivot-column, th.i-pivot-column")
                        .first()
                        .index();
                    // No column found to pivot on so just return here
                    if (pivotColumnIndex === -1) {
                        return null;
                    }
                    // Get the labels for each new row in the new table for the first row in the source table
                    sourceTable
                        .find("tr:first-child")
                        .children("td, th")
                        .each(function (index, cell) {
                        labels[index.toString()] = $(cell).text();
                    });
                    sourceTable.find("tr").each(function (index, row) {
                        if (index > 0) {
                            var newTable_1 = $("<table class=\"i-pivot-table i-section-content\"></table>");
                            var header_1;
                            $(row)
                                .children("td")
                                .each(function (cellIndex, cell) {
                                if (cellIndex === pivotColumnIndex) {
                                    header_1 = $("<div class=\"i-section-heading\"><span class=\"btn\">" + $(cell).text() + "</span></div>");
                                }
                                else {
                                    // Add a new row for each column in the source table
                                    var newRow = $("<tr><td>" + labels[cellIndex.toString()] + "</td></tr>");
                                    $(cell)
                                        .clone()
                                        .appendTo(newRow);
                                    newRow.find("td a").addClass("btn btn-mini btn-xs");
                                    newRow.appendTo(newTable_1);
                                }
                            });
                            if (header_1 != null) {
                                header_1.appendTo(container);
                            }
                            newTable_1.appendTo(container);
                        }
                    });
                    return container;
                };
                ResponsiveDocumentFeature.prototype.getName = function () {
                    return "Responsive";
                };
                ResponsiveDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("responsive", this.getDefaultFeatureSettings);
                };
                ResponsiveDocumentFeature.prototype.getDefaultFeatureSettings = function () {
                    return {
                        isEnabled: false,
                        displayMode: null
                    };
                };
                ResponsiveDocumentFeature.prototype.checkPendingResponsiveFilesLoad = function (loadedId) {
                    this._pendingResponsiveFiles = $.map(this._pendingResponsiveFiles, function (item) {
                        if (item === loadedId) {
                            // This item now loaded, exclude from pending array
                            return null;
                        }
                        else {
                            return item;
                        }
                    });
                    if (this._pendingResponsiveFiles.length === 0) {
                        // All loaded
                        this.onResponsiveFilesLoaded();
                    }
                };
                ResponsiveDocumentFeature.prototype.isEnabled = function () {
                    return this.documentInstance.isResponsiveEnabled || this.getFeatureSettings().isEnabled;
                };
                ResponsiveDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        var deviceType_1 = this.getDeviceType().toLowerCase();
                        // Gather the responsive configuration
                        var configuration = this.documentInstance.getResponsiveConfiguration(deviceType_1);
                        if (this.isEnabled()) {
                            switch (deviceType_1) {
                                case "mobile":
                                    $(".i-hidden-mobile, .i-visible-tablet, .i-visible-desktop").css("display", "none");
                                    break;
                                case "tablet":
                                    $(".i-hidden-tablet, .i-visible-mobile, .i-visible-desktop").css("display", "none");
                                    break;
                                case "desktop":
                                    $(".i-hidden-desktop, .i-visible-mobile, .i-visible-tablet").css("display", "none");
                                    break;
                                // No default
                            }
                            if (deviceType_1 !== "desktop") {
                                // Find and add any stylesheets with data-responsive-{profileName} attributes
                                $("link[data-responsive-" + deviceType_1 + "]").each(function (index, stylesheet) {
                                    var responsiveStylesheets = $(stylesheet).attr("data-responsive-" + deviceType_1);
                                    if (responsiveStylesheets != null) {
                                        // Defer setting body visible while we wait for our custom stylesheet to load
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        $.each(responsiveStylesheets.split(","), function (_, url) {
                                            // Give the stylesheet a link so we can remove it later if the responsive style changes
                                            _this._pendingResponsiveFiles.push(Content.Browser.loadStylesheet(url, "data-responsive-" + deviceType_1, "responsive-marker", function (stylesheetId) {
                                                _this.checkPendingResponsiveFilesLoad(stylesheetId);
                                            }));
                                        });
                                    }
                                });
                                // Find any stylesheet references stored in css/responsive script tags
                                $("script[type='i-url-container/css']").each(function (index, scriptElement) {
                                    var scriptContainer = $(scriptElement);
                                    var displayModes = scriptContainer.data("responsive-display-modes");
                                    if (displayModes != null && displayModes.toLowerCase().indexOf(deviceType_1) !== -1) {
                                        var url = $.trim(scriptContainer.html());
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        // Give the stylesheet a link so we can remove it later if the responsive style changes
                                        _this._pendingResponsiveFiles.push(Content.Browser.loadStylesheet(url, "data-responsive-" + deviceType_1, "responsive-marker", function (stylesheetId) {
                                            _this.checkPendingResponsiveFilesLoad(stylesheetId);
                                        }));
                                    }
                                });
                                // Find any script references stored in css/responsive script tags
                                $("script[type='i-url-container/script']").each(function (index, scriptElement) {
                                    var scriptContainer = $(scriptElement);
                                    var displayModes = scriptContainer.data("responsive-display-modes");
                                    if (displayModes != null && displayModes.toLowerCase().indexOf(deviceType_1) !== -1) {
                                        var url = $.trim(scriptContainer.html());
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = false;
                                        // Give the stylesheet a link so we can remove it later if the responsive style changes
                                        _this._pendingResponsiveFiles.push(Content.Browser.loadScript(url, "data-responsive-" + deviceType_1, "responsive-marker", function (scriptId) {
                                            _this.checkPendingResponsiveFilesLoad(scriptId);
                                        }));
                                    }
                                });
                            }
                            if (configuration.profileName === "mobile" || configuration.profileName === "tablet") {
                                switch (configuration.profileName) {
                                    case "mobile":
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-link>a,"
                                            + ".i-member-link a", Content.ResponsiveClickTargetKind.block));
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-actions-content .i-page-link,"
                                            + "#i-actions-content .i-popup-link,"
                                            + "#i-actions-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                        break;
                                    case "tablet":
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-breadcrumbs-container a,"
                                            + "#i-after-header-content .i-page-link,"
                                            + "#i-after-header-content .i-popup-link,"
                                            + "#i-after-header-content .i-function-link,"
                                            + "#i-actions-content .i-page-link,"
                                            + "#i-actions-content .i-popup-link,"
                                            + "#i-actions-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("a[href='#top']", Content.ResponsiveClickTargetKind.block));
                                        break;
                                    // No default
                                }
                                // Add some default click targets - apply to both mobile and tablet
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-footer-content>a,"
                                    + "#i-after-header-content .i-function-link", Content.ResponsiveClickTargetKind.inline));
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-seealso-section-content a,"
                                    + ".i-in-this-topic-container a", Content.ResponsiveClickTargetKind.block));
                                // And default pivot tables
                                configuration.tablesToPivot.push(new Content.ResponsiveTable("table.pivot-table,table.i-pivot-table"));
                            }
                        }
                        this._configuration = configuration;
                        if (this._pendingResponsiveFiles.length === 0) {
                            // No pending files, immediately apply
                            this.onResponsiveFilesLoaded();
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.initializeContentOrdinal = function () {
                    var CONTENT_ORDINAL = 999;
                    return CONTENT_ORDINAL;
                };
                ResponsiveDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    // Apply the custom click targets
                    $.each(configuration.clickTargets, function (_, clickTarget) {
                        _this.applyClickTarget(clickTarget);
                    });
                    // Pivot tables
                    $.each(configuration.tablesToPivot, function (_tableIndex, responsiveTable) {
                        $(responsiveTable.selector).each(function (_elementIndex, table) {
                            var pivotDiv = ResponsiveDocumentFeature.pivotTable(table);
                            if (pivotDiv != null) {
                                if (responsiveTable.onAfterPivot != null) {
                                    responsiveTable.onAfterPivot($(table), pivotDiv);
                                }
                                else {
                                    $(table).replaceWith(pivotDiv);
                                }
                            }
                        });
                    });
                    // Wire up any responsive switches
                    $(".i-responsive-switch")
                        .off("click.responsive")
                        .on("click.responsive", function (eventObject) {
                        var displayMode = $(eventObject.currentTarget).data("i-responsive-mode");
                        if (displayMode !== "") {
                            _this.setForcedDisplayMode(displayMode);
                            Content.Browser.reload();
                        }
                    });
                    $(".i-responsive-select")
                        .val(configuration.profileName)
                        .off("change.responsive")
                        .on("change.responsive", function (eventObject) {
                        var selectedValue = $(eventObject.currentTarget).val();
                        if (selectedValue !== "") {
                            _this.setForcedDisplayMode(selectedValue);
                            Content.Browser.reload();
                        }
                    });
                };
                ResponsiveDocumentFeature.prototype.onMessage = function (message) {
                    if (message) {
                        switch (message.messageType) {
                            case Content.DocumentMessageNames.insertNavigationHeader:
                                this.insertNavigationHeader();
                                break;
                            case Content.DocumentMessageNames.searchHighlightComplete:
                                $("a#i-remove-highlighting").css("display", "inline");
                                break;
                            // No default
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.insertNavigationHeader = function () {
                    var _this = this;
                    if ($("body > div.navigation-header").length === 0) {
                        var header = $("<div class=\"i-navigation-header\"><div class=\"i-inner-container\"></div></div>");
                        var innercontainer = header.find(".i-inner-container").first();
                        $("<a href=\"#\" id=\"i-nav-previous\"><i class=\"icon-arrow-left\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-index\"><i class=\"icon-list\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-toc\"><i class=\"icon-book\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-search\"><i class=\"icon-search\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-nav-next\"><i class=\"icon-arrow-right\"/></a>")
                            .appendTo(innercontainer);
                        $("<a href=\"#\" id=\"i-remove-highlighting\" class=\"btn-warning\"><i class=\"icon-remove icon-white\"></i></a>")
                            .appendTo(innercontainer);
                        if ($(".i-search-highlight").length) {
                            // Highlighted search items have been added to the body so show the remove highlights button
                            innercontainer.children("#i-remove-highlighting").css("display", "inline");
                        }
                        innercontainer.children("a")
                            .off("click.responsive")
                            .on("click.responsive", function (eventObject) {
                            var webframe = window.parent;
                            if (typeof webframe != "undefined") {
                                switch ($(eventObject.currentTarget).attr("id")) {
                                    case "i-nav-previous":
                                        Content.Messaging.routeMessageToParentFrame(Content.RootMessageNames.navigate, "previous");
                                        break;
                                    case "i-nav-next":
                                        Content.Messaging.routeMessageToParentFrame(Content.RootMessageNames.navigate, "next");
                                        break;
                                    case "i-nav-index":
                                    case "i-nav-toc":
                                    case "i-nav-search":
                                        var paneId = $(eventObject.currentTarget).attr("id");
                                        if (paneId.substring(0, INNOVASYS_PREFIX_LENGTH) === "i-") {
                                            paneId = paneId.substring(INNOVASYS_PREFIX_LENGTH);
                                        }
                                        Content.Messaging.routeMessageToParentFrame(Content.RootMessageNames.openNavigationPane, paneId);
                                        break;
                                    case "i-remove-highlighting":
                                        // Instruct search highlighting to remove any existing highlights
                                        _this.documentInstance.processWindowMessage(new Content.WindowMessage(Content.DocumentMessageNames.resetQuickSearch, null));
                                        break;
                                    // No default
                                }
                            }
                        });
                        header.prependTo($("body"));
                        if ($("html").data("responsive-load-complete") === true) {
                            // Async load of responsive files already complete so make the body visible
                            this.documentInstance.setBodyVisible();
                            $("html").data("responsive-load-complete", null);
                        }
                    }
                };
                ResponsiveDocumentFeature.prototype.applyClickTarget = function (clickTarget) {
                    var buttonClassName = (clickTarget.kind === Content.ResponsiveClickTargetKind.inline) ? "btn btn-mini btn-xs" : "btn";
                    $(clickTarget.className).addClass(buttonClassName);
                };
                ResponsiveDocumentFeature.prototype.getDeviceType = function () {
                    if (!this.isEnabled()) {
                        // Responsive disabled - always desktop
                        return "DESKTOP";
                    }
                    var forcedDisplayMode = this.getForcedDisplayMode();
                    if (forcedDisplayMode != null) {
                        return forcedDisplayMode;
                    }
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    if (Modernizr.touch) {
                        if (Modernizr.mq("screen and (orientation: portrait) and (max-device-width: 600px)")) {
                            return "MOBILE";
                        }
                        else if (Modernizr.mq("screen and (orientation: landscape) and (max-device-width: 767px)")) {
                            return "MOBILE";
                        }
                        else {
                            return "TABLET";
                        }
                    }
                    else if (navigator.userAgent.indexOf("Windows Phone OS") !== -1) {
                        // Specific check for windows phone as Modernizr returns false for the touch property
                        return "MOBILE";
                    }
                    return "DESKTOP";
                };
                /**
                 * Returns any forced display mode set by the containing frame.
                 */
                ResponsiveDocumentFeature.prototype.getForcedDisplayMode = function () {
                    var overrides = Content.Browser.getCommonSettings();
                    if (typeof overrides.forcedDisplayMode != "undefined"
                        && overrides.forcedDisplayMode != null) {
                        return overrides.forcedDisplayMode;
                    }
                    if (this.getFeatureSettings().displayMode != null) {
                        return this.getFeatureSettings().displayMode;
                    }
                    var location = Content.Browser.getLocationInfo();
                    if (location.hash === "#ForceDisplayDesktop") {
                        return "DESKTOP";
                    }
                    else if (location.hash === "#ForceDisplayMobile") {
                        return "MOBILE";
                    }
                    else if (location.hash === "#ForceDisplayTablet") {
                        return "TABLET";
                    }
                    // Only check local storage here if we are in a frame - the parent frame sets the local storage
                    // value for overriding the default behavior so we only need to check it if we are actually running
                    // in a frame
                    var currentPath = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
                    var responsiveStorageId = "innovasys-responsive-" + currentPath.replace(/[^a-zA-Z0-9_\-]/g, "");
                    if (this.documentInstance.getLocalStorage().getAttribute(responsiveStorageId) != null) {
                        return this.documentInstance.getLocalStorage().getAttribute(responsiveStorageId);
                    }
                    return null;
                };
                /**
                 * Forces a specific responsive display mode when the document loads. The forced display mode is set in local storage
                 *  so will be used by all subsequent page loads until it is reset.
                 */
                ResponsiveDocumentFeature.prototype.setForcedDisplayMode = function (displayMode) {
                    var location = Content.Browser.getLocationInfo();
                    var currentPath = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
                    var responsiveStorageId = "innovasys-responsive-" + currentPath.replace(/[^a-zA-Z0-9_\-]/g, "");
                    this.documentInstance.getLocalStorage().setAttribute(responsiveStorageId, displayMode);
                };
                /**
                 * Called after responsive setup completes.
                 */
                ResponsiveDocumentFeature.prototype.onResponsiveFilesLoaded = function () {
                    var overrides = Content.Browser.getCommonSettings();
                    this.documentInstance.applyResponsiveConfiguration(this._configuration);
                    if (this._configuration.profileName !== "desktop") {
                        if (!this.documentInstance.isContentDocument
                            || overrides.navigationKind === "inpage"
                            || $("body > div.i-navigation-header").length !== 0) {
                            // Navigation header already loaded, or not a content document or a page with
                            //  inpage navigation so make the body visible;
                            this.documentInstance.setBodyVisible();
                        }
                        else {
                            // Navigation header not loaded yet, add a flag here so that when the header has finished loaded it will make
                            //  the body visible
                            $("html").data("responsive-load-complete", true);
                        }
                    }
                    $("html").addClass("i-responsive-" + this._configuration.profileName);
                };
                return ResponsiveDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ResponsiveDocumentFeature = ResponsiveDocumentFeature;
            var ResponsiveDocumentFeatureFactory = /** @class */ (function () {
                function ResponsiveDocumentFeatureFactory() {
                }
                ResponsiveDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ResponsiveDocumentFeature(documentInstance);
                };
                return ResponsiveDocumentFeatureFactory;
            }());
            Features.ResponsiveDocumentFeatureFactory = ResponsiveDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ResponsiveDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var FixedToTopDocumentFeature = /** @class */ (function (_super) {
                __extends(FixedToTopDocumentFeature, _super);
                function FixedToTopDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.isPinned = false;
                    return _this;
                }
                FixedToTopDocumentFeature.prototype.getName = function () {
                    return "Fixed to Top";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                FixedToTopDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if ($(".i-fixed-to-top").length > 0) {
                        var scrollEventId = "scroll.fixed-to-top";
                        var resizeEventId = "resize.fixed-to-top";
                        setTimeout(function () { return _this.refresh(); }, 1);
                        $(window)
                            .off(scrollEventId)
                            .on(scrollEventId, function () { return _this.refresh(); })
                            .off(resizeEventId)
                            .on(resizeEventId, function () { return _this.refresh(); });
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                FixedToTopDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    setTimeout(function () { return _this.refresh(); }, 1);
                };
                FixedToTopDocumentFeature.prototype.refresh = function () {
                    var bodyTop = this.getBodyContentPosition();
                    var $fixedToTop = $(".i-fixed-to-top");
                    var scrollTop = $(window).scrollTop();
                    var isPinnedNewValue = (scrollTop > bodyTop);
                    if (this.isPinned !== isPinnedNewValue) {
                        this.isPinned = isPinnedNewValue;
                        $fixedToTop.toggleClass("i-is-fixed", isPinnedNewValue);
                        if (this.isPinned) {
                            $fixedToTop.css("top", "0");
                        }
                    }
                    if (!this.isPinned) {
                        var topValue = bodyTop - scrollTop;
                        $(".i-fixed-to-top").css("top", topValue > 0 ? topValue + "px" : "");
                    }
                };
                FixedToTopDocumentFeature.prototype.getBodyContentPosition = function () {
                    var bodyContentPosition = $("#i-body-content-container", this.rootSelector).position();
                    if (bodyContentPosition != null) {
                        return bodyContentPosition.top;
                    }
                };
                return FixedToTopDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.FixedToTopDocumentFeature = FixedToTopDocumentFeature;
            var FixedToTopDocumentFeatureFactory = /** @class */ (function () {
                function FixedToTopDocumentFeatureFactory() {
                }
                FixedToTopDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new FixedToTopDocumentFeature(documentInstance);
                };
                return FixedToTopDocumentFeatureFactory;
            }());
            Features.FixedToTopDocumentFeatureFactory = FixedToTopDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.FixedToTopDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ThemeDocumentFeature = /** @class */ (function (_super) {
                __extends(ThemeDocumentFeature, _super);
                function ThemeDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ThemeDocumentFeature.prototype.getName = function () {
                    return "Theme";
                };
                ThemeDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        defaultThemeOption: null,
                        isThemeSelectionEnabled: false
                    };
                };
                ThemeDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("theme", this.getDefaultSettings);
                };
                /* eslint @typescript-eslint/no-unused-vars: "off" */
                ThemeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    this._rootSelector = rootSelector;
                    var settings = this.getFeatureSettings();
                    if (settings.isThemeSelectionEnabled) {
                        $(".i-theme-select", rootSelector)
                            .off("change.theme")
                            .on("change.theme", function (eventObject) {
                            var themeName = $(eventObject.currentTarget).data("theme-name");
                            var stylesheetUrl = $(eventObject.currentTarget).val();
                            var themeOption = $("option[value='" + stylesheetUrl + "']", $(eventObject.currentTarget)).data("theme-option");
                            _this.onThemeSelected(themeName, themeOption, stylesheetUrl, true);
                        });
                    }
                    $(".i-theme-select", rootSelector).each(function (index, element) {
                        var $element = $(element);
                        var themeName = $element.data("theme-name");
                        if (themeName != null) {
                            var themeOptionToApply = _this.documentInstance.getLocalStorage()
                                .getAttribute("i-theme-" + themeName);
                            if (themeOptionToApply == null) {
                                themeOptionToApply = settings.defaultThemeOption;
                            }
                            if (themeOptionToApply != null) {
                                var themeOption = $("option[data-theme-option='" + themeOptionToApply + "']", $element);
                                if (themeOption.length > 0) {
                                    $element.val(themeOption.val());
                                    _this.onThemeSelected(themeName, themeOptionToApply, themeOption.val(), false);
                                }
                            }
                        }
                    });
                    if (!settings.isThemeSelectionEnabled) {
                        $(".i-theme-selection-container").hide();
                    }
                    else {
                        $(".i-theme-selection-container").show();
                    }
                };
                ThemeDocumentFeature.prototype.onThemeSelected = function (themeName, themeValue, stylesheetUrl, saveSelection) {
                    // Remove any existing theme stylesheets
                    var existingStylesheets = $("link[data-theme-name='" + themeName + "']");
                    existingStylesheets.remove();
                    // Add the new one (if not "none")
                    if (stylesheetUrl !== "none") {
                        $("head").append("<link rel=\"stylesheet\" href=\"" + stylesheetUrl + "\" type=\"text/css\" data-theme-name=\"" + themeName + "\" />");
                    }
                    // Add a class to the root
                    $(".i-theme-select option", this._rootSelector).each(function (index, element) {
                        var optionValue = $(element).data("theme-option");
                        $("html").toggleClass("i-theme-" + themeName + "-" + optionValue, optionValue === themeValue);
                    });
                    if (saveSelection) {
                        // Save as the current preference
                        this.documentInstance.getLocalStorage().setAttribute("i-theme-" + themeName, themeValue);
                    }
                };
                return ThemeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ThemeDocumentFeature = ThemeDocumentFeature;
            var ThemeDocumentFeatureFactory = /** @class */ (function () {
                function ThemeDocumentFeatureFactory() {
                }
                ThemeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ThemeDocumentFeature(documentInstance);
                };
                return ThemeDocumentFeatureFactory;
            }());
            Features.ThemeDocumentFeatureFactory = ThemeDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ThemeDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var DynamicStylesDocumentFeature = /** @class */ (function (_super) {
                __extends(DynamicStylesDocumentFeature, _super);
                function DynamicStylesDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._addedStyles = { dynamicWordBreak: null };
                    return _this;
                }
                DynamicStylesDocumentFeature.prototype.getName = function () {
                    return "DynamicStyles";
                };
                DynamicStylesDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        isDynamicWordWrapEnabled: false,
                        isDynamicWordWrapUpdateOnResizeEnabled: true
                    };
                };
                DynamicStylesDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("dynamicstyles", this.getDefaultSettings);
                };
                DynamicStylesDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                    }
                    var settings = this.getFeatureSettings();
                    if (!settings.isDynamicWordWrapEnabled) {
                        return;
                    }
                    // No dynamic styles in compiled help or at design time
                    if (!Content.Browser.isCompiledHelp() && !Content.Browser.isDesignTime) {
                        var $bodyContent = $("#i-body-content", this._rootSelector);
                        if ($bodyContent.length > 0) {
                            setTimeout(function () {
                                _this.updateDynamicWordBreak();
                            });
                            if (settings.isDynamicWordWrapUpdateOnResizeEnabled) {
                                $(window).off("resize.dynamicstyles")
                                    .on("resize.dynamicstyles", function () {
                                    _this.updateDynamicWordBreak();
                                });
                            }
                        }
                    }
                };
                DynamicStylesDocumentFeature.prototype.updateDynamicWordBreak = function () {
                    var styleId = "i-dynamic-word-break";
                    var $bodyContent = $("#i-body-content", this._rootSelector);
                    var bodyContent = $bodyContent.get(0);
                    if (this._addedStyles.dynamicWordBreak != null) {
                        // Style already added. If the current width is > applied width, remove and re-evaluate
                        if (bodyContent.offsetWidth > this._addedStyles.dynamicWordBreak) {
                            $("#" + styleId).remove();
                            this._addedStyles.dynamicWordBreak = null;
                        }
                        else {
                            return;
                        }
                    }
                    if (bodyContent.offsetWidth < bodyContent.scrollWidth
                        && ($("table", $bodyContent).length > 0)) {
                        this._addedStyles.dynamicWordBreak = bodyContent.offsetWidth;
                        var $dynamicStylesElement = Content.Browser.getDynamicStyleContainer(styleId);
                        $dynamicStylesElement.html("td {word-break: break-all;}");
                    }
                };
                return DynamicStylesDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DynamicStylesDocumentFeature = DynamicStylesDocumentFeature;
            var DynamicStylesDocumentFeatureFactory = /** @class */ (function () {
                function DynamicStylesDocumentFeatureFactory() {
                }
                DynamicStylesDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new DynamicStylesDocumentFeature(documentInstance);
                };
                return DynamicStylesDocumentFeatureFactory;
            }());
            Features.DynamicStylesDocumentFeatureFactory = DynamicStylesDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DynamicStylesDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var DarkModeDocumentFeature = /** @class */ (function (_super) {
                __extends(DarkModeDocumentFeature, _super);
                function DarkModeDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._optimalColors = {};
                    return _this;
                }
                DarkModeDocumentFeature.prototype.findReadableColorOnDarkBackground = function (color) {
                    if (this._optimalColors[color.toHex8String()]) {
                        return this._optimalColors[color.toHex8String()];
                    }
                    var maximumLightening = 100;
                    var lighteningIncrement = 1;
                    var resolvedColor;
                    for (var i = 1; i < maximumLightening; i += lighteningIncrement) {
                        var possibleColor = color.clone().lighten(i);
                        if (tinycolor.isReadable(possibleColor, "#333")) {
                            resolvedColor = possibleColor;
                            break;
                        }
                    }
                    if (resolvedColor == null) {
                        resolvedColor = tinycolor("#ccc");
                    }
                    this._optimalColors[color.toHex8String()] = resolvedColor;
                    return resolvedColor;
                };
                DarkModeDocumentFeature.prototype.getName = function () {
                    return "DarkMode";
                };
                DarkModeDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        isEnabled: false,
                        isAlwaysDarkMode: false
                    };
                };
                DarkModeDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("darkmode", this.getDefaultSettings);
                };
                DarkModeDocumentFeature.prototype.initializeDocument = function () {
                    var _this = this;
                    var settings = this.getFeatureSettings();
                    if (settings.isEnabled) {
                        if (settings.isAlwaysDarkMode) {
                            $("html").addClass("i-dark");
                        }
                        else {
                            if (window.matchMedia) {
                                var matchMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
                                var matchMediaListener = function (queryList, isAddDarkModificationsDisabled) {
                                    if (isAddDarkModificationsDisabled === void 0) { isAddDarkModificationsDisabled = false; }
                                    if (queryList.matches) {
                                        $("html").addClass("i-dark");
                                        if (!isAddDarkModificationsDisabled) {
                                            _this.addDarkModifications();
                                        }
                                    }
                                    else {
                                        if ($("html").hasClass("i-dark")) {
                                            _this.removeDarkModifications();
                                            $("html").removeClass("i-dark");
                                        }
                                    }
                                };
                                matchMediaListener(matchMediaQuery, true);
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                matchMediaQuery.addListener(matchMediaListener);
                            }
                        }
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                DarkModeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if ($("html").hasClass("i-dark")) {
                        this.addDarkModifications();
                    }
                };
                DarkModeDocumentFeature.prototype.addDarkModifications = function () {
                    var _this = this;
                    var $inlineColors = $("pre [style]");
                    $inlineColors.each(function (_, element) {
                        if (element.style.color) {
                            var originalColor = tinycolor(element.style.color);
                            var color = _this.findReadableColorOnDarkBackground(originalColor);
                            if (color.toHex8String() !== originalColor.toHex8String()) {
                                $(element).data("i-original-color", element.style.color);
                                element.style.color = color.toHex8String();
                            }
                        }
                    });
                };
                DarkModeDocumentFeature.prototype.removeDarkModifications = function () {
                    var $inlineColors = $("pre [style]");
                    $inlineColors.each(function (_, element) {
                        var $element = $(element);
                        if ($element.data("i-original-color")) {
                            element.style.color = $element.data("i-original-color");
                            $element.removeData("i-original-color");
                        }
                    });
                };
                return DarkModeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DarkModeDocumentFeature = DarkModeDocumentFeature;
            var DarkModeDocumentFeatureFactory = /** @class */ (function () {
                function DarkModeDocumentFeatureFactory() {
                }
                DarkModeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new DarkModeDocumentFeature(documentInstance);
                };
                return DarkModeDocumentFeatureFactory;
            }());
            Features.DarkModeDocumentFeatureFactory = DarkModeDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DarkModeDocumentFeatureFactory());

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var NavigationMessageNames = /** @class */ (function () {
                function NavigationMessageNames() {
                }
                NavigationMessageNames.syncTableOfContents = "syncToC";
                NavigationMessageNames.select = "select";
                NavigationMessageNames.shrinkIFrames = "shrinkIframes";
                NavigationMessageNames.loaded = "loaded";
                NavigationMessageNames.toggleTocPrevious = "toggle-toc-previous";
                NavigationMessageNames.toggleTocNext = "toggle-toc-next";
                NavigationMessageNames.navigate = "navigate";
                NavigationMessageNames.activated = "activated";
                NavigationMessageNames.updateNavigationButtons = "update-navigation-buttons";
                NavigationMessageNames.updatePageTitle = "updatePageTitle";
                NavigationMessageNames.openNavigationPane = "openNavigationPane";
                NavigationMessageNames.closeNavigationPane = "closeNavigationPane";
                NavigationMessageNames.insertRemoveHighlighting = "insertRemoveHighlighting";
                return NavigationMessageNames;
            }());
            Features.NavigationMessageNames = NavigationMessageNames;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var navigationConstants = {
                navigationDelay: 500,
                navigationPrefixLength: 4
            };
            var NavigationDocumentFeature = /** @class */ (function (_super) {
                __extends(NavigationDocumentFeature, _super);
                function NavigationDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._rootSelector = null;
                    _this._isIframeResizeTimerDisabled = false;
                    _this._isAccordionView = true;
                    _this._navigationFrames = ["i-toc", "i-index", "i-search"];
                    _this._isEnabled = false;
                    _this.isTocNavigationEnabled = false;
                    _this.isStartOfToc = false;
                    _this.isEndOfToc = false;
                    return _this;
                }
                NavigationDocumentFeature.prototype.getName = function () {
                    return "Navigation";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                NavigationDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    this._rootSelector = rootSelector;
                    if ($("#i-navigation-container", this._rootSelector).length > 0) {
                        this._isEnabled = true;
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                NavigationDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                NavigationDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.syncTableOfContents:
                            Content.Messaging.routeMessageToFrameElement("i-toc", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.select:
                            this.selectNavigationFrame(message.messageData);
                            break;
                        case Features.NavigationMessageNames.shrinkIFrames:
                            this.shrinkFrame($("iframe#i-toc,iframe#i-index,iframe#i-search"));
                            break;
                        case Features.NavigationMessageNames.loaded:
                            // Forward message to search pane so that search highlights can be rendered
                            Content.Messaging.routeMessageToFrameElement("i-search", message.messageType, message.messageData);
                            break;
                        case Content.DocumentMessageNames.quickSearch:
                        case Content.DocumentMessageNames.searchHighlightComplete:
                            // Pass to parent frame handler so it can be forwarded on to the content frame
                            Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.toggleTocPrevious:
                            this.isStartOfToc = (message.messageData === "true");
                            $("#i-toc-header #i-previous").toggleClass("i-arrow-left-disabled", this.isStartOfToc);
                            break;
                        case Features.NavigationMessageNames.toggleTocNext:
                            this.isEndOfToc = (message.messageData === "true");
                            $("#i-toc-header #i-next").toggleClass("i-arrow-right-disabled", this.isEndOfToc);
                            break;
                        case Features.NavigationMessageNames.navigate:
                            if (message.messageData === "previous" || message.messageData === "next") {
                                this.navigateToc(message.messageData);
                            }
                            else {
                                Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            }
                            break;
                        // No default
                    }
                };
                NavigationDocumentFeature.prototype.navigateToc = function (direction) {
                    Content.Messaging.routeMessageToFrameElement("i-toc", Features.NavigationMessageNames.navigate, direction);
                };
                NavigationDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName !== "desktop") {
                        // Tablet & Mobile
                        this._isAccordionView = false;
                        // Hide the accordion elements
                        $(".i-header, .i-header.ui-state-active").css("display", "none");
                        if (Modernizr.touch) {
                            $("iframe").attr("scrolling", "no");
                        }
                        $(window)
                            .off("resize.navigation")
                            .on("resize.navigation", function () {
                            _this.addCloseButtonChevrons();
                        });
                        $("#i-close-pane", this._rootSelector)
                            .off("click.navigation", "a.btn, i.i-image")
                            .on("click.navigation", "a.btn, i.i-image", function (event) {
                            event.preventDefault();
                            var webContentFrame = window.parent;
                            Content.Messaging.routeMessageToWindow(webContentFrame, Features.NavigationMessageNames.closeNavigationPane, null);
                        });
                        // Resize the iframes and set a timer to keep them sized
                        Content.Browser.resizeIFrames(this._rootSelector);
                        setInterval(function () {
                            if (!_this._isIframeResizeTimerDisabled) {
                                Content.Browser.resizeIFrames(_this._rootSelector);
                            }
                        }, navigationConstants.navigationDelay);
                    }
                    else {
                        // Desktop
                        this._isAccordionView = true;
                        if ($("#i-accordion", this._rootSelector).length > 0) {
                            $("#i-accordion", this._rootSelector).accordion({ heightStyle: "fill" });
                            // Initial resize
                            setTimeout(function () {
                                $("#i-accordion", _this._rootSelector).accordion("refresh");
                            }, 1);
                            // Resize immediately when the window resizes
                            $(window)
                                .off("resize.navigation")
                                .on("resize.navigation", function () {
                                if ($("#i-accordion", _this._rootSelector).data("ui-accordion") != null) {
                                    $("#i-accordion", _this._rootSelector).accordion("refresh");
                                }
                            });
                            // Notify the websearch iframe to set focus in the search box
                            $("#i-accordion", this._rootSelector)
                                .off("accordionactivate.navigation")
                                .on("accordionactivate.navigation", function (_, ui) {
                                if (ui.newHeader.attr("id") === "i-search-header") {
                                    Content.Messaging.routeMessageToFrameElement("i-search", Features.NavigationMessageNames.activated, null);
                                }
                            });
                        }
                        else if ($("#i-tabstrip", this._rootSelector).length > 0) {
                            // Change default duration on the tabs
                            var options = {
                                heightStyle: "fill"
                            };
                            // Tab strip
                            $("#i-tabstrip", this._rootSelector).tabs(options);
                            // Initial resize
                            setTimeout(function () {
                                $("#i-tabstrip", _this._rootSelector).tabs("refresh");
                            }, 1);
                            // Resize immediately when the window resizes
                            $(window)
                                .off("resize.navigation")
                                .on("resize.navigation", function () {
                                if ($("#i-tabstrip", _this._rootSelector).data("ui-tabs") != null) {
                                    $("#i-tabstrip", _this._rootSelector).tabs("refresh");
                                }
                            });
                        }
                        if (this.isTocNavigationEnabled) {
                            var arrowContainer = $("<div class=\"i-arrow-container\"></div>");
                            arrowContainer.append("<div class=\"i-arrow i-arrow-right\" id=\"i-next\"></div>");
                            arrowContainer.append("<div class=\"i-arrow i-arrow-left\" id=\"i-previous\"></div>");
                            $("#i-toc-header", this._rootSelector).append(arrowContainer);
                            $("#i-toc-header #i-next", this._rootSelector)
                                .off("click.tocnavigation")
                                .on("click.tocnavigation", function () {
                                if (!_this.isEndOfToc) {
                                    _this.navigateToc("next");
                                }
                            });
                            $("#i-toc-header #i-previous", this._rootSelector)
                                .off("click.tocnavigation")
                                .on("click.tocnavigation", function () {
                                if (!_this.isStartOfToc) {
                                    _this.navigateToc("previous");
                                }
                            });
                        }
                    }
                };
                NavigationDocumentFeature.prototype.shrinkFrame = function (frameSelector) {
                    frameSelector.height(null);
                    frameSelector.data("last-height", null);
                    frameSelector.css("display", "none");
                };
                NavigationDocumentFeature.prototype.selectNavigationFrame = function (frameId) {
                    if (frameId != null && frameId.indexOf("nav-") === 0) {
                        frameId = "i-" + frameId.substring(navigationConstants.navigationPrefixLength);
                    }
                    for (var x = 0; x < this._navigationFrames.length; x++) {
                        var currentFrameId = this._navigationFrames[x];
                        var isSelected = (currentFrameId === frameId);
                        if (isSelected) {
                            if (this._isAccordionView) {
                                $("#i-accordion").accordion("option", "active", x);
                            }
                            else {
                                $("iframe#" + currentFrameId).css("display", "block");
                            }
                        }
                        else {
                            $("iframe#" + currentFrameId).css("display", "none");
                        }
                    }
                    if (!this._isAccordionView) {
                        Content.Browser.resizeIFrames(this._rootSelector, true);
                    }
                };
                NavigationDocumentFeature.prototype.addCloseButtonChevrons = function () {
                    var topWindowHeight;
                    try {
                        topWindowHeight = $(window.top).height();
                    }
                    catch (ex) {
                        topWindowHeight = $(window).height();
                    }
                    var closePaneHeight = Math.max($("#i-close-pane").height(), topWindowHeight);
                    $("#i-close-pane > i.i-image").remove();
                    /* eslint-disable-next-line no-magic-numbers */
                    for (var i = topWindowHeight / 2; i < closePaneHeight; i += topWindowHeight) {
                        var image = $("<i class=\"i-image\"></i>");
                        image.css("top", i + "px");
                        image.appendTo("#i-close-pane");
                    }
                };
                return NavigationDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.NavigationDocumentFeature = NavigationDocumentFeature;
            var NavigationDocumentFeatureFactory = /** @class */ (function () {
                function NavigationDocumentFeatureFactory() {
                }
                NavigationDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new NavigationDocumentFeature(documentInstance);
                };
                return NavigationDocumentFeatureFactory;
            }());
            Features.NavigationDocumentFeatureFactory = NavigationDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.NavigationDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var tableOfContentsConstants = {
                slideToggleDelay: 200,
                iconIndexFolderNew: 3,
                iconIndexFolder: 1,
                iconIndexPageNew: 10,
                iconIndexPage: 9
            };
            var TableOfContentsDocumentFeature = /** @class */ (function (_super) {
                __extends(TableOfContentsDocumentFeature, _super);
                function TableOfContentsDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._lastSelectedNode = null;
                    _this._ignoreSyncRequest = false;
                    _this._selectedNodeIndex = -1;
                    _this._firstNodeIndex = -1;
                    _this._lastNodeIndex = -1;
                    _this._tocNodeCount = -1;
                    _this._selectedNodeHref = null;
                    _this._rootSelector = null;
                    _this._isTocConstructed = false;
                    _this._isMobileToc = false;
                    _this._isEnabled = false;
                    _this.syncTocUrl = null;
                    return _this;
                }
                TableOfContentsDocumentFeature.prototype.getName = function () {
                    return "TableOfContents";
                };
                TableOfContentsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        if ($("#i-toc-container", this._rootSelector).length > 0) {
                            this._isEnabled = true;
                            this._indexNodes();
                        }
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                TableOfContentsDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                TableOfContentsDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName === "desktop") {
                        $("html")
                            .removeClass("ui-mobile")
                            .removeClass("ui-mobile-rendering");
                        // Desktop
                        this.constructDesktopToc($("ul#i-root", this._rootSelector));
                        this._isTocConstructed = true;
                    }
                    else {
                        // Mobile/Tablet
                        $("ul#i-root", this._rootSelector).css("display", "none");
                        this.constructMobileToC();
                        this._isMobileToc = true;
                        this._isTocConstructed = true;
                        $("ul#i-root", this._rootSelector).addClass("visible");
                    }
                    if (this.syncTocUrl != null) {
                        var url = this.syncTocUrl;
                        this.syncTocUrl = null;
                        this.syncTocNodeToUrl(url);
                    }
                };
                TableOfContentsDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.navigate:
                            if (message.messageData) {
                                var anchor = null;
                                if (message.messageData === "next") {
                                    anchor = this.moveToNextNode();
                                }
                                else if (message.messageData === "previous") {
                                    anchor = this.moveToPreviousNode();
                                }
                                if (anchor != null && anchor.length) {
                                    this._ignoreSyncRequest = false;
                                    this.syncTocNode(anchor);
                                    // Ignore the next ToC node sync request as it will come from the webframe when the content has finished loading
                                    this._ignoreSyncRequest = true;
                                    if (anchor.attr("href").substring(0, 1) !== "#") {
                                        var webframe = window.parent.parent;
                                        Content.Messaging.routeMessageToWindow(webframe, Features.NavigationMessageNames.navigate, anchor.attr("href"));
                                    }
                                }
                            }
                            break;
                        case Features.NavigationMessageNames.updateNavigationButtons:
                            this.updateNavigationButtons();
                            break;
                        case Features.NavigationMessageNames.syncTableOfContents:
                            this.syncTocNodeToUrl(message.messageData);
                            break;
                        // No default
                    }
                };
                TableOfContentsDocumentFeature.prototype.updateNavigationButtons = function () {
                    Content.Messaging.routeMessageToWindow(window.parent, Features.NavigationMessageNames.toggleTocNext, this.isLastNodeSelected() ? "true" : "false");
                    Content.Messaging.routeMessageToWindow(window.parent, Features.NavigationMessageNames.toggleTocPrevious, this.isFirstNodeSelected() ? "true" : "false");
                };
                TableOfContentsDocumentFeature.prototype.moveToNextNode = function () {
                    return this._moveNode(false);
                };
                TableOfContentsDocumentFeature.prototype.moveToPreviousNode = function () {
                    return this._moveNode(true);
                };
                TableOfContentsDocumentFeature.prototype.setSelectedNode = function (anchor) {
                    this._selectedNodeIndex = parseInt(anchor.attr("data-node-index"), 10);
                    this._selectedNodeHref = anchor.attr("href");
                };
                TableOfContentsDocumentFeature.prototype.isLastNodeSelected = function () {
                    if (this._tocNodeCount === -1) {
                        this._tocNodeCount = this._getAnchors().length;
                    }
                    return this._selectedNodeIndex === this._lastNodeIndex;
                };
                TableOfContentsDocumentFeature.prototype.isFirstNodeSelected = function () {
                    return this._selectedNodeIndex === this._firstNodeIndex;
                };
                TableOfContentsDocumentFeature.prototype._getAnchors = function () {
                    return this._rootSelector.find("#i-toc-container > ul#i-root a[data-node-index]");
                };
                TableOfContentsDocumentFeature.prototype._moveNode = function (isPrevious) {
                    var anchors = this._getAnchors();
                    if (isPrevious) {
                        if (this._selectedNodeIndex > 0) {
                            do {
                                this._selectedNodeIndex--;
                            } while (anchors.eq(this._selectedNodeIndex)
                                .attr("href")
                                .substring(0, 1) === "#" && this._selectedNodeIndex > 0);
                        }
                    }
                    else {
                        if (anchors.length - 1 > this._selectedNodeIndex) {
                            do {
                                this._selectedNodeIndex++;
                            } while (anchors.eq(this._selectedNodeIndex)
                                .attr("href")
                                .substring(0, 1) === "#" && anchors.length - 1 > this._selectedNodeIndex);
                        }
                    }
                    return anchors.eq(this._selectedNodeIndex);
                };
                TableOfContentsDocumentFeature.prototype.isPageSelected = function (anchor) {
                    return (anchor.attr("href") === this._selectedNodeHref);
                };
                TableOfContentsDocumentFeature.prototype.constructDesktopToc = function (root) {
                    this.processListElement(root);
                };
                TableOfContentsDocumentFeature.prototype.expandOrCollapseClickHandler = function (event) {
                    var siblingList = $(event.target).nextAll("ul");
                    this.expandOrCollapseNode(siblingList, true);
                };
                TableOfContentsDocumentFeature.prototype.nodeClickHandler = function (element) {
                    this.selectNodeElement(element);
                    if (element.attr("href") !== "#") {
                        Content.Messaging.routeMessageToWindow(window.parent.parent, Features.NavigationMessageNames.navigate, element.attr("href"));
                    }
                    // Don't collapse the nested list when clicking on a node (do expand it if it is collapsed)
                    if (!$(element)
                        .prev("ins")
                        .hasClass("i-collapse")) {
                        // expand /collapse child
                        var siblingList = element.nextAll("ul");
                        this.expandOrCollapseNode(siblingList, true);
                    }
                    this.updateNavigationButtons();
                };
                TableOfContentsDocumentFeature.prototype.selectNodeElement = function (element) {
                    if (this._lastSelectedNode != null) {
                        // Remove selected highlighting from previously selected node
                        this._lastSelectedNode.removeClass("i-selected");
                    }
                    element.removeClass("i-hover");
                    element.addClass("i-selected");
                    this._lastSelectedNode = element;
                    this.setSelectedNode(element);
                };
                TableOfContentsDocumentFeature.prototype.expandOrCollapseNode = function (listElement, isAnimationEnabled) {
                    var _this = this;
                    if (isAnimationEnabled === void 0) { isAnimationEnabled = true; }
                    if (listElement.length) {
                        if (listElement.length > 1) {
                            // Process individually
                            listElement.each(function (_, element) {
                                _this.expandOrCollapseNode($(element), isAnimationEnabled);
                            });
                            return;
                        }
                        if (!listElement.hasClass("i-visible")) {
                            this.processListElement(listElement);
                        }
                        if (isAnimationEnabled) {
                            listElement.slideToggle(tableOfContentsConstants.slideToggleDelay, function () {
                                listElement.toggleClass("i-visible");
                                listElement.css("display", "");
                            });
                        }
                        else {
                            listElement.toggleClass("i-visible");
                        }
                        // Swap icons for open and closed books
                        var icon = listElement.prev("a").children("ins");
                        if (icon.hasClass("i-icon-1")) {
                            icon.removeClass("i-icon-1").addClass("i-icon-2");
                        }
                        else if (icon.hasClass("i-icon-2")) {
                            icon.removeClass("i-icon-2").addClass("i-icon-1");
                        }
                        else if (icon.hasClass("i-icon-3")) {
                            icon.removeClass("i-icon-3").addClass("i-icon-4");
                        }
                        else if (icon.hasClass("i-icon-4")) {
                            icon.removeClass("i-icon-4").addClass("i-icon-3");
                        }
                        listElement.prevAll("ins").toggleClass("i-expand i-collapse");
                    }
                };
                TableOfContentsDocumentFeature.prototype.processListElement = function (listElement) {
                    var _this = this;
                    if (listElement.length) {
                        if (listElement.length > 1) {
                            // Process individually
                            listElement.each(function (_, element) {
                                _this.processListElement($(element));
                            });
                            return;
                        }
                        if (listElement.hasClass("i-root")) {
                            listElement.addClass("i-visible");
                        }
                        listElement.children("li").each(function (_, listItemElement) {
                            var hasNestedList = false;
                            var listItem = $(listItemElement);
                            listItem.children("ul").each(function (__, childListElement) {
                                if ($(childListElement).children().length > 0) {
                                    hasNestedList = true;
                                }
                                else {
                                    // Remove any empty <ul> elements
                                    $(childListElement).remove();
                                }
                            });
                            var anchor = listItem.children("a");
                            // Add an <ins> node for the expand / collapse icon if one doesn't already exist
                            if (listItemElement.firstChild.nodeName !== "INS") {
                                var spacer = $("<ins class=\"i-spacer\"></ins>");
                                if (hasNestedList) {
                                    spacer.addClass("i-expandorcollapse");
                                    spacer.addClass("i-expand");
                                    spacer
                                        .off("click.toc")
                                        .on("click.toc", function (event) {
                                        _this.expandOrCollapseClickHandler(event);
                                    });
                                }
                                spacer.prependTo(listItem);
                            }
                            // Add an <ins> node for the node icon
                            if (anchor.children("ins").length === 0) {
                                var icon = $("<ins class=\"i-icon\"></ins>");
                                var iconIndex = parseInt(listItem.attr("rel"), 10);
                                var iconClassIndex = iconIndex;
                                var isNew = listItem.data("is-new") === "True";
                                if (hasNestedList) {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = tableOfContentsConstants.iconIndexFolderNew;
                                        }
                                        else {
                                            iconClassIndex = tableOfContentsConstants.iconIndexFolder;
                                        }
                                    }
                                }
                                else {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = tableOfContentsConstants.iconIndexPageNew;
                                        }
                                        else {
                                            iconClassIndex = tableOfContentsConstants.iconIndexPage;
                                        }
                                    }
                                }
                                icon.addClass("i-icon-" + iconClassIndex);
                                icon.prependTo(anchor);
                            }
                            anchor
                                .off("click.toc")
                                .on("click.toc", function (event) {
                                _this.nodeClickHandler($(event.currentTarget));
                                event.preventDefault();
                                Content.Browser.stopPropagation(event);
                            });
                            anchor
                                .off("hover.toc")
                                .on("hover.toc", function (event) {
                                if (!$(event.currentTarget).hasClass("i-selected")) {
                                    $(event.currentTarget).addClass("i-hover");
                                }
                            }, function (event) {
                                $(event.currentTarget).removeClass("i-hover");
                            });
                        });
                    }
                };
                TableOfContentsDocumentFeature.prototype.syncTocNodeToUrl = function (url) {
                    if (!this._isTocConstructed) {
                        // ToC not available yet, postpone.
                        this.syncTocUrl = url;
                        return;
                    }
                    var anchor = $("div#i-toc-container > ul a[href=\"" + decodeURIComponent(url) + "\"]", this._rootSelector).first();
                    if (anchor != null
                        && anchor.length
                        && !this._ignoreSyncRequest
                        && !this.isPageSelected(anchor)) {
                        this.setSelectedNode(anchor);
                        this.syncTocNode(anchor);
                    }
                    if (this._ignoreSyncRequest) {
                        this._ignoreSyncRequest = false;
                    }
                };
                TableOfContentsDocumentFeature.prototype.syncTocNode = function (anchor) {
                    if (this._isMobileToc) {
                        this.setSelectedNode(anchor);
                        var parentList = anchor.parent().closest("ul");
                        this.buildToCPage(parentList.attr("id"));
                    }
                    else {
                        // Only sync if there wasn't a previously selected node or the new node is different from the currently selected node
                        if (anchor.length && ((this._lastSelectedNode != null
                            && anchor.data("node-index") !== this._lastSelectedNode.data("node-index")) || this._lastSelectedNode == null)) {
                            this.selectNodeElement(anchor);
                            this.expandParents(anchor, false);
                            // scroll selected anchor into view (don't use scrollInToView here as that causes problems with the iframe)
                            $("html, body").animate({
                                scrollTop: anchor.offset().top
                            }, tableOfContentsConstants.slideToggleDelay);
                            this.updateNavigationButtons();
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype.expandParents = function (element, isAnimationEnabled, parents) {
                    if (parents === void 0) { parents = null; }
                    var parentListElement = element.parent().closest("ul");
                    if (parentListElement.length === 0) {
                        for (var i = parents.length - 1; i > -1; i--) {
                            this.expandOrCollapseNode(parents[i], isAnimationEnabled);
                        }
                        return;
                    }
                    else {
                        if (typeof parents === "undefined" || parents == null) {
                            parents = [];
                        }
                        // Only expand if it isn't the root, isn't already expanded or hasn't been procesed yet
                        if (!parentListElement.hasClass("i-root")) {
                            var spacer = parentListElement.prevAll("ins.i-spacer");
                            if (spacer.length === 0 || spacer.hasClass("i-expand")) {
                                parents.push(parentListElement);
                            }
                        }
                        this.expandParents(parentListElement, isAnimationEnabled, parents);
                    }
                };
                TableOfContentsDocumentFeature.prototype.buildToCPage = function (listId) {
                    if (listId === "i-root") {
                        listId = "i-root-node";
                    }
                    var tocPageId = listId;
                    if (listId === "i-root-node") {
                        listId = "i-root";
                    }
                    if ($.mobile.activePage.length && $.mobile.activePage.attr("id") === listId) {
                        // Current active ToC page so just highlight the selected Url
                        this._highlightSelectedNode();
                        return;
                    }
                    // If the ToC page already exists in the DOM then just change to it
                    if ($("div#" + tocPageId, this._rootSelector).length) {
                        $.mobile.changePage($("div#" + tocPageId, this._rootSelector), { dataUrl: tocPageId });
                        return;
                    }
                    var list = $("ul#" + listId, this._rootSelector).first();
                    var title = list.prev("a").text();
                    var backId = list
                        .parent()
                        .closest("ul")
                        .attr("id");
                    var newPage = $("<div data-role=\"page\" id=\"" + tocPageId + "\"></div>");
                    var header = $("<div data-role=\"header\" data-theme=\"b\"></div>");
                    if (backId === "i-root") {
                        backId = "i-root-node";
                    }
                    if (listId !== "i-root") {
                        // Add a header to all child pages
                        // Add a back button to the header (just icon no text)
                        $("<a href=\"#" + backId + "\" data-icon=\"arrow-l\" data-iconpos=\"notext\">Back</a>").appendTo(header);
                        $("<h1>" + title + "</h1>").appendTo(header);
                        header.appendTo(newPage);
                    }
                    var pageList = list.clone();
                    // remove any nested lists
                    pageList.find("ul").remove();
                    // remove any inline css (i.e. display: none on root page)
                    pageList.css("display", "");
                    // display as a JQM listview
                    pageList.attr("data-role", "listview");
                    // get rid of the temporary id from the cloned list
                    pageList.removeAttr("id");
                    // remove the ">" icon from links directly to pages
                    pageList.find("a:not(a[href^='#node-'])")
                        .closest("li")
                        .attr("data-icon", "false");
                    pageList.appendTo(newPage);
                    // Add the new page to the main container, mobile-ize it then transition to it
                    newPage.appendTo($("div#i-toc-container", this._rootSelector));
                    newPage.page();
                    $.mobile.changePage(newPage, { dataUrl: tocPageId });
                    // Highlight the selected node
                    this._highlightSelectedNode();
                };
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                TableOfContentsDocumentFeature.prototype._onBeforePageChange = function (event, pageData) {
                    // data.toPage will be the page href on the first call (div element on the second)
                    if (typeof pageData.toPage === "string") {
                        if (pageData.toPage.match(/(#node-(\d+)|#i-root-node)/)) {
                            var pageId = pageData.toPage.substring(pageData.toPage.lastIndexOf("#") + 1, pageData.toPage.length);
                            if ($("div#" + pageId).length === 0) {
                                // Build the new ToC page and prevent JQM from handling this event
                                this.buildToCPage(pageId);
                                event.preventDefault();
                            }
                        }
                        else {
                            event.preventDefault();
                        }
                    }
                };
                TableOfContentsDocumentFeature.prototype._onVirtualClick = function (event) {
                    var anchor = $(event.target);
                    // Intercept clicks to content links here as we need to query the anchor element
                    if (anchor.attr("href") != null
                        && anchor.attr("href").substring(0, 1) !== "#") {
                        event.preventDefault();
                        this.setSelectedNode(anchor);
                        this._highlightSelectedNode();
                        // Ignore the next ToC node sync request as it will come from the webframe when the content has finished loading
                        this._ignoreSyncRequest = true;
                        var webContentFrame = window.parent.parent;
                        if (typeof webContentFrame != "undefined") {
                            Content.Messaging.routeMessageToWindow(webContentFrame, Features.NavigationMessageNames.navigate, anchor.attr("href"));
                        }
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                TableOfContentsDocumentFeature.prototype._onPageChange = function (_, pageData) {
                    // Called after sucessfully switching to the next ToC page, if the page we came from isn't the
                    // root page then remove it from the DOM
                    if (typeof pageData.options.fromPage != "undefined"
                        && pageData.toPage.attr("id") !== pageData.options.fromPage.attr("id")) {
                        pageData.options.fromPage.remove();
                    }
                    this._highlightSelectedNode();
                };
                TableOfContentsDocumentFeature.prototype.constructMobileToC = function () {
                    var _this = this;
                    $(document)
                        .off("pagebeforechange.toc")
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        .on("pagebeforechange.toc", function (event, pageData) {
                        _this._onBeforePageChange(event, pageData);
                    });
                    $(document)
                        .off("pagechange.toc")
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        .on("pagechange.toc", function (event, pageData) {
                        _this._onPageChange(event, pageData);
                    });
                    this._rootSelector
                        .off("vclick.toc")
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        .on("vclick.toc", function (event) {
                        _this._onVirtualClick(event);
                    });
                    var tocNodeIndex = 0;
                    $("li>a", this._rootSelector).each(function (_, anchorElement) {
                        var ul = $(anchorElement).next("ul");
                        if (ul.length) {
                            if ($(anchorElement).attr("href") !== "#") {
                                // If the li has a link to a page then add a new li to the child ul so that it will be displayed
                                // as the first item on the new page
                                var listItem = $("<li></li>").prepend($(anchorElement).clone());
                                ul.prepend(listItem);
                            }
                            // Add an id to the list element which will be moved to the page div later
                            ul.attr("id", "node-" + tocNodeIndex);
                            // Point the anchor in the list item to the child list
                            $(anchorElement).attr("href", "#node-" + tocNodeIndex);
                            tocNodeIndex++;
                        }
                    });
                    // Index the anchor nodes again as they will have changed since loading the page
                    this._indexNodes();
                    // Add the root page
                    var rootPage = $("<div data-role=\"page\" id=\"i-root-node\"></div>");
                    var rootList = $("ul#i-root")
                        .clone()
                        .removeAttr("id")
                        .removeAttr("style")
                        .attr("data-role", "listview");
                    rootList.find("ul").remove();
                    rootList.find("a:not(a[href*='#node-'])")
                        .closest("li")
                        .attr("data-icon", "false");
                    rootList.appendTo(rootPage);
                    rootPage.appendTo($("div#i-toc-container", this._rootSelector));
                    // Manually initialize JQM
                    $.mobile.initializePage();
                };
                TableOfContentsDocumentFeature.prototype._highlightSelectedNode = function () {
                    $("div.ui-page a.ui-btn-active", this._rootSelector)
                        .removeClass("ui-btn-active");
                    $("div.ui-page li", this._rootSelector)
                        .find("a[data-node-index=\"" + this._selectedNodeIndex + "\"]")
                        .first()
                        .addClass("ui-btn-active");
                };
                TableOfContentsDocumentFeature.prototype._indexNodes = function () {
                    var _this = this;
                    var nodeIndex = 0;
                    $("ul.i-root a", this._rootSelector).each(function (_, element) {
                        if (_this._firstNodeIndex === -1
                            && $(element)
                                .attr("href")
                                .substring(0, 1) !== "#") {
                            _this._firstNodeIndex = nodeIndex;
                        }
                        $(element).attr("data-node-index", nodeIndex);
                        nodeIndex++;
                    });
                    this._lastNodeIndex = nodeIndex - 1;
                };
                return TableOfContentsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TableOfContentsDocumentFeature = TableOfContentsDocumentFeature;
            var TableOfContentsDocumentFeatureFactory = /** @class */ (function () {
                function TableOfContentsDocumentFeatureFactory() {
                }
                TableOfContentsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TableOfContentsDocumentFeature(documentInstance);
                };
                return TableOfContentsDocumentFeatureFactory;
            }());
            Features.TableOfContentsDocumentFeatureFactory = TableOfContentsDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TableOfContentsDocumentFeatureFactory());
// Disable JQM page initialization
$(document)
    .off("mobileinit.navigation")
    .on("mobileinit.navigation", function () {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    $.mobile.autoInitializePage = false;
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    $.mobile.defaultPageTransition = "none";
});
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var topFrameConstants = {
                iFrameResizeDelay: 500,
                navBarSwingDuration: 600,
                navBarCloseDuration: 400,
                syncDelay: 500,
                widthDivisor: 0.5
            };
            var TopFrameDocumentFeature = /** @class */ (function (_super) {
                __extends(TopFrameDocumentFeature, _super);
                function TopFrameDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.defaultTopic = null;
                    _this.baseTitle = null;
                    _this._rootSelector = null;
                    _this._responsiveProfileName = "desktop";
                    _this._isIframeResizeTimerDisabled = false;
                    _this._isEnabled = false;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    _this.layout = null;
                    return _this;
                }
                TopFrameDocumentFeature._fixSubPixelWidth = function (element) {
                    element.width(Math.floor($(window).width() * element.data("widthDivisor")));
                };
                TopFrameDocumentFeature.prototype.getName = function () {
                    return "TopFrame";
                };
                TopFrameDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        this.baseTitle = document.title;
                    }
                    this._isEnabled = ($("#i-top-frame-container", rootSelector).length > 0);
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                TopFrameDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                };
                TopFrameDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    var _this = this;
                    if (!this._isEnabled) {
                        return;
                    }
                    this._responsiveProfileName = configuration.profileName;
                    if (configuration.profileName === "desktop") {
                        // Desktop
                        this.layout = $(".i-layout-container", this.documentInstance.rootSelector).layout({
                            resizeWhileDragging: true,
                            /* eslint-disable-next-line @typescript-eslint/naming-convention */
                            west__size: 270,
                            maskIframesOnResize: true
                        });
                        this.onContentLoaded(null);
                    }
                    else {
                        // Tablet & Mobile
                        $("iframe#i-nav", this.documentInstance.rootSelector)
                            .css("left", -$(window).width())
                            .css("display", "block");
                        $(window).resize(function () {
                            if ($("iframe#i-nav", _this.documentInstance.rootSelector).css("left") !== "0px") {
                                $("iframe#i-nav", _this.documentInstance.rootSelector).css("left", -$(window).width());
                            }
                            TopFrameDocumentFeature._fixSubPixelWidth($("iframe#i-nav", _this.documentInstance.rootSelector));
                        });
                        // Scroll back to the top of page on a new page load
                        $("iframe#i-content", this._rootSelector)
                            .on("load.topframe", function () {
                            _this._rootSelector.scrollTop(0);
                        });
                        this.onContentLoaded(null);
                        // Resize the iframes and set a timer to keep them sized
                        Content.Browser.resizeIFrames(this._rootSelector);
                        setInterval(function () {
                            if (!_this._isIframeResizeTimerDisabled) {
                                var maxHeight = Content.Browser.resizeIFrames(_this._rootSelector);
                                if (maxHeight > 0 && maxHeight !== $("body").height()) {
                                    _this._rootSelector.height(maxHeight);
                                }
                            }
                        }, topFrameConstants.iFrameResizeDelay);
                    }
                    this.navigate(this.getDefaultTopic());
                };
                TopFrameDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.updateNavigationButtons:
                            // Route to webnav
                            Content.Messaging.routeMessageToFrameElement("i-nav", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.loaded:
                            this.onContentLoaded(message.messageData);
                            // Forward message to webnav
                            Content.Messaging.routeMessageToFrameElement("i-nav", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.updatePageTitle:
                            this.updatePageTitle(message.messageData);
                            break;
                        case Content.DocumentMessageNames.quickSearch:
                        case Content.DocumentMessageNames.searchHighlightComplete:
                        case Features.NavigationMessageNames.insertRemoveHighlighting:
                            // Pass to content window
                            Content.Messaging.routeMessageToFrameElement("i-content", message.messageType, message.messageData);
                            break;
                        case Features.NavigationMessageNames.navigate:
                            this.navigate(message.messageData);
                            break;
                        case Features.NavigationMessageNames.openNavigationPane:
                            this.openNavigationPane(message.messageData);
                            break;
                        case Features.NavigationMessageNames.closeNavigationPane:
                            this.closeNavigationPane();
                            break;
                        // No default
                    }
                };
                TopFrameDocumentFeature.prototype.openNavigationPane = function (messageData) {
                    var _this = this;
                    this._isIframeResizeTimerDisabled = true;
                    // Activate the desired item in the navigation bar
                    Content.Messaging.routeMessageToFrameElement("i-nav", Features.NavigationMessageNames.select, messageData);
                    switch (this._responsiveProfileName) {
                        case "mobile":
                            $("#i-nav", this.documentInstance.rootSelector).css("width", "100%");
                            break;
                        case "tablet":
                            $("iframe#i-nav", this.documentInstance.rootSelector)
                                .css("width", "50%")
                                .data("widthDivisor", topFrameConstants.widthDivisor);
                            TopFrameDocumentFeature._fixSubPixelWidth($("iframe#i-nav", this.documentInstance.rootSelector));
                            break;
                        // No default
                    }
                    if (this._responsiveProfileName !== "desktop") {
                        // Resize webnav and webcontent to their content height
                        Content.Browser.resizeIFrames(this._rootSelector, true);
                        // Show the gray overlay
                        $("#i-busy", this.documentInstance.rootSelector).show();
                        // Bring in the navbar
                        $("iframe#i-nav", this.documentInstance.rootSelector)
                            .css("visibility", "visible")
                            .animate({ left: "0" }, topFrameConstants.navBarSwingDuration, "swing", function () {
                            _this._isIframeResizeTimerDisabled = false;
                        });
                    }
                };
                TopFrameDocumentFeature.prototype.closeNavigationPane = function () {
                    var _this = this;
                    if (this._responsiveProfileName === "desktop") {
                        return;
                    }
                    if ($("iframe#i-nav", this.documentInstance.rootSelector).css("left") === "0px") {
                        this._isIframeResizeTimerDisabled = true;
                        // Close the navbar
                        $("iframe#i-nav", this.documentInstance.rootSelector).animate({
                            left: "-" + $("iframe#i-nav").css("width")
                        }, topFrameConstants.navBarCloseDuration, "swing", function () {
                            $("iframe#i-nav", _this.documentInstance.rootSelector)
                                .css("visibility", "hidden");
                            // Remove the gray overlay
                            $("#i-busy", _this.documentInstance.rootSelector).hide();
                            // Resize the navbar back to default - window height
                            $("iframe#i-nav", _this.documentInstance.rootSelector).height($(window).height())
                                .data("last-height", $(window).height());
                            // Tell the navbar to shrink it's frame sizes
                            Content.Messaging.routeMessageToFrameElement("i-nav", Features.NavigationMessageNames.shrinkIFrames, null);
                            _this._isIframeResizeTimerDisabled = false;
                        });
                    }
                };
                TopFrameDocumentFeature.prototype.getCurrentPageName = function () {
                    var location = Content.Browser.getLocationInfo();
                    if (location.hash !== "") {
                        return location.hash.substring(1);
                    }
                    else {
                        return this.getDefaultTopic();
                    }
                };
                TopFrameDocumentFeature.prototype.onContentLoaded = function (url) {
                    var _this = this;
                    this.updateLocation(url);
                    setTimeout(function () {
                        Content.Messaging.routeMessageToFrameElement("i-nav", Features.NavigationMessageNames.syncTableOfContents, _this.getCurrentPageName());
                    }, topFrameConstants.syncDelay);
                    if (this._responsiveProfileName !== "desktop") {
                        Content.Messaging.routeMessageToFrameElement("i-content", Content.DocumentMessageNames.insertNavigationHeader, null);
                    }
                };
                TopFrameDocumentFeature.prototype.updatePageTitle = function (pageTitle) {
                    if (pageTitle != null) {
                        document.title = this.baseTitle + " - " + pageTitle;
                    }
                };
                TopFrameDocumentFeature.prototype.updateLocation = function (url) {
                    if (url != null) {
                        var location_1 = Content.Browser.getLocationInfo();
                        var pageName = url.substring(url.lastIndexOf("/") + 1);
                        if ("#" + pageName !== location_1.hash && "?" + pageName !== location_1.search) {
                            Content.Browser.replaceLocation(pageName);
                        }
                    }
                };
                TopFrameDocumentFeature.prototype.getDefaultTopic = function () {
                    var topic = null;
                    var location = Content.Browser.getLocationInfo();
                    var qs = location.search;
                    if (qs != null && qs.length > 0) {
                        topic = qs.substring(1) + location.hash;
                    }
                    else if (location.hash != null && location.hash.length > 0) {
                        topic = location.hash.substring(1);
                    }
                    if (topic == null || this.isUrl(topic)) {
                        topic = this.defaultTopic;
                    }
                    return topic;
                };
                TopFrameDocumentFeature.prototype.isUrl = function (possibleUrl) {
                    return /^[\d\D\.]*:\/\//.test(possibleUrl);
                };
                TopFrameDocumentFeature.prototype.navigate = function (messageData) {
                    // ToC previous/next navigation
                    if (messageData === "next" || messageData === "previous") {
                        Content.Messaging.routeMessageToFrameElement("i-nav", "navigate", messageData);
                    }
                    else {
                        // Navigate to specific page
                        var location_2 = Content.Browser.getLocationInfo();
                        if ($("#i-content", this._rootSelector).attr("src") !== messageData
                            || (location_2.hash.length > 0 && location_2.hash.substring(1) !== messageData)
                            || (location_2.search.length > 0 && location_2.search.substring(1) !== messageData)
                            || (location_2.hash.length === 0 && location_2.search.length === 0)) {
                            // Default content frame height back to the window height - to stop the content frame
                            //  growing to the largest doc size over time
                            if (this._responsiveProfileName !== "desktop") {
                                $("#i-content", this._rootSelector).height($(window).height());
                            }
                            $("#i-content", this._rootSelector).attr("src", messageData);
                        }
                        if (this._responsiveProfileName !== "desktop") {
                            this.closeNavigationPane();
                        }
                    }
                };
                /**
                 * Forces a specific responsive display mode when the document loads. The forced display mode is set in local storage
                 *  so will be used by all subsequent page loads until it is reset.
                 */
                TopFrameDocumentFeature.prototype.setForcedDisplayMode = function (displayMode) {
                    this.documentInstance.getFeatureByName("Responsive").setForcedDisplayMode(displayMode);
                    if (displayMode != null) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var overrides_1 = Innovasys.overrides
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            || Innovasys.settings
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            || (Innovasys.settings = Innovasys.overrides = {});
                        $.extend(overrides_1, {
                            forcedDisplayMode: displayMode
                        });
                    }
                };
                return TopFrameDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TopFrameDocumentFeature = TopFrameDocumentFeature;
            var TopFrameDocumentFeatureFactory = /** @class */ (function () {
                function TopFrameDocumentFeatureFactory() {
                }
                TopFrameDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TopFrameDocumentFeature(documentInstance);
                };
                return TopFrameDocumentFeatureFactory;
            }());
            Features.TopFrameDocumentFeatureFactory = TopFrameDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TopFrameDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var searchConstants = {
                enterKeyCode: 13,
                minOperatorLength: 4
            };
            var SearchFile = /** @class */ (function () {
                /* eslint-disable-next-line no-useless-constructor */
                function SearchFile(url, title, rank) {
                    this.url = url;
                    this.title = title;
                    this.rank = rank;
                }
                return SearchFile;
            }());
            Features.SearchFile = SearchFile;
            var SearchTermWordMatch = /** @class */ (function () {
                /* eslint-disable-next-line no-useless-constructor */
                function SearchTermWordMatch(searchTerm, matchedWords) {
                    this.searchTerm = searchTerm;
                    this.matchedWords = matchedWords;
                }
                return SearchTermWordMatch;
            }());
            Features.SearchTermWordMatch = SearchTermWordMatch;
            var SearchResult = /** @class */ (function () {
                function SearchResult(fileIndex, rank, keywords, searchTerms) {
                    this.fileIndex = fileIndex;
                    this.rank = rank;
                    this.keywords = keywords;
                    this.searchTerms = searchTerms;
                    this.rank = rank;
                }
                return SearchResult;
            }());
            Features.SearchResult = SearchResult;
            var SearchDocumentFeature = /** @class */ (function (_super) {
                __extends(SearchDocumentFeature, _super);
                function SearchDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._webSearchPendingHighlight = null;
                    _this._rootSelector = null;
                    _this._isEnabled = false;
                    _this._isFullTextSearchPositionDataAvailable = false;
                    _this._isFullTextSearchObjects = false;
                    _this._isFullTextSearchFrameless = false;
                    _this._results = null;
                    _this._clickedResult = null;
                    return _this;
                }
                SearchDocumentFeature.escapeForRegEx = function (source) {
                    return source.replace(/[-\/\\^$+.()|[\]{}]/g, "\\$&");
                };
                SearchDocumentFeature.prototype.getName = function () {
                    return "Search";
                };
                SearchDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        this._rootSelector = rootSelector;
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var overrides_2 = (Innovasys.overrides || Innovasys.settings);
                        if (overrides_2 != null && overrides_2.isFullTextSearchPositionDataAvailable) {
                            this._isFullTextSearchPositionDataAvailable = true;
                        }
                        if (overrides_2 != null && overrides_2.isFullTextSearchObjects) {
                            this._isFullTextSearchObjects = true;
                        }
                        if (overrides_2 != null && overrides_2.isFullTextSearchFrameless) {
                            this._isFullTextSearchFrameless = true;
                        }
                    }
                    if ($("#i-search-container", this._rootSelector).length > 0) {
                        this._isEnabled = true;
                        $("#i-search", rootSelector)
                            .off("keyup.search")
                            .on("keyup.search", function (event) {
                            if (event.keyCode === searchConstants.enterKeyCode) {
                                $("#i-execute-search").click();
                            }
                        });
                        $("#i-execute-search", rootSelector)
                            .off("click.search")
                            .on("click.search", function () {
                            _this.executeSearch();
                        });
                        $("#i-search-container", this._rootSelector)
                            .off("click.search", ".i-result")
                            .on("click.search", ".i-result", function (event) {
                            event.preventDefault();
                            _this.showSearchResult($(event.target).attr("href"), parseInt($(event.target).attr("data-result-index"), 10));
                        });
                    }
                    var querystringSearchText = Content.Browser.getQueryStringParameter("query");
                    if (querystringSearchText != null && querystringSearchText !== "") {
                        $("#i-search", rootSelector).val(querystringSearchText);
                        this.executeSearch();
                    }
                };
                SearchDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName !== "desktop") {
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-execute-search", Content.ResponsiveClickTargetKind.block));
                    }
                };
                SearchDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (!this._isEnabled) {
                        return;
                    }
                    if (configuration.profileName !== "desktop") {
                        $("#i-highlight", this._rootSelector).attr("checked", "true");
                    }
                };
                SearchDocumentFeature.prototype.executeSearch = function () {
                    // Show searching div
                    $("#i-search-container", this._rootSelector).hide();
                    $("#i-searching-overlay", this._rootSelector).show();
                    // do search
                    var searchResult = this.buildSearchResults();
                    // Show resuls div
                    $("#i-searching-overlay", this._rootSelector).hide();
                    $("#i-search-container", this._rootSelector).show();
                    // show results
                    if (searchResult === true) {
                        // show resulta div
                        $("#i-results", this._rootSelector).show();
                    }
                };
                SearchDocumentFeature.prototype.buildSearchResults = function () {
                    // get search string
                    var searchText = $("#i-search", this._rootSelector).val();
                    if (searchText.length === 0) {
                        return false;
                    }
                    // make lowercase for easy comparison later on
                    searchText = searchText.toLowerCase();
                    // tokenise
                    var tokens = searchText.split(" ");
                    // build keywords array & query string
                    var query = "";
                    var lastTokenWasOperator = true;
                    var lastTokenWasKeyword = false;
                    var phrase = null;
                    var searchTermIndex = 0;
                    var searchTerms = [];
                    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                        var token = tokens_1[_i];
                        if (token.length > 0) {
                            // strip out any delimiters & whitespace
                            token = token.replace(new RegExp(",", "ig"), "");
                            if (phrase != null) {
                                phrase += (" " + token);
                                if (token.charAt(token.length - 1) === "\"") {
                                    // Last word in the phrase. Set as the token and clear.
                                    token = phrase.substring(1, phrase.length - 1);
                                    phrase = null;
                                }
                                else {
                                    token = null;
                                }
                            }
                            else if (token.charAt(0) === "\"") {
                                // First word of a phrase
                                phrase = token;
                                token = null;
                            }
                            if (token != null) {
                                // add to array
                                if ((token === "or") || (token === "and")) {
                                    // only add it if not just had an operator
                                    if (lastTokenWasOperator === false) {
                                        // add to the query string
                                        if (token === "or") {
                                            query += " || ";
                                        }
                                        else if (token === "and") {
                                            query += " && ";
                                        }
                                        lastTokenWasOperator = true;
                                        lastTokenWasKeyword = false;
                                    }
                                }
                                else {
                                    // we just had a keyword ?
                                    if (lastTokenWasKeyword) {
                                        // add default OR operator
                                        query += " || ";
                                    }
                                    // add to query string
                                    query += ("(searchTerms.indexOf(\"" + token + "\") >= 0)");
                                    lastTokenWasOperator = false;
                                    lastTokenWasKeyword = true;
                                    // add to keywords array
                                    searchTerms[searchTermIndex] = token;
                                    searchTermIndex++;
                                }
                            }
                        }
                    }
                    if (searchTerms.length === 0) {
                        return false;
                    }
                    if (query !== "" && query.length > searchConstants.minOperatorLength) {
                        // Handle the case where the last word is an operator
                        if (query.substring(query.length - searchConstants.minOperatorLength) === " && "
                            || query.substring(query.length - searchConstants.minOperatorLength) === " || ") {
                            query = query.substring(0, query.length - searchConstants.minOperatorLength);
                        }
                    }
                    // load files & stopwords arrays
                    var searchFiles = [];
                    var allWords = [];
                    if (this._isFullTextSearchObjects) {
                        // Pass constructor to initialization function
                        Features.buildSearchFilesAndKeywords(searchFiles, allWords, SearchFile);
                    }
                    else {
                        // Pass 2 arrays and build SearchFile array from them
                        var indexFiles = [];
                        var indexTitles = [];
                        Features.buildSearchIndexArray(indexFiles, indexTitles, allWords);
                        for (var fileIndex = 0; fileIndex < indexFiles.length; fileIndex++) {
                            var newSearchFile = new SearchFile(indexFiles[fileIndex], indexTitles[fileIndex], 0);
                            searchFiles[fileIndex] = newSearchFile;
                        }
                    }
                    // build list of files containing keywords
                    var searchResults = this.populateSearchResults(searchFiles, allWords, searchTerms);
                    // build results list
                    searchResults = this.buildResultsArray(query, searchResults);
                    // write results to document
                    this.outputResults(searchResults);
                    this._results = searchResults;
                    // return success
                    return true;
                };
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                SearchDocumentFeature.prototype.populateSearchResults = function (searchFiles, allWords, searchTerms) {
                    var searchResults = [];
                    var _loop_1 = function (searchTerm) {
                        var searchTermWordMatch = new SearchTermWordMatch(searchTerm, []);
                        if (searchTerm.indexOf(" ") !== -1) {
                            // Phrase - find several matching words where the file matches the first word, and the
                            //  relative position is the same as in the phrase
                            var searchTermWords = searchTerm.split(" ");
                            var firstSearchTermWord_1 = searchTermWords[0];
                            var baseResults = this_1.populateSearchResults(searchFiles, allWords, [firstSearchTermWord_1]);
                            var _loop_2 = function (searchTermWord) {
                                var results = this_1.populateSearchResults(searchFiles, allWords, [searchTermWord]);
                                baseResults = $.map(baseResults, function (baseResult) {
                                    if (typeof baseResult != "undefined") {
                                        // A search result for secondary phrase words requires that the words be in a file we
                                        //  have already found at the base result + searchTermWordIndex
                                        var matchingBaseResults = $.map(results, function (searchResult) {
                                            if (typeof searchResult !== "undefined" && searchResult.fileIndex === baseResult.fileIndex) {
                                                // Look for a match for any of the keywords in this result
                                                var thisKeywords = searchResult.keywords.split(",");
                                                var searchTermWordIndex_1 = 0;
                                                var _loop_3 = function (thisKeyword) {
                                                    if (thisKeyword !== "") {
                                                        // Matching position?
                                                        var matchingBasePositions = 
                                                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                        $.map((baseResult.keywordPositions[("_" + firstSearchTermWord_1)]), function (basePosition) {
                                                            var matchingKeywordPositions = $.map(searchResult.keywordPositions[("_" + thisKeyword)], function (position) {
                                                                if (position === (basePosition + searchTermWordIndex_1)) {
                                                                    return position;
                                                                }
                                                                else {
                                                                    return null;
                                                                }
                                                            });
                                                            if (matchingKeywordPositions.length > 0) {
                                                                return basePosition;
                                                            }
                                                            else {
                                                                return null;
                                                            }
                                                        });
                                                        if (matchingBasePositions.length > 0) {
                                                            // Found a match at the next word position in the same file
                                                            // Add the keyword and rank to the base result
                                                            baseResult.searchTerms = searchTerm + ",";
                                                            baseResult.keywords += searchResult.keywords;
                                                            baseResult.rank += searchResult.rank;
                                                            return { value: baseResult };
                                                        }
                                                    }
                                                    searchTermWordIndex_1++;
                                                };
                                                for (var _i = 0, thisKeywords_1 = thisKeywords; _i < thisKeywords_1.length; _i++) {
                                                    var thisKeyword = thisKeywords_1[_i];
                                                    var state_2 = _loop_3(thisKeyword);
                                                    if (typeof state_2 === "object")
                                                        return state_2.value;
                                                }
                                            }
                                            return null;
                                        });
                                        if (matchingBaseResults.length > 0) {
                                            return baseResult;
                                        }
                                        else {
                                            return null;
                                        }
                                    }
                                    return null;
                                });
                            };
                            for (var _i = 0, searchTermWords_1 = searchTermWords; _i < searchTermWords_1.length; _i++) {
                                var searchTermWord = searchTermWords_1[_i];
                                _loop_2(searchTermWord);
                            }
                            return { value: baseResults };
                        }
                        else if (searchTerm.indexOf("*") !== -1 || searchTerm.indexOf("?") !== -1) {
                            // Wildcard - find potentially several matching words
                            var searchTermRegExp = new RegExp("^" + SearchDocumentFeature.escapeForRegEx(searchTerm)
                                .replace(/\*/g, ".*")
                                .replace(/\?/g, ".") + "$", "i");
                            for (var word in allWords) {
                                if (allWords.hasOwnProperty(word) && word.substring(1).match(searchTermRegExp) != null) {
                                    // Matched
                                    searchTermWordMatch.matchedWords.push(word.substring(1));
                                }
                            }
                            // Sort on matched word length (reverse)
                            searchTermWordMatch.matchedWords
                                = searchTermWordMatch.matchedWords.sort(function (a, b) { return b.length - a.length; });
                        }
                        else {
                            // Single word - just lookup in index and if found add to list of words
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            if (typeof allWords["_" + searchTerm] !== "undefined") {
                                searchTermWordMatch.matchedWords.push(searchTerm);
                            }
                        }
                        // All of the above will yield one or more words. We then go through the matched words, building a search result
                        //  entry with a ranking value.
                        if (searchTermWordMatch != null) {
                            var searchTermWordMatchIndex = 0;
                            for (var _a = 0, _b = searchTermWordMatch.matchedWords; _a < _b.length; _a++) {
                                var matchedWord = _b[_a];
                                // get indices of files containing word
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                var matchedWordData = allWords["_" + searchTermWordMatch.matchedWords[searchTermWordMatchIndex]];
                                // tokenize indices
                                var fileIndexes = matchedWordData.split(",");
                                for (var _c = 0, fileIndexes_1 = fileIndexes; _c < fileIndexes_1.length; _c++) {
                                    var fileIndexValue = fileIndexes_1[_c];
                                    var fileIndex = void 0;
                                    var rank = 0;
                                    var positions = null;
                                    if (this_1._isFullTextSearchPositionDataAvailable) {
                                        // Store file index, position data and a rank value in the search result
                                        fileIndex = parseInt(fileIndexValue.split(":")[0], 10);
                                        var rankAsString = fileIndexValue.split(":")[1];
                                        positions = $.map(rankAsString.split("|"), function (positionAsString) { return parseInt(positionAsString, 10); });
                                        if (positions.length > 0) {
                                            rank = positions[0];
                                        }
                                    }
                                    else {
                                        // No positional data available - we store just the file index in the search result
                                        fileIndex = parseInt(fileIndexValue, 10);
                                    }
                                    var locatedSearchResult = null;
                                    if (typeof searchResults[fileIndex] === "undefined") {
                                        // New file not encountered yet
                                        locatedSearchResult = new SearchResult(fileIndex, rank, matchedWord + ",", searchTermWordMatch.searchTerm + ",");
                                        if (typeof searchFiles[fileIndex] != "undefined") {
                                            // Store url and title
                                            locatedSearchResult.searchFile = searchFiles[fileIndex];
                                        }
                                        searchResults[fileIndex] = locatedSearchResult;
                                    }
                                    else {
                                        // Existing file, add to the rank
                                        locatedSearchResult = searchResults[fileIndex];
                                        if (locatedSearchResult.keywords.indexOf(matchedWord + ",") === -1) {
                                            // New word match in this file
                                            locatedSearchResult.rank += rank;
                                            locatedSearchResult.keywords += (matchedWord + ",");
                                        }
                                        if (locatedSearchResult.searchTerms.indexOf(searchTermWordMatch.searchTerm + ",") === -1) {
                                            // New search term match in this file
                                            locatedSearchResult.rank += rank;
                                            locatedSearchResult.searchTerms += (searchTermWordMatch.searchTerm + ",");
                                        }
                                    }
                                    if (positions != null) {
                                        if (locatedSearchResult.keywordPositions == null) {
                                            locatedSearchResult.keywordPositions = [];
                                        }
                                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                        locatedSearchResult.keywordPositions[("_" + matchedWord)] = positions;
                                    }
                                }
                                searchTermWordMatchIndex++;
                            }
                        }
                    };
                    var this_1 = this;
                    // build lookup arrays
                    for (var _i = 0, searchTerms_1 = searchTerms; _i < searchTerms_1.length; _i++) {
                        var searchTerm = searchTerms_1[_i];
                        var state_1 = _loop_1(searchTerm);
                        if (typeof state_1 === "object")
                            return state_1.value;
                    }
                    // Return array ordered by rank
                    if (this._isFullTextSearchPositionDataAvailable) {
                        searchResults = searchResults.sort(function (a, b) {
                            var value = a.rank - b.rank;
                            if (value === 0) {
                                // Use file rank to disambiguate
                                value = a.searchFile.rank - b.searchFile.rank;
                                if (value === 0) {
                                    return a.fileIndex - b.fileIndex;
                                }
                            }
                            return value;
                        });
                    }
                    return searchResults;
                };
                SearchDocumentFeature.prototype.buildResultsArray = function (query, searchResults) {
                    var results = [];
                    for (var _i = 0, searchResults_1 = searchResults; _i < searchResults_1.length; _i++) {
                        var searchResult = searchResults_1[_i];
                        if (typeof searchResult !== "undefined") {
                            // Note: Used in eval below
                            var searchTerms = searchResult.searchTerms;
                            var result = false;
                            try {
                                /* eslint-disable-next-line no-eval */
                                result = eval(query);
                            }
                            catch (ex) {
                                // Entered term caused a Javascript syntax error
                            }
                            if (result) {
                                results.push(searchResult);
                            }
                        }
                    }
                    return results;
                };
                SearchDocumentFeature.prototype.getPhrase = function (name) {
                    var span = $("#phrase_" + name);
                    if (span.length > 0) {
                        return span.html();
                    }
                };
                SearchDocumentFeature.prototype.outputResults = function (searchResults) {
                    // init table html
                    var tableHtml = "<hr /><p class=\"i-search-title\">" + this.getPhrase("Search_SearchResults") + "</p>";
                    tableHtml += "<table class=\"i-result-list\">";
                    // add results to table
                    var resultCount = 0;
                    for (var _i = 0, searchResults_2 = searchResults; _i < searchResults_2.length; _i++) {
                        var searchResult = searchResults_2[_i];
                        var className = void 0;
                        if (typeof searchResult !== "undefined") {
                            if (resultCount === 0) {
                                className = "i-top-row";
                            }
                            else if (resultCount === searchResults.length) {
                                className = "i-bottom-row";
                            }
                            else {
                                className = "i-inner-row";
                            }
                            // add row text
                            tableHtml += "<tr><td class=\"" + className + "\">" + (resultCount + 1) + ":</td><td class=\"" + className + "\"><a class=\"i-result btn\" " + (!this._isFullTextSearchFrameless ? "target=\"i-content\" " : "") + "href=\"" + searchResult.searchFile.url + "\" data-result-index=\"" + resultCount + "\">" + searchResult
                                .searchFile.title + "</a></td></tr>";
                            // incr total
                            resultCount++;
                        }
                    }
                    // add footer
                    tableHtml += "</table><p>" + resultCount + " " + this.getPhrase("Search_ResultCount") + "</p>";
                    // set it
                    $("#i-results", this._rootSelector).html(tableHtml);
                };
                SearchDocumentFeature.prototype.showSearchResult = function (hRef, resultIndex) {
                    var highlight = $("#i-highlight", this._rootSelector);
                    var webframe = null;
                    if (window.parent != null && window.parent.parent != null) {
                        webframe = window.parent.parent;
                    }
                    if (highlight.is(":checked")) {
                        // message listener takes care of highlight when the content loads
                        this._webSearchPendingHighlight = hRef;
                    }
                    if (!this._isFullTextSearchFrameless && webframe != null) {
                        Content.Messaging.routeMessageToWindow(webframe, Features.NavigationMessageNames.navigate, hRef);
                        Content.Messaging.routeMessageToWindow(webframe, Features.NavigationMessageNames.closeNavigationPane, null);
                        if (resultIndex != null) {
                            this._clickedResult = this._results[resultIndex];
                        }
                    }
                    else {
                        if (resultIndex != null && highlight.is(":checked")) {
                            var clickedResult = this._results[resultIndex];
                            hRef = hRef + "?highlight=" + encodeURIComponent(clickedResult.keywords);
                        }
                        Content.Browser.navigateTo(hRef, false);
                    }
                };
                SearchDocumentFeature.prototype.highlightContentFrame = function () {
                    Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.resetQuickSearch, null);
                    if (this._clickedResult != null) {
                        var keywords = this._clickedResult.keywords.split(",");
                        for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
                            var keyword = keywords_1[_i];
                            if (keyword != null && keyword !== "") {
                                Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.quickSearch, keyword);
                            }
                        }
                    }
                    Content.Messaging.routeMessageToWindow(parent, Content.DocumentMessageNames.searchHighlightComplete, null);
                };
                SearchDocumentFeature.prototype.getKeywordArray = function () {
                    // get search string
                    var searchText = $("#i-search", this._rootSelector).val();
                    if (searchText.length === 0) {
                        return null;
                    }
                    // make lowercase for easy comparison later on
                    searchText = searchText.toLowerCase();
                    // tokenise
                    var tokens = searchText.split(" ");
                    // build keywords array
                    var keywords = [];
                    for (var _i = 0, tokens_2 = tokens; _i < tokens_2.length; _i++) {
                        var token = tokens_2[_i];
                        if (token.length > 0) {
                            // strip out any delimiters & whitespace
                            token = token.replace(new RegExp("\'", "ig"), "");
                            token = token.replace(new RegExp("\"", "ig"), "");
                            token = token.replace(new RegExp(",", "ig"), "");
                            // add to array
                            if (!((token === "or") || (token === "and"))) {
                                // add to keywords array
                                keywords.push(token);
                            }
                        }
                    }
                    return keywords;
                };
                SearchDocumentFeature.prototype.onMessage = function (message) {
                    if (!this._isEnabled) {
                        return;
                    }
                    switch (message.messageType) {
                        case Features.NavigationMessageNames.activated:
                            $("#i-search", this._rootSelector).focus();
                            break;
                        case Features.NavigationMessageNames.loaded:
                            if (message.messageData.indexOf(this._webSearchPendingHighlight) !== -1) {
                                // If the content loaded is our pending search navigate, apply the search highlights
                                this.highlightContentFrame();
                            }
                            this._webSearchPendingHighlight = null;
                            break;
                        case Content.DocumentMessageNames.quickSearch:
                        case Content.DocumentMessageNames.searchHighlightComplete:
                            // Pass to parent frame handler and onwards to the content frame
                            Content.Messaging.routeMessageToWindow(parent, message.messageType, message.messageData);
                            break;
                        // No default
                    }
                };
                return SearchDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.SearchDocumentFeature = SearchDocumentFeature;
            var SearchDocumentFeatureFactory = /** @class */ (function () {
                function SearchDocumentFeatureFactory() {
                }
                SearchDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new SearchDocumentFeature(documentInstance);
                };
                return SearchDocumentFeatureFactory;
            }());
            Features.SearchDocumentFeatureFactory = SearchDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.SearchDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var indexConstants = {
                enterKeyCode: 13,
                heightMargin: 20
            };
            var IndexDocumentFeature = /** @class */ (function (_super) {
                __extends(IndexDocumentFeature, _super);
                function IndexDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._isFilterVisibility = false;
                    _this._isEnabled = false;
                    _this._rootSelector = null;
                    return _this;
                }
                IndexDocumentFeature.prototype.getName = function () {
                    return "Index";
                };
                IndexDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var overrides_3 = (Innovasys.overrides || Innovasys.settings);
                        if (overrides_3 != null && overrides_3.isIndexFilterVisibility) {
                            this._isFilterVisibility = true;
                        }
                    }
                    this._rootSelector = rootSelector;
                    if ($("#i-index-container", rootSelector).length > 0) {
                        this._isEnabled = true;
                        $("#i-index-container #i-search", this._rootSelector)
                            .off("keyup.index")
                            .on("keyup.index", function (event) {
                            if (event.keyCode === indexConstants.enterKeyCode) {
                                var selectedHref = $("a.i-selected", _this._rootSelector)
                                    .filter("[href]")
                                    .first()
                                    .attr("href");
                                if (selectedHref != null) {
                                    // Route message to parent window to navigate to the selected entry
                                    Content.Messaging.routeMessageToWindow(parent, Features.NavigationMessageNames.navigate, selectedHref);
                                }
                            }
                            else {
                                setTimeout(function () {
                                    _this.findIndexEntry();
                                }, 1);
                            }
                        });
                        // Resize the results and search boxes
                        $("#i-index-container", rootSelector)
                            .off("resize.index")
                            .on("resize.index", function () {
                            setTimeout(function () {
                                var indexContainer = $("#i-index-container");
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                indexContainer.css("height", indexContainer.height() - indexConstants.heightMargin + "px");
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                indexContainer.css("width", indexContainer.width() + "px");
                            }, 1);
                        });
                    }
                };
                IndexDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (this._isEnabled && configuration.profileName !== "desktop") {
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget("#i-index-body a", Content.ResponsiveClickTargetKind.block));
                    }
                };
                IndexDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    if (this._isEnabled && configuration.profileName !== "desktop") {
                        this._isFilterVisibility = true;
                        // Close the navigation pane when a result is selected
                        $("#i-index-body", this._rootSelector)
                            .off("click.index", "a")
                            .on("click.index", "a", function () {
                            if (window.parent != null && window.parent.parent != null) {
                                Content.Messaging.routeMessageToWindow(window.parent.parent, Features.NavigationMessageNames.closeNavigationPane, null);
                            }
                        });
                    }
                };
                IndexDocumentFeature.prototype.findIndexEntry = function () {
                    var term = $("#i-index-container #i-search", this._rootSelector).val();
                    term = term.toLowerCase();
                    if (this._isFilterVisibility) {
                        // Filter the list to only show matching
                        var regex_1 = new RegExp("^" + term, "i");
                        $("a,span", this._rootSelector.find("#i-index-body")).each(function (_, element) {
                            if ($(element)
                                .text()
                                .match(regex_1)) {
                                $(element).css("display", "inline-block");
                                $(element)
                                    .next("br")
                                    .css("display", "inline");
                                $(element)
                                    .next("blockquote")
                                    .css("display", "block");
                            }
                            else {
                                $(element).css("display", "none");
                                $(element)
                                    .next("br")
                                    .css("display", "none");
                                $(element)
                                    .next("blockquote")
                                    .css("display", "none");
                            }
                        });
                        $("a,span", this._rootSelector.find("#i-index-body")).each(function (index, element) {
                            if ($(element).css("display") === "inline-block") {
                                // Make sure the parents are visible also
                                $(element)
                                    .parents("blockquote")
                                    .each(function (_, blockQuoteElement) {
                                    var parentElement = $(blockQuoteElement).prev("a,span");
                                    parentElement.css("display", "inline-block");
                                    parentElement.next("br").css("display", "inline");
                                    parentElement.next("blockquote").css("display", "block");
                                });
                            }
                        });
                    }
                    else {
                        $(".i-selected", this._rootSelector).removeClass("i-selected");
                        if (term != null) {
                            // Find any matching terms
                            var anchor = $("a,span", this._rootSelector.find("#i-index-body"))
                                .filter(function (_, element) {
                                if (term != null && term !== ""
                                    && $(element)
                                        .text()
                                        .substring(0, term.length)
                                        .toLowerCase() === term) {
                                    return true;
                                }
                            });
                            var bodyElement = $("#i-index-body", this._rootSelector).get(0);
                            if (anchor.length > 0) {
                                // Found at least one match. Scroll to the first entry and mark all as selected
                                bodyElement.scrollTop = anchor.get(0).offsetTop - anchor.outerHeight(true);
                                anchor.toggleClass("i-selected", true);
                            }
                            else {
                                // Scroll back to the top of the index
                                bodyElement.scrollTop = 0;
                            }
                        }
                    }
                };
                return IndexDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.IndexDocumentFeature = IndexDocumentFeature;
            var IndexDocumentFeatureFactory = /** @class */ (function () {
                function IndexDocumentFeatureFactory() {
                }
                IndexDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new IndexDocumentFeature(documentInstance);
                };
                return IndexDocumentFeatureFactory;
            }());
            Features.IndexDocumentFeatureFactory = IndexDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.IndexDocumentFeatureFactory());

//# sourceMappingURL=innovasys.navigation.js.map
