import { TestBed } from '@angular/core/testing';

import { DatParserService } from './dat-parser.service';

describe('DatParserService', () => {
  let service: DatParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
