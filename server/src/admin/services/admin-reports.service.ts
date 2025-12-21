import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from '@/reports';
import { User, UserDocument } from '@/users';
import { Post, PostDocument } from '@/posts';
import { Admin, AdminDocument } from '@/admin/models';

@Injectable()
export class AdminReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async getAllReports(
    page: number = 1,
    limit: number = 20,
    reportType?: 'post' | 'user',
    status?: string,
  ) {
    const query: any = {};

    if (reportType) {
      query.reportType = reportType;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const total = await this.reportModel.countDocuments(query);

    const reports = await this.reportModel
      .find(query)
      .populate('reporterId', 'username email avatarImage')
      .populate('reviewedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // Populate reported user or post details
    const populatedReports = await Promise.all(
      reports.map(async (report) => {
        const reportObj: any = report.toObject();

        if (report.reportType === 'user') {
          const user = await this.userModel
            .findOne({ uuid: report.reportedId })
            .select('username email avatarImage uuid')
            .exec();
          reportObj.reportedUser = user;
        } else if (report.reportType === 'post') {
          const post = await this.postModel
            .findOne({ uuid: report.reportedId })
            .populate('userId', 'username avatarImage')
            .exec();
          reportObj.reportedPost = post;
        }

        return reportObj;
      }),
    );

    return {
      reports: populatedReports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReportById(uuid: string) {
    const report = await this.reportModel
      .findOne({ uuid })
      .populate('reporterId', 'username email avatarImage')
      .populate('reviewedBy', 'username email')
      .exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const reportObj: any = report.toObject();

    if (report.reportType === 'user') {
      const user = await this.userModel
        .findOne({ uuid: report.reportedId })
        .select('username email avatarImage uuid isActive isSuspended')
        .exec();
      reportObj.reportedUser = user;
    } else if (report.reportType === 'post') {
      const post = await this.postModel
        .findOne({ uuid: report.reportedId })
        .populate('userId', 'username avatar')
        .exec();
      reportObj.reportedPost = post;
    }

    return reportObj;
  }

  async updateReportStatus(
    uuid: string,
    status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
  ) {
    const report = await this.reportModel.findOne({ uuid }).exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = status;
    report.reviewedAt = new Date();

    await report.save();

    return this.getReportById(uuid);
  }

  async deleteReport(uuid: string) {
    const report = await this.reportModel.findOne({ uuid }).exec();

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.reportModel.deleteOne({ uuid }).exec();

    return { message: 'Report deleted successfully' };
  }

  async getReportsStats() {
    const total = await this.reportModel.countDocuments();
    const pending = await this.reportModel.countDocuments({
      status: 'pending',
    });
    const reviewed = await this.reportModel.countDocuments({
      status: 'reviewed',
    });
    const resolved = await this.reportModel.countDocuments({
      status: 'resolved',
    });
    const dismissed = await this.reportModel.countDocuments({
      status: 'dismissed',
    });
    const userReports = await this.reportModel.countDocuments({
      reportType: 'user',
    });
    const postReports = await this.reportModel.countDocuments({
      reportType: 'post',
    });

    return {
      total,
      pending,
      reviewed,
      resolved,
      dismissed,
      userReports,
      postReports,
    };
  }
}
