import React from 'react';
import { shallow, mount } from 'enzyme';
import actioncable from 'actioncable';
import {
  ActionCableProvider,
  ActionCableConsumer,
  ActionCableController
} from '../index';

describe(ActionCableProvider, () => {
  describe('with children', () => {
    it('renders children', () => {
      const node = shallow(
        <ActionCableProvider>
          <span>Child</span>
        </ActionCableProvider>
      );

      expect(node.children()).toHaveLength(1);
    });
  });

  describe('with no children', () => {
    it('renders null', () => {
      const node = shallow(<ActionCableProvider />);

      expect(node.children()).toHaveLength(0);
    });
  });
});

describe('ActionCableConsumer', () => {
  describe('wrapped with ForwardRef', () => {
    it('renders the ForwardRef', () => {
      const node = shallow(
        <ActionCableProvider>
          <ActionCableConsumer />
        </ActionCableProvider>
      );

      expect(node.find('ForwardRef')).toHaveLength(1);
    });

    it('renders the consumer', () => {
      const node = mount(
        <ActionCableProvider>
          <ActionCableConsumer />
        </ActionCableProvider>
      );

      const consumer = node.find('ActionCableConsumer');

      expect(consumer).toHaveLength(1);
    });

    it('renders the controller', () => {
      const node = mount(
        <ActionCableProvider>
          <ActionCableConsumer />
        </ActionCableProvider>
      );

      const controller = node.find('ActionCableController');

      expect(controller).toHaveLength(1);
    });
  });
});

describe('ActionCableController', () => {
  describe('with cable passed to provider', () => {
    it('passes cable to the controller as a prop', () => {
      const cable = actioncable.createConsumer('ws://test.example.com/cable');

      const node = mount(
        <ActionCableProvider cable={cable}>
          <ActionCableConsumer />
        </ActionCableProvider>
      );

      const controller = node.find('ActionCableController');

      expect(controller.prop('cable')).toStrictEqual(cable);
    });

    describe('with children', () => {
      it('renders children', () => {
        const cable = actioncable.createConsumer('ws://test.example.com/cable');

        const node = mount(
          <ActionCableProvider cable={cable}>
            <ActionCableConsumer>
              <span>Child</span>
            </ActionCableConsumer>
          </ActionCableProvider>
        );

        const controller = node.find('ActionCableController');

        expect(controller.children()).toHaveLength(1);
      });
    });

    describe('without children', () => {
      it('renders null', () => {
        const cable = actioncable.createConsumer('ws://test.example.com/cable');

        const node = mount(
          <ActionCableProvider cable={cable}>
            <ActionCableConsumer />>
          </ActionCableProvider>
        );

        const controller = node.find('ActionCableController');

        expect(controller.children()).toHaveLength(0);
      });
    });
  });
});
