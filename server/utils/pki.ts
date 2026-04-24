import { PDFDocument } from 'pdf-lib'
import { prisma } from './db'
import { sha256, rsaSign, generateKeyPair } from './crypto'
import { uploadFile, getFile } from './storage'

/** Process completed document: embed signatures into PDF, compute hashes, sign */
export async function processSignedDocument(documentId: string) {
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    include: {
      signRequests: {
        include: { signFields: true },
        where: { status: 'signed' },
      },
    },
  })

  if (!doc || !doc.originalFileKey) {
    throw new Error('Document or original file not found')
  }

  // Get original PDF
  let pdfBuffer = await getFile(doc.originalFileKey)
  const pdfDoc = await PDFDocument.load(pdfBuffer)

  // Embed each signature into the PDF
  for (const sr of doc.signRequests) {
    for (const field of sr.signFields) {
      if (!field.value) continue

      const page = pdfDoc.getPage(field.page)

      if (field.type === 'signature' || field.type === 'initial') {
        // Decode base64 image
        if (field.value.startsWith('data:image/png')) {
          const base64Data = field.value.split(',')[1]
          const imgBytes = Buffer.from(base64Data, 'base64')
          const image = await pdfDoc.embedPng(imgBytes)

          // PDF coordinate system: origin at bottom-left
          const pageHeight = page.getHeight()
          page.drawImage(image, {
            x: field.x,
            y: pageHeight - field.y - field.height,
            width: field.width,
            height: field.height,
          })
        }
      } else if (field.type === 'text' || field.type === 'date') {
        const { rgb, StandardFonts } = await import('pdf-lib')
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pageHeight = page.getHeight()

        page.drawText(field.value, {
          x: field.x + 2,
          y: pageHeight - field.y - field.height + 4,
          size: Math.min(field.height * 0.7, 14),
          font,
          color: rgb(0, 0, 0),
        })
      } else if (field.type === 'checkbox') {
        const { rgb, StandardFonts } = await import('pdf-lib')
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pageHeight = page.getHeight()

        if (field.value === 'true' || field.value === '1') {
          page.drawText('✓', {
            x: field.x + 2,
            y: pageHeight - field.y - field.height + 2,
            size: field.height * 0.8,
            font,
            color: rgb(0, 0, 0),
          })
        }
      }
    }
  }

  // Save the signed PDF
  const signedPdfBytes = await pdfDoc.save()
  const signedBuffer = Buffer.from(signedPdfBytes)

  // Compute hash of signed PDF
  const signedHash = sha256(signedBuffer)

  // Generate PKI digital signature
  const { privateKeyPem } = generateKeyPair()
  const digitalSignature = rsaSign(signedHash, privateKeyPem)

  // Upload signed PDF to S3
  const signedFileKey = await uploadFile(signedBuffer, 'application/pdf', `signed/${doc.orgId}`)

  // Update document with signed file info
  await prisma.document.update({
    where: { id: documentId },
    data: {
      signedFileKey,
      signedHash,
      status: 'completed',
      completedAt: new Date(),
    },
  })

  return {
    signedFileKey,
    signedHash,
    digitalSignature,
    signedBuffer,
  }
}
