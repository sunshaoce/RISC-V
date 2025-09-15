const vscode = require('vscode');

// Instruction descriptions (can be extended or loaded from JSON)
const instructionDescriptions = {
  // U-type
  'lui': 'Load upper immediate. Places the U-immediate value in the top 20 bits of the destination register, filling the lowest 12 bits with zeros.',
  'auipc': 'Add upper immediate to PC. Forms a PC-relative address using U-type immediate, writes into rd.',

  // I-type
  'addi': 'Add immediate. Adds sign-extended 12-bit immediate to register rs1.',
  'slti': 'Set less than immediate. Sets rd = 1 if rs1 < imm, else rd = 0.',
  'sltiu': 'Set less than immediate unsigned. Sets rd = 1 if rs1 < imm (unsigned), else rd = 0.',
  'xori': 'XOR immediate. rd = rs1 XOR imm.',
  'ori': 'OR immediate. rd = rs1 OR imm.',
  'andi': 'AND immediate. rd = rs1 AND imm.',
  'slli': 'Shift left logical immediate. rd = rs1 << shamt.',
  'srli': 'Shift right logical immediate. rd = rs1 >> shamt (logical).',
  'srai': 'Shift right arithmetic immediate. rd = rs1 >> shamt (arithmetic).',
  'jalr': 'Jump and link register. Indirect jump to address in register rs1 + immediate, writes return address to rd.',
  'lb': 'Load byte from memory, sign-extended.',
  'lh': 'Load halfword from memory, sign-extended.',
  'lw': 'Load word from memory.',
  'lbu': 'Load byte from memory, zero-extended.',
  'lhu': 'Load halfword from memory, zero-extended.',

  // S-type
  'sb': 'Store byte to memory.',
  'sh': 'Store halfword to memory.',
  'sw': 'Store word to memory.',

  // R-type
  'add': 'Add. Integer register-register addition.',
  'sub': 'Subtract. Integer register-register subtraction.',
  'sll': 'Shift left logical. rd = rs1 << rs2.',
  'slt': 'Set less than. rd = 1 if rs1 < rs2, else rd = 0.',
  'sltu': 'Set less than unsigned. rd = 1 if rs1 < rs2 (unsigned), else rd = 0',
  'xor': 'XOR. rd = rs1 XOR rs2.',
  'srl': 'Shift right logical. rd = rs1 >> rs2 (logical).',
  'sra': 'Shift right arithmetic. rd = rs1 >> rs2 (arithmetic).',
  'or': 'OR. rd = rs1 OR rs2.',
  'and': 'AND. rd = rs1 AND rs2.',

  // B-type
  'beq': 'Branch if equal. If rs1 == rs2, branch to target offset.',
  'bne': 'Branch if not equal. If rs1 != rs2, branch to target offset.',
  'blt': 'Branch if less than. If rs1 < rs2, branch to target offset.',
  'bge': 'Branch if greater or equal. If rs1 >= rs2, branch to target offset.',
  'bltu': 'Branch if less than unsigned. If rs1 < rs2 (unsigned), branch to target offset.',
  'bgeu': 'Branch if greater or equal unsigned. If rs1 >= rs2 (unsigned), branch to target offset.',

  // J-type
  'jal': 'Jump and link. Jumps to target offset, writes return address to rd.',

  // Fence and system
  'fence': 'Memory fence. Ensures ordering of memory operations.',
  'fence.i': 'Instruction fence. Synchronizes instruction stream.',
  'ecall': 'Environment call. Used for system call.',
  'ebreak': 'Environment break. Used for debugger breakpoint.'
};


function activate(context) {
  // Define a document selector that activates only for RISC-V files
  const selector = { language: 'riscv', scheme: 'file' };

  // Register a HoverProvider to show information when hovering
  const hoverProvider = vscode.languages.registerHoverProvider(selector, {
    provideHover(document, position) {
      // Get the word range at the current cursor position
      const range = document.getWordRangeAtPosition(
        position,
        /[a-zA-Z.][a-zA-Z0-9._]*/
      );
      if (!range) {
        // Return undefined if no word is found
        return undefined;
      }

      // Get the word text and convert to lowercase
      const word = document.getText(range).toLowerCase();
      // Look up the instruction description
      const desc = instructionDescriptions[word];

      if (desc) {
        // Create a MarkdownString object for hover content
        const markdown = new vscode.MarkdownString();
        // Make the instruction name bold
        markdown.appendMarkdown(`**${word}**\n\n`);
        // Append the instruction description
        markdown.appendMarkdown(desc);
        // Return a Hover object to display in VS Code
        return new vscode.Hover(markdown, range);
      }

      // Return undefined if description not found
      return undefined;
    }
  });

  // Push the HoverProvider into the extension context subscriptions
  context.subscriptions.push(hoverProvider);
}

function deactivate() { }

module.exports = {
  activate,
  deactivate
};
