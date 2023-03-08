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
                                        _this.documentInstance.setBodyVisibleAfterLoadComplete = true;
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
            var ChmCompatibilityDocumentFeature = /** @class */ (function (_super) {
                __extends(ChmCompatibilityDocumentFeature, _super);
                function ChmCompatibilityDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ChmCompatibilityDocumentFeature.prototype.getName = function () {
                    return "CHM Compatibility";
                };
                ChmCompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    var currentLocation = Content.Browser.getLocationInfo().href + ".";
                    if (currentLocation.indexOf("ms-its:") === 0) {
                        $("body").addClass("i-chm i-compiled");
                    }
                };
                return ChmCompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ChmCompatibilityDocumentFeature = ChmCompatibilityDocumentFeature;
            var ChmCompatibilityDocumentFeatureFactory = /** @class */ (function () {
                function ChmCompatibilityDocumentFeatureFactory() {
                }
                ChmCompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    var currentLocation = Content.Browser.getLocationInfo().href + ".";
                    if (currentLocation.indexOf("mk:@MSITStore") === 0 || currentLocation.indexOf("ms-its:") === 0) {
                        return new ChmCompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return ChmCompatibilityDocumentFeatureFactory;
            }());
            Features.ChmCompatibilityDocumentFeatureFactory = ChmCompatibilityDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ChmCompatibilityDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var CopyCodeDocumentFeature = /** @class */ (function (_super) {
                __extends(CopyCodeDocumentFeature, _super);
                function CopyCodeDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                CopyCodeDocumentFeature.prototype.getName = function () {
                    return "Copy Code";
                };
                CopyCodeDocumentFeature.prototype.getSettings = function () {
                    return this.documentInstance.getFeatureSettings("copycode", this.getDefaultSettings);
                };
                CopyCodeDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        copiedOkText: "Copied to clipboard",
                        copyError: "Could not copy to clipboard"
                    };
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                CopyCodeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if ($(".i-copy-code").length > 0 || !Object.defineProperty) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        if (Content.Browser.isCompiledHelp() || ((typeof ClipboardJS == "undefined") && (window.clipboardData))) {
                            var eventId = "click.i-copy-code";
                            // In CHM and Help 2.x, or any old browser versions, use the inbuilt IE clipboard support
                            rootSelector
                                .off(eventId, ".i-copy-code")
                                .on(eventId, ".i-copy-code", 
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            function (eventObject) {
                                var textValue = Content.DomHelpers.getTextFromContainingTable(eventObject.currentTarget);
                                try {
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    window.clipboardData.setData("Text", textValue);
                                    _this.showTip(eventObject.currentTarget, _this.getSettings().copiedOkText);
                                }
                                catch (ex) {
                                    _this.showTip(eventObject.currentTarget, _this.getSettings().copyError);
                                }
                                Content.Browser.stopPropagation(eventObject);
                            });
                        }
                        else {
                            var clipboard = new ClipboardJS(".i-copy-code", {
                                text: function (trigger) { return Content.DomHelpers.getTextFromContainingTable(trigger); }
                            });
                            clipboard.on("success", function (e) {
                                e.clearSelection();
                                _this.showTip(e.trigger, _this.getSettings().copiedOkText);
                            });
                            clipboard.on("error", function (e) {
                                _this.showTip(e.trigger, _this.getSettings().copyError);
                            });
                        }
                    }
                };
                CopyCodeDocumentFeature.prototype.showTip = function (target, message) {
                    var tips = $(target)
                        .qtip({
                        id: "i-copytoclipboard-tip",
                        content: {
                            text: message
                        },
                        position: {
                            my: "right center",
                            at: "left center"
                        },
                        show: {
                            event: "click"
                        },
                        hide: {
                            fixed: true,
                            event: false
                        }
                    });
                    var api = tips.qtip("api");
                    api.toggle(true);
                    var DELAY = 2000;
                    setTimeout(function () {
                        api.toggle(false);
                    }, DELAY);
                };
                CopyCodeDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    switch (configuration.profileName) {
                        case "tablet":
                            break;
                        case "mobile":
                            break;
                        // No default
                    }
                    // Dropdown Header as a button
                    configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-copy-code", Content.ResponsiveClickTargetKind.inline));
                };
                return CopyCodeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.CopyCodeDocumentFeature = CopyCodeDocumentFeature;
            var CopyCodeDocumentFeatureFactory = /** @class */ (function () {
                function CopyCodeDocumentFeatureFactory() {
                }
                CopyCodeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new CopyCodeDocumentFeature(documentInstance);
                };
                return CopyCodeDocumentFeatureFactory;
            }());
            Features.CopyCodeDocumentFeatureFactory = CopyCodeDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.CopyCodeDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var highlightTextConstants = {
                textNodeType: 3,
                elementNodeType: 1
            };
            var HighlightTextDocumentFeature = /** @class */ (function (_super) {
                __extends(HighlightTextDocumentFeature, _super);
                function HighlightTextDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    // Stores the first found match so we can scroll to it
                    _this._firstMatch = null;
                    return _this;
                }
                /**
                 * Merge any adjacent text nodes (left behind from search highlight)
                 * @param parentNode The node to start searching from.
                 */
                HighlightTextDocumentFeature.cleanUpTextNodes = function (parentNode) {
                    var node;
                    var lastNode;
                    var mergeCount;
                    do {
                        mergeCount = 0;
                        for (var x = 1; x < parentNode.childNodes.length; x++) {
                            node = parentNode.childNodes[x];
                            lastNode = node.previousSibling;
                            if (node.nodeType === highlightTextConstants.textNodeType
                                && lastNode.nodeType === highlightTextConstants.textNodeType) {
                                node.nodeValue = lastNode.nodeValue + node.nodeValue;
                                parentNode.removeChild(lastNode);
                                mergeCount++;
                            }
                        }
                    } while (mergeCount > 0);
                    /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
                    for (var x = 0; x < parentNode.childNodes.length; x++) {
                        HighlightTextDocumentFeature.cleanUpTextNodes(parentNode.childNodes[x]);
                    }
                };
                HighlightTextDocumentFeature.prototype.getName = function () {
                    return "Highlight Text";
                };
                HighlightTextDocumentFeature.prototype.onMessage = function (message) {
                    if (message != null) {
                        switch (message.messageType) {
                            case Content.DocumentMessageNames.quickSearch:
                                this.highlightText(message.messageData);
                                break;
                            case Content.DocumentMessageNames.resetQuickSearch:
                                this.removeAllHighlights();
                                break;
                            case Content.DocumentMessageNames.searchHighlightComplete:
                                this.searchHighlightComplete();
                                break;
                            // No default
                        }
                    }
                };
                HighlightTextDocumentFeature.prototype.highlightText = function (text) {
                    var rootElement = this.documentInstance.rootElement;
                    if (text !== "") {
                        this.highlightTextInElement(rootElement, text);
                    }
                };
                HighlightTextDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        var location_1 = Content.Browser.getLocationInfo();
                        if (location_1.search) {
                            var prefix = "?highlight=";
                            if (location_1.search.indexOf(prefix) === 0) {
                                var keywords = decodeURIComponent(location_1.search.substring(prefix.length)).split(",");
                                this.removeAllHighlights();
                                for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
                                    var keyword = keywords_1[_i];
                                    if (keyword != null && keyword !== "") {
                                        this.highlightText(keyword);
                                    }
                                }
                                this.searchHighlightComplete();
                            }
                        }
                    }
                };
                HighlightTextDocumentFeature.prototype.searchHighlightComplete = function () {
                    // Scroll to the first hit if it's not already visible
                    if (this._firstMatch != null) {
                        var rootElement = this.documentInstance.rootElement;
                        var ownerDocument = (rootElement.ownerDocument);
                        if (Content.DomHelpers.getElementPosition(this._firstMatch).top > ownerDocument.documentElement.scrollTop
                            + ownerDocument.documentElement.clientHeight
                            || Content.DomHelpers.getElementPosition(this._firstMatch).top < ownerDocument.documentElement.scrollTop) {
                            ownerDocument.documentElement.scrollTop = this._firstMatch.offsetTop;
                        }
                    }
                    this._firstMatch = null;
                };
                /**
                 * Finds some specific text and wraps with a search result highlight element.
                 * @param element The root element to search through.
                 * @param text The text to find.
                 */
                HighlightTextDocumentFeature.prototype.highlightTextInElement = function (element, text) {
                    var node;
                    var nodeText;
                    var lowerCaseNodeText;
                    var highlightSpan;
                    var remainingText;
                    var ownerDocument = (element.ownerDocument);
                    var textRegExp = new RegExp("(^|[\\b\\s]|[^\\w])(" + this.escapeForRegExp(text) + ")(?=$|[\\b\\s]|[^\\w])", "i");
                    // Traverse the document backwards otherwise the DOM returns stale objects as
                    //  we make modifications
                    for (var x = element.childNodes.length - 1; x >= 0; x--) {
                        node = element.childNodes[x];
                        var checkedElementVisible = false;
                        // Text Node
                        if (node.nodeType === highlightTextConstants.textNodeType) {
                            nodeText = node.nodeValue;
                            lowerCaseNodeText = nodeText.toLowerCase();
                            var match = void 0;
                            var newNodes = [];
                            while (nodeText.length > 0 && (match = lowerCaseNodeText.match(textRegExp)) !== null) {
                                var pos = match.index + match[1].length;
                                if (pos > 0) {
                                    // Text up to match
                                    newNodes.push(ownerDocument.createTextNode(nodeText.substring(0, pos)));
                                }
                                // Match highlight
                                highlightSpan = ownerDocument.createElement("SPAN");
                                highlightSpan.className = "i-search-highlight";
                                highlightSpan.appendChild(ownerDocument.createTextNode(nodeText.substring(pos, pos + text.length)));
                                newNodes.push(highlightSpan);
                                // Remainder
                                nodeText = nodeText.substring(pos + text.length);
                                lowerCaseNodeText = nodeText.toLowerCase();
                                // Store the first (last)hit so we can scroll to it
                                this._firstMatch = highlightSpan;
                                if (!checkedElementVisible) {
                                    // Delegate responsibility to the document and features
                                    this.documentInstance.ensureElementVisible(node.parentElement);
                                    checkedElementVisible = true;
                                }
                            }
                            if (newNodes.length > 0) {
                                if (nodeText.length > 0) {
                                    // Remainder after the last match
                                    newNodes.push(ownerDocument.createTextNode(nodeText));
                                }
                                for (var _i = 0, newNodes_1 = newNodes; _i < newNodes_1.length; _i++) {
                                    var newNode = newNodes_1[_i];
                                    node.parentNode.insertBefore(newNode, node);
                                    if (this._firstMatch != null && node.nodeType === highlightTextConstants.elementNodeType) {
                                        this._firstMatch = node;
                                    }
                                }
                                node.parentNode.removeChild(node);
                            }
                        }
                        else if (node.nodeType === highlightTextConstants.elementNodeType) {
                            // Element node
                            var elementNode = node;
                            // To ensure we don't modify script or go over
                            //  highlights we have already applied
                            if (elementNode.nodeName !== "SCRIPT"
                                && !(elementNode.nodeName === "SPAN" && elementNode.className === "i-search-highlight")) {
                                this.highlightTextInElement(elementNode, text);
                            }
                        }
                    }
                };
                /**
                 * Returns any search highlight spans in this document.
                 */
                HighlightTextDocumentFeature.prototype.getHighlightSpans = function () {
                    return this.documentInstance.rootSelector.find(".i-search-highlight");
                };
                /**
                 * Remove any search highlight spans.
                 */
                HighlightTextDocumentFeature.prototype.removeAllHighlights = function () {
                    var spans = this.getHighlightSpans();
                    spans.each(function (index, element) {
                        var span = $(element);
                        span.replaceWith(span.html());
                    });
                    // This process may have resulted in multiple contiguous text nodes
                    //  which could cause problems with subsequent search highlight operations
                    // So we join any continguous text nodes here
                    HighlightTextDocumentFeature.cleanUpTextNodes(this.documentInstance.rootElement);
                    $("#i-remove-highlighting").hide();
                };
                HighlightTextDocumentFeature.prototype.escapeForRegExp = function (source) {
                    return source.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
                };
                return HighlightTextDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.HighlightTextDocumentFeature = HighlightTextDocumentFeature;
            var HighlightTextDocumentFeatureFactory = /** @class */ (function () {
                function HighlightTextDocumentFeatureFactory() {
                }
                HighlightTextDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new HighlightTextDocumentFeature(documentInstance);
                };
                return HighlightTextDocumentFeatureFactory;
            }());
            Features.HighlightTextDocumentFeatureFactory = HighlightTextDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.HighlightTextDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var MarkAsNewDocumentFeature = /** @class */ (function (_super) {
                __extends(MarkAsNewDocumentFeature, _super);
                function MarkAsNewDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MarkAsNewDocumentFeature.prototype.getName = function () {
                    return "Mark As New";
                };
                MarkAsNewDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (this.documentInstance.isNew && isInitialLoad) {
                        rootSelector.addClass("i-is-new");
                    }
                };
                return MarkAsNewDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.MarkAsNewDocumentFeature = MarkAsNewDocumentFeature;
            var MarkAsNewDocumentFeatureFactory = /** @class */ (function () {
                function MarkAsNewDocumentFeatureFactory() {
                }
                MarkAsNewDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new MarkAsNewDocumentFeature(documentInstance);
                };
                return MarkAsNewDocumentFeatureFactory;
            }());
            Features.MarkAsNewDocumentFeatureFactory = MarkAsNewDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.MarkAsNewDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            /**
             * Handles any compatibility issues when content is served in Microsoft Help 2.x
             */
            var Help2CompatibilityDocumentFeature = /** @class */ (function (_super) {
                __extends(Help2CompatibilityDocumentFeature, _super);
                function Help2CompatibilityDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Help2CompatibilityDocumentFeature.prototype.getName = function () {
                    return "Microsoft Help 2.x Compatibility";
                };
                Help2CompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    // Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
                    Content.Browser.checkForIe7ModeJqueryBug();
                    if (location.protocol === "ms-help:") {
                        $("body").addClass("i-help2 i-compiled");
                    }
                };
                return Help2CompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.Help2CompatibilityDocumentFeature = Help2CompatibilityDocumentFeature;
            var Help2CompatibilityDocumentFeatureFactory = /** @class */ (function () {
                function Help2CompatibilityDocumentFeatureFactory() {
                }
                Help2CompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (location.protocol === "ms-help:") {
                        return new Help2CompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return Help2CompatibilityDocumentFeatureFactory;
            }());
            Features.Help2CompatibilityDocumentFeatureFactory = Help2CompatibilityDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
// Register factory
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.Help2CompatibilityDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var helpViewerCompatibilityConstants = {
                urlSuffixLength: 5,
                dotPrefixLength: 2
            };
            /**
             * Handles any compatibility issues when content is served in Microsoft Help Viewer.
             */
            var HelpViewerCompatibilityDocumentFeature = /** @class */ (function (_super) {
                __extends(HelpViewerCompatibilityDocumentFeature, _super);
                function HelpViewerCompatibilityDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /**
                 * Removes any referenced files that match the passed pattern (scripts and stylesheets).
                 * @param filename Filename pattern (regular expression).
                 * @param filetype Indicates the type of file ("js" or "css", so that we know what tags / attributes to look in.
                 */
                HelpViewerCompatibilityDocumentFeature.removeExternalFile = function (filename, filetype) {
                    var targetTagName = (filetype === "js")
                        ? "script"
                        : (filetype === "css") ? "link" : "none";
                    var targetAttribute = (filetype === "js")
                        ? "src"
                        : (filetype === "css")
                            ? "href"
                            : "none";
                    $(targetTagName).each(function (_, element) {
                        if ($(element)
                            .attr(targetAttribute)
                            .match(filename)) {
                            element.parentNode.removeChild(element);
                        }
                    });
                };
                /**
                 * Discovers the base url for resource requests so that we can fix up images etc.
                 */
                HelpViewerCompatibilityDocumentFeature.resourceBaseUrl = function () {
                    if (Content.Browser.isDesignTime) {
                        return "";
                    }
                    else {
                        // Get the first script tag
                        var script = $("#mshs_support_script").get(0);
                        // Extract the src which is a full resource url to within our origin .mshc
                        var scriptSrc = script.src;
                        var scriptUrl = void 0;
                        if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewerVersion2()) {
                            // HV 2
                            var startIndex = scriptSrc.indexOf("&id=");
                            scriptUrl = scriptSrc.substring(0, startIndex);
                            startIndex = scriptSrc.indexOf("&", startIndex + 1);
                            scriptUrl = "" + scriptUrl + scriptSrc.substring(startIndex) + "&id=";
                        }
                        else {
                            // HV 1
                            // Get the portion up to the ; (the base url for resource references)
                            var startIndex = scriptSrc.indexOf(";") + 1;
                            scriptUrl = scriptSrc.substring(0, startIndex);
                        }
                        return scriptUrl;
                    }
                };
                HelpViewerCompatibilityDocumentFeature.fixStyles = function () {
                    // Fix Javascript rules using urls
                    var stylesheets = document.styleSheets;
                    if (stylesheets && stylesheets.length > 0) {
                        // Waiting on any stylesheets to load?
                        if (HelpViewerCompatibilityDocumentFeature._pendingStylesheets.length !== 0) {
                            for (var _i = 0, _a = HelpViewerCompatibilityDocumentFeature._pendingStylesheets; _i < _a.length; _i++) {
                                var pendingStylesheetHref = _a[_i];
                                var foundStylesheet = false;
                                /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
                                for (var pendingStylesheetIndex = 0; pendingStylesheetIndex < (stylesheets.length); pendingStylesheetIndex++) {
                                    var pendingStylesheet = stylesheets[pendingStylesheetIndex];
                                    if (pendingStylesheet.href != null && pendingStylesheet.href === pendingStylesheetHref) {
                                        // Found the pending stylesheet - check that the rules have loaded
                                        var pendingRules = void 0;
                                        try {
                                            if (pendingStylesheet.rules) {
                                                pendingRules = pendingStylesheet.rules;
                                            }
                                            else {
                                                pendingRules = pendingStylesheet.cssRules;
                                            }
                                        }
                                        catch (ex) {
                                            //
                                        }
                                        if (pendingRules != null && pendingRules.length > 0) {
                                            foundStylesheet = true;
                                        }
                                        break;
                                    }
                                }
                                if (!foundStylesheet) {
                                    // Could not locate the stylesheet, try again in a bit
                                    if (HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer == null) {
                                        var retryInterval = 50;
                                        HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer
                                            = window.setInterval(HelpViewerCompatibilityDocumentFeature.fixStyles, retryInterval);
                                    }
                                    return;
                                }
                            }
                            if (HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer != null) {
                                clearInterval(HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer);
                                HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer = null;
                            }
                        }
                        /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
                        for (var stylesheetindex = 0; stylesheetindex < (stylesheets.length); stylesheetindex++) {
                            var stylesheet = stylesheets[stylesheetindex];
                            var rules = void 0;
                            try {
                                if (stylesheet.rules) {
                                    rules = stylesheet.rules;
                                }
                                else {
                                    rules = stylesheet.cssRules;
                                }
                            }
                            catch (ex) {
                                //
                            }
                            if (rules) {
                                /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
                                for (var ruleindex = 0; ruleindex < rules.length; ruleindex++) {
                                    var rule = rules[ruleindex];
                                    if (rule.style.backgroundImage) {
                                        var urlPrefixLength = 4;
                                        if (rule.style.backgroundImage.substring(0, urlPrefixLength) === "url(") {
                                            var backgroundText = rule.style.backgroundImage;
                                            var originalUrl = null;
                                            if (rule.style.backgroundImage.indexOf("127.0.0.1") !== -1) {
                                                // Chrome - rule returned as full url
                                                originalUrl = backgroundText.substring(backgroundText.indexOf("/", backgroundText.indexOf("127.0.0.1")) +
                                                    helpViewerCompatibilityConstants.urlSuffixLength, backgroundText.lastIndexOf(")"));
                                            }
                                            else if (backgroundText.indexOf("../") !== -1) {
                                                // IE - rule returned as original, with a .. prefix
                                                originalUrl = backgroundText.substring(backgroundText.indexOf("../") + helpViewerCompatibilityConstants.dotPrefixLength, backgroundText.lastIndexOf(")"));
                                            }
                                            else {
                                                // Relative url
                                                originalUrl = backgroundText.substring(0, backgroundText.lastIndexOf(")"));
                                            }
                                            originalUrl = originalUrl.replace("\"", "");
                                            var newUrl = "url(\"" + HelpViewerCompatibilityDocumentFeature.resourceBaseUrl() + originalUrl + "\")";
                                            backgroundText = newUrl + backgroundText.substring(backgroundText.indexOf(")") + 1);
                                            rule.style.backgroundImage = backgroundText;
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                /**
                 * Returns true if this page is executing in the context of the Microsoft Help Viewer (v1.x or v2.x).
                 */
                HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer = function () {
                    return (location.protocol === "ms-xhelp:"
                        || location.href.indexOf("ms.help?") !== -1
                        || location.href.indexOf("?method=page&") !== -1);
                };
                /**
                 * Returns true if this page is executing in the context of the Microsoft Help Viewer v2.x.
                 */
                HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewerVersion2 = function () {
                    var script = $("#mshs_support_script").get(0);
                    var scriptSrc = script.src;
                    return (scriptSrc.indexOf("method=asset") !== -1);
                };
                /**
                 * Adjusts the passed url so that it is a valid Microsoft Help Viewer asset url when running under Microsoft Help Viewer.
                 */
                HelpViewerCompatibilityDocumentFeature.fixUrl = function (url) {
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer()) {
                        var originalUrl = void 0;
                        if (url.indexOf("127.0.0.1") !== -1) {
                            // Chrome - rule returned as full url
                            originalUrl = url.substring(url.indexOf("/", url.indexOf("127.0.0.1"))
                                + helpViewerCompatibilityConstants.urlSuffixLength, url.length);
                            originalUrl = originalUrl.replace("\"", "");
                        }
                        else if (url.indexOf("../") !== -1) {
                            // IE - rule returned as original, with a .. prefix
                            originalUrl = url.substring(url.indexOf("../") + helpViewerCompatibilityConstants.dotPrefixLength, url.lastIndexOf(")"));
                            originalUrl = originalUrl.replace("\"", "");
                        }
                        else {
                            // Relative url in MSHV 2.0
                            originalUrl = url.replace(new RegExp("/", "g"), "\\");
                        }
                        if (originalUrl.indexOf("/help/") !== -1) {
                            originalUrl =
                                originalUrl.substring(originalUrl.indexOf("/", originalUrl.indexOf("/help/") + helpViewerCompatibilityConstants.urlSuffixLength), originalUrl.length);
                        }
                        var newUrl = HelpViewerCompatibilityDocumentFeature.resourceBaseUrl() + originalUrl;
                        return newUrl;
                    }
                    else {
                        return url;
                    }
                };
                HelpViewerCompatibilityDocumentFeature.prototype.getName = function () {
                    return "Microsoft Help Viewer Compatibility";
                };
                HelpViewerCompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    // Removes any unwanted branding files
                    HelpViewerCompatibilityDocumentFeature.removeExternalFile(/branding.*\.css/g, "css");
                    // Fix urls in stylesheets
                    HelpViewerCompatibilityDocumentFeature.fixStyles();
                    // Works around a jQuery setAttribute bug for a specific IE mode used by MSHV and Help 2.x (with IE11 installed)
                    Content.Browser.checkForIe7ModeJqueryBug();
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer()) {
                        $("body").addClass("i-mshv i-compiled");
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                HelpViewerCompatibilityDocumentFeature.prototype.initializeContent = function (rootElement) {
                    // Fixes any content issues (e.g.link and resource url issues)
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewerVersion2()) {
                        // Microsoft Help Viewer 2.x (Visual Studio 2012+) patches
                        $("body").hide();
                        // Standard url() references in stylesheets don't work in MSHV 2 so we have to reference
                        //  an additional stylesheet with alternate syntax
                        $("link").each(function (_, element) {
                            var mshvStylesheet = $(element).attr("data-mshv2-stylesheet");
                            if (mshvStylesheet) {
                                var newStylesheetHref = "ms-xhelp:///?;" + mshvStylesheet;
                                HelpViewerCompatibilityDocumentFeature._pendingStylesheets.push(newStylesheetHref);
                                $("head").append("<link rel=\"stylesheet\" href=\"" + newStylesheetHref + "\" type=\"text/css\" />");
                            }
                        });
                        // Fix any id links to work around bug in VS 2012 RC Help Viewer
                        $("a").each(function (_, element) {
                            var href = $(element).attr("href");
                            if (href && href.indexOf("ms-xhelp:///?id=") !== -1) {
                                $(element).attr("href", href.replace("ms-xhelp:///?id=", "ms-xhelp:///?method=page&id="));
                            }
                        });
                        Content.Browser.showElement($("body"), "body");
                    }
                    else {
                        // Microsoft Help Viewer 1 (Visual Studio 2010) patches
                        // Standard url() references in stylesheets don't work in MSHV 2 so we have to reference
                        //  an additional stylesheet with alternate syntax for those references to work in MSHV 1
                        $("link").each(function (_, element) {
                            var mshvStylesheet = $(element).attr("data-mshv1-stylesheet");
                            if (mshvStylesheet) {
                                var newStylesheetHref = HelpViewerCompatibilityDocumentFeature.resourceBaseUrl() + mshvStylesheet;
                                HelpViewerCompatibilityDocumentFeature._pendingStylesheets.push(newStylesheetHref);
                                $("head").append("<link rel=\"stylesheet\" href=\"" + newStylesheetHref + "\" type=\"text/css\" />");
                            }
                        });
                        // Fix double line breaks
                        $("BR")
                            .filter(function (_, element) { return $(element)
                            .next()
                            .is("BR"); })
                            .remove();
                        // Fix bookmark links
                        $("A").each(function (_, element) {
                            // Check for bookmark links - currently prefixed with the full page url
                            var anchorHref = $(element).attr("href");
                            if (anchorHref && anchorHref.indexOf("#") !== -1) {
                                if (anchorHref.substring(0, anchorHref.indexOf("#")) === location.href) {
                                    // Bookmark in this document
                                    $(element).attr("target", "_self");
                                }
                            }
                        });
                        // Make sure stylesheets are all fixed up
                        HelpViewerCompatibilityDocumentFeature.fixStyles();
                    }
                };
                HelpViewerCompatibilityDocumentFeature._pendingStylesheets = [];
                HelpViewerCompatibilityDocumentFeature._pendingStylesheetTimer = null;
                return HelpViewerCompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.HelpViewerCompatibilityDocumentFeature = HelpViewerCompatibilityDocumentFeature;
            var HelpViewerCompatibilityDocumentFeatureFactory = /** @class */ (function () {
                function HelpViewerCompatibilityDocumentFeatureFactory() {
                }
                HelpViewerCompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (HelpViewerCompatibilityDocumentFeature.isMicrosoftHelpViewer()) {
                        return new HelpViewerCompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return HelpViewerCompatibilityDocumentFeatureFactory;
            }());
            Features.HelpViewerCompatibilityDocumentFeatureFactory = HelpViewerCompatibilityDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
// Register factory
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.HelpViewerCompatibilityDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var PopupLinksDocumentFeature = /** @class */ (function (_super) {
                __extends(PopupLinksDocumentFeature, _super);
                function PopupLinksDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                PopupLinksDocumentFeature.getElementPadding = function (query) {
                    return {
                        top: PopupLinksDocumentFeature.toNumber(query.css("padding-top")),
                        bottom: PopupLinksDocumentFeature.toNumber(query.css("padding-bottom")),
                        left: PopupLinksDocumentFeature.toNumber(query.css("padding-left")),
                        right: PopupLinksDocumentFeature.toNumber(query.css("padding-right"))
                    };
                };
                PopupLinksDocumentFeature.prototype.getName = function () {
                    return "Popup Links";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                PopupLinksDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Configure any popup links
                    rootSelector.find(".i-popup-link").each(function (index, element) {
                        _this.configurePopupLink(element);
                    });
                };
                /**
                 * Configures an individual popup link element.
                 * @param element The element to configure as a popup link.
                 */
                PopupLinksDocumentFeature.prototype.configurePopupLink = function (element) {
                    var _this = this;
                    var linkElement = $(element);
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var content;
                    var contentSource = linkElement.attr("data-popup-contentsource");
                    if (contentSource) {
                        // Get content from a jQuery selector
                        content = this.documentInstance.rootSelector.find(contentSource);
                    }
                    else {
                        // Content declared inline
                        content = linkElement.attr("data-popup-content");
                        if (content != null) {
                            var r = /\\u([\d\w]{4})/gi;
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            content = content.replace(r, function (match, group) {
                                /* eslint-disable-next-line id-blacklist */
                                return String.fromCharCode(parseInt(group, 16));
                            });
                            content = content.replace(/\\n/g, "\n").replace(/\\r/g, "\r");
                        }
                    }
                    if (content != null) {
                        var showEvent = linkElement.attr("data-popup-showevent");
                        if (!showEvent) {
                            // Default show event to click
                            showEvent = "click";
                        }
                        var titleText = linkElement.attr("data-popup-title");
                        if (!titleText) {
                            // Default title to link caption
                            titleText = linkElement.text();
                        }
                        var classes = "";
                        var customClasses = linkElement.attr("data-popup-classes");
                        if (customClasses) {
                            // Custom coloring or effect class
                            classes = classes + " " + customClasses;
                        }
                        var adjustX = 0;
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        if (PopupLinksDocumentFeature.getElementPadding(linkElement).left !== 0) {
                            // Adjust the padding of the tip by the same amount as the link element padding
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            adjustX = PopupLinksDocumentFeature.getElementPadding(linkElement).left;
                        }
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var showOptions = { event: showEvent };
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        var hideOptions = { delay: 500, fixed: true };
                        if (Content.Browser.isAnimationDisabled) {
                            showOptions.effect = false;
                            hideOptions.effect = false;
                        }
                        linkElement.qtip({
                            content: {
                                text: content,
                                title: { text: titleText }
                            },
                            position: {
                                my: "top left",
                                at: "bottom left",
                                adjust: { x: adjustX },
                                viewport: $(window),
                                container: this.documentInstance.rootSelector
                            },
                            show: showOptions,
                            hide: hideOptions,
                            events: {
                                render: function (event, api) {
                                    // Sets up bindings for click events on checkboxes contained on the popup
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    var tooltip = api.elements.tooltip;
                                    _this.onPopupRender(tooltip);
                                }
                            },
                            style: {
                                classes: classes
                            }
                        });
                    }
                };
                PopupLinksDocumentFeature.prototype.onPopupRender = function (element) {
                    this.documentInstance.initializeContent(element);
                };
                PopupLinksDocumentFeature.toNumber = function (value) { return parseInt(value, 10) || 0; };
                return PopupLinksDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.PopupLinksDocumentFeature = PopupLinksDocumentFeature;
            var PopupLinksDocumentFeatureFactory = /** @class */ (function () {
                function PopupLinksDocumentFeatureFactory() {
                }
                PopupLinksDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new PopupLinksDocumentFeature(documentInstance);
                };
                return PopupLinksDocumentFeatureFactory;
            }());
            Features.PopupLinksDocumentFeatureFactory = PopupLinksDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.PopupLinksDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var quirksModeConstants = {
                msie8Version: 8
            };
            var QuirksModeCompatibilityDocumentFeature = /** @class */ (function (_super) {
                __extends(QuirksModeCompatibilityDocumentFeature, _super);
                function QuirksModeCompatibilityDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                QuirksModeCompatibilityDocumentFeature.prototype.getName = function () {
                    return "Quirks Mode Compatibility";
                };
                QuirksModeCompatibilityDocumentFeature.prototype.initializeDocument = function () {
                    // Prevent expand flickering when IE or CHM running in quirks mode
                    if (Content.Browser.getCompatMode() !== "CSS1Compat") {
                        // Define overriding method.
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        jQuery.fx.prototype.hide = function () {
                            // Remember where we started, so that we can go back to it later
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            this.options.orig[this.prop] = jQuery.style(this.elem, this.prop);
                            this.options.hide = true;
                            // Begin the animation
                            this.custom(this.cur(), 1);
                        };
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                QuirksModeCompatibilityDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (Content.Browser.isDesignTime) {
                        return;
                    }
                    // Fix quirks mode rendering issues
                    if (Content.Browser.getCompatMode() !== "CSS1Compat"
                        || Content.Browser.info.name === "msie" && Content.Browser.info.version <= quirksModeConstants.msie8Version) {
                        // Quirks mode without first-child support
                        var addFirstChildClassNames_1 = (Content.Browser.getCompatMode() !== "CSS1Compat");
                        var contentSections = rootSelector.find(".i-section-content,.i-description-content,.i-returns-content,.i-description,.i-box-content");
                        contentSections.each(function (_, element) {
                            if (addFirstChildClassNames_1) {
                                $(element)
                                    .children()
                                    .first()
                                    .addClass("i-first-child");
                            }
                            $(element)
                                .children()
                                .last()
                                .addClass("i-last-child");
                        });
                        if (addFirstChildClassNames_1) {
                            rootSelector.find("table.i-syntax-table th:first-child").addClass("i-first-child");
                            rootSelector.find("td>p:first-child").addClass("i-first-child");
                        }
                        rootSelector.find("table.i-syntax-table th:last-child").addClass("i-last-child");
                        rootSelector.find("td>p:last-child").addClass("i-last-child");
                        rootSelector.find("p+p").addClass("i-adjacent-paragraph");
                        rootSelector.find("h4+.i-returns-content").addClass("i-returns-content-after-heading");
                        rootSelector.find(".i-example-section-content p+div").addClass("i-example-after-paragraph");
                    }
                };
                return QuirksModeCompatibilityDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.QuirksModeCompatibilityDocumentFeature = QuirksModeCompatibilityDocumentFeature;
            var QuirksModeCompatibilityDocumentFeatureFactory = /** @class */ (function () {
                function QuirksModeCompatibilityDocumentFeatureFactory() {
                }
                QuirksModeCompatibilityDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    var msIeVersion = Content.Browser.msIeVersion();
                    if (Content.Browser.getCompatMode() !== "CSS1Compat" || (msIeVersion > 0 && msIeVersion <= quirksModeConstants.msie8Version)) {
                        // Quirks mode feature is active if running in compatibility mode or IE8 or lower
                        return new QuirksModeCompatibilityDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return QuirksModeCompatibilityDocumentFeatureFactory;
            }());
            Features.QuirksModeCompatibilityDocumentFeatureFactory = QuirksModeCompatibilityDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.QuirksModeCompatibilityDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var syntaxTabsConstants = {
                featureOrdinal: 99
            };
            var SyntaxTabsDocumentFeature = /** @class */ (function (_super) {
                __extends(SyntaxTabsDocumentFeature, _super);
                function SyntaxTabsDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                SyntaxTabsDocumentFeature.prototype.getName = function () {
                    return "Syntax Tabs";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                SyntaxTabsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    var localStorage = this.documentInstance.getLocalStorage();
                    var selectedTabIndex = localStorage.getAttribute("i-tab-container-selected-tab-index");
                    if (!selectedTabIndex) {
                        selectedTabIndex = 0;
                    }
                    // Change default duration on the tabs
                    var options = {
                        active: selectedTabIndex,
                        selected: selectedTabIndex,
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        activate: function (_, ui) {
                            localStorage.setAttribute("i-tab-container-selected-tab-index", ui.newTab.index());
                        },
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        select: function (_, ui) {
                            localStorage.setAttribute("i-tab-container-selected-tab-index", ui.index);
                        },
                        show: null,
                        hide: null
                    };
                    if (!Content.Browser.isDesignTime && !Content.Browser.isAnimationDisabled) {
                        // Only animate if not design time and animation enabled
                        options.show = { opacity: "toggle", duration: "fast" };
                        options.hide = { opacity: "toggle", duration: "fast" };
                    }
                    rootSelector.find(".i-tab-container").tabs(options);
                };
                SyntaxTabsDocumentFeature.prototype.initializeContentOrdinal = function () {
                    return syntaxTabsConstants.featureOrdinal;
                };
                return SyntaxTabsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.SyntaxTabsDocumentFeature = SyntaxTabsDocumentFeature;
            var SyntaxTabsDocumentFeatureFactory = /** @class */ (function () {
                function SyntaxTabsDocumentFeatureFactory() {
                }
                SyntaxTabsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new SyntaxTabsDocumentFeature(documentInstance);
                };
                return SyntaxTabsDocumentFeatureFactory;
            }());
            Features.SyntaxTabsDocumentFeatureFactory = SyntaxTabsDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.SyntaxTabsDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var TabsDocumentFeature = /** @class */ (function (_super_1) {
                __extends(TabsDocumentFeature, _super_1);
                function TabsDocumentFeature() {
                    return _super_1 !== null && _super_1.apply(this, arguments) || this;
                }
                TabsDocumentFeature.prototype.getName = function () {
                    return "Tabs";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                TabsDocumentFeature.prototype.beforeSetElementVisibility = function (element, isVisible, isImmediate) {
                    if (!isVisible && element.tagName === "LI"
                        && $(element)
                            .parent()
                            .hasClass("ui-tabs-nav")) {
                        var isLegacyUi = (Content.Browser.compareVersionStrings($.ui.version, "1.8") < 0);
                        // If we are hiding a tab, make sure it isn't the selected tab
                        var selectedTabClassName = isLegacyUi ? "ui-tabs-selected" : "ui-tabs-active";
                        if ($(element).hasClass(selectedTabClassName)) {
                            var tabContainer = $($(element).parents(".i-tab-container").get(0));
                            var firstVisibleTab = tabContainer.find("li:visible:not(." + selectedTabClassName + "):first");
                            if (firstVisibleTab) {
                                if (isLegacyUi) {
                                    tabContainer.tabs("option", "selected", firstVisibleTab.index());
                                }
                                else {
                                    tabContainer.tabs("option", "active", firstVisibleTab.index());
                                }
                            }
                        }
                    }
                    return false;
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                TabsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (location.href === "about:blank") {
                        // Ensure that all tabs references are treated as local at design time
                        $.widget("ui.tabs", $.ui.tabs, {
                            _isLocal: function (anchor) {
                                if (anchor.href.indexOf("#") !== -1) {
                                    return true;
                                }
                                else {
                                    // ReSharper disable once SuspiciousThisUsage - calls jQuery UI _super function
                                    return this._super(anchor);
                                }
                            }
                        });
                    }
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                TabsDocumentFeature.prototype.afterSetElementVisibility = function (element, isVisible) {
                    var tabContainer = $($(element).parents(".i-tab-container").get(0));
                    if (tabContainer != null && tabContainer.data("ui-tabs") != null) {
                        tabContainer.tabs("refresh");
                    }
                };
                TabsDocumentFeature.prototype.initializeContentOrdinal = function () {
                    // Make sure we apply our design time fix for tabs before other features use the ui.tabs widget
                    return -1;
                };
                return TabsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TabsDocumentFeature = TabsDocumentFeature;
            var TabsDocumentFeatureFactory = /** @class */ (function () {
                function TabsDocumentFeatureFactory() {
                }
                TabsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TabsDocumentFeature(documentInstance);
                };
                return TabsDocumentFeatureFactory;
            }());
            Features.TabsDocumentFeatureFactory = TabsDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TabsDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ToggleSectionDocumentFeature = /** @class */ (function (_super) {
                __extends(ToggleSectionDocumentFeature, _super);
                function ToggleSectionDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ToggleSectionDocumentFeature.prototype.getName = function () {
                    return "Toggle Sections";
                };
                /** The id value that is used to save/load state from local storage and to disambiguate event handlers. */
                ToggleSectionDocumentFeature.prototype.getToggleSetId = function () {
                    return "i-toggle-section";
                };
                /** Css class name of the section link to toggle all */
                ToggleSectionDocumentFeature.prototype.getToggleAllLinkClassName = function () {
                    return "i-toggle-all-sections";
                };
                /** Css class name of the section heading div */
                ToggleSectionDocumentFeature.prototype.getToggleHeadingClassName = function () {
                    return "i-section-heading";
                };
                /** Css class name of the section content div following each section heading */
                ToggleSectionDocumentFeature.prototype.getToggleContentClassName = function () {
                    return "i-section-content";
                };
                /** Css class name of the collapse all label */
                ToggleSectionDocumentFeature.prototype.getToggleAllLabelClassName = function () {
                    return "i-collapse-all";
                };
                /** Css class name of the expand all label */
                ToggleSectionDocumentFeature.prototype.getUnToggleAllLabelClassName = function () {
                    return "i-expand-all";
                };
                /** The suffix used for toggle class name and when saving toggle state */
                ToggleSectionDocumentFeature.prototype.getToggledSuffix = function () {
                    return "-collapsed";
                };
                /** Returns true if the related content is only visible when the section is toggled (false = initially visible without toggling) */
                ToggleSectionDocumentFeature.prototype.toggleStateForVisible = function () {
                    return true;
                };
                /** Set to true to automatically save the toggle state between page loads */
                ToggleSectionDocumentFeature.prototype.isSaveStateEnabled = function () {
                    return true;
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                ToggleSectionDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Wire up click handler for the "Expand All / Collapse All" link
                    var eventId = "click." + this.getToggleSetId();
                    rootSelector
                        .off(eventId, "." + this.getToggleAllLinkClassName())
                        .on(eventId, "." + this.getToggleAllLinkClassName(), function (eventObject) {
                        var desiredExpanded = !(rootSelector
                            .find("." + _this.getToggleHeadingClassName() + "." + _this.getToggleHeadingClassName() + _this.getToggledSuffix())
                            .length === 0);
                        rootSelector.find("." + _this.getToggleHeadingClassName()).each(function (index, element) {
                            var isExpanded = !$(element).hasClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix());
                            if (isExpanded !== desiredExpanded) {
                                _this.toggleSection($(element));
                            }
                        });
                        Content.Browser.stopPropagation(eventObject);
                    });
                    this.loadToggleSectionState(rootSelector.find("." + this.getToggleHeadingClassName()));
                    // Click Event handler
                    rootSelector
                        .off(eventId, "." + this.getToggleHeadingClassName())
                        .on(eventId, "." + this.getToggleHeadingClassName(), function (eventObject) {
                        _this.toggleSection($(eventObject.currentTarget));
                        Content.Browser.stopPropagation(eventObject);
                    });
                    // Set the initial state of the "Expand All" / "Collapse All" link
                    if (!Content.Browser.isDesignTime) {
                        this.setToggleAllSectionsVisibility();
                    }
                };
                ToggleSectionDocumentFeature.prototype.ensureElementVisible = function (element) {
                    var _this = this;
                    $(element)
                        .parents("." + this.getToggleContentClassName())
                        .prev("." + this.getToggleHeadingClassName())
                        .each(function (_, parentElement) {
                        var isToggled = !$(parentElement).hasClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix());
                        if (_this.toggleStateForVisible() !== isToggled) {
                            _this.toggleSection($(parentElement));
                        }
                    });
                };
                /**
                 * Toggle a given section or sections.
                 * @param elements The JQuery selector containing the element or elements to toggle.
                 * @param isImmediate When set to true, animations are disabled.
                 */
                ToggleSectionDocumentFeature.prototype.toggleSection = function (elements, isImmediate) {
                    var _this = this;
                    if (isImmediate === void 0) { isImmediate = false; }
                    var result = elements.each(function (_, element) {
                        var sectionDiv = $(element).next("." + _this.getToggleContentClassName());
                        if (sectionDiv) {
                            var isCurrentlyToggled = $(element).hasClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix());
                            _this.toggleElement(sectionDiv, isImmediate);
                            $(element).toggleClass(_this.getToggleHeadingClassName() + _this.getToggledSuffix(), !isCurrentlyToggled);
                            if (_this.isSaveStateEnabled()) {
                                if (isCurrentlyToggled) {
                                    // No longer collapsed
                                    _this.documentInstance
                                        .getLocalStorage()
                                        .setAttribute("" + _this.getToggleSetId() + _this.getToggledSuffix() + "-" + $(element).attr("id"), null);
                                }
                                else {
                                    // Is now collapsed
                                    _this.documentInstance
                                        .getLocalStorage()
                                        .setAttribute("" + _this.getToggleSetId() + _this.getToggledSuffix() + "-" + $(element).attr("id"), "true");
                                }
                            }
                        }
                    });
                    this.updateToggleAllSectionsLinkLabel();
                    return result;
                };
                /**
                 * Executes the toggle function, allowing derived types to override the default method (slideToggle).
                 */
                ToggleSectionDocumentFeature.prototype.toggleElement = function (element, isImmediate) {
                    var isCurrentlyHidden = (element.css("display") === "none");
                    this.documentInstance.setElementVisibility(element, isCurrentlyHidden, isImmediate);
                };
                /**
                 * Load saved state of a toggle section or sections from local storage.
                 * @param elements JQuery selector representing Element(s) to load and set the toggle state for.
                 */
                ToggleSectionDocumentFeature.prototype.loadToggleSectionState = function (elements) {
                    var _this = this;
                    if (this.isSaveStateEnabled()) {
                        return elements.each(function (index, element) {
                            var attributeValue = _this.documentInstance
                                .getLocalStorage()
                                .getAttribute("" + _this.getToggleSetId() + _this.getToggledSuffix() + "-" + $(element).attr("id"));
                            if (attributeValue === "true") {
                                _this.toggleSection($(element), true);
                            }
                        });
                    }
                    else {
                        return elements;
                    }
                };
                /**
                 * Update the labels for the "Expand All" / "Collapse All" link
                 */
                ToggleSectionDocumentFeature.prototype.updateToggleAllSectionsLinkLabel = function () {
                    var rootSelector = this.documentInstance.rootSelector;
                    var allSectionsToggled = (rootSelector
                        .find("." + this.getToggleHeadingClassName() + "." + this.getToggleHeadingClassName() + this.getToggledSuffix())
                        .length === 0);
                    rootSelector.find("." + this.getToggleAllLabelClassName()).css("display", allSectionsToggled ? "inline" : "none");
                    rootSelector.find("." + this.getUnToggleAllLabelClassName()).css("display", allSectionsToggled ? "none" : "inline");
                };
                /**
                 * Set the visibility of the "Expand All" / "Collapse All" link depending on whether the page contains
                 *  at least one toggle section.
                 */
                ToggleSectionDocumentFeature.prototype.setToggleAllSectionsVisibility = function () {
                    var rootSelector = this.documentInstance.rootSelector;
                    if (rootSelector.find("." + this.getToggleHeadingClassName()).length > 0) {
                        // Sections - show
                        rootSelector.find("." + this.getToggleAllLinkClassName()).show();
                    }
                    else {
                        // No sections - hide
                        rootSelector.find("." + this.getToggleAllLinkClassName()).hide();
                    }
                };
                ToggleSectionDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (configuration.profileName === "mobile" || configuration.profileName === "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                // Headings as buttons
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget("." + this.getToggleHeadingClassName(), Content.ResponsiveClickTargetKind.block));
                                break;
                            // No default
                        }
                    }
                };
                return ToggleSectionDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ToggleSectionDocumentFeature = ToggleSectionDocumentFeature;
            var ToggleSectionDocumentFeatureFactory = /** @class */ (function () {
                function ToggleSectionDocumentFeatureFactory() {
                }
                ToggleSectionDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ToggleSectionDocumentFeature(documentInstance);
                };
                return ToggleSectionDocumentFeatureFactory;
            }());
            Features.ToggleSectionDocumentFeatureFactory = ToggleSectionDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
$.fn.slideFadeToggle = function (speed, easing, callback) {
    return this.animate({ opacity: "toggle", height: "toggle" }, speed, easing, callback);
};
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ToggleSectionDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ToggleDropDownDocumentFeature = /** @class */ (function (_super) {
                __extends(ToggleDropDownDocumentFeature, _super);
                function ToggleDropDownDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /** The id value that is used to save/load state from local storage and to disambiguate event handlers. */
                ToggleDropDownDocumentFeature.prototype.getToggleSetId = function () {
                    return "i-drop-downs";
                };
                /** Css class name of the section link to toggle all */
                ToggleDropDownDocumentFeature.prototype.getToggleAllLinkClassName = function () {
                    return "i-toggle-all-dropdowns";
                };
                /** Css class name of the section heading div */
                ToggleDropDownDocumentFeature.prototype.getToggleHeadingClassName = function () {
                    return "i-dropdown-heading";
                };
                /** Css class name of the section content div following each section heading */
                ToggleDropDownDocumentFeature.prototype.getToggleContentClassName = function () {
                    return "i-dropdown-content";
                };
                /** Css class name of the collapse all label */
                ToggleDropDownDocumentFeature.prototype.getToggleAllLabelClassName = function () {
                    return "i-show-all-dropdowns";
                };
                /** Css class name of the expand all label */
                ToggleDropDownDocumentFeature.prototype.getUnToggleAllLabelClassName = function () {
                    return "i-hide-all-dropdowns";
                };
                /** The suffix used for toggle class name and when saving toggle state */
                ToggleDropDownDocumentFeature.prototype.getToggledSuffix = function () {
                    return "-expanded";
                };
                /** Returns true if the related content is only visible when the section is toggled (false = initially visible without toggling) */
                ToggleDropDownDocumentFeature.prototype.toggleStateForVisible = function () {
                    return false;
                };
                /** Set to true to automatically save the toggle state between page loads */
                ToggleDropDownDocumentFeature.prototype.isSaveStateEnabled = function () {
                    return false;
                };
                ToggleDropDownDocumentFeature.prototype.toggleElement = function (element, isImmediate) {
                    if (isImmediate || Content.Browser.isAnimationDisabled) {
                        element.toggle();
                    }
                    else {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        element.slideFadeToggle("fast");
                    }
                };
                ToggleDropDownDocumentFeature.prototype.getName = function () {
                    return "Drop Downs";
                };
                ToggleDropDownDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    if (configuration.profileName === "mobile" || configuration.profileName === "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                break;
                            // No default
                        }
                        var className = "." + this.getToggleHeadingClassName() + ",." + this.getToggleAllLabelClassName() + ",." + this.getUnToggleAllLabelClassName();
                        // Dropdown Header as a button
                        configuration.clickTargets.push(new Content.ResponsiveClickTarget(className, Content.ResponsiveClickTargetKind.block));
                    }
                };
                return ToggleDropDownDocumentFeature;
            }(Features.ToggleSectionDocumentFeature));
            Features.ToggleDropDownDocumentFeature = ToggleDropDownDocumentFeature;
            var ToggleDropDownDocumentFeatureFactory = /** @class */ (function () {
                function ToggleDropDownDocumentFeatureFactory() {
                }
                ToggleDropDownDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ToggleDropDownDocumentFeature(documentInstance);
                };
                return ToggleDropDownDocumentFeatureFactory;
            }());
            Features.ToggleDropDownDocumentFeatureFactory = ToggleDropDownDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ToggleDropDownDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var ViewInFrameDocumentFeature = /** @class */ (function (_super) {
                __extends(ViewInFrameDocumentFeature, _super);
                function ViewInFrameDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ViewInFrameDocumentFeature.prototype.getName = function () {
                    return "View In Frame";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                ViewInFrameDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    var link = $(".i-view-in-frame-link", rootSelector);
                    // Display / hide link to root page if running outside the navigation frame in web output
                    if (window.self !== window.top || location.protocol === "ms-its:") {
                        // Running in a frameset or CHM, hide the link
                        link.hide();
                    }
                    else {
                        // Not running in a navigation frame, set the link target to the web root page
                        // Get the current page name
                        var pageName = location.href.substring(location.href.lastIndexOf("/") + 1);
                        if (pageName.indexOf("#") !== -1) {
                            pageName = pageName.substring(0, pageName.indexOf("#"));
                        }
                        // Append to root page name
                        var framePage = link.data("root-page") + "#" + pageName;
                        link.attr("href", framePage);
                        link.show();
                    }
                };
                return ViewInFrameDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ViewInFrameDocumentFeature = ViewInFrameDocumentFeature;
            var ViewInFrameDocumentFeatureFactory = /** @class */ (function () {
                function ViewInFrameDocumentFeatureFactory() {
                }
                ViewInFrameDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new ViewInFrameDocumentFeature(documentInstance);
                };
                return ViewInFrameDocumentFeatureFactory;
            }());
            Features.ViewInFrameDocumentFeatureFactory = ViewInFrameDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.ViewInFrameDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var lightboxConstants = {
                minRelLength: 9
            };
            var LightboxDocumentFeature = /** @class */ (function (_super) {
                __extends(LightboxDocumentFeature, _super);
                function LightboxDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                LightboxDocumentFeature.prototype.getName = function () {
                    return "Lightbox";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                LightboxDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    $("a.i-thumbnail").slimbox({}, null, function (el) {
                        /* eslint-disable-next-line no-invalid-this */
                        return el === this || el.rel.length >= lightboxConstants.minRelLength;
                    });
                };
                LightboxDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    // Remove slimbox click handler in responsive mode
                    if (configuration.profileName === "mobile" || configuration.profileName === "tablet") {
                        $("i-thumbnail").off("click");
                    }
                };
                return LightboxDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.LightboxDocumentFeature = LightboxDocumentFeature;
            var LightboxDocumentFeatureFactory = /** @class */ (function () {
                function LightboxDocumentFeatureFactory() {
                }
                LightboxDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new LightboxDocumentFeature(documentInstance);
                };
                return LightboxDocumentFeatureFactory;
            }());
            Features.LightboxDocumentFeatureFactory = LightboxDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.LightboxDocumentFeatureFactory());
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var videoConstants = {
                defaultWidth: 64,
                defaultHeight: 36,
                defaultQuirksHeight: 39
            };
            var VideoDocumentFeature = /** @class */ (function (_super) {
                __extends(VideoDocumentFeature, _super);
                function VideoDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                VideoDocumentFeature.prototype.getName = function () {
                    return "Video";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                VideoDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    $(".i-video-youtube").each(function (_, containerElement) {
                        var container = $(containerElement);
                        var iframe = container.children("iframe");
                        var autoplay = (container.data("autoplay") === "True");
                        var autoResize = (container.data("autoresize") === "True");
                        var showRelated = (container.data("showrelated") === "True");
                        var theme = container.data("theme") || "";
                        var movieId = container.data("movieid");
                        var src = (Content.Browser.getLocationInfo().protocol === "https:" ? "https:" : "http:") + "//www.youtube.com/embed/" + movieId + "?&theme=" + theme + "&autohide=1";
                        src += ("&autoplay=" + (autoplay ? "1" : "0"));
                        src += ("&rel=" + (showRelated ? "1" : "0"));
                        iframe.attr("src", src);
                        if (autoResize) {
                            var currentLocation_1 = Content.Browser.getLocationInfo().href;
                            if (Content.Browser.isDesignTime || currentLocation_1 === "about:blank" || currentLocation_1.indexOf("ms-its:") === 0) {
                                // CHM or design time
                                iframe.attr("width", videoConstants.defaultWidth).attr("height", videoConstants.defaultQuirksHeight);
                            }
                            else {
                                iframe.attr("width", videoConstants.defaultWidth).attr("height", videoConstants.defaultHeight);
                            }
                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                            container.fitVids();
                        }
                        else {
                            iframe
                                .attr("width", parseInt(container.data("width"), 10))
                                .attr("height", parseInt(container.data("height"), 10));
                        }
                    });
                };
                return VideoDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.VideoDocumentFeature = VideoDocumentFeature;
            var VideoDocumentFeatureFactory = /** @class */ (function () {
                function VideoDocumentFeatureFactory() {
                }
                VideoDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new VideoDocumentFeature(documentInstance);
                };
                return VideoDocumentFeatureFactory;
            }());
            Features.VideoDocumentFeatureFactory = VideoDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.VideoDocumentFeatureFactory());

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
            var ContentFilterDocumentFeature = /** @class */ (function (_super) {
                __extends(ContentFilterDocumentFeature, _super);
                function ContentFilterDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                ContentFilterDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Initialize the language filtering check boxes
                    var eventId = "click.toggle";
                    var checkboxSelector = "." + this.getCheckboxClassName();
                    rootSelector
                        .off(eventId, checkboxSelector)
                        .on(eventId, checkboxSelector, function (eventObject) {
                        _this.toggleCheckbox($(eventObject.currentTarget));
                        Content.Browser.stopPropagation(eventObject);
                    });
                    this.loadToggleCheckboxState($(checkboxSelector));
                    this.updateFilterLabel();
                };
                /**
                 * Toggle the checked state of a checkbox or checkboxes.
                 * @param elements JQuery selector representing Element(s) to load and set the toggle state for.
                 * @param isImmediate When set to true, animations are disabled.
                 */
                ContentFilterDocumentFeature.prototype.toggleCheckbox = function (elements, isImmediate) {
                    var _this = this;
                    if (isImmediate === void 0) { isImmediate = false; }
                    elements.each(function (_, element) {
                        var isChecked = $(element).is(":checked");
                        if (!$(element).is(":checked")) {
                            _this.documentInstance.getLocalStorage().setAttribute("checkbox-unchecked-" + $(element).attr("id"), "true");
                        }
                        else {
                            _this.documentInstance.getLocalStorage().setAttribute("checkbox-unchecked-" + $(element).attr("id"), null);
                        }
                        var toggleClassName = $(element).attr("data-toggleclass");
                        if (toggleClassName != null) {
                            _this.documentInstance.setElementVisibility($("." + toggleClassName), isChecked, isImmediate);
                        }
                    });
                    this.updateFilterLabel();
                    return elements;
                };
                /**
                 * Load saved state of a Checkbox or Checkboxes from local storage.
                 * @param elements JQuery selector representing Element(s) to load and set the checkbox state for.
                 */
                ContentFilterDocumentFeature.prototype.loadToggleCheckboxState = function (elements) {
                    var _this = this;
                    return elements.each(function (_, element) {
                        var attributeValue = _this.documentInstance.getLocalStorage().getAttribute("checkbox-unchecked-" + $(element).attr("id"));
                        if (attributeValue === "true") {
                            $(element).prop("checked", false);
                            _this.toggleCheckbox($(element), true);
                        }
                    });
                };
                /**
                 * Overriden in derived classes to return the class name (without leading ".") of the checkboxes associated with
                 *  this filter.
                 */
                ContentFilterDocumentFeature.prototype.getCheckboxClassName = function () {
                    return null;
                };
                /**
                 * Overriden by derived classes to update the label describing the current filter (where required).
                 */
                ContentFilterDocumentFeature.prototype.updateFilterLabel = function () {
                    // No default implementation
                };
                return ContentFilterDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.ContentFilterDocumentFeature = ContentFilterDocumentFeature;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));

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
            var DesignTimeDocumentFeature = /** @class */ (function (_super) {
                __extends(DesignTimeDocumentFeature, _super);
                function DesignTimeDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                DesignTimeDocumentFeature.prototype.getName = function () {
                    return "Design Time";
                };
                DesignTimeDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (isInitialLoad) {
                        // Create design time interaction divs
                        $("<div/>", {
                            id: "hsDesignTimeLoad",
                            click: function () {
                                var scrollPosition = _this.documentInstance.getLocalStorage().getAttribute("scrollPosition");
                                if (scrollPosition) {
                                    $(window).scrollTop(scrollPosition);
                                }
                            }
                        })
                            .appendTo(rootSelector)
                            .css("display", "none");
                        $("<div/>", {
                            id: "hsDesignTimeSave",
                            click: function () {
                                _this.documentInstance.getLocalStorage().setAttribute("scrollPosition", $(window).scrollTop());
                            }
                        })
                            .appendTo(rootSelector)
                            .css("display", "none");
                        $("<div/>", {
                            id: "i-design-time-initialize",
                            click: function (e) {
                                var newContentElement = $(document.getElementById($(e.currentTarget).data("element-id")));
                                _this.documentInstance.initializeContent(newContentElement, false);
                            }
                        })
                            .appendTo(rootSelector)
                            .css("display", "none");
                        // Disable animation at design time
                        Content.Browser.isAnimationDisabled = true;
                    }
                };
                return DesignTimeDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DesignTimeDocumentFeature = DesignTimeDocumentFeature;
            var DesignTimeDocumentFeatureFactory = /** @class */ (function () {
                function DesignTimeDocumentFeatureFactory() {
                }
                DesignTimeDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (Content.Browser.isDesignTime) {
                        return new DesignTimeDocumentFeature(documentInstance);
                    }
                    return null;
                };
                return DesignTimeDocumentFeatureFactory;
            }());
            Features.DesignTimeDocumentFeatureFactory = DesignTimeDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DesignTimeDocumentFeatureFactory());

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
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
var Innovasys;
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            var dynamicTocConstants = {
                tocSplitterWidth: 14,
                maxSavedTocWidth: 1000,
                minSavedTocWidth: 50,
                newFolderNodeIconIndex: 3,
                folderNodeIconIndex: 1,
                newPageNodeIconIndex: 10,
                pageNodeIconIndex: 9
            };
            var DynamicTocNode = /** @class */ (function () {
                function DynamicTocNode() {
                }
                return DynamicTocNode;
            }());
            Features.DynamicTocNode = DynamicTocNode;
            var DynamicTocDocumentFeature = /** @class */ (function (_super) {
                __extends(DynamicTocDocumentFeature, _super);
                function DynamicTocDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._allNodes = {};
                    _this._loadedContainers = {};
                    return _this;
                }
                DynamicTocDocumentFeature.prototype.getName = function () {
                    return "Dynamic ToC";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                DynamicTocDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (Content.Browser.isDesignTime || $("#i-dt-root", rootSelector).length === 0) {
                        return;
                    }
                    var settings = this.getFeatureSettings();
                    if (Content.Browser.isCompiledHelp() || !settings.isEnabled) {
                        $("#i-dt-root", rootSelector).hide();
                    }
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    Innovasys.DynamicToc = this;
                    this._rootSelector = rootSelector;
                    this.loadNodeContainer("c0", function () {
                        // If there is an initial node to select, load it, expand the path to it and mark as selected
                        if (typeof (settings.initialNodeId) != "undefined"
                            && settings.initialNodeId != null
                            && settings.initialNodeContainer != null) {
                            // Hide whilst selecting and expanding nodes
                            $("#i-toc-content", _this._rootSelector).hide();
                            _this.loadNodeToRoot(settings.initialNodeId, settings.initialNodeContainer, settings.initialNodeId);
                        }
                    });
                    if (settings.isResizable) {
                        $("#i-toc-content").resizable({
                            handles: "e",
                            resize: function (event, ui) {
                                _this.setTocWidth($(ui.element).outerWidth() + dynamicTocConstants.tocSplitterWidth);
                                $(ui.element).css("left", "");
                            }
                        });
                        // Load width from storage
                        var width = this.documentInstance.getLocalStorage().getAttribute("i-dynamic-toc-width");
                        if (width != null && width < dynamicTocConstants.maxSavedTocWidth && width > dynamicTocConstants.minSavedTocWidth) {
                            var $tocContent = $("#i-toc-content");
                            var innerWidthDifference = $tocContent.outerWidth() - $tocContent.width();
                            $tocContent.width(width - innerWidthDifference - dynamicTocConstants.tocSplitterWidth);
                            this.setTocWidth(width);
                        }
                    }
                };
                /**
                 * Adds a dynamic style to adjust the body margin to match the ToC width
                 */
                DynamicTocDocumentFeature.prototype.setTocWidth = function (width) {
                    var styleContainer = Content.Browser.getDynamicStyleContainer("i-dynamic-body-margin");
                    styleContainer.html("@media only screen and (min-width: 769px) { #i-body-content { margin-left: " + width + "px; }");
                    this.documentInstance.getLocalStorage().setAttribute("i-dynamic-toc-width", width);
                };
                /**
                 * Loads the passed node id (currentNodeId), loading the container if necessary and then repeating
                 * up the node hiearchy to the root. Once the node path is fully loaded, the path is expanded and
                 * the node is marked as selected.
                 */
                DynamicTocDocumentFeature.prototype.loadNodeToRoot = function (currentNodeId, containerToLoadNext, targetNodeId) {
                    var _this = this;
                    var node = this.getNode(currentNodeId);
                    if (this._loadedContainers[containerToLoadNext]) {
                        if (node.parentNodeId === "n0" || node.id === "n0") {
                            // Now joined up to the root node
                            this.createElementsForNodeChildren(node, true);
                            var targetNode = this.getNode(targetNodeId);
                            this.ensureNodeChildrenPopulated(targetNode, function (populatedNode) { return _this.expandAndSelectNode(populatedNode.id); });
                        }
                        else {
                            var parentNode = this.getNode(node.parentNodeId);
                            this.loadNodeToRoot(parentNode.id, parentNode.containerId, targetNodeId);
                        }
                    }
                    else {
                        this.loadNodeContainer(containerToLoadNext, function () {
                            _this.loadNodeToRoot(currentNodeId, containerToLoadNext, targetNodeId);
                        });
                    }
                };
                DynamicTocDocumentFeature.prototype.expandAndSelectNode = function (targetNodeId) {
                    // Expand down
                    var nodeToExpand = this.getNode(targetNodeId);
                    while (nodeToExpand != null) {
                        if ((nodeToExpand.id === "n0" || nodeToExpand.cc) && !nodeToExpand.isExpanded) {
                            this.toggleNodeIsExpanded(nodeToExpand);
                        }
                        nodeToExpand = this.getNode(nodeToExpand.parentNodeId);
                        if (typeof nodeToExpand == "undefined") {
                            nodeToExpand = null;
                        }
                    }
                    // If the target node has children and a url, check the first child to
                    //  see if it is for the same url and if so select that instead
                    var nodeToSelect = this.getNode(targetNodeId);
                    if (nodeToSelect.u != null &&
                        nodeToSelect.childNodes != null &&
                        nodeToSelect.childNodes.length > 0 &&
                        nodeToSelect.childNodes[0].u === nodeToSelect.u) {
                        nodeToSelect = nodeToSelect.childNodes[0];
                    }
                    this.setNodeSelected(nodeToSelect);
                    $("#i-toc-content", this._rootSelector).show();
                };
                /**
                 * Mark the node as selected (both in the node and related element)
                 */
                DynamicTocDocumentFeature.prototype.setNodeSelected = function (node) {
                    node.isSelected = true;
                    var $node = $("#i-n-" + node.id, this._rootSelector);
                    if ($node.length > 0) {
                        // Delay to ensure the ToC is visible
                        setTimeout(function () {
                            if (!Content.Browser.isElementInView($node.get(0), true)) {
                                $node.get(0).scrollIntoView();
                            }
                            $node.toggleClass("i-selected", true);
                        }, 1);
                    }
                };
                /**
                 * Returns true if the node has been loaded (either partially or fully)
                 */
                DynamicTocDocumentFeature.prototype.nodeExists = function (nodeId) {
                    return this.getNode(nodeId) != null;
                };
                /**
                 * Gets a previously loaded node. Returns null if the node has not been loaded
                 */
                DynamicTocDocumentFeature.prototype.getNode = function (nodeId) {
                    var possibleNode = this._allNodes[nodeId];
                    if (typeof possibleNode != "undefined" && possibleNode != null) {
                        return possibleNode;
                    }
                    return null;
                };
                /**
                 * Saves the passed node so that it can be fetched using getNode()
                 */
                DynamicTocDocumentFeature.prototype.setNode = function (node) {
                    this._allNodes[node.id] = node;
                };
                /**
                 * Injects node info, including child nodes. Called from container scripts.
                 */
                DynamicTocDocumentFeature.prototype.injectNodeInfo = function (nodeId, parentContainerId, childNodes) {
                    var _this = this;
                    var node = this.getNode(nodeId);
                    if (node == null) {
                        node = new DynamicTocNode();
                        node.id = nodeId;
                        if (node.id === "n0") {
                            node.cc = "c0";
                        }
                        this.setNode(node);
                    }
                    node.containerId = parentContainerId;
                    node.childNodes = $.map(childNodes, function (newChildNode) {
                        var currentNode = _this.getNode(newChildNode.id);
                        if (currentNode != null) {
                            // Node already exists, merge new one
                            var newNode = __assign(__assign({}, currentNode), newChildNode);
                            return newNode;
                        }
                        else {
                            // No existing node
                            return newChildNode;
                        }
                    });
                    $.each(node.childNodes, function (index, childNode) {
                        childNode.parentNodeId = node.id;
                        _this.setNode(childNode);
                    });
                    // Only create elements when this node is joined up to the parent
                    if (node.id === "n0" || (typeof node.parentNodeId != "undefined" && this.nodeExists(node.parentNodeId))) {
                        this.createElementsForNodeChildren(node);
                    }
                };
                /**
                 * Loads a node container script, executing an optional afterLoadCallback once the script is loaded.
                 */
                DynamicTocDocumentFeature.prototype.loadNodeContainer = function (containerId, afterLoadCallback) {
                    var _this = this;
                    Content.Browser.loadScript("./_toc/" + containerId + ".js", "dt-" + containerId, null, function () {
                        _this._loadedContainers[containerId] = true;
                        if (afterLoadCallback != null) {
                            afterLoadCallback(containerId);
                        }
                    });
                };
                /**
                 * Creates the DOM elements for the child nodes of the passed node. Set recurse to true to populate
                 * the whole node hiearchy below the passed node.
                 */
                DynamicTocDocumentFeature.prototype.createElementsForNodeChildren = function (node, recurse) {
                    var _this = this;
                    if (recurse === void 0) { recurse = false; }
                    if (!node.cc || node.childNodes == null) {
                        // No children, or children not yet populated
                        return;
                    }
                    if (!node.isPopulated) {
                        var settings_1 = this.getFeatureSettings();
                        var list_1;
                        var parentNode = null;
                        if (node.id === "n0") {
                            list_1 = $("#i-dt-root", this._rootSelector);
                        }
                        else {
                            // Find the node for the parent and add a child list to contain the children
                            var parentNodeId = "#i-n-" + node.id;
                            parentNode = $(parentNodeId, this._rootSelector);
                            if (parentNode.length === 0) {
                                // Parent node does not exist yet
                                return;
                            }
                            list_1 = $("<ul/>");
                        }
                        $.each(node.childNodes, function (index, childNode) {
                            var isNew = childNode.n;
                            var newListItem = $("<li/>", { id: "i-n-" + childNode.id })
                                .data("node-id", childNode.id);
                            if (isNew) {
                                newListItem.addClass("i-is-new");
                            }
                            var newExpander = $("<ins/>", {
                                /* eslint-disable-next-line quote-props */
                                "class": (childNode.cc ? "i-spacer i-expandorcollapse i-expand" : "i-spacer")
                            })
                                .on("click.dynamictoc", function (eventObject) {
                                eventObject.cancelBubble = true;
                                return _this.onNodeElementClick(eventObject.currentTarget, true);
                            });
                            var newNodeAnchor = $("<a/>")
                                .html(childNode.t)
                                .attr("href", childNode.u != null ? childNode.u : "#")
                                .on("click.dynamictoc", function (eventObject) {
                                eventObject.cancelBubble = true;
                                return _this.onNodeElementClick(eventObject.currentTarget, false);
                            });
                            newListItem.append(newExpander);
                            if (settings_1.isIconEnabled) {
                                var iconIndex = childNode.i == null ? -1 : childNode.i;
                                var iconClassIndex = iconIndex;
                                if (childNode.cc) {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = dynamicTocConstants.newFolderNodeIconIndex;
                                        }
                                        else {
                                            iconClassIndex = dynamicTocConstants.folderNodeIconIndex;
                                        }
                                    }
                                }
                                else {
                                    if (iconIndex <= 0) {
                                        if (isNew) {
                                            iconClassIndex = dynamicTocConstants.newPageNodeIconIndex;
                                        }
                                        else {
                                            iconClassIndex = dynamicTocConstants.pageNodeIconIndex;
                                        }
                                    }
                                }
                                var icon = $("<ins class=\"i-icon\"></ins>")
                                    .addClass("i-icon-" + iconClassIndex);
                                newListItem.append(icon);
                            }
                            newListItem.append(newNodeAnchor);
                            list_1.append(newListItem);
                        });
                        if (parentNode != null) {
                            parentNode.append(list_1);
                        }
                        else {
                            list_1.addClass("i-visible");
                        }
                        // Set flag to indicate populated
                        node.isPopulated = true;
                    }
                    if (recurse && node.childNodes != null) {
                        $.each(node.childNodes, function (index, childNode) {
                            _this.createElementsForNodeChildren(childNode, true);
                        });
                    }
                };
                /**
                 * Node element click handler
                 */
                DynamicTocDocumentFeature.prototype.onNodeElementClick = function (element, isExpandOnly) {
                    var _this = this;
                    var $element = $(element).parent("li");
                    var node = this.getNode($element.data("node-id"));
                    if (node.u != null && !isExpandOnly) {
                        Content.Browser.navigateTo(node.u, false);
                    }
                    else if (node.cc != null) {
                        this.ensureNodeChildrenPopulated(node, function (populatedNode) {
                            // Toggle expand
                            _this.toggleNodeIsExpanded(populatedNode);
                        });
                        return true;
                    }
                    return false;
                };
                /**
                 * Ensures that the passed node is populated. After it is populated, the afterPopulated callback is invoked.
                 */
                DynamicTocDocumentFeature.prototype.ensureNodeChildrenPopulated = function (node, afterPopulated) {
                    if (node.cc) {
                        if (!node.childNodes) {
                            // Node model needs to populate - it will expand once populated
                            this.loadNodeContainer(node.cc, function () {
                                afterPopulated(node);
                            });
                            return;
                        }
                        else {
                            if (!node.isPopulated) {
                                // Node model is populated, but the DOM elements have not been
                                //  created. Create them now
                                this.createElementsForNodeChildren(node);
                            }
                        }
                    }
                    afterPopulated(node);
                };
                /**
                 * Expand / collapse a node.
                 */
                DynamicTocDocumentFeature.prototype.toggleNodeIsExpanded = function (node) {
                    var spacer = $("#i-n-" + node.id + " > ins", this._rootSelector);
                    spacer.toggleClass("i-expand i-collapse");
                    spacer.siblings("ul").toggleClass("i-visible");
                    if (this.getFeatureSettings().isIconEnabled) {
                        // Update the icon for the 2 state icons
                        var icon = $("#i-n-" + node.id + " > a > ins", this._rootSelector);
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
                    }
                    node.isExpanded = spacer.hasClass("i-collapse");
                };
                DynamicTocDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        initialNodeContainer: null,
                        initialNodeId: null,
                        isIconEnabled: false,
                        isEnabled: false,
                        isResizable: true
                    };
                };
                DynamicTocDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("dynamictoc", this.getDefaultSettings);
                };
                return DynamicTocDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.DynamicTocDocumentFeature = DynamicTocDocumentFeature;
            var DynamicTocDocumentFeatureFactory = /** @class */ (function () {
                function DynamicTocDocumentFeatureFactory() {
                }
                DynamicTocDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    if (!Content.Browser.isCompiledHelp()) {
                        return new DynamicTocDocumentFeature(documentInstance);
                    }
                };
                return DynamicTocDocumentFeatureFactory;
            }());
            Features.DynamicTocDocumentFeatureFactory = DynamicTocDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.DynamicTocDocumentFeatureFactory());

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
            var inThisTopicConstants = {
                expansionDelay: 250,
                maxInThisTopicAnchors: 100
            };
            var InThisTopicHeading = /** @class */ (function () {
                function InThisTopicHeading(documentInstance) {
                    this.headingLevel = 1;
                    this.childHeadings = [];
                    this._documentInstance = documentInstance;
                }
                InThisTopicHeading.prototype.createElement = function () {
                    var _this = this;
                    // Create the heading link that points to the anchor we created
                    var headingLink = $("<a/>", { href: "#" + this.anchorName })
                        .text(this.headingText)
                        .on("click.inthistopic", function () {
                        var clickTarget = _this.headingElement;
                        if ($(clickTarget).hasClass("i-section-heading")) {
                            // Click on a section heading. Make sure that the content within the heading
                            //  is visible and scroll so that the first child is in view
                            var $firstContentChild = $(clickTarget)
                                .next(".i-section-content")
                                .children();
                            if ($firstContentChild.length > 0) {
                                var firstContentChild = $firstContentChild.get(0);
                                var documentInstance = Content.Browser.getDocumentInstance(firstContentChild);
                                documentInstance.ensureElementVisible(firstContentChild);
                                // Timeout is necessary to allow the parent section(s) to expand
                                setTimeout(function () {
                                    clickTarget.scrollIntoView(true);
                                    _this.refreshAllHighlights();
                                }, inThisTopicConstants.expansionDelay);
                            }
                        }
                        if (clickTarget != null) {
                            // Click on a current invisible heading (i.e. in a collapsed section). Call ensureElementVisible
                            //  and then scroll to the target
                            var documentInstance = Content.Browser.getDocumentInstance(clickTarget);
                            documentInstance.ensureElementVisible(clickTarget);
                            // Timeout is necessary to allow the parent section(s) to expand
                            setTimeout(function () {
                                clickTarget.scrollIntoView(true);
                                _this.refreshAllHighlights();
                            }, inThisTopicConstants.expansionDelay);
                        }
                    });
                    // Create a list item to contain the link
                    this.listItemId = Content.Browser.getUniqueId();
                    var headingListItem = $("<li/>")
                        .attr("id", this.listItemId)
                        .addClass("i-heading-level-" + this.headingLevel)
                        .append(headingLink);
                    if (this.childHeadings.length > 0) {
                        // Create a child list and add the child items to it
                        var childList_1 = $("<ul/>").addClass("i-in-this-topic i-in-this-topic-" + this.headingLevel);
                        $.each(this.childHeadings, function (index, childHeading) {
                            childList_1.append(childHeading.createElement());
                        });
                        headingListItem.append(childList_1);
                    }
                    return headingListItem;
                };
                InThisTopicHeading.prototype.refreshAllHighlights = function () {
                    var feature = this._documentInstance.getFeatureByName("In This Topic");
                    feature.refreshHighlights();
                };
                InThisTopicHeading.prototype.getIsVisible = function () {
                    return Content.Browser.isElementInView(this.headingElement, !this.isSectionHeading);
                };
                InThisTopicHeading.prototype.highlightVisibility = function (isVisible) {
                    $("#" + this.listItemId).toggleClass("i-inthistopic-visible", isVisible);
                };
                return InThisTopicHeading;
            }());
            Features.InThisTopicHeading = InThisTopicHeading;
            var InThisTopicDocumentFeature = /** @class */ (function (_super) {
                __extends(InThisTopicDocumentFeature, _super);
                function InThisTopicDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._rootHeadings = null;
                    return _this;
                }
                InThisTopicDocumentFeature.prototype.getName = function () {
                    return "In This Topic";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                InThisTopicDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (Content.Browser.isDesignTime || $(".i-in-this-topic-container", rootSelector).length === 0) {
                        return;
                    }
                    var allHeadingsSelector = null;
                    var featureSettings = this.getFeatureSettings();
                    if (featureSettings != null) {
                        if (!featureSettings.isSupported) {
                            return;
                        }
                        allHeadingsSelector = featureSettings.headingTags;
                        if (!featureSettings.isEnabled) {
                            $(".i-in-this-topic-container").hide();
                            return;
                        }
                    }
                    var anchors = {};
                    if (allHeadingsSelector == null) {
                        allHeadingsSelector = "h1,h2,h3,.i-section-heading";
                    }
                    var allHeadings = $(allHeadingsSelector);
                    this._rootHeadings = [];
                    allHeadings.each(function (_, element) {
                        var thisHeading = $(element);
                        var tagName = element.tagName;
                        var inThisTopicHeading = new InThisTopicHeading(_this.documentInstance);
                        inThisTopicHeading.headingElement = element;
                        // Find the level of this heading
                        /* eslint-disable-next-line no-magic-numbers */
                        if (tagName.length === 2 && tagName.substring(0, 1) === "H") {
                            inThisTopicHeading.headingLevel = parseInt(tagName.substring(1), 10);
                        }
                        else {
                            if (thisHeading.hasClass("i-section-heading")) {
                                inThisTopicHeading.headingLevel = 1;
                                // If this is a nested heading, find the parent and use its headinglevel+1
                                var $parentSectionContent = thisHeading.parent(".i-section-content");
                                if ($parentSectionContent.length > 0) {
                                    var $parentSectionHeading = $parentSectionContent.prev(".i-section-heading");
                                    if ($parentSectionHeading.length > 0) {
                                        var parentHeading = _this.findInThisTopicHeading(_this._rootHeadings, $parentSectionHeading.get(0));
                                        if (parentHeading != null) {
                                            inThisTopicHeading.headingLevel = parentHeading.headingLevel + 1;
                                        }
                                    }
                                }
                                inThisTopicHeading.isSectionHeading = true;
                            }
                        }
                        // Get heading text
                        inThisTopicHeading.headingText = inThisTopicHeading.isSectionHeading
                            ? thisHeading.children(".i-section-heading-text")
                                .first()
                                .text()
                            : thisHeading.text();
                        // Create a unique anchor name for this heading
                        var anchorName = "i-heading-" + inThisTopicHeading.headingText.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
                        if (anchors[anchorName] != null) {
                            for (var a = 0; a < inThisTopicConstants.maxInThisTopicAnchors; a++) {
                                if (anchors[anchorName + "-" + a] == null) {
                                    anchorName = anchorName + "-" + a;
                                    break;
                                }
                            }
                        }
                        anchors[anchorName] = true;
                        inThisTopicHeading.anchorName = anchorName;
                        // Find the logical parent of this heading
                        var parentInThisTopicHeading = _this.findParentInThisTopicHeading(null, _this._rootHeadings, inThisTopicHeading.headingLevel);
                        if (parentInThisTopicHeading == null) {
                            // Root heading
                            _this._rootHeadings.push(inThisTopicHeading);
                        }
                        else {
                            // Nested heading
                            parentInThisTopicHeading.childHeadings.push(inThisTopicHeading);
                        }
                        // Add an anchor just before the heading content as a target for the link
                        thisHeading.prepend($("<a/>", { name: inThisTopicHeading.anchorName }));
                    });
                    var headingList = $("<ul/>")
                        .addClass("i-in-this-topic i-in-this-topic-root");
                    if (this.getFeatureSettings().areChildHeadingsAlwaysVisible) {
                        headingList.addClass("i-in-this-topic-child-headings-always-visible");
                    }
                    $.each(this._rootHeadings, function (_, inThisTopicHeading) {
                        var element = inThisTopicHeading.createElement();
                        headingList.append(element);
                    });
                    // Add the list to the body
                    if (this._rootHeadings.length > 0) {
                        $(".i-in-this-topic-container").append(headingList);
                        $(window)
                            .off("scroll.inthistopic")
                            .on("scroll.inthistopic", function () {
                            _this.refreshHighlights();
                        })
                            .off("resize.inthistopic")
                            .on("resize.inthistopic", function () {
                            _this.refreshHighlights();
                        });
                        setTimeout(function () { return _this.refreshHighlights(); }, 1);
                    }
                    else {
                        $(".i-in-this-topic-container").hide();
                    }
                };
                InThisTopicDocumentFeature.prototype.refreshHighlights = function () {
                    this.highlightSelected(null, this._rootHeadings);
                };
                InThisTopicDocumentFeature.prototype.highlightSelected = function (parent, headings) {
                    var _this = this;
                    if (headings == null) {
                        headings = this._rootHeadings;
                    }
                    var returnValue = false;
                    if (parent != null) {
                        returnValue = parent.getIsVisible();
                    }
                    $.each(headings, function (_, heading) {
                        returnValue = (_this.highlightSelected(heading, heading.childHeadings) && parent != null) || returnValue;
                    });
                    if (parent != null) {
                        parent.highlightVisibility(returnValue);
                    }
                    return returnValue;
                };
                InThisTopicDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        areChildHeadingsAlwaysVisible: true,
                        headingTags: null,
                        isEnabled: false,
                        isSupported: false
                    };
                };
                InThisTopicDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("inthistopic", this.getDefaultSettings);
                };
                InThisTopicDocumentFeature.prototype.findInThisTopicHeading = function (headings, heading) {
                    if (headings == null || headings.length === 0) {
                        return null;
                    }
                    for (var _i = 0, headings_1 = headings; _i < headings_1.length; _i++) {
                        var childHeading = headings_1[_i];
                        if (childHeading.headingElement === heading) {
                            return childHeading;
                        }
                        var match = this.findInThisTopicHeading(childHeading.childHeadings, heading);
                        if (match != null) {
                            return match;
                        }
                    }
                    return null;
                };
                InThisTopicDocumentFeature.prototype.findParentInThisTopicHeading = function (parent, headings, headingLevel) {
                    if (parent != null && parent.headingLevel === headingLevel - 1) {
                        // This is the heading level we are looking for
                        return parent;
                    }
                    var lastChild = headings.length > 0
                        ? headings[headings.length - 1]
                        : null;
                    if (lastChild == null) {
                        // No child headings to search
                        return null;
                    }
                    else {
                        var foundHeading = this.findParentInThisTopicHeading(lastChild, lastChild.childHeadings, headingLevel);
                        if (foundHeading != null) {
                            return foundHeading;
                        }
                        else {
                            // No find in the levels below, so match the largest heading
                            //  available in the current hierarchy
                            if (lastChild.headingLevel <= headingLevel - 1) {
                                return lastChild;
                            }
                        }
                    }
                    return null;
                };
                return InThisTopicDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.InThisTopicDocumentFeature = InThisTopicDocumentFeature;
            var InThisTopicDocumentFeatureFactory = /** @class */ (function () {
                function InThisTopicDocumentFeatureFactory() {
                }
                InThisTopicDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new InThisTopicDocumentFeature(documentInstance);
                };
                return InThisTopicDocumentFeatureFactory;
            }());
            Features.InThisTopicDocumentFeatureFactory = InThisTopicDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.InThisTopicDocumentFeatureFactory());

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
            var languageFilterConstants = {
                vbLanguageCount: 2
            };
            var LanguageFilterDocumentFeature = /** @class */ (function (_super) {
                __extends(LanguageFilterDocumentFeature, _super);
                function LanguageFilterDocumentFeature() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._linkSelector = ".i-language-filter";
                    _this._allLabelSelector = "label.i-language-filter-all";
                    _this._languageLabelSelectorPrefix = "label.i-language-filter-";
                    _this._languageNameAttributeName = "data-languagename";
                    _this._filteredContentClassNamePrefix = "i-filtered-content-";
                    _this._toggleClassAttributeName = "data-toggleclass";
                    return _this;
                }
                LanguageFilterDocumentFeature.prototype.getName = function () {
                    return "Language Filter";
                };
                LanguageFilterDocumentFeature.prototype.getCheckboxClassName = function () {
                    return "i-toggle-language-checkbox";
                };
                /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
                LanguageFilterDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    // Move VB and VBUsage to a common Syntax-VB div
                    var tabContainers = $(".i-tab-container", rootSelector);
                    tabContainers.each(function (_, element) {
                        var tabContainer = $(element);
                        if ($("a[href='#i-syntax-VBAll']", tabContainer).length > 0) {
                            $("<div>", { id: "i-syntax-VBAll", "class": "i-code" })
                                .append($("#i-syntax-VB", tabContainer))
                                .append("&nbsp;")
                                .append($("#i-syntax-VBUsage", tabContainer))
                                .appendTo(tabContainer);
                        }
                    });
                    _super.prototype.initializeContent.call(this, rootSelector);
                };
                LanguageFilterDocumentFeature.prototype.toggleCheckbox = function (element, isImmediate) {
                    if (isImmediate === void 0) { isImmediate = false; }
                    var rootSelector = this.documentInstance.rootSelector;
                    // Don't allow removal of the last language
                    var allCheckboxes = $("." + this.getCheckboxClassName());
                    var allCheckedCheckboxes = allCheckboxes.filter(":checked");
                    if (allCheckedCheckboxes.length === 0) {
                        element.prop("checked", true);
                        return $();
                    }
                    // Base implementation shows/hides the related content
                    var result = _super.prototype.toggleCheckbox.call(this, element, isImmediate);
                    var isChecked = element.is(":checked");
                    var toggleClassName = element.attr(this._toggleClassAttributeName);
                    // Wrapper for toggleCheckBox that hides the consolidated VB section
                    //  if both VB and VBUsage are hidden
                    if (toggleClassName === this._filteredContentClassNamePrefix + "VBUsage"
                        || toggleClassName === this._filteredContentClassNamePrefix + "VB") {
                        var isVbChecked = rootSelector.find("." + this.getCheckboxClassName() + "[data-languagename='VB']").is(":checked");
                        var isVbUsageChecked = rootSelector.find("." + this.getCheckboxClassName() + "[data-languagename='VBUsage']").is(":checked");
                        if ((isChecked && !(isVbChecked && isVbUsageChecked))
                            || (!isChecked && !isVbChecked && !isVbUsageChecked)) {
                            this.documentInstance.setElementVisibility(rootSelector.find("." + this._filteredContentClassNamePrefix + "VBAll"), isChecked, isImmediate);
                        }
                    }
                    return result;
                };
                LanguageFilterDocumentFeature.prototype.updateFilterLabel = function () {
                    // Set caption of language filter to reflect current set
                    var targetLabel = null;
                    var allCheckboxes = $("." + this.getCheckboxClassName());
                    var allCheckedCheckboxes = allCheckboxes.filter(":checked");
                    var allLabels = $(this._linkSelector + " label");
                    if (allCheckedCheckboxes.length === allCheckboxes.length) {
                        // All languages
                        targetLabel = $(this._linkSelector + " " + this._allLabelSelector);
                    }
                    else if (allCheckedCheckboxes.length === 0) {
                        // No languages
                    }
                    else if (allCheckedCheckboxes.length === 1) {
                        // Single language
                        var languageName = allCheckedCheckboxes.attr(this._languageNameAttributeName);
                        targetLabel =
                            $(this._linkSelector + " " + this._languageLabelSelectorPrefix + languageName + "," + this._linkSelector + " .i-" + languageName + "-label");
                    }
                    else {
                        // Multiple languages
                        if (allCheckedCheckboxes.length === languageFilterConstants.vbLanguageCount
                            && allCheckedCheckboxes.filter("[" + this._languageNameAttributeName + "^='VB']").length === languageFilterConstants.vbLanguageCount) {
                            // 2 languages, both VB
                            targetLabel = $(this._linkSelector + " " + this._languageLabelSelectorPrefix + "vball");
                        }
                        else {
                            targetLabel = $(this._linkSelector + " " + this._languageLabelSelectorPrefix + "multiple");
                        }
                    }
                    allLabels.css("display", "none");
                    if (targetLabel != null) {
                        targetLabel.css("display", "inline");
                    }
                };
                return LanguageFilterDocumentFeature;
            }(Features.ContentFilterDocumentFeature));
            Features.LanguageFilterDocumentFeature = LanguageFilterDocumentFeature;
            var LanguageFilterDocumentFeatureFactory = /** @class */ (function () {
                function LanguageFilterDocumentFeatureFactory() {
                }
                LanguageFilterDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new LanguageFilterDocumentFeature(documentInstance);
                };
                return LanguageFilterDocumentFeatureFactory;
            }());
            Features.LanguageFilterDocumentFeatureFactory = LanguageFilterDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.LanguageFilterDocumentFeatureFactory());

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
            var MemberFilterDocumentFeature = /** @class */ (function (_super) {
                __extends(MemberFilterDocumentFeature, _super);
                function MemberFilterDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                MemberFilterDocumentFeature.prototype.getName = function () {
                    return "Member Filter";
                };
                MemberFilterDocumentFeature.prototype.getCheckboxClassName = function () {
                    return "i-toggle-filter-checkbox";
                };
                MemberFilterDocumentFeature.prototype.updateFilterLabel = function () {
                    var rootSelector = this.documentInstance.rootSelector;
                    var isFiltered = !$("#i-inherited-checkbox").is(":checked") || !$("#i-protected-checkbox").is(":checked");
                    rootSelector.find(".i-members-all").css("display", isFiltered ? "none" : "inline");
                    rootSelector.find(".i-members-filtered").css("display", isFiltered ? "inline" : "none");
                };
                return MemberFilterDocumentFeature;
            }(Features.ContentFilterDocumentFeature));
            Features.MemberFilterDocumentFeature = MemberFilterDocumentFeature;
            var MemberFilterDocumentFeatureFactory = /** @class */ (function () {
                function MemberFilterDocumentFeatureFactory() {
                }
                MemberFilterDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new MemberFilterDocumentFeature(documentInstance);
                };
                return MemberFilterDocumentFeatureFactory;
            }());
            Features.MemberFilterDocumentFeatureFactory = MemberFilterDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.MemberFilterDocumentFeatureFactory());

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
        var Versions;
        (function (Versions) {
            var Configuration = /** @class */ (function () {
                function Configuration() {
                }
                return Configuration;
            }());
            Versions.Configuration = Configuration;
            var VersionDefinitionSet = /** @class */ (function () {
                function VersionDefinitionSet() {
                }
                return VersionDefinitionSet;
            }());
            Versions.VersionDefinitionSet = VersionDefinitionSet;
            var VersionDefinition = /** @class */ (function () {
                function VersionDefinition() {
                }
                return VersionDefinition;
            }());
            Versions.VersionDefinition = VersionDefinition;
        })(Versions = Content.Versions || (Content.Versions = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
/* eslint-disable-next-line @typescript-eslint/no-unused-vars, no-redeclare */
(function (Innovasys) {
    var Content;
    (function (Content) {
        var Features;
        (function (Features) {
            Features.versionConstants = {
                badRequestStatusCode: 400
            };
            var VersionsDocumentFeature = /** @class */ (function (_super) {
                __extends(VersionsDocumentFeature, _super);
                function VersionsDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                VersionsDocumentFeature.prototype.getName = function () {
                    return "Versions";
                };
                VersionsDocumentFeature.prototype.initializeContentOrdinal = function () {
                    // Initialise before popup links feature
                    return -1;
                };
                VersionsDocumentFeature.prototype.initializeContent = function (rootSelector, isInitialLoad) {
                    var _this = this;
                    if (isInitialLoad === void 0) { isInitialLoad = false; }
                    if (Content.Browser.isDesignTime || Content.Browser.isCompiledHelp()) {
                        return;
                    }
                    if (isInitialLoad) {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        if (Innovasys.settings.versions.isEnabled
                            && Content.Versions.Configuration
                            && Content.Versions.Configuration.versionDefinitionSets) {
                            $.each(Content.Versions.Configuration.versionDefinitionSets, function (index, item) {
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                if (Innovasys.settings.versions[item.id]) {
                                    if (item.versionDefinitions.length > 1) {
                                        _this.createPopupForVersionDefinitionSet(item);
                                    }
                                }
                            });
                        }
                    }
                    else {
                        // Initialising the Editions list
                        var $popupContent = rootSelector.find(".i-version-selector");
                        if ($popupContent.length > 0) {
                            $popupContent.each(function (_, popupContentElement) {
                                _this.discoverVersions($(popupContentElement).attr("data-i-versionset-id"), $(popupContentElement));
                            });
                        }
                    }
                };
                VersionsDocumentFeature.prototype.discoverVersions = function (versionDefinitionSetId, popupContent) {
                    var _this = this;
                    if (popupContent.attr("data-i-populated") != null) {
                        return;
                    }
                    popupContent.attr("data-i-populated", "true");
                    var versionDefinitionSet = Content.Versions.Configuration.versionDefinitionSets.filter(function (item) { return item.id === versionDefinitionSetId; })[0];
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var currentVersionId = Innovasys.settings.versions[versionDefinitionSet.id].currentId;
                    var promises = $.map(versionDefinitionSet.versionDefinitions, function (item) {
                        var versionId = versionDefinitionSet.id + "-" + item.id;
                        var $itemElement = $(".i-version-link[data-version-id='" + versionId + "']", popupContent);
                        if (item.id === currentVersionId) {
                            // Current version
                            $itemElement.addClass("i-discovered");
                        }
                        else {
                            // Not the current version, discover
                            var discoveryUrl = _this.parseContentUrlTemplate(item, Content.Versions.Configuration.discoveryUrl, versionDefinitionSet.id);
                            if (discoveryUrl != null && discoveryUrl !== "") {
                                var targetUrl_1 = discoveryUrl;
                                void $.ajax({
                                    type: "HEAD",
                                    url: targetUrl_1,
                                    complete: function (xhr) {
                                        if (xhr.status !== 0 && xhr.status < Features.versionConstants.badRequestStatusCode) {
                                            $itemElement.addClass("i-discovered");
                                            var $anchor = $("<a />");
                                            $anchor.attr("target", "_top");
                                            var isFrameless = versionDefinitionSetId === "edition"
                                                ? item.isFrameless
                                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                                : Innovasys.settings.isFrameless;
                                            if (!isFrameless) {
                                                // Different url for navigating to the discovered page
                                                var navigationUrl = _this.parseContentUrlTemplate(item, Content.Versions.Configuration.navigationUrl, versionDefinitionSet.id);
                                                $anchor.attr("href", navigationUrl);
                                            }
                                            else {
                                                // Direct navigation to the same page we discovered
                                                $anchor.attr("href", targetUrl_1);
                                            }
                                            $anchor.text($itemElement.text());
                                            $itemElement.empty().append($anchor);
                                        }
                                        else {
                                            $itemElement.addClass("i-unavailable");
                                        }
                                    }
                                });
                            }
                            else {
                                // No target url
                                $itemElement.addClass("i-unavailable");
                            }
                        }
                    });
                    void jQuery.when(promises)
                        .always(function () {
                        //
                    });
                };
                VersionsDocumentFeature.prototype.parseContentUrlTemplate = function (versionDefinition, urlTemplate, targetVersionSetId) {
                    return urlTemplate.replace(/%%(.*?)%%/g, function (match) {
                        switch (match.toLowerCase()) {
                            case "%%pagefilename%%":
                                return Content.Browser.getLocationInfo().pathname.split("/").pop();
                            case "%%locale%%":
                                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                var locale = Innovasys.settings.versions.locale.currentId;
                                if (locale === "-") {
                                    return "";
                                }
                                else {
                                    return "_" + locale;
                                }
                            default:
                                var versionSetId = match.replace(/%%/g, "").toLowerCase();
                                var value = "";
                                if (versionSetId === targetVersionSetId) {
                                    // The id we are switching to
                                    value = versionDefinition.id;
                                }
                                else {
                                    // Current id value for this version set
                                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                    value = Innovasys.settings.versions[versionSetId].currentId;
                                }
                                return value;
                        }
                    });
                };
                VersionsDocumentFeature.prototype.getPopupContainerSelector = function () {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var selector = Innovasys.settings.versions.popupContainer;
                    if (selector) {
                        return selector;
                    }
                    else {
                        return "#i-actions-content";
                    }
                };
                VersionsDocumentFeature.prototype.createPopupForVersionDefinitionSet = function (versionDefinitionSet) {
                    var id = "i-version-" + versionDefinitionSet.id;
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    var currentVersionId = Innovasys.settings.versions[versionDefinitionSet.id].currentId;
                    var $container = $(this.getPopupContainerSelector());
                    var $span = $("<span class='i-popup-link i-version-popup-link' />");
                    $span.attr("data-popup-title", versionDefinitionSet.caption);
                    $span.text(versionDefinitionSet.caption);
                    $span.attr("data-popup-contentsource", "#" + id);
                    var $contentDiv = $("<div class='i-popup-content i-version-selector'/>");
                    $contentDiv.attr("data-i-versionset-id", versionDefinitionSet.id);
                    $contentDiv.attr("id", id);
                    var $versionList = $("<ul/>");
                    $.each(versionDefinitionSet.versionDefinitions, function (index, item) {
                        var $versionItem = $("<li class='i-version-link'/>");
                        if (currentVersionId === item.id) {
                            $versionItem.addClass("i-current-version");
                        }
                        $versionItem.attr("data-version-id", versionDefinitionSet.id + "-" + item.id);
                        $versionItem.text(item.caption);
                        $versionList.append($versionItem);
                    });
                    $contentDiv.append($versionList);
                    $container.append($span);
                    $container.append($contentDiv);
                    return $span;
                };
                VersionsDocumentFeature.prototype.getDefaultSettings = function () {
                    return {
                        isEnabled: true
                    };
                };
                VersionsDocumentFeature.prototype.getFeatureSettings = function () {
                    return this.documentInstance.getFeatureSettings("Versions", this.getDefaultSettings);
                };
                return VersionsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.VersionsDocumentFeature = VersionsDocumentFeature;
            var VersionsDocumentFeatureFactory = /** @class */ (function () {
                function VersionsDocumentFeatureFactory() {
                }
                VersionsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    if (Innovasys.settings.versions.isEnabled
                        && Content.Versions.Configuration
                        && Content.Versions.Configuration.versionDefinitionSets) {
                        return new VersionsDocumentFeature(documentInstance);
                    }
                };
                return VersionsDocumentFeatureFactory;
            }());
            Features.VersionsDocumentFeatureFactory = VersionsDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.VersionsDocumentFeatureFactory());

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
            var TopicsDocumentFeature = /** @class */ (function (_super) {
                __extends(TopicsDocumentFeature, _super);
                function TopicsDocumentFeature() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                TopicsDocumentFeature.prototype.getName = function () {
                    return "topics";
                };
                TopicsDocumentFeature.prototype.populateResponsiveConfiguration = function (configuration) {
                    _super.prototype.populateResponsiveConfiguration.call(this, configuration);
                    if (configuration.profileName === "mobile" || configuration.profileName === "tablet") {
                        switch (configuration.profileName) {
                            case "tablet":
                                break;
                            case "mobile":
                                configuration.clickTargets.push(new Content.ResponsiveClickTarget(".i-glossary-letter-header", Content.ResponsiveClickTargetKind.block));
                                break;
                            // No default
                        }
                        // Common mobile and tablet
                    }
                };
                TopicsDocumentFeature.prototype.applyResponsiveConfiguration = function (configuration) {
                    // Remove slimbox click handler in responsive mode
                    if (configuration.profileName === "mobile") {
                        $(".i-glossary-letter-header")
                            .addClass("i-section-heading")
                            .next()
                            .addClass("i-section-content");
                    }
                };
                return TopicsDocumentFeature;
            }(Content.DocumentFeatureBase));
            Features.TopicsDocumentFeature = TopicsDocumentFeature;
            var TopicsDocumentFeatureFactory = /** @class */ (function () {
                function TopicsDocumentFeatureFactory() {
                }
                TopicsDocumentFeatureFactory.prototype.createInstance = function (documentInstance) {
                    // Always enabled
                    return new TopicsDocumentFeature(documentInstance);
                };
                return TopicsDocumentFeatureFactory;
            }());
            Features.TopicsDocumentFeatureFactory = TopicsDocumentFeatureFactory;
        })(Features = Content.Features || (Content.Features = {}));
    })(Content = Innovasys.Content || (Innovasys.Content = {}));
})(Innovasys || (Innovasys = {}));
Innovasys.Content.DocumentFeatureConfiguration.registerDocumentFeatureFactory(new Innovasys.Content.Features.TopicsDocumentFeatureFactory());

//# sourceMappingURL=innovasys.topics.js.map
