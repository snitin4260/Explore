let name = "user";
export const getUsernameLs = _ => {
  return JSON.parse(localStorage.getItem(name));
};

export const clearUsername = _ => {
  localStorage.removeItem(name);
};
