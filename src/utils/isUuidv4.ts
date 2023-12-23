function isUuidV4(str: string | undefined) {//判断是否为uuidv4
  if (!str) return false;
  const uuidV4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidV4Regex.test(str);
}
export default isUuidV4;