import {
  IRegexService,
  RegexExpression,
  RegexExpressionState
} from "./IRegexService.ts"

export class RegexService implements IRegexService {
  private nextId: number
  private expressions: RegexExpression[]
  private tabId: number

  constructor(tabId: number) {
    this.nextId = 0
    this.expressions = []
    this.tabId = tabId
  }

  async registerExpression(re: RegExp): RegexExpression {
    const newExpression: RegexExpression = {
      id: this.nextId,
      state: RegexExpressionState.Active,
      re: re
    }
    this.nextId += 1
    this.expressions.push(newExpression)
    await chrome.scripting.executeScript({
      target: { tabId: this.tabId },
      world: "MAIN",
      args: [re.toString(), newExpression.id],
      func: (reString: string, regId: number) => {
        reString = reString.slice(1)
        reString = reString.slice(0, -1)

        const re = RegExp(reString, "g")

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
          if (
            curnode.parentNode.tagName !== "SCRIPT" &&
            curnode.parentNode.tagName !== "STYLE" &&
            re.test(curnode.nodeValue)
          ) {
            // TODO: only highlight the substring of curnode.nodeValue that matches with the regex
            const prov = curnode
            curnode = nodeIterator.nextNode()

            const wrapper = document.createElement("SPAN")
            wrapper.innerHTML = `<span style="background-color:blue" data-regexExtension="${regId}">${prov.textContent}</span>`
            const parent = prov.parentNode

            parent.replaceChild(wrapper, prov)
          } else {
            curnode = nodeIterator.nextNode()
          }
        }
        // NOTE: walk the whole tree and each time you encounter a node with
        // a child that is Text then just replace it with higlighted text
        // iterate the matches to create new text node
      }
    })
    return newExpression
  }

  async getExpressions(): RegexExpression[] {
    return this.expressions
  }

  async deleteExpression(id: number): RegexExpression {
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == id) {
        this.expressions.splice(indx, 1)
        await chrome.scripting.executeScript({
          target: { tabId: this.tabId },
          world: "MAIN",
          args: [id],
          func: (regId: number) => {
            for (const node of document.querySelectorAll(
              `[data-regexExtension="${regId}"]`
            )) {
              const newText = document.createTextNode(node.innerText)
              node.parentNode.parentNode.replaceChild(newText, node.parentNode)
            }
          }
        })
      }
    }
    throw Exception("[id not found]")
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
