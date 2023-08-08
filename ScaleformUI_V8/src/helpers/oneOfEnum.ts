export const isOneOfEnum = <T extends number, E extends { [k: string]: T }>(
    icon: E[keyof E],
    possibleValues: E[keyof E][]
): boolean => possibleValues.includes(icon)