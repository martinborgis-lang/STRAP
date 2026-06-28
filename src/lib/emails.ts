import { Resend } from 'resend'

/** Indique si Resend est configuré (clé API présente). */
export const isResendConfigured = Boolean(process.env.RESEND_API_KEY)

// Construction paresseuse : on n'instancie le client qu'au moment de l'envoi
// pour éviter tout effet de bord au chargement du module (build-safe).
function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 're_placeholder')
}

export async function sendOrderConfirmation(order: {
  customerEmail: string
  customerName: string
  orderId: string
  items: { name: string; color: string; quantity: number; price: number }[]
  total: number
  shippingAddress: {
    line1: string
    city: string
    postal_code: string
    country: string
  }
}) {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #222;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #222;">${item.color}</td>
      <td style="padding: 12px; border-bottom: 1px solid #222;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #222; text-align: right;">
        ${(item.price / 100).toFixed(2)}€
      </td>
    </tr>
  `,
    )
    .join('')

  await getResend().emails.send({
    from: 'STRAP <commandes@strap.store>',
    to: order.customerEmail,
    subject: `Confirmation de commande #${order.orderId
      .slice(0, 8)
      .toUpperCase()}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="background:#000; color:#fff; font-family:'Helvetica Neue',sans-serif; margin:0; padding:40px 20px;">
        <div style="max-width:600px; margin:0 auto;">

          <div style="text-align:center; margin-bottom:40px;">
            <h1 style="letter-spacing:0.3em; font-size:24px; font-weight:600;">S T R A P</h1>
          </div>

          <h2 style="font-size:20px; font-weight:400; margin-bottom:8px;">
            Merci pour votre commande, ${order.customerName} !
          </h2>
          <p style="color:#888; margin-bottom:32px;">
            Commande #${order.orderId.slice(0, 8).toUpperCase()}
          </p>

          <table style="width:100%; border-collapse:collapse; margin-bottom:32px;">
            <thead>
              <tr style="border-bottom:1px solid #333;">
                <th style="padding:12px; text-align:left; color:#888; font-weight:400; font-size:12px; letter-spacing:0.1em;">PRODUIT</th>
                <th style="padding:12px; text-align:left; color:#888; font-weight:400; font-size:12px; letter-spacing:0.1em;">COLORIS</th>
                <th style="padding:12px; text-align:left; color:#888; font-weight:400; font-size:12px; letter-spacing:0.1em;">QTÉ</th>
                <th style="padding:12px; text-align:right; color:#888; font-weight:400; font-size:12px; letter-spacing:0.1em;">PRIX</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="text-align:right; margin-bottom:32px;">
            <p style="color:#888; margin:4px 0;">
              Livraison : ${order.total >= 15000 ? 'Offerte' : '5,90€'}
            </p>
            <p style="font-size:20px; font-weight:600;">
              Total : ${(order.total / 100).toFixed(2)}€
            </p>
          </div>

          <div style="border:1px solid #222; border-radius:8px; padding:20px; margin-bottom:32px;">
            <p style="color:#888; font-size:12px; letter-spacing:0.1em; margin:0 0 8px;">
              ADRESSE DE LIVRAISON
            </p>
            <p style="margin:0;">${order.shippingAddress.line1}</p>
            <p style="margin:0;">${order.shippingAddress.postal_code} ${order.shippingAddress.city}</p>
            <p style="margin:0;">${order.shippingAddress.country}</p>
          </div>

          <p style="color:#888; font-size:14px; line-height:1.6;">
            Votre bracelet sera expédié sous 48h ouvrées.
            Vous recevrez un email de suivi dès l'expédition.
          </p>

          <div style="border-top:1px solid #222; margin-top:40px; padding-top:20px; text-align:center;">
            <p style="color:#555; font-size:12px;">
              STRAP — Bracelets pour AP × Swatch Royal Pop<br>
              STRAP n'est pas affilié à Swatch Group ni à Audemars Piguet.
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  })
}
