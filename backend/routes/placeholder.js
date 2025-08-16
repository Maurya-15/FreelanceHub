import express from "express";
import { createCanvas } from "canvas";

const router = express.Router();

router.get( "/:w/:h", (req, res) => {
  const width = parseInt(req.params.w, 10) || 100;
  const height = parseInt(req.params.h, 10) || 100;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, width, height);

  // Text
  ctx.fillStyle = "#888";
  ctx.font = `${Math.floor(Math.min(width, height) / 3)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${width}x${height}` , width / 2, height / 2);

  res.setHeader("Content-Type", "image/png");
  canvas.pngStream().pipe(res);
});

export default router;
