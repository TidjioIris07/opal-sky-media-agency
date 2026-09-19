// domain/media/media.repository.ts
import { prisma } from '@/lib/prisma';
import { MediaType } from '@/src/generated/prisma/enums';

export function createMedia(data: {
  fichierUrl: string;
  type: MediaType;
  nomOriginal: string;
}) {
  return prisma.media.create({ data });
}
