import {
  PrismaClient,
  Template,
  Prisma,
  ChannelType,
  TemplateStatus,
} from "@prisma/client";
import { AppError } from "@lime/errors";
import { logger } from "@lime/telemetry/logger";

const prisma = new PrismaClient();

export class TemplateService {
  async createTemplate(
    data: Omit<Template, "id" | "createdAt" | "updatedAt">
  ): Promise<Template> {
    try {
      return await prisma.template.create({ data });
    } catch (error: any) {
      logger.error("lifecycle", `Error creating template`, error);
      throw new AppError(
        "Failed to create template",
        500,
        "TEMPLATE_CREATE_ERROR"
      );
    }
  }

  async getTemplate(id: string): Promise<Template | null> {
    try {
      return await prisma.template.findUnique({ where: { id } });
    } catch (error: any) {
      logger.error("lifecycle", `Error fetching template`, error);
      throw new AppError(
        "Failed to fetch template",
        500,
        "TEMPLATE_FETCH_ERROR"
      );
    }
  }

  async updateTemplate(
    id: string,
    data: Partial<Omit<Template, "id" | "createdAt" | "updatedAt">>
  ): Promise<Template> {
    try {
      return await prisma.template.update({
        where: { id },
        data,
      });
    } catch (error: any) {
      logger.error("lifecycle", `Error updating template`, error);
      throw new AppError(
        "Failed to update template",
        500,
        "TEMPLATE_UPDATE_ERROR"
      );
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      await prisma.template.delete({ where: { id } });
    } catch (error: any) {
      logger.error("lifecycle", `Error deleting template`, error);
      throw new AppError(
        "Failed to delete template",
        500,
        "TEMPLATE_DELETE_ERROR"
      );
    }
  }

  async getTemplates(
    organizationId: string,
    limit: number = 100,
    offset: number = 0,
    filters?: {
      channel?: ChannelType;
      status?: TemplateStatus;
      search?: string;
    }
  ): Promise<Template[]> {
    try {
      const where: Prisma.TemplateWhereInput = { organizationId };

      if (filters?.channel) {
        where.channel = filters.channel;
      }
      if (filters?.status) {
        where.status = filters.status;
      }
      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { content: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      return await prisma.template.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
        skip: offset,
      });
    } catch (error: any) {
      logger.error("lifecycle", `Error fetching templates`, error);
      throw new AppError(
        "Failed to fetch templates",
        500,
        "TEMPLATES_FETCH_ERROR"
      );
    }
  }

  async duplicateTemplate(id: string): Promise<Template> {
    try {
      const originalTemplate = await this.getTemplate(id);
      if (!originalTemplate) {
        throw new AppError("Template not found", 404, "TEMPLATE_NOT_FOUND");
      }

      const { id: _, createdAt, updatedAt, ...templateData } = originalTemplate;
      const duplicatedTemplate = await this.createTemplate({
        ...templateData,
        name: `${templateData.name} (Copy)`,
      });

      return duplicatedTemplate;
    } catch (error: any) {
      logger.error("lifecycle", `Error duplicating template`, error);
      throw new AppError(
        "Failed to duplicate template",
        500,
        "TEMPLATE_DUPLICATE_ERROR"
      );
    }
  }
}
