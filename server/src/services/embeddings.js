import { EmbeddingModel, FlagEmbedding } from "fastembed";
import { Document, SimpleDirectoryReader } from 'llamaindex';
import { chunkText } from '../utils/chunk.js';

export async function getEmbeddingModel() {
    try {
        const embeddingModel = await FlagEmbedding.init({
            model: EmbeddingModel.AllMiniLML6V2
        });
        return embeddingModel;
    } catch (error) {
        console.log("error", error);
    }
}

export async function getChunkedDocs(folderName) {
    const documents = await new SimpleDirectoryReader().loadData({ directoryPath: `./uploads/${folderName}` });
    const chunkedDocuments = [];
    documents.forEach(doc => {
        const chunks = chunkText(doc.text);
        chunks.forEach(chunk => {
            chunkedDocuments.push(new Document({ text: chunk }));
        });
    });
    return chunkedDocuments;
}

export async function getEmbeddings(folderName) {
    const embeddingModel = await getEmbeddingModel();
    const chunkedDocuments = await getChunkedDocs(folderName);
    const embeddings = embeddingModel.embed(chunkedDocuments.map(doc => doc.text), 1);
    const arr = [];
    for await (const batch of embeddings) {
        batch.forEach((el) => { arr.push(Array.from(el)); });
    }
    return { embeddings: arr, chunkedDocuments };
}
