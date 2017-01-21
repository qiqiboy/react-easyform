import React, {PureComponent as Component, Children} from 'react';
import easyFieldWrapper from './easyFieldWrapper';
import omit from 'lodash/omit';
import objectValues from 'lodash/values';
import classlist from './classlist';
import filterProps from './filterProps';

class Field extends Component {
    static defaultProps = {
        type: 'text'
    }

    componentDidMount() {
        this.props.__init__(this.$input);
    }

    componentWillUnmount() {
        this.props.__destroy__();
    }

    renderByType(myProps, children) {
        switch(myProps.type) {
            case 'select':
                return <select {...myProps}>{children}</select>;
            case 'radio':
            case 'checkbox':
                return <label><input {...myProps} />{myProps.label}</label>
            case 'textarea':
                return <textarea {...myProps} />
            default:
                return <input {...myProps} />
        }
    }

    render() {
        let myProps = omit(this.props, ...filterProps);
        const {$error, $dirty, $focusing, $invalid, $touched, $pending} = this.props.easyfield;
        const {className, noError} = this.props;
        const {__errorLevel__} = this.props;
        const classes = {
            'form-control': myProps.type != 'radio' && myProps.type != 'checkbox',
            'ef-dirty': $dirty,
            'ef-valid': !$invalid,
            'ef-invalid': $invalid,
            'ef-touched': $touched,
            'ef-focusing': $focusing,
            'ef-pending': $pending
        }

        const optionsChildren = [];
        const children = [];

        Children.forEach(this.props.children, (elem, index) => {
            elem.type == 'option' ?
                optionsChildren.push(elem) :
                children.push(elem);
        });

        myProps.ref = input => this.$input = input;

        //添加对应的错误的classname
        if($error) {
            Object.keys($error).forEach(name => classes[`ef-error-${name}`] = true);
        }

        myProps.className = classlist(classes);

        return (
            <div className={(className ? className + ' ' : '') + classlist({'form-group': true, 'has-error': $invalid})}>
                { this.renderByType(myProps, optionsChildren) }
                { children }
                {$error && !noError && __errorLevel__ &&
                        (__errorLevel__ == 1 && $focusing || __errorLevel__ == 2 && $dirty || __errorLevel__ == 3) ? 
                        <div className="ef-error-tip">{objectValues($error)[0]}</div> : null }
            </div>
        );
    }
}

export default easyFieldWrapper(Field);
