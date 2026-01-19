import OpenAI from "openai";

export const sendTextOpenai = (message)=>{
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const openai = new OpenAI({
            apiKey: openaiApiKey,
            dangerouslyAllowBrowser:true,
        });

        return openai.responses.create({
            model:"gpt-4o-mini",
            input: message,
        })


}