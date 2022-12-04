export interface PhotoListItemDto {
  _id: string;
  photoId: string;
  name: string;
  tags: string[];
  createdAt: Date;
  thumb?: any;
}
