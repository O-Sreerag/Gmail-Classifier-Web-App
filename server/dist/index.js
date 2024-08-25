// import express from 'express';
// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { generateText } from "ai"
// import cors from 'cors';
// const app = express();
// app.use(cors());
// const PORT = process.env.PORT || 5000;
// app.use(express.json({ limit: '10mb' }));
// app.get('/', (req, res) => {
//     res.send('Server is running with TypeScript and ES Modules!');
// });
// // type GoogleGenerativeAI = ReturnType<typeof createGoogleGenerativeAI>;
// async function classifyEmails(emails: any[], google: any) {
//     return Promise.all(emails.map(async (email: any) => {
//         const prompt = generateClassificationPrompt(email);
//         const response = await generateText({
//             model: google('gemini-1.5-flash'),
//             prompt,
//         });
//         console.log(response)
//         return {
//             ...email,
//             category: (() => {
//                 const category = response.text.trim().toLowerCase().split('\n')[0].replace('this email is ', '').trim();
//                 if (category.includes('promotion')) {
//                     return 'promotion';
//                 } else if (category.includes('spam')) {
//                     return 'spam';
//                 } else if (category.includes('important')) {
//                     return 'important';
//                 } else if (category.includes('other')) {
//                     return 'other';
//                 }
//                 return category;
//             })()
//         };
//     }));
// }
// function generateClassificationPrompt(email: any) {
//     return "Classify this email into one of the following categories: spam, important, promotion, other based on email.content Email: "+ JSON.stringify(email)
// }
// app.post('/classify', async (req, res) => {
//     try {
//         const emails = req.body.emails;
//         const API_KEY = req.body.api_key;
//         // console.log("API_KEY ", API_KEY)
//         // console.log("emails ", emails)
//         const google = createGoogleGenerativeAI({apiKey: API_KEY});
//         const classifiedEmails = await classifyEmails(emails, google);
//         console.log(classifiedEmails)
//         res.json({ classifiedEmails });
//     } catch (error) {
//         console.error("Error classifying emails:", error);
//         res.status(500).send("Error classifying emails");
//     }
// });
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
// index.ts
import express from 'express';
import cors from 'cors';
import emailRoutes from './routes/emailRoutes.js';
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: '10mb' }));
app.get('/', (req, res) => {
    res.send('Server is running with TypeScript and ES Modules!');
});
app.use('/api', emailRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
