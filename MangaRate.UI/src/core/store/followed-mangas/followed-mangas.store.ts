import { Injectable } from '@angular/core';
import { MangaMap } from '@core/Models/API/MangaMap';
import { Selector, State, Action, StateContext } from '@ngxs/store';
import { AddFollowedManga, LoadFollowedMangas } from './followed-mangas.actions';

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

    @Action(AddFollowedManga)
    add({ getState, setState }: StateContext<FollowedMangasStateModel>, { manga }: AddFollowedManga) {
        const state = getState();
        state.mangaMap[manga.id] = manga;
        setState(state);
    }

    @Action(LoadFollowedMangas)
    loadAll({ setState }: StateContext<FollowedMangasStateModel>, { mangas }: LoadFollowedMangas) {
        const mangasMap: MangaMap = {};
        mangas.forEach((manga) => mangasMap[manga.id] = manga);
        setState({ mangaMap: mangasMap });
    }
}
