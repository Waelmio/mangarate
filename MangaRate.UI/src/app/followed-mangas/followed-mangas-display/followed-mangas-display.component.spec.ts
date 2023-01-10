import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedMangasDisplayComponent } from './followed-mangas-display.component';

describe('FollowedMangasDisplayComponent', () => {
  let component: FollowedMangasDisplayComponent;
  let fixture: ComponentFixture<FollowedMangasDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowedMangasDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedMangasDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
