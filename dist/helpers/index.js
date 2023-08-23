"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateIfEmpty = exports.validateEmailFormat = void 0;
/**
 * Validates an email address based on a regular expression pattern.
 *
 * @param {string} email - The email address to be validated.
 * @return {boolean} True if the email address format is valid, otherwise false.
 */
const validateEmailFormat = (email) => {
    let regex = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}");
    return regex.test(email);
};
exports.validateEmailFormat = validateEmailFormat;
/**
 * Validates if all fields in the provided object are not empty.
 *
 * @param {Object.<string, any>} fields - An object containing fields to be validated.
 * @return {Object} An object containing validation results.
 * @property {boolean} valid - True if all fields are non-empty, otherwise false.
 * @property {string[]} fields - An array of field names with empty values.
 */
const validateIfEmpty = (fields) => {
    var _a, _b, _c, _d, _e;
    return {
        valid: ((_c = (_b = (_a = Object.keys(fields)) === null || _a === void 0 ? void 0 : _a.filter) === null || _b === void 0 ? void 0 : _b.call(_a, (field) => !!fields[field])) === null || _c === void 0 ? void 0 : _c.length) ===
            Object.keys(fields).length,
        fields: (_e = (_d = Object.keys(fields)) === null || _d === void 0 ? void 0 : _d.filter) === null || _e === void 0 ? void 0 : _e.call(_d, (field) => !fields[field]),
    };
};
exports.validateIfEmpty = validateIfEmpty;
// The possible validation methods are:
//     minLength <int> - If the password is below this value
//     maxLength <int> - If the password is above this value
//     regex <RegExp>  - If the password does not match this regular expression
// All validation methods support an ErrorMessage parameter.
const passwordValidDefinition = [
    {
        minLength: 6,
        ErrorMessage: "Your password must be at least six characters long.",
    },
    {
        maxLength: 50,
        ErrorMessage: "Your password cannot be longer than 50 characters.",
    },
    {
        regex: /.*\d/,
        ErrorMessage: "Your password must contain at least one digit.",
    },
    {
        regex: /.*[a-zA-Z]/,
        ErrorMessage: "Your password must contain at least one letter.",
    },
    {
        regex: /.*[!@#$%^&*() =+_-]/,
        ErrorMessage: "Your password must contain at least one symbol in this list !@#$%^&*()=+_- or a space.",
    },
];
/**
 * Validates the provided password and confirmation password using a set of validation rules.
 *
 * @param {string} password - The password to be validated.
 * @param {string} confirmPassword - The confirmation password (must match the password).
 * @return {object} An object indicating whether the password passed all validation tests and any associated error messages.
 * @property {boolean} valid - True if the password passed all validation tests, otherwise false.
 * @property {string[]} data - An array of error messages describing validation failures.
 */
const validatePassword = (password, confirmPassword) => {
    const errors = [];
    // Check if the password and confirmation password match.
    if (password !== confirmPassword) {
        errors.push("The confirmation password does not match.");
    }
    // Iterate through each validator in passwordValidDefinition.
    for (var i = 0; i < passwordValidDefinition.length; i++) {
        var validator = passwordValidDefinition[i];
        var valid = true;
        // Check if the validator includes a regular expression requirement.
        if (validator.hasOwnProperty("regex")) {
            if (password.search(validator.regex) < 0)
                valid = false;
        }
        // Check if the validator specifies a minimum password length.
        if (validator.hasOwnProperty("minLength")) {
            if (password.length < validator.minLength)
                valid = false;
        }
        // Check if the validator specifies a maximum password length.
        if (validator.hasOwnProperty("maxLength")) {
            if (password.length > validator.maxLength)
                valid = false;
        }
        // If validation fails for a specific rule, add the associated error message.
        if (!valid)
            errors.push(validator.ErrorMessage);
    }
    // If there are errors, return an object indicating validation failure.
    if (errors.length > 0) {
        return { valid: false, data: errors };
    }
    // If there are no errors, return an object indicating validation success.
    return { valid: true, data: [] };
};
exports.validatePassword = validatePassword;
//# sourceMappingURL=index.js.map