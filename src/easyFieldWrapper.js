import React, { Component } from 'react';
import PropTypes from 'prop-types';
import each from 'lodash/each';

export default function(WrappedComponent, config = {}) {
    return class FieldWrapper extends Component {
        state = {
            $valid: true,
            $invalid: false,
            $dirty: false,
            $touched: false,
            $focusing: false,
            $pending: false,
            $error: null,
            $viewValue: null,
            $modelValue: null
        }

        validatorHandlers = {
            required: value => !!value && value.length > 0,
            pattern: (value, pattern) => !pattern || (typeof pattern === 'function' ? pattern(value) : pattern.test(value)),
            confirm: (value, confirmed) => !confirmed || value === confirmed,
            minLength: (value, length) => value.length >= parseInt(length),
            maxLength: (value, length) => value.length <= parseInt(length),
            min: (value, minValue) => parseFloat(value) >= parseFloat(minValue),
            max: (value, maxValue) => parseFloat(value) <= parseFloat(maxValue)
        }

        /**
         * 节点引用回调
         */
        refCallback = input => {
            this.$input = input;
            if(!this.props.groupField && this.props.name) {
                this.context.$$register(this.props.name, input && this);
            }

            if(input) {
                if(typeof input.getValue !== 'function') {
                    throw new Error('The FieldWrappedComponent class must have a method named "getValue".');
                }

                this.getInputValue = input.getValue;

                //设置初始state
                this.updateState();
            } else {
                this.context.$$render();
            }
        }

        isEqual(oldValue, newValue) {
            const isRadio = this.props.type == 'radio';

            return !isRadio && oldValue === newValue;
        }

        /**
         * 事件处理
         * @param {String} type 事件名称
         */
        handleEvent = (_ev, typeName) => {
            const ev = {
                type: typeName || _ev.type,
                target: _ev.target
            };

            switch(ev.type) {
                case 'change':
                    const { onChange } = this.props;

                    if(this.props['data-groupField']) {
                        onChange &&
                            onChange(ev);
                    } else {
                        const value = this.getInputValue();
                        const { $modelValue } = this.state;

                        const newState = this.getNewState(value);

                        this.handleState({
                            ...newState,
                            $dirty: true
                        })
                            .then(() => {
                                if(this.isEqual($modelValue, newState.$modelValue) === false) {
                                    onChange &&
                                        onChange(ev);
                                }

                                //confirmed
                                const confirmedName = this.props.confirm || this.props.confirmed;
                                if(confirmedName && this.context.$$getControl(confirmedName)) {
                                    this.context.$$getControl(confirmedName).updateState();
                                }
                            });
                    }

                    break;
                case 'focus':
                case 'blur':
                    const isFocus = ev.type == 'focus';
                    const handler = this.props[ev.type == 'focus' ? 'onFocus' : 'onBlur'];
                    if(this.props['data-groupField']) {
                        handler &&
                                handler(ev);
                    } else {
                        this.handleState({
                            $focusing: isFocus,
                            $touched: this.state.$touched || isFocus
                        })
                        .then(() => {
                            handler &&
                                handler(ev);
                        });
                    }

                    break;
                default:
                    break;
            }
        }

        updateState() {
            this.handleState(this.getNewState(this.getInputValue()));
        }

        getNewState(value) {
            const props = this.props;

            let $error = {},
                $invalid = false,
                $pending = !!props.asyncValidator;

            each(this.validatorHandlers, (checker, type) => {
                const propValue = type == 'confirm' ?
                    this.context.$$getControl(props[type]) && this.context.$$getControl(props[type]).state.$modelValue :
                    props[type];

                if((name === 'required' || !$error.required) && props[type] && checker(value, propValue) === false) {
                    $error[type] = this.getErrorMsg(type);
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
                                asyncValidator: this.getErrorMsg('asyncValidator', e.message)
                            }
                        }))
                        .then(state => {
                            //确保返回结果对应的是当前输入
                            if(this.getInputValue() === value) {
                                this.handleState({
                                    ...state,
                                    $pending: false
                                });
                            }
                        })
                } catch (e){
                    console.error(e)
                }

                $error = {asyncValidator: this.context.$$config.defaultPendingMsg}
            }

            return {
                $invalid,
                $pending,
                $valid: !$invalid,
                $error: $invalid || $pending ? $error : null,

                $viewValue: value,
                $modelValue: $invalid ? null : value
            }
        }

        /**
         * 设置新state，返回promise，表单render后触发resolve
         * @param {Object} newState 新的状态对象
         *
         * @return {Promise}
         */
        handleState(newState) {
            if(!this.isUnmount) {
                return new Promise(resolve => this.setState(newState, () => {
                    if(this.context.$$render) {
                        this.context.$$render()
                            .then(resolve);
                    } else {
                        resolve();
                    }
                }));
            }
        }

        getErrorMsg(errKey, errMsg) {
            const validMessage = this.props.validMessage || {};
            return validMessage[errKey] || errMsg || this.context.$$config.defaultErrorMsg;
        }

         /**
         * 设置验证状态
         * @param {string} key 错误key
         * @param {bool} 结果，true表示
         */
        setValidity = (validationErrorKey, isValid) => {
            const {$error} = this.state;

            if($error) {
                delete $error[validationErrorKey];
            }

            const $newInvalid = Object.keys($error || {}).length > 0 || !isValid;

            this.handleState({
                $invalid: $newInvalid,
                $valid: !$newInvalid,
                $error: $newInvalid ? Object.assign({}, $error, isValid ? {} : {
                    [validationErrorKey]: this.getErrorMsg(validationErrorKey)
                }) : null
            });
        }

        componentWillUnmount() {
            this.isUnmount = true;
        }

        render() {
            const myProps = {
                ref: this.refCallback,
                $trigger: this.handleEvent,
                $errorLevel: this.context.$$config.errorLevel,
                easyfield: this.state || {}
            }
            return <WrappedComponent {...this.props} {...myProps} />
        }

        static propTypes = {
            validMessage: PropTypes.object,
            pattern: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(RegExp)])
        }

        static contextTypes = {
            $$render: PropTypes.func,
            $$register: PropTypes.func,
            $$config: PropTypes.object,
            $$getControl: PropTypes.func
        }
    }
}
