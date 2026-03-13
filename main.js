'use strict';

const obsidian = require('obsidian');

// Define default settings
const DEFAULT_SETTINGS = {
    reduceMode: 'step' // 'step' reduces x consecutive blank lines to x-1 lines, 'one' collapses them to 1 line
};

class RemoveEmptyLinesPlugin extends obsidian.Plugin {
    
    async onload() {
        console.log('Loading Remove Empty Lines Plugin...');

        await this.loadSettings();
        this.addSettingTab(new RemoveEmptyLinesSettingTab(this.app, this));

        this.addCommand({
            id: 'remove-empty-lines',
            name: 'Batch Remove Empty Lines',
            editorCallback: (editor) => this.removeEmptyLines(editor),
        });
    }

    onunload() {
        /*console.log('Unloading Remove Empty Lines Plugin...');*/
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    removeEmptyLines(editor) {
        const regex = /(\r?\n)([ \t]*\r?\n)+/g;
        
        const replacer = (match, p1, p2, offset, string) => {
            const nextText = string.substring(offset + match.length);
            
            // Detect whether the following text uses sensitive Markdown syntax
            // [-=]{3,} matches --- or === (Setext heading/divider)
            // \| matches the leading pipe of a table
            // If either of these matches, activate protection
            const isProtected = /^[ \t]*([-=]{3,}|\|)/.test(nextText);
            
            const newlineCount = (match.match(/\n/g) || []).length;
            let targetCount = 1; 

            if (this.settings.reduceMode === 'step') {
                targetCount = newlineCount - 1;
            } else {
                targetCount = 2;
            }

            // Safety lock: if the next section is protected (e.g., a table or divider), keep at least one blank line (two line breaks)
            if (isProtected && targetCount < 2) {
                targetCount = 2;
            }

            if (targetCount < 1) {
                targetCount = 1;
            }

            const lineBreak = match.includes('\r\n') ? '\r\n' : '\n';
            return lineBreak.repeat(targetCount);
        };

        const selection = editor.getSelection();
        
        if (!selection) {
            const text = editor.getValue();
            const newText = text.replace(regex, replacer);
            if (text !== newText) {
                editor.setValue(newText);
            }
        } else {
            const newSelection = selection.replace(regex, replacer);
            if (selection !== newSelection) {
                editor.replaceSelection(newSelection);
            }
        }
    }
}

class RemoveEmptyLinesSettingTab extends obsidian.PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display() {
        const { containerEl } = this;
        containerEl.empty();

        /*containerEl.createEl('h2', { text: 'Remove Empty Lines Settings' });*/

        new obsidian.Setting(containerEl)
            .setName('Blank line reduction mode')
            .setDesc('Choose how to compress consecutive blank lines. To prevent formatting issues, at least one blank line is always preserved above Markdown block elements (e.g., tables, dividers).')
            .addDropdown(dropDown => {
                dropDown
                    .addOption('step', 'Gradual: Reduce blank lines by one (Default)')
                    .addOption('One-click', 'Strict: Collapse multiple blank lines into one')
                    .setValue(this.plugin.settings.reduceMode)
                    .onChange(async (value) => {
                        this.plugin.settings.reduceMode = value;
                        await this.plugin.saveSettings();
                    });
            });
    }
}

module.exports = RemoveEmptyLinesPlugin;