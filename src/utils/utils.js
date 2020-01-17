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

export const makeDate = (date, full) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const hour = date.getHours() <= 9 ? `0${date.getHours()}` : date.getHours();

  const minutes =
    date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();

  const seconds =
    date.getSeconds() <= 9 ? `0${date.getSeconds()}` : date.getSeconds();

  const day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate();

  const month =
    date.getMonth() <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  const composedDate = full
    ? `${days[date.getDay()]} ${
        months[date.getMonth()]
      } ${day} ${date.getFullYear()} ${hour}:${minutes}:${seconds}`
    : `${date.getFullYear()}${month}${day}${hour}${minutes}${seconds}`;

  return composedDate;
};
