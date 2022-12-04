export interface CreatePhotoDto {
  photoId: string;
  name: string;
  createdAt: Date;
  contentType: string;
  tags: string[];
}
