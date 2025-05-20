import type { PlasmoMessaging } from "@plasmohq/messaging"
import { getApiKey } from "~storage"

export type RequestBody = {
  expression: string
}

export type RequestResponse = string

const handler: PlasmoMessaging.MessageHandler<RequestBody, RequestResponse> = async (req, res) => {

  const apiKey = await getApiKey(); 

  const prompt = `Provide me a regex expression based on the following description given by the user: "${req.body.expression}". Just return the regular expression with no description nor explanation.`;

  try {
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "o4-mini",  // or "gpt-4", "gpt-4-turbo"
      messages: [{ role: "user", content: prompt }]
    })
  })

  if (!resp.ok) {
    const errorData = await resp.json()
    res.send(`Error: ${errorData}`)
  }

  const data = await resp.json()
  res.send(`${data.choices[0].message.content}`)
  console.log(data)
  // Do something with `data.choices[0].message.content`
} catch (error) {
  res.send(`Error: ${error}`)
  // You can send a fallback message or handle this gracefully in the UI
}

  // res.send(`Received number: ${expressionValue}`)
}

export default handler
