import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { BaseEntity } from './base.entity';
import { randomUUID } from 'crypto';
import * as firebase from 'firebase-admin';
import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseService<T extends BaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  create(entity: DeepPartial<T>): T {
    return this.repository.create(entity);
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async query(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  async deleteById(id: EntityId): Promise<DeleteResult> {
    return this.repository.delete(id);
  }

  async uploadImageToFirebase(image: Express.Multer.File): Promise<string> {
    try {
      const uuid = randomUUID();
      const imageName = image.originalname.split('.');
      // const newImageName =
      //   crypto.randomUUID() + '.' + imageName[imageName.length - 1];
      const newImageName = uuid + '.' + imageName[imageName.length - 1];
      const url = `images/${newImageName}`;

      const bucket = firebase.storage().bucket();
      const file = bucket.file(url);
      const contents = image.buffer;
      await file.save(contents);

      return await `https://firebasestorage.googleapis.com/v0/b/${
        bucket.name
      }/o/${encodeURIComponent(url)}?alt=media`;
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.BAD_REQUEST);
    }
  }
}
