// @ts-nocheck
/**
 * Input Factory for Cortex UI
 *
 * Registers all custom input components for use with @harnessio/forms.
 * This factory is used when rendering forms with RenderForm component.
 */

import { InputFactory } from '@harnessio/forms';
import { TextInput } from './inputs/TextInput';
import { TextareaInput } from './inputs/TextareaInput';
import { SelectInput } from './inputs/SelectInput';
import { BooleanInput } from './inputs/BooleanInput';
import { NumberInput } from './inputs/NumberInput';
import { CheckboxInput } from './inputs/CheckboxInput';
import { RadioInput } from './inputs/RadioInput';
import { FileInput } from './inputs/FileInput';

// Create the input factory instance
export const inputFactory = new InputFactory();

// Register all custom input components
inputFactory.register(new TextInput());
inputFactory.register(new TextareaInput());
inputFactory.register(new SelectInput());
inputFactory.register(new BooleanInput());
inputFactory.register(new NumberInput());
inputFactory.register(new CheckboxInput());
inputFactory.register(new RadioInput());
inputFactory.register(new FileInput());

// Export the factory as default for convenience
export default inputFactory;
