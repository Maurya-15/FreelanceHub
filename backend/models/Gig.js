import mongoose from "mongoose";

const PackageSchema = new mongoose.Schema({
  activePackage: { type: String, default: "basic" },
});

const GigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  images: [{ type: String }],
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  packages: [PackageSchema],
  activePackage: { type: String, default: "basic" },
  rating: { type: Number, default: 0 },
  orders: { type: Number, default: 0 },
  impressions: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  coverImage: { type: String },
}, { timestamps: true });

const Gig = mongoose.models.Gig || mongoose.model("Gig", GigSchema);
export default Gig;
