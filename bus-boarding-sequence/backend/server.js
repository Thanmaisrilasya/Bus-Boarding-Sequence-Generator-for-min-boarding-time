import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// POST route to handle booking sequence
app.post("/api/sequence", (req, res) => {
  const { bookings } = req.body;

  if (!bookings || !Array.isArray(bookings)) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  // Process bookings — find max seat number, sort, etc.
  const sequence = bookings
    .map(b => {
      const nums = (b.Seats.match(/\d+/g) || []).map(Number);
      return { ...b, maxSeat: nums.length ? Math.max(...nums) : 0 };
    })
    .sort((a, b) => b.maxSeat - a.maxSeat || parseInt(a.Booking_ID) - parseInt(b.Booking_ID))
    .map((b, i) => ({
      seq: i + 1,
      Booking_ID: b.Booking_ID,
      Seats: b.Seats,
      maxSeat: b.maxSeat
    }));

  res.json(sequence);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running http://localhost:${PORT}`);
});
