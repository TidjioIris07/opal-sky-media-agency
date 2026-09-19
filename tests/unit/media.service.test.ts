import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createMedia: vi.fn(),
  uploadStream: vi.fn(),
}));

vi.mock('@/lib/cloudinary', () => ({
  cloudinary: {
    uploader: {
      upload_stream: mocks.uploadStream,
    },
  },
}));

vi.mock('@/domain/media/media.repository', () => ({
  createMedia: mocks.createMedia,
}));

import { uploadMedia } from '@/domain/media/media.service';

describe('uploadMedia', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads an image and persists the resulting media record', async () => {
    const fileBuffer = Buffer.from('image data');
    const persistedMedia = { id: 'media-1' };

    mocks.uploadStream.mockImplementationOnce((_options, callback) => ({
      end: (receivedBuffer: Buffer) => {
        expect(receivedBuffer).toBe(fileBuffer);
        callback(null, {
          secure_url: 'https://cdn.example/image.jpg',
          resource_type: 'image',
        });
      },
    }));
    mocks.createMedia.mockResolvedValueOnce(persistedMedia);

    await expect(uploadMedia(fileBuffer, 'photo.jpg')).resolves.toBe(
      persistedMedia,
    );

    expect(mocks.uploadStream).toHaveBeenCalledWith(
      { resource_type: 'auto', folder: 'opal-sky' },
      expect.any(Function),
    );
    expect(mocks.createMedia).toHaveBeenCalledWith({
      fichierUrl: 'https://cdn.example/image.jpg',
      type: 'IMAGE',
      nomOriginal: 'photo.jpg',
    });
  });

  it('maps video uploads to the VIDEO media type', async () => {
    const fileBuffer = Buffer.from('video data');

    mocks.uploadStream.mockImplementationOnce((_options, callback) => ({
      end: () =>
        callback(null, {
          secure_url: 'https://cdn.example/video.mp4',
          resource_type: 'video',
        }),
    }));
    mocks.createMedia.mockResolvedValueOnce({ id: 'media-2' });

    await uploadMedia(fileBuffer, 'clip.mp4');

    expect(mocks.createMedia).toHaveBeenCalledWith({
      fichierUrl: 'https://cdn.example/video.mp4',
      type: 'VIDEO',
      nomOriginal: 'clip.mp4',
    });
  });

  it('does not persist media when the upload fails', async () => {
    const uploadError = new Error('upload failed');

    mocks.uploadStream.mockImplementationOnce((_options, callback) => ({
      end: () => callback(uploadError, undefined),
    }));

    await expect(
      uploadMedia(Buffer.from('invalid data'), 'broken.jpg'),
    ).rejects.toBe(uploadError);

    expect(mocks.createMedia).not.toHaveBeenCalled();
  });
});
