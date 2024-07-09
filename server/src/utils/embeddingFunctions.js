import { EmbeddingModel, FlagEmbedding } from "fastembed";
import { Document, SimpleDirectoryReader } from 'llamaindex';
import axios from 'axios';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const API_KEY = process.env.PINECONE_API_KEY;
const API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
const index_name = "docs-quickstart-index";

const pc = new Pinecone({
    apiKey: API_KEY,
});

export function chunkText(text, chunkSize = 512, overlap = 50) {
    const words = text.split(' ');
    const chunks = [];
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
        const chunk = words.slice(i, i + chunkSize).join(' ');
        chunks.push(chunk);
        if (i + chunkSize >= words.length) break;
    }
    return chunks;
}

export async function getEmbeddingModel() {
    try {
        const embeddingModel = await FlagEmbedding.init({
            model: EmbeddingModel.AllMiniLML6V2
        });
        return embeddingModel
    } catch (error) {
        console.log("error", error)
    }
}

export async function getChunkedDocs(folderName) {
    const documents = await new SimpleDirectoryReader().loadData({ directoryPath: `./uploads/${folderName}` })
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
        batch.forEach((el) => { arr.push(Array.from(el)); })
    }
    return { embeddings: arr, chunkedDocuments };
}

export function getIndex(projectID) {
    return pc.Index(index_name);
}

export async function insertEmbeddingsIntoDB(folderName, projectID) {
    const { embeddings, chunkedDocuments } = await getEmbeddings(folderName);
    const indexes = (await pc.listIndexes()).indexes;
    if (!indexes.filter(el => el.name === index_name)) {
        await pc.createIndex({
            name: index_name,
            dimension: embeddings[0].length,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            }
        });
    }

    const index = getIndex(projectID);
    const vectors = chunkedDocuments.map((doc, i) => ({
        id: i.toString(),
        values: embeddings[i],
        metadata: { text: doc.text }
    }));
    await index.upsert(vectors);
}

export async function callLLM(payload) {
    const headers = { "Authorization": `Bearer ${API_TOKEN}` };
    const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3";
    const response = await axios.post(API_URL, payload, { headers });
    return response.data;
}

export async function retrieveDocuments(query, index, embeddingModel, top_k = 5) {
    try {
        let queryEmbedding = await embeddingModel.queryEmbed(query);
        queryEmbedding = [Array.from(queryEmbedding)]
        const result = await index.query({ vector: queryEmbedding[0], topK: top_k, includeMetadata: true });
        return result.matches.map(item => new Document({ text: item.metadata.text }));
    } catch (error) {
        console.log(error);
    }
}

export async function generateResponse(query, retrievedDocs) {
    try {
        const context = retrievedDocs.map(doc => doc.text).join(' ');
        const inputText = `Context: ${context}\n Answer the below question using above context \nQuery: ${query}`;
        const payload = {
            inputs: inputText,
            parameters: {
                max_new_tokens: 100
            }
        };
        const data = await callLLM(payload);
        return data[0].generated_text;
    } catch (error) {
        console.log(error);
    }
}

export const deleteFolder = (folderName) => {
    const folderPath = path.join('uploads', folderName);
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach((file, index) => {
            const curPath = path.join(folderPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(folderPath);
    }
    console.log(`Folder ${folderPath} deleted successfully`);
};