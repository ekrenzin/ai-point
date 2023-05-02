import { Request } from 'express';

async function getTriviaQuestion(req: Request) {
    const credentials = extractCredentials(req);
    const body = req.body;
    const { content } = body;
    const memorable = new MemorableChat(credentials);
    const data = await memorable.chainCall(content);
    await memorable.memorize({ message: content, response: data });
    res.status(200).json({ result: data });
}