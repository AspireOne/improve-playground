export const genRandomId = () => {
  return (
    Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  );
};

export const log = (message, ...optionalParams) => {
  console.log(
    `%c[Playground Enhancer] ${message}`,
    "color: lightgreen; font-weight: bold",
    ...optionalParams,
  );
};

export const logErr = (message, ...optionalParams) => {
  console.error(
    `%c[Playground Enhancer] ${message}`,
    "color: red; font-weight: bold",
    ...optionalParams,
  );
};

export const logWarn = (message, ...optionalParams) => {
  console.warn(
    `%c[Playground Enhancer] ${message}`,
    "color: orange; font-weight: bold",
    ...optionalParams,
  );
};
