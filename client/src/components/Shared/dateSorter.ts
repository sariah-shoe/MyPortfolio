import type { ExperienceObject, ProjectObject } from "./types";

// Helper to pick date for sorting
export const getSortDate = (card: ProjectObject | ExperienceObject) => {
    let raw: number;
    if(card.endDate){
        raw = new Date(card.endDate).getTime();
    } else {
        raw = new Date().getTime();
    }
    return raw ? new Date(raw).getTime() : 0;
}