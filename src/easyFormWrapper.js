import React, { Component, PropTypes } from 'react';
import each from 'lodash/each';

class EasyForm {
    constructor() {
        this.$valid = true;
        this.$invalid = false;
        this.$dirty = false;
        this.$touched = false;
        this.params = {};
        this.refs = {};

        this.stateRefs = {};
    }

    init(refs) {
        this.refs = refs;
    }

    update() {
        let errors = {};
        let params = {};
        let $invalid = false;
        let $touched = false;
        let $dirty = false;
        let stateRefs = {};

        const handler = refs => {
            each(refs, (ref, name) => {
                const state = ref.state || {};

                //这里循环处理下，遇到子easyform组件时
                if (state.easyform) {
                    handler(state.easyform.refs);
                } else {
                    params[name] = ref.state ? state.$modelValue : ref.value;

                    if (state.$invalid) {
                        errors[name] = state.$error;
                    }

                    $invalid = $invalid || state.$invalid;
                    $touched = $touched || state.touched;
                    $dirty = $dirty || state.$dirty;

                    stateRefs[name] = state;
                }
            });
        }

        handler(this.refs);

        this.params = params;
        this.$error = $invalid ? errors : null;
        this.$valid = !$invalid;
        this.$invalid = $invalid;
        this.$dirty = $dirty;
        this.$touched = $touched;

        this.stateRefs = stateRefs;

        return this;
    }

    get(name) {
        return this.stateRefs[name] || {}
    }
}

export default function(WrappedComponent, errorLevel = 1) {
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
            easyform: new EasyForm(),
            params: {}
        }

        latestUpdateTime = 0;
        INTERVAL = 20;

        getChildContext() {
            return {
                __easyformRender__: this.formUpdate,
                __errorLevel__: errorLevel
            }
        }

        formUpdate = () => {
            const now = Date.now();

            return this.renderHandlerPromise || (this.renderHandlerPromise = new Promise(resolve => {
                setTimeout(() => {
                    if (this.isUnmount) {
                        return;
                    }

                    this.latestUpdateTime = Date.now();
                    delete this.renderHandlerPromise;

                    const easyform = this.state.easyform.update();
                    this.setState({
                        easyform: easyform,
                        params: easyform.params
                    }, () => {
                        //如果是嵌套的表单，需要主动触发父级表单render
                        if (this.context.__easyformRender__) {
                            this.context.__easyformRender__()
                                .then(resolve);
                        } else {
                            resolve();
                        }
                    });
                }, Math.max(0, this.INTERVAL - now + this.latestUpdateTime));
            }));
        }

        componentWillUnmount() {
            this.isUnmount = true;
        }

        render() {
            return <WrappedComponent {...this.props} {...this.state} />
        }

        static contextTypes = {
            __easyformRender__: PropTypes.func
        }

        static childContextTypes = {
            __easyformRender__: PropTypes.func,
            __errorLevel__: PropTypes.number
        }
    }
}
