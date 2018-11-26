import { Component, ViewChild, forwardRef, Renderer, Attribute, Input, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class MarkdownEditorComponent {
    /**
     * @param {?=} required
     * @param {?=} maxlength
     * @param {?=} _renderer
     * @param {?=} _domSanitizer
     */
    constructor(required = false, maxlength = -1, _renderer, _domSanitizer) {
        this.required = required;
        this.maxlength = maxlength;
        this._renderer = _renderer;
        this._domSanitizer = _domSanitizer;
        this.hideToolbar = false;
        this.height = "300px";
        this._hideIcons = {};
        this.showPreviewPanel = true;
        this.isFullScreen = false;
        this._onChange = (_) => { };
        this._onTouched = () => { };
    }
    /**
     * @return {?}
     */
    get mode() {
        return this._mode || 'editor';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set mode(value) {
        if (!value || (value.toLowerCase() !== 'editor' && value.toLowerCase() !== 'preview')) {
            value = 'editor';
        }
        this._mode = value;
    }
    /**
     * @return {?}
     */
    get options() {
        return this._options;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set options(value) {
        this._options = value || {
            showBorder: true,
            hideIcons: [],
            scrollPastEnd: 0
        };
        this._hideIcons = {};
        (this._options.hideIcons || []).forEach((v) => {
            this._hideIcons[v] = true;
        });
    }
    /**
     * @return {?}
     */
    get markdownValue() {
        return this._markdownValue || '';
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set markdownValue(value) {
        this._markdownValue = value;
        this._onChange(value);
        if (this.preRender && this.preRender instanceof Function) {
            value = this.preRender(value);
        }
        if (value !== null && value !== undefined) {
            if (this._renderMarkTimeout)
                clearTimeout(this._renderMarkTimeout);
            this._renderMarkTimeout = setTimeout(() => {
                let /** @type {?} */ html = marked(value || '', this._markedOpt);
                this._previewHtml = this._domSanitizer.bypassSecurityTrustHtml(html);
            }, 100);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        let /** @type {?} */ _markedRender = new marked.Renderer();
        _markedRender.code = (code, language) => {
            let /** @type {?} */ validLang = !!(language && hljs.getLanguage(language));
            let /** @type {?} */ highlighted = validLang ? hljs.highlight(language, code).value : code;
            return `<pre style="padding: 0; border-radius: 0;"><code class="hljs ${language}">${highlighted}</code></pre>`;
        };
        _markedRender.table = (header, body) => {
            return `<table class="table table-bordered">\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>\n`;
        };
        _markedRender.listitem = (text) => {
            if (/^\s*\[[x ]\]\s*/.test(text)) {
                text = text
                    .replace(/^\s*\[ \]\s*/, '<i class="fa fa-square-o" style="margin: 0 0.2em 0.25em -1.6em;"></i> ')
                    .replace(/^\s*\[x\]\s*/, '<i class="fa fa-check-square" style="margin: 0 0.2em 0.25em -1.6em;"></i> ');
                return `<li style="list-style: none;">${text}</li>`;
            }
            else {
                return `<li>${text}</li>`;
            }
        };
        this._markedOpt = {
            renderer: _markedRender,
            highlight: (code) => hljs.highlightAuto(code).value
        };
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        let /** @type {?} */ editorElement = this.aceEditorContainer.nativeElement;
        this.editor = ace.edit(editorElement);
        this.editor.$blockScrolling = Infinity;
        this.editor.getSession().setUseWrapMode(true);
        this.editor.getSession().setMode("ace/mode/markdown");
        this.editor.setValue(this.markdownValue || '');
        this.editor.setOption('scrollPastEnd', this._options.scrollPastEnd);
        this.editor.on("change", (e) => {
            let /** @type {?} */ val = this.editor.getValue();
            this.markdownValue = val;
        });
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        setTimeout(() => {
            this.markdownValue = value;
            if (typeof value !== 'undefined' && this.editor) {
                this.editor.setValue(value || '');
            }
        }, 1);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this._onChange = fn;
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        let /** @type {?} */ result = null;
        if (this.required && this.markdownValue.length === 0) {
            result = { required: true };
        }
        if (this.maxlength > 0 && this.markdownValue.length > this.maxlength) {
            result = { maxlength: true };
        }
        return result;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    insertContent(type) {
        if (!this.editor)
            return;
        let /** @type {?} */ selectedText = this.editor.getSelectedText();
        let /** @type {?} */ isSeleted = !!selectedText;
        let /** @type {?} */ startSize = 2;
        let /** @type {?} */ initText = '';
        let /** @type {?} */ range = this.editor.selection.getRange();
        switch (type) {
            case 'Bold':
                initText = 'Bold Text';
                selectedText = `**${selectedText || initText}**`;
                break;
            case 'Italic':
                initText = 'Italic Text';
                selectedText = `*${selectedText || initText}*`;
                startSize = 1;
                break;
            case 'Heading':
                initText = 'Heading';
                selectedText = `# ${selectedText || initText}`;
                break;
            case 'Refrence':
                initText = 'Refrence';
                selectedText = `> ${selectedText || initText}`;
                break;
            case 'Link':
                selectedText = `[](http://)`;
                startSize = 1;
                break;
            case 'Image':
                selectedText = `![](http://)`;
                break;
            case 'Ul':
                selectedText = `- ${selectedText || initText}`;
                break;
            case 'Ol':
                selectedText = `1. ${selectedText || initText}`;
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
    }
    /**
     * @return {?}
     */
    togglePreview() {
        this.showPreviewPanel = !this.showPreviewPanel;
        this.editorResize();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    previewPanelClick(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    /**
     * @return {?}
     */
    fullScreen() {
        this.isFullScreen = !this.isFullScreen;
        this._renderer.setElementStyle(document.body, 'overflowY', this.isFullScreen ? 'hidden' : 'auto');
        this.editorResize();
    }
    /**
     * @param {?=} timeOut
     * @return {?}
     */
    editorResize(timeOut = 100) {
        if (this.editor) {
            setTimeout(() => {
                this.editor.resize();
                this.editor.focus();
            }, timeOut);
        }
    }
}
MarkdownEditorComponent.decorators = [
    { type: Component, args: [{
                selector: 'md-editor',
                styles: [`.md-editor-container{margin-bottom:15px;border:1px solid rgba(0,0,0,.1)}.md-editor-container.fullscreen{margin:0;position:fixed;border:0;top:0;left:0;width:100%;height:100%;z-index:99999999}.md-editor-container.fullscreen .editor-panel,.md-editor-container.fullscreen .preview-panel{height:calc(100vh - 40px)!important}.md-editor-container .ace-editor{height:100%}.md-editor-container .tool-bar{background-color:#f5f5f5;border-bottom:1px solid rgba(0,0,0,.1)}.md-editor-container .tool-bar .btn-group{padding:6px}.md-editor-container .tool-bar .btn-group>.btn:first-child::before{content:' ';background-color:#a9a9a9;width:1px;height:24px;left:-9px;top:2px;position:absolute}.md-editor-container .tool-bar .btn-group.hide-split>.btn:first-child::before,.md-editor-container .tool-bar .btn-group:first-child>.btn:first-child::before{display:none}.md-editor-container .tool-bar .btn{margin-bottom:0}.md-editor-container .editor-container{display:-webkit-box;display:-ms-flexbox;display:flex}.md-editor-container .editor-container>div{-webkit-box-flex:1;-ms-flex:1;flex:1}.md-editor-container .preview-panel{border-left:1px solid rgba(0,0,0,.1);background-color:#fff;padding:10px;overflow-y:auto}.md-editor-container .md-footer{padding:2px;background-color:#f0f0f0;font-size:12px;border-top:1px solid rgba(0,0,0,.1)}`],
                template: `<div class="md-editor-container" [class.fullscreen]="isFullScreen">
  <div class="tool-bar" *ngIf="!hideToolbar && mode != 'preview'">
    <div class="btn-group">
      <button class="btn btn-sm btn-default" type="button" title="Bold" (click)="insertContent('Bold')" *ngIf="!_hideIcons.Bold">
        <i class="fa fa-bold"></i>
      </button>
      <button class="btn btn-sm btn-default" type="button" title="Italic" (click)="insertContent('Italic')" *ngIf="!_hideIcons.Italic">
        <i class="fa fa-italic"></i>
      </button>
      <button class="btn btn-sm btn-default" type="button" title="Heading" (click)="insertContent('Heading')" *ngIf="!_hideIcons.Heading">
        <i class="fa fa-header"></i>
      </button>
      <button class="btn btn-sm btn-default" type="button" title="Refrence" (click)="insertContent('Refrence')" *ngIf="!_hideIcons.Refrence">
        <i class="fa fa-quote-left"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="btn btn-sm btn-default" type="button" title="Link" (click)="insertContent('Link')" *ngIf="!_hideIcons.Link">
        <i class="fa fa-link"></i>
      </button>
      <button class="btn btn-sm btn-default" type="button" title="Image" (click)="insertContent('Image')" *ngIf="!_hideIcons.Image">
        <i class="fa fa-image"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="btn btn-sm btn-default" type="button" title="Unordered List" (click)="insertContent('Ul')" *ngIf="!_hideIcons.Ul">
        <i class="fa fa-list-ul"></i>
      </button>
      <button class="btn btn-sm btn-default" type="button" title="Ordered List" (click)="insertContent('Ol')" *ngIf="!_hideIcons.Ol">
        <i class="fa fa-list-ol"></i>
      </button>
      <button class="btn btn-sm btn-default" type="button" title="Code Block" (click)="insertContent('Code')" *ngIf="!_hideIcons.Code">
        <i class="fa fa-file-code-o"></i>
      </button>
    </div>
    <div class="btn-group">
      <button class="btn btn-sm btn-default" type="button" [attr.title]="showPreviewPanel ? 'Hide Preview' : 'Show Preview'" (click)="togglePreview()"
        *ngIf="!_hideIcons.TogglePreview">
        <i class="fa" [class.fa-eye]="!showPreviewPanel" [class.fa-eye-slash]="showPreviewPanel"></i>
      </button>
    </div>
    <div class="btn-group pull-right hide-split">
      <button class="btn btn-sm btn-default" type="button" [class.active]="isFullScreen" (click)="fullScreen()" *ngIf="!_hideIcons.FullScreen">
        <i class="fa fa-arrows-alt"></i>
      </button>
    </div>
  </div>
  <div class="editor-container">
    <div [style.display]="mode == 'preview' ? 'none' : null">
      <div class="editor-panel" [style.height]="height">
        <div class="ace-editor" #aceEditor></div>
      </div>
    </div>
    <div [style.display]="showPreviewPanel ? 'block' : 'none'" (click)="previewPanelClick($event)">
      <div class="preview-panel" [innerHtml]="_previewHtml" [style.height]="height"></div>
    </div>
  </div>
  <div *ngIf="maxlength > 0 && mode != 'preview'">
    <div class="text-right md-footer">
      {{ markdownValue?.length }} / {{ maxlength }}
    </div>
  </div>
</div>
`,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => MarkdownEditorComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => MarkdownEditorComponent),
                        multi: true
                    }
                ]
            },] },
];
/** @nocollapse */
MarkdownEditorComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Attribute, args: ['required',] },] },
    { type: undefined, decorators: [{ type: Attribute, args: ['maxlength',] },] },
    { type: Renderer, },
    { type: DomSanitizer, },
];
MarkdownEditorComponent.propDecorators = {
    "aceEditorContainer": [{ type: ViewChild, args: ['aceEditor',] },],
    "hideToolbar": [{ type: Input },],
    "height": [{ type: Input },],
    "preRender": [{ type: Input },],
    "mode": [{ type: Input },],
    "options": [{ type: Input },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class LMarkdownEditorModule {
}
LMarkdownEditorModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    MarkdownEditorComponent
                ],
                imports: [
                    CommonModule,
                    FormsModule
                ],
                exports: [
                    MarkdownEditorComponent
                ]
            },] },
];
/** @nocollapse */
LMarkdownEditorModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { LMarkdownEditorModule, MarkdownEditorComponent };
//# sourceMappingURL=ngx-markdown-editor.js.map
