const Ajv = require('ajv');

const ajv = new Ajv({
    allErrors: true,
    $data: true,
    jsonPointers: true
});

require('ajv-errors')(ajv);

const warningSchema = {
    type: "object",
    properties: {
        A: {
            allOf: [{
                not: {
                    const: 0
                },
                errorMessage: 'A sollte nicht 0 sein'
            }, {
                "exclusiveMaximum": 90000,
                errorMessage: 'A sollte nicht größer gleich als 90000 sein'
            }]
        }
    },
    "allOf": [{
        if: {
            properties: {
                A: {
                    minimum: 5000
                },
            }
        },
        then: {
            properties: {
                B: {
                    exclusiveMinimum: { "$data": "1/A" }
                },
            }
        },
        errorMessage: 'Wenn A >= 5000 darf B nicht <= A',
    }],
}

const errorSchema = {
    type: "object",
    properties: {
        A: {
            type: 'number',
            allOf: [{
                "exclusiveMaximum": 99999,
                errorMessage: 'A darf nicht größer gleich als 99999 sein'
            }],
        },
        B: {
            type: 'number',
        },
    },
    "allOf": [{
        if: {
            properties: {
                A: {
                    minimum: 5000
                },
            }
        },
        then: {
            properties: {
                B: {
                    exclusiveMinimum: 0
                },
            }
        },
        errorMessage: 'Wenn A >= 5000 darf B nicht <= 0',
    }],
    required: ["A", "B"]
};


const data = {
    A: 0,
    B: -20
};

const warningValidator = ajv.compile(warningSchema);
const errorValidator = ajv.compile(errorSchema);

warningValidator(data);
errorValidator(data);

console.log(warningValidator.errors);
console.log(errorValidator.errors);