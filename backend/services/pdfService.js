const pdf = require('pdf-parse');

/**
 * Parse PDF file and extract text content
 */
async function parsePDF(filePath) {
  try {
    const dataBuffer = require('fs').readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

/**
 * Split text into small chunks
 * @param {string} text - Original text
 * @param {number} chunkSize - Size of each chunk (number of characters)
 * @param {number} overlap - Overlap size between chunks (number of characters)
 */
function splitText(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.trim() === '') {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;
    
    // Try to split at periods, newlines, etc.
    if (end < text.length) {
      const lastPeriod = text.lastIndexOf('.', end);
      const lastNewline = text.lastIndexOf('\n', end);
      const splitPoint = Math.max(lastPeriod, lastNewline);
      
      if (splitPoint > start) {
        end = splitPoint + 1;
      }
    }

    const chunk = text.substring(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move to next chunk start position (considering overlap)
    start = end - overlap;
    if (start >= text.length) {
      break;
    }
  }

  return chunks;
}

module.exports = {
  parsePDF,
  splitText
};

