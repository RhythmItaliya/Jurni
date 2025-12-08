import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Report, ReportDocument } from '../models/report.model';
import { CreateReportDto, UpdateReportDto } from '../dto/report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    reporterId: string,
  ): Promise<Report> {
    const report = new this.reportModel({
      ...createReportDto,
      uuid: uuidv4(),
      reporterId,
      status: 'pending',
    });
    return report.save();
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel
      .find()
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByType(reportType: 'post' | 'user'): Promise<Report[]> {
    return this.reportModel
      .find({ reportType })
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByStatus(status: string): Promise<Report[]> {
    return this.reportModel
      .find({ status })
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportModel
      .findById(id)
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .exec();

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async update(
    id: string,
    updateReportDto: UpdateReportDto,
    adminId: string,
  ): Promise<Report> {
    const updateData: any = { ...updateReportDto };

    if (updateReportDto.status && updateReportDto.status !== 'pending') {
      updateData.reviewedBy = adminId;
      updateData.reviewedAt = new Date();
    }

    const report = await this.reportModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .exec();

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
  }

  async getReportsByReportedId(reportedId: string): Promise<Report[]> {
    return this.reportModel
      .find({ reportedId })
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getReportsByReporterId(reporterId: string): Promise<Report[]> {
    return this.reportModel
      .find({ reporterId })
      .populate('reporterId', 'username email')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .exec();
  }
}
