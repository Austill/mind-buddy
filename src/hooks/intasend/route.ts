import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify webhook signature (recommended for production)
    // const signature = request.headers.get('x-intasend-signature');

    console.log("InstaSend Webhook received:", body)

    // Handle different webhook events
    switch (body.state) {
      case "COMPLETE":
        // Payment successful
        console.log("Payment completed:", body.invoice_id)
        // Here you would typically:
        // 1. Update user's premium status in database
        // 2. Send confirmation email
        // 3. Log the transaction
        break

      case "FAILED":
        // Payment failed
        console.log("Payment failed:", body.invoice_id)
        break

      case "PENDING":
        // Payment pending
        console.log("Payment pending:", body.invoice_id)
        break

      default:
        console.log("Unknown payment state:", body.state)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
