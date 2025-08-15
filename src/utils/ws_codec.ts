export const binToString = (bin: Uint8Array): string =>
  String.fromCharCode(...bin);

export const stringToBin = (str: string): Uint8Array =>
  Uint8Array.from(str.split('').map((char) => char.charCodeAt(0)));
