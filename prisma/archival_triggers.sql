-- Archival Triggers for Data Integrity (BR 3.8.1 and 3.8.2)
-- These triggers ensure that when a root entity is archived, its dependent entities are also archived automatically at the database level.

-- 1. Cascade Client Archive -> Projects & Invoices
CREATE OR REPLACE FUNCTION cascade_client_archive()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Archived' AND OLD.status != 'Archived' THEN
        UPDATE "Project" SET status = 'Archived' WHERE client_id = NEW.id;
        UPDATE "Invoice" SET status = 'Archived' WHERE client_id = NEW.id;
        UPDATE "Deal" SET status = 'Archived' WHERE client_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cascade_client_archive ON "Client";
CREATE TRIGGER trg_cascade_client_archive
AFTER UPDATE ON "Client"
FOR EACH ROW
EXECUTE FUNCTION cascade_client_archive();

-- 2. Cascade Project Archive -> Tasks & Invoices (if linked)
CREATE OR REPLACE FUNCTION cascade_project_archive()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Archived' AND OLD.status != 'Archived' THEN
        UPDATE "Task" SET status = 'Archived' WHERE project_id = NEW.id;
        -- Assuming Invoices linked to the project should also be archived if the project is archived.
        -- If an invoice is only linked to a client, it won't be affected here.
        UPDATE "Invoice" SET status = 'Archived' WHERE project_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cascade_project_archive ON "Project";
CREATE TRIGGER trg_cascade_project_archive
AFTER UPDATE ON "Project"
FOR EACH ROW
EXECUTE FUNCTION cascade_project_archive();
