/**
 * Base class for all validators
 */
class Validator {
  constructor() {
    this._isOptional = false;
    this._customMessage = "";
  }

  /**
   * Makes the field optional
   * @returns {Validator} The validator instance
   */
  optional() {
    this._isOptional = true;
    return this;
  }

  /**
   * Sets a custom error message
   * @param {string} message - The custom error message
   * @returns {Validator} The validator instance
   */
  withMessage(message) {
    this._customMessage = message;
    return this;
  }
}

/**
 * String validator with various string-specific validation rules
 */
class StringValidator extends Validator {
  constructor() {
    super();
    this._minLength = null;
    this._maxLength = null;
    this._pattern = null;
  }

  /**
   * Sets minimum length requirement
   * @param {number} length - The minimum length
   * @returns {StringValidator} The validator instance
   */
  minLength(length) {
    this._minLength = length;
    return this;
  }

  /**
   * Sets maximum length requirement
   * @param {number} length - The maximum length
   * @returns {StringValidator} The validator instance
   */
  maxLength(length) {
    this._maxLength = length;
    return this;
  }

  /**
   * Sets a regex pattern requirement
   * @param {RegExp} regex - The regular expression to test against
   * @returns {StringValidator} The validator instance
   */
  pattern(regex) {
    this._pattern = regex;
    return this;
  }

  /**
   * Validates a string value
   * @param {*} value - The value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    if (value === undefined || value === null) {
      return {
        isValid: this._isOptional,
        errors: this._isOptional ? [] : ["Value is required"],
      };
    }

    if (typeof value !== "string") {
      return {
        isValid: false,
        errors: [this._customMessage || "Value must be a string"],
      };
    }

    const errors = [];

    if (this._minLength !== null && value.length < this._minLength) {
      errors.push(
        this._customMessage || `Minimum length is ${this._minLength}`
      );
    }

    if (this._maxLength !== null && value.length > this._maxLength) {
      errors.push(
        this._customMessage || `Maximum length is ${this._maxLength}`
      );
    }

    if (this._pattern !== null && !this._pattern.test(value)) {
      errors.push(this._customMessage || "Value does not match pattern");
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Number validator with various number-specific validation rules
 */
class NumberValidator extends Validator {
  constructor() {
    super();
    this._min = null;
    this._max = null;
  }

  /**
   * Sets minimum value requirement
   * @param {number} value - The minimum value
   * @returns {NumberValidator} The validator instance
   */
  min(value) {
    this._min = value;
    return this;
  }

  /**
   * Sets maximum value requirement
   * @param {number} value - The maximum value
   * @returns {NumberValidator} The validator instance
   */
  max(value) {
    this._max = value;
    return this;
  }

  /**
   * Validates a number value
   * @param {*} value - The value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    if (value === undefined || value === null) {
      return {
        isValid: this._isOptional,
        errors: this._isOptional ? [] : ["Value is required"],
      };
    }

    if (typeof value !== "number" || isNaN(value)) {
      return {
        isValid: false,
        errors: [this._customMessage || "Value must be a number"],
      };
    }

    const errors = [];

    if (this._min !== null && value < this._min) {
      errors.push(`Minimum value is ${this._min}`);
    }

    if (this._max !== null && value > this._max) {
      errors.push(`Maximum value is ${this._max}`);
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Boolean validator
 */
class BooleanValidator extends Validator {
  /**
   * Validates a boolean value
   * @param {*} value - The value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    if (value === undefined || value === null) {
      return {
        isValid: this._isOptional,
        errors: this._isOptional ? [] : ["Value is required"],
      };
    }

    if (typeof value !== "boolean") {
      return {
        isValid: false,
        errors: [this._customMessage || "Value must be a boolean"],
      };
    }

    return { isValid: true, errors: [] };
  }
}

/**
 * Date validator
 */
class DateValidator extends Validator {
  /**
   * Validates a date value
   * @param {*} value - The value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    if (value === undefined || value === null) {
      return {
        isValid: this._isOptional,
        errors: this._isOptional ? [] : ["Value is required"],
      };
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        errors: [this._customMessage || "Value must be a valid date"],
      };
    }

    return { isValid: true, errors: [] };
  }
}

/**
 * Array validator with item validation
 */
class ArrayValidator extends Validator {
  /**
   * @param {Validator} itemValidator - Validator for array items
   */
  constructor(itemValidator) {
    super();
    this._itemValidator = itemValidator;
    this._minLength = null;
    this._maxLength = null;
  }

