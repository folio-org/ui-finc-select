import { FormattedMessage } from 'react-intl';

const Required = (value) => {
  if (value) return undefined;
  return <FormattedMessage id="ui-finc-select.form.validate.required" />;
};

export default Required;
