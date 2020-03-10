import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionAdminSearchResultGridElementComponent } from './collection-admin-search-result-grid-element.component';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { CollectionElementLinkType } from '../../../object-collection/collection-element-link.type';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { Collection } from '../../../../core/shared/collection.model';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { getCollectionEditPath } from '../../../../+collection-page/collection-page-routing.module';

describe('CollectionAdminSearchResultListElementComponent', () => {
  let component: CollectionAdminSearchResultGridElementComponent;
  let fixture: ComponentFixture<CollectionAdminSearchResultGridElementComponent>;
  let id;
  let searchResult;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new CollectionSearchResult();
    searchResult.indexableObject = new Collection();
    searchResult.indexableObject.uuid = id;
  }
  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      declarations: [CollectionAdminSearchResultGridElementComponent],
      providers: [{ provide: TruncatableService, useValue: {} }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAdminSearchResultGridElementComponent);
    component = fixture.componentInstance;
    component.object = searchResult;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an edit button with the correct link', () => {
    const a = fixture.debugElement.query(By.css('a'));
    const link = a.nativeElement.href;
    expect(link).toContain(getCollectionEditPath(id));
  })
});
