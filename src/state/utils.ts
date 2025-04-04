import { ResponseData } from "@/interfaces/response";
import { LoroDoc, LoroList } from "loro-crdt";

export const getResponsesList = (doc: LoroDoc): LoroList<ResponseData> => doc.getList('responses') as LoroList<ResponseData>;
