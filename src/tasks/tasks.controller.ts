import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseFloatPipe,
  Query,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { Request as ExpressRequest } from 'express';
import { PageOptionsDto } from './dto/page-options.dto';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() request: ExpressRequest) {
    return this.tasksService.create(createTaskDto, request.user.id);
  }

  @ApiOkResponse({
    description: 'Lista de tareas',
    type: Task,
    isArray: true,
  })
  @Get()
  findAll(
    @Req() request: ExpressRequest,
    @Query() pageOptions: PageOptionsDto,
  ) {
    return this.tasksService.findAll(request.user.id, pageOptions);
  }

  @ApiOkResponse({
    description: 'Tarea ',
    type: Task,
  })
  @Get(':id')
  findOne(
    @Param('id', ParseFloatPipe) id: number,
    @Req() request: ExpressRequest,
  ) {
    return this.tasksService.findOne(id, request.user.id);
  }

  @ApiOkResponse({
    description: 'Actualiza una tarea',
    type: Task,
  })
  @Put(':id')
  update(
    @Param('id', ParseFloatPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @ApiOkResponse({
    description: 'Elimina una tarea',
    content: {
      'application/json': {
        schema: {
          allOf: [
            {
              properties: {
                message: { type: 'string', default: 'Tarea eliminada' },
              },
            },
          ],
        },
      },
    },
  })
  @Delete(':id')
  remove(
    @Param('id', ParseFloatPipe) id: number,
    @Req() request: ExpressRequest,
  ) {
    return this.tasksService.remove(id, request.user.id);
  }
}
