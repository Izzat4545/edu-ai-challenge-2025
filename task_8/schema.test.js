const { Schema } = require("./schema");

describe("Schema Validation Library", () => {
  describe("StringValidator", () => {
    test("validates required string", () => {
      const validator = Schema.string();
      expect(validator.validate("test")).toEqual({ isValid: true, errors: [] });
      expect(validator.validate(null)).toEqual({
        isValid: false,
        errors: ["Value is required"],
      });
      expect(validator.validate(123)).toEqual({
        isValid: false,
        errors: ["Value must be a string"],
      });
    });

    test("validates optional string", () => {
      const validator = Schema.string().optional();
      expect(validator.validate(null)).toEqual({ isValid: true, errors: [] });
      expect(validator.validate("test")).toEqual({ isValid: true, errors: [] });
    });

    test("validates string length", () => {
      const validator = Schema.string().minLength(2).maxLength(5);
      expect(validator.validate("abc")).toEqual({ isValid: true, errors: [] });
      expect(validator.validate("a")).toEqual({
        isValid: false,
        errors: ["Minimum length is 2"],
      });
      expect(validator.validate("abcdef")).toEqual({
        isValid: false,
        errors: ["Maximum length is 5"],
      });
    });

    test("validates string pattern", () => {
      const validator = Schema.string().pattern(/^[A-Z]+$/);
      expect(validator.validate("ABC")).toEqual({ isValid: true, errors: [] });
      expect(validator.validate("abc")).toEqual({
        isValid: false,
        errors: ["Value does not match pattern"],
      });
    });
  });

  describe("NumberValidator", () => {
    test("validates required number", () => {
      const validator = Schema.number();
      expect(validator.validate(123)).toEqual({ isValid: true, errors: [] });
      expect(validator.validate(null)).toEqual({
        isValid: false,
        errors: ["Value is required"],
      });
      expect(validator.validate("123")).toEqual({
        isValid: false,
        errors: ["Value must be a number"],
      });
    });

    test("validates number range", () => {
      const validator = Schema.number().min(0).max(100);
      expect(validator.validate(50)).toEqual({ isValid: true, errors: [] });
      expect(validator.validate(-1)).toEqual({
        isValid: false,
        errors: ["Minimum value is 0"],
      });
      expect(validator.validate(101)).toEqual({
        isValid: false,
        errors: ["Maximum value is 100"],
      });
    });
  });

  describe("BooleanValidator", () => {
    test("validates boolean", () => {
      const validator = Schema.boolean();
      expect(validator.validate(true)).toEqual({ isValid: true, errors: [] });
      expect(validator.validate(false)).toEqual({ isValid: true, errors: [] });
      expect(validator.validate("true")).toEqual({
        isValid: false,
        errors: ["Value must be a boolean"],
      });
    });
  });

  describe("DateValidator", () => {
    test("validates date", () => {
      const validator = Schema.date();
      expect(validator.validate(new Date())).toEqual({
        isValid: true,
        errors: [],
      });
      expect(validator.validate("2023-01-01")).toEqual({
        isValid: true,
        errors: [],
      });
      expect(validator.validate("invalid-date")).toEqual({
        isValid: false,
        errors: ["Value must be a valid date"],
      });
    });
  });

  describe("ArrayValidator", () => {
    test("validates array of strings", () => {
      const validator = Schema.array(Schema.string());
      expect(validator.validate(["a", "b"])).toEqual({
        isValid: true,
        errors: [],
      });
      expect(validator.validate([1, 2])).toEqual({
        isValid: false,
        errors: [
          "Item at index 0 is invalid: Value must be a string",
          "Item at index 1 is invalid: Value must be a string",
        ],
      });
    });

    test("validates array length", () => {
      const validator = Schema.array(Schema.string()).minLength(2).maxLength(3);
      expect(validator.validate(["a", "b"])).toEqual({
        isValid: true,
        errors: [],
      });
      expect(validator.validate(["a"])).toEqual({
        isValid: false,
        errors: ["Minimum length is 2"],
      });
      expect(validator.validate(["a", "b", "c", "d"])).toEqual({
        isValid: false,
        errors: ["Maximum length is 3"],
      });
    });
  });

  describe("ObjectValidator", () => {
    test("validates object schema", () => {
      const validator = Schema.object({
        name: Schema.string().minLength(2),
        age: Schema.number().min(0),
        email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        isActive: Schema.boolean(),
      });

      expect(
        validator.validate({
          name: "John",
          age: 30,
          email: "john@example.com",
          isActive: true,
        })
      ).toEqual({ isValid: true, errors: [] });

      expect(
        validator.validate({
          name: "J",
          age: -1,
          email: "invalid-email",
          isActive: "true",
        })
      ).toEqual({
        isValid: false,
        errors: [
          "name: Minimum length is 2",
          "age: Minimum value is 0",
          "email: Value does not match pattern",
          "isActive: Value must be a boolean",
        ],
      });
    });

    test("validates nested objects", () => {
      const addressSchema = Schema.object({
        street: Schema.string(),
        city: Schema.string(),
      });

      const userSchema = Schema.object({
        name: Schema.string(),
        address: addressSchema,
      });

      expect(
        userSchema.validate({
          name: "John",
          address: {
            street: "Main St",
            city: "New York",
          },
        })
      ).toEqual({ isValid: true, errors: [] });

      expect(
        userSchema.validate({
          name: "John",
          address: {
            street: 123,
            city: null,
          },
        })
      ).toEqual({
        isValid: false,
        errors: [
          "address: street: Value must be a string, city: Value is required",
        ],
      });
    });
  });

  describe("Custom Messages", () => {
    test("uses custom error messages", () => {
      const validator = Schema.string()
        .minLength(5)
        .withMessage("Name is too short");

      expect(validator.validate("abc")).toEqual({
        isValid: false,
        errors: ["Name is too short"],
      });
    });
  });
});
