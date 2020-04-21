const convertSentenceCase = (str) => {
  return str.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());
};

module.exports = convertSentenceCase;
