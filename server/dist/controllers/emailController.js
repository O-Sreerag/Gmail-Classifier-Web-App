import { classifyEmails } from '../models/emailModel';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
export async function classifyEmailsController(req, res) {
    try {
        const emails = req.body.emails;
        const API_KEY = req.body.api_key;
        const google = createGoogleGenerativeAI({ apiKey: API_KEY });
        const classifiedEmails = await classifyEmails(emails, google);
        console.log(classifiedEmails);
        res.json({ classifiedEmails });
    }
    catch (error) {
        console.error("Error classifying emails:", error);
        res.status(500).send("Error classifying emails");
    }
}
