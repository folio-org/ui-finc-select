
import PropTypes from 'prop-types';

import ViewContainer from '../DisplayUtils/ViewContainer';
import FilterInfoView from './FilterInfo/FilterInfoView';
import FilterFileView from './FilterFile/FilterFileView';
import CollectionsView from './Collections/CollectionsView';

const FilterView = (props) => {
  const { collectionIds } = props;

  const accordionConfig = [
    {
      id: 'fileAccordion',
      labelId: 'ui-finc-select.filter.fileAccordion',
      Component: FilterFileView,
    },
    {
      id: 'collectionAccordion',
      labelId: 'ui-finc-select.filter.collectionAccordion',
      Component: CollectionsView,
    },
  ];

  return (
    <ViewContainer
      accordionConfig={accordionConfig}
      additionalProps={{ collectionIds }}
      idPrefix="filter"
      infoComponent={FilterInfoView}
      recordPropKey="filter"
      {...props}
    />
  );
};

FilterView.propTypes = {
  collectionIds: PropTypes.arrayOf(PropTypes.object),
};

export default FilterView;
