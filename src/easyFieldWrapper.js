import React, { Component, PropTypes } from 'react';
import each from 'lodash/each';

const $defaultValidators = {
    required: value => value != null && value.length > 0,
    pattern: (value, pattern) => !pattern || (typeof pattern == 'function' ? pattern(value) : pattern.test(value)),
    confirm: (value, confirmed) => !confirmed.state.$viewValue || value == confirmed.state.$viewValue,
    minLength: (value, length) => value.length >= parseInt(length),
    maxLength: (value, length) => value.length <= parseInt(length),
    min: (value, minValue) => parseFloat(value) >= parseFloat(minValue),
    max: (value, maxValue) => parseFloat(value) <= parseFloat(maxValue)
}

export default function(WrappedComponent, config = {}) {
    const {parser, validator} = config;
    const $validators = {...$defaultValidators, ...(validator || {})};

    return class FieldWrapper extends Component {
        state = {
            $valid: true,
            $invalid: false,
            $dirty: false,
            $touched: false,
            $focusing: false,
            $pending: false,
            //$error: null,
            //$viewValue: '',
            $modelValue: null
        }

        getElem($input) {
            return $input.state ? this.getElem($input.$input) : $input;
        }

        parseValue = parser || ($input => {
            const elem = this.getElem($input);

            const type = elem.type;
            return elem.nodeName.toUpperCase() == 'INPUT' && (type == 'radio' || type == 'checkbox') && !elem.checked ?
                    null : elem.value
        })

        initField = $input => {
            const elem = this.getElem($input);
            this.$input = $input;

            this.onChange();

            if(document.activeElement == elem) {
                this.onFocus();
            }
        }

        destroy = () => {
            if(this.context.__easyformRender__) {
                this.context.__easyformRender__();
            }
        }

        checkEqual(oldV, newV) {
            const isRadio = this.$input.type == 'radio';

            return !isRadio && oldV === newV;
        }

        /**
         * 用户输入处理
         *
         */
        onChange = e => {
            let value = this.parseValue(this.$input);
            let {$dirty, $modelValue} = this.state;

            const {onChange, __onChange__} = this.props;
            const state = this.validate(value);

            const target = e && e.target;
            const type = e && e.type;

            const confirmField = this.props.confirm || this.props.confirmed;

            const triggerOnChange = () => {
                if(e && onChange && !this.checkEqual($modelValue, state.$modelValue)) {
                    onChange({
                        target, type
                    });
                }

                //confirm验证
                if(e && confirmField) {
                    confirmField.onChange();
                }
            }

            if(e && 'stopPropagation' in e) {
                e.stopPropagation();
            }

            this.triggerState({
                ...state,
                $dirty: $dirty || !!e
            })
            .then(triggerOnChange);

            if(e && __onChange__) {
                __onChange__(e);
            }
        }

        /**
         * 输入框获得焦点处理
         *
         */
        onFocus = e => {
            const {onFocus, __onFocus__} = this.props;

            this.triggerState({
                $focusing: true,
                $touched: true
            })
            .then(() => e && onFocus && onFocus(e));

            if(e && __onFocus__) {
                __onFocus__(e);
            }
        }

        /**
         * 输入框失去焦点处理
         *
         */
        onBlur = e => {
            const {onBlur, __onBlur__} = this.props;

            this.triggerState({
                $focusing: false
            })
            .then(() => e && onBlur && onBlur(e));

            if(e && __onBlur__) {
                __onBlur__(e);
            }
        }

        //验证器，返回state对象
        validate(value) {
            let $invalid = false,
                $error = {},
                props = this.props,
                $pending = !!props.asyncValidator;

            const {$dirty, $touched} = this.state;
            const validMessage = props.validMessage || {};

            each($validators, (validator, name) => {
                if((value || name == 'required') && props[name] && !validator(value, props[name])) {
                    $error[name] = validMessage[name] || '请检查输入';
                    $invalid = true;
                }
            });

            if($pending && !$invalid) {
                try{
                    props.asyncValidator(value)
                        .then(() => ({
                            $invalid: false,
                            $error: null
                        }))
                        .catch(e => ({
                            $invalid: true,
                            $error: {
                                asyncValidator: validMessage.asyncValidator || e.message
                            }
                        }))
                        .then(state => {
                            //确保返回结果对应的是当前输入
                            if(this.parseValue(this.$input) == value) {
                                this.triggerState({
                                    ...state,
                                    $pending: false
                                });
                            }
                        })
                } catch (e){
                    console.error(e)
                }

                $error = {asyncValidator: '正在验证...'}
            }

            return {
                $dirty,
                $touched,
                $invalid,
                $pending,
                $valid: !$invalid,
                $error: $invalid || $pending ? $error : null,

                $viewValue: value,
                $modelValue: $invalid ? null : value
            }
        }

        triggerState(state) {
            return new Promise(resolve => this.setState(state, () => {
                if(this.context.__easyformRender__) {
                    this.context.__easyformRender__()
                        .then(resolve);
                } else {
                    resolve();
                }
            }));
        }

        getErrorMsg(errKey) {
            const validMessage = this.props.validMessage || {};
            return validMessage[errKey] || '请检查输入';
        }

        /**
         * 设置验证状态
         * @param {string} key 错误key
         * @param {bool} 结果，true表示
         */
        setValidity(validationErrorKey, isValid) {
            const {$invalid, $error} = this.state;

            if($error) {
                delete $error[validationErrorKey];
            }

            const $newInvalid = Object.keys($error || {}).length > 0 || !isValid;

            this.triggerState({
                $invalid: $newInvalid,
                $valid: !$newInvalid,
                $error: $newInvalid ? Object.assign({}, $error, isValid ? {} : {
                    [validationErrorKey]: this.getErrorMsg(validationErrorKey)
                }) : null
            });
        }

        render() {
            return <WrappedComponent {...this.props} {...this.context} easyfield={this.state || {}} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur} __init__={this.initField} __destroy__={this.destroy} />
        }

        static propTypes = {
            validMessage: PropTypes.object,
            pattern: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(RegExp)])
        }

        static contextTypes = {
            __easyformRender__: PropTypes.func,
            __errorLevel__: PropTypes.number
        }
    }
}
