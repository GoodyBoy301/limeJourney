import {
  Body,
  Get,
  Path,
  Post,
  Put,
  Delete,
  Route,
  Security,
  Tags,
  Request,
} from "tsoa";
import {
  Segment,
  CreateSegmentDTO,
  UpdateSegmentDTO,
  SegmentAnalytics,
} from "../../models/segmentation";
import { AuthenticatedRequest, JWTAuthenticatedUser } from "../../models/auth";
import { ApiResponse } from "../../models/apiResponse";
import { SegmentationService } from "../../services/segmentationService";

@Route("segments")
@Tags("Segments")
@Security("jwt")
export class SegmentController {
  private segmentationService: SegmentationService;

  constructor() {
    this.segmentationService = new SegmentationService();
  }

  @Post()
  public async createSegment(
    @Body() body: CreateSegmentDTO,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<Segment>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segment = await this.segmentationService.createSegment(
        organizationId,
        body
      );
      return {
        status: "success",
        data: segment,
        message: "Segment created successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while creating the segment",
      };
    }
  }

  @Get("{segmentId}")
  public async getSegment(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<Segment>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segment = await this.segmentationService.getSegment(
        segmentId,
        organizationId
      );
      if (!segment) {
        return {
          status: "error",
          data: null,
          message: "Segment not found",
        };
      }
      return {
        status: "success",
        data: segment,
        message: "Segment retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving the segment",
      };
    }
  }

  @Put("{segmentId}")
  public async updateSegment(
    @Path() segmentId: string,
    @Body() body: UpdateSegmentDTO,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<Segment>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segment = await this.segmentationService.updateSegment(
        segmentId,
        organizationId,
        body
      );
      if (!segment) {
        return {
          status: "error",
          data: null,
          message: "Segment not found",
        };
      }
      return {
        status: "success",
        data: segment,
        message: "Segment updated successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while updating the segment",
      };
    }
  }

  @Delete("{segmentId}")
  public async deleteSegment(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<boolean>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const result = await this.segmentationService.deleteSegment(
        segmentId,
        organizationId
      );
      return {
        status: "success",
        data: result,
        message: result
          ? "Segment deleted successfully"
          : "Segment not found or already deleted",
      };
    } catch (error) {
      return {
        status: "error",
        data: false,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the segment",
      };
    }
  }

  @Get()
  public async listSegments(
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<Segment[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segments =
        await this.segmentationService.listSegments(organizationId);
      return {
        status: "success",
        data: segments,
        message: "Segments retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving segments",
      };
    }
  }

  @Get("{segmentId}/entities")
  public async getEntitiesInSegment(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<string[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const entities = await this.segmentationService.getEntitiesInSegment(
        segmentId,
        organizationId
      );
      return {
        status: "success",
        data: entities,
        message: "Entities in segment retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving entities in the segment",
      };
    }
  }

  @Get("{segmentId}/analytics")
  public async getSegmentAnalytics(
    @Path() segmentId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<SegmentAnalytics>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const analytics = await this.segmentationService.getSegmentAnalytics(
        segmentId,
        organizationId
      );
      return {
        status: "success",
        data: analytics,
        message: "Segment analytics retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving segment analytics",
      };
    }
  }

  @Get("entity/{entityId}")
  public async getSegmentsForEntity(
    @Path() entityId: string,
    @Request() request: AuthenticatedRequest
  ): Promise<ApiResponse<Segment[]>> {
    try {
      const user = request.user as JWTAuthenticatedUser;
      const organizationId = user.currentOrganizationId as string;
      const segments = await this.segmentationService.getSegmentsForEntity(
        entityId,
        organizationId
      );
      return {
        status: "success",
        data: segments,
        message: "Segments for entity retrieved successfully",
      };
    } catch (error) {
      return {
        status: "error",
        data: null,
        message:
          error instanceof Error
            ? error.message
            : "An error occurred while retrieving segments for the entity",
      };
    }
  }
}
