import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedMangaComponent } from './followed-manga.component';

describe('FollowedMangaComponent', () => {
  let component: FollowedMangaComponent;
  let fixture: ComponentFixture<FollowedMangaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowedMangaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedMangaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