  /**
   * Sets minimum length requirement
   * @param {number} length - The minimum length
   * @returns {ArrayValidator} The validator instance
   */
  minLength(length) {
    this._minLength = length;
    return this;
  }

  /**
   * Sets maximum length requirement
   * @param {number} length - The maximum length
   * @returns {ArrayValidator} The validator instance
   */
  maxLength(length) {
    this._maxLength = length;
    return this;
  }

  /**
   * Validates an array value
   * @param {*} value - The value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    if (value === undefined || value === null) {
      return {
        isValid: this._isOptional,
        errors: this._isOptional ? [] : ["Value is required"],
      };
    }

    if (!Array.isArray(value)) {
      return {
        isValid: false,
        errors: [this._customMessage || "Value must be an array"],
      };
    }

    const errors = [];

    if (this._minLength !== null && value.length < this._minLength) {
      errors.push(`Minimum length is ${this._minLength}`);
    }

    if (this._maxLength !== null && value.length > this._maxLength) {
      errors.push(`Maximum length is ${this._maxLength}`);
    }

    for (let i = 0; i < value.length; i++) {
      const itemResult = this._itemValidator.validate(value[i]);
      if (!itemResult.isValid) {
        errors.push(
          `Item at index ${i} is invalid: ${itemResult.errors.join(", ")}`
        );
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Object validator with schema validation
 */
class ObjectValidator extends Validator {
  /**
   * @param {Object} schema - Schema object containing validators
   */
  constructor(schema) {
    super();
    this._schema = schema;
  }

  /**
   * Validates an object value
   * @param {*} value - The value to validate
   * @returns {Object} Validation result
   */
  validate(value) {
    if (value === undefined || value === null) {
      return {
        isValid: this._isOptional,
        errors: this._isOptional ? [] : ["Value is required"],
      };
    }

    if (typeof value !== "object" || Array.isArray(value)) {
      return {
        isValid: false,
        errors: [this._customMessage || "Value must be an object"],
      };
    }

    const errors = [];
    const schemaKeys = Object.keys(this._schema);

    for (const key of schemaKeys) {
      const validator = this._schema[key];
      const fieldValue = value[key];
      const result = validator.validate(fieldValue);

      if (!result.isValid) {
        errors.push(`${key}: ${result.errors.join(", ")}`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }
}

/**
 * Schema builder class for creating validators
 */
class Schema {
  /**
   * Creates a string validator
   * @returns {StringValidator} A new string validator
   */
  static string() {
    return new StringValidator();
  }

  /**
   * Creates a number validator
   * @returns {NumberValidator} A new number validator
   */
  static number() {
    return new NumberValidator();
  }

  /**
   * Creates a boolean validator
   * @returns {BooleanValidator} A new boolean validator
   */
  static boolean() {
    return new BooleanValidator();
  }

  /**
   * Creates a date validator
   * @returns {DateValidator} A new date validator
   */
  static date() {
    return new DateValidator();
  }

  /**
   * Creates an object validator
   * @param {Object} schema - Schema object containing validators
   * @returns {ObjectValidator} A new object validator
   */
  static object(schema) {
    return new ObjectValidator(schema);
  }

  /**
   * Creates an array validator
   * @param {Validator} itemValidator - Validator for array items
   * @returns {ArrayValidator} A new array validator
   */
  static array(itemValidator) {
    return new ArrayValidator(itemValidator);
  }
}

module.exports = { Schema };
