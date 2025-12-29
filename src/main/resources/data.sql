INSERT INTO users (id, login, password, type) VALUES
                                                  (1, 'user1', 'password', 'ADMIN'),
                                                  (2, 'user2', 'password', 'LABEL'),
                                                  (3, 'user3', 'password', 'ARTIST'),
                                                  (4, 'user4', 'password', 'MODERATOR'),
                                                  (5, 'user5', 'password', 'LABEL'),
                                                  (6, 'user6', 'password', 'LABEL'),
                                                  (7, 'user7', 'password', 'ARTIST'),
                                                  (8, 'user8', 'password', 'ARTIST'),
                                                  (9, 'user9', 'password', 'PLATFORM'),
                                                  (10, 'user10', 'password', 'ADMIN'),
                                                  (11, 'user11', 'password', 'MODERATOR'),
                                                  (12, 'user12', 'password', 'ARTIST'),
                                                  (13, 'user13', 'password', 'MODERATOR'),
                                                  (14, 'user14', 'password', 'LABEL'),
                                                  (15, 'user15', 'password', 'ARTIST');

INSERT INTO label (id, country, contact_name, phone, user_id) VALUES
                                                                  (1, 'USA', 'John Smith', '+1-555-0101', 2),
                                                                  (2, 'Japan', 'Yuki Tanaka', '+81-3-1234-5678', 5),
                                                                  (3, 'UK', 'Emma Wilson', '+44-20-7946-0958', 6),
                                                                  (4, 'USA', 'Warner Bros', '+1-555-9999', 14);

INSERT INTO artist (id, name, label_id, country, real_name, user_id) VALUES
                                                                         (1, 'John Beatmaker', 1, 'USA', 'John Michael Peterson', 3),
                                                                         (2, 'EMI', 2, 'Japan', 'Emi Yamamoto', 7),
                                                                         (3, 'Mike Wave', 3, 'UK', 'Michael Thompson', 8),
                                                                         (4, 'Electro Queen', 1, 'Germany', 'Anna Schmidt', 12),
                                                                         (5, 'David Groove', 1, 'USA', 'David Wilson', 15);

INSERT INTO release (id, name, artist_id, genre, release_upc, date, moderation_state, release_type, label_id) VALUES
                                                                                                                  (1, 'Summer Vibes', 1, 'House', 123456789012, '2023-06-01 00:00:00', 'APPROVED', 'SINGLE', 1),
                                                                                                                  (2, 'Tokyo Nights', 2, 'J-Pop', 123456789013, '2023-07-15 00:00:00', 'APPROVED', 'SINGLE', 2),
                                                                                                                  (3, 'Urban Dreams', 3, 'Hip-Hop', 123456789014, '2023-08-20 00:00:00', 'ON_REVIEW', 'ALBUM', 3),
                                                                                                                  (4, 'Electric Pulse', 4, 'EDM', 123456789015, '2023-09-10 00:00:00', 'WAITING_FOR_CHANGES', 'EP', 1),
                                                                                                                  (5, 'Chill Beats', 1, 'Lo-Fi', 123456789016, '2023-10-05 00:00:00', 'APPROVED', 'MIXTAPE', 1);

INSERT INTO song (release_id, artist_id, music_author, parental_advisory, streams, song_upc, metadata, path_to_file, song_length_seconds) VALUES
                                                                                                                                              (1, '[1]'::jsonb, 'John Beatmaker', false, 150000, 987654321001, '{"bpm": 128, "key": "C major"}', '/2542f/vwcver2.mp3', 180),
                                                                                                                                              (1, '[1, 4]'::jsonb, 'John Beatmaker ft. Electro Queen', false, 89000, 987654321002, '{"bpm": 125, "key": "A minor"}', '/wvwvdfv/ww4213rtu7/2452f.mp3', 210),
                                                                                                                                              (2, '[2]'::jsonb, 'EMI', false, 450000, 987654321003, '{"bpm": 132, "key": "G major"}', '/131d13d3/f131.mp3', 195),
                                                                                                                                              (3, '[3]'::jsonb, 'Mike Wave', true, 120000, 987654321004, '{"bpm": 95, "key": "F minor"}', '/m31fc13/1f1ef1/13f1wf13/13f.mp3', 240),
                                                                                                                                              (3, '[3, 1]'::jsonb, 'Mike Wave ft. John Beatmaker', true, 98000, 987654321005, '{"bpm": 100, "key": "D minor"}', '/qdvqd3d1/13f1we.mp3', 220),
                                                                                                                                              (4, '[4]'::jsonb, 'Electro Queen', false, 75000, 987654321006, '{"bpm": 138, "key": "E minor"}', '/m3r1r3/1r13.mp3', 190),
                                                                                                                                              (5, '[1]'::jsonb, 'John Beatmaker', false, 110000, 987654321007, '{"bpm": 85, "key": "C minor"}', '/53gg35g/131rr1.mp3', 185),
                                                                                                                                              (5, '[1]'::jsonb, 'John Beatmaker', false, 95000, 987654321008, '{"bpm": 82, "key": "A flat major"}', '/dqwv/1/qvcwevw.mp3', 200);

INSERT INTO platform (id, name) VALUES
                                    (1, 'Spotify'),
                                    (2, 'Apple Music'),
                                    (3, 'YouTube Music'),
                                    (4, 'Deezer'),
                                    (5, 'SoundCloud');

INSERT INTO moderators (id, name, user_id) VALUES
                                               (1, 'Alex Johnson', 4),
                                               (2, 'Sarah Miller', 13);

INSERT INTO royalty_report (id, upc, platform_id) VALUES
                                                      (1, 123456789012, 1),
                                                      (2, 123456789012, 2),
                                                      (3, 123456789013, 1),
                                                      (4, 123456789014, 3),
                                                      (5, 123456789015, 4),
                                                      (6, 123456789016, 1),
                                                      (7, 123456789016, 5);

INSERT INTO royalty (id, label_id, song_id, report_id, sum, platform) VALUES
                                                                          (1, 1, 1, 1, 1500.00, 1),
                                                                          (2, 1, 2, 1, 890.00, 1),
                                                                          (3, 1, 1, 2, 1200.00, 2),
                                                                          (4, 2, 3, 3, 4500.00, 1),
                                                                          (5, 3, 4, 4, 1200.00, 3),
                                                                          (6, 3, 5, 4, 980.00, 3),
                                                                          (7, 1, 6, 5, 750.00, 4),
                                                                          (8, 1, 7, 6, 1100.00, 1),
                                                                          (9, 1, 8, 6, 950.00, 1),
                                                                          (10, 1, 7, 7, 550.00, 5);

INSERT INTO on_moderation (id, comment, moderator_id, release_id, date) VALUES
                                                                            (1, 'Great production quality, approved for release', 1, 1, '2023-05-28 14:30:00'),
                                                                            (2, 'Excellent Japanese pop track, approved', 2, 2, '2023-07-10 11:15:00'),
                                                                            (3, 'Need to fix explicit lyrics in track 2', 1, 3, '2023-08-18 16:45:00'),
                                                                            (4, 'Audio quality issues in track 1, please re-upload', 2, 4, '2023-09-05 09:20:00');

