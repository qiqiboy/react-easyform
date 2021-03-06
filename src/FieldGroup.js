import React, { PureComponent as Component, cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import easyFieldWrapper from './easyFieldWrapper';
import objectValues from 'lodash/values';
import find from 'lodash/find';

class FieldGroup extends Component {
    getChecked(value) {
        const {type} = this.props;
        const $viewValue = this.getValue();

        if(type == 'radio') {
            return {
                checked: $viewValue == value
            }
        }

        if(type == 'checkbox') {
            return {
                checked: Array.isArray($viewValue) ? !!find($viewValue, item => value == item ) : false
            }
        }

        return {};
    }

    onChange = ev => this.props.$trigger(ev, 'change');
    onFocus = ev => this.props.$trigger(ev, 'focus');
    onBlur = ev => this.props.$trigger(ev, 'blur');

    /**
     * ref节点引用回调
     */
    refCallback = input => {
        this.$input = input;
    }

    /**
     * 供fieldWrapper调用的获取输入项值的方法
     * 如果是自定义表单组件，也需要提供该方法以确保filedwrapper可以正确获取到值
     */
    getValue = () => {
        if(!this.$input) {
            return this.props.defaultValue;
        }

        const inputs = this.$input.querySelectorAll('[name=' + this.props.name + ']');
        const checkedInputs = [].filter.call(inputs, input => input.checked);

        return this.props.type == 'checkbox' ?
                checkedInputs.map(input => input.value) :
                checkedInputs.length ? checkedInputs[0].value : null;
    }

    render() {
        const { $errorLevel, className, noError, type, name } = this.props;
        const { $error, $invalid, $focusing, $dirty } = this.props.easyfield;

        const classes = ['form-group-control'];

        "dirty valid invalid touched focusing pending"
            .split(" ")
            .forEach(name => {
                if(this.props.easyfield['$' + name]) {
                    classes.push(`ef-${name}`);
                }
            });

        if(className) {
            classes.push(className);
        }

        if ($invalid) {
            classes.push('has-ef-error');
        }

        const children = Children.map(this.props.children, (elem, index) => cloneElement(elem, {
            name, type,
            key: elem.key || index,
            'data-groupfield': true,
            onChange: this.onChange,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            ...this.getChecked(elem.props.value)
        }));

        const myProps = {
            ref: this.refCallback,
            className: Object
                        .keys($error || {})
                        .map(name => `ef-error-${name}`)
                        .concat(classes)
                        .join(' ')
        }

        return (
            <div {...myProps}>
                {children}
                {$error && !noError && $errorLevel &&
                        ($errorLevel == 1 && $focusing || $errorLevel == 2 && $dirty || $errorLevel == 3) ?
                        <div className="ef-error-tip">{objectValues($error)[0]}</div> : null }
            </div>
        );
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["radio", "checkbox"]).isRequired
    }
}

export default easyFieldWrapper(FieldGroup);

