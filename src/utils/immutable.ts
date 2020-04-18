export const emptyArray: ReadonlyArray<any> = [];
export const emptyHash: Readonly<Object> = new Object(null);

Object.freeze(emptyArray);
Object.freeze(emptyHash)
