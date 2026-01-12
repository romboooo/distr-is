SET session_replication_role = replica;

DROP TABLE IF EXISTS royalty CASCADE;
DROP TABLE IF EXISTS royalty_report CASCADE;
DROP TABLE IF EXISTS on_moderation CASCADE;
DROP TABLE IF EXISTS song CASCADE;
DROP TABLE IF EXISTS release CASCADE;
DROP TABLE IF EXISTS moderators CASCADE;
DROP TABLE IF EXISTS artist CASCADE;
DROP TABLE IF EXISTS label CASCADE;
DROP TABLE IF EXISTS platform CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP SEQUENCE IF EXISTS label_id_seq CASCADE;
DROP SEQUENCE IF EXISTS artist_id_seq CASCADE;
DROP SEQUENCE IF EXISTS release_id_seq CASCADE;
DROP SEQUENCE IF EXISTS song_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_id_seq CASCADE;
DROP SEQUENCE IF EXISTS moderators_id_seq CASCADE;
DROP SEQUENCE IF EXISTS platform_id_seq CASCADE;
DROP SEQUENCE IF EXISTS royalty_report_id_seq CASCADE;
DROP SEQUENCE IF EXISTS royalty_id_seq CASCADE;
DROP SEQUENCE IF EXISTS on_moderation_id_seq CASCADE;

SET session_replication_role = DEFAULT;

CREATE TABLE users (
                       id BIGSERIAL NOT NULL,
                       login VARCHAR(255) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       type VARCHAR(50) NOT NULL,
                       registration_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT users_pkey PRIMARY KEY (id),
                       CONSTRAINT users_login_unique UNIQUE (login),
                       CONSTRAINT users_type_check CHECK (type IN ('ARTIST', 'LABEL', 'MODERATOR', 'ADMIN', 'PLATFORM'))
);

CREATE TABLE label (
                       id BIGSERIAL NOT NULL,
                       country VARCHAR(100) NOT NULL,
                       contact_name VARCHAR(255) NOT NULL,
                       phone VARCHAR(50) NOT NULL,
                       user_id BIGINT NOT NULL,
                       CONSTRAINT label_pkey PRIMARY KEY (id),
                       CONSTRAINT label_user_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                       CONSTRAINT label_user_unique UNIQUE (user_id)
);

CREATE TABLE artist (
                        id BIGSERIAL NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        label_id BIGINT NOT NULL,
                        country VARCHAR(100) NOT NULL,
                        real_name VARCHAR(255) NOT NULL,
                        user_id BIGINT NOT NULL,
                        CONSTRAINT artist_pkey PRIMARY KEY (id),
                        CONSTRAINT artist_label_fkey FOREIGN KEY (label_id) REFERENCES label(id) ON DELETE CASCADE,
                        CONSTRAINT artist_user_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                        CONSTRAINT artist_user_unique UNIQUE (user_id)
);

CREATE TABLE release (
                         id BIGSERIAL NOT NULL,
                         name VARCHAR(255) NOT NULL,
                         artist_id BIGINT NOT NULL,
                         genre VARCHAR(100) NOT NULL,
                         cover_path VARCHAR(100) NULL,
                         release_upc BIGINT NOT NULL,
                         date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         moderation_state VARCHAR(50) NOT NULL,
                         release_type VARCHAR(50) NOT NULL,
                         label_id BIGINT NOT NULL,
                         CONSTRAINT release_pkey PRIMARY KEY (id),
                         CONSTRAINT release_upc_unique UNIQUE (release_upc),
                         CONSTRAINT release_artist_fkey FOREIGN KEY (artist_id) REFERENCES artist(id) ON DELETE CASCADE,
                         CONSTRAINT release_label_fkey FOREIGN KEY (label_id) REFERENCES label(id) ON DELETE CASCADE,
                         CONSTRAINT release_moderation_state_check CHECK (moderation_state IN ('REJECTED', 'APPROVED', 'WAITING_FOR_CHANGES', 'ON_MODERATION', 'ON_REVIEW', 'DRAFT')),
                         CONSTRAINT release_type_check CHECK (release_type IN ('SINGLE', 'MAXI_SINGLE', 'EP', 'ALBUM', 'MIXTAPE'))
);

CREATE TABLE song (
                      id BIGSERIAL NOT NULL,
                      release_id BIGINT NOT NULL,
                      artist_id JSONB NOT NULL DEFAULT '[]',
                      music_author VARCHAR(255) NOT NULL,
                      parental_advisory BOOLEAN NOT NULL DEFAULT false,
                      streams BIGINT NOT NULL DEFAULT 0,
                      song_upc BIGINT NOT NULL,
                      metadata JSONB NOT NULL DEFAULT '{}',
                      path_to_file VARCHAR(500) NOT NULL,
                      song_length_seconds INTEGER NOT NULL,
                      CONSTRAINT song_pkey PRIMARY KEY (id),
                      CONSTRAINT song_upc_unique UNIQUE (song_upc),
                      CONSTRAINT song_release_fkey FOREIGN KEY (release_id) REFERENCES release(id) ON DELETE CASCADE
);

