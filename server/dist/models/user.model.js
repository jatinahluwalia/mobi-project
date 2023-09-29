"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    hashedPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
}, { timestamps: true });
userSchema.statics.signup = function ({ fullName, email, password, phone, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!validator_1.default.isEmail(email)) {
            throw new Error("Please enter a valid email");
        }
        const emailExists = yield this.findOne({ email });
        if (emailExists) {
            throw new Error("Email already exists.");
        }
        if (!validator_1.default.isStrongPassword(password)) {
            throw new Error("Please enter a strong password");
        }
        if (!validator_1.default.isMobilePhone(phone)) {
            throw new Error("Please enter valid mobile number");
        }
        if (!validator_1.default.isAlpha(fullName)) {
            throw new Error("Please enter valid name");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        yield this.create({
            fullName,
            email,
            hashedPassword,
            phone,
        });
        return { message: "Signed up successfully" };
    });
};
userSchema.statics.login = function (email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email) {
            throw new Error("Email field cannot be empty");
        }
        if (!password) {
            throw new Error("Password field cannot be empty");
        }
        const user = yield this.findOne({ email });
        if (!user) {
            throw new Error("User does not exist");
        }
        const { hashedPassword, _id } = user["_doc"];
        const matched = yield bcrypt_1.default.compare(password, hashedPassword);
        if (!matched) {
            throw new Error("Incorrect password.");
        }
        const token = jsonwebtoken_1.default.sign({ _id: _id.toString() }, process.env.JWT_SECRET || "uirbvvubvuebuebu", {
            expiresIn: "1d",
        });
        return { _id, token };
    });
};
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
