import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedmangasComponent } from './followedmangas.component';

describe('FollowedmangasComponent', () => {
  let component: FollowedmangasComponent;
  let fixture: ComponentFixture<FollowedmangasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowedmangasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowedmangasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
