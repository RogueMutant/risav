export const firstLetterToUpperCase = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const nameInitials = (str: string | undefined): string => {
  if (str === undefined) {
    return "";
  }
  let newStr = str
    .split(" ")
    .map((word) => word.charAt(0))
    .join("");
  return newStr;
};
