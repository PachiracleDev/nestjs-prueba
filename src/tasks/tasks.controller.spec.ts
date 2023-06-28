import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { StatusEnum } from './models/status-enum';
import { PageOptionsDto } from './dto/page-options.dto';
import { Request as ExpressRequest } from 'express';

const userExample = {
  id: 1,
  email: 'patrick@gmail.com',
  name: 'Patrick',
  password: 'patrick',
  createAt: new Date(),
  role: 'user',
  refreshToken: '',
};

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        // Provide necessary properties for createTaskDto
        description: 'Test',
        status: StatusEnum.DONE,
      };
      const userId = 123; // Mock user id

      jest
        .spyOn(tasksService, 'create')
        .mockImplementation(() => Promise.resolve({} as Task));

      const result = await tasksController.create(createTaskDto, {
        user: userExample,
      } as ExpressRequest);

      expect(result).toBeDefined();
      expect(tasksService.create).toHaveBeenCalledWith(createTaskDto, userId);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const pageOptions: PageOptionsDto = {
        // Provide necessary properties for pageOptions
        take: 10,
        skip: 0,
        page: 1,
      };
      const userId = 123; // Mock user id

      jest
        .spyOn(tasksService, 'findAll')
        .mockImplementation(() => Promise.resolve([] as Task[]));

      const result = await tasksController.findAll(
        { user: userExample } as ExpressRequest,
        pageOptions,
      );

      expect(result).toEqual([]);
      expect(tasksService.findAll).toHaveBeenCalledWith(userId, pageOptions);
    });
  });
});
