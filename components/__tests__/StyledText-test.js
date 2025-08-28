
import * as React from 'react';
import renderer, { act } from 'react-test-renderer';
import { MonoText } from '../StyledText';

// Mock only useColorScheme to avoid TurboModuleRegistry errors
jest.spyOn(require('react-native'), 'useColorScheme').mockImplementation(() => 'light');

it('renders correctly', () => {
  let tree;
  act(() => {
    tree = renderer.create(<MonoText>Snapshot test!</MonoText>).toJSON();
  });
  expect(tree).toMatchSnapshot();
});
