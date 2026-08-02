CREATE TABLE public.uno_rooms (
  code TEXT PRIMARY KEY,
  host_id TEXT NOT NULL,
  players JSONB NOT NULL DEFAULT '[]'::jsonb,
  state JSONB,
  seq BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.uno_room_members (
  room_code TEXT NOT NULL REFERENCES public.uno_rooms(code) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (room_code, player_id)
);

CREATE INDEX idx_uno_rooms_updated_at ON public.uno_rooms(updated_at);

GRANT ALL ON public.uno_rooms TO service_role;
GRANT ALL ON public.uno_room_members TO service_role;

ALTER TABLE public.uno_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uno_room_members ENABLE ROW LEVEL SECURITY;