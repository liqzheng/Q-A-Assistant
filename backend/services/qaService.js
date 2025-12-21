const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate answer based on retrieved document chunks
 */
async function generateAnswer(question, relevantChunks) {
  try {
    // Build context
    const context = relevantChunks
      .map((chunk, index) => `[Document Chunk ${index + 1}]\n${chunk.text}`)
      .join('\n\n');

    const prompt = `You are a professional document Q&A assistant. Please answer the user's question based on the following document content.

Document Content:
${context}

User Question: ${question}

Please provide an accurate and detailed answer based on the document content. If there is no relevant information in the document, please state so honestly.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional document Q&A assistant, skilled at answering user questions based on provided document content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`Failed to generate answer: ${error.message}`);
  }
}

module.exports = {
  generateAnswer
};

