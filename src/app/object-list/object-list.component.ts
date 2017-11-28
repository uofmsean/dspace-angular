import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';

import { RemoteData } from '../core/data/remote-data';
import { PageInfo } from '../core/shared/page-info.model';
import { ListableObject } from '../object-list/listable-object/listable-object.model';

import { fadeIn } from '../shared/animations/fade';
import { hasValue } from '../shared/empty.util';

import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-list',
  styleUrls: ['./object-list.component.scss'],
  templateUrl: './object-list.component.html',
  animations: [fadeIn]
})
export class ObjectListComponent {

  @Input() config: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() hideGear = false;
  @Input() hidePagerWhenSinglePage = true;
  private _objects: RemoteData<ListableObject[]>;
  pageInfo: PageInfo;
  @Input() set objects(objects: RemoteData<ListableObject[]>) {
    this._objects = objects;
    if (hasValue(objects)) {
      this.pageInfo = objects.pageInfo;
    }
  }
  get objects() {
    return this._objects;
  }

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() change: EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }> = new EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }>();

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the page wsize is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the sort direction is changed.
   * Event's payload equals to the newly selected sort direction.
   */
  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter<SortDirection>();

  @Output() paginationChange: EventEmitter<SortDirection> = new EventEmitter<any>();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();
  data: any = {};

  onPageChange(event) {
    this.pageChange.emit(event);
  }

  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }

  onSortDirectionChange(event) {
    this.sortDirectionChange.emit(event);
  }

  onSortFieldChange(event) {
    this.sortFieldChange.emit(event);
  }

  onPaginationChange(event) {
    this.paginationChange.emit(event);
  }

}