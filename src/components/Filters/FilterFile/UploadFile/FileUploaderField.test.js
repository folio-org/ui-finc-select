import { MemoryRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

import { waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { StripesContext, useStripes } from '@folio/stripes/core';

import FileUploaderField from './FileUploaderField';
import { MAX_FILE_SIZE_BYTES } from '../../../../util/fileUtils';
import renderWithIntlConfiguration from '../../../../../test/jest/helpers/renderWithIntlConfiguration';

// Mock react-dropzone to control onDrop directly
let mockOnDrop;
jest.mock('react-dropzone', () => ({
  useDropzone: (config) => {
    mockOnDrop = config.onDrop;
    return {
      getRootProps: () => ({ tabIndex: 0 }),
      getInputProps: () => ({ id: 'filter-file-input' }),
    };
  },
}));

const mockOnUploadFile = jest.fn();
const mockOnChange = jest.fn();

const renderComponent = (stripes, metaOverrides = {}) => {
  return renderWithIntlConfiguration(
    <StripesContext.Provider value={stripes}>
      <MemoryRouter>
        <Form
          onSubmit={jest.fn()}
          render={() => (
            <Field
              name="fileId"
              render={({ input, meta }) => (
                <FileUploaderField
                  input={{ ...input, onChange: mockOnChange }}
                  meta={{ ...meta, ...metaOverrides }}
                  onUploadFile={mockOnUploadFile}
                />
              )}
            />
          )}
        />
      </MemoryRouter>
    </StripesContext.Provider>
  );
};

jest.unmock('react-intl');

describe('FileUploaderField', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    mockOnUploadFile.mockClear();
    mockOnChange.mockClear();
  });

  describe('Validation error timing', () => {
    it('should not show validation error when untouched', () => {
      const { container } = renderComponent(stripes, {
        touched: false,
        error: 'Required',
      });

      const errorElement = container.querySelector('.errorMessage:not([hidden])');
      expect(errorElement).not.toBeInTheDocument();
    });

    it('should show validation error when touched', () => {
      const { container } = renderComponent(stripes, {
        touched: true,
        error: 'Required',
      });

      const errorElement = container.querySelector('.errorMessage');
      expect(errorElement).not.toHaveAttribute('hidden');
    });

    it('should show validation error when submit failed', () => {
      const { container } = renderComponent(stripes, {
        submitFailed: true,
        error: 'Required',
      });

      const errorElement = container.querySelector('.errorMessage');
      expect(errorElement).not.toHaveAttribute('hidden');
    });
  });

  describe('File size validation', () => {
    it('should accept valid files and reject oversized files', async () => {
      // Test 1: Accept file under limit
      renderComponent(stripes);

      const smallFile = new File(['test'], 'small.txt', { type: 'text/plain' });
      Object.defineProperty(smallFile, 'size', { value: 1024 * 1024 }); // 1 MB

      mockOnUploadFile.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('file-id-123'),
      });

      await mockOnDrop([smallFile]);

      expect(mockOnUploadFile).toHaveBeenCalledWith(smallFile);
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('file-id-123');
      });

      // Test 2: Accept file exactly at limit
      mockOnUploadFile.mockClear();
      mockOnChange.mockClear();

      const maxFile = new File(['test'], 'max.txt');
      Object.defineProperty(maxFile, 'size', { value: MAX_FILE_SIZE_BYTES });

      mockOnUploadFile.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('file-id-456'),
      });

      await mockOnDrop([maxFile]);

      expect(mockOnUploadFile).toHaveBeenCalledWith(maxFile);
      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith('file-id-456');
      });
    });

    it('should reject files over the limit', async () => {
      const { container } = renderComponent(stripes);

      const largeFile = new File(['test'], 'large.txt');
      Object.defineProperty(largeFile, 'size', { value: MAX_FILE_SIZE_BYTES + 1 });

      await mockOnDrop([largeFile]);

      expect(mockOnUploadFile).not.toHaveBeenCalled();

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
      });
    });
  });

  describe('Upload error handling', () => {
    it('should handle 413 with valid backend message', async () => {
      const { container } = renderComponent(stripes);

      const file = new File(['test'], 'test.txt');

      mockOnUploadFile.mockResolvedValue({
        ok: false,
        status: 413,
        text: () => Promise.resolve('File size limit exceeded'),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
      });
    });

    it('should sanitize HTML in backend messages', async () => {
      const { container } = renderComponent(stripes);

      const file = new File(['test'], 'test.txt');

      mockOnUploadFile.mockResolvedValue({
        ok: false,
        status: 413,
        text: () => Promise.resolve('<script>alert("xss")</script>'),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement.textContent).not.toContain('<script>');
      });
    });

    it('should reject overly long backend messages', async () => {
      const { container } = renderComponent(stripes);

      const file = new File(['test'], 'test.txt');
      const longMessage = 'a'.repeat(250);

      mockOnUploadFile.mockResolvedValue({
        ok: false,
        status: 413,
        text: () => Promise.resolve(longMessage),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement.textContent).not.toContain(longMessage);
      });
    });

    it('should handle network errors', async () => {
      const { container } = renderComponent(stripes);

      const file = new File(['test'], 'test.txt');

      mockOnUploadFile.mockResolvedValue({
        ok: false,
        status: 500,
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
      });
    });

    it('should handle rejected promises', async () => {
      const { container } = renderComponent(stripes);

      const file = new File(['test'], 'test.txt');

      mockOnUploadFile.mockRejectedValue(new Error('Network failure'));

      await mockOnDrop([file]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
      });
    });

    it('should handle response.text() failure', async () => {
      const { container } = renderComponent(stripes);

      const file = new File(['test'], 'test.txt');

      mockOnUploadFile.mockResolvedValue({
        ok: false,
        status: 413,
        text: () => Promise.reject(new Error('Read failed')),
      });

      await mockOnDrop([file]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should reject multiple files', async () => {
      renderComponent(stripes);

      const file1 = new File(['test1'], 'test1.txt');
      const file2 = new File(['test2'], 'test2.txt');

      await mockOnDrop([file1, file2]);

      expect(mockOnUploadFile).not.toHaveBeenCalled();
    });

    it('should handle zero-byte files', async () => {
      renderComponent(stripes);

      const file = new File([''], 'empty.txt');
      Object.defineProperty(file, 'size', { value: 0 });

      mockOnUploadFile.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('empty-file-id'),
      });

      await mockOnDrop([file]);

      expect(mockOnUploadFile).toHaveBeenCalledWith(file);
    });

    it('should clear errors on successful upload', async () => {
      const { container } = renderComponent(stripes);

      // First, trigger an error
      const largeFile = new File(['test'], 'large.txt');
      Object.defineProperty(largeFile, 'size', { value: MAX_FILE_SIZE_BYTES + 1 });

      await mockOnDrop([largeFile]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).toBeInTheDocument();
      });

      // Now upload a valid file
      const validFile = new File(['test'], 'valid.txt');
      Object.defineProperty(validFile, 'size', { value: 1024 });

      mockOnUploadFile.mockResolvedValue({
        ok: true,
        text: () => Promise.resolve('valid-file-id'),
      });

      await mockOnDrop([validFile]);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage:not([hidden])');
        expect(errorElement).not.toBeInTheDocument();
      });
    });
  });
});
