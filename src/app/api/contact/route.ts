import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Configure nodemailer transporter
// Note: In production, you should use environment variables for these settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    
    // Validate email format
    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured');
      return NextResponse.json({ 
        error: 'Email service not configured. Please contact the administrator.' 
      }, { status: 500 });
    }
    
    // Prepare email data
    const mailOptions = {
      from: `"Angel Granites Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'da@theangelstones.com',
      replyTo: body.email,
      subject: `Contact Form: ${body.subject || 'New Message from Website'}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\nPhone: ${body.phone || 'Not provided'}\n\nMessage:\n${body.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
          <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #262626;">
            <h3>Message:</h3>
            <p>${body.message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #777; margin-top: 20px; font-size: 12px;">
            This email was sent from the contact form on the Angel Granites website.
          </p>
        </div>
      `,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Message sent:', info.messageId);
    
    // Return success response
    return NextResponse.json({ success: true, messageId: info.messageId });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ 
      error: 'Failed to send email. Please try again later.' 
    }, { status: 500 });
  }
}
