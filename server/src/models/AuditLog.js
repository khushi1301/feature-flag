import mongoose from "mongoose";
import { AUDIT_ACTIONS, ENVIRONMENTS } from "../constants.js";

const auditSchema = new mongoose.Schema(
  {
    user: { name: { type: String, required: true }, role: { type: String, required: true } },
    action: { type: String, enum: AUDIT_ACTIONS, required: true },
    flagKey: { type: String, required: true },
    flagName: { type: String, required: true },
    env: { type: String, enum: [...ENVIRONMENTS, null], default: null },
    change: { type: String, default: "" },
  },
  {
    timestamps: { createdAt: "at", updatedAt: false }, // the UI reads `at`
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
auditSchema.index({ at: -1 });

export default mongoose.model("AuditLog", auditSchema);
