import { rest } from 'msw'; // msw supports graphql too!

const handlers = [
  rest.get(
    'https://folio-testing-okapi.dev.folio.org/finc-select/files/:fileId',
    async (req, res, ctx) => {
      const { fileId } = req.params;
      const file = {
        id: fileId,
        label: 'file label',
        _delete: false,
      };

      return res(ctx.json(file));
    }
  ),

  rest.post(
    'https://folio-testing-okapi.dev.folio.org/finc-select/files/',
    (req, res, ctx) => {
      return res(ctx.text('success'));
    }
  ),
];

export default handlers;
