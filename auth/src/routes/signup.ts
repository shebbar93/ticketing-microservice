import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  (req: Request, res: Response) => {
    const erros = validationResult(req);

    if (!erros.isEmpty()) {
      throw new RequestValidationError(erros.array());
    }
    console.log("Creating the user");
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
