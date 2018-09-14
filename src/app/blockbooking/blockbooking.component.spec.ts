import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockbookingComponent } from './blockbooking.component';

describe('BlockbookingComponent', () => {
  let component: BlockbookingComponent;
  let fixture: ComponentFixture<BlockbookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockbookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockbookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
