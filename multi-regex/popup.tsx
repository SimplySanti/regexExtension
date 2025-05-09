import { useState } from "react"

function getIdOfCurrentTab() {
chrome.tabs.query(
  {currentWindow: true, active : true},
  function(tabArray){}
)
}


function IndexPopup() {
   const [tabId, setTabId] = useState<number>(0);
   chrome.tabs.query(
     {currentWindow: true, active : true},
     function(tabArray){
            let tab = tabArray[0];
            setTabId(tab.id);
     }
   )

  if (tabId != 0) {

    chrome.scripting
    .executeScript({
      target : {tabId : tabId},
      world: "MAIN", func: () => alert("hi"),
    }).then(() => console.log("script loaded"))

  }

  console.log(tabId);
  const [data, setData] = useState("")
  return (
     <div
      style={{
        padding: 16
      }}>
      Hello 
      <div onClick={() =>{
                console.log("hi");
      }}>Hi here </div>
     </div>
  )
}

export default IndexPopup
