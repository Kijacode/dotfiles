"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const constants = require("./constants");
const QUOTES = require("./quotes/index");
class Quoter {
    constructor(initialCategory, initialLanguage, initialDisplaySeconds) {
        this.timeChangedEventEmitter = new vscode.EventEmitter();
        this.elapsedSeconds = 0;
        this.quoteList = [];
        this.quoteDisplay = '';
        this.category = initialCategory;
        this.language = initialLanguage;
        this.displaySeconds = initialDisplaySeconds;
        this.updateQuoteListAndChangeDisplay();
    }
    get onTimeChanged() {
        return this.timeChangedEventEmitter.event;
    }
    get quoteNow() {
        return this.quoteDisplay;
    }
    get getCategory() {
        return this.category;
    }
    get getLanguage() {
        return this.language;
    }
    getRandomQuoteFromQuoteList() {
        return this.quoteList[Math.floor(Math.random() * this.quoteList.length)];
    }
    updateQuoteListAndChangeDisplay() {
        this.quoteList = this.loadQuotes();
        this.setQuoteDisplay(this.getRandomQuoteFromQuoteList());
    }
    loadQuotes() {
        if (this.category === constants.CATEGORY_ALL) {
            let sentences = [];
            for (const [category, quotesByCategory] of Object.entries(QUOTES)) {
                for (let quote of quotesByCategory) {
                    if (quote.language === this.language) {
                        sentences = [...sentences, ...quote.sentences];
                    }
                }
            }
            return sentences;
        }
        else {
            const parsedCurrentCategory = this.category.toLowerCase().replace(/ /g, "_");
            for (const [category, quotesByCategory] of Object.entries(QUOTES)) {
                if (parsedCurrentCategory === category) {
                    for (let quote of quotesByCategory) {
                        if (quote.language === this.language) {
                            return quote.sentences;
                        }
                    }
                }
            }
        }
        vscode.window.showWarningMessage(`sorry, "${this.category}" in "${this.language}" is not supported now`);
        return QUOTES.wise_saying[0].sentences;
    }
    setQuoteDisplay(quote) {
        this.quoteDisplay = `$(quote) ${quote}`;
    }
    fireTimeChangedEvent(elapsedSeconds, wiseSayDisplay) {
        const args = {
            elapsedSeconds,
            wiseSayDisplay
        };
        this.timeChangedEventEmitter.fire(args);
    }
    tick() {
        if (this.displaySeconds === 0) { // display only one quote.
            this.fireTimeChangedEvent(this.elapsedSeconds, this.quoteDisplay);
            return;
        }
        this.elapsedSeconds += 1;
        if (this.elapsedSeconds >= this.displaySeconds) {
            this.elapsedSeconds = 0;
            this.setQuoteDisplay(this.getRandomQuoteFromQuoteList());
        }
        this.fireTimeChangedEvent(this.elapsedSeconds, this.quoteDisplay);
    }
    start() {
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);
    }
    setLanguage(language) {
        this.language = language;
        this.updateQuoteListAndChangeDisplay();
    }
    setCategory(category) {
        this.category = category;
        this.updateQuoteListAndChangeDisplay();
    }
    setDisplaySeconds(displaySeconds) {
        this.displaySeconds = displaySeconds;
    }
}
exports.default = Quoter;
//# sourceMappingURL=quoter.js.map