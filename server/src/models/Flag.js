import mongoose from "mongoose";
import { ENVIRONMENTS, FLAG_TYPES } from "../constants.js";

const envSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    rollout: {
      type: Number,
      default: 0,
      min: [0, "Rollout can't be below 0%."],
      max: [100, "Rollout can't be above 100%."],
      validate: { validator: Number.isInteger, message: "Rollout must be a whole number." },
    },
  },
  { _id: false }
);

const flagSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required."], trim: true, maxlength: [80, "Name is too long."] },
    key: {
      type: String,
      required: [true, "Key is required."],
      unique: true,
      immutable: true, // the key is referenced in code, so it never changes
      trim: true,
      match: [/^[a-z0-9]+(-[a-z0-9]+)*$/, "Key must use lowercase letters, numbers and single hyphens."],
    },
    description: { type: String, trim: true, default: "", maxlength: [300, "Description is too long."] },
    type: { type: String, enum: { values: FLAG_TYPES, message: "Unknown flag type." }, default: "release" },
    environments: Object.fromEntries(ENVIRONMENTS.map((env) => [env, { type: envSchema, default: () => ({}) }])),
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("Flag", flagSchema);
