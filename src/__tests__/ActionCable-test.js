import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Provider, { ActionCableProvider, ActionCable } from '../index';

test('ActionCable render without children', () => {
  const node = shallow(
    <ActionCableProvider>
      <ActionCable />
    </ActionCableProvider>
  );

  expect(node.find(ActionCable)).to.have.length(1);
});

test('ActionCable render with children', () => {
  const node = shallow(
    <ActionCableProvider>
      <ActionCable>
        <div>Hello</div>
      </ActionCable>
    </ActionCableProvider>
  );

  expect(node.find(ActionCable)).to.have.length(1);
  const div = node.find('div')
  expect(div).to.have.length(1);
});

test('Default exporting ActionCableProvider works', () => {
  const node = shallow(
    <Provider>
      <ActionCable />
    </Provider>
  );

  expect(node.find(ActionCable)).to.have.length(1);
});
