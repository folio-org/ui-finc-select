# Change history for ui-finc-select

## 6.2.0 (IN PROGRESS)

## [6.1.0](https://github.com/folio-org/ui-finc-select/tree/v6.1.0) (2024-03-20)
* Remove deprecated pane properties ([UIFC-339](https://issues.folio.org/browse/UIFC-339))
* Buttons should be disabled if lacking required permissions ([UIFC-322](https://issues.folio.org/browse/UIFC-322))
* Use translation keys of stripes-components ([UIFC-348](https://folio-org.atlassian.net/browse/UIFC-348))

## [6.0.0](https://github.com/folio-org/ui-finc-select/tree/v6.0.0) (2023-10-18)
* Upgrade `react-dropzone` to v10 ([UIFC-329](https://issues.folio.org/browse/UIFC-329))
* Migrate to react-intl v6 ([UIFC-325](https://issues.folio.org/browse/UIFC-325))
* Upgrade React to v18 ([UIFC-318](https://issues.folio.org/browse/UIFC-318))
* Fix permission issues ([UIFC-321](https://issues.folio.org/browse/UIFC-321))
* Replace BigTest tests ([UIFC-289](https://issues.folio.org/browse/UIFC-289))
* Leverage cookie-based authentication in all API requests ([UIFC-316](https://issues.folio.org/browse/UIFC-316))
* Avoid private paths in stripes-core imports ([UIFC-311](https://issues.folio.org/browse/UIFC-311))

## [5.1.0](https://github.com/folio-org/ui-finc-select/tree/v5.1.0) (2023-03-16)
* Translations update

## [5.0.0](https://github.com/folio-org/ui-finc-select/tree/v5.0.0) (2023-02-23)
* Bump Stripes to v8, drop `react-redux`, `redux`, bump `plugin-find-finc-metadata-source` ([UIFC-291](https://issues.folio.org/browse/UIFC-291))
* No results shown on first open ([UIFC-300](https://issues.folio.org/browse/UIFC-300))
* Upgrade stripes-erm-components to v8 ([UIFC-299](https://issues.folio.org/browse/UIFC-299))

## [4.1.0](https://github.com/folio-org/ui-finc-select/tree/v4.1.0) (2022-10-26)
* Fix yarn test download (UIFC-277)
* Replace babel-eslint with @babel/eslint-parser (UIFC-273)

## [4.0.0](https://github.com/folio-org/ui-finc-select/tree/v4.0.0) (2021-10-04)
* Increment stripes to v7 (UIFC-255)
* Replace BigTest tests by RTL/Jest (UIFC-230)

## [3.0.1](https://github.com/folio-org/ui-finc-select/tree/v3.0.1) (2021-06-14)
* Translation ast (UIFC-213)

## [3.0.0](https://github.com/folio-org/ui-finc-select/tree/v3.0.0) (2021-03-19)
* Increment `@folio/stripes` to `v6.0` (UIFC-233)

## [2.0.1](https://github.com/folio-org/ui-finc-select/tree/v2.0.1) (2020-11-20)
* Bugifx: Metadata sources 'Selected' filter (UIFC-224)
* Bugfix: Metadata collections 'Usage permitted' & 'selected' filter (UIFC-225)

## [2.0.0](https://github.com/folio-org/ui-finc-select/tree/v2.0.0) (2020-10-15)
* Increment `@folio/stripes` to `v5.0` and `react-router` to `v5.2` (and, bugfix, move it to peer)
* Upgrade to interface `finc-select/metadata-sources` to `3.0`
* Permission names are localizable (UIFC-218)

## [1.7.0](https://github.com/folio-org/ui-finc-select/tree/v1.7.0) (2020-09-08)
* Be compliant to language rules (UIFC-212)
* Increment interface version `finc-select/metadata-sources` to 3.0

## [1.6.1](https://github.com/folio-org/ui-finc-select/tree/v1.6.1) (2020-08-28)
* Bugfix: User interface finc-select/metadata-sources v2.0

## [1.6.0](https://github.com/folio-org/ui-finc-select/tree/v1.6.0) (2020-08-28)
* Replace deprecated `babel-polyfill` with `core-js` and `regenerator-runtime`
* Replace `bigtest/mirage` with `miragejs`
* Add collections to filters (UIFC-139)
* Add navigation to organizations app (UIFC-138)
* Bugfix: Content not displayed for some metadata sources (UIFC-162)
* Add record last updated information to metadata sources and collections (UIFC-155)
* Add credentials to settings in order to enable automatic harvesting of EZB files (UIFC-154)
* Enable field search on description for sources & collections (UIFC-172)
* Replace deprecated `@bigest/mirage` by `miragejs`

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
