/**
 * An object containing all the data which is required for an HTTP response sent
 * out of this API.
 * @param {number} status The HTTP response code.
 * @param {string} message A user-friendly message explaining what happened
 * with the request. This should ALWAYS contain a relevant string. This string
 * will be returned to the client as `body.message`.
 * @param {object} additionalInfo An object containing any additional fields
 * to be included in the response body.
 */
exports.ApiResponse = function (status, message, additionalInfo = {}) {
  this.status = status;
  this.info = { ...additionalInfo, message };
};
