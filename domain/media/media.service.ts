import { cloudinary } from '@/lib/cloudinary';
import { createMedia } from './media.repository';
import { MediaType } from '@/src/generated/prisma/enums';

export async function uploadMedia(fileBuffer: Buffer, originalName: string) {
  const result = await new Promise<{
    secure_url: string;
    resource_type: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'opal-sky' },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      },
    );
    stream.end(fileBuffer);
  });

  const type: MediaType = result.resource_type === 'video' ? 'VIDEO' : 'IMAGE';

  return createMedia({
    fichierUrl: result.secure_url,
    type,
    nomOriginal: originalName,
  });
}
