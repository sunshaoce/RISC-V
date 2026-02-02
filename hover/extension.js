const vscode = require("vscode");

// =============================================================================
// Vendor Configuration
// =============================================================================
// To add a new vendor, simply add a new entry here:
//   - languageId:    Required. Must match the language ID in package.json
//   - instructions:  Optional. Path to vendor-specific instruction descriptions
// =============================================================================
const vendors = {
  spacemit: {
    languageId: "riscv-spacemit",
    instructions: "./instructions-spacemit.json",
  },
  sifive: {
    languageId: "riscv-sifive",
    instructions: "./instructions-sifive.json",
  },
};

// =============================================================================
// Instruction Descriptions
// =============================================================================

/** Filter out comment keys (starting with '//') from JSON objects */
const filterComments = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("//")),
  );

/** Base RISC-V instruction descriptions (always loaded) */
const baseDescriptions = filterComments(require("./instructions.json"));

/** Vendor-specific instruction descriptions (keyed by languageId) */
const vendorDescriptions = Object.fromEntries(
  Object.entries(vendors)
    .filter(([, cfg]) => cfg.instructions)
    .map(([, cfg]) => [
      cfg.languageId,
      filterComments(require(cfg.instructions)),
    ]),
);

/** Get merged instruction descriptions for a given language ID */
const getDescriptions = (languageId) => ({
  ...baseDescriptions,
  ...(vendorDescriptions[languageId] || {}),
});

// =============================================================================
// Language Configuration
// =============================================================================

const baseLanguageId = "riscv";
const vendorLanguageIds = Object.values(vendors).map((v) => v.languageId);
const allLanguageIds = [baseLanguageId, ...vendorLanguageIds];

// =============================================================================
// Extension Activation
// =============================================================================

function activate(context) {
  // ---------------------------------------------------------------------------
  // Hover Provider: Show instruction descriptions on hover
  // ---------------------------------------------------------------------------
  const selectors = allLanguageIds.map((lang) => ({
    language: lang,
    scheme: "file",
  }));

  const hoverProvider = vscode.languages.registerHoverProvider(selectors, {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(
        position,
        /[a-zA-Z.][a-zA-Z0-9._]*/,
      );
      if (!range) return;

      const word = document.getText(range).toLowerCase();
      const desc = getDescriptions(document.languageId)[word];
      if (!desc) return;

      const markdown = new vscode.MarkdownString();
      markdown.appendCodeblock(word, "riscv");
      markdown.appendMarkdown(desc);
      return new vscode.Hover(markdown, range);
    },
  });

  context.subscriptions.push(hoverProvider);

  // ---------------------------------------------------------------------------
  // Language Switching: Switch document language based on vendor setting
  // ---------------------------------------------------------------------------

  /** Update a single document's language based on the current vendor setting */
  const updateDocumentLanguage = (document) => {
    if (!allLanguageIds.includes(document.languageId)) return;

    const vendor = vscode.workspace.getConfiguration("riscv").get("vendor", "");
    const targetLanguageId = vendors[vendor]?.languageId || baseLanguageId;

    if (document.languageId !== targetLanguageId) {
      vscode.languages.setTextDocumentLanguage(document, targetLanguageId);
    }
  };

  /** Update all open RISC-V documents */
  const updateAllOpenDocuments = () => {
    vscode.workspace.textDocuments.forEach(updateDocumentLanguage);
  };

  // Apply language on activation
  updateAllOpenDocuments();

  // Apply language when new documents are opened
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(updateDocumentLanguage),
  );

  // Re-apply language when vendor setting changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("riscv.vendor")) {
        updateAllOpenDocuments();
      }
    }),
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
