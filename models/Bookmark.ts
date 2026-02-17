import mongoose, { Schema, models, model } from "mongoose";

const BookmarkSchema = new Schema(
  {
    title: { type: String,  trim: true },
    url: { type: String, required: true, trim: true },
    note: { type: String, default: "" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export type BookmarkDoc = mongoose.InferSchemaType<typeof BookmarkSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Bookmark =
  models.Bookmark || model("Bookmark", BookmarkSchema);
