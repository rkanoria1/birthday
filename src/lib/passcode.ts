export function isPasscodeCorrect(input: string, expected: string): boolean {
  return input.length === expected.length && input === expected
}
