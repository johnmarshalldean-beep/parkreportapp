create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  employee_name text not null,
  park_name text not null,
  priority text not null default 'Normal',
  description text not null,
  photo_url text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists reports_status_idx on reports(status);
create index if not exists reports_created_at_idx on reports(created_at desc);
