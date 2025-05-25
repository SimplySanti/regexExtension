import { useState, useEffect } from "react"
import { setApiKey, getApiKey, deleteApiKey } from "~storage"
import { sendToBackground } from "@plasmohq/messaging";

type GPTInputProps = {
    addRegex: (expression: string) => void
}

export default function OpenAIMenu({ addRegex }: GPTInputProps) {

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

    async function deleteKey() {
        await deleteApiKey();
        setApiKeyState(null);
    }

    async function setApiKeyInput() {
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

        if (resp.slice(0, 6) == "Error:") {
            setGptInput("Error using ChatGPT, make sure 'o4-mini' is allowed to be used in your API key project.");
        }

        else {
            addRegex(resp);
            setGptInput("");
        }
        setLoading(false)
    }

    return (
        <>
            {apiKey == null &&
                <div>
                    <p style={{ fontSize: 12 }}><strong>Configuracion de API</strong></p>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 8,
                    }}>
                        <input style={{
                            flexGrow: 1,
                            flex: 1,
                            padding: 7,
                            border: "1px solid #ccc",
                            borderRadius: 5,
                            backgroundColor: "white",
                            color: "#333",
                            height: 25,
                        }} placeholder="Ingresa tu API Key" value={inputApi} onChange={(e) => setInputApi(e.target.value)}></input>
                        <button
                            style={{
                                height: 40,
                                paddingRight: 8,
                                paddingLeft: 8,
                                backgroundColor: "#55e7b4",
                                border: "2px solid #F0F0F0",
                                borderRadius: 5,
                                fontSize: 14,
                                fontWeight: "normal",
                                cursor: "pointer",
                            }}
                            onClick={setApiKeyInput}>Añadir</button>
                    </div>
                </div>
            }
            {apiKey != null &&
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                }}>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ fontSize: 12 }}><strong>Utilizando API Key:</strong>&nbsp;{apiKey.slice(-5)}</p>
                        <button onClick={deleteKey} style={{
                            fontSize: 10,
                            backgroundColor: "red",
                            border: "none",
                            color: "#fff",
                            borderRadius: 5,
                            fontWeight: 500,
                            cursor: "pointer",
                            paddingBottom: 4,
                            paddingTop: 4,
                        }}>
                            x
                        </button>
                    </div>
                    <div style={{
                        paddingRight: 18,
                        marginTop: 8,
                    }}>
                        <textarea style={{
                            width: "100%",
                            marginRight: 16,
                            minHeight: 50,
                            padding: 8,
                        }} placeholder="Describe la expresion..." onChange={(e) => setGptInput(e.target.value)} value={gptInput} />
                    </div>
                    <button style={{
                        marginTop: 4,
                        height: 40,
                        width: "100%",
                        backgroundColor: "#55e7b4",
                        border: "2px solid #000000",
                        borderRadius: 5,
                        fontSize: 14,
                        fontWeight: "regular",
                        cursor: "pointer",
                    }}
                        onClick={callOpenAi}>
                        CREAR EXPRESION
                    </button>
                    {loading && <p>Loading expression...</p>}
                </div>
            }

        </>
    )
}