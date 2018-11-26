(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/forms'), require('@angular/platform-browser'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/forms', '@angular/platform-browser', '@angular/common'], factory) :
	(factory((global['ngx-markdown-editor'] = {}),global.ng.core,global.ng.forms,global.ng.platformBrowser,global.ng.common));
}(this, (function (exports,core,forms,platformBrowser,common) { 'use strict';

var MarkdownEditorComponent = /** @class */ (function () {
    function MarkdownEditorComponent(required, maxlength, _renderer, _domSanitizer) {
        if (required === void 0) { required = false; }
        if (maxlength === void 0) { maxlength = -1; }
        this.required = required;
        this.maxlength = maxlength;
        this._renderer = _renderer;
        this._domSanitizer = _domSanitizer;
        this.hideToolbar = false;
        this.height = "300px";
        this._hideIcons = {};
        this.showPreviewPanel = true;
        this.isFullScreen = false;
        this._onChange = function (_) { };
        this._onTouched = function () { };
    }
    Object.defineProperty(MarkdownEditorComponent.prototype, "mode", {
        get: function () {
            return this._mode || 'editor';
        },
        set: function (value) {
            if (!value || (value.toLowerCase() !== 'editor' && value.toLowerCase() !== 'preview')) {
                value = 'editor';
            }
            this._mode = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkdownEditorComponent.prototype, "options", {
        get: function () {
            return this._options;
        },
        set: function (value) {
            var _this = this;
            this._options = value || {
                showBorder: true,
                hideIcons: [],
                scrollPastEnd: 0
            };
            this._hideIcons = {};
            (this._options.hideIcons || []).forEach(function (v) {
                _this._hideIcons[v] = true;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MarkdownEditorComponent.prototype, "markdownValue", {
        get: function () {
            return this._markdownValue || '';
        },
        set: function (value) {
            var _this = this;
            this._markdownValue = value;
            this._onChange(value);
            if (this.preRender && this.preRender instanceof Function) {
                value = this.preRender(value);
            }
            if (value !== null && value !== undefined) {
                if (this._renderMarkTimeout)
                    clearTimeout(this._renderMarkTimeout);
                this._renderMarkTimeout = setTimeout(function () {
                    var html = marked(value || '', _this._markedOpt);
                    _this._previewHtml = _this._domSanitizer.bypassSecurityTrustHtml(html);
                }, 100);
            }
        },
        enumerable: true,
        configurable: true
    });
    MarkdownEditorComponent.prototype.ngOnInit = function () {
        var _markedRender = new marked.Renderer();
        _markedRender.code = function (code, language) {
            var validLang = !!(language && hljs.getLanguage(language));
            var highlighted = validLang ? hljs.highlight(language, code).value : code;
            return "<pre style=\"padding: 0; border-radius: 0;\"><code class=\"hljs " + language + "\">" + highlighted + "</code></pre>";
        };
        _markedRender.table = function (header, body) {
            return "<table class=\"table table-bordered\">\n<thead>\n" + header + "</thead>\n<tbody>\n" + body + "</tbody>\n</table>\n";
        };
        _markedRender.listitem = function (text) {
            if (/^\s*\[[x ]\]\s*/.test(text)) {
                text = text
                    .replace(/^\s*\[ \]\s*/, '<i class="fa fa-square-o" style="margin: 0 0.2em 0.25em -1.6em;"></i> ')
                    .replace(/^\s*\[x\]\s*/, '<i class="fa fa-check-square" style="margin: 0 0.2em 0.25em -1.6em;"></i> ');
                return "<li style=\"list-style: none;\">" + text + "</li>";
            }
            else {
                return "<li>" + text + "</li>";
            }
        };
        this._markedOpt = {
            renderer: _markedRender,
            highlight: function (code) { return hljs.highlightAuto(code).value; }
        };
    };
    MarkdownEditorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var editorElement = this.aceEditorContainer.nativeElement;
        this.editor = ace.edit(editorElement);
        this.editor.$blockScrolling = Infinity;
        this.editor.getSession().setUseWrapMode(true);
        this.editor.getSession().setMode("ace/mode/markdown");
        this.editor.setValue(this.markdownValue || '');
        this.editor.setOption('scrollPastEnd', this._options.scrollPastEnd);
        this.editor.on("change", function (e) {
            var val = _this.editor.getValue();
            _this.markdownValue = val;
        });
    };
    MarkdownEditorComponent.prototype.ngOnDestroy = function () {
    };
    MarkdownEditorComponent.prototype.writeValue = function (value) {
        var _this = this;
        setTimeout(function () {
            _this.markdownValue = value;
            if (typeof value !== 'undefined' && _this.editor) {
                _this.editor.setValue(value || '');
            }
        }, 1);
    };
    MarkdownEditorComponent.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    MarkdownEditorComponent.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    MarkdownEditorComponent.prototype.validate = function (c) {
        var result = null;
        if (this.required && this.markdownValue.length === 0) {
            result = { required: true };
        }
        if (this.maxlength > 0 && this.markdownValue.length > this.maxlength) {
            result = { maxlength: true };
        }
        return result;
    };
    MarkdownEditorComponent.prototype.insertContent = function (type) {
        if (!this.editor)
            return;
        var selectedText = this.editor.getSelectedText();
        var isSeleted = !!selectedText;
        var startSize = 2;
        var initText = '';
        var range = this.editor.selection.getRange();
        switch (type) {
            case 'Bold':
                initText = 'Bold Text';
                selectedText = "**" + (selectedText || initText) + "**";
                break;
            case 'Italic':
                initText = 'Italic Text';
                selectedText = "*" + (selectedText || initText) + "*";
                startSize = 1;
                break;
            case 'Heading':
                initText = 'Heading';
                selectedText = "# " + (selectedText || initText);
                break;
            case 'Refrence':
                initText = 'Refrence';
                selectedText = "> " + (selectedText || initText);
                break;
            case 'Link':
                selectedText = "[](http://)";
                startSize = 1;
                break;
            case 'Image':
                selectedText = "![](http://)";
                break;
            case 'Ul':
                selectedText = "- " + (selectedText || initText);
                break;
            case 'Ol':
                selectedText = "1. " + (selectedText || initText);
                startSize = 3;
                break;
            case 'Code':
                initText = 'Source Code';
                selectedText = "```language\r\n" + (selectedText || initText) + "\r\n```";
                startSize = 3;
                break;
        }
        this.editor.session.replace(range, selectedText);
        if (!isSeleted) {
            range.start.column += startSize;
            range.end.column = range.start.column + initText.length;
            this.editor.selection.setRange(range);
        }
        this.editor.focus();
    };
    MarkdownEditorComponent.prototype.togglePreview = function () {
        this.showPreviewPanel = !this.showPreviewPanel;
        this.editorResize();
    };
    MarkdownEditorComponent.prototype.previewPanelClick = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    MarkdownEditorComponent.prototype.fullScreen = function () {
        this.isFullScreen = !this.isFullScreen;
        this._renderer.setElementStyle(document.body, 'overflowY', this.isFullScreen ? 'hidden' : 'auto');
        this.editorResize();
    };
    MarkdownEditorComponent.prototype.editorResize = function (timeOut) {
        var _this = this;
        if (timeOut === void 0) { timeOut = 100; }
        if (this.editor) {
            setTimeout(function () {
                _this.editor.resize();
                _this.editor.focus();
            }, timeOut);
        }
    };
    return MarkdownEditorComponent;
}());
MarkdownEditorComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'md-editor',
                styles: [".md-editor-container{margin-bottom:15px;border:1px solid rgba(0,0,0,.1)}.md-editor-container.fullscreen{margin:0;position:fixed;border:0;top:0;left:0;width:100%;height:100%;z-index:99999999}.md-editor-container.fullscreen .editor-panel,.md-editor-container.fullscreen .preview-panel{height:calc(100vh - 40px)!important}.md-editor-container .ace-editor{height:100%}.md-editor-container .tool-bar{background-color:#f5f5f5;border-bottom:1px solid rgba(0,0,0,.1)}.md-editor-container .tool-bar .btn-group{padding:6px}.md-editor-container .tool-bar .btn-group>.btn:first-child::before{content:' ';background-color:#a9a9a9;width:1px;height:24px;left:-9px;top:2px;position:absolute}.md-editor-container .tool-bar .btn-group.hide-split>.btn:first-child::before,.md-editor-container .tool-bar .btn-group:first-child>.btn:first-child::before{display:none}.md-editor-container .tool-bar .btn{margin-bottom:0}.md-editor-container .editor-container{display:-webkit-box;display:-ms-flexbox;display:flex}.md-editor-container .editor-container>div{-webkit-box-flex:1;-ms-flex:1;flex:1}.md-editor-container .preview-panel{border-left:1px solid rgba(0,0,0,.1);background-color:#fff;padding:10px;overflow-y:auto}.md-editor-container .md-footer{padding:2px;background-color:#f0f0f0;font-size:12px;border-top:1px solid rgba(0,0,0,.1)}"],
                template: "<div class=\"md-editor-container\" [class.fullscreen]=\"isFullScreen\">\n  <div class=\"tool-bar\" *ngIf=\"!hideToolbar && mode != 'preview'\">\n    <div class=\"btn-group\">\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Bold\" (click)=\"insertContent('Bold')\" *ngIf=\"!_hideIcons.Bold\">\n        <i class=\"fa fa-bold\"></i>\n      </button>\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Italic\" (click)=\"insertContent('Italic')\" *ngIf=\"!_hideIcons.Italic\">\n        <i class=\"fa fa-italic\"></i>\n      </button>\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Heading\" (click)=\"insertContent('Heading')\" *ngIf=\"!_hideIcons.Heading\">\n        <i class=\"fa fa-header\"></i>\n      </button>\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Refrence\" (click)=\"insertContent('Refrence')\" *ngIf=\"!_hideIcons.Refrence\">\n        <i class=\"fa fa-quote-left\"></i>\n      </button>\n    </div>\n    <div class=\"btn-group\">\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Link\" (click)=\"insertContent('Link')\" *ngIf=\"!_hideIcons.Link\">\n        <i class=\"fa fa-link\"></i>\n      </button>\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Image\" (click)=\"insertContent('Image')\" *ngIf=\"!_hideIcons.Image\">\n        <i class=\"fa fa-image\"></i>\n      </button>\n    </div>\n    <div class=\"btn-group\">\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Unordered List\" (click)=\"insertContent('Ul')\" *ngIf=\"!_hideIcons.Ul\">\n        <i class=\"fa fa-list-ul\"></i>\n      </button>\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Ordered List\" (click)=\"insertContent('Ol')\" *ngIf=\"!_hideIcons.Ol\">\n        <i class=\"fa fa-list-ol\"></i>\n      </button>\n      <button class=\"btn btn-sm btn-default\" type=\"button\" title=\"Code Block\" (click)=\"insertContent('Code')\" *ngIf=\"!_hideIcons.Code\">\n        <i class=\"fa fa-file-code-o\"></i>\n      </button>\n    </div>\n    <div class=\"btn-group\">\n      <button class=\"btn btn-sm btn-default\" type=\"button\" [attr.title]=\"showPreviewPanel ? 'Hide Preview' : 'Show Preview'\" (click)=\"togglePreview()\"\n        *ngIf=\"!_hideIcons.TogglePreview\">\n        <i class=\"fa\" [class.fa-eye]=\"!showPreviewPanel\" [class.fa-eye-slash]=\"showPreviewPanel\"></i>\n      </button>\n    </div>\n    <div class=\"btn-group pull-right hide-split\">\n      <button class=\"btn btn-sm btn-default\" type=\"button\" [class.active]=\"isFullScreen\" (click)=\"fullScreen()\" *ngIf=\"!_hideIcons.FullScreen\">\n        <i class=\"fa fa-arrows-alt\"></i>\n      </button>\n    </div>\n  </div>\n  <div class=\"editor-container\">\n    <div [style.display]=\"mode == 'preview' ? 'none' : null\">\n      <div class=\"editor-panel\" [style.height]=\"height\">\n        <div class=\"ace-editor\" #aceEditor></div>\n      </div>\n    </div>\n    <div [style.display]=\"showPreviewPanel ? 'block' : 'none'\" (click)=\"previewPanelClick($event)\">\n      <div class=\"preview-panel\" [innerHtml]=\"_previewHtml\" [style.height]=\"height\"></div>\n    </div>\n  </div>\n  <div *ngIf=\"maxlength > 0 && mode != 'preview'\">\n    <div class=\"text-right md-footer\">\n      {{ markdownValue?.length }} / {{ maxlength }}\n    </div>\n  </div>\n</div>\n",
                providers: [
                    {
                        provide: forms.NG_VALUE_ACCESSOR,
                        useExisting: core.forwardRef(function () { return MarkdownEditorComponent; }),
                        multi: true
                    },
                    {
                        provide: forms.NG_VALIDATORS,
                        useExisting: core.forwardRef(function () { return MarkdownEditorComponent; }),
                        multi: true
                    }
                ]
            },] },
];
MarkdownEditorComponent.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: core.Attribute, args: ['required',] },] },
    { type: undefined, decorators: [{ type: core.Attribute, args: ['maxlength',] },] },
    { type: core.Renderer, },
    { type: platformBrowser.DomSanitizer, },
]; };
MarkdownEditorComponent.propDecorators = {
    "aceEditorContainer": [{ type: core.ViewChild, args: ['aceEditor',] },],
    "hideToolbar": [{ type: core.Input },],
    "height": [{ type: core.Input },],
    "preRender": [{ type: core.Input },],
    "mode": [{ type: core.Input },],
    "options": [{ type: core.Input },],
};
var LMarkdownEditorModule = /** @class */ (function () {
    function LMarkdownEditorModule() {
    }
    return LMarkdownEditorModule;
}());
LMarkdownEditorModule.decorators = [
    { type: core.NgModule, args: [{
                declarations: [
                    MarkdownEditorComponent
                ],
                imports: [
                    common.CommonModule,
                    forms.FormsModule
                ],
                exports: [
                    MarkdownEditorComponent
                ]
            },] },
];
LMarkdownEditorModule.ctorParameters = function () { return []; };

exports.LMarkdownEditorModule = LMarkdownEditorModule;
exports.MarkdownEditorComponent = MarkdownEditorComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-markdown-editor.umd.js.map
