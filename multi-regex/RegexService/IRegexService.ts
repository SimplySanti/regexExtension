export type RegexExpression = {
  id: number
  state: RegexExpressionState
  restr: string
  colorHexStr: string
}

export interface IRegexService {
  registerExpression(
    state: "ACTIVE" | "INACTIVE",
    restr: string,
    colorHexStr: string
  ): Promise<RegexExpression>

  getExpression(id: number): Promise<RegexExpression>
  getExpressions(): Promise<RegexExpression[]>

  updateExpression(newExpression: RegexExpression): Promise<RegexExpression>

  deleteExpression(id: number): Promise<RegexExpression>
}
