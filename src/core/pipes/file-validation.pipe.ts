import {
  Injectable,
  PipeTransform,
  BadRequestException,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';

// Define the shape of the validation rules for a single field
interface FieldValidationOptions {
  fileType: string | RegExp;
  maxSizeMb: number;
  required?: boolean;
}

// The options object will have keys matching the file fields (e.g., 'logo', 'banner')
export type CustomFileValidatorOptions = Record<string, FieldValidationOptions>;

type MulterFilesObject =
  | Record<string, Express.Multer.File[] | undefined>
  | undefined;

@Injectable()
export class CustomFileValidatorPipe
  implements PipeTransform<MulterFilesObject, Promise<MulterFilesObject>>
{
  constructor(private readonly options: CustomFileValidatorOptions) {}

  async transform(files: MulterFilesObject): Promise<MulterFilesObject> {
    // If no files are uploaded, check for required fields
    if (!files) {
      for (const fieldName in this.options) {
        if (this.options[fieldName].required) {
          throw new BadRequestException(`Missing required file: ${fieldName}`);
        }
      }
      // --- FIX: Return an empty object instead of undefined ---
      // This prevents "Cannot read properties of undefined" in the service
      // if the controller forgets to use 'files ?? {}'
      return {};
      // --- END FIX ---
    }

    const errorMessages: string[] = [];

    // 1. Iterate over the validation rules we provided (e.g., 'logo', 'banner')
    for (const fieldName in this.options) {
      const fieldOptions = this.options[fieldName];
      const uploadedFiles = files[fieldName]; // Get the files for this specific field

      // 2. Check if the field was required but is missing
      if (
        fieldOptions.required &&
        (!uploadedFiles || uploadedFiles.length === 0)
      ) {
        errorMessages.push(`Missing required file: ${fieldName}`);
        continue; // Move to the next field
      }

      // 3. If files are present for this field, validate each one
      if (uploadedFiles && uploadedFiles.length > 0) {
        const fileTypeValidator = new FileTypeValidator({
          fileType: fieldOptions.fileType,
        });
        const maxSizeValidator = new MaxFileSizeValidator({
          maxSize: fieldOptions.maxSizeMb * 1024 * 1024,
          message: `File ${fieldName} exceeds the ${fieldOptions.maxSizeMb}MB limit.`,
        });

        for (const file of uploadedFiles) {
          // Check file type
          if (!(await fileTypeValidator.isValid(file))) {
            errorMessages.push(
              `Invalid file type for ${fieldName}: ${file.originalname}. Expected ${fieldOptions.fileType}.`,
            );
          }
          // Check file size
          if (!maxSizeValidator.isValid(file)) {
            errorMessages.push(
              `File ${fieldName} is too large: ${file.originalname}. Max size is ${fieldOptions.maxSizeMb}MB.`,
            );
          }
        }
      }
    }

    // 4. If any errors were collected, throw a single combined exception
    if (errorMessages.length > 0) {
      throw new BadRequestException(errorMessages.join('; '));
    }

    // 5. If all validations passed, return the original 'files' object
    return files;
  }
}
