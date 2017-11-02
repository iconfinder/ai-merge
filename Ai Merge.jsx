/**
 * @fileOverview This script allows you to select a folder of SVG, AI, EPS, and/or PDF files and merge them into a single document.
 * @license See the enclosed LICENSE file for details.
 * @usage   See the enclosed README for installation and usage.
 */
#target Illustrator

var originalInteractionLevel = userInteractionLevel;
userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

/**
 * Determine the HOME location for setting up the default configuration.
 */
var HOME_FOLDER = (new Folder($.getenv("HOME"))).absoluteURI;

/**
 * Default configuration. Many of these values are over-written by the dialog.
 * @type {{
 *     ARTBOARD_COUNT: number,
 *     ARTBOARD_WIDTH: number,
 *     ARTBOARD_HEIGHT: number,
 *     ARTBOARD_SPACING: number,
 *     ARTBOARD_ROWSxCOLS: number,
 *     LOG_FILE_PATH: string,
 *     OUTPUT_FILENAME: string,
 *     SCALE: number,
 *     ROOT: string,
 *     SRC_FOLDER: string,
 *     ATH_SEPATATOR: string
 * }}
 */
var CONFIG = {
    ARTBOARD_COUNT      : 1,
    ARTBOARD_WIDTH      : 24,
    ARTBOARD_HEIGHT     : 24,
    ARTBOARD_SPACING    : 24,
    ARTBOARD_ROWSxCOLS  : 10,
    LOG_FILE_PATH       : HOME_FOLDER + "/ai-script-log.txt",
    CONFIG_FILE_PATH    : HOME_FOLDER + "/ai-script-conf.json",
    LOGGING             : true,
    OUTPUT_FILENAME     : "merged-files.ai",
    SCALE               : 100,
    ROOT                : HOME_FOLDER,
    SRC_FOLDER          : "",
    PATH_SEPATATOR      : "/",
    SORT_ARTBOARDS      : true,
    SYSTEM              : $.os.search(/windows/i) != -1 ? "WINDOWS" : "MAC"
};

/**
 * @type {{
 *    CHOOSE_FOLDER: string, 
 *    NO_SELECTION: string, 
 *    LABEL_DIALOG_WINDOW: string, 
 *    LABEL_ARTBOARD_WIDTH: string, 
 *    LABEL_ARTBOARD_HEIGHT: string, 
 *    LABEL_COL_COUNT: string, 
 *    LABEL_ROW_COUNT: string, 
 *    LABEL_ARTBOARD_SPACING: string, 
 *    LABEL_SCALE: string, 
 *    LABEL_FILE_NAME: string, 
 *    LABEL_FILETYPES: string, 
 *    LABEL_LOGGING: string, 
 *    FILETYPE_SVG: string, 
 *    FILETYPE_AI: string, 
 *    FILETYPE_EPS: string, 
 *    FILETYPE_PDF: string, 
 *    BUTTON_CANCEL: string, 
 *    BUTTON_OK: string, 
 *    DOES_NOT_EXIST: string, 
 *    LAYER_NOT_CREATED: string, 
 *    LABEL_SRC_FOLDER: string, 
 *    LABEL_CHOOSE_FOLDER: string, 
 *    LABEL_INPUT: string, 
 *    LABEL_SIZE: string, 
 *    LABEL_OUTPUT: string, 
 *    SORT_FILELIST_FAILED: string, 
 *    LABEL_SORT_ARTBOARDS: string, 
 *    PROGRESS: string, 
 *    IMPORTING_FILE: string, 
 *    ERROR: string, 
 *    ERROR_IN_FILE: string, 
 *    CENTERING_OBJ: string
 * }}
 */
