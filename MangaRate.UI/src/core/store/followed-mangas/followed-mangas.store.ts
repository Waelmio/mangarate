import { Injectable } from '@angular/core';
import { MangaMap } from '@core/Models/API/Manga';
import { Selector, State, Action, StateContext } from '@ngxs/store';
import { LoadFollowedManga, LoadAllFollowedMangas, RemoveFollowedManga } from './followed-mangas.actions';

export interface FollowedMangasStateModel {
    mangaMap: MangaMap;
}

const defaults: FollowedMangasStateModel = {
    mangaMap: {}
};

@State<FollowedMangasStateModel>({
    name: 'followedMangas',
    defaults
})
@Injectable()
export class FollowedMangasState {

    @Selector()
    static allFollowedMangas(state: FollowedMangasStateModel) {
        return Object.values(state.mangaMap);
    }

    @Action(LoadAllFollowedMangas)
    loadAll({ setState }: StateContext<FollowedMangasStateModel>, { mangas }: LoadAllFollowedMangas) {
        const mangasMap: MangaMap = {};
        mangas.forEach((manga) => mangasMap[manga.id] = manga);
        setState({ mangaMap: mangasMap });
    }
    
    @Action(LoadFollowedManga)
    load({ getState, setState }: StateContext<FollowedMangasStateModel>, { manga }: LoadFollowedManga) {
        const state = getState();
        state.mangaMap[manga.id] = manga;
        setState(state);
    }

    @Action(RemoveFollowedManga)
    remove({ getState, setState }: StateContext<FollowedMangasStateModel>, { manga }: RemoveFollowedManga) {
        const state = getState();
        delete state.mangaMap[manga.id];
        setState(state);
    }
}
