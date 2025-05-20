import { Storage } from "@plasmohq/storage"

export type RegexData = {
  expression: string
  color: string
}

const storage = new Storage({
    area: "local", 
    copiedKeyList: ["shield-modulation"]
})

export async function getApiKey(){
    try {
        return await storage.get("hailing");
    }
    catch (error){
        throw new Error("No OpenAPI Key");
    }
}

export async function setApiKey(keyValue: string){
    try{
        await storage.set("hailing", keyValue.trim());
    }
    catch (error){
        throw new Error("Error saving OpenAPI key");
    }
}

export async function deleteApiKey(){
    try{
        await storage.set("hailing", "");
    }
    catch (error){
        throw new Error("Could not remove API key");
    }
}