const { Configuration, OpenAIApi } = require("openai");

const handler = async (request, response) => {
    const configuration = new Configuration({
        apiKey: process.env.OPEN_AI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);
    const {prompt} = request.body;

    const aiResponse = await openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
    });
    const image = aiResponse.data.data[0].url;

    return response.status(200).json({ image });
}

module.exports = {handler};