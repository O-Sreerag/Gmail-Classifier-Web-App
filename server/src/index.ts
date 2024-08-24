import express from 'express';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import cors from 'cors';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
    res.send('Server is running with TypeScript and ES Modules!');
});

type GoogleGenerativeAI = ReturnType<typeof createGoogleGenerativeAI>;

async function classifyEmails(emails: any[], genAI: GoogleGenerativeAI) {
    return Promise.all(emails.map(async (email: any) => {
        const prompt = generateClassificationPrompt(email);
        
        const response = await genAI.generateText({
            model: "gemini-1.5-flash",
            prompt,
            temperature: 0.2,
            maxOutputTokens: 100,
        });

        return {
            ...email,
            category: response.text.trim().toLowerCase(),
        };
    }));
}

function generateClassificationPrompt(email: any) {
    return `Classify this email into one of the following categories: spam, important, promotion, other.
        Email: 
        ${email.snippet}
        ${email.payload.parts.filter((part: any) => part.mimeType === 'text/plain')[0]?.body?.data || ''}
        ${email.payload.parts.filter((part: any) => part.mimeType === 'text/html')[0]?.body?.data || ''}`;
}

app.post('/classify', async (req, res) => {
    try {
        const emails = req.body.emails;
        const API_KEY = req.body.api_key;
        const genAI = createGoogleGenerativeAI({ apiKey: API_KEY });

        const classifiedEmails = await classifyEmails(emails, genAI);

        res.json({ classifiedEmails });
    } catch (error) {
        console.error("Error classifying emails:", error);
        res.status(500).send("Error classifying emails");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



// app.post('/classify', async (req, res) => {
//     console.log("classifying emails");
//     const emails = req.body.emails;
//     const API_KEY = req.body.api_key;
//     const genAI = createGoogleGenerativeAI({ apiKey: API_KEY });

//     try {
//         // const classifiedEmails = await classifyEmails();
//         const classifiedEmails = await Promise.all(emails.map(async (email: any[]) => {
//             const prompt = `Classify this email into one of the following categories: spam, important, promotion, other.
//             Email: 
//             ${email.snippet}
//             ${email.payload.parts.filter(part => part.mimeType === 'text/plain')[0]?.body?.data || ''}
//             ${email.payload.parts.filter(part => part.mimeType === 'text/html')[0]?.body?.data || ''}`;
      
//             const response = await genAI.generateText({
//               model: "gemini-pro",
//               prompt,
//               temperature: 0.2,
//               maxOutputTokens: 100,
//             });
      
//             return {
//               ...email,
//               category: response.text.trim().toLowerCase(),
//             };
//           }));
      
//           res.json({ classifiedEmails });
//         res.json({ classifiedEmails });
//     } catch (error) {
//         console.error("Error classifying emails:", error);
//         res.status(500).send("Error classifying emails");
//     }
// });

// import { GoogleGenerativeAI } from "@google/generative-ai";
    // const genAI = new GoogleGenerativeAI(API_KEY);
    // async function classifyEmails() {
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

        // const classifiedEmails = [];

        // for (const email of emails) {
        //     const emailText = `${email.snippet} ${email.payload.parts.filter((part: any) => part.mimeType === 'text/plain')[0]?.body?.data || ''} ${email.payload.parts.filter((part: any) => part.mimeType === 'text/html')[0]?.body?.data || ''}`;
        //     const prompt = `Classify this email into one of the following categories: spam, important, promotion, other.\nEmail:\n${emailText}`;

        //     const response = await model.generateText({
        //         prompt,
        //         temperature: 0.2,
        //         maxOutputTokens: 100,
        //     });

        //     classifiedEmails.push({
        //         ...email,
        //         category: response.text.trim().toLowerCase()
        //     });
        // }

    //     return classifiedEmails;
    // }