import { TestBed } from '@angular/core/testing';

import { ImagenAstronomicaService } from './imagenAstronomica.service';

describe('ImagenAstronomicaService', () => {
  let service: ImagenAstronomicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagenAstronomicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
