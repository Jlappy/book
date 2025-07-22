import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenLibrarySearchComponent } from './open-library-search.component';

describe('OpenLibrarySearchComponent', () => {
  let component: OpenLibrarySearchComponent;
  let fixture: ComponentFixture<OpenLibrarySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenLibrarySearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenLibrarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
