import { schema } from 'normalizr';

export const song = new schema.Entity('songs');
export const songs = new schema.Array({ songs: song });