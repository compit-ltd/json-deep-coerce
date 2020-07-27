type Parser<T> = (val: any) => T;
type MappingObject = {
  [key: string]: Parser<any>;
};

export const empty = (obj: unknown): boolean => obj === undefined || obj === null;
export const isValidDate = (date: Date) => date.toString() !== "Invalid Date";
export const intParser: Parser<number> = (val) => {
  if (empty(val)) return val;
  if (val === '') return undefined;
  else {
    const num = Number(val);
    if (isNaN(num)) return null;
    return Math.trunc(num);
  };
};
export const floatParser: Parser<number> = (val) => {
  if (empty(val)) return val;
  if (val === '') return undefined;
  else {
    const num = parseFloat(val.toString());
    if (isNaN(num)) return null;
    return num;
  };
}
export const boolParser: Parser<boolean> = (val) => {
  if (empty(val)) return val;
  if (typeof val === 'string') {
    const formatted = val.toLowerCase().trim();
    if (formatted === 'null' || formatted === 'undefined') return undefined;
    return formatted === 'true' || formatted === '1';
  }
  const bool = Boolean(val);
  return bool;
};

export const dateParser: Parser<boolean> = (val) => {
  if (empty(val)) return val;

  const date = new Date(val);
  return isValidDate(date) ? date : undefined;
};

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
