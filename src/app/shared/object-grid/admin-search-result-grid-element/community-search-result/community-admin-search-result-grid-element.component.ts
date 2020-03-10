import { Component } from '@angular/core';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { CommunitySearchResult } from '../../../object-collection/shared/community-search-result.model';
import { Community } from '../../../../core/shared/community.model';
import { getCommunityEditPath } from '../../../../+community-page/community-page-routing.module';
import { SearchResultGridElementComponent } from '../../search-result-grid-element/search-result-grid-element.component';

@listableObjectComponent(CommunitySearchResult, ViewMode.GridElement, Context.AdminSearch)
@Component({
  selector: 'ds-community-admin-search-result-grid-element',
  styleUrls: ['./community-admin-search-result-grid-element.component.scss'],
  templateUrl: './community-admin-search-result-grid-element.component.html'
})
/**
 * The component for displaying a list element for a community search result on the admin search page
 */
export class CommunityAdminSearchResultGridElementComponent extends SearchResultGridElementComponent<CommunitySearchResult, Community> {

  /**
   * Returns the path to the edit page of this community
   */
  getEditPath(): string {
    return getCommunityEditPath(this.dso.uuid)
  }
}
