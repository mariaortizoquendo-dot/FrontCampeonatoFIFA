import { TestBed } from '@angular/core/testing';

import { SeleccionServicio } from './seleccion-servicio';

describe('SeleccionServicio', () => {
  let service: SeleccionServicio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeleccionServicio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
