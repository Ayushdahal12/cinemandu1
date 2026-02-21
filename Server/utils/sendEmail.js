import nodemailer from 'nodemailer'
import QRCode from 'qrcode'

export const sendBookingEmail = async (userEmail, bookingDetails) => {
    try {
        const { bookingId, movieTitle, seats, amount, showDate } = bookingDetails

        // QR code contains booking info
        const qrData = `Booking ID: ${bookingId} | Movie: ${movieTitle} | Seats: ${seats.join(', ')} | Amount: NPR ${amount} | Date: ${showDate}`
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        })

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        await transporter.sendMail({
            from: `Cinemandu <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `🎬 Booking Confirmed - ${movieTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: white; padding: 30px; border-radius: 12px;">
                    
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #e11d48; font-size: 32px; margin-bottom: 4px;">🎬 Cinemandu</h1>
                        <p style="color: #9ca3af; font-size: 13px; margin: 0;">Nepal's #1 Movie Booking Platform</p>
                        <h2 style="color: white; margin-top: 20px;">✅ Booking Confirmed!</h2>
                        <p style="color: #9ca3af;">Your movie ticket has been booked successfully.</p>
                    </div>

                    <hr style="border-color: #374151; margin: 20px 0;"/>

                    <div style="background: #1f2937; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #e11d48; margin-top: 0;">📋 Booking Details</h3>
                        <p style="margin: 8px 0;"><strong>🎥 Movie:</strong> ${movieTitle}</p>
                        <p style="margin: 8px 0;"><strong>🪑 Seats:</strong> ${seats.join(', ')}</p>
                        <p style="margin: 8px 0;"><strong>📅 Show Date:</strong> ${showDate}</p>
                        <p style="margin: 8px 0;"><strong>💰 Amount Paid:</strong> NPR ${amount}</p>
                        <p style="margin: 8px 0;"><strong>🎫 Booking ID:</strong> ${bookingId}</p>
                    </div>

                    <div style="text-align: center; background: #1f2937; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="color: #9ca3af; margin-bottom: 10px;">Show this QR code at the counter to collect your ticket:</p>
                        <div style="display: inline-block; background: white; padding: 10px; border-radius: 8px;">
                            <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 150px; height: 150px; display: block;"/>
                        </div>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 10px;">Scan this QR code at the cinema entrance</p>
                    </div>

                    <hr style="border-color: #374151; margin: 20px 0;"/>

                    <div style="text-align: center;">
                        <p style="color: #9ca3af; font-size: 15px;">Thank you for booking with <strong style="color: #e11d48;">Cinemandu</strong>! 🍿</p>
                        <p style="color: #6b7280; font-size: 13px;">Sit back, relax and enjoy your movie experience!</p>
                        <p style="color: #6b7280; font-size: 11px; margin-top: 20px;">This is an automated email. Please do not reply to this email.</p>
                        <p style="color: #6b7280; font-size: 11px;">© 2026 Cinemandu. All rights reserved.</p>
                    </div>

                </div>
            `
        })

        console.log("Booking email sent to:", userEmail)
    } catch (error) {
        console.log("Email error:", error.message)
    }
}