import React, { Component } from 'react';
import PropTypes from 'prop-types';
import each from 'lodash/each';

let formId = 0;

export default function(WrappedComponent, config = {}) {
    config = Object.assign({
        errorLevel: 1,
        defaultErrorMsg: 'Your input is incorrect.',
        defaultPendingMsg: 'Waiting...'
    }, config);

    /*!
     * @param {Number} errorLeve
     *    0: 关闭错误
     *    1: focus时显示
     *    2: 总是显示错误
     *
     *    默认是1
     */
    return class FormWrapper extends Component {
        state = {
            $valid: true,
            $invalid: false,
            $dirty: false,
            $touched: false,
            $focusing: false,
            $error: null,
            stateRefs: {},
            params: {}
        }

        latestUpdateTime = 0;
        INTERVAL = 20;
        formControls = {};
        formId = formId++;

        getChildContext() {
            return {
                $$render: this.formUpdate,
                $$register: this.register,
                $$config: config,
                $$getControl: name => this.formControls[name]
            }
        }

        /**
         * 注册表单项
         * @param {String} name 表单项名字
         * @param {Element} input 表单项
         */
        register = (name, input) => {
            if (input) {
                this.formControls[name] = input;
            } else {
                delete this.formControls[name];
            }
        }

        refCallback = input => {
            input &&
                this.state.easyform.init(this.formControls);
        }

        formUpdate = (times = 0) => {
            const now = Date.now();

            return this.renderHandlerPromise || (this.renderHandlerPromise = new Promise(resolve => {
                setTimeout(() => {
                    if (this.isUnmount) {
                        return;
                    }

                    this.latestUpdateTime = Date.now();
                    delete this.renderHandlerPromise;

                    this.setState(this.getNewState(), () => {
                        //如果是嵌套的表单，需要主动触发父级表单render
                        if (this.context.$$render && this.props.name) {
                            this.context.$$render()
                                .then(resolve);
                        } else {
                            resolve();
                        }
                    });
                }, Math.max(0, this.INTERVAL - now + this.latestUpdateTime));
            })).then(() => {
                if (this.isEqualState(this.getNewState(), this.state) === false && times < 10) {
                    this.formUpdate(++times);
                }
            });
        }

        isEqualState(newState, oldState) {
            if (newState === oldState) {
                return true;
            }

            if (typeof newState === 'object' && typeof oldState === 'object') {
                //键值数量不一致
                if (Object.keys(newState).length !== Object.keys(oldState).length) {
                    return false;
                }

                for (let key in oldState) {
                    if (oldState.hasOwnProperty(key)) {
                        const oldValue = oldState[key];
                        const newValue = newState[key];

                        if (this.isEqualState(newValue, oldValue) === false) {
                            return false;
                        }
                    }
                }

                return true;
            }

            return false;
        }

        getNewState() {
            let params = {},
                error = {},
                stateRefs = {},
                $invalid = false,
                $touched = false,
                $focusing = false,
                $dirty = false;

            let newState = {
                params,
                stateRefs
            };

            const process = refs => {
                each(refs, (ref, name) => {
                    if (ref.formControls) {
                        process(ref.formControls);
                    } else if (!ref.$input.props.disabled) {
                        let state = ref.state || {};
                        params[name] = state.$modelValue;

                        if (state.$invalid) {
                            error[name] = state.$error;
                        }

                        $invalid = state.$invalid || $invalid;
                        $touched = state.touched || $touched;
                        $focusing = state.$focusing || $focusing;
                        $dirty = state.$dirty || $dirty;

                        stateRefs[name] = state;
                    }
                });
            }

            process(this.formControls);

            newState.$error = $invalid ? error : null;
            newState.$valid = !$invalid;
            newState.$invalid = $invalid;
            newState.$dirty = $dirty;
            newState.$focusing = $focusing;
            newState.$touched = $touched;

            return newState;
        }

        componentWillUnmount() {
            this.isUnmount = true;
        }

        refCallback = input => this.props.name &&
            this.context.$$register &&
            this.context.$$register(this.props.name, this);

        render() {
            const easyform = {
                ...this.state,
                get: name => this.state.stateRefs[name] || {}
            }

            return <WrappedComponent {...this.props} easyform={easyform} params={this.state.params} ref={this.refCallback} />
        }

        static contextTypes = {
            $$render: PropTypes.func,
            $$register: PropTypes.func
        }

        static childContextTypes = {
            $$render: PropTypes.func,
            $$register: PropTypes.func,
            $$config: PropTypes.object,
            $$getControl: PropTypes.func
        }
    }
}
