import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { PageOptionsDto } from './dto/page-options.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto, userId: number) {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      userId,
    });

    return this.tasksRepository.save(task);
  }

  async findAll(userId: number, pageOptionsDto: PageOptionsDto) {
    const tasks = await this.tasksRepository.find({
      where: {
        userId,
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    return tasks;
  }

  async findOne(taskId: number, userId: number) {
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException(`Tarea no encontrada`);
    }

    return task;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksRepository.preload({
      id: taskId,
      ...updateTaskDto,
    });

    return this.tasksRepository.save(task);
  }

  async remove(taskId: number, userId: number) {
    const task = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException(`Tarea no encontrada`);
    }

    await this.tasksRepository.remove(task);

    return {
      message: `Tarea eliminada`,
    };
  }
}
