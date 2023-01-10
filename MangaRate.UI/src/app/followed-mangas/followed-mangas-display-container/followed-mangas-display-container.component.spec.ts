import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedMangasDisplayContainerComponent } from './followed-mangas-display-container.component';

describe('FollowedMangasDisplayContainerComponent', () => {
  let component: FollowedMangasDisplayContainerComponent;
  let fixture: ComponentFixture<FollowedMangasDisplayContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowedMangasDisplayContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedMangasDisplayContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
