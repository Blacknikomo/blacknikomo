export const emptyArray: ReadonlyArray<any> = [];
export const emptyHash: Readonly<Record<string, any>> = new Object(null);

Object.freeze(emptyArray);
Object.freeze(emptyHash);
