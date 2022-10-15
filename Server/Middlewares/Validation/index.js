import { body, validationResult } from 'express-validator';

function loginValidation() {
    return [
        body("email", "Email is Required").isEmail(),
        body("password", "Password is Required").notEmpty(),
    ]
}

function userRegisterValidatorRules() {
    return [
        body("firstname", "First Name is Required").notEmpty().isLength({ min: 2 }),
        body("lastname", "Last Name is Required / Min 2 Characters").notEmpty().isLength({ min: 2 }),
        body("email", "Email is Required").isEmail(),
        body("password", "Password should be Min 8 Characters, Atleast 1 Uppercase, 1 Lowercase, 1 Number, 1 Special Character")
            .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
        body("password2").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password & Confirm Password do not match");
            }
            else {
                return true;
            }
        }),
        body("phone", "Mobile Number is Required").isMobilePhone(),
        body("campuslead", "Are You a Campus Lead?").notEmpty(),
    ]
}

function componentValidation() {
    return [
        body("componentName", "Component is Required").isString({ min : 2 }),
        body("description", "Descrption is Required").isString({ min : 6 }),
        body("buyingPrice", "Buying Price is Required").isString({ min : 2 }),
        body("sellingPrice", "Selling Price is Required").isString({ min : 2 }),
        body("source", "Source is Required").isString({ min : 2 }),
        body("total", "Total is Required").notEmpty({ min : 2 }),
        body("available", "Available is Required").notEmpty({ min : 2 }),
        body("date", "Date is Required").notEmpty({ min : 2 }),
        // body("photo", "Photo is Required").multer()
    ]
}

function componentEditValidation()  {
    return [
        body("componentName", "Component name is required").isString({ min : 2 }),
        body("total", "Total is Required").notEmpty({ min : 2 }),
        body("available", "Available is Required").notEmpty({ min : 2 }),
    ]
}

function errorMiddleware(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

export {
    loginValidation,
    userRegisterValidatorRules,
    componentValidation,
    componentEditValidation,
    errorMiddleware
}