export const flattenBms = (bms) => {
  const result = [];
  for (const bm of bms) {
    result.push(bm);

    if (bm.children) result.push(...flattenBms(bm.children));
  }
  return result;
};
