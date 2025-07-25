import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenlibrarySearchComponent } from './openlibrary-search.component';

describe('OpenlibrarySearchComponent', () => {
  let component: OpenlibrarySearchComponent;
  let fixture: ComponentFixture<OpenlibrarySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenlibrarySearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenlibrarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
