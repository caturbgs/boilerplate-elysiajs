/**
 * Parsing query params plts into array of plts.
 * @param param string
 * @return array of string
 */
export const parseQueryParamPlts = (param: string) => {
  if (param.includes("[") || param.includes("]")) {
    return param.replace(/[\[\]']+/g, "").split(",");
  }
  return param.split(",");
};
