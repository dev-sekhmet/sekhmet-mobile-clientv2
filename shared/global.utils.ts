export const truncateText = (input: string, maxLength: number): string => {
    if (input.length > maxLength) {
        return `${input.substring(0, maxLength - 3)}...`; // "..." takes up 3 positions
    }
    return input;
}
