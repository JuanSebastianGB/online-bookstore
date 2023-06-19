import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

describe('GenreController', () => {
  let controller: GenreController;
  let service: GenreService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [GenreService],
    }).compile();
    controller = module.get<GenreController>(GenreController);
    service = module.get<GenreService>(GenreService);
  });
  describe('create', () => {
    const createGenreDto: CreateGenreDto = {
      name: 'Action',
    };
    it('should create a new genre', async () => {
      jest
        .spyOn(service, 'create')
        //@ts-ignore
        .mockResolvedValueOnce({ id: 1, ...createGenreDto });
      const result = await controller.create(createGenreDto);
      expect(result).toEqual({ id: 1, ...createGenreDto });
    });
    it('should throw a BadRequestException if genre name already exists', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce({ code: 'P2002' });
      await expect(controller.create(createGenreDto)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should throw a BadRequestException if an error occurs', async () => {
      jest.spyOn(service, 'create').mockRejectedValueOnce(new Error());
      await expect(controller.create(createGenreDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