CREATE TABLE platform (
                          id BIGSERIAL NOT NULL,
                          name VARCHAR(100) NOT NULL,
                          CONSTRAINT platform_pkey PRIMARY KEY (id),
                          CONSTRAINT platform_name_unique UNIQUE (name)
);

CREATE TABLE royalty_report (
                                id BIGSERIAL NOT NULL,
                                upc BIGINT NOT NULL,
                                platform_id BIGINT NOT NULL,
                                CONSTRAINT royalty_report_pkey PRIMARY KEY (id),
                                CONSTRAINT royalty_report_release_fkey FOREIGN KEY (upc) REFERENCES release(release_upc) ON DELETE CASCADE,
                                CONSTRAINT royalty_report_platform_fkey FOREIGN KEY (platform_id) REFERENCES platform(id) ON DELETE CASCADE
);

CREATE TABLE royalty (
                         id BIGSERIAL NOT NULL,
                         label_id BIGINT NOT NULL,
                         song_id BIGINT NOT NULL,
                         report_id BIGINT NOT NULL,
                         sum DECIMAL(15,2) NOT NULL,
                         platform BIGINT NOT NULL,
                         CONSTRAINT royalty_pkey PRIMARY KEY (id),
                         CONSTRAINT royalty_label_fkey FOREIGN KEY (label_id) REFERENCES label(id) ON DELETE CASCADE,
                         CONSTRAINT royalty_song_fkey FOREIGN KEY (song_id) REFERENCES song(id) ON DELETE CASCADE,
                         CONSTRAINT royalty_report_fkey FOREIGN KEY (report_id) REFERENCES royalty_report(id) ON DELETE CASCADE,
                         CONSTRAINT royalty_platform_fkey FOREIGN KEY (platform) REFERENCES platform(id) ON DELETE CASCADE
);

CREATE TABLE moderators (
                            id BIGSERIAL NOT NULL,
                            name VARCHAR(255) NOT NULL,
                            user_id BIGINT NOT NULL,
                            CONSTRAINT moderators_pkey PRIMARY KEY (id),
                            CONSTRAINT moderators_user_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                            CONSTRAINT moderators_user_unique UNIQUE (user_id)
);

CREATE TABLE on_moderation (
                               id BIGSERIAL NOT NULL,
                               comment TEXT NOT NULL,
                               moderator_id BIGINT NOT NULL,
                               release_id BIGINT NOT NULL,
                               date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT on_moderation_pkey PRIMARY KEY (id),
                               CONSTRAINT on_moderation_moderator_fkey FOREIGN KEY (moderator_id) REFERENCES moderators(id) ON DELETE CASCADE,
                               CONSTRAINT on_moderation_release_fkey FOREIGN KEY (release_id) REFERENCES release(id) ON DELETE CASCADE
);

CREATE INDEX idx_release_upc ON release(release_upc);
CREATE INDEX idx_song_upc ON song(song_upc);
CREATE INDEX idx_user_login ON users(login);
CREATE INDEX idx_song_artist_id ON song USING GIN (artist_id);
CREATE INDEX idx_song_metadata ON song USING GIN (metadata);
CREATE INDEX idx_release_moderation_state ON release(moderation_state);
CREATE INDEX idx_release_label_id ON release(label_id);
CREATE INDEX idx_release_artist_id ON release(artist_id);
CREATE INDEX idx_song_release_id ON song(release_id);

CREATE SEQUENCE label_id_seq;
CREATE SEQUENCE artist_id_seq;
CREATE SEQUENCE release_id_seq;
CREATE SEQUENCE song_id_seq;
CREATE SEQUENCE user_id_seq;
CREATE SEQUENCE moderators_id_seq;
CREATE SEQUENCE platform_id_seq;
CREATE SEQUENCE royalty_report_id_seq;
CREATE SEQUENCE royalty_id_seq;
CREATE SEQUENCE on_moderation_id_seq;

ALTER TABLE label ALTER COLUMN id SET DEFAULT nextval('label_id_seq');
ALTER TABLE artist ALTER COLUMN id SET DEFAULT nextval('artist_id_seq');
ALTER TABLE release ALTER COLUMN id SET DEFAULT nextval('release_id_seq');
ALTER TABLE song ALTER COLUMN id SET DEFAULT nextval('song_id_seq');
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('user_id_seq');
ALTER TABLE moderators ALTER COLUMN id SET DEFAULT nextval('moderators_id_seq');
ALTER TABLE platform ALTER COLUMN id SET DEFAULT nextval('platform_id_seq');
ALTER TABLE royalty_report ALTER COLUMN id SET DEFAULT nextval('royalty_report_id_seq');
ALTER TABLE royalty ALTER COLUMN id SET DEFAULT nextval('royalty_id_seq');
ALTER TABLE on_moderation ALTER COLUMN id SET DEFAULT nextval('on_moderation_id_seq');
