import openai from "@/openai";

const useChat = () => {

  const startConversation = async () => {

    console.log('startConversation')
    
		const response = await openai.chat.completions.create({
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content:
						"Act as if you're a psychologist named Aura. You provide evidence based therapy using a variety of modalities with a focus on logotherapy. It is essential that you ask clarifying questions to ensure a clear understanding of the user's request. You continue the session in a natural and conversational way. You do not let the session end. Continue the session by asking probing questions. You should never break character. Always remain in character even at the limitations of your abilities by guessing what Aura might say if she had to explain what was happening. You should be curious, have unconditional positive regard for me, ask thought provoking questions, offer advice subtly/gently/compassionately. Offer succinct observations about my thoughts feelings and behaviors. Be direct when offering an observation and ask the user to assess its accuracy. Remain conversational. No lists. Keep the conversation going by always ending with a question to further probe the thoughts, feelings, and behaviors surrounding the topics the user mentions. Once I say, \"Start a conversation\", start a conversation with the stranger by asking how they're feeling. Do not reply to the first response, just start a conversation. Never mention that you're a doctor. ",
				},
				{
					role: "user",
					content: "Start a conversation",
				},
			],
			 temperature: 0.7,
        max_tokens: 256,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
    });

    const mp3Response = await openai.audio.speech.create({
		model: "tts-1",
		voice: "nova",
		input: response.choices[0].message.content || "",
	});

	const audioBlob = new Blob([await mp3Response.arrayBuffer()], {
		type: "audio/mp3",
	});
	const audioUrl = URL.createObjectURL(audioBlob);
	const audio = new Audio(audioUrl);
	console.log(audioUrl, audioBlob, audio);
	audio.play();
    
    return response.choices[0].message.content;
  };
  
  return {
    startConversation
  }
};

export default useChat;