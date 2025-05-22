import { useState, useEffect } from "react"
import { setApiKey, getApiKey, deleteApiKey } from "~storage"
import { sendToBackground } from "@plasmohq/messaging";

type GPTInputProps = {
  addRegex: (expression: string) => void
}

export default function OpenAIMenu({addRegex} : GPTInputProps){

    const [apiKey, setApiKeyState] = useState(null);
    const [inputApi, setInputApi] = useState("");
    const [gptInput, setGptInput] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // Assume getApiKey returns a Promise
        getApiKey().then((key) => {
        if (key) {
            setApiKeyState(key);
        }
        })
    }, [])

    async function deleteKey(){
        await deleteApiKey();
        setApiKeyState(null);
    }

    async function setApiKeyInput(){
        await setApiKey(inputApi); 
        setApiKeyState(inputApi);
    }

    async function callOpenAi() {
        setLoading(true)
        const resp = await sendToBackground({
        name: "open-ai",
        body: {
            expression: gptInput
        }
        })

        if (resp.slice(0,6) == "Error:"){
            setGptInput("Error using ChatGPT");
        }

        else{
            addRegex(resp);
            setGptInput("");
        }
        setLoading(false)
    }

    return(
        <>
            {apiKey == null &&
                <div>
                    <input placeholder="Enter Api key" value={inputApi} onChange={(e) => setInputApi(e.target.value)}></input>
                    <button onClick={setApiKeyInput}>Save key</button>
                </div>
            }

            {apiKey != null && 
                <div>
                    <p>Saved API Key: xxx{apiKey.slice(-5)}</p>
                    <button onClick={deleteKey}>Delete API Key</button>
                    <input placeholder="What would you like to find in the website?" onChange={(e) => setGptInput(e.target.value)} value={gptInput}/>
                    <button onClick={callOpenAi}>Search</button>
                    {loading && <p>Loading expression...</p>}
                </div>
            }
            
        </>
    )
}