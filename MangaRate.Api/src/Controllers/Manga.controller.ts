import {
    Controller,
    Get,
    Path,
    Route,
    Response,
    SuccessResponse,
    Put,
    Tags,
    Query,
} from "tsoa";
import * as MangaDBService from "../Services/database/Manga.db.service";
import { MangaService } from "../Services/Manga.service";
import { IManga } from "../Models/API/Manga";
import { ApiError, ApiResponseError } from "../common/ApiError";
import { BadUrlException, ContentPageNotFoundError, MangaContentPageExistError, MangaIdNotFoundError, ProviderNotImplemented } from "../common/Error";
import { Logger } from "tslog";

const log = new Logger();

@Route("api/manga")
@Tags("Mangas")
export class MangaController extends Controller {

    /**
     * Get all mangas in the database with all their chapters.
     * @summary Get all Mangas
    */
    @Get()
    public async getAllMangas(): Promise<IManga[]> {
        const mangas = await MangaDBService.getMangas();
        return Object.values(mangas);
    }

    /**
     * Get a manga from the database with all its chapters from its id.
     * @summary Get Manga from id
    */
    @Response<ApiResponseError>(415, "Validation Failed")
    @Response<ApiResponseError>(404, "Manga not found")
    @Get("{id}")
    public async getManga(
        @Path() id: number
    ): Promise<IManga> {
        try {
            const manga = await MangaDBService.getManga(id);
            return manga;
        }
        catch (ex) {
            if (ex instanceof MangaIdNotFoundError) {
                throw new ApiError(ex.message, 404);
            }
            throw ex;
        }
    }

    /**
     * Attempts to find a manga using its url, and register it, with all its chapters, in the database.
     * @summary Register Manga from url
     * @param url Url of a chapter or of the content page of the manga
    */
    @SuccessResponse(201, "Manga Registered")
    @Response<ApiResponseError>(409, "Manga already registered")
    @Response<ApiResponseError>(415, "Validation Failed")
    @Response<ApiResponseError>(422, "Unable to use URL to find Manga")
    @Response<ApiResponseError>(501, "Website not implemented")
    @Put()
    public async registerManga(
        @Query() url: string
    ): Promise<IManga> {
        try {
            const addedManga = await MangaService.registerManga(url);
            this.setStatus(201);
            return addedManga;
        }
        catch (ex) {
            if (ex instanceof BadUrlException) {
                throw new ApiError(ex.message, 422);
            }
            else if (ex instanceof ProviderNotImplemented) {
                log.warn(ex.message);
                throw new ApiError(ex.message, 501);
            }
            else if (ex instanceof ContentPageNotFoundError) {
                throw new ApiError(ex.message, 422);
            }
            else if (ex instanceof MangaContentPageExistError) {
                throw new ApiError(
                    'This manga already exists in database.',
                    409
                );
            }
            throw ex;
        }
    }
}