var LANG = {
    CHOOSE_FOLDER          : 'Please choose your Folder of files to merge',
    NO_SELECTION           : 'No selection',
    LABEL_DIALOG_WINDOW    : 'Merge SVG Files',
    LABEL_ARTBOARD_WIDTH   : 'Artboard Width:',
    LABEL_ARTBOARD_HEIGHT  : 'Artboard Height:',
    LABEL_COL_COUNT        : 'Columns:',
    LABEL_ROW_COUNT        : 'Rows:',
    LABEL_ARTBOARD_SPACING : 'Artboard Spacing:',
    LABEL_SCALE            : 'Scale:',
    LABEL_FILE_NAME        : 'File Name:',
    LABEL_FILETYPES        : 'File Types:',
    LABEL_LOGGING          : 'Logging?',
    FILETYPE_SVG           : 'SVG',
    FILETYPE_AI            : 'AI',
    FILETYPE_EPS           : 'EPS',
    FILETYPE_PDF           : 'PDF',
    BUTTON_CANCEL          : 'Cancel',
    BUTTON_OK              : 'Ok',
    DOES_NOT_EXIST         : ' does not exist',
    LAYER_NOT_CREATED      : 'Could not create layer. ',
    LABEL_SRC_FOLDER       : 'Source Folder',
    LABEL_CHOOSE_FOLDER    : 'Choose Folder',
    LABEL_INPUT            : 'Input',
    LABEL_SIZE             : 'Size',
    LABEL_OUTPUT           : 'Output',
    SORT_FILELIST_FAILED   : 'Could not sort the file list',
    LABEL_SORT_ARTBOARDS   : 'Sort Artboards?',
    PROGRESS               : 'Progress',
    IMPORTING_FILE         : 'Importing file ',
    ERROR                  : 'Error',
    ERROR_IN_FILE          : 'Error in `doc.groupItems.createFromFile` with file `',
    CENTERING_OBJ          : "Centering object "
};

/**
 * Add Array.indexOf support if not supported natively.
 */
