-- TradeFlow + Clerk: user ids are strings like `user_2abc...`, not UUIDs.
-- Run once in the Supabase SQL editor after switching from Supabase Auth.
--
-- 1) Relax FK to auth.users if it exists (profiles often references auth.users):
--    ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
--
-- 2) Widen id / user_id columns (adjust if your schema differs):

ALTER TABLE invoices
  ALTER COLUMN user_id TYPE text USING user_id::text;

ALTER TABLE profiles
  ALTER COLUMN id TYPE text USING id::text;

-- 3) Recreate `generate_invoice_number(p_user_id text)` (or `text` param) to match.
--    Example — replace with your real prefix/sequence logic:
--
--    CREATE OR REPLACE FUNCTION generate_invoice_number(p_user_id text)
--    RETURNS text LANGUAGE plpgsql AS $$
--    DECLARE next_n int;
--    BEGIN
--      SELECT COALESCE(MAX((regexp_match(invoice_number, '(\d+)$'))[1]::int), 0) + 1
--        INTO next_n FROM invoices WHERE user_id = p_user_id;
--      RETURN 'INV-' || LPAD(next_n::text, 4, '0');
--    END;
--    $$;
