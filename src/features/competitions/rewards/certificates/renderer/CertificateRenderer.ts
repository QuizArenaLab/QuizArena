import { CertificateSnapshot } from "@/generated/prisma";
import { CertificateTemplateRegistry } from "../templates/CertificateTemplateRegistry";

export class CertificateRenderer {
  /**
   * Generates the raw HTML view for a certificate based on its immutable snapshot.
   */
  public static renderHtml(snapshot: CertificateSnapshot): string {
    const template = CertificateTemplateRegistry.getTemplate(snapshot.certificateType, snapshot.brandAssetsVersion);
    
    const formatType = (type: string) => {
      switch (type) {
        case "WINNER": return "Winner";
        case "EXCELLENCE": return "Excellence";
        case "TOP_PERFORMER": return "Top Performer";
        default: return "Participation";
      }
    };

    const typeLabel = formatType(snapshot.certificateType);
    const dateFormatted = snapshot.completionDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; background: #FFFFFF; color: ${template.primaryColor}; }
          
          .certificate { 
            width: 1122px; height: 793px; 
            padding: 60px 80px; 
            box-sizing: border-box; 
            position: relative; 
            border: 2px solid ${template.borderColor};
            background: #FFFFFF;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          /* Watermark */
          .watermark { 
            position: absolute; 
            top: 50%; left: 50%; 
            transform: translate(-50%, -50%); 
            opacity: 0.04; 
            font-size: 350px; 
            font-weight: 900; 
            z-index: 1; 
            pointer-events: none; 
            color: ${template.primaryColor};
            user-select: none;
          }

          /* Corner Accents */
          .corner { position: absolute; width: 40px; height: 40px; border: 2px solid transparent; z-index: 5; }
          .corner-tl { top: 20px; left: 20px; border-top-color: ${template.accentColor}; border-left-color: ${template.accentColor}; }
          .corner-tr { top: 20px; right: 20px; border-top-color: ${template.accentColor}; border-right-color: ${template.accentColor}; }
          .corner-bl { bottom: 20px; left: 20px; border-bottom-color: ${template.accentColor}; border-left-color: ${template.accentColor}; }
          .corner-br { bottom: 20px; right: 20px; border-bottom-color: ${template.accentColor}; border-right-color: ${template.accentColor}; }
          
          .content { position: relative; z-index: 10; text-align: center; flex: 1; display: flex; flex-direction: column; }
          
          /* Top Area: Logo & Title */
          .logo-area { margin-bottom: 30px; font-weight: 900; font-size: 24px; color: ${template.primaryColor}; letter-spacing: 2px; }
          .header { text-transform: uppercase; letter-spacing: 6px; color: ${template.accentColor}; font-size: 18px; font-weight: 600; margin-bottom: 40px; }
          
          /* Recipient Area */
          .statement-small { font-size: 18px; color: ${template.secondaryColor}; margin-bottom: 20px; }
          .name { font-size: 72px; font-weight: 700; margin: 0 0 20px 0; color: ${template.primaryColor}; letter-spacing: -1px; }
          
          /* Achievement Area */
          .statement { font-size: 18px; color: ${template.secondaryColor}; margin-bottom: 10px; }
          .competition { font-size: 26px; font-weight: 500; color: ${template.primaryColor}; margin-bottom: 10px; }
          .performance { font-size: 18px; color: ${template.secondaryColor}; margin-bottom: 40px; }
          
          /* Statistics */
          .metrics { display: flex; justify-content: center; gap: 80px; margin-bottom: auto; }
          .metric { text-align: center; }
          .metric-label { font-size: 13px; color: ${template.secondaryColor}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .metric-value { font-size: 20px; font-weight: 700; color: ${template.primaryColor}; }
          
          /* Footer */
          .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid ${template.borderColor}; padding-top: 30px; margin-top: 40px; }
          .footer-col { flex: 1; text-align: center; display: flex; flex-direction: column; justify-content: flex-end; }
          .footer-col.left { text-align: left; align-items: flex-start; }
          .footer-col.right { text-align: right; align-items: flex-end; }
          
          /* Signature */
          .signature img { height: 50px; margin-bottom: 15px; }
          .signature-name { font-weight: 600; font-size: 14px; color: ${template.primaryColor}; }
          .signature-title { font-size: 12px; color: ${template.secondaryColor}; margin-top: 4px; }
          
          /* Meta Details */
          .meta-label { font-size: 10px; color: ${template.secondaryColor}; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
          .meta-value { font-size: 13px; font-weight: 500; color: ${template.primaryColor}; margin-bottom: 12px; }
          
          /* QR Code */
          .qr-title { font-size: 12px; font-weight: 600; color: ${template.primaryColor}; margin-bottom: 4px; }
          .qr-subtitle { font-size: 10px; color: ${template.secondaryColor}; margin-bottom: 12px; }
          .qr-code img { width: 70px; height: 70px; }
          
          /* Seal / Badges */
          .badge-container { display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 10px; }
          .achievement-badge { background: ${template.accentColor}15; color: ${template.accentColor}; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; }
          
          .official-seal { 
            position: absolute; 
            bottom: 60px; 
            left: 50%; 
            transform: translateX(-50%); 
            width: 80px; height: 80px; 
            background: radial-gradient(circle, #FFF 20%, ${template.accentColor} 100%); 
            border-radius: 50%; 
            border: 2px dashed ${template.accentColor}; 
            display: flex; align-items: center; justify-content: center; 
            flex-direction: column;
            color: #FFF;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
          }
          .seal-text { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #FFF; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="watermark">Q</div>
          
          <div class="corner corner-tl"></div>
          <div class="corner corner-tr"></div>
          <div class="corner corner-bl"></div>
          <div class="corner corner-br"></div>
          
          <div class="content">
            <div class="logo-area">QUIZARENA</div>
            <div class="header">CERTIFICATE OF ${typeLabel.toUpperCase()}</div>
            
            <div class="statement-small">This certifies that</div>
            <div class="name">${snapshot.participantName}</div>
            
            ${snapshot.certificateType === "WINNER" ? `<div class="badge-container mb-4"><span class="achievement-badge">🥇 Rank #${snapshot.rank || 1}</span></div>` : ''}
            
            <div class="statement">has successfully completed</div>
            <div class="competition">${snapshot.competitionName}</div>
            <div class="performance">with outstanding performance.</div>
            
            <div class="metrics">
              ${snapshot.score !== null ? `<div class="metric"><div class="metric-label">Score</div><div class="metric-value">${snapshot.score}</div></div>` : ''}
              ${snapshot.rank !== null ? `<div class="metric"><div class="metric-label">Rank</div><div class="metric-value">#${snapshot.rank}</div></div>` : ''}
              <div class="metric"><div class="metric-label">Completion</div><div class="metric-value">${dateFormatted}</div></div>
            </div>
            
            <div class="footer">
              <div class="footer-col left">
                <div class="signature">
                  <!-- Fallback div if image fails -->
                  <div style="height: 50px; display: flex; align-items: flex-end; font-family: cursive; font-size: 24px; color: ${template.primaryColor}; margin-bottom: 10px; border-bottom: 1px solid ${template.borderColor}; padding-bottom: 4px; width: 150px;">
                    Q. Official
                  </div>
                  <div class="signature-name">${snapshot.issuer}</div>
                  <div class="signature-title">Official Issuer</div>
                </div>
              </div>
              
              <div class="footer-col">
                <div>
                  <div class="meta-label">Certificate ID</div>
                  <div class="meta-value">${snapshot.verificationToken}</div>
                  <div class="meta-label">Issued</div>
                  <div class="meta-value">${dateFormatted}</div>
                  <div class="meta-label">Version</div>
                  <div class="meta-value">${snapshot.certificateVersion}</div>
                </div>
              </div>
              
              <div class="footer-col right">
                <div class="qr-title">Secure Verification</div>
                <div class="qr-subtitle">Scan QR or visit<br/>verify.quizarena.com</div>
                <div class="qr-code">
                  <div style="width:70px;height:70px;background:#e2e8f0;display:inline-flex;align-items:center;justify-content:center;font-size:10px;color:#94a3b8;border-radius:4px;">QR</div>
                </div>
              </div>
            </div>
          </div>
          
          ${template.hasSeal ? `
          <div class="official-seal">
            <div class="seal-text">VERIFIED</div>
            <div style="font-size: 8px; font-weight: 600; color: #FFF; margin-top: 2px;">OFFICIAL</div>
          </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
  }
}
