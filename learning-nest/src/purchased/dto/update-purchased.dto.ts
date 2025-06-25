import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchasedDto } from './create-purchased.dto';

export class UpdatePurchasedDto extends PartialType(CreatePurchasedDto) {}
