# Change history for ui-finc-select

## [1.5.1](https://github.com/folio-org/ui-finc-select/tree/v1.5.1) (2020-03-13)
* Bugfix: Update version of required okapiInterface "finc-select/filters" to v1.1

## [1.5.0](https://github.com/folio-org/ui-finc-select/tree/v1.5.0) (2020-03-13)
* Migrate to final-form / react-final-form (UIFC-118)
* Fix several accessibility issues (UIFC-132)
* Upgrade to Stripes v3 (UIFC-146)
* Bugfix: Fetch more when scrolling down

## [1.4.0](https://github.com/folio-org/ui-finc-select/tree/v1.4.0) (2020-02-06)
* Bugfix: Incorrect view of mdSource name (UIFC-113)
* Default filter behaviour when switching between apps and/or tabs (UFIC-115)
* Add arrow icon to header in list of results (UIFC-119)
* Centering forms and add footer with save and cancle (UIFC-120)
* Bugfix: Set filters if clicking several times on the same navigation-tab (UFIC-123)

## [1.3.0](https://github.com/folio-org/ui-finc-select/tree/v1.3.0) (2020-01-14)
* Sort column "Source ID" numerically (UIFC-105)
* Bugfix: Incorrect permission names are used (UIFC-103)
* Use SearchAndSortQuery instead SearchAndSort (UIFC-95)

## [1.2.1](https://github.com/folio-org/ui-finc-select/tree/v1.2.1) (2019-10-14)
* Bugfix: Permission not found when opening Metadata Collections view.

## [1.2.0](https://github.com/folio-org/ui-finc-select/tree/v1.2.0) (2019-10-07)
* Filter files cannot be edited. On change files need to be deleted and posted (UIFC-88)
* Choosing a filter file is required (UIFC-87)
* Delete filter files (UIFC-76)

## [1.1.0](https://github.com/folio-org/ui-finc-select/tree/v1.1.0) (2019-09-18)
* Frontend manages filters filter-files (UIFC-60)
* Disable select button, if usage is not permitted (UIFC-72)
* Organizations plugin (UIFC-75)
* Adapt interface version
* Show name of filterfile in edit form (UIFC-77)
* Rename permissions (UIFC-78)
* Change order of filters (UIFC-74)
* Set default filters for finc-select (UIFC-80)
* Update dependencies; fixing warnings (UIFC-82)

## [1.0.0](https://github.com/folio-org/ui-finc-select/tree/v1.0.0) (2019-07-23)
* Frontend manages filters SearchAndSort (UIFC-56)
* "show selected collections" redirects to filtered collections list view (UIFC-44)
* Add Select-Source-Filter for collections-SearchAndSort (UIFC-53)
* "show all collections" redirects to filtered collections list view (UIFC-45)
* Select/Unselect function (UIFC-51)
* Add modal for selectAllCollections-function; re-ordering of note-fields
* Get name of source in collection-detail-view
* restructure file-ordering; remove edit- and new-mode for source; add edit-form for collection
* Detail-view for metadata source and metadata collection
* Set searchAndSort, resultlist and info-part of detail-view for source and collection
* Set basic structur for SearchAndSort and Tabs
* New app created with stripes-cli
