import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generic function to arrange a list of objects (that have id and parentId) into a hierarchy
export function separateListIntoLevels<
  T extends { id?: string | undefined; parentId?: string | null },
>(items: T[]): { level: number; items: T[] }[] {
  const hierarchyMap: {
    [parentId: string]: T[];
  } = {};

  // Group items by parentId
  for (const type of items) {
    const parentId = type.parentId || "";
    if (!hierarchyMap[parentId]) {
      hierarchyMap[parentId] = [];
    }
    hierarchyMap[parentId]?.push(type);
  }

  // Create a unified array for each hierarchy level
  const result: {
    level: number;
    items: T[];
  }[] = [];

  function processHierarchyLevel(parentId: string, level: number) {
    const levelItems = hierarchyMap[parentId] || [];
    if (levelItems.length === 0) {
      return;
    }

    for (const levelItem of levelItems) {
      result[level] = result[level] || { level, items: [] };
      result[level]?.items.push(levelItem);
      processHierarchyLevel(levelItem.id ?? "", level + 1);
    }
  }

  processHierarchyLevel("", 0);
  return result;
}
