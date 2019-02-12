import { Component, Inject } from '@angular/core';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions
} from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { BrowseByStartsWithType } from '../../shared/browse-by/browse-by.component';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { Item } from '../../core/shared/item.model';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowseService } from '../../core/browse/browse.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

@Component({
  selector: 'ds-browse-by-date-page',
  styleUrls: ['../+browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../+browse-by-metadata-page/browse-by-metadata-page.component.html'
})
/**
 * Component for browsing items by metadata definition of type 'date'
 * A metadata definition is a short term used to describe one or multiple metadata fields.
 * An example would be 'dateissued' for 'dc.date.issued'
 */
export class BrowseByDatePageComponent extends BrowseByMetadataPageComponent {

  defaultMetadataField = 'dc.date.issued';

  public constructor(@Inject(GLOBAL_CONFIG) public config: GlobalConfig,
                     protected route: ActivatedRoute,
                     protected browseService: BrowseService,
                     protected dsoService: DSpaceObjectDataService,
                     protected router: Router) {
    super(route, browseService, dsoService, router);
  }

  ngOnInit(): void {
    this.startsWithType = BrowseByStartsWithType.date;
    this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
    this.subs.push(
      observableCombineLatest(
        this.route.params,
        this.route.queryParams,
        this.route.data,
        (params, queryParams, data ) => {
          return Object.assign({}, params, queryParams, data);
        })
        .subscribe((params) => {
          const metadataField = params.metadataField || this.defaultMetadataField;
          this.metadata = params.metadata || this.defaultMetadata;
          this.startsWith = +params.startsWith || params.startsWith;
          const searchOptions = browseParamsToOptions(params, Object.assign({}), this.sortConfig, this.metadata);
          this.updatePageWithItems(searchOptions, this.value);
          this.updateParent(params.scope);
          this.updateStartsWithOptions(this.metadata, metadataField, params.scope);
        }));
  }

  updateStartsWithOptions(definition: string, metadataField: string, scope?: string) {
    this.subs.push(
      this.browseService.getFirstItemFor(definition, scope).subscribe((firstItemRD: RemoteData<PaginatedList<Item>>) => {
        let lowerLimit = this.config.browseBy.defaultLowerLimit;
        if (firstItemRD.payload.page.length > 0) {
          const date = firstItemRD.payload.page[0].findMetadata(metadataField);
          if (hasValue(date) && hasValue(+date.split('-')[0])) {
            lowerLimit = +date.split('-')[0];
          }
        }
        const options = [];
        const currentYear = new Date().getFullYear();
        const oneYearBreak = Math.floor((currentYear - this.config.browseBy.oneYearLimit) / 5) * 5;
        const fiveYearBreak = Math.floor((currentYear - this.config.browseBy.fiveYearLimit) / 10) * 10;
        if (lowerLimit <= fiveYearBreak) {
          lowerLimit -= 10;
        } else if (lowerLimit <= oneYearBreak) {
          lowerLimit -= 5;
        } else {
          lowerLimit -= 1;
        }
        let i = currentYear;
        while (i > lowerLimit) {
          options.push(i);
          if (i <= fiveYearBreak) {
            i -= 10;
          } else if (i <= oneYearBreak) {
            i -= 5;
          } else {
            i--;
          }
        }
        if (isNotEmpty(options)) {
          this.startsWithOptions = options;
        }
      })
    );
  }

}
