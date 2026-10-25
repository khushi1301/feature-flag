export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const notFound = (req, res) => res.status(404).json({ message: "Route not found" });

// Express 5 forwards rejected promises from async handlers here automatically.
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(" ") });
  }
  if (err.name === "CastError") return res.status(400).json({ message: "Invalid id." });
  if (err.code === 11000) return res.status(409).json({ message: "A flag with this key already exists." });
  if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Request body is not valid JSON." });
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
}
