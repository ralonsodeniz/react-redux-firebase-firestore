export const createRandomId = idLength => {
  const charSet = "ABCDEFGHIJKLMNOPQRSTWXYZabcdefghijklmnopqrstwxyz0123456789";
  let id = "";
  for (let i = 0; i < idLength; i++) {
    // in this case we dont need to +1 the charSet.length since charAt starts at 0 index and .length starts at 1 so we already have the +1 automatically
    id += charSet.charAt(Math.floor(Math.random() * charSet.length));
  }
  return id;
};

// recursive function that calls itself until the id generated does not exist inside an object
export const assignNewIdToItem = (
  objectContainingItem,
  idGenerator,
  idLength
) => {
  let id = idGenerator(idLength);
  if (Array.isArray(objectContainingItem))
    return objectContainingItem.find(element => element.id === id)
      ? assignNewIdToItem(objectContainingItem, idGenerator, idLength)
      : id;
  if (typeof objectContainingItem === "object")
    return objectContainingItem[id]
      ? assignNewIdToItem(objectContainingItem, idGenerator, idLength)
      : id;
};
