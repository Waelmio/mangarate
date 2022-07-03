import {
    Controller,
    Get,
    Path,
    Route,
    Response,
    Delete,
    Tags,
} from "tsoa";
import * as NotificationService from "../Services/database/Notification.db.service";
import { ApiError, ApiResponseError } from "../common/ApiError";
import { ChapterIdNotFoundError, MangaIdNotFoundError } from "../common/Error";
import { Logger } from "tslog";

const log = new Logger();


@Route("api/notification")
@Tags("Notifications")
export class NotificationController extends Controller {


    /**
     * Get all notifications, in the form of a list of manga with new chapters, from the database.
     * @summary Get all Notifications
    */
    @Get()
    async getNotifications() {
        const mangas = await NotificationService.getNotifications();
        return Object.values(mangas);
    }

    /**
     * Mark all notifications from a manga, meaning its new chapters, as read.
     * 
     * The manga is found using its id.
     * @summary Mark Manga as Read.
    */
    @Response<ApiResponseError>(415, "Validation Failed")
    @Response<ApiResponseError>(404, "Manga not found")
    @Delete('manga/{id}')
    async deleteNotificationsForManga(
        @Path() id: number
    ) : Promise<void> {
        try {
            this.setStatus(200);
            await NotificationService.deleteNotificationsForManga(id);
        }
        catch (ex) {
            if (ex instanceof MangaIdNotFoundError) {
                throw new ApiError(ex.message, 404);
            }
            throw ex;
        }
    }

    /**
     * Mark a notification, corresponding to a single chapter, as read.
     * 
     * The chapter is found using its id.
     * @summary Mark Chapter as Read.
    */
    @Response<ApiResponseError>(415, "Validation Failed")
    @Response<ApiResponseError>(404, "Chapter not found")
    @Delete('chapter/{id}')
    async deleteNotificationsForChapter(
        @Path() id: number
    ) : Promise<void> {
        try {
            this.setStatus(200);
            await NotificationService.deleteNotificationsForChapter(id);
        }
        catch (ex) {
            if (ex instanceof ChapterIdNotFoundError) {
                throw new ApiError(ex.message, 404);
            }
            throw ex;
        }
    }
}