ALTER TABLE certificates
    ADD CONSTRAINT certificates_registration_id_key UNIQUE (registration_id);
