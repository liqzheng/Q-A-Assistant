const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory vector store
class VectorStore {
  constructor() {
    this.documents = new Map(); // documentId -> { name, chunks: [{ text, embedding }] }
    this.allChunks = []; // Flat list of all document chunks for searching
  }

  /**
   * Generate vector embedding for text
   */
  async generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  /**
   * Add document
   */
  async addDocument(documentName, chunks) {
    const documentId = Date.now().toString();
    const documentChunks = [];

    console.log(`Processing document: ${documentName}, ${chunks.length} chunks`);

    // Generate embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);
      
      const embedding = await this.generateEmbedding(chunk);
      const chunkData = {
        text: chunk,
        embedding,
        documentId,
        documentName,
        chunkIndex: i
      };

      documentChunks.push(chunkData);
      this.allChunks.push(chunkData);

      // Add small delay to avoid API rate limits
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.documents.set(documentId, {
      name: documentName,
      chunks: documentChunks
    });

    console.log(`Document processing completed: ${documentName}`);
    return documentId;
  }

  /**
   * Search for relevant document chunks
   */
  async search(query, topK = 3) {
    if (this.allChunks.length === 0) {
      return [];
    }

    // Generate embedding for query
    const queryEmbedding = await this.generateEmbedding(query);

    // Calculate similarity with all chunks
    const similarities = this.allChunks.map(chunk => ({
      ...chunk,
      similarity: this.cosineSimilarity(queryEmbedding, chunk.embedding)
    }));

    // Sort by similarity and return top K
    similarities.sort((a, b) => b.similarity - a.similarity);
    return similarities.slice(0, topK);
  }

  /**
   * Get all documents
   */
  getAllDocuments() {
    return Array.from(this.documents.values()).map(doc => ({
      name: doc.name,
      chunksCount: doc.chunks.length
    }));
  }

  /**
   * Clear all documents
   */
  clearAll() {
    this.documents.clear();
    this.allChunks = [];
  }
}

// Export singleton
module.exports = new VectorStore();

