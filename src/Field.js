import React, {PureComponent as Component, Children} from 'react';
import easyFieldWrapper from './easyFieldWrapper';
import omit from 'lodash/omit';
import objectValues from 'lodash/values';
import filterProps from './filterProps';

class Field extends Component {
    static defaultProps = {
        type: 'text'
    }

    renderByType(props, children) {
        switch(props.type) {
            case 'select':
                return <select {...props}>{children}</select>;
            case 'radio':
            case 'checkbox':
                return <label><input {...props} />{props.label}</label>
            case 'textarea':
                return <textarea {...props} />
            default:
                return <input {...props} />
        }
    }

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
        const {type} = this.props,
            $input = this.$input;

        if($input.nodeName && $input.nodeName.toUpperCase() == 'INPUT' &&
            (type == 'radio' || type == 'checkbox') &&
            !$input.checked) {
            return null;
        }

        return this.$input.value.trim();
    }

    onEvent = ev => this.props.$trigger(ev);

    render() {
        const optionsChildren = []; //提取select项的option子节点
        const children = [];

        const { $errorLevel, className, noError, type } = this.props;
        const { $error, $invalid, $focusing, $dirty } = this.props.easyfield;

        const classes = [];
        const groupClasses = ['form-group'];

        if(type != 'checkbox' && type != 'radio') {
            classes.push('form-control');
        }

        "dirty valid invalid touched focusing pending"
            .split(" ")
            .forEach(name => {
                if(this.props.easyfield['$' + name]) {
                    classes.push(`ef-${name}`);
                }
            });

        Children.forEach(this.props.children, elem => {
            elem.type == 'option' ?
                optionsChildren.push(elem) :
                children.push(elem);
        });

        const myProps = {
            ...omit(this.props, ...filterProps),
            ref: this.refCallback,
            onChange: this.onEvent,
            onFocus: this.onEvent,
            onBlur: this.onEvent,
            className: Object
                        .keys($error || {})
                        .map(name => `ef-error-${name}`)
                        .concat(classes)
                        .join(' ')
        }

        if (className) {
            groupClasses.push(className);
        }

        if ($invalid) {
            groupClasses.push('has-ef-error');
        }

        return (
            <div className={groupClasses.join(' ')}>
                { this.renderByType(myProps, optionsChildren) }
                { children }
                { $error && !noError && $errorLevel &&
                        ($errorLevel == 1 && $focusing || $errorLevel == 2 && $dirty || $errorLevel == 3) ?
                        <div className="ef-error-tip">{objectValues($error)[0]}</div> : null }
            </div>
        );
    }
}

export default easyFieldWrapper(Field);
