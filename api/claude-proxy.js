export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method Not Allowed"
    });
  }

  return res.status(200).json({
    message: "Claude proxy API is working"
  });
}