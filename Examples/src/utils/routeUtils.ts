/**
 * Tests if the current browser route starts with a specific word, ignoring leading/trailing slashes
 * @param word The word to check for at the start of the current route
 * @returns boolean indicating if the current route starts with the word
 * @example
 * // If current URL is "/examples/chart"
 * routeStartsWith("examples") // returns true
 *
 * // If current URL is "/other/path"
 * routeStartsWith("examples") // returns false
 */
export function routeStartsWith(word: string): boolean {
    // Get current route from window location
    const currentRoute = window.location.pathname;

    // Remove leading and trailing slashes and split into segments
    const segments = currentRoute.replace(/^\/+|\/+$/g, "").split("/");

    // Check if the first segment matches the word
    return segments[0] === word;
}
