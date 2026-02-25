import ViewContainer from '../DisplayUtils/ViewContainer';
import CollectionContentView from './CollectionContent/CollectionContentView';
import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';

const MetadataCollectionView = (props) => {
  const accordionConfig = [
    {
      id: 'contentAccordion',
      labelId: 'ui-finc-select.collection.accordion.content',
      Component: CollectionContentView,
    },
    {
      id: 'technicalAccordion',
      labelId: 'ui-finc-select.collection.accordion.technical',
      Component: CollectionTechnicalView,
    },
  ];

  return (
    <ViewContainer
      accordionConfig={accordionConfig}
      idPrefix="collection"
      infoComponent={CollectionInfoView}
      recordPropKey="metadataCollection"
      {...props}
    />
  );
};

export default MetadataCollectionView;
