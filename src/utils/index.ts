export const parseToReadable = (value: number) => {
  if (value === 0.05) {
    return "5c";
  } else if (value === 0.1) {
    return "10c";
  } else if (value === 0.2) {
    return "20c";
  } else if (value === 0.5) {
    return "50c";
  } else {
    return `$${value}`;
  }
};
