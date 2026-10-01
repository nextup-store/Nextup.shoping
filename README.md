# Nextup Admin Panel

This is the first admin-panel UI layer for the Nextup store.

IMPORTANT: the current demo login and product storage use browser storage only. This is NOT secure and is not a production authentication/database system.

For the real version, connect Supabase (Auth + Database + Storage + Row Level Security). Do not put an admin password in JavaScript.

The customer website can then read products from the same database and customers can submit orders without admin access.
