import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PhotoDocument = HydratedDocument<Photo>;

@Schema()
export class Photo {
  @Prop()
  id: string;

  @Prop()
  photoId: string;

  @Prop()
  name: string;

  @Prop()
  tags: string[];

  @Prop()
  createdAt: Date;
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
