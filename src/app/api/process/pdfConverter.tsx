import { PDFDocument } from "pdf-lib";

export async function convertToPDF(file: Blob): Promise<Uint8Array> {
  // Baca file yang diunggah sebagai buffer
  const fileBuffer = await file.arrayBuffer();

  // Buat dokumen PDF baru
  const pdfDoc = await PDFDocument.create();

  // Tambahkan halaman baru ke dokumen
  const page = pdfDoc.addPage();

  // Gambar file yang diunggah ke halaman PDF
  const image = await pdfDoc.embedPng(fileBuffer);
  const { width, height } = image.scale(0.5); // Sesuaikan skala gambar
  page.drawImage(image, {
    x: 50,
    y: 50,
    width,
    height,
  });

  // Simpan dokumen PDF ke buffer
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}
