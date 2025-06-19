# Schema Validation Library

A robust, type-safe validation library for JavaScript that helps you validate complex data structures with ease.

## Features

- Type-safe validation for primitive types (string, number, boolean, date)
- Complex type validation (objects and arrays)
- Chainable validation rules
- Custom error messages
- Optional field support
- Pattern matching for strings
- Comprehensive test coverage

## Installation

```bash
npm install
```

## Usage

```javascript
const { Schema } = require("./schema");

// Define a schema
const userSchema = Schema.object({
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
});

// Validate data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  isActive: true,
  tags: ["developer", "designer"],
};

const result = userSchema.validate(userData);
console.log(result); // { isValid: true, errors: [] }
```

## API Reference

### Primitive Validators

#### String Validator

- `string()` - Creates a string validator
- `minLength(n)` - Sets minimum length
- `maxLength(n)` - Sets maximum length
- `pattern(regex)` - Validates against a regular expression
- `optional()` - Makes the field optional

#### Number Validator

- `number()` - Creates a number validator
- `min(n)` - Sets minimum value
- `max(n)` - Sets maximum value
- `optional()` - Makes the field optional

#### Boolean Validator

- `boolean()` - Creates a boolean validator
- `optional()` - Makes the field optional

#### Date Validator

- `date()` - Creates a date validator
- `optional()` - Makes the field optional

### Complex Validators

#### Object Validator

- `object(schema)` - Creates an object validator with nested schema
- `optional()` - Makes the field optional

#### Array Validator

- `array(itemValidator)` - Creates an array validator with item validation
- `minLength(n)` - Sets minimum array length
- `maxLength(n)` - Sets maximum array length
- `optional()` - Makes the field optional

## Running Tests

```bash
npm test
```

## Test Coverage

To generate test coverage report:

```bash
npm run coverage
```

View the coverage report in `coverage/lcov-report/index.html`
