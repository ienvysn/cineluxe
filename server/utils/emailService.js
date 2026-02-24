const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const getPosterUrl = (posterPath) => {
  if (!posterPath) return "";
  if (posterPath.startsWith("http")) return posterPath;

  return `http://localhost:5000${posterPath}`;
};

const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  const { movie, showtime, screen, seats, totalAmount, bookingId } =
    bookingDetails;

  const posterUrl = getPosterUrl(movie.poster);
  const movieTitle = movie.title || "Movie Title";
  const movieDate = new Date(showtime.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const movieTime = showtime.time.substring(0, 5); // HH:MM

  const mailOptions = {
    from: `"CineLuxe Concierge" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `Your Exclusive Reservation: ${movieTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Booking Confirmation</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          body { margin: 0; padding: 0; background-color: #050505; font-family: 'Lato', sans-serif; color: #e0e0e0; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #d4af37; }
          .logo { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
          .logo span { color: #d4af37; }
          .subtitle { font-family: 'Playfair Display', serif; font-style: italic; color: #888; letter-spacing: 1px; font-size: 14px; margin-top: 5px; }

          .content { padding: 40px; }
          .greeting { font-family: 'Playfair Display', serif; font-size: 24px; color: #fff; margin-bottom: 20px; text-align: center; }
          .message { text-align: center; color: #aaa; line-height: 1.6; margin-bottom: 30px; }

          .ticket-card { background-color: #111; border: 1px solid #222; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; md:flex-row; }
          .poster { width: 100%; height: 200px; object-fit: cover; background-color: #222; }
          .details { padding: 20px; text-align: left; }

          .movie-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #d4af37; margin: 0 0 10px 0; font-weight: 700; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #222; padding-bottom: 8px; }
          .info-label { color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
          .info-value { color: #fff; font-weight: 700; font-size: 14px; text-align: right; }

          .booking-id-box { background-color: #d4af37; color: #000; padding: 15px; text-align: center; margin-top: 30px; border-radius: 4px; }
          .booking-id-label { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; display: block; margin-bottom: 5px; opacity: 0.8; }
          .booking-id-value { font-family: 'Playfair Display', serif; font-size: 28px; letter-spacing: 4px; font-weight: 700; display: block; }

          .footer { background-color: #000; padding: 30px; text-align: center; font-size: 12px; color: #444; border-top: 1px solid #1a1a1a; }
          .footer a { color: #666; text-decoration: none; margin: 0 10px; }
          .footer a:hover { color: #d4af37; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Cine<span>Luxe</span></h1>
            <p class="subtitle">The Art of Cinema</p>
          </div>

          <div class="content">
            <h2 class="greeting">Reservation Confirmed</h2>
            <p class="message">Your journey into cinematic excellence awaits. We have secured your seats for an unforgettable experience.</p>

            <div class="ticket-card">
              <img src="${posterUrl}" alt="${movieTitle}" class="poster" style="width:100%; height:auto; max-height:300px; object-fit:cover; display:block;">
              <div class="details">
                <h3 class="movie-title">${movieTitle}</h3>

                <div class="info-row">
                  <span class="info-label">Date</span>
                  <span class="info-value">${movieDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Time</span>
                  <span class="info-value">${movieTime}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Screen</span>
                  <span class="info-value">${screen.name}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Seats</span>
                  <span class="info-value">${seats.join(", ")}</span>
                </div>
                 <div class="info-row" style="border-bottom: none;">
                  <span class="info-label">Total Paid</span>
                  <span class="info-value">NPR ${totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div class="booking-id-box">
              <span class="booking-id-label">Booking Reference</span>
              <span class="booking-id-value">${bookingId}</span>
            </div>

            <p style="text-align: center; font-size: 12px; color: #555; margin-top: 30px; font-style: italic;">
              Please present this email or your booking reference at the counter for entry.
            </p>
          </div>

          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CineLuxe. All rights reserved.</p>
            <p>Kathmandu, Nepal | +977 9866666666</p>
            <div style="margin-top: 15px;">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Support</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendResetPasswordEmail = async (userEmail, resetCode) => {
  const mailOptions = {
    from: `"CineLuxe Security" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Reset Your CineLuxe Password",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap');
          body { margin: 0; padding: 0; background-color: #050505; font-family: 'Lato', sans-serif; color: #e0e0e0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #0a0a0a; border: 1px solid #1a1a1a; box-shadow: 0 10px 30px rgba(0,0,0,0.8); }
          .header { background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); padding: 40px 20px; text-align: center; border-bottom: 2px solid #d4af37; }
          .logo { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; color: #fff; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
          .logo span { color: #d4af37; }
          .content { padding: 40px; text-align: center; }
          .greeting { font-family: 'Playfair Display', serif; font-size: 24px; color: #fff; margin-bottom: 20px; }
          .message { color: #aaa; line-height: 1.6; margin-bottom: 30px; }
          .code-box { background-color: #111; border: 1px dashed #d4af37; color: #d4af37; padding: 20px; font-family: 'Playfair Display', serif; font-size: 36px; letter-spacing: 10px; font-weight: 700; margin: 30px 0; border-radius: 8px; }
          .expiry { font-size: 12px; color: #666; font-style: italic; }
          .footer { background-color: #000; padding: 30px; text-align: center; font-size: 12px; color: #444; border-top: 1px solid #1a1a1a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Cine<span>Luxe</span></h1>
          </div>
          <div class="content">
            <h2 class="greeting">Password Reset Request</h2>
            <p class="message">We received a request to reset your password. Use the code below to proceed. If you didn't request this, you can safely ignore this email.</p>
            <div class="code-box">${resetCode}</div>
            <p class="expiry">This code will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} CineLuxe. All rights reserved.</p>
            <p>If you have any questions, contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset password email sent to:", userEmail);
    return true;
  } catch (error) {
    console.error("Error sending reset email:", error);
    return false;
  }
};

module.exports = { sendBookingConfirmation, sendResetPasswordEmail };
