import {
    getFrameworkContent,
    getFrameworkName,
    EPageFramework,
} from "../../helpers/shared/Helpers/frameworkParametrization";
import { TMenuItem } from "../AppRouter/examples";
import { distance } from "fastest-levenshtein";

export type TSearchItem = {
    category: string;
    title: string;
    keywords: string;
    alsoKnownAs?: string;
    content?: string;
    link: string;
};

export const generateSearchItems = (allMenuItems: TMenuItem[], framework: EPageFramework) => {
    const searchItemsList: TSearchItem[] = [];
    allMenuItems.forEach((menuItem) => {
        menuItem.submenu.forEach((smItem) => {
            const smItemTitle = getFrameworkContent(smItem.title, framework);
            if (!searchItemsList.find((i) => i.title === smItemTitle)) {
                const subtitle = smItem.subtitle?.(getFrameworkName(framework));
                searchItemsList.push({
                    category: menuItem.title,
                    title: smItemTitle,
                    link: `/${framework}/${smItem.path}`,
                    keywords: smItem.metaKeywords,
                    alsoKnownAs: smItem.alsoKnownAs,
                    content: [
                        smItem.description,
                        typeof subtitle === "string" ? subtitle : "",
                        getFrameworkContent(smItem.metaDescription, framework),
                        getFrameworkContent(smItem.markdownContent, framework),
                    ].join(" "),
                });
            }
        });
    });
    return searchItemsList;
};

const normalizeSearchText = (text: string) =>
    text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

const allowedSearchEdits = (term: string) => Math.min(2, Math.floor(term.length / 3));

export const getTitleSearchParts = (title: string, query: string) => {
    const terms = normalizeSearchText(query).match(/[\p{L}\p{N}]+/gu) ?? [];
    const parts: { text: string; matched: boolean }[] = [];
    for (const token of title.split(/([\p{L}\p{M}\p{N}]+)/u)) {
        const word = normalizeSearchText(token);
        const matches = new Array<boolean>(word.length).fill(false);
        for (const term of terms) {
            if (word.includes(term)) {
                for (let start = word.indexOf(term); start !== -1; start = word.indexOf(term, start + 1)) {
                    matches.fill(true, start, start + term.length);
                }
            } else if (distance(term, word) <= allowedSearchEdits(term)) {
                matches.fill(true);
            }
        }
        // Map normalized matches back to the original spelling, including combining accents.
        let offset = 0;
        let matched = false;
        for (const char of token) {
            const length = normalizeSearchText(char).length;
            if (length) matched = matches.slice(offset, offset + length).some(Boolean);
            offset += length;
            const previous = parts[parts.length - 1];
            if (previous?.matched === matched) previous.text += char;
            else parts.push({ text: char, matched });
        }
    }
    return parts;
};

export const filterSearchItems = (items: TSearchItem[], query: string) => {
    const search = normalizeSearchText(query).trim();
    if (!search) return items;
    const terms = search.match(/[\p{L}\p{N}]+/gu) ?? [];
    if (!terms.length) return [];
    return items
        .map((item) => {
            const title = normalizeSearchText(item.title);
            const aliases = `${title} ${normalizeSearchText(item.alsoKnownAs ?? "")}`;
            const content = `${aliases} ${normalizeSearchText(item.content ?? "")} ${normalizeSearchText(
                item.keywords ?? ""
            )}`;
            // Rank by the first tier that contains every query word, then by match quality.
            for (const [tier, text] of [title, aliases, content].entries()) {
                const words = [...new Set(text.match(/[\p{L}\p{N}]+/gu) ?? [])];
                let score = 0;
                for (const term of terms) {
                    const edits = words.some((word) => word.includes(term))
                        ? 0
                        : Math.min(...words.map((word) => distance(term, word)));
                    if (edits > allowedSearchEdits(term)) {
                        score = Infinity;
                        break;
                    }
                    score += edits;
                }
                if (Number.isFinite(score)) {
                    return { item, tier, score: text === search ? -2 : text.includes(search) ? -1 : score };
                }
            }
            return { item, tier: Infinity, score: Infinity };
        })
        .filter(({ score }) => Number.isFinite(score))
        .sort((a, b) => a.tier - b.tier || a.score - b.score)
        .map(({ item }) => item);
};
