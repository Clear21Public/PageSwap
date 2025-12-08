/**
 * Available avatar IDs
 * Each ID corresponds to a JPG file in public/assets
 */
export const AVATAR_IDS = [
  '1d4040ea-9a2c-468d-83b4-de9a8f62ed86',
  '1f999ca4-3074-4535-a4cb-6b70734aa239',
  '20d61daa-8561-4be6-a565-773f28245e69',
  '28ba3a7e-8da5-456b-abe2-853039513b1b',
  '2e5abe9d-ee2d-4103-b0f7-ebb2452e5cc2',
  '57602ee9-ccb6-40e3-bfd1-0cc55126783b',
  '5f088d6c-3c8e-4a50-8134-5b477be74660',
  '6bd19655-6f28-4f6d-9180-7c7ea2080b28',
  '6e682581-5425-49f9-bad6-8cf28fab5bd7',
  '8002ce24-1b80-459e-bdf2-1c934cffa931',
  '86cdf962-b00b-48df-a94a-0ce05b3d6dc9',
  '9efa5725-2540-410a-a1d4-d31fc1a3314e',
  'a99a4f82-efde-45f0-96dc-46617ffbe18c',
  'b60025d0-e5a9-464c-9fc5-0357f7f95e45',
  'bc6f40c3-4e01-4c2e-8b19-5d1ce83c5974',
  'c6c6cc43-61cd-42f5-a24d-ab4e54c0e71d',
  'c74f6420-88e3-4ef0-a353-be23ec7fca26',
  'cabf6ef5-6411-4c25-ba86-14dbd77ffff3',
  'cb7f15e0-cb7b-475d-a953-0a4e69a7ea29',
  'ea9dc4cf-546f-41ff-8340-f99edf98a326',
  'eb00624e-85be-4996-a71b-1c089f7b9e1a',
  'efe90777-49de-4c88-ac73-dbf765889b47',
  'f2a4ba7e-a923-4296-beaf-b02daff91176',
  'f5eeef00-f07d-4676-9f56-37eec39120e0',
] as const;

export type AvatarId = (typeof AVATAR_IDS)[number];
