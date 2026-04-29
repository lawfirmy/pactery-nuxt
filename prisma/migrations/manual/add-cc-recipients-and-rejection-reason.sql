-- Add CC Recipients table
CREATE TABLE "cc_recipients" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cc_recipients_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cc_recipients_document_id_idx" ON "cc_recipients"("document_id");

ALTER TABLE "cc_recipients" ADD CONSTRAINT "cc_recipients_document_id_fkey"
    FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Add rejection_reason to sign_requests
ALTER TABLE "sign_requests" ADD COLUMN "rejection_reason" TEXT;
