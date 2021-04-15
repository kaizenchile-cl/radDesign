import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Popper } from 'react-popper';
import Transition from 'react-motion-ui-pack';

const noFlipModifier = { flip: { enabled: false } };

const DropdownMenuProComponent = (props) => {
  const { isOpen, d_tag, d_tabIndex, d_role, d_attributes, d_aria, d_classes, d_key, children } = props;
  const Tag = d_tag;

  return (
    <Transition
      component={false}
      enter={{ opacity: 1, scale: 1 }}
      leave={{ opacity: 0, scale: 0.9 }}
    >
      {
        isOpen && 
        <Tag
          tabIndex={d_tabIndex}
          role={d_role}
          {...d_attributes}
          aria-hidden={d_aria}
          className={d_classes}
          key={d_key}
        >
          {children}
        </Tag> 
      }
    </Transition>
  );
};

DropdownMenuProComponent.propTypes = {
  d_aria: PropTypes.bool.isRequired,
  d_attributes: PropTypes.object.isRequired,
  d_key: PropTypes.string.isRequired,
  d_role: PropTypes.string.isRequired,
  d_tabIndex: PropTypes.string.isRequired,
  d_tag: PropTypes.any.isRequired,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  d_classes: PropTypes.string
};

DropdownMenuProComponent.defaultProps = {
  d_classes: ''
};

export default DropdownMenuProComponent;
export { DropdownMenuProComponent as MDBDropdownMenuProComponent };
