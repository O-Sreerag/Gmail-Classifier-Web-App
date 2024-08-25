// models/emailModel.ts
import { generateText } from "ai";
export async function classifyEmails(emails, google) {
    return Promise.all(emails.map(async (email) => {
        const prompt = generateClassificationPrompt(email);
        const response = await generateText({
            model: google('gemini-1.5-flash'),
            prompt,
        });
        console.log(response);
        return {
            ...email,
            category: (() => {
                const category = response.text.trim().toLowerCase().split('\n')[0].replace('this email is ', '').trim();
                if (category.includes('promotion')) {
                    return 'promotion';
                }
                else if (category.includes('spam')) {
                    return 'spam';
                }
                else if (category.includes('important')) {
                    return 'important';
                }
                else if (category.includes('other')) {
                    return 'other';
                }
                return category;
            })()
        };
    }));
}
function generateClassificationPrompt(email) {
    return "Classify this email into one of the following categories: spam, important, promotion, other based on email.content Email: " + JSON.stringify(email);
}
