import React from 'react';
import { render } from '@testing-library/react-native';
import { MonoText } from '../StyledText';

describe('MonoText', () => {
  it('renders children with SpaceMono font', () => {
    const { getByText } = render(<MonoText>Test Mono</MonoText>);
    const text = getByText('Test Mono');
    // Flatten style array and check for fontFamily
    const styleArray = Array.isArray(text.props.style) ? text.props.style.flat() : [text.props.style];
  expect(styleArray.some((s: any) => s && s.fontFamily === 'SpaceMono')).toBe(true);
  });
});