if (! Array.prototype.indexOf) {
    /**
     * Gets the index of an element in an array.
     * @param what
     * @param i
     * @returns {*}
     */
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

/**
 * Add Array.remove support.
 * @returns {Array}
 */
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

/*-------------------------------------------------------------------------------------------------------------------------*/
/**
 * Adds JSON library support for engines that do not include it natively.
 * @author Douglas Crockford - https://github.com/douglascrockford/JSON-js/
 */
"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(t){return 10>t?"0"+t:t}function quote(t){
    return escapable.lastIndex=0,escapable.test(t)?'"'+t.replace(escapable,function(t){var e=meta[t];
            return"string"==typeof e?e:"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+t+'"'}
    function str(t,e){var n,r,o,f,u,i=gap,p=e[t];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(t)),
    "function"==typeof rep&&(p=rep.call(e,t,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";
        case"boolean":case"null":return String(p);case"object":if(!p)return"null";if(gap+=indent,u=[],"[object Array]"===Object.prototype.toString.apply(p)){
            for(f=p.length,n=0;f>n;n+=1)u[n]=str(n,p)||"null";return o=0===u.length?"[]":gap?"[\n"+gap+u.join(",\n"+gap)+"\n"+i+"]":"["+u.join(",")+"]",gap=i,o}
            if(rep&&"object"==typeof rep)for(f=rep.length,n=0;f>n;n+=1)"string"==typeof rep[n]&&(r=rep[n],o=str(r,p),o&&u.push(quote(r)+(gap?": ":":")+o));
            else for(r in p)Object.prototype.hasOwnProperty.call(p,r)&&(o=str(r,p),o&&u.push(quote(r)+(gap?": ":":")+o));return o=0===u.length?"{}":gap?"{\n"+gap+
                    u.join(",\n"+gap)+"\n"+i+"}":"{"+u.join(",")+"}",gap=i,o}}"function"!=typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){
        return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+
            f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){
        return this.valueOf()});var cx,escapable,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&
    (escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta={"\b":"\\b","  ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(t,e,n){var r;
        if(gap="",indent="","number"==typeof n)for(r=0;n>r;r+=1)indent+=" ";else"string"==typeof n&&(indent=n);if(rep=e,
            e&&"function"!=typeof e&&("object"!=typeof e||"number"!=typeof e.length))throw new Error("JSON.stringify");return str("",{"":t})}),
    "function"!=typeof JSON.parse&&(cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        JSON.parse=function(text,reviver){function walk(t,e){var n,r,o=t[e];if(o&&"object"==typeof o)for(n in o)Object.prototype.hasOwnProperty.call(o,n)&&
        (r=walk(o,n),void 0!==r?o[n]=r:delete o[n]);return reviver.call(t,e,o)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&
            (text=text.replace(cx,function(t){return"\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4)})),
                /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@")
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]")
                    .replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;
            throw new SyntaxError("JSON.parse")})}();
/*-------------------------------------------------------------------------------------------------------------------------*/

/**
 * Get a value from an object or array.
 * @param {object|array}    subject     The object or array to search
 * @param {string}          key         The object property to find
 * @param {*}               _default    The default value to return if property is not found
 * @returns {*}                         The found or default value
 */
function get( subject, key, _default ) {
    var value = _default;
    if (typeof(subject[key]) != 'undefined') {
        value = subject[key];
    }
    return value;
}

/**
 * Gets the screen dimensions and bounds.
 * @returns {{left: *, top: *, right: *, bottom: *}}
 */
function getScreenSize() {

    try {
        if (view = app.activeDocument.views[0] ) {
            view.zoom = 1;
            return {
                left   : parseInt(view.bounds[0]),
                top    : parseInt(view.bounds[1]),
                right  : parseInt(view.bounds[2]),
                bottom : parseInt(view.bounds[3]),
                width  : parseInt(view.bounds[2]) - parseInt(view.bounds[0]),
                height : parseInt(view.bounds[1]) - parseInt(view.bounds[3])
            };
        }
    }
    catch(ex){/*Exit Gracefully*/}
    return null;
}

/**
 * Displays the settings dialog
 *
 * Inputs:
 *    - skip columns
 *    - page width
 *    - page height
 *    - cell width
 *    - cell height
 *    - scale
 *    - logging enabled
 *
 *    - number of cols        = divide page width by cell width
 *    - number of rows        = divide page height by cell height
 *    - side margins          = (page width - (col count * col width))/2
 *    - top/bottom margins    = (page height - (row count * row width))/2
 *
 * @returns {bool}
 */
function doDisplayDialog() {

    var response     = false;
    var dialogWidth  = 450;
    var dialogHeight = 460;
    var dialogLeft   = 550;
    var dialogTop    = 300;

    if ( bounds = getScreenSize() ) {
        dialogLeft = Math.abs(Math.ceil((bounds.width/2) - (dialogWidth/2)));
    }

    /**
     * Dialog bounds: [ Left, TOP, RIGHT, BOTTOM ]
     * default: //550, 350, 1000, 800
     */

    var dialog = new Window(
        "dialog", LANG.LABEL_DIALOG_WINDOW, [
            dialogLeft,
            dialogTop,
            dialogLeft + dialogWidth,
            dialogTop + dialogHeight
        ]
    );

    try {

        var configFile = new File(CONFIG.CONFIG_FILE_PATH);
        if (configFile.exists) {
            CONFIG = JSON.parse(read_file(configFile));
        }

        /**
         * Row height
         * @type {number}
         */
        var rh = 30;

        /**
         * Column width
         * @type {number}
         */
        var cw  = 112;

        var c1  = 28;
        var c1w = c1 + 112;

        var c2  = 164;
        var c2w = c2 + 50;

        var p1 = 16;
        var p2 = dialogWidth - 16;

        var r1 = 40;

        // Sections
        dialog.sizePanel              = dialog.add('panel',      [p1, 16, p2, 170],   LANG.LABEL_SIZE);
        dialog.outputPanel            = dialog.add('panel',      [p1, 170, p2, 290],  LANG.LABEL_OUTPUT);
        dialog.fileTypesPanel         = dialog.add('panel',      [p1, 290, p2, 340],  LANG.LABEL_FILETYPES);
        dialog.sourcePanel            = dialog.add('panel',      [p1, 340, p2, 410],  LANG.LABEL_INPUT);

        // Artboard Size
        dialog.artboardWidthLabel     = dialog.add('statictext', [c1, r1, c1w, 70],   LANG.LABEL_ARTBOARD_WIDTH);
        dialog.artboardWidth          = dialog.add('edittext',   [c2, r1, c2w, 70],   CONFIG.ARTBOARD_WIDTH);
        dialog.artboardWidth.active   = true;

        dialog.artboardHeightLabel    = dialog.add('statictext', [c1, 70, c1w, 100],  LANG.LABEL_ARTBOARD_HEIGHT);
        dialog.artboardHeight         = dialog.add('edittext',   [c2, 70, c2w, 100],  CONFIG.ARTBOARD_HEIGHT);
        dialog.artboardHeight.active  = true;

        dialog.artboardSpacingLabel   = dialog.add('statictext', [c1, 100, c1w, 130], LANG.LABEL_ARTBOARD_SPACING);
        dialog.artboardSpacing        = dialog.add('edittext',   [c2, 100, c2w, 130], CONFIG.ARTBOARD_SPACING);
        dialog.artboardSpacing.active = true;

        // Scale
        dialog.scaleLabel             = dialog.add('statictext', [c1, 130, c1w, 160], LANG.LABEL_SCALE);
        dialog.scale                  = dialog.add('edittext',   [c2, 130, c2w, 160], CONFIG.SCALE);
        dialog.scale.active           = true;

        // Output filename
        dialog.filenameLabel          = dialog.add('statictext', [c1, 190, c1w, 220], LANG.LABEL_FILE_NAME);
        dialog.filename               = dialog.add('edittext',   [c2, 190, c1w * 3, 220], CONFIG.OUTPUT_FILENAME);
        dialog.filename.active        = true;

        // Logging & Sorting
        dialog.logging                = dialog.add('checkbox',   [c1, 230, c1w, 300], LANG.LABEL_LOGGING);
        dialog.logging.value          = CONFIG.LOGGING;

        dialog.sortboards             = dialog.add('checkbox',   [c1, 260, c1w, 330], LANG.LABEL_SORT_ARTBOARDS);
        dialog.sortboards.value       = CONFIG.SORT_ARTBOARDS;

        // File types
        dialog.fileTypeSVG            = dialog.add('checkbox',   [c1, 315, c1w, 340], LANG.FILETYPE_SVG);
        dialog.fileTypeSVG.value      = CONFIG.FILETYPE_SVG;

        dialog.fileTypeAI            = dialog.add('checkbox',    [c1 * 5, 315, c1w + 30, 340], LANG.FILETYPE_AI);
        dialog.fileTypeAI.value      = CONFIG.FILETYPE_AI;

        dialog.fileTypeEPS            = dialog.add('checkbox',   [c1 * 8, 315, c1w + 180, 340], LANG.FILETYPE_EPS);
        dialog.fileTypeEPS.value      = CONFIG.FILETYPE_EPS;

        dialog.fileTypePDF            = dialog.add('checkbox',   [c1 * 12, 315, c1w + 250, 340], LANG.FILETYPE_PDF);
        dialog.fileTypePDF.value      = CONFIG.FILETYPE_PDF;

        // Input folder
        dialog.folderBtn              = dialog.add('button',     [c1, 370, c1w, 400],  LANG.LABEL_CHOOSE_FOLDER, {name: 'folder'})

        dialog.srcFolder              = dialog.add('edittext',   [140, 370, 424, 400], CONFIG.SRC_FOLDER);
        dialog.srcFolder.active       = false;

        // Buttons
        dialog.cancelBtn              = dialog.add('button',     [232, 420, 332, 445], LANG.BUTTON_CANCEL, {name: 'cancel'});
        dialog.openBtn                = dialog.add('button',     [334, 420, 434, 445], LANG.BUTTON_OK, {name: 'ok'});

        dialog.cancelBtn.onClick = function() {
            dialog.close();
            response = false;
            return false;
        };

        dialog.folderBtn.onClick = function() {
            var srcFolder;
            if ( srcFolder = Folder.selectDialog( CONFIG.CHOOSE_FOLDER ) ) {

                CONFIG.SRC_FOLDER = srcFolder.absoluteURI;
                dialog.srcFolder.text = CONFIG.SRC_FOLDER;

                if ( trim(dialog.filename.text) == '' ) {
                    dialog.filename.text = srcFolder.name + '-merged.ai';
                    CONFIG.OUTPUT_FILENAME = dialog.filename.text;
                }
            }
        }

        dialog.openBtn.onClick = function() {

            CONFIG.ARTBOARD_WIDTH      = parseInt(dialog.artboardWidth.text);
            CONFIG.ARTBOARD_HEIGHT     = parseInt(dialog.artboardHeight.text);
            CONFIG.LOGGING             = dialog.logging.value;
            CONFIG.SORT_ARTBOARDS      = dialog.sortboards.value;
            CONFIG.SPACING             = parseInt(dialog.artboardSpacing.text);
            CONFIG.SCALE               = parseInt(dialog.scale.text);
            CONFIG.OUTPUT_FILENAME     = dialog.filename.text;

            CONFIG.FILETYPE_SVG        = dialog.fileTypeSVG.value;
            CONFIG.FILETYPE_AI         = dialog.fileTypeAI.value;
            CONFIG.FILETYPE_EPS        = dialog.fileTypeEPS.value;
            CONFIG.FILETYPE_PDF        = dialog.fileTypePDF.value;

            if (! hasOneFileType()) {
                alert(LANG.SELECT_ONE_FILETYPE);
                dialog.close();
                doDisplayDialog();
            }
            else {
                dialog.close();

                write_file(CONFIG.CONFIG_FILE_PATH, JSON.stringify(CONFIG), true);

                response = true;
                return true;
            }
        };
        dialog.show();
    }
    catch(ex) {
        logger(ex);
        alert(ex);
    }
    return response;
}

/**
 * Make sure at least one file type is selected.
 * @returns {bool}
 */
function hasOneFileType() {
    return CONFIG.FILETYPE_SVG || CONFIG.FILETYPE_AI || CONFIG.FILETYPE_EPS || CONFIG.FILETYPE_PDF;
}

/**
 * Cleans up the filename/artboardname.
 * @param   {String}    name    The name to filter and reformat.
 * @returns  {String}            The cleaned up name.
 */
function filterName(name) {
    return decodeURIComponent(name).replace(' ', '-');
}

/**
 * Callback for sorting the file list.
 * @param   {File}  a
 * @param   {File}  b
 * @returns {number}
 */
function comparator(a, b) {
    var nameA = filterName(a.name.toUpperCase());
    var nameB = filterName(b.name.toUpperCase());
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    // names must be equal
    return 0;
}

/**
 * Show the progress bar.
 * @param   {int}     maxvalue  The maximum value of the progress counter
 * @returns  {object}            The progress bar object
 */
function showProgressBar(maxvalue) {

    var top, right, bottom, left;

    if ( bounds = getScreenSize() ) {
        left = Math.abs(Math.ceil((bounds.width/2) - (450/2)));
        top = Math.abs(Math.ceil((bounds.height/2) - (100/2)));
    }

    var progress = new Window("palette", LANG.PROGRESS, [left, top, left + 450, top + 100]);
    progress.pnl = progress.add("panel", [10, 10, 440, 100], "Script Progress");
    progress.pnl.progBar = progress.pnl.add("progressbar", [20, 35, 410, 60], 0, maxvalue);
    progress.pnl.progBarLabel = progress.pnl.add("statictext", [20, 20, 320, 35], "0%");

    progress.show();

    return progress;
}

/**
 * Update the progress bar
 * @param {object}  progress    A progress bar object
 * @param {int}     maxvalue    The maximum value of the progress counter
 * @param {string}  message     The progress bar message
 * @returns {void}
 */
function updateProgress(progress, maxvalue, message) {

    progress.pnl.progBarLabel.text = message;
    progress.pnl.progBar.value++;
    $.sleep(10);
    progress.update();
    return progress;
}

/**
 * Import files to artboards. Sets artboard name to file name minus file extension.
 * @returns {void}
 */
function filesToArtboards() {

    var doc, fileList, i, srcFolder, mm, theFile, fileType;

    if (! doDisplayDialog()) {
        return;
    }

    srcFolder = new Folder(CONFIG.SRC_FOLDER);

    if ( srcFolder == null ) return;

    /**
     * Gets only the SVG files…
     */
    fileList = getFilesInSubfolders(srcFolder);

    logger("File count: " + fileList.length + "\n" + fileList);

    /**
     * Make sure it has AI files in it…
     */
    if (fileList.length > 0) {

        if (CONFIG.SORT_ARTBOARDS == true) {
            try {
                fileList.sort(comparator);
            }
            catch(ex) {
                logger(LANG.SORT_FILELIST_FAILED);
            }
        }

        /**
         * Set the script to work with artboard rulers
         */
        app.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;

        /**
         * Add new multi-page document
         */
        doc = app.documents.add(
            DocumentColorSpace.RGB,
            CONFIG.ARTBOARD_WIDTH,
            CONFIG.ARTBOARD_HEIGHT,
            CONFIG.ARTBOARD_COUNT = fileList.length,
            DocumentArtboardLayout.GridByCol,
            CONFIG.ARTBOARD_SPACING,
            CONFIG.ARTBOARD_ROWSxCOLS = Math.round(Math.sqrt(fileList.length))
        );

        var progress = showProgressBar(CONFIG.ARTBOARD_COUNT);

        /**
         * Loop thru the counter
         */
        for (i = 0; i < CONFIG.ARTBOARD_COUNT; i++) {

            /**
             * Set the active artboard rulers based on this
             */
            doc.artboards.setActiveArtboardIndex(i);

            var bits = srcFolder.name.split('-');
            var boardName = fileList[i].name.replace(/\.svg|\.ai|\.eps|\.pdf/gi, "");

            /**
             * If the file is in a subfolder, prepend the
             * subfolder name to the board name.
             */
            if (Folder(fileList[i].path).absoluteURI != Folder(srcFolder).absoluteURI) {
                boardName = Folder(fileList[i].path).name + '-' + boardName;
            }

            boardName = filterName(boardName);

            bits = boardName.split("--");
            if (bits.length > 1 && ! isNaN(bits[0])) {
                boardName = trim(bits[1]);
            }

            doc.artboards[i].name = boardName;

            /**
             * Create group from SVG
             */
            try {
                var f = new File(fileList[i]);
                if (f.exists) {
                    theFile = doc.groupItems.createFromFile(f);
                }

                var ext = "." + trim(f.type.toLowerCase());

                updateProgress(
                    progress, 
                    CONFIG.ARTBOARD_COUNT, 
                    LANG.IMPORTING_FILE + i + " of " + CONFIG.ARTBOARD_COUNT + ": `" + boardName + ext + "`"
                );

                /**
                 * Move relative to this artboards rulers
                 */
                try {
                    theFile.position = [
                        Math.floor((CONFIG.ARTBOARD_WIDTH - theFile.width) / 2),
                        Math.floor((CONFIG.ARTBOARD_HEIGHT - theFile.height) / 2) * -1
                    ];
                    if (typeof(theFile.resize) == "function" && CONFIG.SCALE != 100) {
                        theFile.resize(CONFIG.SCALE, CONFIG.SCALE, true, true, true, true, CONFIG.SCALE);
                    }
                }
                catch(ex) {
                    try {
                        theFile.position = [0, 0];
                    }
                    catch(ex) {/*Exit Gracefully*/}
                }

                alignToNearestPixel(doc.selection);
            }
            catch(ex) {
                logger(
                    LANG.ERROR_IN_FILE + fileList[i] + " `. " + LANG.ERROR + ": " + ex
                );
            }
        };

        progress.close();

        centerObjects();

        saveFileAsAi(srcFolder.path + CONFIG.PATH_SEPATATOR + CONFIG.OUTPUT_FILENAME);
    };

    try {
        userInteractionLevel = originalInteractionLevel;
    }
    catch(ex) {/*Exit Gracefully*/}

};

/**
 * Centers objects on artboards
 * @returns {void}
 */
function centerObjects() {
    doc = app.activeDocument;

    var doc  = app.activeDocument;
    var progress = showProgressBar(doc.artboards.length);

    for (i=0; i<doc.artboards.length; i++) {

        doc.artboards.setActiveArtboardIndex(i);

        var activeAB = doc.artboards[doc.artboards.getActiveArtboardIndex()];
        var right = activeAB.artboardRect[2];
        var bottom = activeAB.artboardRect[3];

        doc.selectObjectsOnActiveArtboard();

        for (x = 0 ; x < selection.length; x++) {
            try {
                selection[x].position = [
                    Math.round((right - selection[x].width)/2),
                    Math.round((bottom + selection[x].height)/2)
                ];
            }
            catch(e) {
                Utils.logger('ERROR - ' + e.message);
            }
            updateProgress(
                progress, 
                CONFIG.ARTBOARD_COUNT, 
                LANG.CENTERING_OBJ + i + " of " + CONFIG.ARTBOARD_COUNT + ": `" + activeAB.name + "`"
            );
        }
        redraw();
    }

    progress.close();
}

/**
 * Get all files in subfolders.
 * @param {Folder}  srcFolder     The root folder from which to merge SVGs.
 * @returns {Array}     Array of nested files.
 */
function getFilesInSubfolders( srcFolder ) {

    if ( ! srcFolder instanceof Folder) return;

    var allFiles    = srcFolder.getFiles();
    var theFolders  = [];
    var theFileList = [];

    for (var x=0; x < allFiles.length; x++) {
        if (allFiles[x] instanceof Folder) {
            theFolders.push(allFiles[x]);
        }
    }

    if (theFolders.length == 0) {
        theFileList = Array.prototype.concat.apply([], getFilesInFolder(srcFolder));
    }
    else {
        for (var x=0; x < theFolders.length; x++) {
            theFileList = Array.prototype.concat.apply(theFileList, getFilesInFolder(theFolders[x]));
        }
    }
    return theFileList;
}

/**
 * Gets the files in a specific source folder.
 * @param {Folder}  The folder object
 * @returns {Array}
 */
function getFilesInFolder(theFolder) {
    var svgFileList = aiFileList = epsFileList = pdfFileList = [];
    if (CONFIG.FILETYPE_SVG) {
        svgFileList = theFolder.getFiles(/\.svg$/i);
        logger('Get ' + theFolder.getFiles(/\.svg$/i).length + ' SVG files');
    }
    if (CONFIG.FILETYPE_AI) {
        aiFileList = theFolder.getFiles(/\.ai$/i);
        logger('Get ' + theFolder.getFiles(/\.ai$/i).length + ' AI files');
    }
    if (CONFIG.FILETYPE_EPS) {
        epsFileList = theFolder.getFiles(/\.eps$/i);
        logger('Get ' + theFolder.getFiles(/\.eps$/i).length + ' EPS files');
    }
    if (CONFIG.FILETYPE_PDF) {
        pdfFileList = theFolder.getFiles(/\.pdf$/i);
        logger('Get ' + theFolder.getFiles(/\.pdf$/i).length + ' PDF files');
    }
    return Array.prototype.concat.apply([], [svgFileList, aiFileList, epsFileList, pdfFileList]);
}

/**
 * Saves a file in Ai format.
 * @param {string}  dest    Destination folder path
 */
function saveFileAsAi(dest) {
    if (app.documents.length > 0) {
        var options = new IllustratorSaveOptions();
        var theDoc  = new File(dest);
        options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
        options.pdfCompatible = true;
        app.activeDocument.saveAs(theDoc, options);
    }
}

/**
 * Align objects to nearest pixel.
 * @param   {object}  selection     The selection object
 * @returns  {void}
 */
function alignToNearestPixel(sel) {

    try {
        if (typeof selection != "object") {
            logger(LANG.NO_SELECTION);
        }
        else {
            for (i = 0 ; i < selection.length; i++) {
                selection[i].left = Math.round(selection[i].left);
                selection[i].top = Math.round(selection[i].top);
            }
            redraw();
        }
    }
    catch(ex) {
        logger(ex);
    }
}

/**
 * Trims a string.
 * @param   {string}  str     The string to trim
 * @returns  {XML|string|void}
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Logging for this script.
 * @param {string}  txt The logging text
 * @returns {void}
 */
function logger(txt) {

    if (CONFIG.LOGGING == 0) return;
    write_file(CONFIG.LOG_FILE_PATH, "[" + new Date().toUTCString() + "] " + txt, false);
}

/**
 * Write a file to disc.
 * @param {string}  path        The file path to write to
 * @param {string}  txt         The text to write to the file
 * @param {bool}    replace     Whether to replace the file if it already exists
 * @returns {void}
 */
function write_file( path, txt, replace ) {
    try {
        var file = new File( path );
        if (replace && file.exists) {
            file.remove();
            file = new File( path );
        }
        file.open("e", "TEXT", "????");
        file.seek(0,2);
        file.lineFeed = 'macintosh';
        if (CONFIG.SYSTEM == 'WINDOWS') {
            file.lineFeed = 'windows';
        }
        file.writeln(txt);
        file.close();
    }
    catch(ex) {
        try { file.close(); }
        catch(ex) {/* Exit Gracefully*/}
    }
}

/**
 * Reads the contents of a file.
 * @param   {File} fp     A file object.
 * @returns  {string}
 */
function read_file(fp) {
    var data = '';

    try {
        fp.open('r', undefined, undefined);
        data = fp.read();
        fp.close();
    }
    catch(e) {
        try { fp.close(); }catch(e){}
        /* Exit gracefully for now */
    }
    return data;
}

/**
 * Execute the script.
 */
filesToArtboards();