import React from 'react';
import { IntlProvider } from 'react-intl';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import stripesComponentsTranslations from '@folio/stripes-components/translations/stripes-components/en';
import stripesSmartComponentsTranslations from '@folio/stripes-smart-components/translations/stripes-smart-components/en';

import localTranslations from '../../../translations/ui-finc-select/en';

const translationSets = [
  {
    prefix: 'ui-finc-select',
    translations: localTranslations,
  },
  {
    prefix: 'stripes-components',
    translations: stripesComponentsTranslations,
  },
  {
    prefix: 'stripes-smart-components',
    translations: stripesSmartComponentsTranslations,
  },
];


function withIntlConfiguration(children, renderer = render) {
  const allTranslations = {};

  translationSets.forEach((set) => {
    const { prefix, translations } = set;
    Object.keys(translations).forEach(key => {
      allTranslations[`${prefix}.${key}`] = translations[key];
    });
  });

  return renderer(
    <IntlProvider locale="en-US" messages={allTranslations}>
      {children}
    </IntlProvider>
  );
}


export default withIntlConfiguration;
