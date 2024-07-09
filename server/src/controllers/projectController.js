import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { doc, updateDoc } from 'firebase/firestore';

import { getAllProjects, storeProjectInfo, uploadPdfToFirebase } from '../utils/dbFunctions.js';
import { deleteFolder, generateResponse, getEmbeddingModel, getIndex, insertEmbeddingsIntoDB, retrieveDocuments } from '../utils/embeddingFunctions.js';
import { db } from '../config/firebaseConfig.js';

export const uploadPdf = async (req, res) => {
    const file = req.file;
    const userID = req.headers['userid'];

    if (!file || !userID) {
        return res.status(400).json({ error: "No file part" });
    }
    if (!file.originalname.endsWith('.pdf')) {
        return res.status(400).json({ error: "Invalid file type, please upload a PDF file" });
    }

    // Generate a random string
    const randomString = uuidv4();

    // Create a folder with the name equal to the random string
    const folderPath = path.join('uploads', randomString);
    fs.mkdirSync(folderPath, { recursive: true });

    // Save the file into the created folder
    const savePath = path.join(folderPath, file.originalname);
    fs.renameSync(file.path, savePath);

    // Define the local and cloud paths for the file
    const localPdfPath = savePath;
    const cloudPdfPath = `pdfs/${randomString}/${file.originalname}`;

    await uploadPdfToFirebase(localPdfPath, cloudPdfPath);
    const projectID = await storeProjectInfo(userID, cloudPdfPath);

    await insertEmbeddingsIntoDB(randomString, projectID);
    deleteFolder(randomString);
    const projectDocRef = doc(db, 'projects', userID);
    await updateDoc(projectDocRef, {
        [`${projectID}.status`]: 'Completed'
    });


    res.status(200).json({ message: "File processed and saved successfully" });
    console.log("File processed and saved successfully");
    // await addJob(userID, projectID, randomString);
}

export const getProjects = async (req, res) => {
    const userID = req.headers['userid'];
    if (!userID) {
        return res.status(400).json({ error: "User ID not provided in headers" });
    }

    try {
        const projects = await getAllProjects(userID);

        if (!projects.exists()) {
            return res.status(404).json({ error: "No projects found for this user" });
        }

        res.status(200).json(projects.data());
    } catch (error) {
        res.status(500).json({ error: "Error retrieving projects" });
        console.error("Error retrieving projects:", error);
    }
}

export const queryResponse =  async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }
    const index = getIndex();
    const embeddingModel = await getEmbeddingModel();
    const retrievedDocs = await retrieveDocuments(query, index, embeddingModel);
    console.log(retrievedDocs);
    const response = await generateResponse(query, retrievedDocs);
    res.json({ response });
}