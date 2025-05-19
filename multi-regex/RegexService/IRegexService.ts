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
  registerExpression(re: RegExp): Promise<RegexExpression>
  getExpressions(): Promise<RegexExpression[]>
  deleteExpression(id: number): Promise<RegexExpression>
  getExpression(id: number): Promise<RegexExpression>
  updateExpression(newExpression: RegexExpression): Promise<RegexExpression>
}

export { RegexExpressionState, RegexExpression, IRegexService }
