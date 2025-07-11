const { v4: uuidv4 } = require("uuid");

exports.generateOrderCode = () => {
  const uuid = uuidv4().split("-")[0].toUpperCase();
  return `OD-${uuid}`;
};
