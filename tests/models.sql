create if exists tbl_employees(
    id serial primary key,
    first_name varchar(64) not null,
    last_name varchar(64) not null,
    contact_info varchar(64),
    location varchar(64),
    company varchar(64),
    department varchar(64),
    position varchar(64),
    status_active boolean default true,
    status_not_started boolean default false,
    status_terminated boolean default false,
    full_name varchar(128) generated always as (lower(first_name) || ' ' || lower(last_name)) stored
);

-- create index tbl_employees_idx_first_name on tbl_employees (first_name varchar_pattern_ops);
-- create index tbl_employees_idx_last_name on tbl_employees (last_name varchar_pattern_ops);
create index tbl_employee_idx_fullname on tbl_employees (full_name varchar_pattern_ops)
create index tbl_employees_idx_location on tbl_employees (location varchar_pattern_ops);
create index tbl_employees_idx_company on tbl_employees (company varchar_pattern_ops);
create index tbl_employees_idx_department on tbl_employees (department varchar_pattern_ops);
create index tbl_employees_idx_position on tbl_employees (position varchar_pattern_ops);
CREATE EXTENSION pg_trgm;
create index tbl_employees_fullname_idx on tbl_employees using GIN (full_name gin_trgm_ops)