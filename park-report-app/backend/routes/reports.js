const express = require("express");
const crypto = require("crypto");
const supabase = require("../supabaseClient");
const upload = require("../middleware/upload");

const router = express.Router();
const bucket = process.env.SUPABASE_BUCKET || "report-photos";

router.get("/", async (req, res) => {
  const status = req.query.status || "open";

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { employee_name, park_name, priority, description } = req.body;

    if (!employee_name || !park_name || !priority || !description) {
      return res.status(400).json({ error: "All fields are required." });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Photo is required." });
    }

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const { data, error } = await supabase
      .from("reports")
      .insert({
        employee_name,
        park_name,
        priority,
        description,
        photo_url: publicData.publicUrl,
        status: "open"
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id/complete", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("reports")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Report deleted." });
});

module.exports = router;
