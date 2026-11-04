import { getFrameworkContent, EPageFramework } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TMenuItem } from "../AppRouter/examples";
import { distance } from "fastest-levenshtein";

export type TSearchItem = {
    category: string;
    title: string;
    keywords: string;
    link: string;
};

export const generateSearchItems = (allMenuItems: TMenuItem[], framework: EPageFramework) => {
    const searchItemsList: TSearchItem[] = [];
    allMenuItems.forEach((menuItem) => {
        menuItem.submenu.forEach((smItem) => {
            const smItemTitle = getFrameworkContent(smItem.title, framework);
            if (!searchItemsList.find((i) => i.title === smItemTitle)) {
                searchItemsList.push({
                    category: menuItem.title,
                    title: smItemTitle,
                    link: `/${framework}/${smItem.path}`,
                    keywords: smItem.metaKeywords,
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

export const filterSearchItems = (items: TSearchItem[], query: string) => {
    const search = normalizeSearchText(query).trim();
    if (!search) return items;
    const terms = search.match(/[\p{L}\p{N}]+/gu) ?? [];
    if (!terms.length) return [];
    return items
        .map((item) => {
            const title = normalizeSearchText(item.title);
            const words = title.match(/[\p{L}\p{N}]+/gu) ?? [];
            let score = 0;
            for (const term of terms) {
                const edits = Math.min(...words.map((word) => (word.includes(term) ? 0 : distance(term, word))));
                if (edits > Math.min(2, Math.floor(term.length / 3))) return { item, score: Infinity };
                score += edits;
            }
            return { item, score: title === search ? -2 : title.includes(search) ? -1 : score };
        })
        .filter(({ score }) => Number.isFinite(score))
        .sort((a, b) => a.score - b.score)
        .map(({ item }) => item);
};
