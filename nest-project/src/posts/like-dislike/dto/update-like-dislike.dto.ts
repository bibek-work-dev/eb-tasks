import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDislikeDto } from './create-like-dislike.dto';

export class UpdateLikeDislikeDto extends PartialType(CreateLikeDislikeDto) {}
