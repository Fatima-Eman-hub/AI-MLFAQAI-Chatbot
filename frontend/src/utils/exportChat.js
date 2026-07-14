function formatMessagesAsText(messages) {
  const lines = messages.map((m) => {
    const speaker = m.role === "user" ? "You" : "FAQAI";
    const time = new Date(m.timestamp).toLocaleString();
    return `[${time}] ${speaker}: ${m.text}`;
  });
  return lines.join("\n\n");
}

export function exportChatAsTxt(messages) {
  const text = formatMessagesAsText(messages);
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `faqai-chat-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportChatAsPdf(messages) {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("FAQAI — Chat Transcript", margin, y);
  y += 20;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(new Date().toLocaleString(), margin, y);
  doc.setTextColor(20);
  y += 24;

  messages.forEach((m) => {
    const speaker = m.role === "user" ? "You" : "FAQAI";
    const time = new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    const header = `${speaker} · ${time}`;
    if (y > 780) {
      doc.addPage();
      y = margin;
    }
    doc.text(header, margin, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(m.text, maxWidth);
    lines.forEach((line) => {
      if (y > 780) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 15;
    });
    y += 12;
  });

  doc.save(`faqai-chat-${Date.now()}.pdf`);
}
