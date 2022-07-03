import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangaHomeComponent } from './mangahome.component';

describe('MangaHomeComponent', () => {
  let component: MangaHomeComponent;
  let fixture: ComponentFixture<MangaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MangaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
