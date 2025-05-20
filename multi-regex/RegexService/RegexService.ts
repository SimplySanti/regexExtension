import { IRegexService, RegexExpression } from "./IRegexService.ts"

export class RegexService implements IRegexService {
  private nextId: number
  private expressions: RegexExpression[]
  private tabId: number

  constructor(tabId: number) {
    this.nextId = 0
    this.expressions = []
    this.tabId = tabId
  }

  async registerExpression(
    state: "ACTIVE" | "INACTIVE",
    restr: string,
    colorHexStr: string
  ): RegexExpression {
    const newExpression: RegexExpression = {
      id: this.nextId,
      state: state,
      restr: restr,
      colorHexStr: colorHexStr
    }

    this.nextId += 1
    this.expressions.push(newExpression)
    await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      world: "MAIN",
      args: [restr, newExpression.id, state, colorHexStr],
      func: (
        reString: string,
        regId: number,
        state: string,
        colorHexStr: string
      ) => {
        const re = RegExp(reString, "g")
        console.log("regex")
        console.log(re)

        const nodeIterator = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          function (node) {
            if (
              node.parentNode &&
              node.parentNode.tagName !== "SCRIPT" &&
              node.parentNode.tagName !== "STYLE" &&
              node.parentNode.tagName !== "CODE"
            )
              return NodeFilter.FILTER_ACCEPT
            return NodeFilter.FILTER_REJECT
          }
        )
        // first node is body and we are not interested in body

        let curnode = nodeIterator.nextNode()

        while (curnode != null) {
          re.lastIndex = 0
          if (
            curnode.parentNode.tagName !== "SCRIPT" &&
            curnode.parentNode.tagName !== "STYLE" &&
            re.test(curnode.nodeValue)
          ) {
            re.lastIndex = 0
            console.log("match")
            console.log(re)
            console.log(curnode)
            const prov = curnode
            curnode = nodeIterator.nextNode()
            const parent = prov.parentNode
            const str = prov.nodeValue

            let lastNode = prov
            let lastMatchEnd = -1
            for (const match of str.matchAll(re)) {
              console.log("getting to work")
              if (match.index - 1 >= lastMatchEnd + 1) {
                const newTextNode = document.createTextNode(
                  str.substring(lastMatchEnd + 1, match.index)
                )
                lastNode.after(newTextNode)
                lastNode = newTextNode
              }
              const matchElem = document.createElement("SPAN")
              matchElem.innerText = str.substring(
                match.index,
                match.index + match[0].length
              )
              matchElem.setAttribute("data-regexExtension", regId.toString())
              if (state == "ACTIVE")
                matchElem.setAttribute(
                  "style",
                  `background-color:${colorHexStr}`
                )
              lastNode.after(matchElem)
              lastNode = matchElem
              lastMatchEnd = match.index + match[0].length - 1
            }

            if (lastMatchEnd + 1 < str.length) {
              const newTextNode = document.createTextNode(
                str.substring(lastMatchEnd + 1, str.length)
              )
              lastNode.after(newTextNode)
              lastNode = newTextNode
            }
            parent.removeChild(prov)
          } else {
            curnode = nodeIterator.nextNode()
          }
        }
      }
    })
    return newExpression
  }

  async getExpressions(): RegexExpression[] {
    return this.expressions
  }

  async deleteExpression(id: number): RegexExpression {
    console.log("commanded to delete")
    console.log(id)
    console.log(this.expressions)
    await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      world: "MAIN",
      args: [id],
      func: (regId: number) => {
        for (const node of document.querySelectorAll(
          `[data-regexExtension="${regId}"]`
        )) {
          const newText = document.createTextNode(node.innerText)
          node.parentNode.replaceChild(newText, node)
        }
      }
    })
    console.log("will get error")
  }

  async activateExpression(id: number): RegexExpression {
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == id) {
        if (exp.status == "ACTIVE")
          throw Exception("[expression already active]")
        exp.status = "ACTIVE"
        await chrome.scripting.executeScript({
          target: { tabId: this.tabId },
          world: "MAIN",
          args: [id, exp.colorHexStr],
          func: (regId: number, colorHexStr) => {
            for (const node of document.querySelectorAll(
              `[data-regexExtension="${regId}"]`
            )) {
              node.setAttribute("style", `background-color:${colorHexStr}`)
            }
          }
        })
      }
    }
  }

  async deactivateExpression(id: number): RegexExpression {
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == id) {
        if (exp.status == "INACTIVE")
          throw Exception("[expression already inactive]")

        exp.status = "INACTIVE"

        await chrome.scripting.executeScript({
          target: { tabId: this.tabId },
          world: "MAIN",
          args: [id],
          func: (regId: number) => {
            for (const node of document.querySelectorAll(
              `[data-regexExtension="${regId}"]`
            )) {
              node.removeAttribute("style")
            }
          }
        })
      }
    }
  }

  async changeColor(id: string, colorHexStr: number): RegexExpression {
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == id) {
        exp.colorHexStr = colorHexStr

        if (exp.status == "ACTIVE")
          await chrome.scripting.executeScript({
            target: { tabId: this.tabId },
            world: "MAIN",
            args: [id, colorHexStr],
            func: (regId: number, colorHexStr) => {
              for (const node of document.querySelectorAll(
                `[data-regexExtension="${regId}"]`
              )) {
                node.setAttribute("style", `background-color:${colorHexStr}`)
              }
            }
          })
      }
    }
  }

  async getExpression(id: number): RegexExpression {
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == id) {
        return exp
      }
    }
    throw Exception("[id not found]")
  }

  async updateExpression(newExpression: RegexExpression): RegexExpression {
    // NOTE: the implementation for this is very "lazy", there might be more
    // efficient ways to do this
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == newExpression.id) {
        this.expressions[indx] = newExpression
        console.log("new expression added correctly")
        return newExpression
      }
    }
    throw Exception("[id not found]")
  }
}
