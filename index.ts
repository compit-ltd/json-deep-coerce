type Parser<T> = (val: any) => T;
type MappingObject = {
  [key: string]: Parser<any>;
};

export const empty = (obj: unknown): boolean => obj === undefined || obj === null;
export const intParser: Parser<number> = (val) => empty(val) ? val : Number(val);
export const floatParser: Parser<number> = (val) => empty(val) ? val : parseFloat(val.toString());
export const boolParser: Parser<boolean> = (val) => empty(val) ? val : !!val;
export const stringParser: Parser<string> = (val) => empty(val) ? val : val.toString();
export function arrParser<T>(itemParser: Parser<T>): Parser<T[]> {
  return (val: unknown[]): T[] => (empty(val) || !val.length) ? val as T[] : val.map(itemParser);
}

export function objectParser<T>(mapperObj: MappingObject): Parser<unknown> {
  const mapperMap = new Map(Object.entries(mapperObj));

  return (val: object): unknown => {
    if (empty(val))
      return val;

    const newObj = {};
    return Object.entries(val).reduce((accu, [entryKey, entryVal]) => {
      if (mapperMap.has(entryKey)) {
        const currMapper = mapperMap.get(entryKey) as Parser<any>;
        Object.assign(accu, { [entryKey]: currMapper(entryVal) });
      }
      // else {
      //   console.error(`Missing mapper for Path: ${entryKey}`);
      // }
      return accu;
    }, newObj);
  };
}
