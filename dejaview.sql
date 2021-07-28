\echo 'Delete and recreate dejaview db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE dejaview;
CREATE DATABASE dejaview;
\connect dejaview

\i dejaview-schema.sql
\i dejaview-seed.sql

\echo 'Delete and recreate dejaview_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE dejaview_test;
CREATE DATABASE dejaview_test;
\connect dejaview_test

\i dejaview-schema.sql
