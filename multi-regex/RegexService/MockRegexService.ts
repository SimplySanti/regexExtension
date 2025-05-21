/*
import {
  IRegexService,
  RegexExpression,
  RegexExpressionState
} from "./IRegexService.ts"

export class MockRegexService implements IRegexService {
  private nextId: number
  private expressions: RegexExpression[]

  constructor() {
    this.nextId = 0
    this.expressions = []
  }

  async registerExpression(re: RegExp): RegexExpression {
    const newExpression: RegexExpression = {
      id: this.nextId,
      state: RegexExpressionState.Active,
      re: re
    }
    this.nextId += 1
    this.expressions.push(newExpression)
    return newExpression
  }

  async getExpressions(): RegexExpression[] {
    return this.expressions
  }

  async deleteExpression(id: number): RegexExpression {
    for (const [indx, exp] of this.expressions.entries()) {
      if (exp.id == id) {
        this.expressions.splice(indx, 1)
        return
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
*/
