import { IBaseManga, IManga } from "..//Models/API/Manga";
import { faker } from '@faker-js/faker';
import { IBaseChapter } from "../Models/API/Chapter";
import { addMangaToDB } from "../Services/database/Manga.db.service";
import { addNotificationsToDB } from "../Services/database/Notification.db.service";

export async function MangaGenerator(amount = -1): Promise<IBaseManga[]> {
    const mangas_to_be: IBaseManga[] = [];

    let how_much = amount;

    if (amount === -1) {
        how_much = 10;
    }

    for (let i = 0; i < how_much; i++) {
        const chapters: IBaseChapter[] = [];
        const chaps_amount = 15 + Math.floor(Math.random() * 15);

        for (let j = 0; j < chaps_amount; j++) {
            chapters.push(
                {
                    num: j+1,
                    url: faker.internet.url(),
                    release_date: faker.date.past()
                }
            );
        }

        mangas_to_be.push({
            name: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            content_page_url: faker.internet.url(),
            cover_image: faker.image.imageUrl(),
            chapters: chapters,
            last_update: faker.date.past()
        });
    }

    return mangas_to_be;
}

export async function FollowedMangaGeneratorSaver(amount = -1): Promise<void> {
    const mangas_to_be: IBaseManga[] = await MangaGenerator(amount);
    
    const mangas_to_be_prom: Promise<IManga>[] = [];
    
    mangas_to_be.forEach((manga) => mangas_to_be_prom.push(addMangaToDB(manga)));
    const mangas: IManga[] = await Promise.all(mangas_to_be_prom);

    const notifs_prom: Promise<void>[] = [];

    mangas.forEach((manga) => notifs_prom.push(addNotificationsToDB(manga.id, Object.values(manga.chapters))));

    await Promise.all(notifs_prom);
}

async function main() {
    if (process.env.FOLLOWED_MANGAS) {
        await FollowedMangaGeneratorSaver(parseInt(process.env.FOLLOWED_MANGAS));
    }
}

main();