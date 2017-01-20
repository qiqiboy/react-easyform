import React, { PureComponent as Component, PropTypes, cloneElement, Children } from 'react';
import easyFieldWrapper from './easyFieldWrapper';
import omit from 'lodash/omit';
import objectValues from 'lodash/values';
import toArray from 'lodash/toArray';
import classlist from './classlist';
import filterProps from './filterProps';

class FieldGroup extends Component {
    static defaultProps = {
        className: 'form-inline'
    }

    componentDidMount() {
        let defaultValue = this.props.defaultValue;

        if(this.props.type == 'checkbox' && defaultValue != null && !Array.isArray(defaultValue)) {
            defaultValue = [defaultValue];
        }

        this.$input.value = defaultValue;

        this.props.__init__(this.$input);
    }

    onChange = (e) => {
        const checkedInputs = toArray(this.$input.querySelectorAll('[name=' + this.props.name + ']'))
            .filter(input => input.checked);
        const value = this.props.type == 'checkbox' ?
            checkedInputs.map(input => input.value) :
            e.target.value;

        this.$input.value = value;

        //触发FieldWrapper
        this.props.onChange(e);
    }

    onFocus = e => {
        this.props.onFocus(e);
    }

    onBlur = e => {
        this.props.onBlur(e);
    }

    getChecked(value) {
        const {type} = this.props;
        const {$viewValue} = this.props.easyfield;
        if(type == 'radio') {
            return {
                checked: $viewValue == value
            }
        }

        if(type == 'checkbox') {
            return {
                checked: Array.isArray($viewValue) ? !!$viewValue.find(item => value == item ) : false
            }
        }

        return {};
    }

    render() {
        let myProps = omit(this.props, 'onChange', ...filterProps);
        const {name, type, className, noError} = this.props;
        const {__errorLevel__} = this.props;
        const {$error, $dirty, $invalid, $touched, $focusing, $modelValue} = this.props.easyfield;
        const children = Children.map(this.props.children, (elem, index) => cloneElement(elem, {
            name, type,
            key: elem.key || index,
            __onChange__: this.onChange,
            __onFocus__: this.onFocus,
            __onBlur__: this.onBlur,
            ...this.getChecked(elem.props.value)
        }));

        const classes = {
            'form-group-control': true,
            'ef-dirty': $dirty,
            'ef-valid': !$invalid,
            'ef-invalid': $invalid,
            'ef-touched': $touched,
            'ef-focusing': $focusing
        }

        myProps.ref = input => this.$input = input;

        //添加对应的错误的classname
        if($error) {
            Object.keys($error).forEach(name => classes[`ef-error-${name}`] = true);
        }

        myProps.className = (className ? className + ' ' : '') + classlist(classes);

        return (
            <div {...myProps}>
                {children}
                {$error && !noError && __errorLevel__ &&
                        (__errorLevel__ == 1 && $focusing || __errorLevel__ == 2 && $dirty || __errorLevel__ == 3) ? 
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
