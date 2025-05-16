enum RegexExpressionState {
  Active,
  Inactive
}

type RegexExpression = {
  id: number
  state: RegexExpressionState
  re: RegExp
}

interface IRegexService {
  registerExpression(re: RegExp): RegexExpression
  getExpressions(): RegexExpression[]
  deleteExpression(id: number): RegexExpression
  getExpression(id: number): RegexExpression
  updateExpression(newExpression: RegexExpression): RegexExpression
}

export { RegexExpressionState, RegexExpression, IRegexService }
