DO $$ BEGIN
    CREATE TYPE cert_number_mode AS ENUM ('AUTO', 'MANUAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS certificate_templates (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_id VARCHAR(36) NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    background_url TEXT,
    number_template VARCHAR(255) NOT NULL DEFAULT 'CERT/{SLUG}/{REG_NO}',
    number_mode cert_number_mode NOT NULL DEFAULT 'AUTO',
    content_color VARCHAR(50),
    content_font VARCHAR(100),
    footer_margin_bottom INT DEFAULT 0,
    header_color VARCHAR(50),
    header_font VARCHAR(100),
    header_subtitle VARCHAR(255) DEFAULT 'Sertifikat Partisipasi Resmi',
    header_text VARCHAR(255) DEFAULT 'SITIVENT',
    primary_color VARCHAR(50),
    show_event_date BOOLEAN DEFAULT TRUE,
    show_event_location BOOLEAN DEFAULT FALSE,
    show_header BOOLEAN DEFAULT TRUE,
    show_issued_date BOOLEAN NOT NULL DEFAULT TRUE,
    title_color VARCHAR(50),
    title_font VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cert_templates_event_id ON certificate_templates(event_id);

