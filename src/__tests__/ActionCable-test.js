import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ActionCableProvider, { cable } from '../index';

test('Render wrapped component without children', () => {
  const Wrapped = cable(<div />);
  const node = shallow(
    <ActionCableProvider>
      <Wrapped />
    </ActionCableProvider>
  );

  expect(node.find(Wrapped)).to.have.length(1);
});

test('Default exporting ActionCableProvider works', () => {
  const node = shallow(
    <ActionCableProvider>
      <div />
    </ActionCableProvider>
  );

  expect(node.find('div')).to.have.length(1);
});
